import { Controller, HttpCode, HttpStatus, Post, Request, Response, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LocalAuthGuard } from './guards/local.guard'
import { Response as ExpressResponse } from 'express'


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(@Request() req: any, @Response() res: ExpressResponse) {
    const jwt = await this.authService.login(req.user)
    res.cookie('jwt', jwt, {httpOnly: true, secure: true})
    res.send({message: 'Login successful'}).status(200)
  }
}
