import { Controller, Post, UseGuards, Request, Param } from '@nestjs/common'
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
    const newShoppingList = new ShoppingList(req.user.username)
    const id = (await this.shoppingListRepository.save(newShoppingList)).id
    return {id}
  }

  @UseGuards(JwtAuthGuard)
  @Post('shopping-lists/:id/items')
  async addItemToList(@Param('id') id: number, @Request() req: any) {
    const shoppingList = await this.shoppingListRepository.findOneOrFail({where: {id}})
    shoppingList.items.push(req.body.item)
    await this.shoppingListRepository.save(shoppingList)
  }

}
