import { axiosInstance, backendHost } from './api.ts'
import { NotificationsStatus } from '../../../shared/types/push-notifications'


export const saveSubscription = async (subscription: PushSubscription): Promise<void> => {
  return axiosInstance.post(`${ backendHost }/api/notifications/subscriptions`, { subscription }).then(response => response.data)
}

export const setNotificationsStatus = async (enabled: boolean): Promise<void> => {
  return axiosInstance.post(`${ backendHost }/api/notifications/options`, { enabled }).then(response => response.data)
}

export const getNotificationsStatus = async (): Promise<NotificationsStatus> => {
  return axiosInstance.get(`${ backendHost }/api/notifications/status`).then(response => response.data)
}

export const testNotification = async () => axiosInstance.post(`${ backendHost }/api/notifications/test`)