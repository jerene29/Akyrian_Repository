/// <reference types="cypress" />

{
    "projectId"; "rjovnz"
}
"experimentalSourceRewriting".true;
Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    // failing the test
    return false
});
const email = Cypress.env('email');       // Get email from environment variables
const password = Cypress.env('password')
//Login Page
describe('Akyrian SDE FLow', function() {
    it("Login to the Portal and login as Source Capture user", () => {
    cy.AkyrianSDELogin_1(email,password)
    //Search study
    cy.get("#study-version").contains('v.4.b').click()
    cy.wait(1000)
    cy.get('[class="Text__StyledText-fcSGOX gSpvOG sider-patient-name"]').contains("QA_AU-03").click()
    //click visit 
    cy.get('[data-cy="visit-cm2k19ovl0u6xvx8aew6fmuqi"][data-visit-name="AutomationSDE"]').click()
    //Click SDE Tab
    cy.get('[data-cy="sourceQuestionTab"]').click()
    //Question 1-Check Image upload
   /* cy.get('[class="QuestionCard__QuestionContainer-kPReCH hDLgiU question-card-container card-cm2k0248a0u2lvx8ab8qskgk9"]').click()
    cy.get('[data-cy="open-modal-capture"]:visible').first().click({force: true} )
    cy.get('[data-cy="upload-sc-button"]').click()
    const filepath = 'Image1.png'; 
    // Path to your PNG file
    cy.get('input[type="file"]').attachFile(filepath);cy.wait(20000)
    cy.get('[data-cy="confirmation-modal-title"]').contains('No Name Found')
    //Click Yes
cy.get('[data-cy="confirmModal-confirmButton"]').click()
cy.get('#first-name-input-sc-intake').type("Test1")
cy.get('#last-name-input-sc-intake').type("Test2")
//Click Submit
cy.get('[data-cy="submit-sc-intake-button"]').click()
cy.get('[data-cy="manual-redact-button"]').scrollIntoView() 
cy.wait(20000)
cy.get('[data-cy="manual-redact-button"]').click()
cy.get('[data-cy="continue-to-suggestion-button"]').click()
cy.wait(20000)
cy.get('[data-cy="confirm-redact-button"]').click()
cy.wait(15000)
cy.get('[data-cy="right-chip-text-CodeStatus"]').click()
cy.get('[data-cy="submit-bottom-chips-menu"]').click()
cy.wait(15000)
cy.get('[data-cy="UNATTACHED"]').click()

*/
//Question 2-Check Image upload
cy.get('[class="QuestionCard__QuestionContainer-kPReCH hDLgiU question-card-container card-cm2k034w30u2uvx8arcfess1p"]').click()
cy.get('[data-cy="open-modal-capture"]:visible').click({force: true} )
cy.get('[data-cy="upload-sc-button"]').click()
const filepath1 = 'SCImage.png'; // Path to your PNG file
cy.get('input[type="file"]').attachFile(filepath1);
cy.wait(20000)
cy.get('[data-cy="manual-redact-button"]').scrollIntoView() 
cy.wait(20000)
cy.get('[data-cy="manual-redact-button"]').click()
cy.get('[data-cy="continue-to-suggestion-button"]').click()
cy.wait(20000)
cy.get('[data-cy="confirm-redact-button"]').click()
cy.wait(15000)
cy.get('[data-cy="right-chip-text-Gender"]').click()
//cy.get('[data-cy="right-chip-Height"]').click()
cy.get('[data-cy="submit-bottom-chips-menu"]').click()
cy.wait(15000)
cy.get('[data-cy="UNATTACHED"]').click()

/*
//Question 3-Check Image upload
cy.get('[class="QuestionCard__QuestionContainer-kPReCH hDLgiU question-card-container card-cm2k09qph0u4fvx8a1lfah8fz"]').click()
cy.get('[data-cy="open-modal-capture"]:visible').first().click({force: true} )
cy.get('[data-cy="upload-sc-button"]').click()
const filepath2 = 'Image2.png'; // Path to your PNG file
cy.get('input[type="file"]').attachFile(filepath2);
cy.wait(20000)
cy.get('[data-cy="confirmation-modal-title"]').contains('No Name Found')
//Click Yes
cy.get('[data-cy="confirmModal-confirmButton"]').click()
cy.get('#first-name-input-sc-intake').type("Test1")
cy.get('#last-name-input-sc-intake').type("Test2")
//Click Submit
cy.get('[data-cy="submit-sc-intake-button"]').click()
cy.get('[data-cy="manual-redact-button"]').scrollIntoView() 
cy.wait(20000)
cy.get('[data-cy="manual-redact-button"]').click()
cy.get('[data-cy="continue-to-suggestion-button"]').click()
cy.wait(20000)
cy.get('[data-cy="confirm-redact-button"]').click()
cy.wait(15000)
cy.get('[data-cy="right-chip-Birthday"]').click()
cy.get('[data-cy="submit-bottom-chips-menu"]').click()
cy.wait(15000)
cy.get('[data-cy="UNATTACHED"]').click()
//Question 4-Check Image upload
cy.get('[class="QuestionCard__QuestionContainer-kPReCH hDLgiU question-card-container card-cm2k0urb60u5yvx8audm35r4q"]').click()
cy.get('[data-cy="open-modal-capture"]:visible').first().click({force: true} )
cy.get('[data-cy="upload-sc-button"]').click()
const filepath3 = 'Image3.png'; 
// Path to your PNG file
cy.get('input[type="file"]').attachFile(filepath3);
cy.wait(20000)
cy.get('[data-cy="confirmation-modal-title"]').contains('No Name Found')
//Click Yes
cy.get('[data-cy="confirmModal-confirmButton"]').click()
cy.get('#first-name-input-sc-intake').type("Test1")
cy.get('#last-name-input-sc-intake').type("Test2")
//Click Submit
cy.get('[data-cy="submit-sc-intake-button"]').click()
cy.get('[data-cy="manual-redact-button"]').scrollIntoView() 
cy.wait(20000)
cy.get('[data-cy="manual-redact-button"]').click()
cy.get('[data-cy="continue-to-suggestion-button"]').click()
cy.wait(20000)
cy.get('[data-cy="confirm-redact-button"]').click()
cy.wait(15000)
cy.get('[data-cy="right-chip-Height"]').click()
cy.get('[data-cy="submit-bottom-chips-menu"]').click()*/
//Click Attached Tab
//Click Logout
cy.get('[class="anticon anticon-down DownOutlined__Root-knxRmY jZCmAT img-icon img-right"]').click()
cy.get('[data-cy="logout-text"]').click()

})

it("Login to the Portal and login as Source Markup user", () => {
     cy.AkyrianSDELogin_2(email,password)
     //Search study  
cy.get("#study-version").contains('v.4.b').click()
cy.wait(1000)
cy.get('[class="Text__StyledText-fcSGOX gSpvOG sider-patient-name"]').contains("QA_AU-03").click()
 //click visit    
cy.get('[data-cy="visit-cm2k19ovl0u6xvx8aew6fmuqi"][data-visit-name="AutomationSDE"]').click()
    //Check Pending Snippet-1   
//cy.get('[data-cy="question-card-cm2k0248a0u2lvx8ab8qskgk9"] > [data-cy="question-card"]').contains("SDE basic questions : Code Status").click()
//cy.wait(20000)
//cy.get('[class="question-card-action-menu-icon icon-dettach"]').eq(0).click({ force: true })
//cy.wait(20000)
//Check Pending Snippet-2    
cy.get('[data-cy="question-card-cm2k034w30u2uvx8arcfess1p"] > [data-cy="question-card"]').contains("SDE basic questions : Gender").click() 
cy.wait(20000)
cy.get('[class="question-card-action-menu-icon icon-dettach"]').eq(1).click({ force: true })
cy.wait(20000)
cy.get('[data-cy="right-chip-text-Gender"]').click()
cy.get('[data-cy="non-streamline-save-snippet"]').click()
//cy.get('[data-cy="right-chip-Height"]').click()
//cy.get('[data-cy="non-streamline-save-snippet"]').click()
cy.get('[data-cy="submit-bottom-chips-menu"]').click()
cy.get('[data-cy="done-snippet-button"] > .Text__StyledText-fcSGOX').click()

});

it("Login to the Portal and login as Snippet Assessment", () => {
    cy.AkyrianSDELogin_3(email,password)
     //Search study    
     cy.get("#study-version").contains('v.4.b').click()
     cy.wait(1000)
     cy.get('[class="Text__StyledText-fcSGOX gSpvOG sider-patient-name"]').contains("QA_AU-03").click() 
     //click visit     
    cy.get('[data-cy="visit-cm2k19ovl0u6xvx8aew6fmuqi"][data-visit-name="AutomationSDE"]').click()
      //Check Review Snippet
      cy.get('[data-cy="question-cm2k034w30u2uvx8arcfess1p"]').contains("SDE basic questions : Gender").click()
    cy.wait(20000)
    cy.get("[data-cy='review-sc-snippet-action-cm2k034w30u2uvx8arcfess1p'] > .question-card-action-menu-icon").eq(0).click({ force: true })
    cy.wait(20000)
    cy.get('[data-cy="button-approve-sa"]').click()
    
    //Click Review Tab
    cy.get('[data-cy="MARK_UP_ACCEPTED"]').click()
    cy.get('[data-cy="question-cm2k034w30u2uvx8arcfess1p"]').contains("SDE basic questions : Gender")


})  
it("Login to the Portal and login as Data Entry A", () => {
    cy.AkyrianSDELogin_4(email,password)
     //Search study   
      cy.get("#study-version").contains('v.4.b').click()
      cy.wait(1000)
      cy.get('[class="Text__StyledText-fcSGOX gSpvOG sider-patient-name"]').contains("QA_AU-03").click()
//click visit 
cy.get('[data-cy="visit-cm2k19ovl0u6xvx8aew6fmuqi"][data-visit-name="AutomationSDE"]').click()
       //Check Data Entry
    cy.get('[data-cy="question-card-cm2k034w30u2uvx8arcfess1p"] > [data-cy="question-card"]').contains("SDE basic questions : Gender").click()
    cy.wait(20000)
    cy.get('[data-cy="data-entry-action"]').click({ force: true })
    cy.wait(20000)
    cy.get('[data-cy="answer-input-field-cm2k034td00bt0u5m79prdvxk-0-0"]').click()
    cy.get('[class="ant-select-item-option-content"]').contains("Male").click()
    cy.get('[data-cy="submit-data-entry"]').click()
    
    //Click Review Tab
    cy.get('[data-cy="MARK_UP_ACCEPTED"]').click()
    cy.get('[data-cy="question-card-cm2k034w30u2uvx8arcfess1p"] > [data-cy="question-card"]').contains("SDE basic questions : Gender")


})  
}) 