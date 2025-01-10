import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ListItem } from '../../data/entities/list-item'
import { Repository } from 'typeorm'
import { ShopCategory } from '../../../../shared/types/shopping'


@Injectable()
export class SuggestionsService {

  constructor(@InjectRepository(ListItem) readonly listItemRepository: Repository<ListItem>) {
  }

  public async getSuggestions(category: ShopCategory, input: string): Promise<ListItem[]> {
    const allItems: ListItem[] = [
      { name: 'MockItem 1', id: 1, isStaple: false, shopCategory: 'GROCERY', createdAt: new Date(), shoppingLists: [] },
      { name: 'MockItem 2', id: 2, isStaple: false, shopCategory: 'GROCERY', createdAt: new Date(), shoppingLists: [] },
      {
        name: 'Mockstaple 1',
        id: 3,
        isStaple: true,
        shopCategory: 'GROCERY',
        createdAt: new Date(),
        shoppingLists: []
      },
      { name: 'Mockstaple 2', id: 4, isStaple: true, shopCategory: 'GROCERY', createdAt: new Date(), shoppingLists: [] }
    ]
  return allItems.filter(item => item.name.toLowerCase().includes(input.toLowerCase()))
  }



}