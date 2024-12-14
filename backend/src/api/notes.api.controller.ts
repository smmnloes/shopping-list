import {
  Controller,
  Delete,
  Get,
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
import { ExtendedRequest } from '../util/request-types'
import { Note } from '../data/entities/note'
import { transformNoteToOverview } from './transformers/note-transformers'
import { User } from '../data/entities/user'
import { UserInformation } from '../auth/auth.service'

@Controller('api')
export class NotesApiController {
  constructor(
    @InjectRepository(Note) readonly notesRepository: Repository<Note>,
    @InjectRepository(User) readonly userRepository: Repository<User>
  ) {
  }

  @UseGuards(JwtAuthGuard)
  @Get('notes')
  async getAllNotes(@Request() req: ExtendedRequest<void>): Promise<{ notes: NoteOverview[] }> {
    return this.notesRepository.find()
      .then(results => results.filter(note => this.hasUserReadAccess(note, req.user)))
      .then(results => ({ notes: results.map(transformNoteToOverview) }))
  }


  @UseGuards(JwtAuthGuard)
  @Get('notes/:id')
  async getNote(@Param('id', ParseIntPipe) id: number, @Request() req: ExtendedRequest<void>): Promise<NoteDetails> {
    const note = await this.notesRepository.findOneOrFail({ where: { id } })
    this.assertUserReadAccess(note, req.user)
    return {
      id: note.id, content: note.content, publiclyVisible: note.publiclyVisible, permissions: {
        delete: this.hasUserWriteAccess(note, req.user),
        changeVisibility: this.hasUserWriteAccess(note, req.user)
      }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('notes')
  async createNote(@Request() { body: {}, user: { id } }: ExtendedRequest<any>): Promise<{ id: number }> {
    const user = await this.userRepository.findOneOrFail({ where: { id } })
    return this.notesRepository.save(new Note(user)).then(({ id }) => ({ id }))
  }

  @UseGuards(JwtAuthGuard)
  @Post('notes/:id')
  async saveNote(@Param('id', ParseIntPipe) noteId: number, @Request() req: ExtendedRequest<{
    content: string
  }>): Promise<void> {
    const user = await this.userRepository.findOneOrFail({ where: { id: req.user.id } })
    const note = await this.notesRepository.findOneOrFail({ where: { id: noteId } })
    this.assertUserReadAccess(note, req.user)
    note.content = req.body.content
    note.lastUpdatedBy = user
    note.lastUpdatedAt = new Date()
    await this.notesRepository.save(note)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('notes/:id')
  async deleteNote(@Param('id', ParseIntPipe) id: number, @Request() req: ExtendedRequest<void>): Promise<void> {
    const note = await this.notesRepository.findOneOrFail({ where: { id } })
    this.assertUserWriteAccess(note, req.user)
    await this.notesRepository.delete(id)
  }

  @UseGuards(JwtAuthGuard)
  @Post('notes/:id/visibility')
  async setNoteVisibility(@Param('id', ParseIntPipe) noteId: number, @Request() {
    body: { visible },
    user: { id: userId }
  }: ExtendedRequest<{
    visible: boolean
  }>): Promise<void> {
    const note = await this.notesRepository.findOneOrFail({ where: { id: noteId } })
    if (userId !== note.createdBy.id) {
      throw new UnauthorizedException('Only the user that created the note can change the visibility')
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
