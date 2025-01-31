import { test, expect } from '@playwright/test';
test.describe('RedBusWebsite', () => {
test('RedBus.com', async ({ page }) => {
// Visit the URL
await page.goto('https://www.redbus.com/');
})
})