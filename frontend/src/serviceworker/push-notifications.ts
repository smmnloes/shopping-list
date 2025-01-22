import { saveSubscription } from '../api/notifications.ts'

export async function subscribeToPushNotifications(): Promise<PushSubscription | undefined> {
  if (!('serviceWorker' in navigator)) {
    console.error('Service Worker not supported')
    return
  }
  const registration = await navigator.serviceWorker.getRegistration()
  if (!registration) {
    console.error('No serviceworker registered')
    return
  }

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY
  })

  await saveSubscription(subscription)
  return subscription

}