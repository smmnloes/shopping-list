import { axiosInstance, backendHost } from './api.ts'
import { AxiosRequestConfig } from 'axios'

export const uploadFiles = async (file: File): Promise<void> => {
  // Create form data
  const formData = new FormData();
  formData.append('file', file);

  // Additional metadata if needed
  formData.append('filename', file.name);
  formData.append('contentType', file.type);

  // Configure axios request
  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    // onUploadProgress: (progressEvent: UploadProgressEvent) => {
    //   if (onProgress) {
    //     const percentage = Math.round(
    //       (progressEvent.loaded * 100) / progressEvent.total
    //     );
    //     onProgress(percentage);
    //   }
    // },
  };
  return axiosInstance.post(`${ backendHost }/api/files`, formData, config).then(response => response.data)
}
