import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ShoppingList } from './shopping-list'
import type {  ShopCategory } from '../../../../shared/types/shopping'

@Entity()
export class ListItem {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  createdAt: Date
  @Column()
  addedBy: string
  @Column()
  name: string
  @Column()
  isStaple: boolean = false
  @Column()
  shopCategory: ShopCategory
  @ManyToMany(() => ShoppingList, shoppingList => shoppingList.items)
  shoppingLists: ShoppingList[]

  constructor(addedBy: string, name: string, category: ShopCategory, isStaple = false) {
    this.addedBy = addedBy
    this.createdAt = new Date()
    this.name = name
    this.isStaple = isStaple
    this.shopCategory = category
  }
}