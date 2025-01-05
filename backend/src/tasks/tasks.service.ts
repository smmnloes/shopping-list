import { Inject, Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { ConfigService } from '@nestjs/config'
import path from 'path'
import fs from 'fs/promises'
import { format } from 'date-fns'


@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name)

  constructor(@Inject() readonly configService: ConfigService) {
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async backupDatabase() {
    this.logger.log('Starting db backup process')
    const dbPath = this.configService.get('DATABASE_PATH')
    const absolutePath = path.resolve(dbPath)
    const dbDirectoryPath = path.dirname(absolutePath)
    const backupsPath = path.resolve(dbDirectoryPath, 'backups')

    this.logger.log(`Ensuring db backup directory ${ backupsPath } exists`)
    await fs.mkdir(backupsPath).catch(e => {
      if (e?.code !== 'EEXIST') throw e
    })
    const backupFileName = 'db-backup-' + format(new Date(), 'yyyy-MM-dd-HH-mm-ss')
    await fs.copyFile(absolutePath, path.resolve(backupsPath, backupFileName))

    // only keep the last 7 backups
    this.logger.log('Deleting all backups but the last 7')
    const backupsToDelete = await fs.readdir(backupsPath).then(files => files.map(filename => path.resolve(backupsPath, filename)).slice(0, -7))
    this.logger.log('Deleting files: ', backupsToDelete)
    const result = await Promise.allSettled(backupsToDelete.map(backup => fs.rm(backup)))
    this.logger.log('Deletion result:', result)
  }
}