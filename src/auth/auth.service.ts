import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService, private readonly configService: ConfigService) {
  }

  async validateUser(username: string, password: string): Promise<UserInformation> {
    if (!(password === this.configService.get<string>('APP_SECRET'))) {
      throw new UnauthorizedException('Invalid password')
    }
    return {username}
  }

  async login(userInformation: UserInformation) {
    return this.jwtService.sign(userInformation)
  }
}

export type UserInformation = {
  username: string,
}