import { Controller, Get, NotFoundException, Post, Query, Request, UseGuards } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Location, LocationType } from '../data/entities/location'
import { ExtendedJWTGuardRequest } from '../util/request-types'
import { JwtAuthGuard } from '../auth/guards/jwt.guard'
import { User } from '../data/entities/user'
import type { LocationFrontendView } from '../../../shared/types/location'

@Controller('api')
export class LocationsApiController {

  constructor(
    @InjectRepository(Location) readonly locationRepository: Repository<Location>,
    @InjectRepository(User) readonly userRepository: Repository<User>
  ) {
  }

  @UseGuards(JwtAuthGuard)
  @Get('locations')
  async getLocation(@Query('type') type: LocationType): Promise<LocationFrontendView> {
    const latestLocationForType = await this.locationRepository.find({ where: { type } })
      .then(results => [ ...results ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0])
    if (latestLocationForType) {
      const { lat, lng, createdBy, createdAt } = latestLocationForType
      return {
        lat,
        lng,
        createdAt,
        createdByName: createdBy.name
      }
    } else {
      throw new NotFoundException(`No location was found for type ${ type }`)
    }

  }

  @UseGuards(JwtAuthGuard)
  @Post('locations')
  async postLocation(@Request() req: ExtendedJWTGuardRequest<{
    lat: number,
    lng: number,
    type: LocationType
  }>): Promise<LocationFrontendView> {
    const user = await this.userRepository.findOneOrFail({ where: { id: req.user.id } })
    const {
      lat,
      lng,
      createdAt,
      createdBy
    } = await this.locationRepository.save(new Location(user, req.body.type, req.body.lat, req.body.lng))
    return { lat, lng, createdAt, createdByName: createdBy.name }
  }

}
