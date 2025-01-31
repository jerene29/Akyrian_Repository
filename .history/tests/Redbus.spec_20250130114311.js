import { test, expect } from '@playwright/test';
test.describe('RedBusWebsite', () => {
test('RedBus.com', async ({ page }) => {
// Visit the URL
await page.goto('https://www.redbus.in/');
//Click Account
await page.locator('#account_dd .name_rb_secondary_item', { timeout: 10000 }).click()
//Click Login/Sign Up
await page.locator('#user_sign_in_sign_up', { timeout: 10000 }).click()
await page.focus('#mobileNoInp')
await page.fill('#mobileNoInp',"6369851585");
await page.pause(); 
await page.locator('#otp-container', { timeout: 10000 }).click()

})
})