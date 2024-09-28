import { Controller, Get, Render } from '@nestjs/common'

@Controller()
export class AppController {
  constructor() {
  }

  @Render('index')
  @Get()
  index() {
  }

  @Render('login')
  @Get('login')
  login() {
  }
}
