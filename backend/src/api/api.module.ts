import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { ApiController } from './api.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ShoppingList } from '../data/entities/shopping-list'
import { ListItem } from '../data/entities/list-item'
import { MealPlan } from '../data/entities/meal-plan'
import { MealApiController } from './meal.api.controller'
import { ShoppingApiController } from './shopping.api.controller'
import { NotesApiController } from './notes.api.controller'
import { Note } from '../data/entities/note'
import { User } from '../data/entities/user'

@Module({
  imports: [ AuthModule, TypeOrmModule.forFeature([ ShoppingList, ListItem, MealPlan, Note, User ]) ],
  controllers: [ ApiController, MealApiController, ShoppingApiController, NotesApiController ],
  providers: [],
  exports: []
})
export class ApiModule {
}
