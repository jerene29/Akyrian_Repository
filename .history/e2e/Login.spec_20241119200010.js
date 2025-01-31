const { test, expect } = require('@playwright/test');
 

    // Test: Login to the Portal and login as Source Capture User
    test('Login to the Portal and login as Source Capture User', async ({ page }) => {
        // Set viewport size
        await page.setViewportSize({ width: 1280, height: 720 });

        // Visit the portal
        await page.goto('https://qa.akyrian.com/');

        // Login action
        await page.fill('#email', 'sourcecapture@example.com');
        await page.fill('#password', 'Password!1'); // Don't log password by default
        await page.click('#loginAs-btn');
        
        // Wait for the page to load
        await page.waitForTimeout(4000);
// Search for the study "QAonCloud Test"
await page.locator('[data-cy="onboarding-search-study"]').click();
await page.fill('[class="Text__StyledText-fcSGOX dbePOD pointer search-text"]', 'QAonCloud Test', { timeout: 60000 });

  
// Click the study version.
await page.locator('[class="Text__StyledText-fcSGOX liUSLx adjust-version mb-0.5"]').click();

// Click the patient name
await page.locator('[class="Text__StyledText-fcSGOX gSpvOG sider-patient-name"]').click();

// Wait for the visit tab to load and click the visit card
await page.waitForTimeout(20000);
await page.locator('[data-cy="visit-cm2ol891a0amjzdk3m1xitkk2"][data-visit-name="AUTOMATION-sign-CRF"]').click();

// Click on the 'Source Question' tab
await page.locator('[data-cy="sourceQuestionTab"]').click();

// Question 1 - Image upload
await page.locator('[data-cy="question-card-cm2n696qj08n8zdk3hgiru340"] > [data-cy="question-card"]').click();
await page.locator('[data-cy="open-modal-capture"]:visible').first().click({ force: true });
await page.locator('[data-cy="upload-sc-button"]').click();
const filepath1 = 'path_to_your_image/Image4.png'; 
// Update with correct path to your image
await page.setInputFiles('input[type="file"]', filepath1);

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

// Logout
await page.locator('[class="anticon anticon-down DownOutlined__Root-knxRmY jZCmAT img-icon img-right"]').click();
await page.locator('[data-cy="logout-text"]').click();
    })