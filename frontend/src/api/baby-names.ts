import { axiosInstance, backendHost } from './api.ts'
import { BabyNameFrontendView, BabyNameResult, Gender, VoteVerdict } from '../../../shared/types/babynames'


export const postVote = async (nameId: number, vote: VoteVerdict): Promise<void> => {
  return axiosInstance.post(`${ backendHost }/api/babynames/vote/${ nameId }`, { vote })
}

export const getRandomName = async (gender: Gender): Promise<BabyNameFrontendView> => {
  return axiosInstance.get(`${ backendHost }/api/babynames/randomname${ gender }`).then(response => response.data)
}

export const getResults = async (): Promise<{results: BabyNameResult[]}> => {
  return axiosInstance.get(`${ backendHost }/api/babynames/results`).then(response => response.data)
}