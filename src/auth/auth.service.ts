import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { LoginCredentials } from './auth.controller'
import { User } from '../data/entities/user'
import { Repository } from 'typeorm'
import { genSalt, hash, compare } from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService, private readonly userCredentialsRepository: Repository<User>) {
  }

  async validateUser(usernameInput: string, passwordInput: string): Promise<UserInformation> {
    const storedCredentials = await this.userCredentialsRepository.findBy({username: usernameInput})
    if (storedCredentials === null || storedCredentials.length !== 1) {
      throw new UnauthorizedException()
    }
    const {password_hashed, username, id} = storedCredentials[0]
    const compareResult = await compare(passwordInput, password_hashed)
    if (compareResult === true) {
      return {username, id}
    } else {
      throw new UnauthorizedException()
    }
  }

  async login(userInformation: UserInformation) {
    return this.jwtService.sign(userInformation)
  }

  async register({username, password}: LoginCredentials): Promise<void> {
    if (await this.userCredentialsRepository.exists({where: {username}})) {
      throw new HttpException('Username already exists', HttpStatus.CONFLICT)
    }
    const salt = await genSalt(10)
    const password_hashed = await hash(password, salt)
    await this.userCredentialsRepository.insert({username, password_hashed})
  }
}

export type UserInformation = {
  id: number,
  username: string,
}