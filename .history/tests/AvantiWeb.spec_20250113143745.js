const { test, expect } = require('@playwright/test');
test('Check the Avanti Web page', async ({ page }) => {
await page.goto('https://flutter-web-avanti-dot-indihood-qa-in.appspot.com/login');
await page.waitForTimeout(15000);
// Click the sign in button 
await page.locator('.web-electable-region-context-menu').click()

await page.locator('.web-electable-region-context-menu').nth(0).waitFor({ state: 'visible' });
await page.locator('.web-electable-region-context-menu').nth(0).fill('xotay28182@etoymail.com');


await page.locator('.web-electable-region-context-menu').nth(1).click();
await page.locator('.web-electable-region-context-menu').nth(1).fill('Avanti@123');
await page.locator('flt-platform-view div').click({
    button: 'right'
  });

})
