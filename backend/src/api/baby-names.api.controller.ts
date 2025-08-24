import { Controller, Get, NotFoundException, Param, ParseIntPipe, Post, Request, UseGuards } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { JwtAuthGuard } from '../auth/guards/jwt.guard'
import { User } from '../data/entities/user'
import { ExtendedJWTGuardRequest } from '../util/request-types'
import { BabyName } from '../data/entities/baby-name'
import { BabyNameFrontendView, Gender, VoteVerdict } from '../../../shared/types/babynames'


@Controller('api')
export class BabyNamesApiController {

  constructor(
    @InjectRepository(User) readonly userRepository: Repository<User>,
    @InjectRepository(BabyName) readonly babyNamesRepository: Repository<BabyName>,
  ) {
  }

  @UseGuards(JwtAuthGuard)
  @Get('babynames/:gender')
  async getRandomName(@Param('gender') gender: Gender, @Request() req: ExtendedJWTGuardRequest<{}>): Promise<BabyNameFrontendView> {
    const allNames = await this.babyNamesRepository.find({ where: { gender } })
      .then(result => result.filter(entry => !entry.votes.some(vote => vote.userId === req.user.id)))

    if (allNames.length === 0) {
      throw new NotFoundException('No names left')
    }

    const { name, id } = allNames[Math.floor(allNames.length * Math.random())]
    return { name, id }
  }


  @UseGuards(JwtAuthGuard)
  @Post('babynames/vote/:nameId')
  async voteOnName(@Param('nameId', ParseIntPipe) nameId: number, @Request() req: ExtendedJWTGuardRequest<{
    vote: VoteVerdict
  }>): Promise<void> {
    const entry = await this.babyNamesRepository.findOneOrFail({ where: { id: nameId } })
    if (entry.votes.some(vote => vote.userId === req.user.id)) {
      console.log('Already voted')
      return
    }
    entry.votes.push({ userId: req.user.id, vote: req.body.vote, createdAt: new Date() })
    await this.babyNamesRepository.save(entry)
  }

}


