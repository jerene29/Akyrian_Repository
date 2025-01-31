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

//await page.fill("#mobileNoInp","6369851585");
//Search From and To
await page.fill('#src',"Thiruvarur");
await page.locator(".cursorPointing .placeHolderMainText", { timeout: 10000 }).click()

await page.fill('#dest',"Chennai");
await page.locator(".cursorPointing", { timeout: 10000 }).click()
await page.locator(".DatePicker__MainBlock-sc-1kf43k8-1 div:nth-of-type(6) > .gigHYE", { timeout: 10000 }).click()


})
})