import { Controller, Delete, Param, ParseIntPipe, Post, Request, UseGuards } from '@nestjs/common'
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
  @Post('shopping-lists/:listId/items')
  async addItemToList(@Param('listId', ParseIntPipe) listId: number, @Request() req: ExtendedRequest<{ item: { name: string } }>) {
    const shoppingList = await this.shoppingListRepository.findOneOrFail({where: {id: listId}})
    shoppingList.items.push(new ListItem(req.user.username, req.body.item.name))
    await this.shoppingListRepository.save(shoppingList)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('shopping-lists/:listId/items/:itemId')
  async deleteItemFromList(@Param('listId', ParseIntPipe) listId: number, @Param('itemId', ParseIntPipe) itemId: number) {
    const shoppingList = await this.shoppingListRepository.findOneOrFail({where: {id: listId}})
    shoppingList.items = shoppingList.items.filter(item => item.id !== itemId)
    await this.shoppingListRepository.save(shoppingList)
  }

}
