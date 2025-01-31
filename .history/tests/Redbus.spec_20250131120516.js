import { test, expect } from '@playwright/test';
test.describe('RedBusWebsite', () => {
test('RedBus', async ({ page }) => {
// Visit the URL
await page.goto('https://www.redbus.in/');
//Click Account
await page.locator('#account_dd .name_rb_secondary_item', { timeout: 10000 }).click()
//Click Login/Sign Up
await page.locator('#user_sign_in_sign_up > .header_dropdown_item_name', { timeout: 10000 }).click()
await page.locator('[class="icon-close"]', { timeout: 10000 }).click()

//await page.locator('[class="nsm7Bb-HzV7m-LgbsSe-Bz112c-haAclf"]', { timeout: 10000 }).click()

//await page.fill("#mobileNoInp","6369851585");
//Search From and To
await page.fill('#src',"Thiruvarur");
await page.locator(".cursorPointing .placeHolderMainText", { timeout: 10000 }).click()

await page.fill('#dest',"Chennai");
await page.locator(".cursorPointing", { timeout: 10000 }).click()
await page.locator(".DatePicker__MainBlock-sc-1kf43k8-1 div:nth-of-type(6) > .gigHYE", { timeout: 10000 }).click()
//Search Buses
await page.locator("#search_button", { timeout: 10000 }).click()
//Click Amentities

await page.locator(".bus-items > div:nth-of-type(1) li:nth-of-type(2) > .txt-val", { timeout: 10000 }).click()
await expect(page.locator(".mtic")).toHaveText('M-ticket Supported');
await expect(page.locator(".amenlist > div:nth-of-type(1) .amenity-name")).toHaveText('Pillow');
await expect(page.locator(".amenlist > div:nth-of-type(2) .amenity-name")).toHaveText('CCTV');
await expect(page.locator(".amenlist > div:nth-of-type(3) .amenity-name")).toHaveText('Blankets');
await expect(page.locator(".amenlist > div:nth-of-type(4) .amenity-name")).toHaveText('Charging Point');
await expect(page.locator(".amenlist > div:nth-of-type(5) .amenity-name")).toHaveText('Bed Sheet');
await expect(page.locator(".amenlist > div:nth-of-type(6) .amenity-name")).toHaveText('Reading Light');
await expect(page.locator(".amenlist > div:nth-of-type(7) .amenity-name")).toHaveText('Track My Bus');

//Click Bus Photos
await page.locator(".bus-items > div:nth-of-type(1) li:nth-of-type(3) > .txt-val", { timeout: 10000 }).click()
//Click Next
await page.locator(".slick-next[type='button']", { timeout: 10000 }).click()
await page.locator(".slick-next[type='button']", { timeout: 10000 }).click()
//Click Boarding Points
await page.locator(".bus-items > div:nth-of-type(1) li:nth-of-type(4) > .txt-val", { timeout: 10000 }).click()

//Click Review
await page.locator(".bus-items > div:nth-of-type(1) li:nth-of-type(5) > .txt-val", { timeout: 10000 }).click()
//Click Booking policies
await page.locator(".bus-items > div:nth-of-type(1) li:nth-of-type(6) > .txt-val", { timeout: 10000 }).click()
await expect(page.locator(".sc-qrIAp")).toHaveText('Cancellation and Date Change Policy');
await page.locator(".sc-iqzUVk", { timeout: 10000 }).click()
await expect(page.locator(".sc-qrIAp")).toHaveText('Travel Related Policies');
//Click View Seats
await page.locator(".bus-items > div:nth-of-type(1) .button", { timeout: 10000 }).click()
//Click Boarding Point
await page.locator("[placeholder='BOARDING POINT']", { timeout: 10000 }).click()
await page.locator(".custom-checkbox[for='bp_Sannanallur']", { timeout: 10000 }).click()
await page.locator(".btn-apply", { timeout: 10000 }).click()
//Click Dropping Point

await page.locator("[placeholder='DROPPING POINT']", { timeout: 10000 }).click()
await page.locator(".custom-checkbox[for='dp_Arumbakkam']", { timeout: 10000 }).click()
await page.locator(".btn-apply", { timeout: 10000 }).click()
//Click View Seats
await page.locator(".button", { timeout: 10000 }).click()
//Check Train Tickets
await page.locator(".img_new_wrap", { timeout: 10000 }).click()

//Search From and To
await page.fill('#src',"Delhi");
await page.locator(".solr_results_search_wrap > div:nth-of-type(1) .stn_name", { timeout: 10000 }).click()

await page.fill('#dst',"Mumbai");
await page.locator(".solr_results_search_wrap > div:nth-of-type(1) .stn_name", { timeout: 10000 }).click()
await page.locator(".home_calendar", { timeout: 10000 }).click()
//await page.locator('[class="sc-gqjmRU fnURhG"]', { timeout: 10000 }).click()
//await page.locator(".sc-jTzLTM span:nth-of-type(2) > div:nth-of-type(7) > .sc-htoDjs", { timeout: 10000 }).click()
await page.locator(".checkbox_wrap", { timeout: 10000 }).click()
await page.locator(".search-btn", { timeout: 10000 }).click()
await page.locator("[href='https://www.redbus.in/railways']", { timeout: 10000 }).click()

//Check PNR Status
await page.locator(".ris-wrapper > div:nth-of-type(2) > .radio-button-outer", { timeout: 10000 }).click()
await page.fill("[name='pnrNo']","3242423423");
//Check Status
await page.locator(".button", { timeout: 10000 }).click()
await expect(page.locator("b")).toHaveText('Incorrect PNR Number');
await expect(page.locator(".pnr_err_wrapper > div:nth-of-type(2)")).toHaveText("The PNR Number you've entered is wrong");
await page.locator(".icon-back_arrow", { timeout: 10000 }).click()
//Check Live Train Status
await page.locator(".ris-wrapper > div:nth-of-type(3) > .radio-button-outer", { timeout: 10000 }).click()
await page.fill("[name='pnrNo']","sathapathi");
await page.locator(".button", { timeout: 10000 }).click()
//Click Home
await page.locator("[href='https://www.redbus.in/']", { timeout: 10000 }).click()
//Click Account
await page.locator("#account_dd .name_rb_secondary_item", { timeout: 10000 }).click()
//Click Cancel Ticket
await page.locator("#cancel_ticket > .header_dropdown_item_name", { timeout: 10000 }).click()

await expect(page).toHaveURL('https://www.redbus.in/');
await page.fill("[name='tin']","3453536363");
await page.fill("[name='mobileno']","6666");
await page.locator("#cancel_ticket > .header_dropdown_item_name", { timeout: 10000 }).click()
})
})