import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user'

@Entity()
export class TakeoutPayment {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  createdAt: Date
  @ManyToOne(() => User, { eager: true })
  createdBy: User

  constructor(createdBy: User) {
    this.createdAt = new Date()
    this.createdBy = createdBy
  }
}