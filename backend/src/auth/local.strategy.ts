import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { AuthService, UserInformation } from './auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super()
  }

  async validate(username: string, password: string): Promise<LocalGuardUserData> {
    return { ...(await this.authService.validateUser(username, password)), password }
  }
}

export type LocalGuardUserData = UserInformation & { password: string }