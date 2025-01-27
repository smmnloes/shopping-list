import { axiosInstance, backendHost } from './api.ts'
import { TakeoutStateFrontend } from '../../../shared/types/takeout'


export const claimPayment = async (): Promise<void> => {
  return axiosInstance.post(`${ backendHost }/api/takeout/claim`)
}

export const confirmPayment = async (): Promise<void> => {
  return axiosInstance.post(`${ backendHost }/api/takeout/confirm`)
}

export const getCurrentTakeoutState = async (): Promise<TakeoutStateFrontend> => {
  return axiosInstance.get(`${ backendHost }/api/takeout`).then(response => response.data)
}