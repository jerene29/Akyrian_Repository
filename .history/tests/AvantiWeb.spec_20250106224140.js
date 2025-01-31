const { test, expect } = require('@playwright/test');
test('Check the Avanti Web page', async ({ page }) => {
await page.goto('https://flutter-web-avanti-dot-indihood-qa-in.appspot.com/login');
test.setTimeout(200000)
// Click the sign in button 
await page.locator('.web-electable-region-context-menu').click()
await page.locator('input[placeholder="Enter your email"]').click();
await page.locator('input[placeholder="Enter your email"]').fill('xotay28182@etoymail.com');

await page.locator('input[placeholder="Enter your password"]').click();
await page.locator('input[placeholder="Enter your password"]').fill('Avanti@123');
await page.locator('flt-platform-view div').click({
    button: 'right'
  });

})
