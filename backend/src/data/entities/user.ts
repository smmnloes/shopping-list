import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: UserId
  @Column()
  name: string
  @Column()
  password_hashed: string

  constructor() {
  }
}

export type UserId = number