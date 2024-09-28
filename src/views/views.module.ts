import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from '../auth/auth.module'
import { ViewsController } from './views.controller'
import { DatabaseModule } from '../data/database.module'

@Module({
  imports: [ AuthModule, ConfigModule, DatabaseModule ],
  controllers: [ ViewsController ],
  providers: [],
  exports: []
})
export class ViewsModule {
}
