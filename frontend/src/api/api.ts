import axios, { AxiosRequestConfig } from 'axios'


export const login = async (username: string, password: string) => {
  return axios.post('http://localhost:3000/auth/login', {username, password}, config)
}

export const getAllShoppingLists = async () => {
  return axios.get('http://localhost:3000/api/shopping-lists', config)
}

export const createNewList = async () => {
  return axios.post('http://localhost:3000/api/shopping-lists', {}, config)
}

export const getListItems = async (listId: string) => {
  return axios.get(`http://localhost:3000/api/shopping-lists/${ listId }/items`, config)
}

export const addItemToList = async (listId: string, name: string) => {
  return axios.post(`http://localhost:3000/api/shopping-lists/${ listId }/items`, {item: {name}}, config)
}

export const removeItemFromList = async (listId: string, itemId: string) => {
  return axios.delete(`http://localhost:3000/api/shopping-lists/${ listId }/items/${itemId}`, config)
}

const config: AxiosRequestConfig = {
  withCredentials: true
}