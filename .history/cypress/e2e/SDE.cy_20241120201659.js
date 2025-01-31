/// <reference types="cypress" />
import { recursiveScrollCheck } from '../support/helpers'
{
    "projectId"; "p1r321"
}
"experimentalSourceRewriting".true;
Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    // failing the test
    return false
});
const { performOCR } = require('../support/ocr');

const email = Cypress.env('email');       // Get email from environment variables
const password = Cypress.env('password')
//Login Page
describe('Akyrian SDE FLow',()=> {

 it("Login to the Portal and login as Source Capture user", () => {
cy.viewport(1280, 720)
 cy.visit("https://qa.akyrian.com/"),
cy.get('#email').focus()
cy.get('#email').type("sourcecapture@example.com")
cy.get('#password').focus()
cy.get('#password').type("Password!1", { log: false })
cy.get('#loginAs-btn').click()
cy.wait(10000)    
//Search study
cy.get('[data-cy="onboarding-search-study"]').type("QAonCloud Test")   
cy.get('[class="Text__StyledText-fcSGOX liUSLx adjust-version mb-0.5"]').contains("v.4.b").click()
cy.get('[class="Text__StyledText-fcSGOX gSpvOG sider-patient-name"]').contains("QA_AU-02").click()
//Click Visit  
cy.get('[data-cy="visit-cm31qz0990dhkigpbpkpgy2p5"][data-visit-name="AUTOMATION-sign-CRF"]').click()
//Click SDE Tab
cy.wait(20000)
cy.get('[data-cy="sourceQuestionTab"]').click()
//Question 1-Check Image upload
cy.get('[data-cy="question-card-cm2n696qj08n8zdk3hgiru340"] > [data-cy="question-card"]').click()
cy.get('[data-cy="open-modal-capture"]:visible').first().click({force: true} )
cy.get('[data-cy="upload-sc-button"]').click()
const filepath = 'Image4.png'; 
// Path to your PNG file
cy.get('input[type="file"]').attachFile(filepath);
cy.wait(20000)
cy.get('[data-cy="confirmation-modal-title"]').contains('No Name Found')
//Click Cancel
cy.get('[data-cy="confirmModal-cancelButton"]').click()
cy.get('[data-cy="manual-redact-button"]').scrollIntoView() 
cy.wait(10000)
cy.get('[data-cy="manual-redact-button"]').click()
//Click Start Redaction
cy.get('[data-cy="start-redacting-button"]').click()
cy.wait(10000)
/*
cy.get('[style="cursor: crosshair;"] > .konvajs-content > canvas') // Select the canvas
  .then(($canvas) => {
    const canvas = $canvas[0];
    const context = canvas.getContext('2d');


    // Attach a listener to log clicked coordinates and draw a rectangle
    canvas.addEventListener('click', (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;


      cy.log(`Clicked coordinates: X=${x}, Y=${y}`);


    // Pause the test to click manually
    cy.pause();
})
})


/*
const centerX = 376;  // The center X of the canvas
const centerY = 350;    // The center Y of the canvas
const width = 752;      // The total width
const height = 497;     // The total height

// Start from the top-right corner (right edge of the centerX)
const startX = centerX + width / 2;  // This positions the cursor at the top-right corner
const startY = centerY;  // Same Y-coordinate, top part

// Drag to the left and down
cy.get('[style="cursor: crosshair;"] > .konvajs-content > canvas')
  .trigger('mousedown', { clientX: startX, clientY: startY })  // Starting from the top-right
  .trigger('mousemove', { clientX: startX -46, clientY: startY +336})  // Move left and down
  .trigger('mouseup');  // Ending the drag to confirm the selection

cy.screenshot('rectangle_dragged');  // Screenshot after the drag

*/


cy.get('[style="cursor: crosshair;"] > .konvajs-content > canvas')
.then(($canvas) => {
  const canvas = $canvas[0];  // Get the actual DOM element
  const rect = canvas.getBoundingClientRect();  // Get canvas bounding box

  // Now adjust the coordinates relative to the canvas
  const startX = rect.left + 185;  // Adjust startX with the bounding box
  const startY = rect.top + 55;   // Adjust startY with the bounding box

  const moveX = 752.890625;  // Movement width (from your log)
  const moveY = 497;         // Movement height (from your log)

  cy.log(`Start Coordinates: X=${startX}, Y=${startY}`);
  cy.log(`Target Coordinates: X=${startX + moveX}, Y=${startY + moveY}`);

  // Trigger the mouse events
  cy.get('[style="cursor: crosshair;"] > .konvajs-content > canvas')

    .trigger('mousedown', { clientX: startX, clientY: startY })  // Starting the drag
    .trigger('mousemove', { clientX: startX + moveX, clientY: startY + moveY }) // Moving the cursor
    .trigger('mouseup'); // Releasing the mouse to complete the drag

  cy.screenshot('canvas_dragged');
  cy.wait(10000);  // Wait to ensure everything is visible
});
 


/*
//For Name & Date of Birth
cy.get('[style="cursor: crosshair;"] > .konvajs-content > canvas')
  .trigger('mousedown', { clientX: 310.5, clientY: 130})  // Starting point (center)
  .trigger('mousemove', { clientX: 310.5 + 180, clientY: 130 + 50 })  // Dragging to the bottom-right (center + width/height)
  .trigger('mouseup');  // Ending the drag to confirm the select

cy.screenshot('rectangle_dragged');

cy.wait(10000); 
*/
/*
//For Date ofService
const centerX = 500;  // The center X of the canvas
const centerY = 150;    // The center Y of the canvas
const width = 752;      // The total width
const height = 497;     // The total height

// Start from the top-right corner (right edge of the centerX)
const startX = centerX + width / 2;  // This positions the cursor at the top-right corner
const startY = centerY;  // Same Y-coordinate, top part

// Drag to the left and down
cy.get('[style="cursor: crosshair;"] > .konvajs-content > canvas')
  .trigger('mousedown', { clientX: startX, clientY: startY })  // Starting from the top-right
  .trigger('mousemove', { clientX: startX -50, clientY: startY +80 })  // Move left and down
  .trigger('mouseup');  // Ending the drag to confirm the selection
cy.screenshot('rectangle_dragged');  // Screenshot after the drag
cy.wait(10000);  // Wait to ensure everything is visible
*/


/*
cy.get('[style="cursor: crosshair;"] > .konvajs-content > canvas')
  .trigger('mousedown', { clientX: 310.5, clientY: 130})  // Starting point (center)
  .trigger('mousemove', { clientX: 310.5 + 180, clientY: 130 + 50 })  // Dragging to the bottom-right (center + width/height)
  .trigger('mouseup');  // Ending the drag to confirm the selection
cy.screenshot('rectangle_dragged');

*/
cy.wait(10000);
  cy.wait(10000)
//Click Redaction Complete
cy.get('[data-cy="redaction-complete-button"]').click()
cy.wait(10000)

cy.get('[data-cy="confirm-or-redact-again-menu"]').contains('Please confirm this action')
cy.get('[class="Text__StyledText-fcSGOX fvNYh mb-4"]').contains('I, Source Capture, confirm that this screen capture constitutes medical information for Study Subject QA_AU-02 at visit date 07 Oct 2018')

//Click Confirm
/*
cy.get('[data-cy="confirm-redact-button"]').click()
cy.wait(10000)
cy.get('[data-cy="right-chip-Allergies-AT"]').click()

//Click Submit
cy.get('[data-cy="submit-bottom-chips-menu"]').click()
cy.wait(10000)
*/
//Click Logout
cy.get('[class="anticon anticon-down DownOutlined__Root-knxRmY jZCmAT img-icon img-right"]').click()
cy.get('[data-cy="logout-text"]').click()
/*
  cy.get('[style="cursor: crosshair;"] > .konvajs-content > canvas')
  .then((canvas) => {
    cy.wait(10000)

    const rect = canvas[0].getBoundingClientRect();
    const scaleX = rect.width / 1280;  // Adjust scale for viewport width
    const scaleY = rect.height / 720;  // Adjust scale for viewport height

    const context = canvas[0].getContext('2d');
    context.fillStyle = "rgba(255, 0, 0, 0.5)"; // Red with 50% opacity
    
    // Adjust coordinates based on scaling
    const adjustedX = (173 - 55) * scaleX;
    const adjustedY = (185 - 55) * scaleY;
    const width = 50 * scaleX;
    const height = 50 * scaleY;

    context.fillRect(adjustedX, adjustedY, width, height);
    cy.screenshot('text');
  });
   */
  /*
  cy.get('[style="cursor: crosshair;"] > .konvajs-content > canvas')
  .then((canvas) => {
    const context = canvas[0].getContext('2d');
    const imageData = context.getImageData(0, 0, canvas[0].width, canvas[0].height);
    const data = imageData.data;

    // Define the color you are looking for (e.g., black text)
    const targetColor = { r: 0, g: 0, b: 0, a: 255 };  // RGB color of the text (black in this case)
    let foundCoordinates = [];

    // Loop through all pixels and search for the target color
    for (let i = 0; i < data.length; i += 4) { // Every 4th byte represents a single pixel
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      // Check if the pixel matches the target color
      if (r === targetColor.r && g === targetColor.g && b === targetColor.b && a === targetColor.a) {
        // Calculate the x and y coordinates based on the pixel index
        const x = (i / 4) % canvas[0].width;  // Column (x coordinate)
        const y = Math.floor((i / 4) / canvas[0].width); // Row (y coordinate)

        foundCoordinates.push({ x, y });
      }
    }

    // Log the found coordinates (you can adjust this to find the first or last match, depending on your needs)
    console.log('Text found at coordinates:', foundCoordinates);

    // Example: Drawing a rectangle around the text (you may want to adjust this)
    if (foundCoordinates.length > 0) {
      const firstMatch = foundCoordinates[0];
      const context = canvas[0].getContext('2d');
      context.fillStyle = "rgba(255, 0, 0, 0.5)"; // Red with 50% opacity
      context.fillRect(firstMatch.x, firstMatch.y, 50, 20); // Example rectangle size

      cy.screenshot('canvas-with-found-text'); // Optionally take a screenshot
    }
  });
  */
})
it.only("Login to the Portal and login as Source Markup user", () => {
  cy.viewport(1100, 700)
  cy.visit("https://qa.akyrian.com/"),
 cy.get('#email').focus()
 cy.get('#email').type("sourcemarkup@example.com")
 cy.get('#password').focus()
 cy.get('#password').type("Password!1", { log: false })
 cy.get('#loginAs-btn').click()
 cy.wait(10000)    
//Search study
cy.get('[data-cy="onboarding-search-study"]').type("QAonCloud Test")   
cy.get('[class="Text__StyledText-fcSGOX liUSLx adjust-version mb-0.5"]').contains("v.4.b").click()
cy.wait(10000)
cy.get('[class="Text__StyledText-fcSGOX gSpvOG sider-patient-name"]').contains("QA_AU-02").click()
//click visit   
cy.wait(10000)
cy.get('[data-cy="visit-cm31qz0990dhkigpbpkpgy2p5"][data-visit-name="AUTOMATION-sign-CRF"]').click()

//Check Pending Snippet  
cy.wait(10000)
cy.get('[data-cy="question-card-cm2n696qj08n8zdk3hgiru340"] > [data-cy="question-card"]').contains("CRF: Allergies-AT").click() 
cy.wait(10000)
cy.get('[class="question-card-action-menu-icon icon-dettach"]').first().click({ force: true })
cy.wait(10000)


cy.get('.konvajs-content canvas').should('be.visible');
cy.pause()


// Canvas Coordinates (from the console logs)
const startX = 250.046875;  // Start X at canvas coords (36, 496)
const startY = 184.0703125; // Start Y at canvas coords (36, 496)

// End point after drag (canvas coords)
const endX = 520.046875;   // End X at canvas coords (376, 436)
const endY = 223.0703125;   // End Y at canvas coords (376, 436)

// Now simulate the drag action on the canvas
cy.get('[style="cursor: crosshair;"] > .konvajs-content > canvas')
  .trigger('mousedown', { clientX: startX, clientY: startY })  // Start from (36, 496)
  .trigger('mousemove', { clientX: endX, clientY: endY })  // Drag to (376, 436)
  .trigger('mouseup');  // Confirm the drag action

// Take a screenshot after the drag action is performed
cy.screenshot('rectangle_dragged');  

// Optionally wait to observe the result (e.g., for animations to complete)
cy.wait(10000);
/*

const centerX = 60;  // The center X of the canvas
const centerY = 100;    // The center Y of the canvas
const width = 839;      // The total width
const height = 215;     // The total height

// Start from the top-right corner (right edge of the centerX)
const startX = centerX + width / 2;  // This positions the cursor at the top-right corner
const startY = centerY;  // Same Y-coordinate, top part

// Drag to the left and down
cy.get('[style="cursor: crosshair;"] > .konvajs-content > canvas')
  .trigger('mousedown', { clientX: startX, clientY: startY })  // Starting from the top-right
  .trigger('mousemove', { clientX: startX -50, clientY: startY +300 })  // Move left and down
  .trigger('mouseup');  // Ending the drag to confirm the selection
cy.screenshot('rectangle_dragged');  // Screenshot after the drag
cy.wait(10000);

*/
/*

  cy.wait(10000)
  cy.get('[data-cy="streamline-dropdown-data-entry-question"] > .ant-select-selector').click()
  cy.wait(5000)
  
cy.get('.ant-select-item-option-content').click()
cy.get('[data-cy="submit-bottom-chips-menu"]').click()
cy.wait(10000)
//Click Done
cy.get('[data-cy="done-snippet-button"]').click()
*/
//Click Logout
cy.get('[class="anticon anticon-down DownOutlined__Root-knxRmY jZCmAT img-icon img-right"]').click()
cy.get('[data-cy="logout-text"]').click()
});

})




















/*
it("Login to the Portal and login as Source Markup user", () => {
    cy.viewport(1280, 720)
    cy.visit("https://qa.akyrian.com/"),
   cy.get('#email').focus()
   cy.get('#email').type("sourcemarkup@example.com")
   cy.get('#password').focus()
   cy.get('#password').type("Password!1", { log: false })
   cy.get('#loginAs-btn').click()
   cy.wait(10000)    
//Search study
cy.get('[data-cy="onboarding-search-study"]').type("QAonCloud Test")   
 cy.get('[class="Text__StyledText-fcSGOX liUSLx adjust-version mb-0.5"]').contains("v.4.b").click()
 cy.wait(10000)
cy.get('[class="Text__StyledText-fcSGOX gSpvOG sider-patient-name"]').contains("QA_AU-02").click()
 //click visit   
 cy.wait(10000)
 cy.get('[data-cy="visit-cm31qz0990dhkigpbpkpgy2p5"][data-visit-name="AUTOMATION-sign-CRF"]').click()

//Check Pending Snippet  
cy.wait(10000)
cy.get('[data-cy="question-card-cm2n696qj08n8zdk3hgiru340"] > [data-cy="question-card"]').contains("CRF: Allergies-AT").click() 
cy.wait(10000)
cy.get('[class="question-card-action-menu-icon icon-dettach"]').first().click({ force: true })
cy.wait(10000)
cy.get('.konvajs-content canvas').should('be.visible');
cy.get('[style="cursor: crosshair;"] > .konvajs-content > canvas').screenshot('canvas-image', { capture: 'viewport' })


  // Now use Tesseract.js to extract text and coordinates
  cy.window().then((win) => {
    // Ensure Tesseract.js is available
    const Tesseract = require('tesseract.js');

    // Run Tesseract on the screenshot taken
    Tesseract.recognize(
      'cypress/screenshots/canvas-image.png', // Path to the screenshot
      'eng',  // Language code (can be 'eng' for English or other languages)
      {
        logger: (m) => console.log(m), // Log OCR progress (optional)
      }
    ).then(({ data: { text, words } }) => {
      // Log the extracted text
      console.log("Extracted Text:", text);

      // Loop through the words and log their bounding boxes
      words.forEach((word) => {
        console.log(`Word: ${word.text}`);
        console.log(`Bounding Box: Top-left: (${word.bbox.x0}, ${word.bbox.y0}), Bottom-right: (${word.bbox.x1}, ${word.bbox.y1})`);
      });

      // You can now crop or interact with the canvas based on the coordinates
    }).catch((err) => {
      console.error("Error with Tesseract OCR:", err);
    });
  });

  // Pause for debugging or inspecting the result

//Click Logout
cy.get('[class="anticon anticon-down DownOutlined__Root-knxRmY jZCmAT img-icon img-right"]').click()
cy.get('[data-cy="logout-text"]').click()
});

});
*/