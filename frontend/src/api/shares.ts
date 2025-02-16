import { axiosInstance, backendHost } from './api.ts'
import { ShareInfo, ShareInfoPublic, ShareOverview } from '../../../shared/types/files'

export const uploadFile = async (shareId: string, file: File, abortController: AbortController): Promise<void> => {
  const formData = new FormData()
  formData.append('file', file)

  return axiosInstance.post(`${ backendHost }/api/fileshares/${ shareId }`, formData, {
    signal: abortController.signal,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then(response => response.data)
}

export const deleteFile = async (shareId: string, filename: string): Promise<void> => {
  return axiosInstance.delete(`${ backendHost }/api/fileshares/${ shareId }/${filename}`)
}

export const getShareInfo = async (shareId: string): Promise<ShareInfo> => {
  return axiosInstance.get(`${ backendHost }/api/fileshares/${ shareId }`).then(response => response.data.shareInfo)
}

export const updateShareInfo = async (shareId: string, content: Partial<ShareInfo>): Promise<void> => {
  return axiosInstance.patch(`${ backendHost }/api/fileshares/${ shareId }`, content)
}


export const getShares = async (): Promise<ShareOverview[]> => {
  return axiosInstance.get(`${ backendHost }/api/fileshares`).then(response => response.data.shares)
}

export const newShare = async (): Promise<{ id: string }> => {
  return axiosInstance.post(`${ backendHost }/api/fileshares`).then(response => response.data.id)
}


export const getShareInfoPublic = async (shareCode: string): Promise<ShareInfoPublic> => {
  return axiosInstance.get(`${ backendHost }/api/fileshares-public`, { params: { shareCode } }).then(response => response.data)
}

export const deleteShare = async (shareId: string): Promise<void> => {
  return axiosInstance.delete(`${ backendHost }/api/fileshares/${ shareId }`)
}