const { test, expect } = require('@playwright/test');
test('Check the Avanti Web page', async ({ page }) => {
await page.goto('https://flutter-web-avanti-dot-indihood-qa-in.appspot.com/login');
await page.waitForTimeout(15000);
// Click the sign in button 
await page.locator('flutter-view').click()

await page.locator('flutter-view').click()

await page.locator('#username', { timeout: 30000 }).fill('xotay28182@etoymail.com');
await page.locator('#current-password', { timeout: 30000 }).fill('Avanti@123');
await page.locator('.web-electable-region-context-menu').click()
await page.waitForTimeout(15000);

})
