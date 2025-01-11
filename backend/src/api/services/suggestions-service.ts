import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ListItem } from '../../data/entities/list-item'
import { Repository } from 'typeorm'
import { ShopCategory } from '../../../../shared/types/shopping'

@Injectable()
export class SuggestionsService {
  readonly MAX_SUGGESTIONS = 10

  constructor(@InjectRepository(ListItem) readonly listItemRepository: Repository<ListItem>) {
  }

  public async getSuggestions(category: ShopCategory, input: string, addedItemIds: number[]): Promise<ListItem[]> {
    const allItems = await this.listItemRepository.find({ where: { shopCategory: category } })
    const addedItems = addedItemIds.map(id => allItems.find(item => item.id === id)).filter(Boolean)
    const withoutAddedItems = allItems.filter(item => !this.alreadyAdded(item, addedItems))

    const processed = this.processItems(withoutAddedItems)
    const sortedByAddedCounter = [ ...processed ].sort((itemA, itemB) => itemB.addedCounter - itemA.addedCounter)

    const filtered = sortedByAddedCounter.filter(item =>
      item.shopCategory === category
      // String distance?
      && item.name.toLowerCase().includes(input.toLowerCase())
    )

    return filtered.slice(0, this.MAX_SUGGESTIONS)
  }

  private alreadyAdded(item: ListItem, alreadyAddedItems: ListItem[]): boolean {
    // Check if the item in question is already added to the list, do fuzzy check by name (String distance?)
    return !!alreadyAddedItems.find(addedItem => this.laxEquals(addedItem, item))
  }

  private processItems(items: ListItem[]): ListItem[] {
    const trimmed = items.map((item) => ({ ...item, name: item.name.trim() }))

    // Eliminate any duplicates in the item set (check by name).
    // Precedence: If addedCounter is higher, always take that element. If added counter is same, staple has precedence
    return trimmed.reduce((acc: ListItem[], current: ListItem) => {
      const alreadySeenIndex = acc.findIndex(item => this.laxEquals(item, current))
      if (alreadySeenIndex === -1) {
        acc.push(current)
        return acc
      }
      const alreadySeen = acc[alreadySeenIndex]
      if (current.addedCounter > alreadySeen.addedCounter || (current.addedCounter === alreadySeen.addedCounter && current.isStaple && !alreadySeen.isStaple)) {
        acc[alreadySeenIndex] = current
      }
      return acc
    }, [])
  }

  private listItemLaxComparable(item: ListItem): string {
    return item.name.toLowerCase()
  }

  private laxEquals(itemA: ListItem, itemB: ListItem) {
    return this.listItemLaxComparable(itemA) === this.listItemLaxComparable(itemB)
  }
}