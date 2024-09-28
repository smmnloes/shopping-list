import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from '../auth/auth.module'
import { ApiController } from './api.controller'
import { DatabaseModule } from '../data/database.module'

@Module({
  imports: [ AuthModule, ConfigModule, DatabaseModule ],
  controllers: [ ApiController ],
  providers: [],
  exports: []
})
export class ApiModule {
}
