import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ShoppingList } from './shopping-list'
import { ShopCategory } from './common-types'

@Entity()
export class ListItem {
  @PrimaryGeneratedColumn()
  id: number

  constructor(addedBy: string, name: string, category: ShopCategory, isStaple = false) {
    this.addedBy = addedBy
    this.createdAt = new Date()
    this.name = name
    this.isStaple = isStaple
    this.shopCategory = category
  }

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
}