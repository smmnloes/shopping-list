/// <reference lib="webworker" />
import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { NetworkFirst } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { PushNotificationPayload } from '../../../shared/types/push-notifications'

declare const self: ServiceWorkerGlobalScope

precacheAndRoute(self.__WB_MANIFEST)

registerRoute(({ url }) => url.pathname.startsWith('/api') && !url.pathname.includes('onlinestatus'),
  new NetworkFirst({
    cacheName: 'api-cache',
    networkTimeoutSeconds: 5,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [ 0, 200 ]
      }),
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 24 * 60 * 60
      })
    ]
  }))

self.addEventListener('push', (event) => {
  console.log('Push event received:', event)
  console.log(event.data?.json())
  const { message, title, onClickRedirect } = event.data?.json() as PushNotificationPayload
  event.waitUntil(
    (async () => {
      try {
        const options: NotificationOptions = {
          body: message,
          icon: '/icon.png',
          data: { onClickRedirect }
        }
        await self.registration.showNotification(title, options)
      } catch (error) {
        console.error('Error showing notification:', error)
      }
    })()
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const { onClickRedirect } = event.notification.data as PushNotificationPayload
  if (!onClickRedirect) {
    return
  }

  event.waitUntil(
    self.clients
      .matchAll({
        type: 'window',
      })
      .then((clientList) => {
        for (const client of clientList) {
          console.log('Client url ' + client.url)
          if (client.url.endsWith(onClickRedirect) && 'focus' in client) return client.focus()
        }
        return self.clients.openWindow(onClickRedirect)
      }),

  )
})