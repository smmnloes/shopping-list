import { Controller, Get, Inject, Post, Request, UnauthorizedException, UseGuards } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { JwtAuthGuard } from '../auth/guards/jwt.guard'
import { User } from '../data/entities/user'
import { TakeoutPayment } from '../data/entities/takeout-payment'
import { TakeoutStateFrontend, TakeoutUserInfo } from '../../../shared/types/takeout'
import { ExtendedJWTGuardRequest } from '../util/request-types'
import { NotificationService } from './services/notification-service'

@Controller('api')
export class TakeoutApiController {

  constructor(
    @InjectRepository(TakeoutPayment) readonly takeoutRepository: Repository<TakeoutPayment>,
    @InjectRepository(User) readonly userRepository: Repository<User>,
    @Inject() readonly notificationService: NotificationService
  ) {
  }

  @UseGuards(JwtAuthGuard)
  @Get('takeout')
  async getTakeoutState(@Request() req: ExtendedJWTGuardRequest<void>): Promise<TakeoutStateFrontend> {
    const allUsers = await this.userRepository.find().then(result =>
      result.slice(0, 2))
    const latestPayments = await this.getLatestPayments()
    const latestPayment: TakeoutPayment | undefined = latestPayments[0]
    return {
      users: this.enrichUsersWithHasToPay(latestPayment, allUsers),
      possibleActions: this.determinePossibleActionsForUser(req.user.id, latestPayment),
      waitingForConfirmation: latestPayment?.createdBy.id === req.user.id && !latestPayment?.confirmed,
      latestPayments: latestPayments.filter(payment => payment.confirmed).map(({ createdAt, createdBy }) => ({
        createdById: createdBy.id,
        createdAt: createdAt.toISOString()
      })).slice(0,5)
    }
  }


  @UseGuards(JwtAuthGuard)
  @Post('takeout/claim')
  async claimTakeoutPayment(@Request() req: ExtendedJWTGuardRequest<void>): Promise<void> {
    const latestPayment = await this.getLatestPayments().then(payments => payments[0])
    if (latestPayment && latestPayment.createdBy.id === req.user.id) {
      throw new UnauthorizedException('It is not this users turn to pay!')
    }

    const { currentUser, otherUser } = await this.getAllUsers(req.user.id)

    await this.takeoutRepository.save(new TakeoutPayment(currentUser))

    await this.notificationService.sendPushNotification(otherUser, {
      title: 'Takeout Zahlung bestätigen',
      message: `Bestätige Takeout Zahlung von ${ currentUser.name }`,
      onClickRedirect: '/takeout-tracker'
    })
  }


  @UseGuards(JwtAuthGuard)
  @Post('takeout/confirm')
  async confirmTakeoutPayment(@Request() req: ExtendedJWTGuardRequest<void>): Promise<void> {
    const latestPayment: TakeoutPayment | undefined = await this.getLatestPayments().then(payments => payments[0])
    if (!latestPayment) {
      console.log('Nothing to do, no payment yet')
      return
    } else if (latestPayment.createdBy.id === req.user.id || latestPayment.confirmed) {
      throw new UnauthorizedException('It is not this users turn to confirm!')
    }

    latestPayment.confirmed = true
    await this.takeoutRepository.save(latestPayment)

    const { currentUser, otherUser } = await this.getAllUsers(req.user.id)

    await this.notificationService.sendPushNotification(otherUser, {
        title: 'Takeout Zahlung bestätigt',
        message: `${ currentUser.name } hat deine Zahlung bestätigt`,
      }
    )

  }

  private async getAllUsers(currentRequestUserId: number) {
    const allUsers = await this.userRepository.find().then(result =>
      result.slice(0, 2))

    return {
      currentUser: allUsers.find(user => user.id === currentRequestUserId),
      otherUser: allUsers.find(user => user.id !== currentRequestUserId)
    }
  }

  private getLatestPayments = async () => this.takeoutRepository.find({
    order: { createdAt: 'DESC' },
    take: 6
  })

  private determinePossibleActionsForUser(userId: number, latestPayment: TakeoutPayment | undefined) {
    return !latestPayment ? {
      claim: true,
      confirm: false
    } : {
      claim: latestPayment.createdBy.id !== userId && latestPayment.confirmed,
      confirm: latestPayment.createdBy.id !== userId && !latestPayment.confirmed
    }
  }

  private enrichUsersWithHasToPay(latestPayment: TakeoutPayment | undefined, users: User[]): TakeoutUserInfo[] {
    const enriched = users.map(({ id, name }) => {
      const hasToPay = (id === latestPayment?.createdBy.id && !latestPayment?.confirmed) || (id !== latestPayment?.createdBy.id && latestPayment?.confirmed)
      return ({
        id,
        name,
        hasToPay
      })
    })
    if (!enriched.some(x => x.hasToPay)) {
      enriched[0].hasToPay = true
    }
    return enriched
  }

}
