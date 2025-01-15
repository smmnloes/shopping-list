import { Controller, Get, Post, UseGuards } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { JwtAuthGuard } from '../auth/guards/jwt.guard'
import { User } from '../data/entities/user'
import { TakeoutPayment } from '../data/entities/takeout-payment'
import { TakeoutStateFrontend } from '../../../shared/types/takeout'

@Controller('api')
export class TakeoutApiController {

  constructor(
    @InjectRepository(TakeoutPayment) readonly takeoutRepository: Repository<TakeoutPayment>,
    @InjectRepository(User) readonly userRepository: Repository<User>
  ) {
  }

  @UseGuards(JwtAuthGuard)
  @Get('takeout')
  async getTakeoutState(): Promise<TakeoutStateFrontend> {
    const { nextOne, allUsers } = await this.getNextUserToPay()

    return {
      usernames: allUsers.map(user => user.name),
      hasToPayName: nextOne.name,
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('takeout')
  async switchTakeoutState(): Promise<void> {
    const { nextOne } = await this.getNextUserToPay()
    await this.takeoutRepository.save(new TakeoutPayment(nextOne))
  }

  private async getNextUserToPay(): Promise<{ nextOne: User, allUsers: User[] }> {
    const allUsers = await this.userRepository.find().then(result => result.slice(0, 2))
    const latestEntryPayments = await this.takeoutRepository.find({ order: { createdAt: 'DESC' } }).then(results => results[0])

    const nextOne = latestEntryPayments === undefined ? allUsers[0] : allUsers.find(user => user.id !== latestEntryPayments.createdBy.id) ?? allUsers[0]
    return { allUsers, nextOne }
  }

}
