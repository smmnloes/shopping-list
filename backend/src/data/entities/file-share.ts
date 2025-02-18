import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user'

@Entity()
export class FileShare {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  createdAt: Date
  @Column()
  shareId: string
  @ManyToOne(() => User, { eager: true })
  createdBy: User
  @Column({ unique: true })
  code: string
  @Column()
  description: string


  constructor(createdBy: User) {
    this.createdBy = createdBy
    this.createdAt = new Date()
    this.description = 'Neue Freigabe'
  }
}