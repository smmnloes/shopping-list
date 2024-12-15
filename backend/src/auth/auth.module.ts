import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { DatabaseModule } from '../data/database.module'
import { LocalStrategy } from './local.strategy'
import { JwtStrategy } from './jwt.strategy'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../data/entities/user'
import { UserKeyService } from '../data/crypto/user-key-service'

@Module({
  imports: [
    TypeOrmModule.forFeature([ User ]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ ConfigModule ],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('APP_SECRET'),
        signOptions: { noTimestamp: true, expiresIn: `${ configService.get<string>('AUTH_EXPIRATION_PERIOD_DAYS') }d` }
      }),
      inject: [ ConfigService ]
    }),
    DatabaseModule,
    ConfigModule
  ],
  providers: [ AuthService, LocalStrategy, JwtStrategy, UserKeyService ],
  exports: [],
  controllers: [ AuthController ]
})
export class AuthModule {
}
