import { test, expect } from '@playwright/test';
    // Test: Login to the Portal and login as Source Capture User
test('QAOncloud Webiste',async ({ page }) => {

    // Visit the portal
    await page.goto('https://www.qaoncloud.com/', { timeout: 30000 });
    await page.waitForTimeout(10000);
    //Click on Services tab and check
    await page.locator('#menu-item-319').click();
    //Click Functional Testing Tab
    page.locator('a[href="/functional-testing-services"]:has-text("Functional Testing")', { timeout: 30000 })
    page.locator('a[href="/automation-testing-services"]:has-text("Automation Testing")', { timeout: 30000 })
    page.locator('a[href="/security-testing-services"]:has-text("Security Testing")', { timeout: 30000 })
    page.locator('a[href="/regression-testing-services"]:has-text("Regression Testing")', { timeout: 30000 })
    page.locator('a[href="/api-testing-services"]:has-text("API Testing")', { timeout: 30000 })
    page.locator('a[href="/agile-testing-services"]:has-text("Agile Testing")', { timeout: 30000 })

//Click on Solutions tab and check
await page.locator('.menu-item-326 > .ekit-menu-nav-link').click();
//Click Functional Testing Tab
page.locator('a[href="/mobile-app-testing-services"]:has-text("Mobile App Testing")', { timeout: 30000 })
page.locator('a[href="https://www.qaoncloud.com/web-app-testing-services"]:has-text("Web App Testing")', { timeout: 30000 })
page.locator('a[href="https://www.qaoncloud.com/game-testing-services"]:has-text("Game Testing")', { timeout: 30000 })
page.locator('a[href="https://www.qaoncloud.com/cross-platform-testing-services"]:has-text("Cross-Platform Testing")', { timeout: 30000 })
page.locator('a[href="https://www.qaoncloud.com/cross-browser-testing-services"]:has-text("Cross-Browser Testing")', { timeout: 30000 })
page.locator('a[href="https://www.qaoncloud.com/game-testing-services"]:has-text("Smart Tv Testing")', { timeout: 30000 })

//Click on Industries tab and check
await page.locator('.menu-item-331 > .ekit-menu-nav-link').click();
//Click Functional Testing Tab
page.locator('a[href="https://www.qaoncloud.com/fintech-testing-services"]:has-text("Banking & Financial Services")', { timeout: 30000 })
page.locator('a[href="https://www.qaoncloud.com/telecom-testing-services"]:has-text("Communications")', { timeout: 30000 })
page.locator('a[href="https://www.qaoncloud.com/event-management-software-testing-services"]:has-text("Event Management")', { timeout: 30000 })
page.locator('a[href="https://www.qaoncloud.com/e-commerce-testing-services"]:has-text("E-Commerce")', { timeout: 30000 })
page.locator('a[href="https://www.qaoncloud.com/ai-testing-services"]:has-text("Artificial Intelligence")', { timeout: 30000 })

//Click on Insights tab and check
await page.locator('.menu-item-337 > .ekit-menu-nav-link').click();
//Click Functional Testing Tab
page.locator('a[href="https://www.qaoncloud.com/blog-trending-posts"]:has-text("Blogs")', { timeout: 30000 })
page.locator('a[href="https://www.qaoncloud.com/case-study"]:has-text("Case Studies")', { timeout: 30000 })
page.locator('a[href="https://www.qaoncloud.com/faq"]:has-text("FAQs")', { timeout: 30000 })
page.locator('a[href="https://www.qaoncloud.com/testimonial"]:has-text("Testimonials")', { timeout: 30000 })
//Click Contact Us
await page.locator('.elementor-button-text').click();
await page.locator("[maxlength='40']").fill('Divya');
await page.locator("[placeholder='E-mail']").fill('divyar@qaoncloud.com');
await page.locator("[placeholder='Phone']").fill('1234567890');
const companyNameInput = page.locator('input[placeholder="Company Name"]:not([type="hidden"])');
await companyNameInput.fill('QAOncloud');
const companyNameInput1 = page.locator('input[placeholder="Role"]:not([type="hidden"])');
await companyNameInput1.fill('QA Engineer');
await page.locator("[placeholder='Requirements']").fill('Testing');
await page.locator('.recaptcha-checkbox-checkmark').click();

await page.locator('.contact-btn').click();


/*
    
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
*/
})