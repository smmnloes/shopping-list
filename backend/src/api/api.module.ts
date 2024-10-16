import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { ApiController } from './api.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ShoppingList } from '../data/entities/shopping-list'
import { ListItem } from '../data/entities/list-item'
import { MealPlan } from '../data/entities/meal-plan'
import { MealApiController } from './meal.api.controller'
import { ShoppingApiController } from './shopping.api.controller'

@Module({
  imports: [ AuthModule, TypeOrmModule.forFeature([ ShoppingList, ListItem, MealPlan ]) ],
  controllers: [ ApiController, MealApiController, ShoppingApiController ],
  providers: [],
  exports: []
})
export class ApiModule {
}
