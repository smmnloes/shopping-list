import { axiosInstance, backendHost } from './api.ts'
import type {  MealsForWeek } from '../../../shared/types/meals.ts'

export const getMealsForWeek = async (week: number, year: number): Promise<MealsForWeek> => {
  return axiosInstance.get(`${ backendHost }/api/meals/${ week }-${ year }`).then(response => response.data)
}

export const saveMealsForWeek = async (week: number, year: number, meals: string[], checks: boolean[]): Promise<void> => {
  return axiosInstance.post(`${ backendHost }/api/meals/${ week }-${ year }`, { meals, checks })
}

