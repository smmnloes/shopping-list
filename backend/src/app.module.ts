import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ApiModule } from './api/api.module'
import { ViewsModule } from './views/views.module'

@Module({
  imports: [ ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env'
  }), ApiModule, ViewsModule ],
  controllers: [],
  providers: [],
  exports: [ ConfigModule ]
})
export class AppModule {
}
