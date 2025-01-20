/// <reference lib="webworker" />
import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { NetworkFirst } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'

declare const self: ServiceWorkerGlobalScope

precacheAndRoute(self.__WB_MANIFEST)

registerRoute(({ url }) => url.pathname.startsWith('/api') && !url.pathname.includes('onlinestatus'),
new NetworkFirst({
  cacheName: 'api-cache',
  networkTimeoutSeconds: 5,
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200]
    }),
    new ExpirationPlugin({
      maxEntries: 100,
      maxAgeSeconds: 24 * 60 * 60}) // Cache for 1 day})
  ]
}))