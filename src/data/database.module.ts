import { Module } from '@nestjs/common'
import { datasourceProvider } from './datasource.providers'
import { ShoppingList } from './entities/shopping-list'
import { DataSource, Repository } from 'typeorm'

@Module({
  providers: [
    datasourceProvider,
    {
      provide: Repository<ShoppingList>,
      useFactory: (dataSource: DataSource) => dataSource.getRepository(ShoppingList),
      inject: [ DataSource ]
    }
  ],
  exports: [Repository<ShoppingList>]
})
export class DatabaseModule {
}
