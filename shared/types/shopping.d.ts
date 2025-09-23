export type ListItemFrontend = {
  name: string,
  id: number,
  quantity?: number,
  quantityUnit?: QuantityUnit
}

export type SavedListItem = ListItemFrontend & {
  addedCounter: number
}

export type ShopCategory = 'GROCERY' | 'DRUG_STORE'

export type QuantityUnit = 'ML' | 'G' | 'PCS'