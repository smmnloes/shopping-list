import { Injectable } from '@nestjs/common'
import fs, { createReadStream, createWriteStream, ReadStream } from 'node:fs'
import { basename, join } from 'node:path'
import os from 'node:os'
import archiver from 'archiver'
import { randomUUID } from 'node:crypto'


@Injectable()
export class ArchiveService {
  public async archive(filePaths: string[]): Promise<ReadStream> {
    return new Promise((resolve, reject) => {
      console.time()
      let archivePath = join(os.tmpdir(), randomUUID())
      const output = createWriteStream(archivePath)
      const archive = archiver('zip', {
        zlib: { level: 9 }
      })
      archive.pipe(output)

      output.on('close', function () {
        console.log(archive.pointer() + ' total bytes')
        console.log('archiver has been finalized and the output file descriptor has closed.')
        console.timeEnd()
        resolve(createReadStream(archivePath))
      })

      archive.on('error', function (err) {
        reject(err)
      })

      for (const filePath of filePaths) {
        archive.append(fs.createReadStream(filePath), { name: basename(filePath) })
      }

      archive.finalize()
    })

  }
}