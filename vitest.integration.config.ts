import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    fileParallelism: false,
    hookTimeout: 60_000,
    include: ['integration/**/*.integration.test.ts'],
    testTimeout: 60_000
  }
});
