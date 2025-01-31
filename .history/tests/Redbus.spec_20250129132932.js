import { test, expect } from '@playwright/test';
test.describe('RedBusWebsite', () => {
test('RedBus.com', async ({ page }) => {
// Visit the URL
await page.goto('https://www.redbus.com/');
//For Login
await page.locator('[class="rdc-login"]', { timeout: 10000 }).click()
//Click signin/Sign Up
await page.locator('#signInLink', { timeout: 10000 }).click()

})
})