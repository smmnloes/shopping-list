import { Module } from '@nestjs/common'
import { ShoppingList } from './entities/shopping-list'
import { ListItem } from './entities/list-item'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'
import { MealPlan } from './entities/meal-plan'

@Module({
  imports: [ TypeOrmModule.forRootAsync({
    useFactory: (configService: ConfigService) => ({
      type: 'sqlite',
      database: configService.get<string>('DATABASE_PATH'),
      entities: [ ShoppingList, ListItem, MealPlan ],
      synchronize: true
    }),
    inject: [ ConfigService ]
  }) ],
  exports: [ TypeOrmModule ]
})
export class DatabaseModule {
}
