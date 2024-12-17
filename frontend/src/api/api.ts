import axios from 'axios'
import { AuthStatus } from '../services/auth-provider.tsx'
import { ListItem, LocationFrontendView, NoteDetails, NoteOverview, ShopCategory } from '../types/types.ts'
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

export const getMealsForWeek = async (week: number, year: number): Promise<{ meals: string[], checks: boolean[] }> => {
  return axiosInstance.get(`${ backendHost }/api/meals/${ week }-${ year }`).then(response => response.data)
}

export const saveMealsForWeek = async (week: number, year: number, meals: string[], checks: boolean[]): Promise<void> => {
  return axiosInstance.post(`${ backendHost }/api/meals/${ week }-${ year }`, { meals, checks })
}


export const getNotes = async (): Promise<{ notes: NoteOverview[] }> => {
  return axiosInstance.get(`${ backendHost }/api/notes`).then(response => response.data)
}

export const getNote = async (id: number): Promise<NoteDetails> => {
  return axiosInstance.get(`${ backendHost }/api/notes/${ id }`).then(response => response.data)
}

export const newNote = async (): Promise<{ id: number }> => {
  return axiosInstance.post(`${ backendHost }/api/notes`).then(response => response.data)
}

export const saveNote = async (id: number, content: string): Promise<void> => {
  return axiosInstance.post(`${ backendHost }/api/notes/${ id }`, { content }).then(response => response.data)
}

export const deleteNote = async (id: number): Promise<void> => {
  return axiosInstance.delete(`${ backendHost }/api/notes/${ id }`).then(response => response.data)
}

export const setNoteVisibility = async (id: number, visible: boolean): Promise<void> => {
  return axiosInstance.post(`${ backendHost }/api/notes/${ id }/visibility`, { visible }).then(response => response.data)
}

export const postLocation = async (lat: number, lng: number, type: string): Promise<LocationFrontendView> => {
  return axiosInstance.post(`${ backendHost }/api/locations`, { lat, lng, type }).then(response => response.data)
}

export const getLocation = async (type: string): Promise<LocationFrontendView> => {
  return axiosInstance.get(`${ backendHost }/api/locations`, { params: { type } }).then(response => response.data)
}