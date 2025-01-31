const { test, expect } = require('@playwright/test');
test('Homepage_TC001: To check the IRCTC portal  page', async ({ page }) => {

    // Open the IRCTC portal URL
    await page.goto('https://www.irctc.co.in/nget/train-search', { timeout: 30000 });
    await page.waitForTimeout(10000);
    await page.locator('[class="h_menu_drop_button hidden-xs"]').click()
    
    // The home page should have the following details:

    await page.locator('text=LOGIN').nth(0).isVisible();
    // Check for IRCTC Exclusive link
    await page.locator('text=IRCTC EXCLUSIVE').nth(0).isVisible();
    // Check for other menu items
    await page.locator('text=TRAINS').nth(0).isVisible();
    await page.locator('text=LOYALTY').nth(0).isVisible();
    await page.locator('text=IRCTC eWallet').nth(0).isVisible();
    await page.locator('text=BUSES').nth(0).isVisible();
    await page.locator('text=FLIGHTS').nth(0).isVisible();
    await page.locator('text=HOTELS').nth(0).isVisible();
    await page.locator('text=HOLIDAYS').nth(0).isVisible();
    await page.locator('text=MEALS').nth(0).isVisible();
    await page.locator('text=PROMOTIONS').nth(0).isVisible();
    await page.locator('text=ALERTS').nth(0).isVisible();
    await page.locator('text=MORE').nth(0).isVisible();
    await page.locator('text=CONTACT US').nth(0).isVisible();
    await page.locator('text=HELP & SUPPORT').nth(0).isVisible();
    await page.locator('text=AGENT LOGIN').nth(0).isVisible();

    // Check for Hindi option
    await page.locator('text=DAILY DEALS').nth(0).isVisible();
    await page.locator('text=हिंदी').nth(0).isVisible();
    

    // Check for IRCTC logo (this may require a different selector)
    await page.locator('img[alt="IRCTC Logo"]').nth(0).isVisible();

    // Check for PNR Status and Charts/Vacancy links
    await page.locator('text=PNR STATUS').nth(0).isVisible();
    await page.locator('text=CHARTS/VACANCY').nth(0).isVisible();

    // Check for Book Ticket and Search functionality
    await page.locator('text=BOOK TICKET').nth(0).isVisible();
    await page.locator('text=SEARCH').nth(0).isVisible();

    // Check for Easy Booking on Ask Disha
    await page.locator('text=EASY BOOKING ON ASK DISHA').nth(0).isVisible();

    console.log('All elements are visible on the page.');
   
})

test.only('Login_TC001: Check the Login button', async ({ page }) => {
    await page.goto('https://www.irctc.co.in/nget/train-search', { timeout: 30000 });
    await page.waitForTimeout(10000);
    //It should have the following details:
    await page.locator('[class="h_menu_drop_button hidden-xs"]').click()
    await page.locator('[class="search_btn"]').nth(1).click()
    await page.locator("[placeholder='User Name']").isVisible();
    await page.locator("[placeholder='Password']").isVisible();
    const ForgetPassword = page.locator('[class="ui-inputgroup-addon"]');
    await expect(ForgetPassword).toHaveText('FORGOT ACCOUNT DETAILS?');

    await page.locator("[placeholder='Enter Captcha']").isVisible();
    await page.locator('[class="captcha_div"]').isVisible()
    await page.locator('[aria-label="Click to refresh Captcha"]').isVisible()
    const OTP = page.locator('[class="css-label_c t_c"]').nth(4);
    await expect(OTP).toHaveText('Login & Booking With OTP');
    const SIGNIN = page.locator('button:has-text("SIGN IN")');
    await expect(SIGNIN).toHaveText('SIGN IN');
    const REGISTER = page.locator('[class="search_btn"]').nth(7);
    await expect(REGISTER).toHaveText('REGISTER');
    const AGENTLOGIN = page.locator('[class="search_btn"]').nth(8);
    await expect(AGENTLOGIN).toHaveText('AGENT LOGIN');


    //Login_Invalid Data _TC001
       // Click the sign in button without input
       await page.waitForTimeout(15000);
       await page.locator('button:has-text("SIGN IN")').click()
       const errorMessage1 = await page.locator('.loginError');
       await expect(errorMessage1).toBeVisible();
       await expect(errorMessage1).toHaveText('Please Enter Valid User ID');

//Click the sign in button without entering password
await page.waitForTimeout(15000);
await page.fill("[placeholder='User Name']", 'XXXX');
await page.locator('button:has-text("SIGN IN")').click()
const errorMessage2 = await page.locator('.loginError');
await expect(errorMessage2).toBeVisible();
await expect(errorMessage2).toHaveText('Please Enter Valid Password');
//Click the sign in button without entering CAPTCHA
await page.waitForTimeout(15000);

await page.fill("[placeholder='User Name']", 'XXXX');
    //Verify 'User name' field textbox
    await page.waitForTimeout(15000);
    await page.fill("[placeholder='Password']", 'YYY');
    await page.locator('button:has-text("SIGN IN")').click()
    const errorMessage3 = await page.locator('.loginError');
    await expect(errorMessage3).toBeVisible();
    await expect(errorMessage3).toHaveText('Please Enter Valid Captcha');
//Enter invalid data in "User name" field
await page.waitForTimeout(20000);

await page.fill("[placeholder='User Name']", '')
await page.fill("[placeholder='User Name']", 'XXXX');
await page.fill("[placeholder='Password']", '')
await page.fill("[placeholder='Password']", 'cMQMR6aqik7Z3TV');
await page.waitForTimeout(20000);
await page.locator('button:has-text("SIGN IN")').click()
const errorMessage4 = await page.locator('.loginError');
await expect(errorMessage4).toBeVisible();
await expect(errorMessage4).toHaveText('Bad credentialsPlease Enter Valid Captcha')
//Enter invalid data in 'Password" field
await page.waitForTimeout(15000);

await page.locator("[placeholder='User Name']").clear()
await page.fill("[placeholder='User Name']", 'Divya112314225436d');
await page.fill("[placeholder='Password']").clear()
await page.fill("[placeholder='Password']", 'ssss');
await page.waitForTimeout(20000);
await page.locator('button:has-text("SIGN IN")').click()
const errorMessage5 = await page.locator('.loginError');
await expect(errorMessage5).toBeVisible();
await expect(errorMessage5).toHaveText('Bad credentials')
//To validate the 'Sign In' Button with invalid data captcha
await page.waitForTimeout(15000);

await page.locator("[placeholder='User Name']").clear()
await page.fill("[placeholder='User Name']", 'Divya112314225436d');
await page.fill("[placeholder='Password']").clear()
await page.fill("[placeholder='Password']", 'cMQMR6aqik7Z3TV');
await page.locator('button:has-text("SIGN IN")').click()
const errorMessage6 = await page.locator('.loginError');
await expect(errorMessage6).toBeVisible();
await expect(errorMessage6).toHaveText('Bad credentialsPlease Enter Valid Captcha')

//Verify 'User name' field textbox
await page.waitForTimeout(15000);

await page.fill("[placeholder='User Name']", 'XXXX');
//Verify 'User name' field textbox
await page.fill("[placeholder='Password']", 'YYY');
await page.waitForTimeout(15000);

// Click the button
// Wait for the buttons to be available
await page.locator('button:has-text("SIGN IN")').click()
const errorMessage = await page.locator('.loginError');
await expect(errorMessage).toBeVisible();
await expect(errorMessage).toHaveText('Bad credentials');
})