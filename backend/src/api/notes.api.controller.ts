import {
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt.guard'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { ExtendedJWTGuardRequest } from '../util/request-types'
import { Note } from '../data/entities/note'
import { transformNoteToOverview } from './transformers/note-transformers'
import { User } from '../data/entities/user'
import { UserInformation } from '../auth/auth.service'
import { UserKeyService } from '../data/crypto/user-key-service'

@Controller('api')
export class NotesApiController {
  constructor(
    @InjectRepository(Note) readonly notesRepository: Repository<Note>,
    @InjectRepository(User) readonly userRepository: Repository<User>,
    @Inject() readonly userKeyService: UserKeyService
  ) {
  }

  @UseGuards(JwtAuthGuard)
  @Get('notes')
  async getAllNotes(@Request() req: ExtendedJWTGuardRequest<void>): Promise<{ notes: NoteOverview[] }> {
    return this.notesRepository.find()
      .then(results =>
        ({
          notes: results.filter(note => this.hasUserReadAccess(note, req.user)).map(note => {
            note.content = note.encrypted ? this.userKeyService.decryptData(note.content, req.user.userDataKey) : note.content
            return note
          }).map(transformNoteToOverview)
        }))
  }


  @UseGuards(JwtAuthGuard)
  @Get('notes/:id')
  async getNote(@Param('id', ParseIntPipe) id: number, @Request() req: ExtendedJWTGuardRequest<void>): Promise<NoteDetails> {
    const note = await this.notesRepository.findOneOrFail({ where: { id } })
    this.assertUserReadAccess(note, req.user)
    const content = note.encrypted ? this.userKeyService.decryptData(note.content, req.user.userDataKey) : note.content
    return {
      id: note.id, content, publiclyVisible: note.publiclyVisible, permissions: {
        delete: this.hasUserWriteAccess(note, req.user),
        changeVisibility: this.hasUserWriteAccess(note, req.user)
      }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('notes')
  async createNote(@Request() { body: {}, user: { id } }: ExtendedJWTGuardRequest<any>): Promise<{ id: number }> {
    const user = await this.userRepository.findOneOrFail({ where: { id } })
    // We are not encrypting newly created notes, because the content is empty
    const newNote = new Note(user, true, false)
    return this.notesRepository.save(newNote).then(({ id }) => ({ id }))
  }

  @UseGuards(JwtAuthGuard)
  @Post('notes/:id')
  async saveNote(@Param('id', ParseIntPipe) noteId: number, @Request() req: ExtendedJWTGuardRequest<{
    content: string
  }>): Promise<void> {
    const user = await this.userRepository.findOneOrFail({ where: { id: req.user.id } })
    const note = await this.notesRepository.findOneOrFail({ where: { id: noteId } })
    this.assertUserReadAccess(note, req.user)
    let newContent = req.body.content
    note.content = note.encrypted ? this.userKeyService.encryptData(newContent, req.user.userDataKey) : newContent
    note.lastUpdatedBy = user
    note.lastUpdatedAt = new Date()
    await this.notesRepository.save(note)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('notes/:id')
  async deleteNote(@Param('id', ParseIntPipe) id: number, @Request() req: ExtendedJWTGuardRequest<void>): Promise<void> {
    const note = await this.notesRepository.findOneOrFail({ where: { id } })
    this.assertUserWriteAccess(note, req.user)
    await this.notesRepository.delete(id)
  }

  @UseGuards(JwtAuthGuard)
  @Post('notes/:id/visibility')
  async setNoteVisibility(@Param('id', ParseIntPipe) noteId: number, @Request() {
    body: { visible },
    user: { id: userId, userDataKey }
  }: ExtendedJWTGuardRequest<{
    visible: boolean
  }>): Promise<void> {
    const note = await this.notesRepository.findOneOrFail({ where: { id: noteId } })
    if (userId !== note.createdBy.id) {
      throw new UnauthorizedException('Only the user that created the note can change the visibility')
    }
    if (note.publiclyVisible !== visible) {
      if (visible) {
        note.content = this.userKeyService.decryptData(note.content, userDataKey)
        note.encrypted = false
      } else {
        note.content = this.userKeyService.encryptData(note.content, userDataKey)
        note.encrypted = true
      }
    }

    note.publiclyVisible = visible
    await this.notesRepository.save(note)
  }

  private assertUserReadAccess(note: Note, user: UserInformation) {
    if (!this.hasUserReadAccess(note, user)) {
      throw new UnauthorizedException('User has no read access')
    }
  }

  private hasUserReadAccess(note: Note, user: UserInformation): boolean {
    return (note.createdBy.id === user.id) || note.publiclyVisible
  }

  private assertUserWriteAccess(note: Note, user: UserInformation) {
    if (!this.hasUserWriteAccess(note, user)) {
      throw new UnauthorizedException('User has no write access')
    }
  }

  private hasUserWriteAccess(note: Note, user: UserInformation): boolean {
    return (note.createdBy.id === user.id)
  }
}


export type NoteOverview = Pick<Note, 'id' | 'createdAt' | 'lastUpdatedAt' | 'publiclyVisible'> & {
  title: string
  createdBy: string
  lastUpdatedBy: string
}
export type NoteDetails = Pick<Note, 'id' | 'content' | 'publiclyVisible'> & {
  permissions: { delete: boolean, changeVisibility: boolean }
}
