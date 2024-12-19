import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user'

@Entity()
export class Location {
  constructor(createdBy: User, type: LocationType, lat: number, lng: number) {
    this.createdBy = createdBy
    this.type = type
    this.lat = lat
    this.lng = lng
    this.createdAt = new Date()
  }
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  @Index()
  createdAt: Date
  @ManyToOne(() => User, { eager: true })
  createdBy: User
  @Column()
  type: LocationType
  @Column('float')
  lat: number
  @Column('float')
  lng: number
}

export type LocationType = 'CAR'