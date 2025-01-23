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
import { TakeoutPayment } from './entities/takeout-payment'
import { NotificationSubscription } from './entities/notification-subscription'

export const entities = [ ShoppingList, ListItem, MealPlan, Note, User, Location, TakeoutPayment, NotificationSubscription ]

@Module({
  imports: [ TypeOrmModule.forRootAsync({
    useFactory: (configService: ConfigService) => ({
      type: 'sqlite',
      database: configService.get<string>('DATABASE_PATH'),
      entities,
      synchronize: true
    }),
    inject: [ ConfigService ]
  }) ],
  providers: [UserKeyService],
  exports: [ TypeOrmModule, UserKeyService ]
})
export class DatabaseModule {
}
