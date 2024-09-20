import { DataSource } from 'typeorm'
import { User } from './entities/user'
import { Provider } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

export const datasourceProvider: Provider =
  {
    provide: DataSource,
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource({
        type: 'sqlite',
        database: configService.get<string>('DATABASE_PATH'),
        entities: [ User ],
        synchronize: true
      })

      return dataSource.initialize()
    },
    inject: [ConfigService]
  }
