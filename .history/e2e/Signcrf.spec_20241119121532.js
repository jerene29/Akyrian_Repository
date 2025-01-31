const { test, expect } = require('@playwright/test')
let RandomvisitID; // Declare a variable to store the visit ID

// Helper function to generate a random study name
function getRandomLetters() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // All uppercase letters
    return letters.charAt(Math.floor(Math.random() * letters.length)) + 
           letters.charAt(Math.floor(Math.random() * letters.length));
}

// Login Page Test
test.describe('SIGNCRF Flow', () => {

    test.beforeAll(() => {
        // Generate RandomvisitID once before all tests
        const randomNumber1 = Math.floor(Math.random() * 900) + 100; // Random number between 100 and 999
        RandomvisitID = `ABC-ACB${randomNumber1}`; // Assign it to the variable
    });

    test('Login to the Portal and login as Source Capture User', async ({ page }) => {
        // Set viewport size
        await page.setViewportSize({ width: 1280, height: 720 });

        // Navigate to the portal
        await page.goto('https://qa.akyrian.com/');

        // Perform login
        await page.fill('#email', 'streamlinesc@example.com');
        await page.fill('#password', 'Password!1');  // Hide the password in logs
        await page.click('#loginAs-btn');
        
        // Wait for the login process to complete
        await page.waitForTimeout(4000);

        // Search study
        const uniqueName = `DIVYA_${getRandomLetters()}`;
        await page.fill('[data-cy="onboarding-search-study"]', 'CVD-19');
        await page.click('.Text__StyledText-fcSGOX liUSLx adjust-version.mb-0.5');

        // Add study subject
        await page.waitForTimeout(10000);
        await page.dblClick('#add-patient-icon > .ant-row > :nth-child(2) > .Text__StyledText-fcSGOX');
        
        // Check if the "Add Patient" button is disabled
        await expect(page.locator('[data-cy="button-submit-add-patient"]')).toBeDisabled();

        // Fill out patient information
        await page.fill('#firstName', uniqueName);
        await page.fill('#lastName', 'Automation01');
        await page.fill('#patientStudyId', RandomvisitID);

        // Select patient site and gender
        await page.click('[data-cy="patient-site"]');
        await page.click('.ant-select-item-option-content:has-text("Bellevue Hospital")');
        await page.check('input[type="radio"][name="FEMALE"]');
        
        // Select date of birth
        await page.click('[data-cy="select-year-addPatient"]');
        await page.click('.ant-select-item-option-content:has-text("2023")');
        await page.click('[data-cy="select-month-addPatient"]');
        await page.click('.ant-select-item-option-content:has-text("January")');
        await page.click('[data-cy="select-date-addPatient"]');
        await page.click("[title='7'] > .ant-select-item-option-content");
        
        // Submit patient form
        await page.click('[data-cy="button-submit-add-patient"]');
        await page.waitForTimeout(10000);

        // Click on the visit with the generated visit ID
        await page.click(`.Text__StyledText-fcSGOX.gSpvOG.sider-patient-name:has-text("${RandomvisitID}")`);
        await page.waitForTimeout(10000);

        // Update visit status and submit
        await page.click('[data-cy="select-visit-status"] > .ant-select-selector');
        await page.click("[label='Visit Did Occur'] > .ant-select-item-option-content");
        await page.click('[data-cy="select-year"]');
        await page.click("[title='2023'] > .ant-select-item-option-content");
        await page.click('[data-cy="select-month"]');
        await page.click("[title='February'] > .ant-select-item-option-content");
        await page.click('[data-cy="select-date"]');
        await page.click("[title='5'] > .ant-select-item-option-content", { force: true });

        // Submit visit form
        await page.click('[data-cy="button-submit-visit"]');
        await page.waitForTimeout(1000);

        // Fill in the questionnaire
        await expect(page.locator('[data-cy="question-card"]:has-text("Test1")')).toBeVisible();
        await page.fill('[data-cy="answer-input-field-cm32ksnys00aj0t5ma0npcqfn-0-0"]', '1');
        await page.click('[data-cy="save-button-cm32kso0v0enaigpbly5gzbvb"]');

        // Logout
        await page.click('.anticon.anticon-down.DownOutlined__Root-knxRmY');
        await page.click('[data-cy="logout-text"]');
    });
});
