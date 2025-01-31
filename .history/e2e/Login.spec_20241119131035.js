const { test, expect } = require('@playwright/test');

let RandomvisitID;

// Helper function to generate random letters
function getRandomLetters() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // All uppercase letters
    return letters.charAt(Math.floor(Math.random() * letters.length)) + 
           letters.charAt(Math.floor(Math.random() * letters.length));
}

test.describe('SIGNCRF Flow', () => {

    // Setup before all tests
    test.beforeAll(() => {
        // Generate RandomvisitID once before all tests
        const randomNumber1 = Math.floor(Math.random() * 900) + 100; // Random number between 100 and 999
        RandomvisitID = `ABC-ACB${randomNumber1}`; // Assign it to the variable
    });

    // Test: Login to the Portal and login as Source Capture User
    test('Login to the Portal and login as Source Capture User', async ({ page }) => {
        // Set viewport size
        await page.setViewportSize({ width: 1280, height: 720 });

        // Visit the portal
        await page.goto('https://qa.akyrian.com/');

        // Login action
        await page.fill('#email', 'streamlinesc@example.com');
        await page.fill('#password', 'Password!1'); // Don't log password by default
        await page.click('#loginAs-btn');
        
        // Wait for the page to load
        await page.waitForTimeout(4000);

        // Search for study
        const uniqueName = `DIVYA_${getRandomLetters()}`;
        await page.fill('[class="TextField__Container-gjVpBo hWQGFl search-study input-container"]', 'CVD-19');
        await page.waitForTimeout(10000);

        await page.click('.Text__StyledText-fcSGOX liUSLx adjust-version.mb-0.5');

        // Wait for the add patient button
        await page.waitForTimeout(10000);

        // Click Add Patient Button
        await page.dblClick('#add-patient-icon > .ant-row > :nth-child(2) > .Text__StyledText-fcSGOX');
        
        // Ensure the Submit button is disabled
        await expect(page.locator('[data-cy="button-submit-add-patient"]')).toBeDisabled();

        // Fill out patient information
        await page.fill('#firstName', uniqueName);
        await page.fill('#lastName', 'Automation01');
        await page.fill('#patientStudyId', RandomvisitID);

        // Select Patient Site and Gender
        await page.click('[data-cy="patient-site"]');
        await page.click('.ant-select-item-option-content:has-text("Bellevue Hospital")');
        await page.check('input[type="radio"][name="FEMALE"]');

        // Select Date of Birth
        await page.click('[data-cy="select-year-addPatient"]');
        await page.click('.ant-select-item-option-content:has-text("2023")');
        await page.click('[data-cy="select-month-addPatient"]');
        await page.click('.ant-select-item-option-content:has-text("January")');
        await page.click('[data-cy="select-date-addPatient"]');
        await page.click("[title='7'] > .ant-select-item-option-content");

        // Submit the Add Patient Form
        await page.click('[data-cy="button-submit-add-patient"]');
        await page.waitForTimeout(10000);

        // Click on the visit
        await page.click(`.Text__StyledText-fcSGOX.gSpvOG.sider-patient-name:has-text("${RandomvisitID}")`);
        await page.waitForTimeout(10000);

        // Update Visit Status
        await page.click('[data-cy="select-visit-status"] > .ant-select-selector');
        await page.click("[label='Visit Did Occur'] > .ant-select-item-option-content");
        await page.click('[data-cy="select-year"]');
        await page.click("[title='2023'] > .ant-select-item-option-content");
        await page.click('[data-cy="select-month"]');
        await page.click("[title='February'] > .ant-select-item-option-content");
        await page.click('[data-cy="select-date"]');
        await page.click("[title='5'] > .ant-select-item-option-content", { force: true });

        // Submit the Visit Form
        await page.click('[data-cy="button-submit-visit"]');
        await page.waitForTimeout(1000);

        // Fill out the questionnaire
        await expect(page.locator('[data-cy="question-card"]:has-text("Test1")')).toBeVisible();
        await page.fill('[data-cy="answer-input-field-cm32ksnys00aj0t5ma0npcqfn-0-0"]', '1');
        await page.click('[data-cy="save-button-cm32kso0v0enaigpbly5gzbvb"]');

        // Logout
        await page.click('.anticon.anticon-down.DownOutlined__Root-knxRmY');
        await page.click('[data-cy="logout-text"]');
    });

});