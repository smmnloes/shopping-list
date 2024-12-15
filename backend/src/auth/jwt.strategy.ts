import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UserInformation } from './auth.service'
import { Request } from 'express'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([ (request: Request) => request.cookies.jwt ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('APP_SECRET'),
    })
  }

  /**
   * Gets the decoded jwt payload as input, no need to further validate as long as jwt is valid
   * @param decodedTokenPayload
   */
  async validate(decodedTokenPayload: JWTGuardUserData): Promise<JWTGuardUserData> {
    return decodedTokenPayload
  }
}

export type JWTGuardUserData = UserInformation & { userDataKey: string }