import { ShopCategory } from '../types/types.ts'

export type CheckedItem = {id: number, category: ShopCategory}

const CHECKED_ITEMS_KEY = 'checkedItems'


export const getCheckedItemIdsFromLocal =
  (): CheckedItem[] => {
    const allCheckedItems = localStorage.getItem(CHECKED_ITEMS_KEY)
    if (allCheckedItems === null) {
      console.error('Error while fetching all checked items')
      return []
    }
    return  JSON.parse(allCheckedItems) as CheckedItem[]
  }


export const setCheckedItemsToLocal =
  (checkedItems: CheckedItem[]): void => {
      localStorage.setItem(CHECKED_ITEMS_KEY, JSON.stringify(checkedItems))
    console.log('Updated checked items')
  }