import { Controller, Get, Post, Request, UnauthorizedException, UseGuards } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { JwtAuthGuard } from '../auth/guards/jwt.guard'
import { User } from '../data/entities/user'
import { TakeoutPayment } from '../data/entities/takeout-payment'
import { TakeoutStateFrontend, TakeoutUserInfo } from '../../../shared/types/takeout'
import { ExtendedJWTGuardRequest } from '../util/request-types'

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
      result.slice(0, 2))
    const latestPayment = await this.getLatestPayment()
    return {
      users: this.enrichUsersWithHasToPay(latestPayment, allUsers),
      possibleActions: this.determinePossibleActionsForUser(req.user.id, latestPayment),
      waitingForConfirmation: latestPayment.createdBy.id === req.user.id && !latestPayment.confirmed
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

  private determinePossibleActionsForUser(userId: number, latestPayment: TakeoutPayment) {
    return {
      claim: latestPayment.createdBy.id !== userId && latestPayment.confirmed,
      confirm: latestPayment.createdBy.id !== userId && !latestPayment.confirmed
    }
  }

  private enrichUsersWithHasToPay(latestPayment: TakeoutPayment, users: User[]): TakeoutUserInfo[] {
    return users.map(({ id, name }) => ({
      id,
      name,
      hasToPay: (id === latestPayment.createdBy.id && !latestPayment.confirmed) || (id !== latestPayment.createdBy.id && latestPayment.confirmed)
    }))
  }

}
