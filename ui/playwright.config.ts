import { defineConfig, devices } from '@playwright/test'

const externalServer = process.env.E2E_BASE_URL

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  // Live projects share a single-process local API and disposable users.
  workers: process.env.E2E_LIVE_FIXTURES ? 1 : undefined,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: externalServer || 'http://localhost:8486',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    actionTimeout: 15_000,
  },
  projects: [
    {
      name: 'chromium',
      testIgnore: '**/live-party.spec.ts',
      use: { ...devices['Desktop Chrome'], channel: process.env.E2E_CHROME_CHANNEL || undefined },
    },
    { name: 'firefox', testIgnore: '**/live-party.spec.ts', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', testIgnore: '**/live-party.spec.ts', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chromium', testIgnore: '**/live-party.spec.ts', use: { ...devices['Pixel 7'] } },
    { name: 'mobile-webkit', testIgnore: '**/live-party.spec.ts', use: { ...devices['iPhone 13'] } },
    {
      name: 'live-chromium',
      testMatch: '**/live-party.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        // A controlled media session: browser autoplay permission is not an app migration.
        launchOptions: { args: ['--autoplay-policy=no-user-gesture-required'] },
        // Live OAuth credentials must not be captured in traces.
        trace: 'off',
      },
    },
  ],
  webServer: externalServer ? undefined : {
    command: 'npm run start -- --host 127.0.0.1 --port 8486',
    url: 'http://localhost:8486',
    reuseExistingServer: !process.env.CI,
  },
})
