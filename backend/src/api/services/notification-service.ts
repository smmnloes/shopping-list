import { Inject, Injectable } from '@nestjs/common'
import { sendNotification, setVapidDetails } from 'web-push'
import { ConfigService } from '@nestjs/config'
import { User } from '../../data/entities/user'
import { InjectRepository } from '@nestjs/typeorm'
import { NotificationSubscription } from '../../data/entities/notification-subscription'
import { Repository } from 'typeorm'
import { PushNotificationPayload } from '../../../../shared/types/push-notifications'


@Injectable()
export class NotificationService {
  constructor(@Inject() configService: ConfigService,
              @InjectRepository(NotificationSubscription) readonly subscriptionRepository: Repository<NotificationSubscription>) {
    setVapidDetails('mailto:maximilian.loesch@posteo.de', configService.get('VAPID_PUBLIC_KEY'), configService.get('VAPID_PRIVATE_KEY'))
  }

  public async sendPushNotification(targetUser: User, payload: PushNotificationPayload) {
    try {
      const subscription = await this.subscriptionRepository.findOneOrFail({ where: { user: { id: targetUser.id } } }).then(result => result.subscription)
      await sendNotification(subscription, JSON.stringify(payload))
    } catch (e) {
      console.error('Could not send push notification', e)
    }
  }
}