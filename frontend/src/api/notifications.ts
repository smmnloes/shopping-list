import { axiosInstance, backendHost } from './api.ts'


export const saveSubscription = async (subscription: PushSubscription): Promise<void> => {
  return axiosInstance.post(`${ backendHost }/api/notifications/subscriptions`, { subscription }).then(response => response.data)
}

