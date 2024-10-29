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
cy.get('#email').type(email)
cy.get('#password').focus()
cy.get('#password').type(password, { log: false })
cy.get('#loginAs-btn').click()
cy.wait(4000)
 })
 Cypress.Commands.add('AkyrianSDELogin_1', (email,password) => { 
  cy.viewport(1280, 720)
cy.visit("https://qa.akyrian.com/"),
 
cy.get('#email').focus()
cy.get('#email').type("sourcecapture@example.com")
cy.get('#password').focus()
cy.get('#password').type(password, { log: false })
cy.get('#loginAs-btn').click()
cy.wait(4000)
})
Cypress.Commands.add('AkyrianSDELogin_2', (email,password) => { 
  cy.viewport(1280, 720)
cy.visit("https://qa.akyrian.com/"),
 
cy.get('#email').focus()
cy.get('#email').type("sourcemarkup@example.com")
cy.get('#password').focus()
cy.get('#password').type(password, { log: false })
cy.get('#loginAs-btn').click()
cy.wait(4000)
})


Cypress.Commands.add('AkyrianSDELogin_3', (email,password) => { 
  cy.viewport(1280, 720)
cy.visit("https://qa.akyrian.com/"),
 
cy.get('#email').focus()
cy.get('#email').type("snippetassessment@example.com")
cy.get('#password').focus()
cy.get('#password').type(password, { log: false })
cy.get('#loginAs-btn').click()
cy.wait(4000)
})
Cypress.Commands.add('AkyrianSDELogin_4', (email,password) => { 
  cy.viewport(1280, 720)
cy.visit("https://qa.akyrian.com/"),
 
cy.get('#email').focus()
cy.get('#email').type("dataentrya@example.com")
cy.get('#password').focus()
cy.get('#password').type(password, { log: false })
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

 