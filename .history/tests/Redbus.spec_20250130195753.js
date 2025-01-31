import { test, expect } from '@playwright/test';
test.describe('RedBusWebsite', () => {
test('RedBus', async ({ page }) => {
// Visit the URL
await page.goto('https://www.redbus.in/');
//Click Account
await page.locator('#account_dd .name_rb_secondary_item', { timeout: 10000 }).click()
//Click Login/Sign Up
await page.locator('#user_sign_in_sign_up > .header_dropdown_item_name', { timeout: 10000 }).click()
//await page.locator('[class="nsm7Bb-HzV7m-LgbsSe-Bz112c-haAclf"]', { timeout: 10000 }).click()

//await page.fill("#mobileNoInp","divyarajagopal94@gmail.com");
await page.pause(); 
await page.locator('.f-w-b', { timeout: 10000 }).click()

//Search Resurtants
await page.fill("[placeholder='Search for restaurant, cuisine or a dish']","Chicken 65");
await page.locator("[placeholder='Search for restaurant, cuisine or a dish']", { timeout: 10000 }).click()

await page.locator('[class="sc-bLJvFH bLmHBp"]', { timeout: 10000 }).nth(1).click()
await page.locator('[class="sc-evWYkj cRThYq"]', { timeout: 10000 }).click()


})
})