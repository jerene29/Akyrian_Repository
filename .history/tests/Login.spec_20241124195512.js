import { test, expect } from '@playwright/test';
import path from 'path';  // Correctly import 'path' module once

// Test: Login to the Portal and login as Source Capture User
test('Login to the Portal and login as Source Capture User', async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 1280, height: 720 });

    // Visit the portal
    await page.goto('https://qa.akyrian.com/', { timeout: 30000 });
    await page.waitForTimeout(10000);

    // Login action
    await page.fill('#email', 'sourcecapture@example.com');
    await page.fill('#password', 'Password!1');
    await page.click('#loginAs-btn');

    // Wait for onboarding search and click
    await page.locator('[data-cy="onboarding-search-study"]').waitFor({ state: 'visible', timeout: 4000 });
    await page.locator('[data-cy="onboarding-search-study"]').click();

    // Search for study
    await page.fill('#search', 'QAonCloud Test');

    // Wait for study version and click
    await page.locator('[data-test="cm226tpiz0kxl14ev4pzlcvfc"] #study-versionmain').waitFor({ state: 'visible' });
    await page.locator("[data-test='cm226tpiz0kxl14ev4pzlcvfc'] #study-versionmain").filter({ hasText: 'v.4.b' }).click();

    // Click on patient name
    await page.locator('[data-cy="selectable-patient"]').filter({ hasText: 'QA_AU-02' }).waitFor({ state: 'visible' }, { timeout: 40000 });
    await page.locator('[data-cy="selectable-patient"]').filter({ hasText: 'QA_AU-02' }).click();

    // Wait for visit tab and click
    await page.locator('[data-cy="visit-cm31qz0990dhkigpbpkpgy2p5"]').scrollIntoViewIfNeeded();
    await page.locator('[data-cy="visit-cm31qz0990dhkigpbpkpgy2p5"]').filter({ hasText: 'AUTOMATION-sign-CRF' }).click();

    // Click the 'Source Question' tab
    await page.waitForSelector('#cy-tabsource', { visible: true, timeout: 60000 });
    await page.locator('#cy-tabsource').scrollIntoViewIfNeeded();
    await page.locator('#cy-tabsource').click({ force: true });

    // Question 1 - Image upload
    await page.locator('[data-cy="question-card-cm2n696qj08n8zdk3hgiru340"] > [data-cy="question-card"]', { visible: true, stable: true });
    await page.locator('[data-cy="question-card-cm2n696qj08n8zdk3hgiru340"] > [data-cy="question-card"]').click({ timeout: 60000 });
    await page.locator('[data-cy="open-modal-capture"]:visible').first().click({ force: true });

    // Locate and click action menu icon
    const actionMenuIconLocator = page.locator('[data-cy="capture-action-cm2n696qj08n8zdk3hgiru340"] > .question-card-action-menu-icon').first();
    await actionMenuIconLocator.click();

    // Wait for file input and upload an image
    const fileInput = page.locator('input[type="file"]');
    const imagePath = path.join(__dirname, 'Images', 'Image4.png');  // Use the imported 'path' module for the file path
    await fileInput.setInputFiles(imagePath);

    // Wait for confirmation modal and click 'Yes'
    await page.waitForTimeout(20000);
    await expect(page.locator('[data-cy="confirmation-modal-title"]')).toHaveText(/No Name Found/);
    await page.locator('[data-cy="confirmModal-confirmButton"]').click();

    // Fill first and last name
    await page.fill('#first-name-input-sc-intake', 'Test1');
    await page.fill('#last-name-input-sc-intake', 'Test2');

    // Submit the form
    await page.locator('[data-cy="submit-sc-intake-button"]').click();

    // Manual redact button
    const manualRedactButton = page.locator('[data-cy="manual-redact-button"]');
    await manualRedactButton.scrollIntoViewIfNeeded();
    await page.waitForTimeout(30000);
    await manualRedactButton.click();
    await page.locator('[data-cy="continue-to-suggestion-button"]').click();
    await page.waitForTimeout(10000);
    await page.locator('[data-cy="confirm-redact-button"]').click();
    await page.waitForTimeout(10000);

    // Right chip actions
    await page.locator('[data-cy="right-chip-Allergies-AT"]').click();
    await page.locator('[data-cy="right-chip-BloodPressureAT"]').click();
    await page.locator('[data-cy="submit-bottom-chips-menu"]').click();
    await page.waitForTimeout(10000);

    // Logout action
    await page.locator('[class="anticon anticon-down DownOutlined__Root-knxRmY jZCmAT img-icon img-right"]').click();
    await page.locator('[data-cy="logout-text"]').click();
});
test('Login to the Portal and login as Source Markup user', async ({ page }) => {

    // Visit the portal
    await page.goto('https://qa.akyrian.com/', { timeout: 30000 });
    await page.waitForTimeout(10000);

    // Login action
    await page.fill('#email', 'sourcemarkup@example.com');
    await page.fill('#password', 'Password!1');
    await page.click('#loginAs-btn');

// Wait for onboarding search and click
await page.locator('[data-cy="onboarding-search-study"]').waitFor({ state: 'visible', timeout: 4000 });
await page.locator('[data-cy="onboarding-search-study"]').click();

// Search for study
await page.fill('#search', 'QAonCloud Test');

// Wait for study version and click
await page.locator('[data-test="cm226tpiz0kxl14ev4pzlcvfc"] #study-versionmain').waitFor({ state: 'visible' });
await page.locator("[data-test='cm226tpiz0kxl14ev4pzlcvfc'] #study-versionmain").filter({ hasText: 'v.4.b' }).click();

// Click on patient name
await page.locator('[data-cy="selectable-patient"]').filter({ hasText: 'QA_AU-02' }).waitFor({ state: 'visible' }, { timeout: 40000 });
await page.locator('[data-cy="selectable-patient"]').filter({ hasText: 'QA_AU-02' }).click();

// Wait for visit tab and click
await page.locator('[data-cy="visit-cm31qz0990dhkigpbpkpgy2p5"]').filter({ hasText: 'AUTOMATION-sign-CRF' }).click();



    // Check Pending Snippet-1
    await page.click('[data-cy="question-card-cm2n696qj08n8zdk3hgiru340"] >> text="CRF: Allergies-AT"');
    await page.waitForTimeout(10000);
       // Locate and click action menu icon
       const actionMenuIconLocator = page.locator("[data-cy='snippet-action-cm2n696qj08n8zdk3hgiru340'] > .question-card-action-menu-icon").first();
       await actionMenuIconLocator.click();


    // Save Snippet
    await page.click('[data-cy="right-chip-Allergies-AT"]');
    await page.click('[data-cy="non-streamline-save-snippet"]');
    await page.click('[data-cy="right-chip-BloodPressureAT"]');
    await page.click('[data-cy="non-streamline-save-snippet"]');
    // Uncomment below if you want to include the Height chip.
    // await page.click('[data-cy="right-chip-Height"]');
    // await page.click('[data-cy="non-streamline-save-snippet"]');

    await page.click('[data-cy="submit-bottom-chips-menu"]');
    await page.click('[data-cy="done-snippet-button"] >> text="Done"');

    // Logout
    await page.click('[class="anticon anticon-down DownOutlined__Root-knxRmY jZCmAT img-icon img-right"]');
    await page.click('[data-cy="logout-text"]');
});

test.only('Login to the Portal and login as Snippet Assessment', async ({ page }) => {
    // Visit the portal
    await page.goto('https://qa.akyrian.com/', { timeout: 30000 });
    await page.waitForTimeout(10000);

    // Login action
    await page.fill('#email', 'sourcemarkup@example.com');
    await page.fill('#password', 'Password!1');
    await page.click('#loginAs-btn');

// Wait for onboarding search and click
await page.locator('[data-cy="onboarding-search-study"]').waitFor({ state: 'visible', timeout: 4000 });
await page.locator('[data-cy="onboarding-search-study"]').click();

// Search for study
await page.fill('#search', 'QAonCloud Test');

// Wait for study version and click
await page.locator('[data-test="cm226tpiz0kxl14ev4pzlcvfc"] #study-versionmain').waitFor({ state: 'visible' });
await page.locator("[data-test='cm226tpiz0kxl14ev4pzlcvfc'] #study-versionmain").filter({ hasText: 'v.4.b' }).click();

// Click on patient name
await page.locator('[data-cy="selectable-patient"]').filter({ hasText: 'QA_AU-02' }).waitFor({ state: 'visible' }, { timeout: 40000 });
await page.locator('[data-cy="selectable-patient"]').filter({ hasText: 'QA_AU-02' }).click();

// Wait for visit tab and click
await page.locator('[data-cy="visit-cm31qz0990dhkigpbpkpgy2p5"]').filter({ hasText: 'AUTOMATION-sign-CRF' }).click();


    // Check Review Snippet-1
    await page.click('[data-cy="question-card-cm2n696qj08n8zdk3hgiru340"] >> text="CRF: Allergies-AT"');
    await page.waitForTimeout(10000);
           // Locate and click action menu icon
           const actionMenuIconLocator = page.locator('[data-cy="review-sc-snippet-action-cm2n696qj08n8zdk3hgiru340"] >> .question-card-action-menu-icon').first();
           await actionMenuIconLocator.click();
    await page.click('[data-cy="button-approve-sa"]');
    await page.waitForTimeout(10000);
    // Click Close
    await page.click('[data-cy="carousel-close"]');

    // Check Review Snippet-2
    await page.click('[data-cy="question-card-cm2n6fno508ntzdk3qjay0ip3"] >> text="CRF: Age AT"');
    await page.waitForTimeout(10000);
     // Locate and click action menu icon
     const actionMenuIconLocator1 = page.locator('[data-cy="review-sc-snippet-action-cm2n6fno508ntzdk3qjay0ip3"] >> .question-card-action-menu-icon').first();
     await actionMenuIconLocator1.click();

    await page.click('[data-cy="button-approve-sa"]');
    await page.waitForTimeout(10000);
    // Click Close
    await page.click('[data-cy="carousel-close"]');

    // Logout
    await page.click('[class="anticon anticon-down DownOutlined__Root-knxRmY jZCmAT img-icon img-right"]');
    await page.click('[data-cy="logout-text"]');
});
