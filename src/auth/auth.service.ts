import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {
  }

  async validateUser(password: string): Promise<void> {
    // TODO
  }

  async login(userInformation: UserInformation) {
    return this.jwtService.sign(userInformation)
  }
}

export type UserInformation = {
  id: number,
  username: string,
}