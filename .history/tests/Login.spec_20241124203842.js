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

test('Login to the Portal and login as Snippet Assessment', async ({ page }) => {
    // Visit the portal
    await page.goto('https://qa.akyrian.com/', { timeout: 30000 });
    await page.waitForTimeout(10000);

    // Login action
    await page.fill('#email', 'snippetassessment@example.com');
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
           const actionMenuIconLocator = page.locator("[data-cy='review-sc-snippet-action-cm2n696qj08n8zdk3hgiru340'] > .question-card-action-menu-icon").first();
           await actionMenuIconLocator.click();
    await page.click('[data-cy="button-approve-sa"]');
    await page.waitForTimeout(10000);
    // Click Close
    await page.click('[data-cy="carousel-close"]');

    // Check Review Snippet-2
    await page.click('[data-cy="question-card-cm2n69vn408nhzdk3qzqxsxnv"] >> text="CRF: Blood Pressure AT"');
    await page.waitForTimeout(10000);
     // Locate and click action menu icon
     const actionMenuIconLocator1 = page.locator("[data-cy='reject-SC-icon']").first();
     await actionMenuIconLocator1.click();

    await page.click('[data-cy="button-approve-sa"]');
    await page.waitForTimeout(10000);

    // Logout
    await page.click('[class="anticon anticon-down DownOutlined__Root-knxRmY jZCmAT img-icon img-right"]');
    await page.click('[data-cy="logout-text"]');
});
test.only('Login to the Portal and login as Data Entry A', async ({ page }) => {
   // Visit the portal
   await page.goto('https://qa.akyrian.com/', { timeout: 30000 });
   await page.waitForTimeout(10000);

   // Login action
   await page.fill('#email', 'dataentrya@example.com');
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

    // Check Data Entry - Allergies-AT
    await page.click('[data-cy="question-card-cm2n696qj08n8zdk3hgiru340"] >> text="CRF: Allergies-AT"');
    await page.waitForTimeout(10000);
  // Locate and click action menu icon
  const actionMenuIconLocator = page.locator("[data-cy='data-entry-action-cm2n696qj08n8zdk3hgiru340'] [d='M413.995 905.344c0 18.389-14.933 33.323-33.323 33.323h-76.672c-73.515 0-133.333-59.819-133.333-133.333v-586.667c0-73.515 59.819-133.333 133.333-133.333h409.813c73.515 0 133.333 59.819 133.333 133.333v198.315c0 18.432-14.933 33.365-33.323 33.365-18.432 0-33.323-14.933-33.323-33.365v-198.315c0-36.779-29.909-66.688-66.688-66.688h-409.813c-36.779 0-66.688 29.909-66.688 66.688v586.667c0 36.779 29.909 66.688 66.688 66.688h76.672c18.389 0 33.323 14.933 33.323 33.28zM730.496 241.067c0-18.432-16.939-33.365-37.845-33.365h-389.803c-20.907 0-37.845 14.933-37.845 33.365 0 18.389 16.981 33.28 37.845 33.28h389.803c20.907 0 37.845-14.891 37.845-33.28zM652.885 374.4c0-18.432-20.907-33.365-46.677-33.365h-294.485c-25.771 0-46.72 14.933-46.72 33.365 0 18.389 20.907 33.28 46.72 33.28h294.485c25.771 0 46.677-14.891 46.677-33.28zM296.533 474.411c-17.408 0-31.531 14.933-31.531 33.365 0 18.389 14.123 33.28 31.531 33.28h130.944c17.365 0 31.488-14.891 31.488-33.28 0-18.432-14.080-33.365-31.488-33.365h-130.987zM834.133 613.931l-25.6 25.643-64.171-64.213 25.685-25.6c5.205-5.248 14.293-5.248 19.541 0l44.587 44.629c5.376 5.376 5.376 14.165 0 19.541zM619.861 828.459l-64.128-64.171 165.76-166.016 64.128 64.171-165.76 166.016zM540.928 795.221l48 48.043-66.816 18.859 18.816-66.901zM857.045 571.52l-44.587-44.672c-8.704-8.704-40.107-25.173-65.237 0l-225.835 226.005c-2.005 2.005-3.413 4.352-4.139 7.040l-34.005 121.216c-1.621 5.632 0.043 11.648 4.096 15.829 4.139 4.224 12.373 4.907 15.829 4.139l121.131-34.133c2.688-0.725 5.077-2.133 7.040-4.096l225.707-226.048c17.92-17.92 17.92-47.232 0-65.28z']").first();
  await actionMenuIconLocator.click();
    // Type "allergen" in the answer field
    await page.fill('[data-cy="answer-input-field-cm2n696mo00000t5m8a76d1vb-0-0"]:first', 'allergen');

    // Submit Data Entry
    await page.click('.slick-active >> nth=1 >> [data-cy="modal-container"] >> [data-cy="carousel-container"] >> [data-cy="content-outer-container"] >> [data-cy="monitor-flow-body"] >> [data-cy="data-entry-container"] >> [data-cy="data-entry-input-container"] >> [data-cy="question-input-container"] >> nth=2 >> .mt-60 >> div >> [data-cy="submit-data-entry"]');
    
    // Check Data Entry - Blood Pressure
    await page.waitForTimeout(10000);
    await page.fill('[data-cy="answer-input-field-cm2n69vll00010t5m329c90wf-0-0"]:first', '120');
    await page.waitForTimeout(5000);

    // Submit Blood Pressure data entry
    await page.click('.slick-active >> nth=1 >> [data-cy="modal-container"] >> [data-cy="carousel-container"] >> [data-cy="content-outer-container"] >> [data-cy="monitor-flow-body"] >> [data-cy="data-entry-container"] >> [data-cy="data-entry-input-container"] >> [data-cy="question-input-container"] >> nth=2 >> .mt-60 >> div >> [data-cy="submit-data-entry"]');

    // Logout
    await page.click('[class="anticon anticon-down DownOutlined__Root-knxRmY jZCmAT img-icon img-right"]');
    await page.click('[data-cy="logout-text"]');
});