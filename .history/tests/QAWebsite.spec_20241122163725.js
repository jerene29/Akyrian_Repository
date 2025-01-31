import { test, expect } from '@playwright/test';
    // Test: Login to the Portal and login as Source Capture User
test('QAOncloud Webiste',async ({ page }) => {

    // Visit the portal
    await page.goto('https://www.qaoncloud.com/', { timeout: 30000 });
    await page.waitForTimeout(10000);
    //Click on Services tab and check
    await page.locator('#menu-item-319').click();
    //Click Functional Testing Tab
    await page.locator('a[href="/functional-testing-services"]', { timeout: 30000 }).click();

//await page.waitForURL('https://www.qaoncloud.com/contact-us', { timeout: 40000 })
    //Click on Services tab and check
    await page.locator('.navbar-nav > li:nth-of-type(1) > .nav-link', { timeout: 40000 }).click();
        //Click Automation Testing
    await page.locator('a[href="https://www.qaoncloud.com/automation-testing-services"]', { timeout: 40000 }).click();
//Click Test Automation Services
await page.locator('a[href="https://www.qaoncloud.com/blog/how-to-select-right-test-cases-for-automation-testing"]', { timeout: 40000 }).click();
await page.waitForTimeout(30000);
await expect(page).toHaveURL('https://www.qaoncloud.com/blog/how-to-select-right-test-cases-for-automation-testing', { timeout: 30000 }); // Replace with expected URL
//Click Security Testing
await page.locator('.navbar-nav > li:nth-of-type(1) > .nav-link', { timeout: 40000 }).click();

await page.locator("a[href='https://www.qaoncloud.com/security-testing-services']", { timeout: 40000 }).click();
await expect(page).toHaveURL('https://www.qaoncloud.com/security-testing-services', { timeout: 30000 }); // Replace with expected URL

//Click Security testing link
await page.locator('a[href="https://www.qaoncloud.com/blog/what-is-security-testing-types-and-benefits"]', { timeout: 30000 }).click();
await page.waitForTimeout(30000);
await expect(page).toHaveURL('https://www.qaoncloud.com/blog/what-is-security-testing-types-and-benefits', { timeout: 30000 }); // Replace with expected URL


//Click Regrssion Testing
await page.locator('.navbar-nav > li:nth-of-type(1) > .nav-link', { timeout: 40000 }).click();

await page.locator("a[href='https://www.qaoncloud.com/regression-testing-services']", { timeout: 40000 }).click();
await expect(page).toHaveURL('https://www.qaoncloud.com/regression-testing-services', { timeout: 30000 }); // Replace with expected URL

//Click Automated Regression testing link
await page.locator('a[href="https://www.qaoncloud.com/blog/comprehensive-regression-testing-to-achieve-high-quality-customer-satisfaction"]', { timeout: 30000 }).click();
await page.waitForTimeout(30000);
await expect(page).toHaveURL('https://www.qaoncloud.com/blog/comprehensive-regression-testing-to-achieve-high-quality-customer-satisfaction', { timeout: 30000 }); // Replace with expected URL
})