import { Controller, Get, Render, UseGuards, Request } from '@nestjs/common'
import { JwtAuthGuard } from './auth/guards/jwt.guard'
import { RequirePermissions } from './auth/permissions/permissions.decorator'
import { Permission } from './auth/permissions/permission'
import { UserInformation } from './auth/auth.service'

@Controller()
export class AppController {
  constructor() {
  }

  @Render('index')
  @Get()
  index() {
  }

  @Render('register')
  @Get('register')
  register() {
  }

  @Render('login')
  @Get('login')
  login() {
  }

  @RequirePermissions(Permission.VIEW_PROFILE)
  @UseGuards(JwtAuthGuard)
  @Render('profile')
  @Get('profile')
  userprofile(@Request() req: { user: UserInformation }) {
    return {username: req.user.username}
  }
}
