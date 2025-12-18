// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      // --- ADICIONE ESTE BLOCO workbox AQUI ---
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'], // Diz o que deve ser salvo
        navigateFallback: '/index.html', // <--- O SEGREDO: Se não achar a rota, entrega o index.html
        navigateFallbackDenylist: [/^\/api/], // (Opcional) Ignora rotas de API se tiver
        runtimeCaching: [
            {
                urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'google-fonts-cache',
                  expiration: {
                    maxEntries: 10,
                    maxAgeSeconds: 60 * 60 * 24 * 365 // <--- 365 dias
                  },
                  cacheableResponse: {
                    statuses: [0, 200]
                  }
                }
            }
        ]
      },
      // ----------------------------------------
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'PMO Digital',
        short_name: 'PMO',
        description: 'Gestão de Planos de Manejo Orgânico',
        theme_color: '#ffffff',
        display: 'standalone',
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
          }
        ]
      }
    })
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
})