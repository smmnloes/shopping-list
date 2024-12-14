import { DataSource } from 'typeorm'
import { ShoppingList } from '../data/entities/shopping-list'
import { ListItem } from '../data/entities/list-item'
import { MealPlan } from '../data/entities/meal-plan'
import { Note } from '../data/entities/note'
import { User } from '../data/entities/user'
import * as dotenv from 'dotenv'
import path from 'path'

const processPath = path.resolve(process.cwd())
dotenv.config({ path: [ path.join(processPath, `.env.${ process.env.NODE_ENV }`), path.join(processPath, '.env') ] })

export default new DataSource({
  type: 'sqlite',
  database: process.env.DATABASE_PATH,
  entities: [ ShoppingList, ListItem, MealPlan, Note, User ],
  migrations: [ path.join(__dirname, 'migrations', '*.ts') ],
  synchronize: false
})