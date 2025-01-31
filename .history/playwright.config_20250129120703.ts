import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests', // Directory where your tests are located
  timeout: 30000, // Global timeout for tests (in ms)
  use: {
    headless: false, // Set to false if you want to see the browser UI
    browserName: 'chromium', // Default browser to use (can be overridden in individual projects)
    video: 'on-first-retry', // Record video on the first retry
    screenshot: 'only-on-failure', // Capture screenshot on failure
    trace: 'on-first-retry', // Capture trace for debugging
  },
  reporter: [
    ['html', { outputFolder: 'test-report', open: 'always' }] // Generate HTML report
  ],
  projects: [
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 13'],      },
    },
    /*
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
 */
  ],
});

