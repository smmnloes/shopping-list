import { Controller, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt.guard'
import { Repository } from 'typeorm'
import { ShoppingList } from '../data/entities/shopping-list'

@Controller('api')
export class ApiController {
  constructor(readonly shoppingListRepository: Repository<ShoppingList>) {
  }

  @UseGuards(JwtAuthGuard)
  @Post('shopping-lists')
  async createNewShoppingList() {
    const id= (await this.shoppingListRepository.save(new ShoppingList())).id
    return { id }
  }

}
