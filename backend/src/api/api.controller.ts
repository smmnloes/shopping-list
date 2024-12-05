import { Controller, Get, Header } from '@nestjs/common'
import { Repository } from 'typeorm'
import { ShoppingList } from '../data/entities/shopping-list'
import { ListItem } from '../data/entities/list-item'
import { InjectRepository } from '@nestjs/typeorm'
import { MealPlan } from '../data/entities/meal-plan'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const version = require('../../../package.json').version

@Controller('api')
export class ApiController {
  constructor(
    @InjectRepository(ShoppingList) readonly shoppingListRepository: Repository<ShoppingList>,
    @InjectRepository(ListItem) readonly listItemRepository: Repository<ListItem>,
    @InjectRepository(MealPlan) readonly mealPlanRepository: Repository<MealPlan>
  ) {
  }

  @Get('onlinestatus')
  async getOnlineStatus(): Promise<void> {
    return
  }

  @Get('version')
  @Header('Cache-Control', 'no-store')
  async getVersion(): Promise<string> {
    return version
  }

}


