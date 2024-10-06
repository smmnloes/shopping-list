import { Controller, Delete, Get, Param, ParseIntPipe, Post, Request, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt.guard'
import { Repository } from 'typeorm'
import { ShoppingList } from '../data/entities/shopping-list'
import { ListItem } from '../data/entities/list-item'
import { ExtendedRequest } from '../util/request-types'
import { InjectRepository } from '@nestjs/typeorm'

@Controller('api')
export class ApiController {
  constructor(
    @InjectRepository(ShoppingList) readonly shoppingListRepository: Repository<ShoppingList>,
    @InjectRepository(ListItem) readonly listItemRepository: Repository<ListItem>
  ) {
  }

  @UseGuards(JwtAuthGuard)
  @Post('shopping-lists')
  async createNewShoppingList(@Request() req: ExtendedRequest<void>): Promise<ShoppingListFrontend> {
    const staples = await this.listItemRepository.find({where: {isStaple: true}})

    const {
      id,
      createdAt,
      createdBy
    } = (await this.shoppingListRepository.save(new ShoppingList(req.user.username, staples)))
    return {id, createdAt, createdBy}
  }

  @UseGuards(JwtAuthGuard)
  @Delete('shopping-lists/:listId')
  async deleteShoppingList(@Param('listId', ParseIntPipe) listId: number) {
    const shoppingList = await this.shoppingListRepository.findOneOrFail({where: {id: listId}})
    const itemsToDelete = shoppingList.items.filter(item => !item.isStaple)
    await this.listItemRepository.remove(itemsToDelete)
    await this.shoppingListRepository.remove([ shoppingList ])
  }


  @UseGuards(JwtAuthGuard)
  @Get('shopping-lists')
  async getShoppingLists(): Promise<ShoppingListFrontend[]> {
    const allLists = await this.shoppingListRepository.find({loadEagerRelations: false})
    return allLists.map(({id, createdBy, createdAt}) => ({id, createdBy, createdAt}))
  }

  @UseGuards(JwtAuthGuard)
  @Post('shopping-lists/:listId/items')
  async addItemToList(@Param('listId', ParseIntPipe) listId: number, @Request() req: ExtendedRequest<{
    item: { name: string }
  }>): Promise<ListItemFrontend> {
    const shoppingList = await this.shoppingListRepository.findOneOrFail({where: {id: listId}})
    const newItem = new ListItem(req.user.username, req.body.item.name)
    shoppingList.items.push(newItem)
    await this.shoppingListRepository.save(shoppingList)
    return {id: newItem.id, name: newItem.name}
  }

  @UseGuards(JwtAuthGuard)
  @Get('shopping-lists/:listId/items')
  async getListItems(@Param('listId', ParseIntPipe) listId: number): Promise<ListItemFrontend[]> {
    const shoppingList = await this.shoppingListRepository.findOneOrFail({where: {id: listId}})
    return shoppingList.items.map(({id, name}) => ({id, name}))
  }


  @UseGuards(JwtAuthGuard)
  @Delete('shopping-lists/:listId/items/:itemId')
  async deleteItemFromList(@Param('listId', ParseIntPipe) listId: number, @Param('itemId', ParseIntPipe) itemId: number) {
    const shoppingList = await this.shoppingListRepository.findOneOrFail({where: {id: listId}})
    const itemToDelete = shoppingList.items.find(item => item.id === itemId)
    shoppingList.items = shoppingList.items.filter(item => item !== itemToDelete)
    await this.shoppingListRepository.save(shoppingList)
    if (!itemToDelete.isStaple) {
      await this.listItemRepository.delete(itemToDelete.id)
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('staples')
  async getStaples(): Promise<ListItemFrontend[]> {
    const staples = await this.listItemRepository.find({where: {isStaple: true}})
    return staples.map(({id, name}) => ({id, name}))
  }

  @UseGuards(JwtAuthGuard)
  @Post('staples')
  async createStaple(@Request() req: ExtendedRequest<{ staple: { name: string } }>): Promise<ListItemFrontend> {
    const {id, name} = (await this.listItemRepository.save(new ListItem(req.user.username, req.body.staple.name, true)))
    return {id, name}
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

type ListItemFrontend = { name: string, id: number }
