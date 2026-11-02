import { defineConfig, devices } from '@playwright/test'

const externalServer = process.env.E2E_BASE_URL

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: externalServer || 'http://localhost:8484',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], channel: process.env.E2E_CHROME_CHANNEL || undefined },
    },
  ],
  webServer: externalServer ? undefined : {
    command: 'npm run start -- --host 127.0.0.1',
    url: 'http://localhost:8484',
    reuseExistingServer: !process.env.CI,
  },
})
