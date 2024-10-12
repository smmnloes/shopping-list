import axios, { AxiosRequestConfig } from 'axios'
import { AuthStatus } from '../services/auth-provider.tsx'
import { ListWithItems, ShopCategory } from '../types/types.ts'

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

export const getAllShoppingLists = async (category: ShopCategory) => {
  return axios.get(`${ backendHost }/api/shopping-lists`, {params: {category}, ...config}).then(response => response.data)
}

export const createNewList = async (category: ShopCategory) => {
  return axios.post(`${ backendHost }/api/shopping-lists`, {category}, config).then(response => response.data)
}

export const deleteList = async (listId: number) => {
  return axios.delete(`${ backendHost }/api/shopping-lists/${ listId }`, config).then(response => response.data)
}

export const getListWithItems = async (listId: string): Promise<ListWithItems> => {
  return axios.get(`${ backendHost }/api/shopping-lists/${ listId }`, config).then(response => response.data)
}

export const addItemToList = async (name: string, listId: string) => {
  return axios.post(`${ backendHost }/api/shopping-lists/${ listId }/items`, {item: {name}}, config).then(response => response.data)
}

export const removeItemFromList = async (itemId: string, listId: string) => {
  return axios.delete(`${ backendHost }/api/shopping-lists/${ listId }/items/${ itemId }`, config).then(response => response.data)
}

export const getStaples = async (category: ShopCategory) => {
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

const config: AxiosRequestConfig = {
  withCredentials: true
}
