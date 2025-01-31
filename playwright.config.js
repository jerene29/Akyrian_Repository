import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
 
  reporter: [
    ['html', { outputFolder: 'test-report', open: 'always' }] // HTML report config
  ],
  use: {
    headless: false,  
    screenshot: 'only-on-failure', // Capture screenshot only when a test fails
    // Set the default timeout for all actions
    timeout: 150000, // Timeout in milliseconds (e.g., 30 seconds)
    // Base URL to use in actions like `await page.goto('/')`.
    baseURL: 'http://127.0.0.1:3000',
    // Collect trace when retrying the failed test.
    trace: 'on-first-retry',
  },
  
  // Look for test files in the "tests" directory, relative to this configuration file.
  testDir: 'tests',

  // Run all tests in parallel.
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,

  // Retry on CI only.
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI.
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use (HTML and JSON)
  reporter: [['list'],
  ['html'],
  ['junit', { outputFile: 'results.xml'}],
  [['json', { outputFile: 'results.json' }]],

    ['allure-playwright', { outputFolder: 'my-allure-results' }],
  ],

  // Configure projects for major browsers.
  projects: [ 
    { 
    name: 'Mobile Tests', 
    use: 
    { ...devices['iPhone 12 Pro'],
     },
     }, 
    { 
    name: 'Desktop Tests',
     use: { 
    viewport: { width: 1280, height: 720 },
     },
    },
    ],
 
    
      
  // Run your local dev server before starting the tests.
  webServer: {
    command: 'npm run start',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
  },
});
