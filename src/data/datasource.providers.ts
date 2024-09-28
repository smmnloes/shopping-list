import { DataSource } from 'typeorm'
import { Provider } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ShoppingList } from './entities/shopping-list'

export const datasourceProvider: Provider =
  {
    provide: DataSource,
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource({
        type: 'sqlite',
        database: configService.get<string>('DATABASE_PATH'),
        entities: [ShoppingList],
        synchronize: true
      })

      return dataSource.initialize()
    },
    inject: [ConfigService]
  }
