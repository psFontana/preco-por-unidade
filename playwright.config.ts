import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './monitor',
  reporter: 'list',
  retries: 1,
  use: {
    baseURL: process.env.SITE_URL || 'http://127.0.0.1:4173/',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
})
