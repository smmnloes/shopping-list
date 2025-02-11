import { Controller, Get, Post, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { JwtAuthGuard } from '../auth/guards/jwt.guard'
import { User } from '../data/entities/user'
import { ExtendedJWTGuardRequest } from '../util/request-types'
import { FileInterceptor } from '@nestjs/platform-express'
import { readdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { SharedFileList } from '../../../shared/types/files'


const STORAGE_DIR = resolve(__dirname, '..', '..', 'uploaded-files')

@Controller('api')
export class FilesApiController {

  constructor(
    @InjectRepository(User) readonly userRepository: Repository<User>,
  ) {
  }

  @UseGuards(JwtAuthGuard)
  @Post('files')
  @UseInterceptors(
    FileInterceptor('file'),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Request() req: ExtendedJWTGuardRequest<void>): Promise<void> {
    await writeFile(resolve(STORAGE_DIR, file.originalname), file.buffer)
  }


  @UseGuards(JwtAuthGuard)
  @Get('files')
  async getFiles(): Promise<{ files: SharedFileList }> {
    return readdir(STORAGE_DIR).then(result => result.map(file => ({ name: file }))).then(files => ({ files }))
  }
}


