import { Controller, Post, UseGuards, Request } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt.guard'
import { Repository } from 'typeorm'
import { ShoppingList } from '../data/entities/shopping-list'

@Controller('api')
export class ApiController {
  constructor(readonly shoppingListRepository: Repository<ShoppingList>) {
  }

  @UseGuards(JwtAuthGuard)
  @Post('shopping-lists')
  async createNewShoppingList(@Request() req: any) {
    const newShoppingList = new ShoppingList()
    newShoppingList.createdAt = new Date()
    newShoppingList.createdBy = req.user.username
    newShoppingList.items.push('item1', 'item2')
    const id= (await this.shoppingListRepository.save(newShoppingList)).id
    return { id }
  }

}
