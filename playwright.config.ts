import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: 'tests',
  timeout: 30_000,
  use: { baseURL: 'http://127.0.0.1:5199', headless: true },
  webServer: {
    command: 'npm run build:site && npx vite preview --host 127.0.0.1 --port 5199',
    url: 'http://127.0.0.1:5199',
    reuseExistingServer: true,
    timeout: 120_000,
  },
})
