import { defineConfig, devices } from '@playwright/test'

const DEV_PORT = 5173
const DEV_URL = `http://localhost:${DEV_PORT}`

export default defineConfig({
  testDir: './src/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 4,
  reporter: 'html',

  use: {
    baseURL: DEV_URL,
    trace: 'on-first-retry',
    screenshot: { onFailure: true },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: `yarn dev`,
    url: DEV_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
