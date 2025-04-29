// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      src: '/src',
      app: '/src/app',
      pages: '/src/pages',
      features: '/src/features',
      shared: '/src/shared',
    },
  },
})
