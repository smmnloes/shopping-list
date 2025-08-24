import { axiosInstance, backendHost } from './api.ts'
import { BabyNameFrontendView, BabyNameMatch, Gender, VoteVerdict } from '../../../shared/types/babynames'


export const postVote = async (nameId: number, vote: VoteVerdict): Promise<void> => {
  return axiosInstance.post(`${ backendHost }/api/babynames/vote/${ nameId }`, { vote })
}

export const getRandomName = async (gender: Gender): Promise<BabyNameFrontendView> => {
  return axiosInstance.get(`${ backendHost }/api/babynames/randomname${ gender }`).then(response => response.data)
}

export const getMatches = async (): Promise<{matches: BabyNameMatch[]}> => {
  return axiosInstance.get(`${ backendHost }/api/babynames/matches`).then(response => response.data)
}