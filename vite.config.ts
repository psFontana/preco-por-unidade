import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',
  plugins: [react()],
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/comparison.ts'],
      reporter: ['text', 'html', 'lcov'],
      thresholds: { lines: 80, branches: 80 },
    },
  },
})
