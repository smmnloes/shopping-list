import { Inject, Injectable } from '@nestjs/common'
import { PushSubscription, sendNotification, setVapidDetails } from 'web-push'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class NotificationService {
  constructor(@Inject() configService: ConfigService) {
    setVapidDetails('mailto:maximilian.loesch@posteo.de', configService.get('VAPID_PUBLIC_KEY'), configService.get('VAPID_PRIVATE_KEY'))
  }

  public async sendPushNotification(subscription: PushSubscription, message: string) {
    await sendNotification(subscription, message)
  }
}