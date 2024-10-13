import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Request,
  UseGuards
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt.guard'
import { Repository } from 'typeorm'
import { ShoppingList } from '../data/entities/shopping-list'
import { ListItem } from '../data/entities/list-item'
import { ExtendedRequest } from '../util/request-types'
import { InjectRepository } from '@nestjs/typeorm'
import { ShopCategory } from '../data/entities/common-types'

@Controller('api')
export class ApiController {
  constructor(
    @InjectRepository(ShoppingList) readonly shoppingListRepository: Repository<ShoppingList>,
    @InjectRepository(ListItem) readonly listItemRepository: Repository<ListItem>
  ) {
  }

  @Get('onlinestatus')
  async getOnlineStatus(): Promise<void> {
    return
  }

  /**
   *  We actually dont need the list-construct anymore, we can just query for items with a category
   * @param category
   * @private
   */
  private async getListForCategory(category: ShopCategory): Promise<ShoppingList> {
    const shoppingLists = await this.shoppingListRepository.find({where: {shopCategory: category}})
    if (shoppingLists.length === 0) {
      throw new NotFoundException(`No list for category ${category} found`)
    }
    if (shoppingLists.length > 1) {
      console.error(`More than 1 list found for category ${category}. Picking first one`)
    }
    return shoppingLists[0]
  }

  @UseGuards(JwtAuthGuard)
  @Post('shopping-lists/:category/items')
  async addItemToCategory(@Param('category') category: ShopCategory, @Request() req: ExtendedRequest<{
    item: { name: string }
  }>): Promise<ListItemFrontend> {
    const shoppingList = await this.getListForCategory(category)
    const newItem = new ListItem(req.user.username, req.body.item.name, shoppingList.shopCategory)
    shoppingList.items.push(newItem)
    await this.shoppingListRepository.save(shoppingList)
    return {id: newItem.id, name: newItem.name, isStaple: newItem.isStaple}
  }

  @UseGuards(JwtAuthGuard)
  @Get('shopping-lists/:category')
  async getItemsForCategory(@Param('category') category: ShopCategory): Promise<{ items: ListItemFrontend[] }> {
    const shoppingList = await this.getListForCategory(category)
    return {items: shoppingList.items.map(({id, name, isStaple}) => ({id, name, isStaple}))}
  }


  @UseGuards(JwtAuthGuard)
  @Delete('shopping-lists/:category/items/:itemId')
  async deleteItemFromCategory(@Param('category') category: ShopCategory, @Param('itemId', ParseIntPipe) itemId: number) {
    const shoppingList = await this.getListForCategory(category)

    const itemToDelete = shoppingList.items.find(item => item.id === itemId)
    shoppingList.items = shoppingList.items.filter(item => item !== itemToDelete)
    await this.shoppingListRepository.save(shoppingList)
    if (!itemToDelete.isStaple) {
      await this.listItemRepository.delete(itemToDelete.id)
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('staples')
  async getStaples(@Query('category') category: ShopCategory): Promise<ListItemFrontend[]> {
    const staples = await this.listItemRepository.find({where: {isStaple: true, shopCategory: category}})
    return staples.map(({id, name, isStaple}) => ({id, name, isStaple}))
  }

  @UseGuards(JwtAuthGuard)
  @Post('staples')
  async createStaple(@Request() req: ExtendedRequest<{ staple: { name: string, category: ShopCategory } }>): Promise<ListItemFrontend> {
    const {id, name, isStaple} = (await this.listItemRepository.save(new ListItem(req.user.username, req.body.staple.name, req.body.staple.category, true)))
    return {id, name, isStaple}
  }

  @UseGuards(JwtAuthGuard)
  @Delete('staples/:stapleId')
  async deleteStaple(@Param('stapleId', ParseIntPipe) stapleId: number): Promise<void> {
    const stapleToDelete = await this.listItemRepository.findOneOrFail({
      where: {id: stapleId},
      relations: [ 'shoppingLists' ]
    })

    // remove staple from all shopping lists
    await Promise.all(stapleToDelete.shoppingLists.map(shoppingList => {
      shoppingList.items = shoppingList.items.filter(item => item.id !== stapleId)
      return this.shoppingListRepository.save(shoppingList)
    }))
    await this.listItemRepository.delete(stapleToDelete.id)
  }

}


export type ShoppingListFrontend = {
  id: number,
  createdAt: Date,
  createdBy: string,
}

type ListItemFrontend = { name: string, id: number, isStaple: boolean }
