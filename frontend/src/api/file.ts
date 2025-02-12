import { axiosInstance, backendHost } from './api.ts'
import { AxiosProgressEvent } from 'axios'
import { ShareInfo, ShareOverview } from '../../../shared/types/files'

export const uploadFile = async (shareId: string, file: File, onProgress: (event: AxiosProgressEvent) => void, abortController: AbortController): Promise<void> => {
  const formData = new FormData();
  formData.append('file', file);

  return axiosInstance.post(`${ backendHost }/api/fileshares/${shareId}`, formData, {
    signal: abortController.signal,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: onProgress
  }).then(response => response.data)
}


export const getShareInfo = async (shareId: string): Promise<ShareInfo> => {
  return axiosInstance.get(`${ backendHost }/api/fileshares/${shareId}`).then(response => response.data.shareInfo)
}

export const updateShareInfo = async (shareId: string, content: Partial<ShareInfo>): Promise<void> => {
  return axiosInstance.patch(`${ backendHost }/api/fileshares/${shareId}`, content)
}


export const getShares = async (): Promise<ShareOverview[]> => {
  return axiosInstance.get(`${ backendHost }/api/fileshares`).then(response => response.data.shares)
}

export const newShare = async (): Promise<{id: string}> => {
  return axiosInstance.post(`${ backendHost }/api/fileshares`).then(response => response.data.id)
}