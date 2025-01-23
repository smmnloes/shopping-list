import { axiosInstance, backendHost } from './api.ts'


export const saveSubscription = async (subscription: PushSubscription): Promise<void> => {
  return axiosInstance.post(`${ backendHost }/api/notifications/subscriptions`, { subscription }).then(response => response.data)
}

export const setNotificationsStatus = async (enabled: boolean): Promise<void> => {
  return axiosInstance.post(`${ backendHost }/api/notifications/options`, { enabled }).then(response => response.data)
}

export const getNotificationsStatus = async (): Promise<{ enabled: boolean }> => {
  return axiosInstance.get(`${ backendHost }/api/notifications/options`).then(response => response.data)
}

export const testNotification = async () => axiosInstance.post(`${ backendHost }/api/notifications/test`)