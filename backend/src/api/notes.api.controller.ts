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
import type { NoteDetails, NoteOverview, UserPermission } from '../../../shared/types/notes'

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
          notes: results.filter(note => !note.deleted && this.getUserPermissions(note, req.user).includes('VIEW'))
            .map(note => {
            note.content = note.encrypted ? this.userKeyService.decryptData(note.content, req.user.userDataKey) : note.content
            return note
          }).map(transformNoteToOverview)
        }))
  }


  @UseGuards(JwtAuthGuard)
  @Get('notes/:id')
  async getNote(@Param('id', ParseIntPipe) id: number, @Request() req: ExtendedJWTGuardRequest<void>): Promise<NoteDetails> {
    const note = await this.notesRepository.findOneOrFail({ where: { id, deleted: false } })
    this.assertUserPermission(note, req.user, 'VIEW')
    const content = note.encrypted ? this.userKeyService.decryptData(note.content, req.user.userDataKey) : note.content
    return {
      id: note.id, content, publiclyVisible: note.publiclyVisible, permissions: this.getUserPermissions(note, req.user)
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('notes')
  async createNote(@Request() { body: {}, user: { id } }: ExtendedJWTGuardRequest<any>): Promise<{ id: number }> {
    const user = await this.userRepository.findOneOrFail({ where: { id } })
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
    this.assertUserPermission(note, req.user, 'EDIT')
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
    this.assertUserPermission(note, req.user, 'DELETE')
    note.deleted = true
    await this.notesRepository.save(note)
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


  private assertUserPermission(note: Note, user: UserInformation, permission: UserPermission) {
    if (!this.getUserPermissions(note, user).includes(permission)) {
      throw new UnauthorizedException('User has no access')
    }
  }

  private getUserPermissions(note: Note, user: UserInformation): UserPermission[] {
    const permissions: UserPermission[] = []
    if (note.publiclyVisible) {
      permissions.push('EDIT', 'DELETE', 'VIEW')
    }

    if (note.createdBy.id === user.id) {
      permissions.push('EDIT', 'DELETE', 'VIEW', 'CHANGE_VISIBILITY')
    }

    return permissions
  }

}
