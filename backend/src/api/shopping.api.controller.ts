import { Controller, Delete, Get, Inject, Param, ParseIntPipe, Post, Put, Request, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt.guard'
import { In, Repository } from 'typeorm'
import { ShoppingList } from '../data/entities/shopping-list'
import { ListItem } from '../data/entities/list-item'
import { ExtendedJWTGuardRequest } from '../util/request-types'
import { InjectRepository } from '@nestjs/typeorm'
import type { ListItemFrontend, SavedListItem, ShopCategory } from '../../../shared/types/shopping'
import { SuggestionsService } from './services/suggestions-service'

@Controller('api')
export class ShoppingApiController {
  constructor(
    @InjectRepository(ShoppingList) readonly shoppingListRepository: Repository<ShoppingList>,
    @InjectRepository(ListItem) readonly listItemRepository: Repository<ListItem>,
    @Inject() readonly suggestionsService: SuggestionsService
  ) {
  }

  @UseGuards(JwtAuthGuard)
  @Post('shopping-lists/:category/items')
  async createNewItem(@Param('category') category: ShopCategory, @Request() req: ExtendedJWTGuardRequest<{
    item: { name: string }
  }>): Promise<ListItemFrontend> {
    const newItem = new ListItem(req.body.item.name, category)
    await this.listItemRepository.save(newItem)
    return { id: newItem.id, name: newItem.name }
  }

  @UseGuards(JwtAuthGuard)
  @Put('shopping-lists/:category/items')
  async addExistingItemsToList(@Param('category') category: ShopCategory, @Request() req: ExtendedJWTGuardRequest<{
    ids: number[]
  }>): Promise<void> {
    const shoppingList = await this.getOrCreateListForCategory(category)
    const itemsToAdd = await this.listItemRepository.find({ where: { id: In(req.body.ids) } })
    shoppingList.items.push(...itemsToAdd)
    await this.shoppingListRepository.save(shoppingList, {})
    await this.listItemRepository.save(itemsToAdd.map(item => ({
      ...item,
      addedCounter: item.addedCounter + 1,
      lastAddedAt: new Date()
    })))
  }

  @UseGuards(JwtAuthGuard)
  @Get('shopping-lists/:category')
  async getItemsForCategory(@Param('category') category: ShopCategory): Promise<{ items: ListItemFrontend[] }> {
    const shoppingList = await this.getOrCreateListForCategory(category)
    const sortedByLastAdded = [ ...shoppingList.items ].sort((itemA, itemB) => (itemA.lastAddedAt?.getTime() ?? 0) - (itemB.lastAddedAt?.getTime() ?? 0))
    return { items: sortedByLastAdded.map(({ id, name }) => ({ id, name })) }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('shopping-lists/:category/items')
  async deleteItemsFromCategoryBulk(@Param('category') category: ShopCategory, @Request() req: ExtendedJWTGuardRequest<{
    ids: number[]
  }>) {
    const shoppingList = await this.getOrCreateListForCategory(category)

    shoppingList.items = shoppingList.items.filter(item => !req.body.ids.includes(item.id))
    await this.shoppingListRepository.save(shoppingList)
  }

  @UseGuards(JwtAuthGuard)
  @Post('shopping-lists/:category/suggestions')
  async getSuggestions(@Param('category') category: ShopCategory, @Request() req: ExtendedJWTGuardRequest<{
    input: string,
    addedItemIds: number[]
  }>): Promise<ListItemFrontend[]> {
    return this.suggestionsService.getSuggestions(category, req.body.input, req.body.addedItemIds)
      .then(items => items.map((
        {
          id,
          name,
        }) => (
        {
          id,
          name,
        })))
  }

  @UseGuards(JwtAuthGuard)
  @Get('shopping-lists/saved/:category')
  async getAllSavedItems(@Param('category') category: ShopCategory): Promise<{ items: SavedListItem[] }> {
    const items = await this.listItemRepository.find({ where: { shopCategory: category } })
    const mapped: SavedListItem[] = items.map(({ name, id, addedCounter }) => ({ name, id, addedCounter }))
    const sorted = [ ...mapped.sort((a, b) => a.name.localeCompare(b.name)) ]
    return { items: sorted }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('shopping-lists/saved/:itemId')
  async deleteSavedItem(@Param('itemId', ParseIntPipe) itemId: number){
    await this.listItemRepository.remove({id: itemId} as ListItem)
  }

  /**
   * @param category
   * @private
   */
  private async getOrCreateListForCategory(category: ShopCategory): Promise<ShoppingList> {
    const shoppingLists = await this.shoppingListRepository.find({ where: { shopCategory: category } })
    if (shoppingLists.length === 0) {
      console.error(`No list for category ${ category } found, creating one`)
      const newList = new ShoppingList(category, [])
      await this.shoppingListRepository.save(newList)
      return newList
    }
    if (shoppingLists.length > 1) {
      console.error(`More than 1 list found for category ${ category }. Picking first one`)
    }
    return shoppingLists[0]
  }

}
