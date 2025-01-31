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

await page.locator("[boostdata='{\"preBoostPos\":1,\"isBoosted\":false,\"wtPrice\":1068.18,\"seatPrices\":\"1050.0:14,1100.0:8\",\"compRids\":\"\",\"compSids\":\"\",\"campaignId\":\"ALLC_e9b73d18\",\"boostFactor\":0,\"boostDiscPer\":9.36,\"dealType\":\"FEMALE\"}'] li:nth-of-type(2) > .txt-val", { timeout: 10000 }).click()
await expect(page.locator(".mtic")).toHaveText('M-ticket Supported');
await expect(page.locator(".amenlist > div:nth-of-type(1) .amenity-name")).toHaveText('Pillow');
await expect(page.locator(".amenlist > div:nth-of-type(2) .amenity-name")).toHaveText('CCTV');
await expect(page.locator(".amenlist > div:nth-of-type(3) .amenity-name")).toHaveText('Blankets');
await expect(page.locator(".amenlist > div:nth-of-type(4) .amenity-name")).toHaveText('Charging Point');
await expect(page.locator(".amenlist > div:nth-of-type(5) .amenity-name")).toHaveText('Bed Sheet');
await expect(page.locator(".amenlist > div:nth-of-type(6) .amenity-name")).toHaveText('Reading Light');
await expect(page.locator(".amenlist > div:nth-of-type(7) .amenity-name")).toHaveText('Track My Bus');

//Click Bus Photos
await page.locator("[boostdata='{\"preBoostPos\":1,\"isBoosted\":false,\"wtPrice\":1068.18,\"seatPrices\":\"1050.0:14,1100.0:8\",\"compRids\":\"\",\"compSids\":\"\",\"campaignId\":\"ALLC_e9b73d18\",\"boostFactor\":0,\"boostDiscPer\":9.36,\"dealType\":\"FEMALE\"}'] li:nth-of-type(3) > .txt-val", { timeout: 10000 }).click()
//Click Next
await page.locator(".slick-next[type='button']", { timeout: 10000 }).click()
await page.locator(".slick-next[type='button']", { timeout: 10000 }).click()
//Click Boarding Points
await page.locator("[boostdata='{\"preBoostPos\":1,\"isBoosted\":false,\"wtPrice\":1068.18,\"seatPrices\":\"1050.0:14,1100.0:8\",\"compRids\":\"\",\"compSids\":\"\",\"campaignId\":\"ALLC_e9b73d18\",\"boostFactor\":0,\"boostDiscPer\":9.36,\"dealType\":\"FEMALE\"}'] li:nth-of-type(4) > .txt-val", { timeout: 10000 }).click()
await expect(page.locator('[class="bpdp_list_title"]')).nth(0).toHaveText('BOARDING POINT');
await expect(page.locator('[class="bpdp_list_title"]')).nth(1).toHaveText('DROPPING POINT');
//Click Review
await page.locator("[boostdata='{\"preBoostPos\":1,\"isBoosted\":false,\"wtPrice\":1068.18,\"seatPrices\":\"1050.0:14,1100.0:8\",\"compRids\":\"\",\"compSids\":\"\",\"campaignId\":\"ALLC_e9b73d18\",\"boostFactor\":0,\"boostDiscPer\":9.36,\"dealType\":\"FEMALE\"}'] li:nth-of-type(5) > .txt-val", { timeout: 10000 }).click()
//Click Booking policies
await page.locator("[boostdata='{\"preBoostPos\":1,\"isBoosted\":false,\"wtPrice\":1068.18,\"seatPrices\":\"1050.0:14,1100.0:8\",\"compRids\":\"\",\"compSids\":\"\",\"campaignId\":\"ALLC_e9b73d18\",\"boostFactor\":0,\"boostDiscPer\":9.36,\"dealType\":\"FEMALE\"}'] li:nth-of-type(6) > .txt-val", { timeout: 10000 }).click()
await expect(page.locator(".sc-qrIAp")).toHaveText('Cancellation and Date Change Policy');
await page.locator(".sc-iqzUVk", { timeout: 10000 }).click()
await expect(page.locator(".sc-qrIAp")).toHaveText('Travel Related Policies');

})
})