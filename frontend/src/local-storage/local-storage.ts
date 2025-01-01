import type { ShopCategory } from '../../../shared/types/shopping.ts'

export type CheckedItem = { id: number, category: ShopCategory }
export const CHECKED_ITEMS_KEY = 'checkedItems'

export type NOTES_ORDER = { sortCriteria: number, ordering: number }
export const NOTES_ORDER_KEY = 'notesOrder'

export const getStoredValueForKey = (key: string): any | null => {
  const values = localStorage.getItem(key)
  if (values === null) {
    console.log('No values found, returning null')
    return null
  }
  return JSON.parse(values) as CheckedItem[]
}


export const storeValueForKey =
  (key: string, value: any): void => {
    localStorage.setItem(key, JSON.stringify(value))
  }