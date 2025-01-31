const { test, expect } = require('@playwright/test');
test('To check the IRCTC portal home page', async ({ page }) => {

    // Open the IRCTC portal URL
    await page.goto('https://www.irctc.co.in/nget/train-search', { timeout: 30000 });
    await page.waitForTimeout(10000);
    //Get the current viewport size (width and height)
    const viewport = await page.viewportSize();
    
    // Calculate the new zoomed size (80% of the current size)
    const zoomScale = 0.8;
    const newWidth = Math.floor(viewport.width * zoomScale);
    const newHeight = Math.floor(viewport.height * zoomScale);
    
    // Set the new viewport size to simulate zooming in to 80%
    await page.setViewportSize({ width: newWidth, height: newHeight });

    console.log(`Viewport resized to: ${newWidth}x${newHeight}`);
    // The home page should have the following details:

    await page.locator('text=LOGIN').isVisible();
    await page.locator('text=REGISTER').isVisible();
    await page.locator('text=AGENT LOGIN').isVisible();
    await page.locator('text=CONTACT US').isVisible();
    await page.locator('text=HELP & SUPPORT').isVisible();
    await page.locator('text=DAILY DEALS').isVisible();
    await page.locator('text=ALERTS').isVisible();

    // Check for date and time (ensure it matches the format)
    const dateTimeText = await page.locator('text=03-Dec-2024 [19:03:37]').textContent();
    console.log('Current DateTime: ', dateTimeText);

    // Check for A-, A, A+ buttons or links
    await page.locator('text=A-').isVisible();
    await page.locator('text=A').isVisible();
    await page.locator('text=A +').isVisible();

    // Check for Hindi option
    await page.locator('text=हिंदी').isVisible();

    // Check for IRCTC Exclusive link
    await page.locator('text=IRCTC EXCLUSIVE').isVisible();

    // Check for other menu items
    await page.locator('text=TRAINS').isVisible();
    await page.locator('text=LOYALTY').isVisible();
    await page.locator('text=IRCTC eWallet').isVisible();
    await page.locator('text=BUSES').isVisible();
    await page.locator('text=FLIGHTS').isVisible();
    await page.locator('text=HOTELS').isVisible();
    await page.locator('text=HOLIDAYS').isVisible();
    await page.locator('text=MEALS').isVisible();
    await page.locator('text=PROMOTIONS').isVisible();
    await page.locator('text=MORE').isVisible();

    // Check for IRCTC logo (this may require a different selector)
    await page.locator('img[alt="IRCTC Logo"]').isVisible();

    // Check for PNR Status and Charts/Vacancy links
    await page.locator('text=PNR STATUS').isVisible();
    await page.locator('text=CHARTS/VACANCY').isVisible();

    // Check for Book Ticket and Search functionality
    await page.locator('text=BOOK TICKET').isVisible();
    await page.locator('text=SEARCH').isVisible();

    // Check for Easy Booking on Ask Disha
    await page.locator('text=EASY BOOKING ON ASK DISHA').isVisible();

    console.log('All elements are visible on the page.');

    // Close the browser after the checks
    await browser.close();
})