import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class MealPlan {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  createdAt: Date

  @Column()
  createdBy: string

  // "42-2024"
  @Column({unique: true})
  weekYear: string

  @Column()
  meals: (string | null)[]
}