import { axiosInstance, backendHost } from './api.ts'
import { AxiosProgressEvent } from 'axios'

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
