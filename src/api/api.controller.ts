import { Controller, Delete, Param, Post, Request, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt.guard'
import { Repository } from 'typeorm'
import { ShoppingList } from '../data/entities/shopping-list'
import { ListItem } from '../data/entities/list-item'
import { ExtendedRequest } from '../util/request-types'
import { InjectRepository } from '@nestjs/typeorm'

@Controller('api')
export class ApiController {
  constructor(
    @InjectRepository(ShoppingList)
    readonly shoppingListRepository: Repository<ShoppingList>) {
  }

  @UseGuards(JwtAuthGuard)
  @Post('shopping-lists')
  async createNewShoppingList(@Request() req: ExtendedRequest<void>) {
    const id = (await this.shoppingListRepository.save(new ShoppingList(req.user.username))).id
    return {id}
  }

  @UseGuards(JwtAuthGuard)
  @Post('shopping-lists/:id/items')
  async addItemToList(@Param('id') id: number, @Request() req: ExtendedRequest<{ item: { name: string } }>) {
    const shoppingList = await this.shoppingListRepository.findOneOrFail({where: {id}})
    shoppingList.items.push(new ListItem(req.user.username, req.body.item.name))
    await this.shoppingListRepository.save(shoppingList)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('shopping-lists/:id/items/:item')
  async deleteItemFromList(@Param('id') id: number, @Param('item') itemId: number) {
    const shoppingList = await this.shoppingListRepository.findOneOrFail({where: {id}})
    shoppingList.items = shoppingList.items.filter(item => item.id !== itemId)
    await this.shoppingListRepository.save(shoppingList)
  }

}
