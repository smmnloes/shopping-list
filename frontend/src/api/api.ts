import axios, { AxiosRequestConfig } from 'axios'


export const login = async (username: string, password: string) => {
  return axios.post('http://localhost:3000/auth/login', {username, password})
}

export const getAllShoppingLists = async () => {
  return axios.get('http://localhost:3000/api/shopping-lists', config)
}

export const createNewList = async () => {
  return axios.post('http://localhost:3000/api/shopping-lists', {}, config)
}

const config: AxiosRequestConfig = {
  withCredentials: true
}