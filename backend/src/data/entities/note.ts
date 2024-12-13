import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user'

@Entity()
export class Note {

  @PrimaryGeneratedColumn()
  id: number
  @Column()
  createdAt: Date
  @Column()
  lastUpdatedAt: Date
  @ManyToOne(() => User, { eager: true })
  lastUpdatedBy: User
  @ManyToOne(() => User, { eager: true })
  createdBy: User
  @Column()
  content: string

  constructor(createdBy: User) {
    this.createdBy = createdBy
    this.createdAt = new Date()
    this.lastUpdatedAt = this.createdAt
    this.lastUpdatedBy = createdBy
    this.content = ''
  }
}