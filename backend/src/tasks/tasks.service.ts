import { Inject, Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { ConfigService } from '@nestjs/config'
import path from 'path'
import fs from 'fs/promises'
import { format } from 'date-fns'
import { DeleteObjectsCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'


@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name)
  private readonly s3Client = new S3Client({ region: 'eu-central-1' })

  constructor(@Inject() readonly configService: ConfigService) {
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async backupDatabase() {
    this.logger.log('Starting db backup process')
    const backupBucketName = this.configService.get('BACKUP_BUCKET')
    const backupsPrefix = 'shopping-db-backups/'

    await this.uploadBackup(backupBucketName, backupsPrefix)
    await this.cleanupOldBackups(backupBucketName, backupsPrefix)
  }

  private async uploadBackup(backupBucketName: string, backupsPrefix: string) {
    const dbPath = this.configService.get('DATABASE_PATH')
    const absolutePath = path.resolve(dbPath)
    const backupFileName = format(new Date(), 'yyyy-MM-dd-HH-mm-ss')

    await this.s3Client.send(new PutObjectCommand({
      Bucket: backupBucketName,
      Body: await fs.readFile(absolutePath),
      Key: backupsPrefix + backupFileName
    }))
  }

  private async cleanupOldBackups(backupBucketName: string, backupsPrefix: string) {
    // only keep the last 7 backups
    this.logger.log('Deleting all backups but the last 7')
    const allBackups = await this.s3Client.send(new ListObjectsV2Command({
      Bucket: backupBucketName,
      Prefix: backupsPrefix
    })).then(response => response.Contents)
    const toDelete = [ ...allBackups ].sort((a, b) => a.LastModified.getTime() - b.LastModified.getTime()).slice(0, -7)
    if (toDelete.length === 0) {
      this.logger.log('Nothing to delete, returning')
      return
    }

    this.logger.log('Deleting objects: ', toDelete.map(object => object.Key))
    const result = await this.s3Client.send(new DeleteObjectsCommand({
      Bucket: backupBucketName,
      Delete: { Objects: toDelete.map(({ Key }) => ({ Key })) }
    }))
    this.logger.log('Deletion result:', result.Deleted.map(d => d.Key))
  }
}
