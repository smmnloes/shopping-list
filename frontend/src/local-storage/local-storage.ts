import type { ShopCategory } from '../../../shared/types/shopping.ts'

export type CheckedItem = { id: number, category: ShopCategory }
export const CHECKED_ITEMS_KEY = 'checkedItems'

export type NOTES_ORDER = { sortCriteria: number, sortOrder: number }
export const NOTES_ORDER_KEY = 'notesOrder'

export const getStoredValueForKey = <T> (key: string): T | null => {
  const values = localStorage.getItem(key)
  if (values === null) {
    console.log('No values found, returning null')
    return null
  }
  return JSON.parse(values) as T
}


export const storeValueForKey =
  <T>(key: string, value: T): void => {
    localStorage.setItem(key, JSON.stringify(value))
  }