import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ShoppingList } from './shopping-list'

@Entity()
export class ListItem {
  @PrimaryGeneratedColumn()
  id: number

  constructor(addedBy: string, name: string, isStaple = false) {
    this.addedBy = addedBy
    this.createdAt = new Date()
    this.name = name
    this.isStaple = isStaple
  }

  @Column()
  createdAt: Date

  @Column()
  addedBy: string

  @Column()
  name: string

  @Column()
  isStaple: boolean = false

  @ManyToMany(() => ShoppingList, shoppingList => shoppingList.items)
  shoppingLists: ShoppingList[]
}