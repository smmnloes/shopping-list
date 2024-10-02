import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { ViewsController } from './views.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ShoppingList } from '../data/entities/shopping-list'

@Module({
  imports: [ AuthModule, TypeOrmModule.forFeature([ShoppingList]) ],
  controllers: [ ViewsController ],
  providers: [],
  exports: []
})
export class ViewsModule {
}
