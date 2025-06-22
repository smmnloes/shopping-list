import type { ListItemFrontend, ShopCategory } from '../../../shared/types/shopping.ts'
import { axiosInstance, backendHost } from './api.ts'
import { SavedListItem } from '../../../shared/types/shopping'

export const getItemsForCategory = async (category: ShopCategory): Promise<{ items: ListItemFrontend[] }> => {
  return axiosInstance.get(`${ backendHost }/api/shopping-lists/${ category }`).then(response => response.data)
}

export const createNewItem = async (name: string, category: ShopCategory) => {
  return axiosInstance.post(`${ backendHost }/api/shopping-lists/${ category }/items`, {
    item: {
      name,
    }
  }).then(response => response.data)
}

export const addExistingItemsToList = async (ids: number[], category: ShopCategory) => {
  return axiosInstance.put(`${ backendHost }/api/shopping-lists/${ category }/items`, { ids }).then(response => response.data)
}

export const deleteItemsFromCategoryBulk = async (itemIds: number[], category: ShopCategory) => {
  return axiosInstance.delete(`${ backendHost }/api/shopping-lists/${ category }/items`, {
    data: { ids: itemIds }
  }).then(response => response.data)
}

export const getSuggestions = async (category: ShopCategory, input: string, addedItemIds: number[]): Promise<ListItemFrontend[]> => {
  return axiosInstance.post(`${ backendHost }/api/shopping-lists/${ category }/suggestions`, {
    input,
    addedItemIds
  }).then(response => response.data)
}

export const getAllSavedItems = async (category: ShopCategory): Promise<{ items: SavedListItem[] }> => {
  return axiosInstance.get(`${ backendHost }/api/shopping-lists/saved/${ category }`).then(response => response.data)
}

export const deleteSavedItem = async (itemId: number): Promise<void> => {
  return axiosInstance.delete(`${ backendHost }/api/shopping-lists/saved/${ itemId }`)
}

export const switchItemsToNextCategory = async (ids: number[], category: ShopCategory): Promise<void> => {
  return axiosInstance.patch(`${ backendHost }/api/shopping-lists/${ category }/items`, { ids })
}
