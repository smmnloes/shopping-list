import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { NotificationSubscription } from './notification-subscription'
import type { PushSubscription } from 'web-push'


@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: UserId
  @Column()
  name: string
  @Column()
  password_hashed: string
  @Column({nullable: true})
  user_data_key_encrypted?: string
  @OneToOne(() => NotificationSubscription)
  subscription: PushSubscription

  constructor() {
  }
}

export type UserId = number
