import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { ApiController } from './api.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ShoppingList } from '../data/entities/shopping-list'
import { ListItem } from '../data/entities/list-item'
import { MealPlan } from '../data/entities/meal-plan'

@Module({
  imports: [ AuthModule, TypeOrmModule.forFeature([ShoppingList, ListItem, MealPlan]) ],
  controllers: [ ApiController ],
  providers: [],
  exports: []
})
export class ApiModule {
}
