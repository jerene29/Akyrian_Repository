const { test, expect } = require('@playwright/test');

test('Amazon 60 steps automation example', async ({ page }) => {
  // Step 1: Go to Amazon homepage
  await page.goto('https://www.amazon.com');

  // Step 2: Search for a product (e.g., 'laptop')
  await page.locator('#twotabsearchtextbox').type('laptop');
  await page.locator('#nav-search-submit-button').click();

  // Step 3: Wait for search results to load
  await page.waitForSelector('.s-main-slot');

  // Step 4: Click on the first product in the search results
  await page.locator('.s-main-slot .s-result-item:first-child a').click();

  // Step 5: Wait for the product page to load
  await page.waitForSelector('#productTitle');

  // Step 6: Verify the product title
  const productTitle = await page.locator('#productTitle').innerText();
  expect(productTitle).toContain('laptop');

  // Step 7: Add the product to the cart
  await page.locator('#add-to-cart-button').click();

  // Step 8: Wait for the cart popup to appear
  await page.waitForSelector('#hlb-view-cart-announce');

  // Step 9: Click on 'Cart' to go to the cart page
  await page.locator('#hlb-view-cart-announce').click();

  // Step 10: Wait for the cart page to load
  await page.waitForSelector('.sc-list-item');

  // Step 11: Verify the cart contains the product
  await expect(page.locator('.sc-list-item')).toContainText('laptop');

  // Step 12: Click on 'Proceed to checkout'
  await page.locator('.a-button-input').click();

  // Step 13: Wait for the checkout page to load
  await page.waitForSelector('.checkout-review-order');

  // Step 14: Sign in to Amazon (assuming you already have an account)
  await page.locator('#ap_email').type('your-email@example.com');
  await page.locator('#continue').click();
  await page.locator('#ap_password').type('your-password');
  await page.locator('#signInSubmit').click();

  // Step 15: Wait for the shipping address page to load
  await page.waitForSelector('.shipping-address');

  // Step 16: Verify the shipping address section is present
  await expect(page.locator('.shipping-address')).toBeVisible();

  // Step 17: Click on 'Use this address'
  await page.locator('.ship-to-this-address').click();

  // Step 18: Click on 'Continue'
  await page.locator('.a-button-input').click();

  // Step 19: Wait for the payment method page
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
});
