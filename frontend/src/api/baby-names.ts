import { axiosInstance, backendHost } from './api.ts'
import {
  BabyNameFrontendView,
  BabyNameResult,
  Gender,
  VoteMatchResult,
  VoteVerdict
} from '../../../shared/types/babynames'


export const postVote = async (nameId: number, vote: VoteVerdict): Promise<VoteMatchResult> => {
  return axiosInstance.post(`${ backendHost }/api/babynames/vote/${ nameId }`, { vote }).then(response => response.data)
}

export const getRandomName = async (gender: Gender): Promise<BabyNameFrontendView> => {
  return axiosInstance.get(`${ backendHost }/api/babynames/randomname${ gender }`).then(response => response.data)
}

export const getResults = async (): Promise<{ results: BabyNameResult[] }> => {
  return axiosInstance.get(`${ backendHost }/api/babynames/results`).then(response => response.data)
}