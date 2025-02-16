import {
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Request,
  StreamableFile,
  UnauthorizedException,
  UploadedFiles,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { JwtAuthGuard } from '../auth/guards/jwt.guard'
import { User } from '../data/entities/user'
import { ExtendedJWTGuardRequest } from '../util/request-types'
import { FilesInterceptor } from '@nestjs/platform-express'
import { access, mkdir, readdir, rm, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { ShareInfo, ShareInfoPublic, ShareOverview } from '../../../shared/types/files'
import { FileShare } from '../data/entities/file-share'
import { PassphraseGenerator } from './services/passphrase-generator/passphrase-generator'
import merge from 'lodash.merge'
import { ConfigService } from '@nestjs/config'
import { createReadStream } from 'node:fs'

const STORAGE_DIR = 'uploaded-files'

@Controller('api')
export class FileSharesApiController {

  constructor(
    @InjectRepository(User) readonly userRepository: Repository<User>,
    @InjectRepository(FileShare) readonly fileShareRepository: Repository<FileShare>,
    @Inject() readonly passPhraseGenerator: PassphraseGenerator,
    @Inject() readonly configService: ConfigService
  ) {
  }

  @UseGuards(JwtAuthGuard)
  @Post('fileshares/:shareId')
  @UseInterceptors(
    FilesInterceptor('files'),
  )
  async uploadFile(@Param('shareId') shareId: string, @UploadedFiles() files: Array<Express.Multer.File>): Promise<void> {
    const shareStorageDir = resolve(STORAGE_DIR, shareId)
    // create share folder if not exists
    await access(shareStorageDir).catch(_ => mkdir(shareStorageDir))
    await Promise.all(files.map(file => writeFile(resolve(shareStorageDir, file.originalname), file.buffer)))
  }

  @UseGuards(JwtAuthGuard)
  @Delete('fileshares/:shareId/:filename')
  async deleteFile(@Param('shareId') shareId: string, @Param('filename') filename: string): Promise<void> {
    const shareStorageDir = resolve(STORAGE_DIR, shareId)
    await rm(resolve(shareStorageDir, filename)).catch(e => console.log('Could not remove file', e.message))
  }

  @UseGuards(JwtAuthGuard)
  @Delete('fileshares/:shareId')
  async deleteShare(@Param('shareId') shareId: string): Promise<void> {
    const shareStorageDir = resolve(STORAGE_DIR, shareId)
    await rm(shareStorageDir, {
      recursive: true,
      force: true
    }).catch(e => console.log('Could not remove share storage dir', e.message))
    await this.fileShareRepository.delete({ shareId })
  }


  @UseGuards(JwtAuthGuard)
  @Get('fileshares/:shareId')
  async getShareInfo(@Param('shareId') shareId: string): Promise<{ shareInfo: ShareInfo }> {
    const share = await this.fileShareRepository.findOneOrFail({ where: { shareId } })

    const files = await this.getFileListForShare(share.shareId)

    const shareBaseUrl = this.configService.get<string>('FILE_SHARE_PUBLIC_URL')
    const shareLink = `${ shareBaseUrl }/${ share.code }`

    return {
      shareInfo: {
        description: share.description,
        files,
        shareLink
      }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('fileshares/:shareId')
  async updateShareInfo(@Param('shareId') shareId: string, @Request() req: ExtendedJWTGuardRequest<Partial<ShareInfo>>): Promise<void> {
    const share = await this.fileShareRepository.findOneOrFail({ where: { shareId } })
    const merged = merge(share, req.body)
    await this.fileShareRepository.save(merged)
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


  @UseGuards(JwtAuthGuard)
  @Get('fileshares-public')
  async getShareInfoPublic(@Query('shareCode') shareCode: string): Promise<ShareInfoPublic> {
    const { description, createdBy, shareId } = await this.validateShareCode(shareCode)
    return {
      description,
      sharedByUserName: createdBy.name,
      files: await this.getFileListForShare(shareId)
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('fileshares-public/download')
  async downloadFile(@Query('shareCode') shareCode: string, @Query('fileName') fileName: string): Promise<StreamableFile> {
    const { shareId } = await this.validateShareCode(shareCode)
    const filePath = resolve(STORAGE_DIR, shareId, fileName)

    // res.setHeader('Content-Disposition', `attachment; filename=${fileName};`)
    // res.setHeader('Content-Type', 'application/octet-stream')

    const file = createReadStream(filePath);
    return new StreamableFile(file, {disposition:`attachment; filename="${fileName}"`});
  }

  private async validateShareCode(shareCode: string): Promise<FileShare> {
    if (!shareCode) {
      throw new UnauthorizedException('No code in the link')
    }
    const share = await this.fileShareRepository.findOne({ where: { code: shareCode } })
    if (!share) {
      throw new NotFoundException('Requested file share was not found')
    }
    return share
  }

  private async getFileListForShare(shareId: string): Promise<{ name: string }[]> {
    const shareStorageDir = resolve(STORAGE_DIR, shareId)
    const fileNames: string[] = await readdir(shareStorageDir).catch(e => {
      if (e.code === 'ENOENT') {
        console.log('No uploaded files yet')
        return []
      }
      throw e
    })
    return fileNames.map(filename => ({ name: filename }))
  }
}


