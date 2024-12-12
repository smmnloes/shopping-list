import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Repository } from 'typeorm'
import { User } from '../data/entities/user'
import { compare, genSalt, hash } from 'bcrypt'
import { LoginCredentials } from './auth.controller'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userCredentialsRepository: Repository<User>) {
  }

  async validateUser(usernameInput: string, passwordInput: string): Promise<UserInformation> {
    const storedCredentials = await this.userCredentialsRepository.findBy({name: usernameInput})
    if (storedCredentials === null || storedCredentials.length !== 1) {
      throw new UnauthorizedException()
    }
    const {password_hashed, name, id} = storedCredentials[0]
    const compareResult = await compare(passwordInput, password_hashed)
    if (compareResult === true) {
      return {name, id}
    } else {
      throw new UnauthorizedException()
    }
  }

  async login(userInformation: UserInformation) {
    return this.jwtService.sign(userInformation)
  }

  async register({username, password}: LoginCredentials): Promise<void> {
    if (await this.userCredentialsRepository.exists({where: {name: username}})) {
      throw new HttpException('Username already exists', HttpStatus.CONFLICT)
    }
    const salt = await genSalt(10)
    const password_hashed = await hash(password, salt)
    await this.userCredentialsRepository.insert({name: username, password_hashed})
  }
}

export type UserInformation = {
  id: number,
  name: string
}