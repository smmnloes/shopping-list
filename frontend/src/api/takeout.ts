import { axiosInstance, backendHost } from './api.ts'
import { TakeoutStateFrontend } from '../../../shared/types/takeout'


export const switchTakeout = async (): Promise<void> => {
  return axiosInstance.post(`${ backendHost }/api/takeout`)
}

export const getCurrentTakeoutState = async (): Promise<TakeoutStateFrontend> => {
  return axiosInstance.get(`${ backendHost }/api/takeout`).then(response => response.data)
}