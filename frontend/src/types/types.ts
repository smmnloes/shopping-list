export interface ListItem {
  id: string
  name: string
}

export enum ShopCategory {
  GROCERY='GROCERY',
  DRUG_STORE='DRUG_STORE'
}

export const configForCategory = {
  [ShopCategory.GROCERY]: {iconPath: '/rewe_logo.svg'},
  [ShopCategory.DRUG_STORE]: {iconPath: '/dm_logo.svg'}
}