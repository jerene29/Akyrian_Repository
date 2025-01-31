import { test, expect } from '@playwright/test';
    // Test: Login to the Portal and login as Source Capture User
test('Login to the Portal and login as Source Capture User',async ({ page }) => {
        // Set viewport size
    await page.setViewportSize({ width: 1280, height: 720 });

    // Visit the portal
    await page.goto('https://qa.akyrian.com/', { timeout: 30000 });
    await page.waitForTimeout(10000);

    // Login action
    await page.fill('#email', 'sourcecapture@example.com');
    await page.fill('#password', 'Password!1');
    await page.click('#loginAs-btn');


    await page.locator('[data-cy="onboarding-search-study"]').waitFor({
        state: 'visible',  timeout: 4000, });
 await page.locator('[data-cy="onboarding-search-study"]').click();

    await page.fill('#search', 'QAonCloud Test');

    // Wait for study version to appear and click
    await page.locator('[data-test="cm226tpiz0kxl14ev4pzlcvfc"] #study-versionmain').waitFor({ state: 'visible' });

    await page.locator("[data-test='cm226tpiz0kxl14ev4pzlcvfc'] #study-versionmain")
        .filter({ hasText: 'v.4.b' }, { timeout: 60000 })
        .click();

    // Click the patient name
    await page.locator('[data-cy="selectable-patient"]').filter({ hasText: 'QA_AU-02' }).waitFor({ state: 'visible' }, { timeout: 40000 });

    await page.locator('[data-cy="selectable-patient"]')
    .filter({ hasText: 'QA_AU-02' }).click();

    // Wait for the visit tab and click
    await page.locator('[data-cy="visit-cm31qz0990dhkigpbpkpgy2p5"]').scrollIntoViewIfNeeded(); // 60 seconds timeout

await page.locator('[data-cy="visit-cm31qz0990dhkigpbpkpgy2p5"]')
    .filter({ hasText: 'AUTOMATION-sign-CRF' })
    .click();

    // Click on the 'Source Question' tab
    //await page.locator('#cy-tabsource').waitFor({ state: 'visible' });
    await page.waitForSelector('#cy-tabsource', { visible: true, stable: true });
    await page.locator('#cy-tabsource').scrollIntoViewIfNeeded();

    await page.locator('#cy-tabsource').click({ timeout: 60000 }); // 60 seconds

    // Question 1 - Image upload
//await page.locator('[data-cy="question-card-cm2n696qj08n8zdk3hgiru340"] > [data-cy="question-card"]').waitFor({ state: 'visible' })
await page.locator('[data-cy="question-card-cm2n696qj08n8zdk3hgiru340"] > [data-cy="question-card"]').click();
//await page.locator('[data-cy="open-modal-capture"]:visible').first().click({ force: true });
//await page.locator("[data-cy='capture-action-cm2n696qj08n8zdk3hgiru340'] > .question-card-action-menu-icon").waitFor({ state: 'visible', timeout: 60000 }); // 60 seconds

await page.locator('[data-cy="capture-action-cm2n696qj08n8zdk3hgiru340"] > .question-card-action-menu-icon')
  .waitFor({ state: 'visible', timeout: 60000 });
  const imagePath = path.join(__dirname, 'Images', 'Image4.png'); 
  // Update with correct path to your image
  await page.locator('input[type="file"]').setInputFiles(imagePath);

   // Wait for the modal and click 'Yes'
await page.waitForTimeout(20000);
await page.locator('[data-cy="confirmation-modal-title"]').contains('No Name Found');
await page.locator('[data-cy="confirmModal-confirmButton"]').click();

// Fill first and last name
await page.fill('#first-name-input-sc-intake', 'Test1');
await page.fill('#last-name-input-sc-intake', 'Test2');
// Click Submit
await page.locator('[data-cy="submit-sc-intake-button"]').click();
// Manual redact button
await page.locator('[data-cy="manual-redact-button"]').scrollIntoView();
await page.waitForTimeout(30000);
await page.locator('[data-cy="manual-redact-button"]').click();
await page.locator('[data-cy="continue-to-suggestion-button"]').click();
await page.waitForTimeout(10000);    
await page.locator('[data-cy="confirm-redact-button"]').click();
await page.waitForTimeout(10000);
// Right chip actions
await page.locator('[data-cy="right-chip-Allergies-AT"]').click();
await page.locator('[data-cy="right-chip-BloodPressureAT"]').click();
await page.locator('[data-cy="submit-bottom-chips-menu"]').click();
await page.waitForTimeout(10000);
await page.locator('[data-cy="UNATTACHED"]').click();

// Question 2 - Image upload (same as Question 1)
await page.locator('[data-cy="question-card-cm2n6fno508ntzdk3qjay0ip3"] > [data-cy="question-card"]').click();
await page.locator('[data-cy="open-modal-capture"]:visible').first().click({ force: true });
await page.locator('[data-cy="upload-sc-button"]').click();
const filepath2 = 'path_to_your_image/SCImage.png'; // Update with correct path to your image
await page.setInputFiles('input[type="file"]', filepath2);

// Wait for the modal and click 'Yes'
await page.waitForTimeout(30000);
await page.locator('[data-cy="confirmation-modal-title"]').contains('No Name Found');
await page.locator('[data-cy="confirmModal-confirmButton"]').click();

// Fill first and last name for question 2
await page.fill('#first-name-input-sc-intake', 'Test1');
await page.fill('#last-name-input-sc-intake', 'Test2');

// Click Submit
await page.locator('[data-cy="submit-sc-intake-button"]').click();
// Manual redact for question 2
await page.locator('[data-cy="manual-redact-button"]').scrollIntoView();
await page.waitForTimeout(30000);
await page.locator('[data-cy="manual-redact-button"]').click();
await page.locator('[data-cy="continue-to-suggestion-button"]').click();
await page.waitForTimeout(10000);
await page.locator('[data-cy="confirm-redact-button"]').click();
await page.waitForTimeout(10000);
// Right chip actions for question 2
await page.locator('[data-cy="right-chip-AgeAT"]').click();
await page.locator('[data-cy="submit-bottom-chips-menu"]').click();

await page.waitForTimeout(10000);
await page.locator('[data-cy="UNATTACHED"]').click();
await page.waitForTimeout(10000);
// Question 4 - Image upload
await page.locator('[data-cy="question-card-cm2n6j4ki08p8zdk3d4xchxo9"] > [data-cy="question-card"]').click();
await page.locator('[data-cy="open-modal-capture"]:visible').first().click({ force: true });
await page.locator('[data-cy="upload-sc-button"]').click();
const filepath3 = 'path_to_your_image/SCImage.png'; // Update with correct path to your image
await page.setInputFiles('input[type="file"]', filepath3);
// Wait for the modal and click 'Yes'
await page.waitForTimeout(30000);
await page.locator('[data-cy="confirmation-modal-title"]').contains('No Name Found');
await page.locator('[data-cy="confirmModal-confirmButton"]').click();

// Fill first and last name for question 4
await page.fill('#first-name-input-sc-intake', 'Test1');
await page.fill('#last-name-input-sc-intake', 'Test2');

// Click Submit
await page.locator('[data-cy="submit-sc-intake-button"]').click();

// Manual redact for question 4
await page.locator('[data-cy="manual-redact-button"]').scrollIntoView();
await page.waitForTimeout(30000);
await page.locator('[data-cy="manual-redact-button"]').click();
await page.locator('[data-cy="continue-to-suggestion-button"]').click();
await page.waitForTimeout(10000);
await page.locator('[data-cy="confirm-redact-button"]').click();
await page.waitForTimeout(10000);

// Click "Attached" tab and check question cards
await page.locator('[data-cy="ATTACHED"]').click();
await page.locator('[data-cy="question-card-cm2n696qj08n8zdk3hgiru340"]').contains('CRF: Allergies-AT');
await page.locator('[data-cy="question-card-cm2n69vn408nhzdk3qzqxsxnv"]').contains('CRF: Blood Pressure AT');
await page.locator('[data-cy="question-card-cm2n6fno508ntzdk3qjay0ip3"]').contains('CRF: Age AT');
    // Ensure logout is handled at the end
    await page.locator('[class="anticon anticon-down DownOutlined__Root-knxRmY jZCmAT img-icon img-right"]').click();
    await page.locator('[data-cy="logout-text"]').click();
});
