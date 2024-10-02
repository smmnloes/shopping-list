import { Controller, Get, Param, Render, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt.guard'
import { Repository } from 'typeorm'
import { ShoppingList } from '../data/entities/shopping-list'
import { formatDate } from '../util/date-time-format'
import { InjectRepository } from '@nestjs/typeorm'

@Controller()
export class ViewsController {
  constructor(
    @InjectRepository(ShoppingList)
    private readonly shoppingListsRepository: Repository<ShoppingList>) {
  }

  @Render('login')
  @Get('login')
  login() {
  }

  @UseGuards(JwtAuthGuard)
  @Render('shopping-lists')
  @Get()
  async shoppingLists(): Promise<{ shoppingLists: ShoppingListFrontend[] }> {
    const allLists = await this.shoppingListsRepository.find()
    const allListsMapped: ShoppingListFrontend[] = allLists.map(item => ({
      id: item.id,
      createdAt: formatDate(item.createdAt),
      createdBy: item.createdBy,
    }))
    return {shoppingLists: allListsMapped}
  }

  @UseGuards(JwtAuthGuard)
  @Render('shopping-list-edit')
  @Get('shopping-lists/:id')
  async getShoppingList(@Param('id') id: number): Promise<{ items: string[] }> {
    const {items} = await this.shoppingListsRepository.findOneOrFail({where: {id}})
    return {items: items?.map(item => item.name) || []}
  }
}


export type ShoppingListFrontend = {
  id: number,
  createdAt: string,
  createdBy: string,
}