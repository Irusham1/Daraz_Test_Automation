// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: 2,
  timeout: 90_000,
  expect: { timeout: 15_000 },

  reporter: [
    ['html', { open: 'never' }],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
  ],

  use: {
    baseURL: 'https://www.daraz.lk',
    trace: 'on-first-retry',
    screenshot: 'on',
    video: 'on',
    actionTimeout: 20_000,
    navigationTimeout: 60_000,
    locale: 'en-LK',
    timezoneId: 'Asia/Colombo',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
