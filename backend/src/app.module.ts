import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ApiModule } from './api/api.module'

@Module({
  imports: [ ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: process.env.NODE_ENV ? `.env.${ process.env.NODE_ENV }` : '.env'
  }), ApiModule ],
  controllers: [],
  providers: [],
  exports: [ ConfigModule ]
})
export class AppModule {
}
