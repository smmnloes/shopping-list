import { Controller, Get, NotFoundException, Param, ParseIntPipe, Post, Put, Request, UseGuards } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { JwtAuthGuard } from '../auth/guards/jwt.guard'
import { User } from '../data/entities/user'
import { ExtendedJWTGuardRequest } from '../util/request-types'
import { BabyName } from '../data/entities/baby-name'
import {
  BabyNameFrontendView,
  BabyNameResult,
  Gender,
  Vote,
  VoteMatchResult,
  VoteVerdict
} from '../../../shared/types/babynames'


@Controller('api')
export class BabyNamesApiController {

  constructor(
    @InjectRepository(User) readonly userRepository: Repository<User>,
    @InjectRepository(BabyName) readonly babyNamesRepository: Repository<BabyName>,
  ) {
  }

  @UseGuards(JwtAuthGuard)
  @Get('babynames/randomname/:gender')
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
  }>): Promise<VoteMatchResult> {
    const entry = await this.babyNamesRepository.findOneOrFail({ where: { id: nameId } })
    if (entry.votes.some(vote => vote.userId === req.user.id)) {
      console.log('Already voted')
      return
    }
    entry.votes.push({ userId: req.user.id, vote: req.body.vote, createdAt: new Date() })
    await this.babyNamesRepository.save(entry)
    const positiveVotesForName = entry.votes.filter(this.isPositiveVote)
    return { match: positiveVotesForName.some(vote => vote.userId !== req.user.id) && positiveVotesForName.length > 1 }
  }


  @UseGuards(JwtAuthGuard)
  @Put('babynames')
  async putNewName(@Request() req: ExtendedJWTGuardRequest<{
    name: string,
    gender: Gender
  }>): Promise<void> {
    const newEntry: BabyName = new BabyName(req.body.name, req.body.gender)
    newEntry.votes.push({ createdAt: new Date(), userId: req.user.id, vote: 'YES' })
    await this.babyNamesRepository.save(newEntry)
  }

  /**
   * Returns only names with at least 1 positive vote, only positive votes for name
   */
  @UseGuards(JwtAuthGuard)
  @Get('babynames/results')
  async getResults(): Promise<{
    results: BabyNameResult[]
  }> {
    const allNames = await this.babyNamesRepository.find()
    const allUserNames = await this.userRepository.find().then(result => result.map(user => ({
      userId: user.id,
      userName: user.name
    })))
    const matches: BabyNameResult[] = allNames.filter(name =>
      name.votes.some(this.isPositiveVote)
    ).map(nameEntry => ({
      name: nameEntry.name,
      votes: nameEntry.votes.filter(this.isPositiveVote).map(vote => ({
        userName: allUserNames.find(userName => userName.userId === vote.userId).userName,
        vote: vote.vote
      }))
    }))

    return { results: matches }
  }

  private isPositiveVote(vote: Vote): boolean {
    return [ 'YES', 'MAYBE' ].includes(vote.vote)
  }
}


