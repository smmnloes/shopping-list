import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class ShoppingList {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  createdAt: Date

  @Column()
  createdBy: string

  @Column()
  completed: boolean = false

  @Column('simple-array')
  items: string[]
}