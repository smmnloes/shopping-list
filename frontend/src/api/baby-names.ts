import { axiosInstance, backendHost } from './api.ts'
import {
  BabyNameFrontendView,
  BabyNameResult,
  Gender,
  VoteMatchResult,
  VoteVerdict
} from '../../../shared/types/babynames'
import { isAxiosError } from 'axios'


export const postVote = async (nameId: number, vote: VoteVerdict): Promise<VoteMatchResult> => {
  return axiosInstance.post(`${ backendHost }/api/babynames/vote/${ nameId }`, { vote }).then(response => response.data)
}

export const addName = async (name: string, gender: Gender): Promise<void> => {
  await axiosInstance.put(`${ backendHost }/api/babynames`, { name, gender })
}

export const getRandomName = async (gender: Gender): Promise<BabyNameFrontendView | null> => {
  return axiosInstance.get(`${ backendHost }/api/babynames/randomname/${ gender }`).then(response => response.data).catch(e => {
    if (isAxiosError(e) && e.status === 404) {
      return null
    }
  })
}

export const getResults = async (): Promise<{ results: BabyNameResult[] }> => {
  return axiosInstance.get(`${ backendHost }/api/babynames/results`).then(response => response.data)
}