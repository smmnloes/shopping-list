import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { BooleanArrayTransformer } from '../transformers/boolean-array-transformer'

@Entity()
export class MealPlan {

  @PrimaryGeneratedColumn()
  id: number
  @Column()
  lastUpdatedAt: Date
  @Column()
  createdBy: string
  // "42-2024"
  @Column({ unique: true })
  weekYear: string
  @Column({ type: 'simple-array' })
  meals: string[]
  @Column({ type: 'text', transformer: new BooleanArrayTransformer() })
  checks: boolean[]

  constructor(createdBy: string, weekYear: string, meals: string[], checks: boolean[]) {
    this.createdBy = createdBy
    this.weekYear = weekYear
    this.meals = meals
    this.checks = checks
    this.lastUpdatedAt = new Date()
  }
}