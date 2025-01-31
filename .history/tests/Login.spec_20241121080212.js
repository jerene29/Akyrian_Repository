const { test, expect } = require('@playwright/test');
const path = require('path'); // Ensure path module is imported for file paths

test('Login to the Portal and login as Source Capture User', async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 1280, height: 720 });

    // Visit the portal
    await page.goto('https://qa.akyrian.com/', { timeout: 100000 });

    // Login action
    await page.fill('#email', 'sourcecapture@example.com');
    await page.fill('#password', 'Password!1');
    await page.click('#loginAs-btn');

    // Search for the study "QAonCloud Test"
    await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight);  // Scroll down by the height of the viewport
    })
  
    await page.locator('#search').click().fill('QAonCloud Test');
    
    // Wait for study version to appear and click
    await page.locator("[data-test='cm226tpiz0kxl14ev4pzlcvfc'] #study-versionmain")
        .filter({ hasText: 'v.4.b' })
        .click();

    // Click the patient name
    await page.locator('[class="Text__StyledText-fcSGOX gSpvOG sider-patient-name"]')
        .filter({ hasText: 'QA_AU-02' })
        .click();

    // Wait for the visit tab and click
    await page.locator('[data-cy="visit-cm2ol891a0amjzdk3m1xitkk2"]')
        .filter({ hasText: 'AUTOMATION-sign-CRF' })
        .click();
        await page.waitForTimeout(40000);

    // Click on the 'Source Question' tab
    await page.locator('[data-cy="sourceQuestionTab"]').click();

    // Image upload for Question 1
    await page.locator('[data-cy="question-card-cm2n696qj08n8zdk3hgiru340"] > [data-cy="question-card"]').click();
    await page.locator('[data-cy="open-modal-capture"]:visible').first().click({ force: true });
    await page.locator('[data-cy="upload-sc-button"]').click();
    const filepath1 = path.join(__dirname, 'path_to_your_image/Image4.png');
    await page.setInputFiles('input[type="file"]', filepath1);

    // Wait for confirmation modal and submit
    await page.locator('[data-cy="confirmation-modal-title"]').toHaveText('No Name Found');
    await page.locator('[data-cy="confirmModal-confirmButton"]').click();
    
    // Fill in names and submit
    await page.fill('#first-name-input-sc-intake', 'Test1');
    await page.fill('#last-name-input-sc-intake', 'Test2');
    await page.locator('[data-cy="submit-sc-intake-button"]').click();

    // Repeat similar actions for other questions...

    // Ensure logout is handled at the end
    await page.locator('[class="anticon anticon-down DownOutlined__Root-knxRmY jZCmAT img-icon img-right"]').click();
    await page.locator('[data-cy="logout-text"]').click();
});
