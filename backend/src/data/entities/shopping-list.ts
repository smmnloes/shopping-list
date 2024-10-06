import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ListItem } from './list-item'

@Entity()
export class ShoppingList {
  @PrimaryGeneratedColumn()
  id: number

  constructor(createdBy: string, initialItems: ListItem[]) {
    this.createdBy = createdBy
    this.createdAt = new Date()
    this.items = initialItems
  }

  @Column()
  createdAt: Date

  @Column()
  createdBy: string

  @Column()
  completed: boolean = false

  @ManyToMany(() => ListItem, item => item.shoppingLists, {eager: true, cascade: ['insert'] })
  @JoinTable()
  items: ListItem[]
}