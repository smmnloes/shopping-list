
export type CheckedItemId = string

const CHECKED_ITEMS_KEY = 'checkedItems'


export const getCheckedItemIdsFromLocal =
  (): CheckedItemId[] => {
    const allCheckedItems = localStorage.getItem(CHECKED_ITEMS_KEY)
    if (allCheckedItems === null) {
      console.error('Error while fetching all checked items')
      return []
    }
    return JSON.parse(allCheckedItems) as CheckedItemId[]
  }


export const setCheckedItemsToLocal =
  (checkedItems: CheckedItemId[]): void => {
    localStorage.setItem(CHECKED_ITEMS_KEY, JSON.stringify(checkedItems))
    console.log('Updated checked items')
  }