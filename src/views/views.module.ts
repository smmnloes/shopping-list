import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from '../auth/auth.module'
import { ViewsController } from './views.controller'

@Module({
  imports: [ AuthModule, ConfigModule ],
  controllers: [ ViewsController ],
  providers: [],
  exports: []
})
export class ViewsModule {
}
