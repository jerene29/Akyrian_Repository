import { test, expect } from '@playwright/test';
test.describe('BookingWebsite', () => {
test('Booking.com', async ({ page }) => {
// Visit the URL
await page.goto('https://www.booking.com/');
 //Click Sign In
await page.locator('[class="c1af8b38aa"]', { timeout: 10000 }).click()
await page.fill('[placeholder="Enter your email address"]','divyadhileepan1415@gmail.com', { timeout: 10000 })
await page.locator('[class="_NMeW4uFOFNEfBkJI2X6 C24NCf0IyZRFJk2ahDeL DtlkOQAQuawAsxgcEUCY hevwrAzGPCvQfFqIYsie IP81aoz9pM28K7Vclo49 C3wGW7ffSXVm3VGRJTzO"]', { timeout: 10000 }).click()
await page.pause(); 
//check the screen after Login
const button = await page.locator('#accommodations');
const Stays = await button.textContent();
console.log(Stays.trim());
const button1 = await page.locator('#flights');
const Flights = await button1.textContent();
console.log(Flights.trim());
const button2 = await page.locator('#packages');
const flightAndHotel = await button2.textContent();
console.log(flightAndHotel.trim());
const button3 = await page.locator('#cars');
const Carrentals = await button3.textContent();
console.log(Carrentals.trim());
const button4 = await page.locator('#attractions');
const Attractions = await button4.textContent();
console.log(Attractions.trim());
const button5 = await page.locator('#airport_taxis');
const Airporttaxis = await button5.textContent();
console.log(Airporttaxis.trim());
const button6 = await page.locator('#herobanner-title1');
const Findyournextstay = await button6.textContent();
console.log(Findyournextstay.trim());
//Click the Menu
await page.locator('#header-profile', { timeout: 10000 }).click()
//Click My account
await page.locator('[class="c624d7469d f034cf5568 dab7c5c6fa a937b09340 a3214e5942"]', { timeout: 10000 }).click()
await expect(page.locator("[data-testid='complete-your-profile-title'] > .e1eebb6a1e")).toHaveText('Complete your profile');
await expect(page.locator(".b9c19acf23")).toHaveText('Complete your profile and use this information for your next booking');
//Click Complete Now link
await page.locator('#complete-your-profile-cta', { timeout: 10000 }).click()
await page.fill("[name='first']", '');
await page.fill("[name='first']", 'divya');
await page.fill("[name='last']", '');
await page.fill("[name='last']", 'R');
//Click Save
await page.locator('#mysettings-btn-save', { timeout: 10000 }).click()

    })
})