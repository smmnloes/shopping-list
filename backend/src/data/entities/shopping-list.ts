import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ListItem } from './list-item'

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

  @OneToMany(() => ListItem, item => item.shoppingList, {eager: true, cascade: true })
  items?: ListItem[]
}