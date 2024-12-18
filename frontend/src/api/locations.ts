import type {  LocationFrontendView } from '../../../shared/types/location.ts'
import { axiosInstance, backendHost } from './api.ts'


export const postLocation = async (lat: number, lng: number, type: string): Promise<LocationFrontendView> => {
  return axiosInstance.post(`${ backendHost }/api/locations`, { lat, lng, type }).then(response => response.data)
}

export const getLocation = async (type: string): Promise<LocationFrontendView> => {
  return axiosInstance.get(`${ backendHost }/api/locations`, { params: { type } }).then(response => response.data)
}