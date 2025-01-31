const { test, expect } = require('@playwright/test');
test('Check the Avanti Web page', async ({ page }) => {
await page.goto('https://flutter-web-avanti-dot-indihood-qa-in.appspot.com/login');
test.setTimeout(200000)
// Click the sign in button 
await page.locator('flutter-view').click() 
await page.locator('[class="flt-text-editing transparentTextEditing"]').waitFor({ state: 'visible' });
await page.locator('[class="flt-text-editing transparentTextEditing"]').fill('xotay28182@etoymail.com');


await page.locator('[class="flt-text-editing transparentTextEditing"]').click();
await page.locator('[class="flt-text-editing transparentTextEditing"]').fill('Avanti@123');
await page.locator('flt-platform-view div').click({
    button: 'right'
  });

})
