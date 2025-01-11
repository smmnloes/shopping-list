import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ListItem } from '../../data/entities/list-item'
import { Repository } from 'typeorm'
import { ShopCategory } from '../../../../shared/types/shopping'
import uniqBy from 'lodash.uniqby'

@Injectable()
export class SuggestionsService {
  readonly MAX_SUGGESTIONS = 10

  constructor(@InjectRepository(ListItem) readonly listItemRepository: Repository<ListItem>) {
  }

  public async getSuggestions(category: ShopCategory, input: string, addedItemIds: number[]): Promise<ListItem[]> {
    const allItems = await this.listItemRepository.find()
    const addedItems = addedItemIds.map(id => allItems.find(item => item.id === id)).filter(Boolean)
    const withoutAddedItems = allItems.filter(item => !this.alreadyAdded(item, addedItems))
    const processed = this.processItems(withoutAddedItems)
    // String distance?
    return processed.filter(item =>
      item.shopCategory === category
      && item.name.toLowerCase().includes(input.toLowerCase())
    ).slice(0, this.MAX_SUGGESTIONS)
  }

  private alreadyAdded(item: ListItem, alreadyAddedItems: ListItem[]): boolean {
    // Check if the item in question is already added to the list, do fuzzy check by name (String distance?)
    return !!alreadyAddedItems.find(addedItem => this.laxEquals(addedItem, item))
  }
  private processItems(items: ListItem[]): ListItem[] {
    const trimmed = items.map((item) => ({ ...item, name: item.name.trim() }))
    const staples = trimmed.filter(item => item.isStaple)
    const nonStaples = trimmed.filter(item => !item.isStaple)
    // step 1: remove all the items that duplicate staples
    const withoutStapleDuplicates = nonStaples.filter(nonStaple => !staples.find(staple => this.laxEquals(staple, nonStaple)))
    // step 2 remove reaining duplicates
    const withoutAnyDuplicates = uniqBy(withoutStapleDuplicates, this.listItemLaxComparable)
    return [ ...staples, ...withoutAnyDuplicates ]
  }

  private listItemLaxComparable(item: ListItem): string {
    return item.name.toLowerCase()
  }

  private laxEquals(itemA: ListItem, itemB: ListItem) {
    return this.listItemLaxComparable(itemA) === this.listItemLaxComparable(itemB)
  }
}