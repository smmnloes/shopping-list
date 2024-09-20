import { Module } from '@nestjs/common'
import { datasourceProvider } from './datasource.providers'
import { User } from './entities/user'
import { DataSource, Repository } from 'typeorm'

@Module({
  providers: [
    datasourceProvider,
    {
      provide: Repository<User>,
      useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
      inject: [ DataSource ]
    } ],
  exports: [ Repository<User> ]
})
export class DatabaseModule {
}
