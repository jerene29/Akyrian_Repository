const { test, expect } = require('@playwright/test');
test('To check the IRCTC portal home page', async ({ page }) => {
    // Set viewport size

    // Visit the portal
    await page.goto(' irtct.co.in', { timeout: 30000 });
    await page.waitForTimeout(10000);

    // Login action
    await page.fill('#email', 'sourcecapture@example.com');
    await page.fill('#password', 'Password!1');
    await page.click('#loginAs-btn');
})