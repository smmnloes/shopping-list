import { Controller, Inject, Post, Request, UseGuards } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { JwtAuthGuard } from '../auth/guards/jwt.guard'
import { User } from '../data/entities/user'
import { ExtendedJWTGuardRequest } from '../util/request-types'
import { NotificationService } from './services/notification-service'
import { NotificationSubscription } from '../data/entities/notification-subscription'

@Controller('api')
export class InsultApiController {

  static readonly INSULTS = [ 'Fiiiick diiiiiich!', 'Schmock!', 'Pipiface!', 'Get yerself tae fock!', 'Bist du BLÖÖD?', 'Badabing, Badabung', 'Wer das liest ist doof' ]

  constructor(
    @InjectRepository(User) readonly userRepository: Repository<User>,
    @InjectRepository(NotificationSubscription) readonly notificationSubscriptionRepository: Repository<NotificationSubscription>,
    @Inject() readonly notificationService: NotificationService
  ) {
  }

  @UseGuards(JwtAuthGuard)
  @Post('insult')
  async insult(@Request() req: ExtendedJWTGuardRequest<void>): Promise<void> {
    const allUsers = await this.userRepository.find()
    const otherUser = allUsers.find(user => user.id !== req.user.id)
    if (!otherUser) {
      throw new Error('Could not find other user')
    }
    const randomInsult = InsultApiController.INSULTS[Math.floor(Math.random() * InsultApiController.INSULTS.length)]
    await this.notificationService.sendPushNotification(otherUser, { title: `Du wurdest von ${req.user.name} beleidigt!`, message: 'Klick mich', onClickRedirect: `/insult-view?insult=${encodeURIComponent(randomInsult)}` })
  }
}
