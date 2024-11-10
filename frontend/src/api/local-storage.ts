import { ShopCategory } from '../types/types.ts'

export type CheckedItem = { itemId: string, category: ShopCategory }

const CHECKED_ITEMS_KEY = 'checkedItems'


export const getCheckedItemsFromLocal =
  (category: ShopCategory): CheckedItem[] => {
    const allCheckedItems = localStorage.getItem(CHECKED_ITEMS_KEY)
    if (allCheckedItems === null) {
      console.error('Error while fetching all checked items')
      return []
    }
    const allCheckedItemsParsed = JSON.parse(allCheckedItems) as CheckedItem[]
    return allCheckedItemsParsed.filter(item => item.category === category)
  }


export const setCheckedItemsToLocal =
  (checkedItems: CheckedItem[]): void => {
    localStorage.setItem(CHECKED_ITEMS_KEY, JSON.stringify(checkedItems))
    console.log('Updated checked items')
  }