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
      widgets: '/src/widgets',
      pages: '/src/pages',
      features: '/src/features',
      entities: '/src/entities',
      shared: '/src/shared',
    },
  },
})
