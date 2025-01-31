import { test, expect } from '@playwright/test';
test.describe('ZomatoWebsite', () => {
test('Zomato.com', async ({ page }) => {
// Visit the URL
await page.goto('https://www.zomato.com/');
//Click Sign Up
await page.locator('[class="sc-3o0n99-5 sc-dXfzlN mfafn"]', { timeout: 10000 }).click()
//Click Login/Sign Up
await page.fill("[label='Full Name'] .sc-1yzxt5f-9","DivyaR");
await page.fill(".bfympp[label='Email'] .sc-1yzxt5f-9","divyarajagopal94@gmail.com");

const isButtonEnabled = await page.isEnabled('.sc-1o2pknd-1'); // Replace with your button selector

if (isButtonEnabled) {
  console.log('Button is enabled');
} else {
  console.log('Button is disabled');
}
//await page.locator('.sc-1o2pknd-1', { timeout: 10000 }).click()

})
})