import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true
  },
  plugins: [ react(), VitePWA({
    registerType: 'autoUpdate',
    includeAssets: [ '*.svg', '*.png' ],

    workbox: {
      runtimeCaching: [
        {
          urlPattern: ({url}) => {
            return url.pathname.startsWith('/api') && !url.pathname.includes('onlinestatus')
          },
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            networkTimeoutSeconds: 5,
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 24 * 60 * 60, // Cache for 1 day
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
      ],
    },

    manifest: {
      name: 'Einkaufsliste',
      display: 'minimal-ui',
      short_name: 'Einkaufsliste',
      description: 'Unsere Einkaufsliste',
      theme_color: '#ffffff',
      icons: [
        {
          src: 'icon.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    }
  }) ],
})
