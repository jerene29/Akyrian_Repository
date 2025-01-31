const { test, expect } = require('@playwright/test');

test('Load Flutter Web App and Interact with Elements', async ({ page }) => {
  // Visit the Flutter web app and wait for it to load
  await page.goto('https://flutter-web-avanti-dot-indihood-qa-in.appspot.com/', { timeout: 20000 });

  // Wait for the main Flutter view to be available
  const flutterView = await page.waitForSelector('flutter-view', { timeout: 10000 });
  expect(flutterView).toBeTruthy(); // Ensure the element exists

  // Access the shadow DOM of flutter-view
  const shadowRoot = await page.evaluateHandle(el => el.shadowRoot, flutterView);
  expect(shadowRoot).toBeTruthy(); // Ensure shadow root exists

  // Locate the <flt-glass-pane> inside the shadow DOM
  const glassPane = await shadowRoot.evaluateHandle(root => root.querySelector('flt-glass-pane'));
  expect(glassPane).toBeTruthy(); // Ensure flt-glass-pane is present

  // Click a button or link inside the Flutter app
  // Modify the selector as per your app structure
  const nextButton = await shadowRoot.evaluateHandle(root => {
    return root.querySelector('a'); // Adjust this selector for the correct element
  });

  if (nextButton) {
    await nextButton.click();
    console.log('Clicked on the Next Page button');
  } else {
    console.log('Next Page button not found!');
  }

  // Optionally, verify navigation or interaction success
  await page.waitForTimeout(3000); // Allow time for page transition
  expect(await page.url()).toContain('https://flutter-web-avanti-dot-indihood-qa-in.appspot.com/login'); // Update with expected path
});




/*const { test, expect } = require('@playwright/test');
test('Check the Avanti Web page', async ({ page }) => {
await page.goto('https://flutter-web-avanti-dot-indihood-qa-in.appspot.com/login');
await page.waitForTimeout(15000);
// Click the sign in button 
await page.locator('[class=android.widget.Button]').click()
await page.locator('flutter-view').click()

await page.locator('#username', { timeout: 30000 }).fill('xotay28182@etoymail.com');
await page.locator('#current-password', { timeout: 30000 }).fill('Avanti@123');
await page.locator('.web-electable-region-context-menu').click()
await page.waitForTimeout(15000);
//Create New Loan
await page.locator('.web-electable-region-context-menu').click()

})
*/