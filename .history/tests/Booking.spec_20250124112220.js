import { test, expect } from '@playwright/test';
test.describe('BookingWebsite', () => {
    test('Booking.com', async ({ page }) => {
    // Visit the URL
    await page.goto('https://www.booking.com/');
    //Click Sign In
    await page.locator("[data-testid='header-sign-in-button'] > .e4adce92df')", { timeout: 10000 }).click()

    })
})