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
    cy.AkyrianSDELogin_1(email,password)
    //Search study
cy.get('[data-cy="onboarding-search-study"]').type("QAonCloud Test")   
 cy.get('[class="Text__StyledText-fcSGOX liUSLx adjust-version mb-0.5"]').contains("v.4.b").click()
    cy.get('[class="Text__StyledText-fcSGOX gSpvOG sider-patient-name"]').contains("QA_AU-02").click()
    //Add Visit
   //Check Visit date (year, month,day) dropdowns
  /* cy.get('#add-visit-modal-button').contains("+ Add Visit").click()

cy.get('[data-cy="select-year-addVisit"]').click()
cy.get('[class="ant-select-item-option-content"]').contains("2024").click()

cy.get('[data-cy="select-month-addVisit"]').click()
cy.get('[title="October"]').click()

cy.get('[data-cy="select-date-addVisit"]').click()
cy.get('[class="ant-select-item-option-content"]').contains("").scrollIntoView().click({force: true})

cy.get('#add-visit-select').click()
cy.get('[class="ant-select-item-option-content"]').contains("AUTOMATION-sign-CRF").click()

cy.get('#btn-submit-add-visit').contains("Submit")
cy.get('#btn-cancel-add-visit').contains("Cancel").click()
*/
    //Add Visit and 
    cy.get('[data-cy="visit-cm2ol891a0amjzdk3m1xitkk2"][data-visit-name="AUTOMATION-sign-CRF"]').click()
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
    //Click Yes
cy.get('[data-cy="confirmModal-confirmButton"]').click()
cy.get('#first-name-input-sc-intake').type("Test1")
cy.get('#last-name-input-sc-intake').type("Test2")
//Click Submit
cy.get('[data-cy="submit-sc-intake-button"]').click()
cy.get('[data-cy="manual-redact-button"]').scrollIntoView() 
cy.wait(30000)
cy.get('[data-cy="manual-redact-button"]').click()
cy.get('[data-cy="continue-to-suggestion-button"]').click()
cy.wait(10000)
cy.get('[data-cy="confirm-redact-button"]').click()
cy.wait(10000)
cy.get('[data-cy="right-chip-Allergies-AT"]').click()
cy.get('[data-cy="right-chip-BloodPressureAT"]').click()
cy.get('[data-cy="submit-bottom-chips-menu"]').click()
cy.wait(10000)
cy.get('[data-cy="UNATTACHED"]').click()

//Question 2-Check Image upload
cy.get('[data-cy="question-card-cm2n6fno508ntzdk3qjay0ip3"] > [data-cy="question-card"]').click()

cy.get('[data-cy="open-modal-capture"]:visible').first().click({force: true} )
cy.get('[data-cy="upload-sc-button"]').click()
const filepath2 = 'SCImage.png'; // Path to your PNG file
cy.get('input[type="file"]').attachFile(filepath2);
cy.wait(30000)
cy.get('[data-cy="confirmation-modal-title"]').contains('No Name Found')
//Click Yes
cy.get('[data-cy="confirmModal-confirmButton"]').click()
cy.get('#first-name-input-sc-intake').type("Test1")
cy.get('#last-name-input-sc-intake').type("Test2")
//Click Submit
cy.get('[data-cy="submit-sc-intake-button"]').click()
cy.get('[data-cy="manual-redact-button"]').scrollIntoView() 
cy.wait(30000)
cy.get('[data-cy="manual-redact-button"]').click()
cy.get('[data-cy="continue-to-suggestion-button"]').click()
cy.wait(10000)
cy.get('[data-cy="confirm-redact-button"]').click()
cy.wait(10000)
cy.get('[data-cy="right-chip-AgeAT"]').click()
cy.get('[data-cy="submit-bottom-chips-menu"]').click()
cy.wait(10000)
cy.get('[data-cy="UNATTACHED"]').click()
cy.wait(10000)
//Question 4-Check Image upload
cy.get('[data-cy="question-card-cm2n6j4ki08p8zdk3d4xchxo9"] > [data-cy="question-card"]').click()

cy.get('[data-cy="open-modal-capture"]:visible').first().click({force: true} )
cy.get('[data-cy="upload-sc-button"]').click()
const filepath3 = 'SCImage.png'; 
// Path to your PNG file
cy.get('input[type="file"]').attachFile(filepath3);
cy.wait(30000)
cy.get('[data-cy="confirmation-modal-title"]').contains('No Name Found')
//Click Yes
cy.get('[data-cy="confirmModal-confirmButton"]').click()
cy.get('#first-name-input-sc-intake').type("Test1")
cy.get('#last-name-input-sc-intake').type("Test2")
//Click Submit
cy.get('[data-cy="submit-sc-intake-button"]').click()
cy.get('[data-cy="manual-redact-button"]').scrollIntoView() 
cy.wait(30000)
cy.get('[data-cy="manual-redact-button"]').click()
cy.get('[data-cy="continue-to-suggestion-button"]').click()
cy.wait(10000)
cy.get('[data-cy="confirm-redact-button"]').click()
cy.wait(10000)
cy.get('[data-cy="right-chip-DateofServiceAT"]').click()
cy.get('[data-cy="submit-bottom-chips-menu"]').click()
cy.wait(10000)
//Click Attached Tab
cy.get('[data-cy="ATTACHED"]').click()
cy.get('[data-cy="question-card-cm2n696qj08n8zdk3hgiru340"]').contains('CRF: Allergies-AT')
cy.get('[data-cy="question-card-cm2n69vn408nhzdk3qzqxsxnv"]').contains('CRF: Blood Pressure AT')
cy.get('[data-cy="question-card-cm2n6fno508ntzdk3qjay0ip3"]').contains('CRF: Age AT')
//cy.get('[data-cy="question-card-cm2n6j4ki08p8zdk3d4xchxo9"]').contains('CRF: Date of Service AT')
//Click Logout
cy.get('[class="anticon anticon-down DownOutlined__Root-knxRmY jZCmAT img-icon img-right"]').click()
cy.get('[data-cy="logout-text"]').click()

})

it("Login to the Portal and login as Source Markup user", () => {
     cy.AkyrianSDELogin_2(email,password)
     //Search study  
//Search study
cy.get('[data-cy="onboarding-search-study"]').type("QAonCloud Test")   
 cy.get('[class="Text__StyledText-fcSGOX liUSLx adjust-version mb-0.5"]').contains("v.4.b").click()
 cy.wait(10000)

  cy.get('[class="Text__StyledText-fcSGOX gSpvOG sider-patient-name"]').contains("QA_AU-02").click()
 //click visit   
 cy.wait(10000)
 
 cy.get('[data-cy="visit-cm2ol891a0amjzdk3m1xitkk2"][data-visit-name="AUTOMATION-sign-CRF"]').click()
 //Check Pending Snippet-1   
//cy.get('[data-cy="question-card-cm2k0248a0u2lvx8ab8qskgk9"] > [data-cy="question-card"]').contains("SDE basic questions : Code Status").click()
//cy.wait(20000)
//cy.get('[class="question-card-action-menu-icon icon-dettach"]').eq(0).click({ force: true })
//cy.wait(20000)

//Check Pending Snippet-1    
cy.wait(10000)

cy.get('[data-cy="question-card-cm2n696qj08n8zdk3hgiru340"] > [data-cy="question-card"]').contains("CRF: Allergies-AT").click() 
cy.wait(10000)
cy.get('[class="question-card-action-menu-icon icon-dettach"]').first().click({ force: true })
cy.wait(10000)
cy.get('[data-cy="right-chip-Allergies-AT"]').click()
cy.get('[data-cy="non-streamline-save-snippet"]').click()

cy.get('[data-cy="right-chip-BloodPressureAT"]').click()
cy.get('[data-cy="non-streamline-save-snippet"]').click()
//cy.get('[data-cy="right-chip-Height"]').click()
//cy.get('[data-cy="non-streamline-save-snippet"]').click()
cy.get('[data-cy="submit-bottom-chips-menu"]').click()
cy.get('[data-cy="done-snippet-button"] > .Text__StyledText-fcSGOX').click()

//Check Pending Snippet-2   
cy.get('[data-cy="question-card-cm2n6fno508ntzdk3qjay0ip3"] > [data-cy="question-card"]').contains("CRF: Age AT").click() 
cy.wait(10000)
cy.get('[class="question-card-action-menu-icon icon-dettach"]').first().click({ force: true })
cy.wait(10000)
cy.get('[data-cy="right-chip-AgeAT"]').click()
cy.get('[data-cy="non-streamline-save-snippet"]').click()
//cy.get('[data-cy="right-chip-Height"]').click()
//cy.get('[data-cy="non-streamline-save-snippet"]').click()
cy.get('[data-cy="submit-bottom-chips-menu"]').click()
cy.get('[data-cy="done-snippet-button"] > .Text__StyledText-fcSGOX').click()


//Check Pending Snippet-4  
cy.get('[data-cy="question-card-cm2n6j4ki08p8zdk3d4xchxo9"] > [data-cy="question-card"]').contains("CRF: Date of Service AT").click() 
cy.wait(10000)
cy.get('[class="question-card-action-menu-icon icon-dettach"]').first().click({ force: true })
cy.wait(10000)
cy.get('[data-cy="right-chip-DateofServiceAT"]').click()
cy.get('[data-cy="non-streamline-save-snippet"]').click()
//cy.get('[data-cy="right-chip-Height"]').click()
//cy.get('[data-cy="non-streamline-save-snippet"]').click()
cy.get('[data-cy="submit-bottom-chips-menu"]').click()
cy.get('[data-cy="done-snippet-button"] > .Text__StyledText-fcSGOX').click()

//Check Snippet Complete Tab
cy.get('[data-cy="MARKED_UP"]').click()
cy.get('[data-cy="question-card-cm2n696qj08n8zdk3hgiru340"]').contains('CRF: Allergies-AT')
cy.get('[data-cy="question-card-cm2n69vn408nhzdk3qzqxsxnv"]').contains('CRF: Blood Pressure AT')
cy.get('[data-cy="question-card-cm2n6fno508ntzdk3qjay0ip3"]').contains('CRF: Age AT')
cy.get('[data-cy="question-card-cm2n6j4ki08p8zdk3d4xchxo9"]').contains('CRF: Date of Service AT')
//Click Logout
cy.get('[class="anticon anticon-down DownOutlined__Root-knxRmY jZCmAT img-icon img-right"]').click()
cy.get('[data-cy="logout-text"]').click()
});

it("Login to the Portal and login as Snippet Assessment", () => {
    cy.AkyrianSDELogin_3(email,password)
     //Search study    
     cy.get('[data-cy="onboarding-search-study"]').type("QAonCloud Test")   
 cy.get('[class="Text__StyledText-fcSGOX liUSLx adjust-version mb-0.5"]').contains("v.4.b").click()
    cy.get('[class="Text__StyledText-fcSGOX gSpvOG sider-patient-name"]').contains("QA_AU-02").click()
 //click visit  
 cy.wait(10000)  
 cy.get('[data-cy="visit-cm2ol891a0amjzdk3m1xitkk2"][data-visit-name="AUTOMATION-sign-CRF"]').click()
 cy.wait(20000)

 //Check Review Snippet-1
      cy.get('[data-cy="question-card-cm2n696qj08n8zdk3hgiru340"] > [data-cy="question-card"]').contains("CRF: Allergies-AT").click() 
      cy.wait(10000)
      cy.get('[data-cy="review-sc-snippet-action-cm2n696qj08n8zdk3hgiru340"] > .question-card-action-menu-icon').first().click({ force: true })
      cy.wait(10000)
      cy.get('[data-cy="button-approve-sa"]').click()
      cy.wait(10000)
      //Click Close 
    cy.get('[data-cy="carousel-close"]').click()

  //Check Review Snippet-2
  cy.get('[data-cy="question-card-cm2n6fno508ntzdk3qjay0ip3"] > [data-cy="question-card"]').contains("CRF: Age AT").click() 
  cy.wait(10000)
  cy.get("[data-cy='review-sc-snippet-action-cm2n6fno508ntzdk3qjay0ip3'] > .question-card-action-menu-icon").first().click({ force: true })
cy.wait(10000)
cy.get('[data-cy="button-approve-sa"]').click()
cy.wait(10000)
 //Click Close 
 cy.get('[data-cy="carousel-close"]').click()
  //Check Review Snippet-3
  cy.get('[data-cy="question-card-cm2n69vn408nhzdk3qzqxsxnv"] > [data-cy="question-card"]').contains("CRF: Blood Pressure AT").click() 
  cy.wait(10000)
  cy.get("[data-cy='review-sc-snippet-action-cm2n69vn408nhzdk3qzqxsxnv'] > .question-card-action-menu-icon").first().click({ force: true })
  cy.wait(10000)
  cy.get('[data-cy="button-approve-sa"]').click()
  cy.wait(10000)
  cy.get('[data-cy="carousel-close"]').click()

   //Check Review Snippet-4
   cy.get('[data-cy="question-card-cm2n6j4ki08p8zdk3d4xchxo9"] > [data-cy="question-card"]').contains("CRF: Date of Service AT").click() 
   cy.wait(10000)
   cy.get("[data-cy='review-sc-snippet-action-cm2n6j4ki08p8zdk3d4xchxo9'] > .question-card-action-menu-icon").first().click({ force: true })
   cy.wait(10000)
   cy.get('[data-cy="button-approve-sa"]').click()
   cy.wait(10000)
  //Click Close 
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
  })  
 

it("Login to the Portal and login as Data Entry A", () => {
    cy.AkyrianSDELogin_4(email,password)
     //Search study   
      //Search study    
     cy.get('[data-cy="onboarding-search-study"]').type("QAonCloud Test")   
     cy.get('[class="Text__StyledText-fcSGOX liUSLx adjust-version mb-0.5"]').contains("v.4.b").click()
        cy.get('[class="Text__StyledText-fcSGOX gSpvOG sider-patient-name"]').contains("QA_AU-02").click()
        cy.wait(20000)

     //click visit    
     cy.get('[data-cy="visit-cm2ol891a0amjzdk3m1xitkk2"][data-visit-name="AUTOMATION-sign-CRF"]').click()
     cy.wait(20000)

     //Check Data Entry-Allergies-AT
       cy.get('[data-cy="question-card-cm2n696qj08n8zdk3hgiru340"] > [data-cy="question-card"]').contains("CRF: Allergies-AT").click() 
       cy.wait(10000)
       cy.get('[data-cy="data-entry-action"]').first().click({ force: true })
       cy.wait(10000)
       cy.get('[data-cy="answer-input-field-cm2n696mo00000t5m8a76d1vb-0-0"]').first().type("allergen")
    cy.get('.slick-active > :nth-child(1) > [data-cy="modal-container"] > [data-cy="carousel-container"] > [data-cy="content-outer-container"] > [data-cy="monitor-flow-body"] > [data-cy="data-entry-container"] > [data-cy="data-entry-input-container"] > [data-cy="question-input-container"] > :nth-child(2) > .mt-60 > div > [data-cy="submit-data-entry"]').click()
      
  //Check Data Entry- Blood Pressure
  cy.wait(10000)
  cy.get('[data-cy="answer-input-field-cm2n69vll00010t5m329c90wf-0-0"]').first().click().type("120")
    cy.wait(5000)
    cy.get('.slick-active > :nth-child(1) > [data-cy="modal-container"] > [data-cy="carousel-container"] > [data-cy="content-outer-container"] > [data-cy="monitor-flow-body"] > [data-cy="data-entry-container"] > [data-cy="data-entry-input-container"] > [data-cy="question-input-container"] > :nth-child(2) > .mt-60 > div > [data-cy="submit-data-entry"]').click()

     //Check Data Entry- Age AT
  
     cy.wait(20000)
     cy.get('.slick-active > :nth-child(1) > [data-cy="modal-container"] > [data-cy="carousel-container"] > [data-cy="content-outer-container"] > [data-cy="monitor-flow-body"] > [data-cy="data-entry-container"] > [data-cy="data-entry-input-container"] > [data-cy="question-input-container"] > .pb-20 > .flex > .ant-row > [style="padding-left: 2.5px; padding-right: 2.5px;"] > .FloatingLabel__FloatingLabelContainer-cQJLhj > [data-cy="textfield-container-answer-input-field-cm2n6fnm300020t5mh6lfgqmv-0-0"] > [data-cy="select-container"] > [data-cy="answer-input-field-cm2n6fnm300020t5mh6lfgqmv-0-0"] > .ant-select-selector').click({force: true})
  cy.get('[class="ant-select-item ant-select-item-option"][title="50 - 70"]').click();
  cy.wait(5000)
  cy.get('.slick-active > :nth-child(1) > [data-cy="modal-container"] > [data-cy="carousel-container"] > [data-cy="content-outer-container"] > [data-cy="monitor-flow-body"] > [data-cy="data-entry-container"] > [data-cy="data-entry-input-container"] > [data-cy="question-input-container"] > :nth-child(2) > .mt-60 > div > [data-cy="submit-data-entry"]').click()
  cy.wait(10000)

//Check Data Entry- Date of Service
cy.wait(10000)
cy.get('[data-cy="data-entry-action"]').first().click({ force: true })
cy.get('.slick-active > :nth-child(1) > [data-cy="modal-container"] > [data-cy="carousel-container"] > [data-cy="content-outer-container"] > [data-cy="monitor-flow-body"] > [data-cy="data-entry-container"] > [data-cy="data-entry-input-container"] > [data-cy="question-input-container"] > .pb-20 > .flex > .ant-row > .ant-col > :nth-child(1) > .styles__CustomDateInputContainer-WEJQy > .styles__DatepickerContainer-dXEavp > .ant-picker > .ant-picker-input').click({force: true})
cy.get('[class="ant-picker-cell ant-picker-cell-in-view"]', { timeout: 10000 }).contains('30').click()
cy.get('.slick-active > :nth-child(1) > [data-cy="modal-container"] > [data-cy="carousel-container"] > [data-cy="content-outer-container"] > [data-cy="monitor-flow-body"] > [data-cy="data-entry-container"] > [data-cy="data-entry-input-container"] > [data-cy="question-input-container"] > :nth-child(2) > .mt-60 > div > [data-cy="submit-data-entry"]').click({ force: true })
    //Click Review Tab
    cy.get('[data-cy="FILLED_PARTIAL"]').click()
    cy.get('[data-cy="question-card-cm2n6fno508ntzdk3qjay0ip3"] > [data-cy="question-card"]').contains("CRF: Age AT")
   // cy.get('[data-cy="question-card-cm2n6j4ki08p8zdk3d4xchxo9"] > [data-cy="question-card"]').contains("CRF: Date of Service AT")
//Click Logout
cy.get('[class="anticon anticon-down DownOutlined__Root-knxRmY jZCmAT img-icon img-right"]').click()
cy.get('[data-cy="logout-text"]').click()

})  
it("Login to the Portal and login as Data Entry B", () => {
  cy.AkyrianSDELogin_DataEntryB(email,password)
   //Search study   
    //Search study    
   cy.get('[data-cy="onboarding-search-study"]').type("QAonCloud Test")   
   cy.get('[class="Text__StyledText-fcSGOX liUSLx adjust-version mb-0.5"]').contains("v.4.b").click()
   cy.wait(20000)

      cy.get('[class="Text__StyledText-fcSGOX gSpvOG sider-patient-name"]').contains("QA_AU-02").click()
   //click visit    
   cy.wait(20000)

   cy.get('[data-cy="visit-cm2ol891a0amjzdk3m1xitkk2"][data-visit-name="AUTOMATION-sign-CRF"]').click()
  
 //Check Data Entry- Age AT
   cy.get('[data-cy="question-card-cm2n6fno508ntzdk3qjay0ip3"] > [data-cy="question-card"]').contains("CRF: Age AT").click() 
   cy.wait(10000)
   cy.get('[data-cy="data-entry-action"]').first().click({ force: true })
   cy.wait(10000)
   cy.get('[class="ant-select-selection-overflow"]').first().click()
   cy.get('[class="ant-select-item ant-select-item-option"][title="50 - 70"]').click();
   cy.get('.slick-active > :nth-child(1) > [data-cy="modal-container"] > [data-cy="carousel-container"] > [data-cy="content-outer-container"] > [data-cy="monitor-flow-body"] > [data-cy="data-entry-container"] > [data-cy="data-entry-input-container"] > [data-cy="question-input-container"] > :nth-child(2) > .mt-60 > div > [data-cy="submit-data-entry"]').click()
  
//Check Data Entry- Date of Service

cy.wait(10000)
cy.get('.slick-active > :nth-child(1) > [data-cy="modal-container"] > [data-cy="carousel-container"] > [data-cy="content-outer-container"] > [data-cy="monitor-flow-body"] > [data-cy="data-entry-container"] > [data-cy="data-entry-input-container"] > [data-cy="question-input-container"] > .pb-20 > .flex > .ant-row > .ant-col > :nth-child(1) > .styles__CustomDateInputContainer-WEJQy > .styles__DatepickerContainer-dXEavp > .ant-picker > .ant-picker-input').click()
cy.get('[class="ant-picker-cell ant-picker-cell-in-view"]', { timeout: 10000 }).contains('24').click()
cy.get('.slick-active > :nth-child(1) > [data-cy="modal-container"] > [data-cy="carousel-container"] > [data-cy="content-outer-container"] > [data-cy="monitor-flow-body"] > [data-cy="data-entry-container"] > [data-cy="data-entry-input-container"] > [data-cy="question-input-container"] > :nth-child(2) > .mt-60 > div > [data-cy="submit-data-entry"]').click({ force: true })
  //Click Review Tab
  cy.get('[data-cy="FILLED"]').click()
  cy.get('[data-cy="question-card-cm2n6j4ki08p8zdk3d4xchxo9"] > [data-cy="question-card"]').contains("CRF: Date of Service AT")
//Click Logout
cy.get('[class="anticon anticon-down DownOutlined__Root-knxRmY jZCmAT img-icon img-right"]').click()
cy.get('[data-cy="logout-text"]').click()
})

it("Login to the Portal and login as Verification/Data Adjudicator", () => {
  cy.AkyrianSDELogin_Verification(email,password)
   //Search study   
    //Search study    
   cy.get('[data-cy="onboarding-search-study"]').type("QAonCloud Test")   
   cy.get('[class="Text__StyledText-fcSGOX liUSLx adjust-version mb-0.5"]').contains("v.4.b").click()
      cy.get('[class="Text__StyledText-fcSGOX gSpvOG sider-patient-name"]').contains("QA_AU-02").click()
   //click visit    
   cy.get('[data-cy="visit-cm2ol891a0amjzdk3m1xitkk2"][data-visit-name="AUTOMATION-sign-CRF"]').click()
   //Check Data Verify- CRF: Date of Service AT
 cy.wait(10000)

cy.get('[data-cy="question-card-cm2n6j4ki08p8zdk3d4xchxo9"] > [data-cy="question-card"]').contains("CRF: Date of Service AT").click() 
cy.get('.question-card-action-menu-icon').eq(1).click({force: true});
cy.get('[data-cy="first-data-entry-cm2n6j4ki08p8zdk3d4xchxo9"]').click()
cy.wait(10000)
cy.get('[data-cy="accept-data-entry-cm2n6j4ki08p8zdk3d4xchxo9"]').click()
//Click Verification complete Tab
cy.get('[data-cy="ACCEPTED"]').click()
cy.get('[data-cy="question-card-cm2n6j4ki08p8zdk3d4xchxo9"] > [data-cy="question-card"]').contains("CRF: Date of Service AT").click() 
//Click Logout
cy.get('[class="anticon anticon-down DownOutlined__Root-knxRmY jZCmAT img-icon img-right"]').click()
cy.get('[data-cy="logout-text"]').click()
})
it("Login to the Portal and login as signcrf", () => {
  cy.AkyrianSDELogin_signcrf(email,password)
   //Search study   
    //Search study    
   cy.get('[data-cy="onboarding-search-study"]').type("QAonCloud Test")   
   cy.get('[class="Text__StyledText-fcSGOX liUSLx adjust-version mb-0.5"]').contains("v.4.b").click()
      cy.get('[class="Text__StyledText-fcSGOX gSpvOG sider-patient-name"]').contains("QA_AU-02").click()
   //click visit    
   cy.get('[data-cy="visit-cm2ol891a0amjzdk3m1xitkk2"][data-visit-name="AUTOMATION-sign-CRF"]').click()
   cy.wait(10000)

 //Check Sign CRF Screen
cy.get('[data-cy="sign-level"]').contains("Sign AUTOMATION-sign-CRF")
cy.get('[class="Text__StyledText-fcSGOX dcoJJS"]').contains("I, AUTOMATION- SIGNCRF, the Clinical Trial Investigator certify that I have reviewed the data and can verify that it is accurate and contemporaneous")
cy.get('[data-cy="input-password"]').should('exist')
cy.get('[data-cy="btn-sign"]').contains("Sign")
//Click Logout
cy.get('[class="anticon anticon-down DownOutlined__Root-knxRmY jZCmAT img-icon img-right"]').click()
cy.get('[data-cy="logout-text"]').click()
})
}) 






/*

it("Work on Manual redaction", () => {
    cy.AkyrianSDELogin_2(email,password)
    //Search study  
cy.get("#study-version").contains('v.4.b').click()
cy.wait(1000)
cy.get('[class="Text__StyledText-fcSGOX gSpvOG sider-patient-name"]').contains("QA_AU-03").click()
//click visit    
cy.get('[data-cy="visit-cm2k19ovl0u6xvx8aew6fmuqi"][data-visit-name="AutomationSDE"]').click()
//Check Pending Snippet-2    
cy.get('[data-cy="question-card-cm2k0248a0u2lvx8ab8qskgk9"] > [data-cy="question-card"]').contains("SDE basic questions : Code").click() 
cy.wait(20000)
cy.get('[class="question-card-action-menu-icon icon-dettach"]').first().click({ force: true })
cy.wait(20000)
// Start redaction
cy.get('[data-cy=start-redacting-button]').click();

// Draw rectangle
cy.drawSingleRect({
  x: 50,
  y: 50,
  x2: 200,
  y2: 200,
});

// Complete redaction
cy.get('[data-cy=redaction-complete-button]').click();
cy.get('[data-cy=confirm-redact-button]').should('be.visible').click();
// Intercept GraphQL request and set alias
cy.intercept('POST', '/graphql', (req) => {
  if (req.body.operationName === 'VisitDetailSourceCapture') {
    req.alias = 'aliasVisitDetailSourceCapture'; // Define the alias here
  }
}).as('graphqlRequest'); // Add a general alias for the intercept

// Wait for the request to complete
cy.wait('@aliasVisitDetailSourceCapture'); // This will now reference the correct alias

// Confirm the action
cy.get('[data-cy=sc-okay-button]').should('be.visible').click();

// Wait for canvas to load
cy.waitForCanvasToLoad();

// Capture snapshot
cy.getSnapshot('[data-cy=canvas-content]');




cy.get('[data-cy="non-streamline-save-snippet"]').click()
//cy.get('[data-cy="right-chip-Height"]').click()
//cy.get('[data-cy="non-streamline-save-snippet"]').click()
cy.get('[data-cy="submit-bottom-chips-menu"]').click()
cy.get('[data-cy="done-snippet-button"] > .Text__StyledText-fcSGOX').click()

})

it.only("Work on Manual redaction-1", () => {
  cy.AkyrianSDELogin_2(email,password)
  const snippetRegion = {
    x: 50,    // Starting x-coordinate
    y: 50,    // Starting y-coordinate
    x2: 200,  // Ending x-coordinate
    y2: 200   // Ending y-coordinate
  };

  //Search study  
cy.get("#study-version").contains('v.4.b').click()
cy.wait(1000)
cy.get('[class="Text__StyledText-fcSGOX gSpvOG sider-patient-name"]').contains("QA_AU-03").click()
//click visit    
cy.get('[data-cy="visit-cm2k19ovl0u6xvx8aew6fmuqi"][data-visit-name="AutomationSDE"]').click()
//Check Pending Snippet-2    
cy.get('[data-cy="question-card-cm2k0248a0u2lvx8ab8qskgk9"] > [data-cy="question-card"]').contains("SDE basic questions : Code").click() 
cy.wait(20000)
cy.get('[class="question-card-action-menu-icon icon-dettach"]').first().click({ force: true })
cy.wait(20000)
// Start redaction
cy.drawSingleRect(snippetRegion);
cy.get('[data-cy=streamline-dropdown-data-entry-question]')
  .should('be.visible')
  .click();

// Instead of a static wait, ensure the dropdown is ready
cy.get('[data-cy=streamline-dropdown-data-entry-question-options]')
  .should('be.visible');

// Perform recursive scroll check
recursiveScrollCheck(0, 'Size');

cy.get(`[data-cy=streamline-dropdown-data-entry-question-option-Lungs]`)
  .should('be.visible')
  .click();

cy.get(`[data-cy=streamline-save-data-entry]`)
  .should('be.visible')
  .click();

// Intercept GraphQL request and set alias
cy.intercept('POST', '/graphql', (req) => {
  if (req.body.operationName === 'VisitDetailSourceCapture') { // Ensure the operation name is correct
    req.alias = 'aliasVisitDetailSourceCapture'; // Define the alias properly
  }
});

// Wait for the GraphQL request to complete
cy.wait('@aliasVisitDetailSourceCapture');

// Proceed with the next steps
cy.get(`[data-cy=streamline-edit-data-entry]`)
  .should('be.visible');

cy.clickCanvasTools('Redaction');

cy.drawSingleRect({
  x: 350,
  y: 0,
  x2: 450,
  y2: 100,
});

cy.get('[data-cy=next-bottom-chips-menu]').click();

// Intercept GraphQL request again
cy.intercept('POST', '/graphql', (req) => {
  if (req.body.operationName === 'VisitDetailSourceCapture') {
    req.alias = 'aliasVisitDetailSourceCapture';
  }
});

// Wait for the GraphQL request to complete with a timeout
cy.wait('@aliasVisitDetailSourceCapture', { timeout: 65000 });

// Click to go back to canvas
cy.get('[data-cy=back-to-canvas-bottom-chips-menu]', { timeout: 30000 }).click();

// Capture the canvas content
cy.getSnapshot('[data-cy=canvas-content]');



cy.get('[data-cy="non-streamline-save-snippet"]').click()
//cy.get('[data-cy="right-chip-Height"]').click()
//cy.get('[data-cy="non-streamline-save-snippet"]').click()
cy.get('[data-cy="submit-bottom-chips-menu"]').click()
cy.get('[data-cy="done-snippet-button"] > .Text__StyledText-fcSGOX').click()

})


it.only("Work on Manual redaction", () => {
  cy.AkyrianSDELogin_1(email,password)
    //Search study
cy.get('[data-cy="onboarding-search-study"]').type("QAonCloud Test")   
 cy.get('[class="Text__StyledText-fcSGOX liUSLx adjust-version mb-0.5"]').contains("v.4.b").click()
    cy.get('[class="Text__StyledText-fcSGOX gSpvOG sider-patient-name"]').contains("QA_AU-02").click()
//click visit    
cy.get('[data-cy="visit-cm2kbtfen0102zdk3a41144ov"][data-visit-name="AutomationSDE"]').click()
//Click SDE Tab
cy.get('[data-cy="sourceQuestionTab"]').click()
cy.wait(10000)
//Upload Image
//Question 2-Check Image upload
cy.get('[data-cy="question-card-cm2k0248a0u2lvx8ab8qskgk9"] > [data-cy="question-card"]').click()

cy.get('[data-cy="open-modal-capture"]:visible').first().click({force: true} )
cy.get('[data-cy="upload-sc-button"]').click()
const filepath2 = 'SCImage.png'; // Path to your PNG file
cy.get('input[type="file"]').attachFile(filepath2); 
cy.wait(30000)
cy.get('[data-cy="confirmation-modal-title"]').contains('No Name Found')
//Click Cancel
cy.get('[data-cy="confirmModal-cancelButton"]').click()
//Click Manual Redact
cy.get('[data-cy="manual-redact-button"]').click()
//Click Start Redact
cy.get('[data-cy="start-redacting-button"]').click()

  const Tesseract = require('tesseract.js');

  // Upload the image file
  cy.get('[style="cursor: crosshair;"] > .konvajs-content > canvas').should('exist')
  .and('be.visible')  
.invoke('attr', 'src').then((imageSrc) => {
    performOCR(imageSrc).then(({ data: { words } }) => {
      const targetWord = words.find((word) => word.text.toLowerCase() === 'vital');

      if (targetWord) {
        const { x0, y0 } = targetWord.bbox;
        cy.get('[style="cursor: crosshair;"] > .konvajs-content > canvas').click(x0, y0);
    } else {
        throw new Error('Text "vital" not found in the image');
    }
}).catch(err => {
    cy.log('OCR Error:', err);
});
});
})*/


it.only("Work on Manual redaction", () => {
  cy.AkyrianSDELogin_1(email,password)
    //Search study
cy.get('[data-cy="onboarding-search-study"]').type("QAonCloud Test")   
 cy.get('[class="Text__StyledText-fcSGOX liUSLx adjust-version mb-0.5"]').contains("v.4.b").click()
    cy.get('[class="Text__StyledText-fcSGOX gSpvOG sider-patient-name"]').contains("QA_AU-02").click()
//click visit    
cy.get('[data-cy="visit-cm2kbtfen0102zdk3a41144ov"][data-visit-name="AutomationSDE"]').click()
//Click SDE Tab
cy.get('[data-cy="sourceQuestionTab"]').click()
cy.wait(10000)
//Upload Image
//Question 2-Check Image upload
cy.get('[data-cy="question-card-cm2k0248a0u2lvx8ab8qskgk9"] > [data-cy="question-card"]').click()

cy.get('[data-cy="open-modal-capture"]:visible').first().click({force: true} )
cy.get('[data-cy="upload-sc-button"]').click()
const filepath2 = 'SCImage.png'; // Path to your PNG file
cy.get('input[type="file"]').attachFile(filepath2); 
cy.wait(30000)
cy.get('[data-cy="confirmation-modal-title"]').contains('No Name Found')
//Click Cancel
cy.get('[data-cy="confirmModal-cancelButton"]').click()
//Click Manual Redact
cy.get('[data-cy="manual-redact-button"]').click()
//Click Start Redact
cy.get('[data-cy="start-redacting-button"]').click()

cy.task('redactImage', {
  imagePath: 'SCImage.png', 
  redactionCoords: [{ x: 10, y: 10, width: 50, height: 50 }]
});
});
