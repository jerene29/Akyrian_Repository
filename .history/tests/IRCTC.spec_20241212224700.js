const { test, expect } = require('@playwright/test');
//const  {IRCTCPage } = require("../Pages/IRCTC.page");

/*test('Homepage_TC001: To check the IRCTC portal  page', async ({ page }) => {

    const irctcPage = new IRCTCPage(page);
    
    // Open the homepage
    await irctcPage.open();
    
    // Check if the elements are visible
    await irctcPage.clickMenu();
    await irctcPage.checkLoginPageElements();

    console.log('All elements are visible on the page.');
   
})
*/
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
const Message1= await page.locator('[class="col-xs-12 text-center"]');
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
test.only('BookTicketDetails_TC001: To verify the Book Ticket details section ', async ({ page }) => {
    await page.goto('https://www.irctc.co.in/nget/train-search', { timeout: 30000 });
    await page.locator('[class="h_menu_drop_button hidden-xs"]').click()
    await page.locator('[class="search_btn"]').nth(1).click()
    await page.locator("[placeholder='User Name']", '', { timeout: 10000 })
    await page.fill("[placeholder='User Name']", 'Divya112314225436d');
    await page.fill("[placeholder='Password']", '')
    await page.fill("[placeholder='Password']", 'cMQMR6aqik7Z3TV', { timeout: 10000 });
    await page.waitForTimeout(15000);
await page.locator('button:has-text("SIGN IN")').click()
    //Verify the 'From' field textbox
    await page.fill('[class="ng-tns-c57-8 ui-inputtext ui-widget ui-state-default ui-corner-all ui-autocomplete-input ng-star-inserted"]', 'Thiruvarur');
//Verify the 'To' field textbox
await page.fill('[class="ng-tns-c57-9 ui-inputtext ui-widget ui-state-default ui-corner-all ui-autocomplete-input ng-star-inserted"]', 'Chennai');
//Verify the 'Date' field with datepicker[
await page.locator('[class="ng-tns-c58-10 ui-inputtext ui-widget ui-state-default ui-corner-all ng-star-inserted"]').click()

await page.click('.ui-state-default.ng-tns-c58-10.ng-star-inserted >> text=25');
//Verify the 'Classes' dropdown field 
await page.locator('[class="ng-tns-c65-11 ui-dropdown ui-widget ui-state-default ui-corner-all"]').click()
await page.click('[aria-label="AC First Class (1A) "]');
///Verify the 'Categories' dropdown field 
await page.locator('[class="ng-tns-c65-12 ui-dropdown ui-widget ui-state-default ui-corner-all"]').click()
await page.click('[aria-label="LADIES"]');
 //Verify the 'Person With Disability Concession' checkbox  
 const checkbox = await page.locator('.css-label_c.t_c', {
    hasText: 'Person With Disability Concession'  // Matches label text
  });
  const isUnchecked = !(await checkbox.isChecked());
  if (isUnchecked) {
    console.log('The checkbox is unchecked.');
  } else {
    console.log('The checkbox is checked.');
  }

  // Click the checkbox
  await checkbox.click();
  //Verify the Confirmation popup screen
const Message2 = await page.locator('[class="ui-dialog-title ng-tns-c56-7 ng-star-inserted"]', { timeout: 10000 });
await expect(Message2).toBeVisible();
await expect(Message2).toHaveText('Confirmation');
const Message3 = await page.locator('[class="ui-confirmdialog-message ng-tns-c56-7"]');
await expect(Message3).toBeVisible();
await expect(Message3).toHaveText('Specially abled availing the concession need to carry Photo Identity card issued by Railways which is to be produced for On-board / off-board verification during journey. Escort passengers also need to carry photo identity card mentioned at the time of booking.');
//Click the Proceed button
await page.locator('.ui-button-icon-left').click();
await page.waitForTimeout(15000);
//Verify the 'Flexible With Date' checkbox
const checkbox1 = await page.locator('[class="css-label_c t_c"]', {
    hasText: 'Flexible With Date'  // Matches label text
  });
  const isUnchecked1 = !(await checkbox1.isChecked());
  if (isUnchecked1) {
    console.log('The checkbox1 is unchecked.');
  } else {
    console.log('The checkbox1 is checked.');
  }

  // Click the checkbox
  await checkbox1.click();
  //Verify the 'Flexible With Date' checkbox
const checkbox2 = await page.locator('[class="css-label_c t_c"]', {
    hasText: 'Train with Available Berth '  // Matches label text
  });
  const isUnchecked2 = !(await checkbox2.isChecked());
  if (isUnchecked2) {
    console.log('The checkbox2 is unchecked.');
  } else {
    console.log('The checkbox2 is checked.');
  }

  // Click the checkbox
  await checkbox2.click();

    //Verify the 'Railway Pass Concession' checkbox
const checkbox3 = await page.locator('[class="css-label_c t_c"]', {
    hasText: 'Railway Pass Concession '  // Matches label text
  });
  const isUnchecked3 = !(await checkbox3.isChecked());
  if (isUnchecked3) {
    console.log('The checkbox3 is unchecked.');
  } else {
    console.log('The checkbox3 is checked.');
  }

  // Click the checkbox
  await checkbox3.click();
//Verify the Confirmation popup screen
const Message4 = await page.locator('[class="ui-dialog-title ng-tns-c56-7 ng-star-inserted"]', { timeout: 10000 });
await expect(Message4).toBeVisible();
await expect(Message4).toHaveText('Confirmation');
const Message5 = await page.locator('[class="ui-confirmdialog-message ng-tns-c56-7"]');
await expect(Message5).toBeVisible();
await expect(Message5).toHaveText('You are booking ticket in Railway Pass Concession. Do you want to continue?');
//Click the Proceed button
await page.locator('span.ui-button-text.ui-clickable', { hasText: 'OK' }).isVisible();

await page.locator('span.ui-button-text.ui-clickable', { hasText: 'Cancel' }).click();
//Verify the 'Search' button without any input

await page.locator('//button[@label="Find Trains" and text()="Search"]').click();
//const ErrMessage = await page.locator('.ui-toast-detail', { timeout: 200000 });
//await expect(ErrMessage).toHaveText("Please submit correct input", { timeout: 50000 });
//Verify the 'Easy Booking on AskDISHA' button
const [newPage] = await Promise.all([
  page.context().waitForEvent('page'), // This waits for the new tab
  page.locator('button.search_btn.train_Search[label="Find Trains Disha"]', { hasText: 'Easy Booking on AskDISHA' }).click() // Click the button
]);

// Now you can interact with the new tab (newPage)
await newPage.waitForLoadState(); // Wait until the new page loads
// You can now perform actions on the new page, like:
console.log(await newPage.title())

//Verify the information section
page.locator('[class="text-center pull-right card-new scrollBtm ng-star-inserted"]', { hasText: 'Customers can use enhanced interface for their IRCTC related queries!!' }) 
page.locator('[class="text-center pull-right card-new scrollBtm ng-star-inserted"]', { hasText: 'Customer Care Numbers : 14646/08044647999 /08035734999 (Language: Hindi and English)' }) 
//To verify the Last Transaction Detail section
page.locator('[class="text-center pull-left upcoming-heading"]', { hasText: ' Last Transaction Detail ' }) 
page.locator('[class="col-xs-12 text-center ng-star-inserted"]', { hasText: ' No last transaction ' }) 
//To verify the Upcoming Journey section
page.locator('[class="text-center pull-left upcoming-heading"]', { hasText: ' Upcoming Journey ' }) 
page.locator('[class="col-xs-12 text-center ng-star-inserted"]', { hasText: 'No upcoming journeys' }) 
//To verify the View All Journeys Link
await page.locator('[class="a"]', { hasText: 'View All Journeys' }).click();
await expect(page).toHaveURL('https://www.irctc.co.in/nget/txn/my-transactions?page=Booked%20Ticket%20History&eWallet=false', { timeout: 60000 });
page.locator('[class="ng-star-inserted"]', { hasText: 'BOOKED TICKET HISTORY' }) 
page.locator('[class="bth_filterTabMenu text-left ng-star-inserted"]', { hasText: 'Indian Railway, IRCTC or its employees never ask for any personal banking information, including details like Debit/Credit Card number, OTP, ATM PIN, the CVV number, PAN number and date of birth.' }) 
page.locator('[class="ui-menuitem-text ng-star-inserted"]', { hasText: 'ALL JOURNEYS' }) 
page.locator('[class="ui-menuitem-text ng-star-inserted"]', { hasText: 'UPCOMING' }) 
page.locator('[class="ui-menuitem-text ng-star-inserted"]', { hasText: 'PAST JOURNEYS' }) 
await page.goBack();
await newPage.close();

//To verify the PNR STATUS Button

const [newPage1] = await Promise.all([
  page.context().waitForEvent('page'), // This waits for the new tab
  page.locator(".tbis-box .hidden-xs [aria-label='PNR Status opens a new window'] > .search_btn").click() // Click the button
]);

// Now you can interact with the new tab (newPage)
await newPage1.waitForLoadState(); // Wait until the new page loads
// You can now perform actions on the new page, like:
console.log(await newPage1.title())
page.locator('[class="text-center bg-primary"]', { hasText: 'Passenger Current Status Enquiry' }) 
page.locator('[class="col-md-12 text-center"]', { hasText: 'Enter the PNR for your booking below to get the current status. You will find it on the top left corner of the ticket.' }) 
page.locator('[class="col-md-6 text-center  label_text"]', { hasText: 'Enter PNR No.' }) 
const isSubmitButtonVisible = await page.locator('[class="btn btn-primary btn-md"]', { hasText: 'Submit' }).isVisible();
console.log(isSubmitButtonVisible); 
const isClearButtonVisible = await page.locator('[class="btn btn-primary btn-md"]', { hasText: 'Clear' }).isVisible();
console.log(isClearButtonVisible);
await newPage1.close();
//Verify the CHARTS / VACANCY Button
const [newPage2] = await Promise.all([
  page.context().waitForEvent('page'), // This waits for the new tab
  page.locator(".tbis-box .hidden-xs [aria-label='Reservation Chart. Website will be opened in new tab'] > .search_btn").click() // Click the button
]);

// Now you can interact with the new tab (newPage)
await newPage2.waitForLoadState(); // Wait until the new page loads
// You can now perform actions on the new page, like:
console.log(await newPage2.title())
page.locator('[class="jss141 jss158 jss171 jss164"]', { hasText: 'RESERVATION CHART' }) 
page.locator('[class="jss141 jss158 jss171 jss164"]', { hasText: 'Journey Details' }) 
page.locator('[class="css-1492t68"]', { hasText: 'Train Name/Number*' }) 
page.locator('[class="jss436 jss440 jss425 jss430 jss433 jss432"]', { hasText: 'Journey Date*' }) 
page.locator('[class="css-1492t68"]', { hasText: 'Boarding Station*' }) 

const isButtonVisible = await page.locator('[class="jss511 jss485 jss496 jss497 jss499 jss500"]', { hasText: 'Get Train Chart' }).isVisible();
console.log(isButtonVisible); 

await newPage2.close();

//To verify the Refund Status Button
const [newPage3] = await Promise.all([
  page.locator(".tbis-box .hidden-xs [aria-label='Refund Status redirects to Refund Status Page'] > .search_btn").click() // Click the button
]);

page.locator('[class="ng-star-inserted"]', { hasText: 'TICKET REFUND HISTORY' }) 
page.locator('[class="bth_filterTabMenu text-left ng-star-inserted"]', { hasText: 'Indian Railway, IRCTC or its employees never ask for any personal banking information, including details like Debit/Credit Card number, OTP, ATM PIN, the CVV number, PAN number and date of birth.' }) 
page.locator('[class="jss141 jss158 jss171 jss164"]', { hasText: 'RESERVATION CHART' }) 
page.locator('[class="ui-menuitem-text ng-star-inserted"]', { hasText: 'ALL JOURNEYS' }) 
page.locator('[class="ui-menuitem-text ng-star-inserted"]', { hasText: 'UPCOMING' }) 
page.locator('[class="ui-menuitem-text ng-star-inserted"]', { hasText: 'PAST JOURNEYS' }) 
await page.goBack();
//To verify the Re-Book Favourite Journey Button
const [newPage4] = await Promise.all([
  
  page.locator(".tbis-box .hidden-xs [aria-label='Book Favourite Journey Opens favourite journey list'] > .search_btn").click() // Click the button
]);


page.locator('[class="text-center pull-left upcoming-heading"]', { hasText: 'Recent Journey List' }) 

//To verify the search button without entering data
const [newPage5] = await Promise.all([

page.locator("[type='submit']").click() 
]);// Click the button
page.locator('[class="ui-toast-detail ng-tns-c16-66"]', { hasText: 'Please submit correct input' }) 

//To verify the Book Ticket details section with invalid data
//Verify the 'From' field textbox

// Optionally click to focus the input field
await page.click('[class="ng-tns-c57-29 ui-inputtext ui-widget ui-state-default ui-corner-all ui-autocomplete-input ng-star-inserted"]');

// Now fill in the text
await page.fill('[class="ng-tns-c57-29 ui-inputtext ui-widget ui-state-default ui-corner-all ui-autocomplete-input ng-star-inserted"]', 'cvvv');
await page.click('[class="col-xs-12 loginhead hidden-xs"]');

// Optionally click to focus the input field
await page.click('[class="ng-tns-c57-30 ui-inputtext ui-widget ui-state-default ui-corner-all ui-autocomplete-input ng-star-inserted"]');

// Now fill in the text
await page.fill('[class="ng-tns-c57-30 ui-inputtext ui-widget ui-state-default ui-corner-all ui-autocomplete-input ng-star-inserted"]', 'cvvv');//Verify the 'To' field textbox
await page.click('[class="col-xs-12 loginhead hidden-xs"]');

//Verify the 'Date' field with datepicker[
await page.locator('[class="ng-tns-c58-31 ui-inputtext ui-widget ui-state-default ui-corner-all ng-star-inserted"]').click()

await page.click('.ui-state-default.ng-tns-c58-31.ng-star-inserted >> text=25');
//Verify the 'Classes' dropdown field 
await page.locator('[class="ng-tns-c65-32 ui-dropdown ui-widget ui-state-default ui-corner-all"]').click()
await page.click('[aria-label="AC First Class (1A) "]');
///Verify the 'Categories' dropdown field 
await page.locator('[class="ng-tns-c65-33 ui-dropdown ui-widget ui-state-default ui-corner-all"]').click()
await page.click('[aria-label="LADIES"]');
page.locator("[type='submit']").click() 

//To verify the Book Ticket details section with valid data
 //Verify the 'From' field textbox
 await page.fill('[class="ng-tns-c57-29 ui-inputtext ui-widget ui-state-default ui-corner-all ui-autocomplete-input ng-star-inserted"]', 'THIRUVARUR JN - TVR');
 await page.click('[class="col-xs-12 loginhead hidden-xs"]');

 //Verify the 'To' field textbox

 await page.fill('[class="ng-tns-c57-30 ui-inputtext ui-widget ui-state-default ui-corner-all ui-autocomplete-input ng-star-inserted"]', 'CHENNAI EGMORE - MS');
 await page.click('[class="col-xs-12 loginhead hidden-xs"]');

 //Verify the 'Date' field with datepicker
 await page.locator('[class="ng-tns-c58-31 ui-inputtext ui-widget ui-state-default ui-corner-all ng-star-inserted"]').click()
 
 await page.click('.ui-state-default.ng-tns-c58-31.ng-star-inserted >> text=25');
 //Verify the 'Classes' dropdown field 
 await page.locator('[class="ng-tns-c65-32 ui-dropdown ui-widget ui-state-default ui-corner-all"]').click()
 //await page.click('[aria-label="AC First Class (1A) "]');
 ///Verify the 'Categories' dropdown field 
 await page.locator('[class="ng-tns-c65-33 ui-dropdown ui-widget ui-state-default ui-corner-all"]').click()
// await page.click('[aria-label="LADIES"]');
 //await page.click('[class="heading-font"]');

 page.locator("[type='submit']").click() 

})