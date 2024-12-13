import { Controller, Delete, Get, Param, ParseIntPipe, Post, Request, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt.guard'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { ExtendedRequest } from '../util/request-types'
import { Note } from '../data/entities/note'
import { transformNoteToOverview } from './transformers/note-transformers'
import { User } from '../data/entities/user'

@Controller('api')
export class NotesApiController {
  constructor(
    @InjectRepository(Note) readonly notesRepository: Repository<Note>,
    @InjectRepository(User) readonly userRepository: Repository<User>
  ) {
  }


  @UseGuards(JwtAuthGuard)
  @Get('notes')
  async getAllNotes(): Promise<{ notes: NoteOverview[] }> {
    return this. notesRepository.find().then(results => ({ notes: results.map(transformNoteToOverview) }))
  }

  @UseGuards(JwtAuthGuard)
  @Get('notes/:id')
  async getNote(@Param('id', ParseIntPipe) id: number): Promise<Note> {
    return this.notesRepository.findOneOrFail({ where: { id } })
  }

  @UseGuards(JwtAuthGuard)
  @Post('notes')
  async createNote(@Request() { body: {}, user: { id } }: ExtendedRequest<any>): Promise<{ id: number }> {
    const user = await this.userRepository.findOneOrFail({ where: { id } })
    return this.notesRepository.save(new Note(user)).then(({ id }) => ({ id }))
  }

  @UseGuards(JwtAuthGuard)
  @Post('notes/:id')
  async saveNote(@Param('id', ParseIntPipe) noteId: number, @Request() {
    body: { content },
    user: { id: userId }
  }: ExtendedRequest<{
    content: string
  }>): Promise<void> {
    const user = await this.userRepository.findOneOrFail({ where: { id: userId } })
    await this.notesRepository.update(noteId, { content, lastUpdatedBy: user, lastUpdatedAt: new Date() })
  }

  @UseGuards(JwtAuthGuard)
  @Delete('notes/:id')
  async deleteNote(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.notesRepository.delete(id)
  }

}


export type NoteOverview = {
  id: number
  title: string
  createdAt: Date
  lastUpdatedAt: Date
  lastUpdatedBy: string
  createdBy: string
}