import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { APP_SECRET } from './secrets'
import { UserInformation } from './auth.service'
import { Request } from 'express'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([ (request: Request) => request.cookies.jwt ]),
      ignoreExpiration: false,
      secretOrKey: APP_SECRET
    })
  }

  async validate(decodedTokenPayload: UserInformation): Promise<UserInformation> {
    return decodedTokenPayload
  }
}
