import { test, expect } from '@playwright/test';
test.describe('ZomatoWebsite', () => {
test('Zomato.com', async ({ page }) => {
// Visit the URL
await page.goto('https://www.zomato.com/');
//Click Sign Up
await page.locator('li:nth-of-type(5) > .sc-3o0n99-5', { timeout: 10000 }).click()
//Click Login/Sign Up
await page.fill("[label='Full Name'] .sc-1yzxt5f-9","DivyaR");
await page.fill(".bfympp[label='Email'] .sc-1yzxt5f-9","divyarajagopal94@gmail.com");
await page.locator('.sc-1o2pknd-1', { timeout: 10000 }).click()

const isButtonEnabled = await page.isEnabled('.sc-kqEXUp .sc-1kx5g6g-3'); // Replace with your button selector

if (isButtonEnabled) {
  console.log('Button is enabled');
} else {
  console.log('Button is disabled');
}
//Login in
await page.locator('.sc-dpiBDp', { timeout: 10000 }).click()
await page.locator('.sc-kAyceB').dblclick()
await page.fill(".sc-1yzxt5f-9","divyarajagopal94@gmail.com");
await page.locator('.sc-1kx5g6g-3', { timeout: 10000 }).click()
await page.pause(); 
//Search Resurtants
await page.fill("[placeholder='Search for restaurant, cuisine or a dish']","Chicken 65");
await page.locator('.sc-eQGPmX > div:nth-of-type(1) .sc-gFXMyG', { timeout: 10000 }).click()
await page.locator("[src='https://b.zmtcdn.com/data/dish_photos/6bc/dc3a90073a6660192f8302e7801356bc.jpg?output-format=webp']", { timeout: 10000 }).click()


})
})