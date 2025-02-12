import { Controller, Get, Inject, Param, Post, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { JwtAuthGuard } from '../auth/guards/jwt.guard'
import { User } from '../data/entities/user'
import { ExtendedJWTGuardRequest } from '../util/request-types'
import { FileInterceptor } from '@nestjs/platform-express'
import { readdir, writeFile, access, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { ShareInfo, ShareOverview } from '../../../shared/types/files'
import { FileShare } from '../data/entities/file-share'
import { PassphraseGenerator } from './services/passphrase-generator/passphrase-generator'


const STORAGE_DIR = 'uploaded-files'

@Controller('api')
export class FileSharesApiController {

  constructor(
    @InjectRepository(User) readonly userRepository: Repository<User>,
    @InjectRepository(FileShare) readonly fileShareRepository: Repository<FileShare>,
    @Inject() readonly passPhraseGenerator: PassphraseGenerator
  ) {
  }

  @UseGuards(JwtAuthGuard)
  @Post('fileshares/:shareId')
  @UseInterceptors(
    FileInterceptor('file'),
  )
  async uploadFile(@Param('shareId') shareId: string, @UploadedFile() file: Express.Multer.File): Promise<void> {
    const shareStorageDir = resolve(STORAGE_DIR, shareId)
    // create share folder if not exists
    await access(shareStorageDir).catch(_ => mkdir(shareStorageDir))
    await writeFile(resolve(shareStorageDir, file.originalname), file.buffer)
  }


  @UseGuards(JwtAuthGuard)
  @Get('fileshares/:shareId')
  async getShareInfo(@Param('shareId') shareId: string): Promise<{ shareInfo: ShareInfo }> {
    const share = await this.fileShareRepository.findOneOrFail({ where: { shareId } })
    const shareStorageDir = resolve(STORAGE_DIR, share.shareId)
    const fileNames: string[] = await readdir(shareStorageDir).catch(e => {
      if (e.code === 'ENOENT'){
        console.log('No uploaded files yet')
        return []
      }
      throw e
    })
    return {
      shareInfo: {
        description: share.description,
        files: fileNames.map(file => ({ name: file })),
        shareLink: 'link'
      }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('fileshares')
  async getAllShares(@Param('shareId') shareId: string): Promise<{ shares: ShareOverview[] }> {
    return this.fileShareRepository.find().then(result => ({
      shares: result.map(share => ({
        id: share.shareId,
        description: share.description,
        createdBy: share.createdBy.name
      }))
    }))
  }


  @UseGuards(JwtAuthGuard)
  @Post('fileshares')
  async createNewShare(@Request() req: ExtendedJWTGuardRequest<void>): Promise<{ id: string }> {
    const creatingUser = await this.userRepository.findOneOrFail({ where: { id: req.user.id } })
    const newShare = new FileShare(creatingUser)
    newShare.code = await this.passPhraseGenerator.generate()
    newShare.shareId = crypto.randomUUID()
    await this.fileShareRepository.save(newShare)
    return { id: newShare.shareId }
  }
}


