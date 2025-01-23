import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user'
import type { PushSubscription } from 'web-push'

@Entity()
export class NotificationSubscription {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  createdAt: Date
  @OneToOne(() => User, {eager: true})
  @JoinColumn()
  user: User
  @Column({type: 'json'})
  subscription: PushSubscription

  constructor(user: User, subscription: PushSubscription) {
    this.createdAt = new Date()
    this.user = user
    this.subscription = subscription
  }
}