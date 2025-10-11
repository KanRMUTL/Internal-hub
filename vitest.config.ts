import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    alias: {
      shared: resolve(__dirname, './src/shared'),
      features: resolve(__dirname, './src/features'),
      entities: resolve(__dirname, './src/entities'),
      pages: resolve(__dirname, './src/pages'),
      widgets: resolve(__dirname, './src/widgets'),
      app: resolve(__dirname, './src/app'),
    },
  },
})
