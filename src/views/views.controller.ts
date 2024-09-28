import { Controller, Get, Render, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt.guard'

@Controller()
export class ViewsController {
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

  @UseGuards(JwtAuthGuard)
  @Render('shopping-lists')
  @Get('shopping-lists')
  shoppingLists() {
  }
}
