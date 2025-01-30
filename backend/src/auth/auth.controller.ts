import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Response,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { LocalAuthGuard } from './guards/local.guard'
import { Response as ExpressResponse } from 'express'
import { ConfigService } from '@nestjs/config'
import { JwtAuthGuard } from './guards/jwt.guard'
import { ExtendedJWTGuardRequest, ExtendedLocalGuardRequest } from '../util/request-types'
import { AuthStatus } from '../../../shared/types/auth'


@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAuthStatus(@Request() req: ExtendedJWTGuardRequest<void>): Promise<AuthStatus> {
    return { authenticated: true, username: req.user.name, userId: req.user.id }
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(@Request() req: ExtendedLocalGuardRequest<void>, @Response() res: ExpressResponse<AuthStatus>): Promise<void> {
    const jwt = await this.authService.login(req.user, req.user.password)
    this.sendResponseWithAuthStatusAndJWTCookie(res, jwt, req.user.name)
  }

  @Post('register')
  async register(@Body() registerRequest: {
    credentials: LoginCredentials,
    registrationSecret: string
  }, @Response() res: ExpressResponse<AuthStatus>): Promise<void> {
    if (registerRequest.registrationSecret !== this.configService.get<string>('REGISTRATION_SECRET')) {
      throw new UnauthorizedException('Incorrect registration secret')
    }
    const userInformation = await this.authService.register(registerRequest.credentials)
    const jwt = await this.authService.login(userInformation, registerRequest.credentials.password)
    this.sendResponseWithAuthStatusAndJWTCookie(res, jwt, userInformation.name)
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Response() res: ExpressResponse<void>) {
    res.cookie('jwt', 'invalid',
      {
        httpOnly: true,
        secure: true,
        maxAge: 0,
        sameSite: 'lax'
      })
    res.status(200).send()
  }

  @Post('changepassword')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async changePassword(@Request() { body: { currentPassword, newPassword }, user: {name, id} }: ExtendedJWTGuardRequest<{
    currentPassword: string,
    newPassword: string
  }>, @Response() res: ExpressResponse<AuthStatus>) {
    await this.authService.changePassword({name, id}, currentPassword, newPassword)
    const jwt = await this.authService.login({name, id}, newPassword)
    this.sendResponseWithAuthStatusAndJWTCookie(res, jwt,name)
  }


  private sendResponseWithAuthStatusAndJWTCookie(res: ExpressResponse<AuthStatus>, jwt: string, username: string) {
    const expirationMs = this.configService.get<number>('AUTH_EXPIRATION_PERIOD_DAYS') * 24 * 60 * 60 * 1000
    res.cookie('jwt', jwt,
      {
        httpOnly: true,
        secure: true,
        maxAge: expirationMs,
        sameSite: 'lax'
      })
    res.send({ authenticated: true, username }).status(200)
  }
}


export class LoginCredentials {
  readonly username: string
  readonly password: string
}
