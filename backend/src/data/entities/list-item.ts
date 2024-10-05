import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { ShoppingList } from './shopping-list'

@Entity()
export class ListItem {
  @PrimaryGeneratedColumn()
  id: number

  constructor(addedBy: string, name: string) {
    this.addedBy = addedBy
    this.createdAt = new Date()
    this.name = name
  }

  @Column()
  createdAt: Date

  @Column()
  addedBy: string

  @Column()
  name: string

  @ManyToOne(() => ShoppingList, shoppingList => shoppingList.items, {onDelete: 'CASCADE'})
  shoppingList: ShoppingList
}