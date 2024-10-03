import { Controller, HttpCode, HttpStatus, Post, Request, Response, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LocalAuthGuard } from './guards/local.guard'
import { Response as ExpressResponse } from 'express'
import { ConfigService } from '@nestjs/config'


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(@Request() req: any, @Response() res: ExpressResponse) {
    const jwt = await this.authService.login(req.user)
    const expirationMs = this.configService.get<number>('AUTH_EXPIRATION_PERIOD_DAYS') * 24 * 60 * 60 * 1000
    res.cookie('jwt', jwt,
      {
        httpOnly: false,
        secure: false,
        maxAge: expirationMs,
        sameSite: 'lax'
      })
    res.send({message: 'Login successful'}).status(200)
  }
}
