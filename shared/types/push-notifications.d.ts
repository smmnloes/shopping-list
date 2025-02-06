export type PushNotificationPayload = { title: string, message: string, onClickRedirect?: string }

export type StoredSubscription = { endpoint: string, expirationTime: null | number }
export type NotificationsStatus = {
  enabled: boolean,
  storedSubscription: StoredSubscription
}