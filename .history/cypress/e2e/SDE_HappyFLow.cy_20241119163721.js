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
describe('Akyrian SDE Happy FLow ',()=> {

it("Login to the Portal and login as Source Capture user", () => {
cy.viewport(1280, 720)
cy.waitForPageLoad()
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
cy.get('[class="Text__StyledText-fcSGOX gSpvOG sider-patient-name"]', { timeout: 10000 }).contains("QA_AU-04").click()

//Click Visit and 
cy.get('[data-cy="visit-cm3hbwbcu1oydigpb1zmetr4c"][data-visit-name="AUTOMATION-sign-CRF"]', { timeout: 30000 }).click()
//Click SDE Tab
cy.get('[data-cy="sourceQuestionTab"]', { timeout: 30000 }).click()

//Question 1-Check Image upload
 cy.get('[data-cy="question-card-cm2n696qj08n8zdk3hgiru340"] > [data-cy="question-card"]', { timeout: 50000 }).click()
cy.get('[data-cy="open-modal-capture"]:visible', { timeout: 40000 }).first().click({force: true} )
cy.get('[data-cy="upload-sc-button"]', { timeout: 10000 }).click()
const filepath = 'AUTOMATION - without name.png'; 
// Path to your PNG file
cy.get('input[type="file"]', { timeout: 30000 }).attachFile(filepath);
//If we upload not available patient name it shows as patient name as Notfound
cy.get('[class="Text__StyledText-fcSGOX kZdsfX mb-3"]', { timeout: 30000 }).contains("Verification Result")
// Check that the patient name is "Not Found"
cy.get('[data-cy="not-found-data-patientsName"]', { timeout: 30000 }).should('have.text', ': Not Found');
// Check that the date of birth is marked as "Verified"
cy.get('[data-cy="verified-data-dateOfBirth"]', { timeout: 30000 }).should('have.text', ': Verified');
// Check that the visit date is marked as "Verified"
cy.get('[data-cy="verified-data-visitDate"]').should('have.text', ': Verified');
//Click Submit
cy.get('[data-cy="manual-redact-button"]', { timeout: 30000 }).scrollIntoView() 
cy.get('[data-cy="manual-redact-button"]').click()
cy.get('[data-cy="continue-to-suggestion-button"]', { timeout: 10000 }).click()
cy.get('[data-cy="confirm-redact-button"]', { timeout: 30000 }).click()
cy.get('[data-cy="right-chip-Allergies-AT"]', { timeout: 10000 }).click()
cy.get('[data-cy="submit-bottom-chips-menu"]', { timeout: 50000 }).click()
cy.wait(10000)
//Question 2-Check Image upload
cy.get('[data-cy="UNATTACHED"]', { timeout: 50000 }).click()
cy.get('[data-cy="question-card-cm2n69vn408nhzdk3qzqxsxnv"] > [data-cy="question-card"]', { timeout: 10000 }).click()
cy.get('[data-cy="open-modal-capture"]:visible', { timeout: 10000 }).first().click({force: true} )
cy.get('[data-cy="upload-sc-button"]', { timeout: 10000 }).click()
const filepath2 = 'AUTOMATION without DOB.png'; // Path to your PNG file
cy.get('input[type="file"]', { timeout: 40000 }).attachFile(filepath2);
//If we upload not available DOB  it shows as DOB as Notfound
cy.get('[class="Text__StyledText-fcSGOX kZdsfX mb-3"]', { timeout: 40000 }).contains("Verification Result")
 // Check that the DOB is "Not Found"
 cy.get('[data-cy="not-found-data-dateOfBirth"]', { timeout: 40000 }).should('have.text', ': Not Found');
 // Check that the patientsName is marked as "Verified"
 cy.get('[data-cy="verified-data-patientsName"]', { timeout: 40000 }).should('have.text', ': Verified');
 // Check that the Visit Name is marked as "Verified"
 cy.get('[data-cy="verified-data-visitDate"]', { timeout: 40000 }).should('have.text', ': Verified');
//Click Submit
cy.get('[data-cy="manual-redact-button"]', { timeout: 30000 }).scrollIntoView() 
cy.get('[data-cy="manual-redact-button"]', { timeout: 30000 }).click()
cy.get('[data-cy="continue-to-suggestion-button"]', { timeout: 10000 }).click()
cy.get('[data-cy="confirm-redact-button"]', { timeout: 40000 }).click()
cy.get('[data-cy="right-chip-BloodPressureAT"]', { timeout: 10000 }).click()

cy.get('[data-cy="submit-bottom-chips-menu"]', { timeout: 10000 }).click()
//Question 3-Check Image upload
cy.get('[data-cy="UNATTACHED"]', { timeout: 10000 }).click()
cy.get('[data-cy="question-card-cm2n6fno508ntzdk3qjay0ip3"] > [data-cy="question-card"]', { timeout: 10000 }).click()

cy.get('[data-cy="open-modal-capture"]:visible', { timeout: 40000 }).first().click({force: true} )
cy.get('[data-cy="upload-sc-button"]', { timeout: 10000 }).click()
const filepath3 = 'AUTOMATION visit date not match.png'; // Path to your PNG file
cy.get('input[type="file"]').attachFile(filepath3);
cy.wait(40000)
//If we upload not matching visit date it shows as visitDate  as Notfound
cy.get('[class="Text__StyledText-fcSGOX kZdsfX mb-3"]', { timeout: 40000 }).contains("Verification Result")
 // Check that the visitDate is "Not Found"
 cy.get('[data-cy="not-found-data-visitDate"]', { timeout: 40000 }).should('have.text', ': Not Found');
 // Check that the patientsName is marked as "Verified"
 cy.get('[data-cy="verified-data-patientsName"]', { timeout: 40000 }).should('have.text', ': Verified');
 // Check that the dateOfBirth is marked as "Verified"
 cy.get('[data-cy="verified-data-dateOfBirth"]', { timeout: 40000 }).should('have.text', ': Verified');
//Click Submit
cy.get('[data-cy="manual-redact-button"]', { timeout: 10000 }).scrollIntoView() 
cy.get('[data-cy="manual-redact-button"]').click()
cy.get('[data-cy="continue-to-suggestion-button"]', { timeout: 10000 }).click()
cy.get('[data-cy="confirm-redact-button"]', { timeout: 10000 }).click()
cy.get('[data-cy="right-chip-AgeAT"]', { timeout: 10000 }).click()

cy.get('[data-cy="submit-bottom-chips-menu"]', { timeout: 10000 }).click()
cy.wait(40000)
//Question 4-Check Image upload

cy.get('[data-cy="UNATTACHED"]', { timeout: 10000 }).click()
cy.get('[data-cy="question-card-cm2n6j4ki08p8zdk3d4xchxo9"] > [data-cy="question-card"]', { timeout: 40000 }).click()

cy.get('[data-cy="open-modal-capture"]:visible' ,{ timeout: 40000 }).first().click({force: true} )
cy.get('[data-cy="upload-sc-button"]').click()
const filepath4 = 'AUTOMATION.png'; 
// Path to your PNG file
cy.get('input[type="file"]').attachFile(filepath4);
cy.wait(30000)
//If we upload all matching image it does not shows as Verification results
cy.get('[data-cy="continue-to-suggestion-button"]', { timeout: 10000 }).click()
cy.get('[data-cy="confirm-redact-button"]', { timeout: 30000 }).click()
cy.get('[data-cy="right-chip-DateofServiceAT"]', { timeout: 10000 }).click()
cy.get('[data-cy="submit-bottom-chips-menu"]', { timeout: 40000 }).click()

//Click Attached Tab And check Unverified' Label
cy.get('[data-cy="ATTACHED"]', { timeout:40000 }).click()
cy.get('[data-cy="question-card-cm2n696qj08n8zdk3hgiru340"]').contains('CRF: Allergies-AT')
cy.get("[data-cy='question-cm2n696qj08n8zdk3hgiru340'] .kfcSTu").contains('Unverified')

cy.get('[data-cy="question-card-cm2n69vn408nhzdk3qzqxsxnv"]').contains('CRF: Blood Pressure AT')
cy.get("[data-cy='question-cm2n69vn408nhzdk3qzqxsxnv'] .kfcSTu").contains('Unverified')

cy.get('[data-cy="question-card-cm2n6fno508ntzdk3qjay0ip3"]').contains('CRF: Age AT')
cy.get("[data-cy='question-cm2n6fno508ntzdk3qjay0ip3'] .kfcSTu").contains('Unverified')

//Click Change Attachment -1
cy.wait(20000)
cy.get('[data-cy="question-card-cm2n696qj08n8zdk3hgiru340"] > [data-cy="question-card"]').first().click()
cy.get('[data-cy="reattach-action"]', { timeout: 40000 }).first().click({force: true})
cy.get('[data-cy="attach-reattach-reason"] > .ant-select > .ant-select-selector', { timeout:20000 }).click()
cy.get("[label='Source Capture - Detach and Change Attachment'] > .ant-select-item-option-content", { timeout: 20000 }).click()
cy.get("[data-cy='reattach']", { timeout: 10000 }).click()
cy.get('[data-cy="upload-sc-button"]').click()
  const filepath5 = 'AUTOMATION.png'; 
  // Path to your PNG file
  cy.get('input[type="file"]', { timeout: 10000 }).attachFile(filepath5);
  cy.wait(20000)
//If we upload all matching image it does not shows as Verification results
cy.get('[data-cy="continue-to-suggestion-button"]', { timeout: 10000 }).click()
cy.get('[data-cy="confirm-redact-button"]', { timeout: 30000 }).click()
cy.get('[data-cy="right-chip-Allergies-AT"]', { timeout: 30000 }).click()
cy.get('[data-cy="submit-bottom-chips-menu"]', { timeout: 20000 }).click()

//Click Change Attachment -2
cy.get("[data-cy='reattach-action-cm2n69vn408nhzdk3qzqxsxnv'] > .question-card-action-menu-icon").click({force: true})
cy.get('[data-cy="attach-reattach-reason"] > .ant-select > .ant-select-selector', { timeout: 20000 }).click()
cy.get("[label='Source Capture - Detach and Change Attachment'] > .ant-select-item-option-content", { timeout: 10000 }).click()

cy.get("[data-cy='reattach']", { timeout: 10000 }).click()
cy.get('[data-cy="upload-sc-button"]').click()
    const filepath6 = 'AUTOMATION.png'; 
    // Path to your PNG file
    cy.get('input[type="file"]').attachFile(filepath6);
    cy.wait(40000)
    //If we upload all matching image it does not shows as Verification results
cy.get('[data-cy="continue-to-suggestion-button"]', { timeout: 10000 }).click()
cy.get('[data-cy="confirm-redact-button"]', { timeout:30000 }).click()
//cy.get('[data-cy="right-chip-Allergies-AT"]').click()
cy.get('[data-cy="right-chip-BloodPressureAT"]').click()

cy.get('[data-cy="submit-bottom-chips-menu"]', { timeout: 20000 }).click()
//Click Change Attachment-3

cy.get("[data-cy='reattach-action-cm2n6fno508ntzdk3qjay0ip3'] > .question-card-action-menu-icon", { timeout: 30000 }).click({force: true})
cy.get('[data-cy="attach-reattach-reason"] > .ant-select > .ant-select-selector').click()
cy.get("[label='Source Capture - Detach and Change Attachment'] > .ant-select-item-option-content", { timeout: 30000 }).click()
cy.get("[data-cy='reattach']", { timeout: 10000 }).click()
cy.get('[data-cy="upload-sc-button"]').click()
    const filepath7 = 'AUTOMATION.png'; 
    // Path to your PNG file
    cy.get('input[type="file"]').attachFile(filepath7);
    cy.wait(40000)
    //If we upload all matching image it does not shows as Verification results
cy.get('[data-cy="continue-to-suggestion-button"]', { timeout: 10000 }).click()
cy.get('[data-cy="confirm-redact-button"]', { timeout: 30000 }).click()
//cy.get('[data-cy="right-chip-Allergies-AT"]').click()
cy.get('[data-cy="right-chip-AgeAT"]').click()
cy.get('[data-cy="submit-bottom-chips-menu"]', { timeout: 30000 }).click()

//Click Attached Tab
cy.get('[data-cy="ATTACHED"]').click()
cy.wait(20000)

//question status 'unverified' label should not be show on question card
cy.get('[data-cy="question-card-cm2n696qj08n8zdk3hgiru340"]').contains('CRF: Allergies-AT').should('not.contain', 'Unverified')


cy.get('[data-cy="question-card-cm2n69vn408nhzdk3qzqxsxnv"]').contains('CRF: Blood Pressure AT').should('not.contain', 'Unverified')
/cy.get('[data-cy="question-card-cm2n6fno508ntzdk3qjay0ip3"]', { timeout: 10000 }).contains('CRF: Age AT').should('not.contain', 'Unverified')
cy.get('[data-cy="question-card-cm2n6j4ki08p8zdk3d4xchxo9"]').contains('CRF: Date of Service AT').should('not.contain', 'Unverified')
//Click Logout
cy.get('[class="anticon anticon-down DownOutlined__Root-knxRmY jZCmAT img-icon img-right"]').click()
cy.get('[data-cy="logout-text"]').click()

})
it("Login to the Portal and login as Source Markup user", () => {
  cy.viewport(1280, 720)
  cy.visit("https://qa.akyrian.com/"),
   
  cy.get('#email').focus()
  cy.get('#email').type("sourcemarkup@example.com")
  cy.get('#password').focus()
  cy.get('#password').type("Password!1", { log: false })
  cy.get('#loginAs-btn').click()
  cy.wait(4000)
  //Search study
cy.get('[data-cy="onboarding-search-study"]', { timeout: 10000 }).type("QAonCloud Test")   
 cy.get('[class="Text__StyledText-fcSGOX liUSLx adjust-version mb-0.5"]').contains("v.4.b").click()
cy.get('[class="Text__StyledText-fcSGOX gSpvOG sider-patient-name"]', { timeout: 10000 }).contains("QA_AU-04").click()
//Click Visit 

cy.get('[data-cy="visit-cm3hbwbcu1oydigpb1zmetr4c"][data-visit-name="AUTOMATION-sign-CRF"]', { timeout: 40000 }).click()
//click visit   
cy.get('[data-cy="question-card-cm2n696qj08n8zdk3hgiru340"]').contains('CRF: Allergies-AT').should('not.contain', 'Unverified')
cy.get('[data-cy="question-card-cm2n69vn408nhzdk3qzqxsxnv"]').contains('CRF: Blood Pressure AT').should('not.contain', 'Unverified')
cy.get('[data-cy="question-card-cm2n6fno508ntzdk3qjay0ip3"]').contains('CRF: Age AT').should('not.contain', 'Unverified')
cy.get('[data-cy="question-card-cm2n6j4ki08p8zdk3d4xchxo9"]', { timeout: 10000 }).contains('CRF: Date of Service AT').should('not.contain', 'Unverified')
//Check Pending Snippet-1   
cy.get('[data-cy="question-card-cm2n696qj08n8zdk3hgiru340"] > [data-cy="question-card"]').contains("CRF: Allergies-AT").click()
cy.get('[class="question-card-action-menu-icon icon-dettach"]', { timeout: 20000 }).first().click({ force: true })
cy.get('[data-cy="right-chip-Allergies-AT"]', { timeout: 10000 }).click()
cy.get('[data-cy="streamline-dropdown-data-entry-question"] > .ant-select-selector > .ant-select-selection-item')
  .should('have.attr', 'title', 'Allergies-AT')
cy.get('[data-cy="non-streamline-save-snippet"]', { timeout: 20000 }).click()
cy.get('.ant-row.mt-16.pl-4').find('[data-cy="bottom-chip-Allergies-AT"]').should('exist')
//Click Submit
cy.get('[data-cy="submit-bottom-chips-menu"]').click()
cy.get('[data-cy="done-snippet-button"] > .Text__StyledText-fcSGOX', { timeout: 10000 }).click()
cy.wait(10000)

//Check Pending Snippet-2   
cy.get('[data-cy="question-card-cm2n69vn408nhzdk3qzqxsxnv"] > [data-cy="question-card"]', { timeout: 10000 }).contains("CRF: Blood Pressure AT").click() 
cy.get('[class="question-card-action-menu-icon icon-dettach"]', { timeout: 30000 }).first().click({ force: true })
cy.get('[data-cy="right-chip-BloodPressureAT"]', { timeout: 10000 }).click()
cy.get('[data-cy="streamline-dropdown-data-entry-question"] > .ant-select-selector > .ant-select-selection-item')
  .should('have.attr', 'title', 'Blood Pressure AT')
cy.get('[data-cy="non-streamline-save-snippet"]').click()
cy.get('.ant-row.mt-16.pl-4').find('[data-cy="bottom-chip-BloodPressureAT"]').should('exist')
cy.get('[data-cy="submit-bottom-chips-menu"]').click()
cy.get('[data-cy="done-snippet-button"] > .Text__StyledText-fcSGOX').click()

//Check Pending Snippet-3  
cy.get('[data-cy="question-card-cm2n6fno508ntzdk3qjay0ip3"] > [data-cy="question-card"]', { timeout: 10000 }).contains("CRF: Age AT").click() 
cy.get('[class="question-card-action-menu-icon icon-dettach"]', { timeout: 10000 }).first().click({ force: true })
cy.get('[data-cy="right-chip-AgeAT"]', { timeout: 10000 }).click()
cy.get('[data-cy="streamline-dropdown-data-entry-question"] > .ant-select-selector > .ant-select-selection-item')
  .should('have.attr', 'title', 'Age AT')
cy.get('[data-cy="non-streamline-save-snippet"]').click()
cy.get('.ant-row.mt-16.pl-4').find('[data-cy="bottom-chip-AgeAT"]').should('exist')
cy.get('[data-cy="submit-bottom-chips-menu"]').click()
cy.get('[data-cy="done-snippet-button"] > .Text__StyledText-fcSGOX').click()

//Check Pending Snippet-4  
cy.get('[data-cy="question-card-cm2n6j4ki08p8zdk3d4xchxo9"] > [data-cy="question-card"]', { timeout: 10000 }).contains("CRF: Date of Service AT").click() 
cy.get('[class="question-card-action-menu-icon icon-dettach"]', { timeout: 10000 }).first().click({ force: true })
cy.get('[data-cy="right-chip-DateofServiceAT"]', { timeout: 10000 }).click()
cy.get('[data-cy="streamline-dropdown-data-entry-question"] > .ant-select-selector > .ant-select-selection-item')
  .should('have.attr', 'title', ' Date of Service AT')
cy.get('[data-cy="non-streamline-save-snippet"]').click()
cy.get('.ant-row.mt-16.pl-4').find('[data-cy="bottom-chip-DateofServiceAT"]').should('exist')
cy.get('[data-cy="submit-bottom-chips-menu"]').click()
cy.get('[data-cy="done-snippet-button"] > .Text__StyledText-fcSGOX').click()

//Check Snippet Complete Tab
cy.get('[data-cy="MARKED_UP"]').click()
cy.get('[data-cy="question-card-cm2n696qj08n8zdk3hgiru340"]').contains('CRF: Allergies-AT')
cy.get('[data-cy="question-card-cm2n69vn408nhzdk3qzqxsxnv"]').contains('CRF: Blood Pressure AT')
cy.get('[data-cy="question-card-cm2n6fno508ntzdk3qjay0ip3"]').contains('CRF: Age AT')
//cy.get('[data-cy="question-card-cm2n6j4ki08p8zdk3d4xchxo9"]').contains('CRF: Date of Service AT')
//Click Logout
cy.get('[class="anticon anticon-down DownOutlined__Root-knxRmY jZCmAT img-icon img-right"]').click()
cy.get('[data-cy="logout-text"]', { timeout: 10000 }).click()
cy.wait(50000)

})


it("Login to the Portal and login as Snippet Assessment", () => {
  cy.viewport(1280, 720)
  cy.visit("https://qa.akyrian.com/"),
   
  cy.get('#email').focus()
  cy.get('#email').type("snippetassessment@example.com")
  cy.get('#password').focus()
  cy.get('#password').type("Password!1", { log: false })
  cy.get('#loginAs-btn').click()
  cy.wait(4000)
  //Search study    
cy.get('[data-cy="onboarding-search-study"]').type("QAonCloud Test")   
cy.get('[class="Text__StyledText-fcSGOX liUSLx adjust-version mb-0.5"]', { timeout: 5000 }).contains("v.4.b").click()
cy.get('[class="Text__StyledText-fcSGOX gSpvOG sider-patient-name"]', { timeout: 5000 }).contains("QA_AU-04").click()
//Click Visit
cy.get('[data-cy="visit-cm3hbwbcu1oydigpb1zmetr4c"][data-visit-name="AUTOMATION-sign-CRF"]', { timeout: 10000 }).click()

 //Check Review Snippet-1
cy.get('[data-cy="question-card-cm2n696qj08n8zdk3hgiru340"] > [data-cy="question-card"]', { timeout: 5000 }).contains("CRF: Allergies-AT").click() 
cy.get('[data-cy="review-sc-snippet-action-cm2n696qj08n8zdk3hgiru340"] > .question-card-action-menu-icon', { timeout: 10000 }).first().click({ force: true })
cy.get('[data-cy="canvas-container"] > .BaseCanvas__CanvasWrapper-bQdpLq > :nth-child(1) > .konvajs-content > canvas', { timeout: 10000 }).screenshot('Allergies')
cy.get('[data-cy="button-approve-sa"]', { timeout: 10000 }).click()
//Click Close 
cy.get('[data-cy="carousel-close"]', { timeout: 10000 }).click()

//Check Review Snippet-2
cy.get('[data-cy="question-card-cm2n69vn408nhzdk3qzqxsxnv"] > [data-cy="question-card"]', { timeout: 5000 }).contains("CRF: Blood Pressure AT").click() 
cy.get('[data-cy="review-sc-snippet-action-cm2n69vn408nhzdk3qzqxsxnv"] > .question-card-action-menu-icon', { timeout: 10000 }).first().click({ force: true })
cy.get('[data-cy="canvas-container"] > .BaseCanvas__CanvasWrapper-bQdpLq > :nth-child(1) > .konvajs-content > canvas', { timeout: 5000 }).screenshot('Blood')
cy.get('[data-cy="button-approve-sa"]', { timeout: 10000 }).click()
//Click Close 
cy.get('[data-cy="carousel-close"]', { timeout: 10000 }).click()
//Check Review Snippet-3
cy.get('[data-cy="question-card-cm2n6fno508ntzdk3qjay0ip3"] > [data-cy="question-card"]', { timeout: 10000 }).contains("CRF: Age AT").click() 
cy.get("[data-cy='review-sc-snippet-action-cm2n6fno508ntzdk3qjay0ip3'] > .question-card-action-menu-icon", { timeout: 5000 }).first().click({ force: true })
cy.get('[data-cy="canvas-container"] > .BaseCanvas__CanvasWrapper-bQdpLq > :nth-child(1) > .konvajs-content > canvas', { timeout: 5000 }).screenshot('year')
cy.get('[data-cy="button-approve-sa"]', { timeout: 10000 }).click()
 //Click Close 
 cy.get('[data-cy="carousel-close"]', { timeout:30000 }).click()
//Check Review Snippet-4
  //cy.get('[data-cy="question-card-cm2n6j4ki08p8zdk3d4xchxo9"] > [data-cy="question-card"]').contains("CRF:  Date of Service AT").click() 
  cy.get("[data-cy='review-sc-snippet-action-cm2n6j4ki08p8zdk3d4xchxo9'] > .question-card-action-menu-icon", { timeout: 5000 }).first().click({ force: true })
  cy.get('[data-cy="canvas-container"] > .BaseCanvas__CanvasWrapper-bQdpLq > :nth-child(1) > .konvajs-content > canvas', { timeout: 5000 }).screenshot('Date')

  cy.get('[data-cy="button-approve-sa"]',{ timeout:30000 }).click()
  //cy.get('[data-cy="carousel-close"]').click()


    //Click Review Tab
cy.get('[data-cy="MARK_UP_ACCEPTED"]').click({force: true})
cy.get('[data-cy="question-card-cm2n696qj08n8zdk3hgiru340"] > [data-cy="question-card"]').contains("CRF: Allergies-AT").click() 
cy.get('[data-cy="question-card-cm2n69vn408nhzdk3qzqxsxnv"] > [data-cy="question-card"]').contains("CRF: Blood Pressure AT").click() 
cy.get('[data-cy="question-card-cm2n6fno508ntzdk3qjay0ip3"] > [data-cy="question-card"]').contains("CRF: Age AT").click() 
    //cy.get('[data-cy="question-card-cm2n6j4ki08p8zdk3d4xchxo9"] > [data-cy="question-card"]').contains("CRF: Date of Service AT").click() 

//Click Logout
cy.get('[class="anticon anticon-down DownOutlined__Root-knxRmY jZCmAT img-icon img-right"]').click()
cy.get('[data-cy="logout-text"]').click()
cy.wait(50000)

  }) 

  it("Login to the Portal and login as Data Entry A", () => {
    cy.viewport(1280, 720)
    cy.visit("https://qa.akyrian.com/"),
     
    cy.get('#email').focus()
    cy.get('#email').type("dataentrya@example.com")
    cy.get('#password').focus()
    cy.get('#password').type("Password!1", { log: false })
    cy.get('#loginAs-btn').click()
    cy.wait(4000)
         //Search study   
     cy.get('[data-cy="onboarding-search-study"]').type("QAonCloud Test")   
     cy.get('[class="Text__StyledText-fcSGOX liUSLx adjust-version mb-0.5"]').contains("v.4.b").click()
     cy.get('[class="Text__StyledText-fcSGOX gSpvOG sider-patient-name"]').contains("QA_AU-04",{ timeout:30000 }).click()
     //Click Visit
     cy.get('[data-cy="visit-cm3hbwbcu1oydigpb1zmetr4c"][data-visit-name="AUTOMATION-sign-CRF"]',{ timeout:30000 }).click()
//Check Data Entry-Allergies-AT
    cy.get('[data-cy="question-card-cm2n696qj08n8zdk3hgiru340"] > [data-cy="question-card"]',{ timeout:30000 }).contains("CRF: Allergies-AT").click() 
    cy.get('[data-cy="data-entry-action"]',{ timeout:30000 }).first().click({ force: true })
    cy.get('[data-cy="answer-input-field-cm2n696mo00000t5m8a76d1vb-0-0"]',{ timeout:30000 }).first().type("allergen")
    cy.get('.slick-active > :nth-child(1) > [data-cy="modal-container"] > [data-cy="carousel-container"] > [data-cy="content-outer-container"] > [data-cy="monitor-flow-body"] > [data-cy="data-entry-container"] > [data-cy="data-entry-input-container"] > [data-cy="question-input-container"] > :nth-child(2) > .mt-60 > div > [data-cy="submit-data-entry"]',{ timeout:30000 }).click()
  //Check Data Entry- Blood Pressure
  cy.get('[data-cy="answer-input-field-cm2n69vll00010t5m329c90wf-0-0"]',{ timeout:10000 }).first().click().type("120")
cy.get('.slick-active > :nth-child(1) > [data-cy="modal-container"] > [data-cy="carousel-container"] > [data-cy="content-outer-container"] > [data-cy="monitor-flow-body"] > [data-cy="data-entry-container"] > [data-cy="data-entry-input-container"] > [data-cy="question-input-container"] > :nth-child(2) > .mt-60 > div > [data-cy="submit-data-entry"]',{ timeout:30000 }).click()
//Check Data Entry- Age AT
     cy.get('.slick-active > :nth-child(1) > [data-cy="modal-container"] > [data-cy="carousel-container"] > [data-cy="content-outer-container"] > [data-cy="monitor-flow-body"] > [data-cy="data-entry-container"] > [data-cy="data-entry-input-container"] > [data-cy="question-input-container"] > .pb-20 > .flex > .ant-row > [style="padding-left: 2.5px; padding-right: 2.5px;"] > .FloatingLabel__FloatingLabelContainer-cQJLhj > [data-cy="textfield-container-answer-input-field-cm2n6fnm300020t5mh6lfgqmv-0-0"] > [data-cy="select-container"] > [data-cy="answer-input-field-cm2n6fnm300020t5mh6lfgqmv-0-0"] > .ant-select-selector',{ timeout:30000 }).click({force: true})
  cy.get('[class="ant-select-item ant-select-item-option"][title="50 - 70"]',{ timeout:10000 }).click();
  cy.get('.slick-active > :nth-child(1) > [data-cy="modal-container"] > [data-cy="carousel-container"] > [data-cy="content-outer-container"] > [data-cy="monitor-flow-body"] > [data-cy="data-entry-container"] > [data-cy="data-entry-input-container"] > [data-cy="question-input-container"] > :nth-child(2) > .mt-60 > div > [data-cy="submit-data-entry"]',{ timeout:30000 }).click()

//Check Data Entry- Date of Service
cy.get('[data-cy="data-entry-action"]').first().click({ force: true })
cy.get('.slick-active > :nth-child(1) > [data-cy="modal-container"] > [data-cy="carousel-container"] > [data-cy="content-outer-container"] > [data-cy="monitor-flow-body"] > [data-cy="data-entry-container"] > [data-cy="data-entry-input-container"] > [data-cy="question-input-container"] > .pb-20 > .flex > .ant-row > .ant-col > :nth-child(1) > .styles__CustomDateInputContainer-WEJQy > .styles__DatepickerContainer-dXEavp > .ant-picker > .ant-picker-input',{ timeout:30000 }).click({force: true})
cy.get('[title="2024-11-30"] > .ant-picker-cell-inner', { timeout: 10000 }).click()
cy.get('.slick-active > :nth-child(1) > [data-cy="modal-container"] > [data-cy="carousel-container"] > [data-cy="content-outer-container"] > [data-cy="monitor-flow-body"] > [data-cy="data-entry-container"] > [data-cy="data-entry-input-container"] > [data-cy="question-input-container"] > :nth-child(2) > .mt-60 > div > [data-cy="submit-data-entry"]').click({ force: true })
//Click Review Tab
cy.get('[data-cy="FILLED_PARTIAL"]',{ timeout:30000 }).click()
cy.get('[data-cy="question-card-cm2n6fno508ntzdk3qjay0ip3"] > [data-cy="question-card"]').contains("CRF: Age AT")
// cy.get('[data-cy="question-card-cm2n6j4ki08p8zdk3d4xchxo9"] > [data-cy="question-card"]').contains("CRF: Date of Service AT")
//Click Logout
cy.get('[class="anticon anticon-down DownOutlined__Root-knxRmY jZCmAT img-icon img-right"]').click()
cy.get('[data-cy="logout-text"]').click()
cy.wait(50000)

}) 
it("Login to the Portal and login as Data Entry B", () => {
    cy.wait(40000)
    cy.viewport(1280, 720)
    cy.visit("https://qa.akyrian.com/"),
     
    cy.get('#email').focus()
    cy.get('#email').type("dataentryb@example.com")
    cy.get('#password').focus()
    cy.get('#password').type("Password!1", { log: false })
    cy.get('#loginAs-btn').click()
    cy.wait(4000)

     //Search study   
      //Search study    
     cy.get('[data-cy="onboarding-search-study"]',{ timeout:40000 }).type("QAonCloud Test")   
     cy.get('[class="Text__StyledText-fcSGOX liUSLx adjust-version mb-0.5"]').contains("v.4.b").click()
     cy.get('[class="Text__StyledText-fcSGOX gSpvOG sider-patient-name"]').contains("QA_AU-04").click()
     //Click Visit
     cy.get('[data-cy="visit-cm3hbwbcu1oydigpb1zmetr4c"][data-visit-name="AUTOMATION-sign-CRF"]',{ timeout:30000 }).click()
    
   //Check Data Entry 2- Age AT
     cy.get('[data-cy="question-card-cm2n6fno508ntzdk3qjay0ip3"] > [data-cy="question-card"]',{ timeout:10000 }).contains("CRF: Age AT").click() 
     cy.get('[data-cy="data-entry-action"]',{ timeout:30000 }).first().click({ force: true })
     cy.get('[class="ant-select-selection-overflow"]').first().click()
     cy.get('[class="ant-select-item ant-select-item-option"][title="50 - 70"]',{ timeout:30000 }).click();
     cy.get('.slick-active > :nth-child(1) > [data-cy="modal-container"] > [data-cy="carousel-container"] > [data-cy="content-outer-container"] > [data-cy="monitor-flow-body"] > [data-cy="data-entry-container"] > [data-cy="data-entry-input-container"] > [data-cy="question-input-container"] > :nth-child(2) > .mt-60 > div > [data-cy="submit-data-entry"]').click()
    
  //Check Data Entry- Date of Service
  
  cy.get('.slick-active > :nth-child(1) > [data-cy="modal-container"] > [data-cy="carousel-container"] > [data-cy="content-outer-container"] > [data-cy="monitor-flow-body"] > [data-cy="data-entry-container"] > [data-cy="data-entry-input-container"] > [data-cy="question-input-container"] > .pb-20 > .flex > .ant-row > .ant-col > :nth-child(1) > .styles__CustomDateInputContainer-WEJQy > .styles__DatepickerContainer-dXEavp > .ant-picker > .ant-picker-input',{ timeout:30000 }).click()
  cy.get('[class="ant-picker-cell ant-picker-cell-in-view"]', { timeout: 10000 }).contains('24').click()
  cy.get('.slick-active > :nth-child(1) > [data-cy="modal-container"] > [data-cy="carousel-container"] > [data-cy="content-outer-container"] > [data-cy="monitor-flow-body"] > [data-cy="data-entry-container"] > [data-cy="data-entry-input-container"] > [data-cy="question-input-container"] > :nth-child(2) > .mt-60 > div > [data-cy="submit-data-entry"]').click({ force: true })
    //Click Data Entry Tab
  cy.get('[data-cy="FILLED"]').click()
  cy.get('[data-cy="question-card-cm2n6j4ki08p8zdk3d4xchxo9"] > [data-cy="question-card"]').contains("CRF: Date of Service AT")
  //Click Logout
  cy.get('[class="anticon anticon-down DownOutlined__Root-knxRmY jZCmAT img-icon img-right"]').click()
  cy.get('[data-cy="logout-text"]').click()
  cy.wait(50000)

  })
  it("Login to the Portal and login as Verification/Data Adjudicator", () => {
    cy.viewport(1280, 720)
    cy.visit("https://qa.akyrian.com/"),
     
    cy.get('#email').focus()
    cy.get('#email').type("verification@example.com")
    cy.get('#password').focus()
    cy.get('#password').type("Password!1", { log: false })
    cy.get('#loginAs-btn').click()
    cy.wait(4000)
     //Search study   
     cy.get('[data-cy="onboarding-search-study"]',{ timeout:10000 }).type("QAonCloud Test")   
     cy.get('[class="Text__StyledText-fcSGOX liUSLx adjust-version mb-0.5"]').contains("v.4.b").click()
     cy.get('[class="Text__StyledText-fcSGOX gSpvOG sider-patient-name"]').contains("QA_AU-04").click()
     //Click Visit
     cy.get('[data-cy="visit-cm3hbwbcu1oydigpb1zmetr4c"][data-visit-name="AUTOMATION-sign-CRF"]',{ timeout:30000 }).click()
     //Check Data Verify- CRF: Date of Service AT
  
  cy.get('[data-cy="question-card-cm2n6j4ki08p8zdk3d4xchxo9"] > [data-cy="question-card"]',{ timeout:10000 }).contains("CRF: Date of Service AT").click() 
  cy.get('.question-card-action-menu-icon').eq(1).click({force: true});
  cy.get('[data-cy="first-data-entry-cm2n6j4ki08p8zdk3d4xchxo9"]').click()
  cy.get('[data-cy="accept-data-entry-cm2n6j4ki08p8zdk3d4xchxo9"]',{ timeout:10000 }).click()
  //Click Verification complete Tab
  cy.get('[data-cy="ACCEPTED"]').click()
  cy.get('[data-cy="question-card-cm2n6j4ki08p8zdk3d4xchxo9"] > [data-cy="question-card"]').contains("CRF: Date of Service AT").click() 
  //Click Logout
  cy.get('[class="anticon anticon-down DownOutlined__Root-knxRmY jZCmAT img-icon img-right"]').click()
  cy.get('[data-cy="logout-text"]').click()
  })
  it("Login to the Portal and login as signcrf", () => {
    cy.viewport(1280, 720)
    cy.visit("https://qa.akyrian.com/"),
     
    cy.get('#email').focus()
    cy.get('#email').type("signcrf@example.com")
    cy.get('#password').focus()
    cy.get('#password').type("Password!1", { log: false })
    cy.get('#loginAs-btn').click()
    cy.wait(4000)     //Search study   
     cy.get('[data-cy="onboarding-search-study"]',{ timeout:20000 }).type("QAonCloud Test")   
     cy.get('[class="Text__StyledText-fcSGOX liUSLx adjust-version mb-0.5"]').contains("v.4.b").click()
     cy.get('[class="Text__StyledText-fcSGOX gSpvOG sider-patient-name"]').contains("QA_AU-04").click()
     //Click Visit
     cy.get('[data-cy="visit-cm3hbwbcu1oydigpb1zmetr4c"][data-visit-name="AUTOMATION-sign-CRF"]',{ timeout:30000 }).click()
  
   //Check Sign CRF Screen
  cy.get('[data-cy="sign-level"]',{ timeout:30000 }).contains("Sign AUTOMATION-sign-CRF")
  cy.get('[class="Text__StyledText-fcSGOX dcoJJS"]').contains("I, Sign CRF, the Clinical Trial Investigator certify that I have reviewed the data and can verify that it is accurate and contemporaneous")
  cy.get('[data-cy="input-password"]').should('exist')
  cy.get('[data-cy="btn-sign"]').contains("Sign")
  //Click Logout
  cy.get('[class="anticon anticon-down DownOutlined__Root-knxRmY jZCmAT img-icon img-right"]').click()
  cy.get('[data-cy="logout-text"]').click()
  })
})