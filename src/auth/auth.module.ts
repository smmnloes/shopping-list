import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { DatabaseModule } from '../data/database.module'
import { APP_SECRET } from './secrets'
import { LocalStrategy } from './local.strategy'
import { JwtStrategy } from './jwt.strategy'

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: APP_SECRET,
      signOptions: {expiresIn: '60m'}
    }),
    DatabaseModule
  ],
  providers: [ AuthService, LocalStrategy, JwtStrategy ],
  exports: [],
  controllers: [ AuthController ]
})
export class AuthModule {
}
