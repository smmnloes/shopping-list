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
    const addedItems = addedItemIds.map(id => allItems.find(item => item.id === id)).filter(item => item !== undefined)
    const withoutAddedItems = allItems.filter(item => !this.alreadyAdded(item, addedItems))

    const processed = this.processItems(withoutAddedItems)

    const matched = await this.match(input, processed)
    const scored = matched.map(match => ({
      ...match,
      combinedScore: (1 / match.score) * (match.item.addedCounter + 1)
    }))

    const sorted = [ ...scored ].sort((matchA, matchB) =>
      matchB.combinedScore - matchA.combinedScore
    )
    return sorted.map(match => match.item).slice(0, this.MAX_SUGGESTIONS)
  }

  private alreadyAdded(item: ListItem, alreadyAddedItems: ListItem[]): boolean {
    // Check if the item in question is already added to the list, do fuzzy check by name (String distance?)
    return !!alreadyAddedItems.find(addedItem => this.laxEquals(addedItem, item))
  }

  private processItems(items: ListItem[]): ListItem[] {
    const trimmed = items.map((item) => ({ ...item, name: item.name.trim() }))

    // Eliminate any duplicates in the item set (check by name).
    // Precedence: If addedCounter is higher, always take that element.
    return trimmed.reduce((acc: ListItem[], current: ListItem) => {
      const alreadySeenIndex = acc.findIndex(item => this.laxEquals(item, current))
      if (alreadySeenIndex === -1) {
        acc.push(current)
        return acc
      }
      const alreadySeen = acc[alreadySeenIndex]
      if (current.addedCounter > alreadySeen.addedCounter) {
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

  private async match(input: string, items: ListItem[]) {
    const fuseModule = await import('fuse.js')
    const fuse = new fuseModule.default(items, { keys: [ 'name' ], includeScore: true })
    return fuse.search(input)
  }
}