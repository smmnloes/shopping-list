export type ListItemFrontend = {
  name: string,
  id: number,
}

export type SavedListItem = ListItemFrontend & {
  addedCounter: number
}

export type ShopCategory = 'GROCERY' | 'DRUG_STORE'
