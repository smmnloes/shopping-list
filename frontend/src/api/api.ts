import axios, { AxiosRequestConfig } from 'axios'
import { AuthStatus } from '../services/auth-provider.tsx'
import { ListItem, ShopCategory } from '../types/types.ts'

const backendHost = import.meta.env.VITE_BACKEND_HOST

export const login = async (username: string, password: string): Promise<AuthStatus> => {
  return axios.post(`${ backendHost }/api/auth/login`, {username, password}, config).then(response => response.data)
}

export const logout = async () => {
  return axios.post(`${ backendHost }/api/auth/logout`, {}, config).then(response => response.data)
}

export const getAuthStatus = async (): Promise<AuthStatus> => {
  return axios.get(`${ backendHost }/api/auth`, config).then(response => response.data)
}

export const getItemsForCategory = async (category: ShopCategory): Promise<{items: ListItem[]}> => {
  return axios.get(`${ backendHost }/api/shopping-lists/${ category }`, config).then(response => response.data)
}

export const createNewItemForCategory = async (name: string, category: ShopCategory) => {
  return axios.post(`${ backendHost }/api/shopping-lists/${ category }/items`, {item: {name}}, config).then(response => response.data)
}

export const addStaplesToCategoryList = (stapleIdsToAdd: string[], category: ShopCategory)=> {
  return axios.post(`${ backendHost }/api/shopping-lists/${ category }/staples`, {ids: stapleIdsToAdd}, config).then(response => response.data)
}

export const removeItemFromCategory = async (itemId: string, category:ShopCategory) => {
  return axios.delete(`${ backendHost }/api/shopping-lists/${ category }/items/${ itemId }`, config).then(response => response.data)
}

export const getStaples = async (category: ShopCategory): Promise<ListItem[]> => {
  return axios.get(`${ backendHost }/api/staples`, {params: {category}, ...config}).then(response => response.data)
}

export const createStaple = async (stapleName: string, category: ShopCategory) => {
  return axios.post(`${ backendHost }/api/staples`, {
    staple: {
      name: stapleName,
      category
    }
  }, config).then(response => response.data)
}
export const deleteStaple = async (stapleId: string) => {
  return axios.delete(`${ backendHost }/api/staples/${ stapleId }`, config).then(response => response.data)
}

export const onlineStatus = async () => {
  return axios.get(`${ backendHost }/api/onlinestatus`, config)
}

export const getMealsForWeek = (week: number, year: number): Promise<{meals: (string | null)[]}> => {
  return axios.get(`${ backendHost }/api/meals/${week}-${year}`, config).then(response => response.data)
}

const config: AxiosRequestConfig = {
  withCredentials: true
}
