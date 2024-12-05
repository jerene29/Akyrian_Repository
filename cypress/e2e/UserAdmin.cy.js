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
describe('Akyrian UserAdmin FLow',()=> {

 it("Login to the Portal and login as Source Capture user", () => {
    cy.viewport(1280, 720)
        cy.visit("https://qa.akyrian.com/"),
         
        cy.get('#email').focus()
        cy.get('#email').type("useradmin@example.com")
        cy.get('#password').focus()
        cy.get('#password').type("Password!1", { log: false })
        cy.get('#loginAs-btn').click()
        cy.wait(10000)        
   
    //Check "Add New User" button is visible 

    cy.get('[data-cy="btn-add-new-user"]').should('be.visible')
    cy.get('[data-cy="btn-add-new-user"]').click()

    //Check "Add New User"
    cy.get('[data-cy="edit-profile-upload-photo-button"]').contains("Upload Photo").should('be.visible')

    cy.get('[data-cy="add-new-user-firstName"]').should('be.visible')
    cy.get('[data-cy="add-new-user-lastName"]').should('be.visible')
    cy.get('[data-cy="add-new-user-email"]').should('be.visible')
    cy.get('[data-cy="add-new-user-phoneNumber"]').should('be.visible')
    cy.get('[data-cy="add-new-user-save-btn"]').contains("Next").should('be.visible')
    cy.get('[class="Button__Container-gknlFx gLNRtR"]').contains("Cancel").should('be.visible')
    cy.get('[class="Button__Container-gknlFx gLNRtR"]').click()
//Check Bulk Action
cy.get('[data-cy="user-admin-bulk-button"]').contains("Bulk Action").should('be.visible')
cy.get('[data-cy="user-admin-bulk-button"]').click()
cy.get('[data-cy="icon-pause"]').should('be.visible')
cy.get('[data-cy="sync"]').should('be.visible')
cy.get('[data-cy="icon-export"]').should('be.visible')
cy.get('[class="Button__Container-gknlFx BXHhp right"]').contains("Cancel").click({force: true})
//Search
cy.get('[class="UserAdmin__SearchWrapper-jddtQj dqQAoG"]').type("sasi@akyrian.com")
//Click Pause
cy.get('[data-cy="pause-user-icon"]').click()

cy.wait(20000)
//Click UnPause
cy.get('.bVXPMj').click()

cy.wait(20000)
//Reset Locked Account
cy.get('[data-cy="user-admin-sync-icon"]').click()
cy.get('[data-cy="confirmation-modal-title"]').contains("This will send sasi kumar tester an account reset link")
cy.get('[data-cy="confirmation-modal-desc"]').contains("The user will be able to create a new password once they have received the reset link")
//Check Confirm and cancel link
cy.get('[data-cy="confirmModal-confirmButton"]').contains("Confirm").should('be.visible')
cy.get('[data-cy="confirmModal-cancelButton"]').contains("Cancel").should('be.visible')
cy.get('[data-cy="confirmModal-cancelButton"]').click()
//CLick Deactivate
cy.get('[data-cy="user-admin-archive-icon"]').should('be.visible')
//Click Training Record
cy.get('[data-cy="training-record-icon"]').should('be.visible').click()
cy.get('[class="Text__StyledText-fcSGOX kNgNur ml-3"]').contains("Manage Training Record")
//Check Confirm and cancel link
cy.get('[data-cy="add-training-record-save-btn"]').contains("Confirm").should('be.disabled')
cy.get('[data-cy="add-training-record-cancel-btn"]').contains("Cancel").should('be.visible')
cy.get('[data-cy="add-training-record-cancel-btn"]').click()
//Click down pointer
cy.get('[data-cy="user-admin-arrow-icon"]').click()
//Click Add Roles & studies
cy.get('[data-cy="add-permission-btn"]').click()
cy.get('[class="Text__StyledText-fcSGOX kNgNur ml-3"]').contains("Add User to Study")
cy.get('[data-cy="add-user-study-study"]').click()
cy.get('[label="AMI-90"] > .ant-select-item-option-content').click()
cy.get('[data-cy="add-user-study-site"] > .ant-select-selector').click()
cy.get('[label="Bellevue Hospital"] > .ant-select-item-option-content').click()
cy.get('[data-cy="add-user-study-role"]').click()
//cy.get('[label="Bellevue Hospital"] > .ant-select-item-option-content').click()
cy.get('[data-cy="add-user-study-role"] > .ant-select-selector > .ant-select-selection-item').click()
cy.get('[label="User Admin User"] > .ant-select-item-option-content').click()
cy.get('[data-cy="add-user-study-save-btn"]').contains("Confirm").should('be.visible')
cy.get('[class="Button__Container-gknlFx gLNRtR"]').contains("Cancel").should('be.visible')
cy.get('[class="Button__Container-gknlFx gLNRtR"]').click()
//CLick Edit
cy.get('[data-cy="edit-permission-btn"]').click()
cy.get('[class="Button__Container-gknlFx gLNRtR"]').click()

//Click Logout
cy.get('[data-cy="header-user-popover-trigger"]').click()
cy.get('[data-cy="logout-text"]').click()

})
})