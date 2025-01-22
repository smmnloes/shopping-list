import { Controller, Inject, Post, Request, UseGuards } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ExtendedJWTGuardRequest } from '../util/request-types'
import { JwtAuthGuard } from '../auth/guards/jwt.guard'
import { User } from '../data/entities/user'
import { NotificationSubscription } from '../data/entities/notification-subscription'
import type { PushSubscription } from 'web-push'
import { NotificationService } from './services/notification-service'

@Controller('api')
export class NotificationsApiController {

  constructor(
    @InjectRepository(NotificationSubscription) readonly notificationSubscriptionRepository: Repository<NotificationSubscription>,
    @InjectRepository(User) readonly userRepository: Repository<User>,
    @Inject() readonly notificationService: NotificationService
  ) {
  }

  @UseGuards(JwtAuthGuard)
  @Post('notifications/subscriptions')
  async saveSubscription(@Request() req: ExtendedJWTGuardRequest<{
    subscription: PushSubscription
  }>): Promise<void> {
    const user = await this.userRepository.findOneOrFail({ where: { id: req.user.id } })
    await this.notificationSubscriptionRepository.upsert(new NotificationSubscription(user, req.body.subscription), [ 'user' ])
    // Test
    await this.notificationService.sendPushNotification(req.body.subscription, 'This is your first message!')
  }

}
