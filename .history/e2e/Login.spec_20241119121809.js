const { test, expect } = require('@playwright/test');

test('Login to the Portal and login as Source Capture User', async ({ page }) => {
    // Set the viewport size (similar to Cypress' cy.viewport)
    await page.setViewportSize({ width: 1280, height: 720 });

    // Visit the portal
    await page.goto('https://qa.akyrian.com/');

    // Focus and type into the email field
    await page.fill('#email', 'streamlinesc@example.com');
    
    // Focus and type into the password field (without logging it)
    await page.fill('#password', 'Password!1'); // Note: No log option in Playwright, it's not logged by default

    // Click the login button
    await page.click('#loginAs-btn');
    
    // Wait for a specific amount of time (you may want to replace this with better waiting logic)
    await page.waitForTimeout(4000);  // Playwright also supports waiting with waitForTimeout (like Cypress' cy.wait())
});
