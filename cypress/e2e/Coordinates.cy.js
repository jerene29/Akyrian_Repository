/// <reference types="cypress" />
//import { recursiveScrollCheck } from '../support/helpers'
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
//const { performOCR } = require('../support/ocr');


//const email = Cypress.env('email');       // Get email from environment variables
//const password = Cypress.env('password')
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
cy.wait(20000)
//Click Visit  
cy.get('[data-cy="visit-cm31qz0990dhkigpbpkpgy2p5"][data-visit-name="AUTOMATION-sign-CRF"]').click({force: true})
//Click SDE Tab
cy.wait(20000)
cy.get('[data-cy="sourceQuestionTab"]').click()
 //Question 1-Check Image upload
 cy.get('[data-cy="question-card-cm2n69vn408nhzdk3qzqxsxnv"] > [data-cy="question-card"]').click()
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
cy.wait(30000)
cy.get('[data-cy="manual-redact-button"]').click()
// Click Start Redaction
cy.get('[data-cy="start-redacting-button"]').click();
cy.wait(10000);
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
  .trigger('mousemove', { clientX: startX -450, clientY: startY +180 })  // Move left and down
  .trigger('mouseup');  // Ending the drag to confirm the selection
cy.screenshot('rectangle_dragged');  // Screenshot after the drag
cy.wait(10000);  // Wait to ensure everything is visible
      });
  



 it.only("Login to the Portal and login as Source Capture user", () => {
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
cy.get('[data-cy="visit-cm31quf3w0dgiigpb4wfb7e2c"][data-visit-name="AUTOMATION-sign-CRF"]').click({force: true})
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
cy.wait(30000)
cy.get('[data-cy="manual-redact-button"]').click()
//Click Start Redaction
cy.get('[data-cy="start-redacting-button"]').click()
cy.wait(10000)
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
  .trigger('mousemove', { clientX: startX -450, clientY: startY +180 })  // Move left and down
  .trigger('mouseup');  // Ending the drag to confirm the selection
cy.screenshot('rectangle_dragged');  // Screenshot after the drag
cy.wait(10000);
//Click Redaction Complete
cy.get('[data-cy="redaction-complete-button"]').click()
cy.wait(10000)


cy.get('[data-cy="confirm-or-redact-again-menu"]').contains('Please confirm this action')
cy.get('[class="Text__StyledText-fcSGOX fvNYh mb-4"]').contains('I, Source Capture, confirm that this screen capture constitutes medical information for Study Subject QA_AU-02 at visit date 07 Oct 2018')


//Click Confirm


cy.get('[data-cy="confirm-redact-button"]').click()
cy.wait(10000)
cy.get('[data-cy="right-chip-Allergies-AT"]').click()
//Click Submit
cy.get('[data-cy="submit-bottom-chips-menu"]').click()
cy.wait(10000)


//Click Logout
cy.get('[class="anticon anticon-down DownOutlined__Root-knxRmY jZCmAT img-icon img-right"]').click()
cy.get('[data-cy="logout-text"]').click()


})
})

it("Manual Rectangle Drawing and Log Coordinates", () => {
  cy.viewport(1280, 720);
  cy.visit("https://qa.akyrian.com/");

  // Login steps
  cy.get('#email').focus();
  cy.get('#email').type("sourcecapture@example.com");
  cy.get('#password').focus();
  cy.get('#password').type("Password!1", { log: false });
  cy.get('#loginAs-btn').click();
  cy.wait(10000);

  // Navigate to the relevant page
  cy.get('[data-cy="onboarding-search-study"]').type("QAonCloud Test");
  cy.get('[class="Text__StyledText-fcSGOX liUSLx adjust-version mb-0.5"]').contains("v.4.b").click();
  cy.get('[class="Text__StyledText-fcSGOX gSpvOG sider-patient-name"]').contains("QA_AU-02").click();
  cy.wait(20000);

  // Click Visit
  cy.get('[data-cy="visit-cm31qz0990dhkigpbpkpgy2p5"][data-visit-name="AUTOMATION-sign-CRF"]').click({ force: true });
  cy.wait(20000);
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
  // Click on Redaction Button
  cy.get('[data-cy="manual-redact-button"]').scrollIntoView();
  cy.wait(30000);
  cy.get('[data-cy="manual-redact-button"]').click();

  // Click Start Redaction
  cy.get('[data-cy="start-redacting-button"]').click();
  cy.wait(10000);

  // Select the canvas using the selector
  const canvasWidth = 752;  // Canvas width
  const canvasHeight = 497; // Canvas height

  // Select the canvas element and start interacting with it
  cy.get('[style="cursor: crosshair;"] > .konvajs-content > canvas')  // Select the canvas
    .then(($canvas) => {
      const canvas = $canvas[0];
      const context = canvas.getContext('2d');

      // Variables to store the starting and ending coordinates
      let startX, startY, endX, endY;

      // Function to simulate mouse down and start drawing
      cy.wrap($canvas).trigger('mousedown', { 
        clientX: 100,   // Initial X position for rectangle
        clientY: 150    // Initial Y position for rectangle
      }).then(() => {
        // Log the initial coordinates when mouse down happens (this is where the rectangle starts)
        cy.log(`Mouse Down Position - X: 100, Y: 150`);
        startX = 100;
        startY = 150;
        
        // Pause the test to manually draw the rectangle
        cy.pause();  // Pauses the test, allowing you to manually draw the rectangle
      });

      // Function to simulate mouse movement to track rectangle dimensions
      cy.wrap($canvas).trigger('mousemove', { 
        clientX: startX + 200,  // Move to the right (drawing width)
        clientY: startY + 200   // Move down (drawing height)
      }).then(() => {
        // Log the updated position as the rectangle grows
        cy.log(`Mouse Move Position - X: ${startX + 200}, Y: ${startY + 200}`);
        endX = startX + 200;
        endY = startY + 200;

        // Log the final rectangle dimensions
        const width = endX - startX;
        const height = endY - startY;
        cy.log(`Rectangle Width: ${width}, Height: ${height}`);

        // Optionally, you can also draw the rectangle for visualization on the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);  // Clear previous drawings
        context.beginPath();
        context.rect(startX, startY, width, height);
        context.stroke();
      });

      // Function to simulate mouse up to finish the rectangle drawing
      cy.wrap($canvas).trigger('mouseup', { 
        clientX: endX, 
        clientY: endY 
      }).then(() => {
        // Log the final position when mouse up happens (end of rectangle)
        cy.log(`Mouse Up Position - X: ${endX}, Y: ${endY}`);
        cy.screenshot('rectangle_drawn_after_manual_interaction');  // Take a screenshot after the drawing is done
      });
    });
});