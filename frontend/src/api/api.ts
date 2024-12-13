import axios from 'axios'
import { AuthStatus } from '../services/auth-provider.tsx'
import { ListItem, Note, NoteOverview, ShopCategory } from '../types/types.ts'
import axiosRetry from 'axios-retry'

const backendHost = import.meta.env.VITE_BACKEND_HOST


const axiosInstance = axios.create({
  withCredentials: true
})
axiosRetry(axiosInstance, { retries: 3, retryDelay: axiosRetry.exponentialDelay })

export const register = async (registrationReq: {
  credentials: { username: string, password: string },
  registrationSecret: string
}): Promise<AuthStatus> => {
  return axiosInstance.post(`${ backendHost }/api/auth/register`, registrationReq).then(response => response.data)
}

export const login = async (username: string, password: string): Promise<AuthStatus> => {
  return axiosInstance.post(`${ backendHost }/api/auth/login`, { username, password }).then(response => response.data)
}

export const logout = async () => {
  return axiosInstance.post(`${ backendHost }/api/auth/logout`, {}).then(response => response.data)
}

export const getAuthStatus = async (): Promise<AuthStatus> => {
  return axiosInstance.get(`${ backendHost }/api/auth`).then(response => response.data)
}

export const getItemsForCategory = async (category: ShopCategory): Promise<{ items: ListItem[] }> => {
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

export const getStaples = async (category: ShopCategory): Promise<ListItem[]> => {
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

export const onlineStatus = async () => {
  return axiosInstance.get(`${ backendHost }/api/onlinestatus`)
}

export const getServerVersion = async (): Promise<string> => {
  return axiosInstance.get(`${ backendHost }/api/version`).then(response => response.data)
}

export const getMealsForWeek = (week: number, year: number): Promise<{ meals: string[], checks: boolean[] }> => {
  return axiosInstance.get(`${ backendHost }/api/meals/${ week }-${ year }`).then(response => response.data)
}

export const saveMealsForWeek = (week: number, year: number, meals: string[], checks: boolean[]): Promise<void> => {
  return axiosInstance.post(`${ backendHost }/api/meals/${ week }-${ year }`, { meals, checks })
}


export const getNotes = (): Promise<{ notes: NoteOverview[] }> => {
  return axiosInstance.get(`${ backendHost }/api/notes`).then(response => response.data)
}

export const getNote = (id: number): Promise<Note> => {
  return axiosInstance.get(`${ backendHost }/api/notes/${ id }`).then(response => response.data)
}

export const newNote = (): Promise<{ id: number }> => {
  return axiosInstance.post(`${ backendHost }/api/notes`).then(response => response.data)
}

export const saveNote = (id: number, content: string): Promise<void> => {
  return axiosInstance.post(`${ backendHost }/api/notes/${ id }`, { content }).then(response => response.data)
}

export const deleteNote = (id: number): Promise<void> => {
  return axiosInstance.delete(`${ backendHost }/api/notes/${ id }`).then(response => response.data)
}