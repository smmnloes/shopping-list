import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ApiModule } from './api/api.module'
import { ScheduleModule } from '@nestjs/schedule'
import { TasksModule } from './tasks/tasks.module'

@Module({
  imports: [ ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: [ `.env.${ process.env.NODE_ENV }`, '.env' ],
    expandVariables: true,
  }), ScheduleModule.forRoot(),
    ApiModule, TasksModule ],
  controllers: [],
  providers: [],
  exports: [ ConfigModule ]
})
export class AppModule {
}
