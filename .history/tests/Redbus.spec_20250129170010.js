import { test, expect } from '@playwright/test';
test.describe('RedBusWebsite', () => {
test('RedBus.com', async ({ page }) => {
// Visit the URL
await page.goto('https://www.redbus.in/');
//Click Account
await page.locator('[class="rb_main_secondary_item  link"]', { timeout: 10000 }).click()
//Click Login/Sign Up
await page.locator('#user_sign_in_sign_up', { timeout: 10000 }).click()
await page.locator('[class="mobileInputContainer clearfix contact-box"]', { timeout: 10000 }).click()

})
})