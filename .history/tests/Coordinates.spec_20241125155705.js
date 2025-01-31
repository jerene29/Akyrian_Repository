import { test, expect } from '@playwright/test';
import path from 'path';  // Correctly import 'path' module once

// Test: Login to the Portal and login as Source Capture User
test('Login to the Portal and login as Source Capture User', async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 1280, height: 720 });

    // Visit the portal
    await page.goto('https://qa.akyrian.com/', { timeout: 30000 });
    await page.waitForTimeout(10000);

    // Login action
    await page.fill('#email', 'sourcecapture@example.com');
    await page.fill('#password', 'Password!1');
    await page.click('#loginAs-btn');

    // Wait for onboarding search and click
    await page.locator('[data-cy="onboarding-search-study"]').waitFor({ state: 'visible', timeout: 4000 });
    await page.locator('[data-cy="onboarding-search-study"]').click();

    // Search for study
    await page.fill('#search', 'QAonCloud Test');

    // Wait for study version and click
    await page.locator('[data-test="cm226tpiz0kxl14ev4pzlcvfc"] #study-versionmain').waitFor({ state: 'visible' });
    await page.locator("[data-test='cm226tpiz0kxl14ev4pzlcvfc'] #study-versionmain").filter({ hasText: 'v.4.b' }).click();

    // Click on patient name
    await page.locator('[data-cy="selectable-patient"]').filter({ hasText: 'QA_AU-02' }).waitFor({ state: 'visible' }, { timeout: 40000 });
    await page.locator('[data-cy="selectable-patient"]').filter({ hasText: 'QA_AU-02' }).click();

    // Wait for visit tab and click
    await page.locator('[data-cy="visit-cm31qz0990dhkigpbpkpgy2p5"]').scrollIntoViewIfNeeded();
    await page.locator('[data-cy="visit-cm31qz0990dhkigpbpkpgy2p5"]').filter({ hasText: 'AUTOMATION-sign-CRF' }).click();

    // Click the 'Source Question' tab
    await page.waitForSelector('#cy-tabsource', { visible: true, timeout: 60000 });
    await page.locator('#cy-tabsource').scrollIntoViewIfNeeded();
    await page.locator('#cy-tabsource').click({ force: true });
    // Question 1 - Image upload
    await page.locator('[data-cy="question-card-cm2n696qj08n8zdk3hgiru340"] > [data-cy="question-card"]', { visible: true, stable: true });
    await page.locator('[data-cy="question-card-cm2n696qj08n8zdk3hgiru340"] > [data-cy="question-card"]').click({ timeout: 60000 });
    await page.locator('[data-cy="open-modal-capture"]:visible').first().click({ force: true });

    // Locate and click action menu icon
    const actionMenuIconLocator = page.locator('[data-cy="capture-action-cm2n696qj08n8zdk3hgiru340"] > .question-card-action-menu-icon').first();
    await actionMenuIconLocator.click();

    // Wait for file input and upload an image
    const fileInput = page.locator('input[type="file"]');
    const imagePath = path.join(__dirname, 'Images', 'Image4.png');  // Use the imported 'path' module for the file path
    await fileInput.setInputFiles(imagePath);

    // Wait for confirmation modal and click 'Yes'
    await page.waitForTimeout(20000);
    await expect(page.locator('[data-cy="confirmation-modal-title"]')).toHaveText(/No Name Found/);
    // Click Cancel
  await page.click('[data-cy="confirmModal-cancelButton"]');

  // Scroll to Redaction Button
  const manualRedactButton = await page.locator('[data-cy="manual-redact-button"]');
  await manualRedactButton.scrollIntoViewIfNeeded();
  await page.waitForTimeout(10000); // Wait for 10 seconds
  await manualRedactButton.click();

  
  // Click on the 'start-redacting-button' button
  await page.click('[data-cy="start-redacting-button"]');

  // Wait for 10 seconds (same as cy.wait(10000))
  await page.waitForTimeout(10000);

  // Get the canvas element and trigger mouse actions
  const canvas = await page.locator('[style="cursor: crosshair;"] > .konvajs-content > canvas');

  // Get the bounding box of the canvas
  const boundingBox = await canvas.boundingBox();
// Starting point (587.03125, 381.0390625)
const startX = 587.03125;
const startY = 381.0390625;

// Ending point (707.03125, 393.0390625)
const endX = 707.03125;
const endY = 393.0390625;

// Perform the drag action with mouse
await page.mouse.move(startX, startY); // Move to the starting point
await page.mouse.down(); // Simulate mouse down (pressing the mouse button)
await page.mouse.move(endX, endY); // Move to the end point
await page.mouse.up(); // Simulate mouse up (releasing the mouse button)

// Optionally, take a screenshot after the drag (if needed)
await page.screenshot({ path: 'drag_action.png' });
 

  // Wait for 10 seconds to ensure everything is visible
  await page.waitForTimeout(10000);

  // Click Redaction Complete
  await page.click('[data-cy="redaction-complete-button"]');
  await page.waitForTimeout(10000);

  // Verify Confirmation Text
  const confirmText = await page.locator('[data-cy="confirm-redact-button"]');
  //await expect(confirmText).toContainText('Please confirm this action');

  // Right chip actions
  await page.locator('[data-cy="right-chip-Allergies-AT"]').click();
  await page.locator('[data-cy="right-chip-BloodPressureAT"]').click();
  //await page.locator('[data-cy="submit-bottom-chips-menu"]').click();
  await page.waitForTimeout(10000);

  // Click Logout
  await page.click('[class="anticon anticon-down DownOutlined__Root-knxRmY jZCmAT img-icon img-right"]');
  await page.click('[data-cy="logout-text"]');

  // Optionally wait for logout to complete
  await page.waitForTimeout(5000); // You can wait here for a proper logout transition
});