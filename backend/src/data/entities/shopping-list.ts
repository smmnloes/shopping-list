import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ListItem } from './list-item'
import type { ShopCategory } from '../../../../shared/types/shopping'

@Entity()
export class ShoppingList {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  createdAt: Date
  @Column()
  createdBy: string
  @Column()
  shopCategory: ShopCategory
  @ManyToMany(() => ListItem, item => item.shoppingLists, { eager: true, cascade: [ 'insert' ] })
  @JoinTable()
  items: ListItem[]

  constructor(createdBy: string, category: ShopCategory, initialItems: ListItem[]) {
    this.createdBy = createdBy
    this.createdAt = new Date()
    this.shopCategory = category
    this.items = initialItems
  }
}