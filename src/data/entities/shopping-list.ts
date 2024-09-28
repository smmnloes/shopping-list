import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class ShoppingList {
  @PrimaryGeneratedColumn()
  id: number

  constructor(createdBy: string) {
    this.createdBy = createdBy
    this.createdAt = new Date()
  }

  @Column()
  createdAt: Date

  @Column()
  createdBy: string

  @Column()
  completed: boolean = false

  @Column('simple-json')
  items: string[] = []
}