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

  @Column()
  publiclyVisible: boolean

  @Column({default: false})
  encrypted: boolean

  constructor(createdBy: User, publiclyVisible: boolean, encrypted: boolean) {
    this.createdBy = createdBy
    this.createdAt = new Date()
    this.lastUpdatedAt = this.createdAt
    this.lastUpdatedBy = createdBy
    this.content = ''
    this.publiclyVisible = publiclyVisible
    this.encrypted = encrypted
  }
}