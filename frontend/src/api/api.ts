import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { AuthStatus } from '../services/auth-provider.tsx'

const backendHost = import.meta.env.VITE_BACKEND_HOST

export const login = async (username: string, password: string): Promise<AxiosResponse<AuthStatus>> => {
  return axios.post(`${ backendHost }/api/auth/login`, {username, password}, config)
}

export const getAuthStatus = async (): Promise<AxiosResponse<AuthStatus>> => {
  return axios.get(`${ backendHost }/api/auth`, config)
}

export const getAllShoppingLists = async () => {
  return axios.get(`${ backendHost }/api/shopping-lists`, config)
}

export const createNewList = async () => {
  return axios.post(`${ backendHost }/api/shopping-lists`, {}, config)
}

export const deleteList = async (listId: number) => {
  return axios.delete(`${ backendHost }/api/shopping-lists/${ listId }`, config)
}

export const getListItems = async (listId: string) => {
  return axios.get(`${ backendHost }/api/shopping-lists/${ listId }/items`, config).then(response => response.data)
}

export const addItemToList = async (name: string, listId: string) => {
  return axios.post(`${ backendHost }/api/shopping-lists/${ listId }/items`, {item: {name}}, config).then(response => response.data)
}

export const removeItemFromList = async (itemId: string, listId: string) => {
  return axios.delete(`${ backendHost }/api/shopping-lists/${ listId }/items/${ itemId }`, config).then(response => response.data)
}

export const getStaples = async () => {
  return axios.get(`${ backendHost }/api/staples`, config).then(response => response.data)
}

export const createStaple = async (stapleName: string) => {
  return axios.post(`${ backendHost }/api/staples`, {staple: {name: stapleName}}, config).then(response => response.data)
}
export const deleteStaple = async (stapleId: string) => {
  return axios.delete(`${ backendHost }/api/staples/${ stapleId }`, config).then(response => response.data)
}

const config: AxiosRequestConfig = {
  withCredentials: true
}