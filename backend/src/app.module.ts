import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ApiModule } from './api/api.module'

@Module({
  imports: [ ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: [`.env.${ process.env.NODE_ENV }`, '.env'],
    expandVariables: true,
  }), ApiModule ],
  controllers: [],
  providers: [],
  exports: [ ConfigModule ]
})
export class AppModule {
}
