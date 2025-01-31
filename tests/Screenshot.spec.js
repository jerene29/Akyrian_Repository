const { test, expect } = require('@playwright/test');

test('Take screenshot of an element', async ({ page }) => {
  await page.goto('https://example.com');
  const element = await page.$('h1'); // Select an element
  await element.screenshot({ path: 'element-screenshot.png' }); // Takes screenshot of the element
});