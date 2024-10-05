import { Controller, Get, HttpCode, HttpStatus, Post, Request, Response, UseGuards } from '@nestjs/common'
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
    return {authenticated: true, username: req.user.username}
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
    res.send({authenticated: true, username: req.user.username}).status(200)
  }
}

export type AuthStatus = {
  authenticated: boolean,
  username: string
}