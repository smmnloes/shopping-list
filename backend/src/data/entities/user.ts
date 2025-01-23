import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { NotificationSubscription } from './notification-subscription'
import type { PushSubscription } from 'web-push'


export type UserOptions = {
  notifications: { enabled: boolean }
}

const defaultOptions: UserOptions = { notifications: { enabled: false } }

export type UserId = number


@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: UserId
  @Column()
  name: string
  @Column()
  password_hashed: string
  @Column({ nullable: true })
  user_data_key_encrypted?: string
  @OneToOne(() => NotificationSubscription, { nullable: true })
  subscription: PushSubscription
  @Column({ type: 'json', default: JSON.stringify(defaultOptions) })
  options: UserOptions

  constructor() {
  }
}
