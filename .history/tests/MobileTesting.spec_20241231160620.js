const { test, expect } = require('@playwright/test');
test('Check the Amazon portal home page', async ({ page }) => {
  await page.goto('https://www.amazon.in/your-account');
 
  //Check the Login button
  //User enters an incorrectly formatted email address (e.g., missing "@" or domain).
  await page.fill('#ap_email_login', 'divyadhileepan1415gmail.com');
  await page.locator('.a-button-input').click();
  const text = await page.locator('[class="a-alert-content"]').nth(3).textContent();
  console.log("Invalid email address.")
//User enters an unregistered email or phone number.
await page.fill('#ap_email_login', 'divyadhileccepan1415gmail.com');
await page.locator('.a-button-input').click();
const text1 = await page.locator('[class="a-alert-content"]').nth(3).textContent();
console.log("Wrong or Invalid email address or mobile phone number. Please correct and try again.")

  /*
  await page.fill('#ap_password', 'Divya@1408');
  await page.click('#signInSubmit');
  // Search for a product 
  await page.fill('[class="nav-input nav-progressive-attribute"]', 'Storio Rechargeable Toys Talking Cactus Baby Toys for Kids Dancing Cactus Toys Can Sing Wriggle & Singing Recording Repeat What You Say Funny Education Toys for Children Playing Home Decor for Kids');
  await page.locator('[class="nav-input"]').click();

  // Click on the first product in the search results
  await page.locator('[data-cy="title-recipe"]').nth(2).click();

  // Wait for the product page to load
  await expect(page.locator('#title')).toHaveText("Storio Rechargeable Toys Talking Cactus Baby Toys for Kids Dancing Cactus Toys Can Sing Wriggle & Singing Recording Repeat What You Say Funny Education Toys for Children Playing Home Decor for Kids");

  //Add the product to the cart
  await page.locator('#add-to-cart-button').click();
  await page.waitForTimeout(5000);

  //Click on 'Cart' to go to the cart page
  await page.locator('[href="/cart?ref_=ace_gtc"]').click();
// Click on 'Proceed to buy'
  await page.locator('[value="Proceed to checkout"]', {timeout: 40000 }).click();

  // Change Delivery Address
  await page.locator('[href="/checkout/p/p-404-7357883-4795518/address?pipelineType=Chewbacca&referrer=pay&ref_=chk_pay_editDeliveryAddress&redirectReason=ChangeDelivery"]', {timeout: 40000 }).click();

  // Verify the shipping address section is present
  //await expect(page.locator('[class="a-accordion-row-a11y a-accordion-row a-declarative a-accordion-sr destination-accordion-row-header"]').first()).toBeVisible();
  //  Click on 'Continue'
  await page.locator('[class="a-button-input"]').first().click();
  // Click on 'Use this address'

  await page.locator('[class="a-button-inner"]').first().click();
  await page.waitForTimeout(5000);
  const element = await page.$('[class="a-button-stack a-spacing-small"]');
  await element.scrollIntoViewIfNeeded();
  await element.click();

  // Wait for the payment method page
  await page.waitForSelector('.payment-method');

  // Step 20: Select a payment method (credit card)
  await page.locator('.a-declarative .a-dropdown-prompt').click();
  await page.locator('.a-dropdown-item').first().click();

  // Step 21: Enter credit card information
  await page.locator('#addCreditCardNumber').type('4111111111111111');
  await page.locator('#addCreditCardExpiryDate_month').selectOption({ value: '12' });
  await page.locator('#addCreditCardExpiryDate_year').selectOption({ value: '2025' });
  await page.locator('#addCreditCardCVV').type('123');

  // Step 22: Click 'Use this card'
  await page.locator('#pp-uAFq4D-4').click();

  // Step 23: Wait for review order page
  await page.waitForSelector('.review-order');

  // Step 24: Review the order summary
  const orderTotal = await page.locator('.a-size-medium').innerText();
  console.log('Order Total: ', orderTotal);

  // Step 25: Click 'Place your order'
  await page.locator('.a-button-input').click();

  // Step 26: Wait for the order confirmation page
  await page.waitForSelector('.order-placed');

  // Step 27: Verify the order confirmation message
  await expect(page.locator('.order-placed')).toContainText('Thank you for your order!');

  // Step 28: Scroll down to the bottom of the page
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

  // Step 29: Click on 'Track Package'
  await page.locator('text=Track Package').click();

  // Step 30: Wait for the tracking page to load
  await page.waitForSelector('.a-box-inner');

  // Step 31: Verify the tracking information
  await expect(page.locator('.a-box-inner')).toContainText('Shipped');

  // Step 32: Go back to the homepage
  await page.goto('https://www.amazon.com');

  // Step 33: Click on the 'Deals' link in the navigation menu
  await page.locator('text=Deals').click();

  // Step 34: Wait for the 'Deals' page to load
  await page.waitForSelector('.s-main-slot');

  // Step 35: Click on the first deal item
  await page.locator('.s-main-slot .s-result-item:first-child').click();

  // Step 36: Verify the deal details page
  await expect(page.locator('#dealTitle')).toBeVisible();

  // Step 37: Click on the 'Add to Cart' button on the deal page
  await page.locator('#add-to-cart-button').click();

  // Step 38: Wait for the cart popup to appear
  await page.waitForSelector('#hlb-view-cart-announce');

  // Step 39: Go to the cart
  await page.locator('#hlb-view-cart-announce').click();

  // Step 40: Verify the deal is in the cart
  await expect(page.locator('.sc-list-item')).toContainText('deal');

  // Step 41: Click on 'Proceed to checkout'
  await page.locator('.a-button-input').click();

  // Step 42: Wait for the checkout page to load
  await page.waitForSelector('.checkout-review-order');

  // Step 43: Click 'Change Address' to update shipping address
  await page.locator('text=Change Address').click();

  // Step 44: Select a different address
  await page.locator('.ship-to-this-address').first().click();

  // Step 45: Click 'Continue'
  await page.locator('.a-button-input').click();

  // Step 46: Go back to the product page of the first item
  await page.goto('https://www.amazon.com/product-page-link');

  // Step 47: Add another product to the cart
  await page.locator('#add-to-cart-button').click();

  // Step 48: Wait for the cart popup to appear
  await page.waitForSelector('#hlb-view-cart-announce');

  // Step 49: Go to the cart
  await page.locator('#hlb-view-cart-announce').click();

  // Step 50: Verify both products are in the cart
  await expect(page.locator('.sc-list-item')).toContainText('laptop');
  await expect(page.locator('.sc-list-item')).toContainText('deal');

  // Step 51: Click on 'Proceed to checkout'
  await page.locator('.a-button-input').click();

  // Step 52: Verify the final checkout page
  await expect(page.locator('.checkout-review-order')).toBeVisible();

  // Step 53: Review the final order summary
  await page.locator('.a-size-medium').first().click();

  // Step 54: Verify order total
  const finalOrderTotal = await page.locator('.a-size-medium').innerText();
  console.log('Final Order Total:', finalOrderTotal);

  // Step 55: Go back to the homepage
  await page.goto('https://www.amazon.com');

  // Step 56: Hover over 'Account & Lists' menu
  await page.locator('#nav-link-accountList').hover();

  // Step 57: Click on 'Your Orders'
  await page.locator('text=Your Orders').click();

  // Step 58: Wait for the orders page to load
  await page.waitForSelector('.orders-list');

  // Step 59: Verify the order list is visible
  await expect(page.locator('.orders-list')).toBeVisible();

  // Step 60: Close the browser
  await page.close();
  */
});