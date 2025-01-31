// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import 'cypress-file-upload';
require('@4tw/cypress-drag-drop')
Cypress.Commands.add('waitForPageLoad', () => {
  cy.window().should('have.property', 'document');
  cy.document().should('have.property', 'readyState', 'complete');
});
Cypress.Commands.add('AkyrianLogin_LaunchURL', () => {

cy.visit(Cypress.env('AkyrianURL'))
Loginpage.logo.should('be.visible')
Loginpage.Email.contains("Your Email Address").should('exist')
Loginpage.Password.contains("Your Password").should('exist')
cy.wait(4000)
})

Cypress.Commands.add('AkyrianLogin', (email,password) => { 
    cy.viewport(1280, 720)
cy.visit("https://qa.akyrian.com/"),
   
cy.get('#email').focus()
cy.get('#email').type("auto.streamlineSC@gmail.com")
cy.get('#password').focus()
cy.get('#password').type("Password!1", { log: false })
cy.get('#loginAs-btn').click()
cy.wait(4000)
 })
 Cypress.Commands.add('AkyrianLogin_SA', (email,password) => { 
  cy.viewport(1280, 720)
cy.visit("https://qa.akyrian.com/"),
 
cy.get('#email').focus()
cy.get('#email').type("auto.streamlineSA@gmail.com")
cy.get('#password').focus()
cy.get('#password').type("Password!1", { log: false })
cy.get('#loginAs-btn').click()
cy.wait(4000)
})
 Cypress.Commands.add('AkyrianSDELogin_1', (email,password) => { 
  cy.viewport(1280, 720)
cy.visit("https://qa.akyrian.com/"),
 
cy.get('#email').focus()
cy.get('#email').type("auto.sourcecapture@gmail.com")
cy.get('#password').focus()
cy.get('#password').type("Password!1", { log: false })
cy.get('#loginAs-btn').click()
cy.wait(4000)
})
Cypress.Commands.add('AkyrianSDELogin_2', (email,password) => { 
  cy.viewport(1280, 720)
cy.visit("https://qa.akyrian.com/"),
 
cy.get('#email').focus()
cy.get('#email').type("auto.sourcemarkup@gmail.com")
cy.get('#password').focus()
cy.get('#password').type("Password!1", { log: false })
cy.get('#loginAs-btn').click()
cy.wait(4000)
})


Cypress.Commands.add('AkyrianSDELogin_3', (email,password) => { 
  cy.viewport(1280, 720)
cy.visit("https://qa.akyrian.com/"),
 
cy.get('#email').focus()
cy.get('#email').type("auto.snippetassessment@gmail.com")
cy.get('#password').focus()
cy.get('#password').type("Password!1", { log: false })
cy.get('#loginAs-btn').click()
cy.wait(4000)
})
Cypress.Commands.add('AkyrianSDELogin_4', (email,password) => { 
  cy.viewport(1280, 720)
cy.visit("https://qa.akyrian.com/"),
 
cy.get('#email').focus()
cy.get('#email').type("auto.dataentrya@gmail.com")
cy.get('#password').focus()
cy.get('#password').type("Password!1", { log: false })
cy.get('#loginAs-btn').click()
cy.wait(4000)
})
Cypress.Commands.add('AkyrianSDELogin_DataEntryB', (email,password) => { 
  cy.viewport(1280, 720)
cy.visit("https://qa.akyrian.com/"),
 
cy.get('#email').focus()
cy.get('#email').type("auto.dataentryb@gmail.com")
cy.get('#password').focus()
cy.get('#password').type("Password!1", { log: false })
cy.get('#loginAs-btn').click()
cy.wait(4000)
})
Cypress.Commands.add('AkyrianSDELogin_Verification', (email,password) => { 
  cy.viewport(1280, 720)
cy.visit("https://qa.akyrian.com/"),
 
cy.get('#email').focus()
cy.get('#email').type("auto.dataadjudicator@gmail.com")
cy.get('#password').focus()
cy.get('#password').type("Password!1", { log: false })
cy.get('#loginAs-btn').click()
cy.wait(4000)
})

Cypress.Commands.add('AkyrianSDELogin_signcrf', (email,password) => { 
  cy.viewport(1280, 720)
cy.visit("https://qa.akyrian.com/"),
 
cy.get('#email').focus()
cy.get('#email').type("auto.signcrf@gmail.com")
cy.get('#password').focus()
cy.get('#password').type("Password!1", { log: false })
cy.get('#loginAs-btn').click()
cy.wait(4000)
})

Cypress.Commands.add('AkyrianSDELogin_studyconfig', (email,password) => { 
  cy.viewport(1480, 800)
cy.visit("https://qa.akyrian.com/"),
 
cy.get('#email').focus()
cy.get('#email').type("studyconfig@example.com")
cy.get('#password').focus()
cy.get('#password').type("Password!1", { log: false })
cy.get('#loginAs-btn').click()
cy.wait(4000)
})
 Cypress.Commands.add('uploadFile', (fileName , selector = 'input[type="file"]') => {
    const options = { filePath: fileName };
    const fileType = fileName.split('.').pop();
    if (String(fileType).toLowerCase() === 'pdf') {
      options.mimeType = 'application/pdf';
      options.encoding = 'binary';
    }
 else if (fileType === 'png') {
    options.mimeType = 'image/png';
  } else if (fileType === 'jpg' || fileType === 'jpeg') {
    options.mimeType = 'image/jpeg';
  }
    cy.get(selector).attachFile(options);
  });

  
  //Client Streamline Command
  Cypress.Commands.add('getSnapshot', (selector) => {
    cy.get(selector).screenshot();
  });

  Cypress.Commands.add('drawSingleRect', ({ x, y, x2, y2 }) => {
    cy.get('[data-cy=streamline-dropdown-data-entry-question]').then(($canvas) => {
      const canvas = $canvas[0];
      const ctx = canvas.getContext('2d');
      ctx.beginPath();
      ctx.rect(x, y, x2 - x, y2 - y);
      ctx.stroke();
    });
  });
  Cypress.Commands.add('waitForCanvasToLoad', () => {
    cy.get('[data-cy=canvas-content]', { timeout: 10000 }).should('be.visible');
  });

  Cypress.Commands.add('clickCanvasTools', (canvasTool, forceClick = false) => {
    cy.get(`[data-cy=${canvasTool}]`).should('exist').click({ force: forceClick });
  });
  Cypress.Commands.add('addSnippet', (OCRName, force = false) => {
    const OCRNameRemovedSpaces = OCRName.replace(/\s/g, '');
    cy.get(`[data-cy=right-chip-${OCRNameRemovedSpaces}]`).scrollIntoView().should('be.visible');
    cy.drawSingleRect(snippetSCPosition[OCRName], 'top-left', force);
    cy.wait(3000);
    cy.get('[data-cy=streamline-dropdown-data-entry-question]').should('be.visible').click();
    const count = 0;
    recursiveScrollCheck(count, OCRNameRemovedSpaces);
    cy.get(`[data-cy=streamline-dropdown-data-entry-question-option-${OCRNameRemovedSpaces}]`)
      .should('be.visible')
      .click();
  });

/*

  const dragAndDrop = (subject, target) => {
    Cypress.log({
        name: 'DRAGNDROP',
        message: `Dragging element ${subject} to ${target}`,
        consoleProps: () => ({
            subject,
            target,
        }),
    });

    cy.get(subject).then($draggable => {
        const rect = $draggable[0].getBoundingClientRect();
        const dragX = rect.left + rect.width / 2; // Center X of draggable
        const dragY = rect.top + rect.height / 2; // Center Y of draggable

        // Start dragging the element
        cy.wrap($draggable).trigger('mousedown', {
            button: 0,
            pageX: dragX,
            pageY: dragY,
        });

        cy.wait(200); // Adjust wait as necessary

        cy.get(target).first().then($target => {
            const targetRect = $target[0].getBoundingClientRect();
            const dropX = targetRect.left + targetRect.width / 2; // Center X of target
            const dropY = targetRect.top + targetRect.height / 2; // Center Y of target

            // Move to the target and drop the element
            cy.wrap($target).trigger('mousemove', {
                clientX: dropX,
                clientY: dropY,
            }).trigger('mouseup', {
                force: true,
            });
        });
    });
};

// Register the command
Cypress.Commands.add('dragAndDrop', dragAndDrop);
*/

/*
import 'cypress-drag-drop';
Cypress.Commands.add('checkActiveQuestionFieldUI', (containerId) => {
    cy.get(`[data-cy="${containerId}"]`).should('exist'); // Adjust checks as needed
  });

  Cypress.Commands.add('dragAndDrop', (sourceSelector, targetSelector) => {
    cy.get(sourceSelector).drag(targetSelector);
});
*/

/*
Cypress.Commands.add('dragAndDrop', (subjectSelector, targetSelector, yOffset = 0, shouldMouseDown = false) => {  const BUTTON_INDEX = 0;
  const SLOPPY_CLICK_THRESHOLD = 10;

  cy.get(targetSelector).first().then(($target) => {
    const coordsDrop = $target[0].getBoundingClientRect();
    // Calculate the drop coordinates to be in the middle of the target

    cy.get(subjectSelector).then(($subject) => {
      const coordsDrag = $subject[0].getBoundingClientRect();
        

      cy.wrap($subject)
        .trigger('mousedown', {
          button: BUTTON_INDEX,
          clientX: coordsDrag.x + (coordsDrag.width / 2),
          clientY: coordsDrag.y + (coordsDrag.height / 2),
          force: true,
        });

      // Simulate dragover
      cy.get(targetSelector).trigger('dragover');

      // Move the mouse in steps to simulate a smooth drag
      const steps = 10;
      for (let i = 1; i <= steps; i++) {
        cy.get('body').trigger('mousemove', {
          button: BUTTON_INDEX,
          clientX: coordsDrag.x + ((coordsDrop.x - coordsDrag.x) / steps) * i,
          clientY: coordsDrag.y + ((coordsDrop.y - coordsDrag.y) / steps) * i,
          force: true,
        });
      }
      if (shouldMouseDown) {
        // Trigger mousedown at the drop location
        cy.get('body').trigger('mousedown', {
          force: true,
          clientX: coordsDrop.x + (coordsDrop.width / 2),
          clientY: coordsDrop.y + (coordsDrop.width / 2),
        });
      }
      // Final drop
      cy.get('body').trigger('mouseup')
      
      });
    });
  })

*/
/*
Cypress.Commands.add('dragAndDrop', (subjectSelector, targetSelector, yOffset = 0, shouldMouseDown = false) => {
  const BUTTON_INDEX = 0;
  const SLOPPY_CLICK_THRESHOLD = 10;

  // Function to perform drag and drop
  const performDragAndDrop = (subject, target, offsetY) => {
    cy.get(target).then(($target) => {
      const coordsDrop = $target[0].getBoundingClientRect();

      // Calculate the drop coordinates to be in the middle of the target
      cy.get(subject).then(($subject) => {
        const coordsDrag = $subject[0].getBoundingClientRect();

        // Trigger mousedown at the subject's center
        cy.wrap($subject)
          .trigger('mousedown', {
            button: BUTTON_INDEX,
            clientX: coordsDrag.x + (coordsDrag.width / 2),
            clientY: coordsDrag.y + (coordsDrag.height / 2),
            force: true,
          });

        // Simulate dragover event on the target
        cy.get(target).trigger('dragover');

        // Move the mouse in steps to simulate a smooth drag
        const steps = 10;
        for (let i = 1; i <= steps; i++) {
          cy.get('body').trigger('mousemove', {
            button: BUTTON_INDEX,
            clientX: coordsDrag.x + ((coordsDrop.x - coordsDrag.x) / steps) * i,
            clientY: coordsDrag.y + ((coordsDrop.y - coordsDrag.y) / steps) * i,
            force: true,
          });
        }

        if (shouldMouseDown) {
          // Trigger mousedown at the drop location
          cy.get('body').trigger('mousedown', {
            force: true,
            clientX: coordsDrop.x + (coordsDrop.width / 2),
            clientY: coordsDrop.y + (coordsDrop.height / 2),
          });
        }

        // Final drop action
        cy.get('body').trigger('mouseup');
      });
    });
  };

  // Perform drag and drop for multiple questions in a sequential manner
  cy.get(subjectSelector).each(($subject, index) => {
    const yOffsetForNext = index * 100; // You can adjust the 100 value for desired space between questions

    // Perform the drag and drop for each question in sequence
    performDragAndDrop($subject, targetSelector, yOffsetForNext);
  });
});
*/
Cypress.Commands.add('dragAndDrop', (subjectSelector, targetSelector, yOffset = 0, shouldMouseDown = false) => {
  const BUTTON_INDEX = 0;
  const SLOPPY_CLICK_THRESHOLD = 10;

  // Add a counter for drag-and-drop operations
  let dragCount = 0; // Counter to track the drag-and-drop operations

  // Function to perform drag and drop
  const performDragAndDrop = (subject, target, offsetY) => {
    cy.get(target).then(($target) => {
      const coordsDrop = $target[0].getBoundingClientRect();

      // Calculate the drop coordinates to be in the middle of the target
      cy.get(subject).then(($subject) => {
        const coordsDrag = $subject[0].getBoundingClientRect();

        // Trigger mousedown at the subject's center
        cy.wrap($subject)
          .trigger('mousedown', {
            button: BUTTON_INDEX,
            clientX: coordsDrag.x + (coordsDrag.width / 2),
            clientY: coordsDrag.y + (coordsDrag.height / 2),
            force: true,
          });

        // Simulate dragover event on the target
        cy.get(target).trigger('dragover');

        // Move the mouse in steps to simulate a smooth drag
        const steps = 10;
        for (let i = 1; i <= steps; i++) {
          cy.get('body').trigger('mousemove', {
            button: BUTTON_INDEX,
            clientX: coordsDrag.x + ((coordsDrop.x - coordsDrag.x) / steps) * i,
            clientY: coordsDrag.y + ((coordsDrop.y - coordsDrag.y) / steps) * i,
            force: true,
          });
        }

        // After the 4th drag-and-drop, trigger mousedown at the drop location
        dragCount++; // Increment drag count
        if (dragCount >= 5 && !shouldMouseDown) {
          // Set shouldMouseDown to true after the 4th operation
          shouldMouseDown = true;
        }

        if (shouldMouseDown) {
          // Trigger mousedown at the drop location
          cy.get('body').trigger('mousedown', {
            force: true,
            clientX: coordsDrop.x + (coordsDrop.width / 2),
            clientY: coordsDrop.y + (coordsDrop.height / 2),
          });
        }

        // Final drop action
        cy.get('body').trigger('mouseup');
      });
    });
  };

  // Call the performDragAndDrop function with the required parameters
  performDragAndDrop(subjectSelector, targetSelector, yOffset);
});
