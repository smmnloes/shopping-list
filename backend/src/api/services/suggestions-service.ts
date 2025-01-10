import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ListItem } from '../../data/entities/list-item'
import { Repository } from 'typeorm'
import { ShopCategory } from '../../../../shared/types/shopping'
import uniqBy from 'lodash.uniqby'

@Injectable()
export class SuggestionsService {

  cachedItems: ListItem[] = null

  constructor(@InjectRepository(ListItem) readonly listItemRepository: Repository<ListItem>) {
  }

  public async getSuggestions(category: ShopCategory, input: string): Promise<ListItem[]> {
    const allItems = await this.getAllItems()
    // String distance?
    return allItems.filter(item => item.shopCategory === category && item.name.toLowerCase().includes(input.toLowerCase()))
  }

  private async getAllItems(): Promise<ListItem[]> {
    if (this.cachedItems === null) {
      console.log('loading all items into cache')
      this.cachedItems = await this.listItemRepository.find().then(items => this.processItems(items))
    }
    return this.cachedItems
  }

  private processItems(items: ListItem[]): ListItem[] {
    const startTime = new Date().getTime()
    const trimmed = items.map((item) => ({...item, name: item.name.trim()}))
    const staples = trimmed.filter(item => item.isStaple)
    const nonStaples = trimmed.filter(item => !item.isStaple)
    // step 1: remove all the items that duplicate staples
    const withoutStapleDuplicates = nonStaples.filter(nonStaple => !staples.find(staple => this.laxEquals(staple, nonStaple)))
    // step 2 remove reaining duplicates
    const withoutAnyDuplicates = uniqBy(withoutStapleDuplicates, this.listItemLaxComparable)
    const combined = [ ...staples, ...withoutAnyDuplicates ]
    console.log('Time taken: ' + (new Date().getTime() - startTime) + ' ms')
    console.log(JSON.stringify(combined.map(c => c.name), null, 4))
    return combined
  }

  private listItemLaxComparable(item: ListItem): string {
    return item.name.toLowerCase()
  }

  private laxEquals(itemA: ListItem, itemB: ListItem) {
    return this.listItemLaxComparable(itemA) === this.listItemLaxComparable(itemB)
  }

  public async onModuleInit() {
    await this.getAllItems()
  }
}