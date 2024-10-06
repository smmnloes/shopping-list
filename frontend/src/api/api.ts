import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { AuthStatus } from '../services/auth-provider.tsx'

const backendHost = import.meta.env.VITE_BACKEND_HOST

export const login = async (username: string, password: string): Promise<AxiosResponse<AuthStatus>> => {
  return axios.post(`${backendHost}/api/auth/login`, {username, password}, config)
}

export const getAuthStatus = async (): Promise<AxiosResponse<AuthStatus>> => {
  return axios.get(`${backendHost}/api/auth`, config)
}

export const getAllShoppingLists = async () => {
  return axios.get(`${backendHost}/api/shopping-lists`, config)
}

export const createNewList = async () => {
  return axios.post(`${backendHost}/api/shopping-lists`, {}, config)
}

export const deleteList = async (listId: number) => {
  return axios.delete(`${backendHost}/api/shopping-lists/${listId}`, config)
}

export const getListItems = async (listId: string) => {
  return axios.get(`${backendHost}/api/shopping-lists/${ listId }/items`, config)
}

export const addItemToList = async (listId: string, name: string) => {
  return axios.post(`${backendHost}/api/shopping-lists/${ listId }/items`, {item: {name}}, config)
}

export const removeItemFromList = async (listId: string, itemId: string) => {
  return axios.delete(`${backendHost}/api/shopping-lists/${ listId }/items/${ itemId }`, config)
}

export const getStaples = async () => {
  return axios.get(`${backendHost}/api/staples`, config)
}

export const createStaple = async (stapleName: string) => {
  return axios.post(`${backendHost}/api/staples`, {staple: {name: stapleName}}, config)
}
export const deleteStaple = async (stapleId: string) => {
  return axios.delete(`${backendHost}/api/staples/${stapleId}`, config)
}

const config: AxiosRequestConfig = {
  withCredentials: true
}