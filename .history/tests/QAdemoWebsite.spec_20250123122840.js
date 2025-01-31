import { test, expect } from '@playwright/test';
test.describe('DemoQAWebsite', () => {
    test('DemoQAWebsite', async ({ page }) => {
    // Visit the URL
    await page.goto('https://demoqa.com/');
    })
})