import { Controller, Get, Inject, Post, Request, UseGuards } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ExtendedJWTGuardRequest } from '../util/request-types'
import { JwtAuthGuard } from '../auth/guards/jwt.guard'
import { User } from '../data/entities/user'
import { NotificationSubscription } from '../data/entities/notification-subscription'
import type { PushSubscription } from 'web-push'
import { NotificationService } from './services/notification-service'
import { NotificationsStatus } from '../../../shared/types/push-notifications'

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
  }

  @UseGuards(JwtAuthGuard)
  @Post('notifications/options')
  async setNotificationsOptions(@Request() req: ExtendedJWTGuardRequest<{ enabled: boolean }>): Promise<void> {
    const user = await this.userRepository.findOneOrFail({ where: { id: req.user.id } })
    user.options.notifications.enabled = req.body.enabled
    await this.userRepository.save(user)
  }

  @UseGuards(JwtAuthGuard)
  @Get('notifications/status')
  async getNotificationsStatus(@Request() req: ExtendedJWTGuardRequest<void>): Promise<NotificationsStatus> {
    const user = await this.userRepository.findOneOrFail({ where: { id: req.user.id } })
    const {subscription: {endpoint, expirationTime}} = await this.notificationSubscriptionRepository.findOneOrFail({ where: { user: { id: user.id } } })
    return { ...user.options.notifications, storedSubscription: {endpoint, expirationTime} }
  }

  @UseGuards(JwtAuthGuard)
  @Post('notifications/test')
  async testNotifications(@Request() req: ExtendedJWTGuardRequest<void>): Promise<void> {
    const user = await this.userRepository.findOneOrFail({ where: { id: req.user.id } })
    if (!user.options.notifications.enabled) {
      return
    }
    await this.notificationService.sendPushNotification(user, {
      title: 'Test title',
      message: 'This is a test message!',
      onClickRedirect: '/notes'
    })
  }

}
