import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ListItem } from './list-item'
import { ShopCategory } from './common-types'

@Entity()
export class ShoppingList {
  @PrimaryGeneratedColumn()
  id: number

  constructor(createdBy: string, category: ShopCategory, initialItems: ListItem[]) {
    this.createdBy = createdBy
    this.createdAt = new Date()
    this.shopCategory = category
    this.items = initialItems
  }

  @Column()
  createdAt: Date

  @Column()
  createdBy: string

  @Column()
  shopCategory: ShopCategory

  @ManyToMany(() => ListItem, item => item.shoppingLists, {eager: true, cascade: [ 'insert' ]})
  @JoinTable()
  items: ListItem[]
}