import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { JSONArrayTransformer } from '../transformers/json-array-transformer'
import { Gender, Vote } from '../../../../shared/types/babynames'

@Entity()
export class BabyName {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  name: string
  @Column()
  gender: Gender
  @Column({ type: 'text', transformer: new JSONArrayTransformer() })
  votes: Vote[]


  constructor(name: string, gender: Gender) {
    this.name = name
    this.gender = gender
    this.votes = []
  }
}