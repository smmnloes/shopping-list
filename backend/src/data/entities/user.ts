import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User {

  constructor() {
  }

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  password_hashed: string
}