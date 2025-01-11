import type { ListItemFrontend, ShopCategory } from '../../../shared/types/shopping.ts'
import { axiosInstance, backendHost } from './api.ts'

export const getItemsForCategory = async (category: ShopCategory): Promise<{ items: ListItemFrontend[] }> => {
  return axiosInstance.get(`${ backendHost }/api/shopping-lists/${ category }`).then(response => response.data)
}

export const createNewItem = async (name: string, category: ShopCategory, isStaple: boolean) => {
  return axiosInstance.post(`${ backendHost }/api/shopping-lists/${ category }/items`, { item: { name, isStaple } }).then(response => response.data)
}

export const addExistingItemsToList = async (ids: number[], category: ShopCategory) => {
  return axiosInstance.put(`${ backendHost }/api/shopping-lists/${ category }/items`, { ids }).then(response => response.data)
}

export const deleteItemsFromCategoryBulk = async (itemIds: number[], category: ShopCategory) => {
  return axiosInstance.delete(`${ backendHost }/api/shopping-lists/${ category }/items`, {
    data: { ids: itemIds }
  }).then(response => response.data)
}

export const getStaples = async (category: ShopCategory): Promise<ListItemFrontend[]> => {
  return axiosInstance.get(`${ backendHost }/api/staples`, { params: { category } }).then(response => response.data)
}

export const deleteStaple = async (stapleId: number) => {
  return axiosInstance.delete(`${ backendHost }/api/staples/${ stapleId }`).then(response => response.data)
}

export const getSuggestions = async (category: ShopCategory, input: string, addedItemIds: number[]): Promise<ListItemFrontend[]> => {
  return axiosInstance.get(`${ backendHost }/api/shopping-lists/${ category }/suggestions`, { params: { input, addedItemIds } }).then(response => response.data)
}