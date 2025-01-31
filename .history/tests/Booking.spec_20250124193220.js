import { test, expect } from '@playwright/test';
test.describe('BookingWebsite', () => {
    test('Booking.com', async ({ page }) => {
    // Visit the URL
    await page.goto('https://www.booking.com/');
    //Click Sign In
    await page.locator('[class="c1af8b38aa"]', { timeout: 10000 }).click()
    await page.fill('[placeholder="Enter your email address"]','divyadhileepan1415@gmail.com', { timeout: 10000 })
    await page.locator('[class="_NMeW4uFOFNEfBkJI2X6 C24NCf0IyZRFJk2ahDeL DtlkOQAQuawAsxgcEUCY hevwrAzGPCvQfFqIYsie IP81aoz9pM28K7Vclo49 C3wGW7ffSXVm3VGRJTzO"]', { timeout: 10000 }).click()
    await page.waitForTimeout(10000);

    })
})