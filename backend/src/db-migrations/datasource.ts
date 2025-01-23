import { DataSource } from 'typeorm'
import * as dotenv from 'dotenv'
import path from 'path'
import { entities } from '../data/database.module'

const processPath = path.resolve(process.cwd())
dotenv.config({ path: [ path.join(processPath, `.env.${ process.env.NODE_ENV }`), path.join(processPath, '.env') ] })

export default new DataSource({
  type: 'sqlite',
  database: process.env.DATABASE_PATH,
  entities,
  migrations: [ path.join(__dirname, 'migrations', '*.ts') ],
  synchronize: false
})