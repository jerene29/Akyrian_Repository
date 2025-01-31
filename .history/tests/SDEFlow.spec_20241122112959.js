import { test, expect } from '@playwright/test';


// Playwright does not require `Cypress.on('uncaught:exception')`
// Instead, we use error handling during the test run

test.describe('Akyrian SDE Happy Flow', () => {
  test('Login to the Portal and login as Source Capture user', async ({ page }) => {
    // Set viewport size (similar to Cypress' cy.viewport)
    await page.setViewportSize({ width: 1280, height: 720 });

    // Visit the URL
    await page.goto('https://qa.akyrian.com/');

    // Login
    await page.fill('#email', 'sourcecapture@example.com');
    await page.fill('#password', 'Password!1');
    await page.click('#loginAs-btn');
    await page.waitForTimeout(10000); // Wait for 10 seconds

    // Search study
    await page.locator('[data-cy="onboarding-search-study"]').waitFor({
        state: 'visible',  timeout: 4000, });
 await page.locator('[data-cy="onboarding-search-study"]').click();

    await page.fill('#search', 'QAonCloud Test');

    await page.locator('[data-test="cm226tpiz0kxl14ev4pzlcvfc"] #study-versionmain').waitFor({ state: 'visible' });

    await page.locator("[data-test='cm226tpiz0kxl14ev4pzlcvfc'] #study-versionmain")
        .filter({ hasText: 'v.4.b' }, { timeout: 60000 })
        .click();
    // Click the patient name
    await page.locator('[data-cy="selectable-patient"]').filter({ hasText: 'QA_AU-04' }).waitFor({ state: 'visible' }, { timeout: 40000 });

    await page.locator('[data-cy="selectable-patient"]')
    .filter({ hasText: 'QA_AU-04' }).click();    await page.waitForTimeout(10000); // Wait for 10 seconds

    // Click Visit and open the SDE Tab
    await page.locator('[data-cy="visit-cm3hbwbcu1oydigpb1zmetr4c"][data-visit-name="AUTOMATION-sign-CRF"]').click();
    await page.waitForTimeout(30000); // Wait for 30 seconds
    await page.locator('[data-cy="sourceQuestionTab"]').click();

    // Question 1 - Check Image upload
    await page.locator('[data-cy="question-card-cm2n696qj08n8zdk3hgiru340"] > [data-cy="question-card"]').click();
    await page.locator('[data-cy="open-modal-capture"]:visible').first().click({ force: true });
    await page.locator('[data-cy="upload-sc-button"]').click();

    const filepath = 'AUTOMATION - without name.png'; // Path to your PNG file
    await page.locator('input[type="file"]').setInputFiles(filepath);
    await page.waitForTimeout(30000); // Wait for 30 seconds

    // Check that the patient name is "Not Found"
    await expect(page.locator('[data-cy="not-found-data-patientsName"]')).toHaveText(': Not Found');
    await expect(page.locator('[data-cy="verified-data-dateOfBirth"]')).toHaveText(': Verified');
    await expect(page.locator('[data-cy="verified-data-visitDate"]')).toHaveText(': Verified');

    // Submit
    await page.locator('[data-cy="manual-redact-button"]').scrollIntoViewIfNeeded();
    await page.waitForTimeout(30000); // Wait for 30 seconds
    await page.locator('[data-cy="manual-redact-button"]').click();
    await page.locator('[data-cy="continue-to-suggestion-button"]').click();
    await page.waitForTimeout(10000); // Wait for 10 seconds
    await page.locator('[data-cy="confirm-redact-button"]').click();
    await page.waitForTimeout(40000); // Wait for 40 seconds

    // Question 2 - Check Image upload
    await page.locator('[data-cy="UNATTACHED"]').click();
    await page.waitForTimeout(10000); // Wait for 10 seconds
    await page.locator('[data-cy="question-card-cm2n69vn408nhzdk3qzqxsxnv"] > [data-cy="question-card"]').click();
    await page.locator('[data-cy="open-modal-capture"]:visible').first().click({ force: true });
    await page.locator('[data-cy="upload-sc-button"]').click();
    const filepath2 = 'AUTOMATION without DOB.png'; // Path to your PNG file
    await page.locator('input[type="file"]').setInputFiles(filepath2);
    await page.waitForTimeout(40000); // Wait for 40 seconds

    // Check that the DOB is "Not Found"
    await expect(page.locator('[data-cy="not-found-data-dateOfBirth"]')).toHaveText(': Not Found');
    await expect(page.locator('[data-cy="verified-data-patientsName"]')).toHaveText(': Verified');
    await expect(page.locator('[data-cy="verified-data-visitDate"]')).toHaveText(': Verified');

    // Submit
    await page.locator('[data-cy="manual-redact-button"]').scrollIntoViewIfNeeded();
    await page.waitForTimeout(30000); // Wait for 30 seconds
    await page.locator('[data-cy="manual-redact-button"]').click();
    await page.locator('[data-cy="continue-to-suggestion-button"]').click();
    await page.waitForTimeout(10000); // Wait for 10 seconds
    await page.locator('[data-cy="confirm-redact-button"]').click();
    await page.waitForTimeout(40000); // Wait for 40 seconds

    // Continue with the other steps similarly...

    // Logout
    await page.locator('[class="anticon anticon-down DownOutlined__Root-knxRmY jZCmAT img-icon img-right"]').click();
    await page.locator('[data-cy="logout-text"]').click();
  });
});