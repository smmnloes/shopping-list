import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: false,
    minify: 'esbuild',
    chunkSizeWarningLimit: 2000,
  },
  plugins: [ react(), VitePWA({
    strategies: 'injectManifest',
    registerType: 'autoUpdate',
    includeAssets: [ '*.svg', '*.png' ],
    devOptions: { enabled: true, type: 'module', navigateFallback: 'index.html' },
    srcDir: 'src/serviceworker',
    filename: 'sw.ts',
    injectManifest: {
      minify: false
    },
    manifest: {
      name: 'Einkaufsliste',
      display: 'standalone',
      short_name: 'Einkaufsliste',
      description: 'Unsere Einkaufsliste',
      theme_color: '#eae8ff',
      icons: [
        {
          src: 'icon.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    minify: false
  }) ],
})
