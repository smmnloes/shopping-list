import { Controller, Post, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { JwtAuthGuard } from '../auth/guards/jwt.guard'
import { User } from '../data/entities/user'
import { ExtendedJWTGuardRequest } from '../util/request-types'
import { FileInterceptor } from '@nestjs/platform-express'
import {writeFile} from 'node:fs/promises'
import {resolve} from 'node:path'

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
    await writeFile(resolve(__dirname, '..', '..', 'uploaded-files', file.originalname), file.buffer)
  }


}
