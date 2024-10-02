import { DataSource } from 'typeorm'
import { Provider } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ShoppingList } from './entities/shopping-list'
import { ListItem } from './entities/list-item'

export const datasourceProviders: Provider[] =
  [
    {
      provide: DataSource,
      useFactory: async (configService: ConfigService) => {
        const dataSource = new DataSource({
          type: 'sqlite',
          database: configService.get<string>('DATABASE_PATH'),
          entities: [ ShoppingList, ListItem ],
          synchronize: true
        })

        return dataSource.initialize()
      },
      inject: [ ConfigService ]
    },
  ]
