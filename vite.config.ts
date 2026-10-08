import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'BLACKOUT — Offline Emergency Digital Kit',
        short_name: 'BLACKOUT',
        description: 'Your emergency kit, even when everything goes offline.',
        theme_color: '#0a0d14',
        background_color: '#0a0d14',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ],
        shortcuts: [
          {
            name: '🚨 Emergency Mode',
            short_name: 'Emergency',
            description: 'Activate instant high-contrast emergency mode',
            url: '/',
            icons: [{ src: '/icon-192.png', sizes: '192x192' }]
          },
          {
            name: '🆘 SOS Broadcast',
            short_name: 'SOS',
            description: 'Open SOS distress message generator',
            url: '/sos',
            icons: [{ src: '/icon-192.png', sizes: '192x192' }]
          },
          {
            name: '❤️ Medical Card',
            short_name: 'Medical Card',
            description: 'View offline paramedic emergency medical card',
            url: '/card',
            icons: [{ src: '/icon-192.png', sizes: '192x192' }]
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
})
