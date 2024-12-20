import { HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Repository } from 'typeorm'
import { User } from '../data/entities/user'
import { compare, genSalt, hash } from 'bcrypt'
import { LoginCredentials } from './auth.controller'
import { InjectRepository } from '@nestjs/typeorm'
import { UserKeyService } from '../data/crypto/user-key-service'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject() private readonly userKeyService: UserKeyService
  ) {
  }

  async validateUser(usernameInput: string, passwordInput: string): Promise<UserInformation> {
    const storedCredentials = await this.userRepository.findBy({ name: usernameInput })
    if (storedCredentials === null || storedCredentials.length !== 1) {
      throw new UnauthorizedException()
    }
    const { password_hashed, name, id } = storedCredentials[0]
    const compareResult = await compare(passwordInput, password_hashed)
    if (compareResult === true) {
      return { name, id }
    } else {
      throw new UnauthorizedException()
    }
  }

  async login(userInformation: UserInformation, password: string): Promise<JWT> {
    const user = await this.userRepository.findOneOrFail({ where: { id: userInformation.id } })
    const decryptedKey = this.userKeyService.decryptUserDataKey(user.user_data_key_encrypted, password)
    return this.jwtService.sign({ ...userInformation, userDataKey: decryptedKey })
  }

  async register({ username, password }: LoginCredentials): Promise<UserInformation> {
    if (await this.userRepository.exists({ where: { name: username } })) {
      throw new HttpException('Username already exists', HttpStatus.CONFLICT)
    }
    const password_hashed = await this.hashPassword(password)

    const user_data_key_encrypted = this.userKeyService.createEncryptedUserDataKey(password)

    const { id, name } = await this.userRepository.save({ name: username, password_hashed, user_data_key_encrypted })
    return { id, name }
  }

  private async hashPassword(password: string) {
    const salt = await genSalt(10)
    return await hash(password, salt)
  }

  async changePassword(user: UserInformation, currentPassword: string, newPassword: string) {
    await this.validateUser(user.name, currentPassword)
    const userEntity = await this.userRepository.findOneOrFail({ where: { id: user.id } })
    userEntity.user_data_key_encrypted = this.userKeyService.reencryptUserDataKey(userEntity.user_data_key_encrypted, currentPassword, newPassword)
    userEntity.password_hashed = await this.hashPassword(newPassword)
    await this.userRepository.save(userEntity)
  }
}

export type UserInformation = Pick<User, 'id' | 'name'>

type JWT = string