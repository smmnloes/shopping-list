import { Controller, Get, Post, Request, UnauthorizedException, UseGuards } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { JwtAuthGuard } from '../auth/guards/jwt.guard'
import { User } from '../data/entities/user'
import { TakeoutPayment } from '../data/entities/takeout-payment'
import { CurrentTakeoutAction, TakeoutPaymentFrontend, TakeoutStateFrontend } from '../../../shared/types/takeout'
import { ExtendedJWTGuardRequest } from '../util/request-types'
import { JWTGuardUserData } from '../auth/jwt.strategy'

@Controller('api')
export class TakeoutApiController {

  constructor(
    @InjectRepository(TakeoutPayment) readonly takeoutRepository: Repository<TakeoutPayment>,
    @InjectRepository(User) readonly userRepository: Repository<User>
  ) {
  }

  @UseGuards(JwtAuthGuard)
  @Get('takeout')
  async getTakeoutState(@Request() req: ExtendedJWTGuardRequest<void>): Promise<TakeoutStateFrontend> {
    const allUsers = await this.userRepository.find().then(result =>
      result.slice(0, 2).map(({ id, name }) => ({ id, name })))
    const payments = await this.takeoutRepository.find({ order: { createdAt: 'DESC' }, take: 20 })
      .then(results => results.map(({ createdAt, createdBy, confirmed }) => ({
        createdById: createdBy.id,
        createdAt: createdAt.toISOString(),
        confirmed
      })))
    return {
      users: allUsers,
      hasToPayId: payments[0].confirmed ? allUsers.find(user => user.id !== payments[0].createdById) : payments[0].createdById,
      payments,
      action: this.getTakeoutAction(payments, req.user)
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('takeout/claim')
  async claimTakeoutPayment(@Request() req: ExtendedJWTGuardRequest<void>): Promise<void> {
    const latestPayment = await this.getLatestPayment()
    if (latestPayment && latestPayment.createdBy.id === req.user.id) {
      throw new UnauthorizedException('It is not this users turn to pay!')
    }
    const currentUser = await this.userRepository.findOneOrFail({ where: { id: req.user.id } })
    await this.takeoutRepository.save(new TakeoutPayment(currentUser))
    // TODO: send notification
  }


  @UseGuards(JwtAuthGuard)
  @Post('takeout/confirm')
  async confirmTakeoutPayment(@Request() req: ExtendedJWTGuardRequest<void>): Promise<void> {
    const latestPayment = await this.getLatestPayment()
    if (!latestPayment) {
      console.log('Nothing to do, no payment yet')
      return
    } else if (latestPayment.createdBy.id === req.user.id || latestPayment.confirmed) {
      throw new UnauthorizedException('It is not this users turn to confirm!')
    }

    latestPayment.confirmed = true
    await this.takeoutRepository.save(latestPayment)

  }

  private getLatestPayment = async () => (await this.takeoutRepository.find({
    order: { createdAt: 'DESC' },
    take: 1
  }))[0]

  private getTakeoutAction(payments: TakeoutPaymentFrontend[], user: JWTGuardUserData): CurrentTakeoutAction {
    const latestPayment = payments[0]
    if (latestPayment.createdById === user.id) {
      // Newest payment was created by current user
      if (latestPayment.confirmed) {
        return 'NONE'
      } else {
        return 'CONFIRMATION_NEEDED'
      }
    } else {
      // newest payment was created by other user
      if (latestPayment.confirmed) {
        return 'CAN_CLAIM'
      } else {
        return 'CAN_CONFIRM'
      }
    }
  }
}
