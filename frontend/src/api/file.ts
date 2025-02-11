import { axiosInstance, backendHost } from './api.ts'
import { AxiosProgressEvent } from 'axios'
import { SharedFileList } from '../../../shared/types/files'

export const uploadFiles = async (file: File, onProgress: (event: AxiosProgressEvent) => void, abortController: AbortController): Promise<void> => {
  const formData = new FormData();
  formData.append('file', file);

  return axiosInstance.post(`${ backendHost }/api/files`, formData, {
    signal: abortController.signal,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: onProgress
  }).then(response => response.data)
}


export const getUploadedFiles = async (): Promise<SharedFileList> => {
  return axiosInstance.get(`${ backendHost }/api/files`).then(response => response.data.files)
}