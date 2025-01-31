const { test, expect } = require('@playwright/test');
test('Check the Avanti Web page', async ({ page }) => {
  await page.goto('https://flutter-web-avanti-dot-indihood-qa-in.appspot.com/login');
// Click the sign in button 
await page.locator('[flutter-view]').click()

await page.fill("#username", 'xotay28182@etoymail.com');
await page.fill("#current-password", 'Avanti@123');

})