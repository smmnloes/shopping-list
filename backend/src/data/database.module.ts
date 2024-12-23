import { Module } from '@nestjs/common'
import { ShoppingList } from './entities/shopping-list'
import { ListItem } from './entities/list-item'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'
import { MealPlan } from './entities/meal-plan'
import { Note } from './entities/note'
import { User } from './entities/user'
import { Location } from './entities/location'
import { UserKeyService } from './crypto/user-key-service'

@Module({
  imports: [ TypeOrmModule.forRootAsync({
    useFactory: (configService: ConfigService) => ({
      type: 'sqlite',
      database: configService.get<string>('DATABASE_PATH'),
      entities: [ ShoppingList, ListItem, MealPlan, Note, User, Location ],
      synchronize: true
    }),
    inject: [ ConfigService ]
  }) ],
  providers: [UserKeyService],
  exports: [ TypeOrmModule, UserKeyService ]
})
export class DatabaseModule {
}
