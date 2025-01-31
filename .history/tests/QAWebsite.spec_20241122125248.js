import { test, expect } from '@playwright/test';
    // Test: Login to the Portal and login as Source Capture User
test('QAOncloud Webiste',async ({ page }) => {

    // Visit the portal
    await page.goto('https://www.qaoncloud.com/', { timeout: 30000 });
    await page.waitForTimeout(10000);
    //Click on Services tab and check
    await page.locator('#menu-item-319').click();
    //Click Functional Testing Tab
    await page.locator('a[href="/functional-testing-services"]').click();
    await page.waitForTimeout(10000);
//Click Talk to our Experts
await page.locator('[class="btn-title"]').click();
await page.waitForTimeout(30000);
    //Click Automation Testing
    await page.locator('a[href="https://www.qaoncloud.com/automation-testing-services"]').click();
    await page.waitForTimeout(10000);
//Click Test Automation Services
await page.locator('a[href="https://www.qaoncloud.com/blog/how-to-select-right-test-cases-for-automation-testing"]').click();
await page.waitForTimeout(10000);
await expect(page).toHaveURL('https://www.qaoncloud.com/blog/how-to-select-right-test-cases-for-automation-testing'); // Replace with expected URL

})