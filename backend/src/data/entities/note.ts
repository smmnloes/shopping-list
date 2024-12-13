import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Note {

  @PrimaryGeneratedColumn()
  id: number
  @Column()
  createdAt: Date
  @Column()
  lastUpdatedAt: Date
  @Column()
  lastUpdatedBy: string
  @Column()
  createdBy: string
  @Column()
  content: string

  constructor(createdBy: string) {
    this.createdBy = createdBy
    this.createdAt = new Date()
    this.lastUpdatedAt = this.createdAt
    this.lastUpdatedBy = createdBy
    this.content = ''
  }
}