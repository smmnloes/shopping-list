import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class MealPlan {

  constructor(createdBy: string, weekYear: string, meals: string[]) {
    this.createdBy = createdBy
    this.weekYear = weekYear
    this.meals = meals
    this.lastUpdatedAt = new Date()
  }

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  lastUpdatedAt: Date

  @Column()
  createdBy: string

  // "42-2024"
  @Column({unique: true})
  weekYear: string

  @Column({type: 'simple-array'})
  meals: (string | null)[]
}