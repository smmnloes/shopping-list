// TODO think about type sharing

export interface ListItem {
  id: number
  name: string
  isStaple: boolean
}

export type ListWithItems = { id: number, category: ShopCategory, items: ListItem[] }

export enum ShopCategory {
  GROCERY = 'GROCERY',
  DRUG_STORE = 'DRUG_STORE'
}

export const configForCategory = {
  [ShopCategory.GROCERY]: {iconPath: '/rewe_logo.svg'},
  [ShopCategory.DRUG_STORE]: {iconPath: '/dm_logo.svg'}
}

export type Note = {
  id: number
  createdAt: string
  lastUpdatedAt: string
  lastUpdatedBy: string
  createdBy: string
  content: string
}

export type NoteOverview = {
  id: number
  title: string
  createdAt: string
  lastUpdatedAt: string
  lastUpdatedBy: string
  createdBy: string
}

