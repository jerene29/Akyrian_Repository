const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://flutter-web-avanti-dot-indihood-qa-in.appspot.com/login');
  await page.getByPlaceholder('Enter your email').click();
  await page.getByPlaceholder('Enter your email').fill('divyar@qaoncloud.com');

  // ---------------------
  await context.close();
  await browser.close();
})();