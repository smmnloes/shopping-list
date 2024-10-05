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
    includeAssets: [ 'favicon.svg', 'robots.txt', 'apple-touch-icon.png' ],
    manifest: {
      name: 'Einkaufsliste',
      short_name: 'Einkaufsliste',
      description: 'Unsere Einkaufsliste',
      theme_color: '#ffffff',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ]
    }
  }) ],
})