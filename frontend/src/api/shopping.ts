import type {  ListItemFrontend, ShopCategory } from '../../../shared/types/shopping.ts'
import { axiosInstance, backendHost } from './api.ts'

export const getItemsForCategory = async (category: ShopCategory): Promise<{ items: ListItemFrontend[] }> => {
  return axiosInstance.get(`${ backendHost }/api/shopping-lists/${ category }`).then(response => response.data)
}

export const createNewItemForCategory = async (name: string, category: ShopCategory) => {
  return axiosInstance.post(`${ backendHost }/api/shopping-lists/${ category }/items`, { item: { name } }).then(response => response.data)
}

export const addStaplesToCategoryList = (stapleIdsToAdd: number[], category: ShopCategory) => {
  return axiosInstance.post(`${ backendHost }/api/shopping-lists/${ category }/staples`, { ids: stapleIdsToAdd }).then(response => response.data)
}

export const deleteItemsFromCategoryBulk = async (itemIds: number[], category: ShopCategory) => {
  return axiosInstance.delete(`${ backendHost }/api/shopping-lists/${ category }/items`, {
    data: { ids: itemIds }
  }).then(response => response.data)
}

export const getStaples = async (category: ShopCategory): Promise<ListItemFrontend[]> => {
  return axiosInstance.get(`${ backendHost }/api/staples`, { params: { category } }).then(response => response.data)
}

export const createStaple = async (stapleName: string, category: ShopCategory) => {
  return axiosInstance.post(`${ backendHost }/api/staples`, {
    staple: {
      name: stapleName,
      category
    }
  }).then(response => response.data)
}
export const deleteStaple = async (stapleId: number) => {
  return axiosInstance.delete(`${ backendHost }/api/staples/${ stapleId }`).then(response => response.data)
}
