const { test, expect } = require('@playwright/test');
test('Check the Avanti Web page', async ({ page }) => {
  await page.goto('https://flutter-web-avanti-dot-indihood-qa-in.appspot.com/login');
// Click the sign in button 
await page.locator('.web-electable-region-context-menu').click()
await page.getByPlaceholder('Enter your email').click();
await page.getByPlaceholder('Enter your email').fill('xotay28182@etoymail.com');


})
