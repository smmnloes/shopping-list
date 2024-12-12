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
import { ExtendedRequest } from '../util/request-types'


@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAuthStatus(@Request() req: ExtendedRequest<void>): Promise<AuthStatus> {
    return {authenticated: true, username: req.user.name}
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(@Request() req: ExtendedRequest<void>, @Response() res: ExpressResponse<AuthStatus>) {
    const jwt = await this.authService.login(req.user)
    const expirationMs = this.configService.get<number>('AUTH_EXPIRATION_PERIOD_DAYS') * 24 * 60 * 60 * 1000
    res.cookie('jwt', jwt,
      {
        httpOnly: true,
        secure: true,
        maxAge: expirationMs,
        sameSite: 'lax'
      })
    res.send({authenticated: true, username: req.user.name}).status(200)
  }

  @Post('register')
  async register(@Body() registerRequest: {
    credentials: LoginCredentials,
    registrationSecret: string
  }): Promise<void> {
    if (registerRequest.registrationSecret !== this.configService.get<string>('REGISTRATION_SECRET')) {
      throw new UnauthorizedException('Incorrect registration secret')
    }
    await this.authService.register(registerRequest.credentials)
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
}


export class LoginCredentials {
  readonly username: string
  readonly password: string
}


export type AuthStatus = {
  authenticated: boolean,
  username: string
}
