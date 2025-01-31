import { test, expect } from '@playwright/test';
    // Test: Login to the Portal and login as Source Capture User
test('QAOncloud Webiste',async ({ page }) => {

    // Visit the portal
    await page.goto('https://www.qaoncloud.com/', { timeout: 30000 });
    await page.waitForTimeout(10000);
    //Click Learn More 
    await page.locator('#rect-5371').click();
    await page.waitForURL('https://www.qaoncloud.com/contact-us'); // Ensure the page navigates to the desired URL
//FIll the form
 
await page.locator('#my_name_G5dgawEKuPkuep3l').fill('Divya');

    //Click on Services tab and check
    await page.locator('#menu-item-319').click();
    //Click Functional Testing Tab
    await page.locator('a[href="/functional-testing-services"]').click();

})