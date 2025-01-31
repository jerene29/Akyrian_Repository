const { test, expect } = require('@playwright/test');
const { HomePage } = require('./IRCTC');

test.only('Homepage_TC001: To check the IRCTC portal  page', async ({ page }) => {

    const homePage = new HomePage(page);
    
    // Open the homepage
    await homePage.open();
    
    // Check if the elements are visible
    await homePage.clickMenu();
    await homePage.checkLoginPageElements();

    console.log('All elements are visible on the page.');
   
})

test('Login_TC001: Check the Login button', async ({ page }) => {
    test.setTimeout(200000)
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
await expect(errorMessage4).toHaveText('Bad credentials')
//Enter invalid data in 'Password" field
await page.waitForTimeout(15000);

await page.locator("[placeholder='User Name']", '')
await page.fill("[placeholder='User Name']", 'Divya112314225436d');
await page.fill("[placeholder='Password']", '')
await page.fill("[placeholder='Password']", 'ssss');
await page.waitForTimeout(15000);
await page.locator('button:has-text("SIGN IN")').click()
const errorMessage5 = await page.locator('.loginError');
await expect(errorMessage5).toBeVisible();
await expect(errorMessage5).toHaveText('Bad credentials')
//To validate the 'Sign In' Button with invalid data captcha

await page.locator("[placeholder='User Name']", '', { timeout: 10000 })
await page.fill("[placeholder='User Name']", 'Divya112314225436d');
await page.fill("[placeholder='Password']", '')
await page.fill("[placeholder='Password']", 'cMQMR6aqik7Z3TV');
await page.locator('button:has-text("SIGN IN")').click()
const errorMessage6 = await page.locator('.loginError');
await expect(errorMessage6).toBeVisible();
await expect(errorMessage6).toHaveText('Bad credentialsPlease Enter Valid Captcha')

//Verify 'User name' field textbox
await page.locator("[placeholder='User Name']", '', { timeout: 10000 })
await page.fill("[placeholder='User Name']", 'Di');
//Verify 'User name' field textbox
await page.fill("[placeholder='Password']", '')
await page.fill("[placeholder='Password']", 'YfsdfsdfsdYY', { timeout: 10000 });

await page.waitForTimeout(10000);

// Click the button
// Wait for the buttons to be available
await page.locator('button:has-text("SIGN IN")', { timeout: 10000 }).click()
const errorMessage = await page.locator('.loginError');
await expect(errorMessage).toBeVisible();
await expect(errorMessage).toHaveText('Invalid User');

//To validate the checkbox for the Login & Booking with OTP 
//Enter the valid data in "User name" field
await page.locator("[placeholder='User Name']", '', { timeout: 10000 })
await page.fill("[placeholder='User Name']", 'Divya112314225436d');
await page.fill("[placeholder='Password']", '')
await page.fill("[placeholder='Password']", 'cMQMR6aqik7Z3TV', { timeout: 10000 });
await page.locator("[for='otpLogin']").click()
//Verify the Confirmation popup screen
const Message = await page.locator('[class="ui-dialog-title ng-tns-c19-14 ng-star-inserted"]', { timeout: 10000 });
await expect(Message).toBeVisible();
await expect(Message).toHaveText('Confirmation');
const Message1 = await page.locator('[class="col-xs-12 text-center"]');
await expect(Message1).toBeVisible();
await expect(Message1).toHaveText('LOGIN & BOOKING with OTP feature is meant for visually impaired users only. Visually non-impaired users are advised not to use this feature, instead they should type the captcha presented at login page. If visually non-impaired users are found using this feature, such users may be suspended/deactivated by IRCTC.');
//Click the Proceed button
await page.locator("[aria-label='Confirmation. LOGIN & BOOKING with OTP feature is meant for visually impaired users only. Visually non-impaired users are advised not to use this feature, instead they should type the captcha presented at login page. If visually non-impaired users are found using this feature, such users may be suspended/deactivated by IRCTC.. Press Proceed to confirm']").isVisible();
await page.locator("[aria-label='Confirmation. LOGIN & BOOKING with OTP feature is meant for visually impaired users only. Visually non-impaired users are advised not to use this feature, instead they should type the captcha presented at login page. If visually non-impaired users are found using this feature, such users may be suspended/deactivated by IRCTC.. Press Cancel to confirm']").isVisible();
await page.locator("[aria-label='Confirmation. LOGIN & BOOKING with OTP feature is meant for visually impaired users only. Visually non-impaired users are advised not to use this feature, instead they should type the captcha presented at login page. If visually non-impaired users are found using this feature, such users may be suspended/deactivated by IRCTC.. Press Cancel to confirm']").click()
await page.waitForTimeout(15000);
await page.locator('button:has-text("SIGN IN")').click()
await page.waitForTimeout(15000);

await expect(page).toHaveURL('https://www.irctc.co.in/nget/train-search', { timeout: 60000 });
//Login to the IRCTC portal with the valid credentials
//The home page should have the following details:
await page.locator('[class="h_menu_drop_button hidden-xs"]').click()

await page.locator(' REFUND STATUS ').nth(0).isVisible();
await page.locator('text=Logout').nth(0).isVisible();
await page.locator('text= Last Transaction Detail ').nth(0).isVisible();
await page.locator('text= Upcoming Journey ').nth(0).isVisible();
await page.locator('text=View All Journeys').nth(0).isVisible();
await page.locator('text= BOOK TICKET ').nth(0).isVisible();
await page.locator('text=Easy Booking on AskDISHA').nth(0).isVisible();
await page.locator('text=Person With Disability Concession').nth(0).isVisible();
await page.locator('text=Flexible With Date').nth(0).isVisible();
await page.locator('text=Train with Available Berth ').nth(0).isVisible();
await page.locator('text=Railway Pass Concession').nth(0).isVisible();
await page.locator('text=Search').nth(0).isVisible();
await page.locator('text=Customers can use enhanced interface for their IRCTC related queries!!').nth(0).isVisible();
await page.locator('text=Customer Care Numbers : 14646/08044647999 /08035734999 (Language: Hindi and English)').nth(0).isVisible();
})