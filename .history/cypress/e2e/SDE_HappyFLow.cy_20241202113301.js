/// <reference types="cypress" />
import SDE_HappyFlow from "../support/Pageobjects/SDE_HappyFlow"

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
SDE_HappyFlow.Search_Study.type("QAonCloud Test")   
SDE_HappyFlow.Study_Version.contains("v.4.b").click()
SDE_HappyFlow.Patient_Name.contains("QA_AU-04").click()

//Click Visit and 
SDE_HappyFlow.Click_VisitName.click()
//Click SDE Tab
SDE_HappyFlow.SDE_Tab.click()

//Question 1-Check Image upload
SDE_HappyFlow.Question_Card.click()
SDE_HappyFlow.Open_ModalCapture.first().click({force: true} )
SDE_HappyFlow.Upload_File.click()
const filepath = 'AUTOMATION - without name.png'; 
// Path to your PNG file
SDE_HappyFlow.File_Upload.attachFile(filepath);
//If we upload not available patient name it shows as patient name as Notfound
SDE_HappyFlow.Verification.contains("Verification Result")
// Check that the patient name is "Not Found"
SDE_HappyFlow.PatientsName_NoData.should('have.text', ': Not Found');
// Check that the date of birth is marked as "Verified"
SDE_HappyFlow.DOB_Data.should('have.text', ': Verified');
// Check that the visit date is marked as "Verified"
SDE_HappyFlow.Visitdate_data.should('have.text', ': Verified');
//Click Submit
SDE_HappyFlow.Manual_React.scrollIntoView() 
SDE_HappyFlow.Manual_React.click()
SDE_HappyFlow.Continue_React.click()
SDE_HappyFlow.Confirm_React.click()
SDE_HappyFlow.Suggestion_1.click()
SDE_HappyFlow.Submit_React.click()

cy.wait(50000)
//Question 2-Check Image upload
SDE_HappyFlow.Unattached_Tab.click()
SDE_HappyFlow.Question_Card_2.click()
SDE_HappyFlow.Open_ModalCapture.first().click({force: true} )
SDE_HappyFlow.Upload_File.click()
const filepath2 = 'AUTOMATION without DOB.png'; // Path to your PNG file
SDE_HappyFlow.File_Upload.attachFile(filepath2);
//If we upload not available DOB  it shows as DOB as Notfound
SDE_HappyFlow.Verification.contains("Verification Result")
 // Check that the DOB is "Not Found"
 SDE_HappyFlow.DOB_NoData.should('have.text', ': Not Found');
 // Check that the patientsName is marked as "Verified"
 SDE_HappyFlow.PatientsName_Data.should('have.text', ': Verified');
 // Check that the Visit Name is marked as "Verified"
 SDE_HappyFlow.Visitdate_data.should('have.text', ': Verified');
//Click Submit
SDE_HappyFlow.Manual_React.scrollIntoView() 
SDE_HappyFlow.Manual_React.click()
SDE_HappyFlow.Continue_React.click()
SDE_HappyFlow.Confirm_React.click()
SDE_HappyFlow.Suggestion_3.click()

SDE_HappyFlow.Submit_React.click()
cy.wait(50000)

//Question 3-Check Image upload
SDE_HappyFlow.Unattached_Tab.click()
SDE_HappyFlow.Question_Card_3.click()

SDE_HappyFlow.Open_ModalCapture.first().click({force: true} )
SDE_HappyFlow.Upload_File.click()
const filepath3 = 'AUTOMATION visit date not match.png'; // Path to your PNG file
SDE_HappyFlow.File_Upload.attachFile(filepath3);
cy.wait(40000)
//If we upload not matching visit date it shows as visitDate  as Notfound
SDE_HappyFlow.Verification.contains("Verification Result")
 // Check that the visitDate is "Not Found"
 SDE_HappyFlow.Visitdate_noData.should('have.text', ': Not Found');
 // Check that the patientsName is marked as "Verified"
 SDE_HappyFlow.PatientsName_Data.should('have.text', ': Verified');
 // Check that the dateOfBirth is marked as "Verified"
 SDE_HappyFlow.DOB_Data.should('have.text', ': Verified');
//Click Submit
SDE_HappyFlow.DOB_Data.scrollIntoView() 
SDE_HappyFlow.DOB_Data.click()
SDE_HappyFlow.Continue_React.click()
SDE_HappyFlow.Confirm_React.click()
SDE_HappyFlow.Suggestion_4.click()

SDE_HappyFlow.Submit_React.click()
cy.wait(40000)
//Question 4-Check Image upload

SDE_HappyFlow.Unattached_Tab.click()
SDE_HappyFlow.Question_Card.click()

SDE_HappyFlow.Open_ModalCapture.first().click({force: true} )
SDE_HappyFlow.Upload_File.click()
const filepath4 = 'AUTOMATION.png'; 
// Path to your PNG file
SDE_HappyFlow.File_Upload.attachFile(filepath4);
cy.wait(30000)
//If we upload all matching image it does not shows as Verification results
SDE_HappyFlow.Continue_React.click()
SDE_HappyFlow.Confirm_React.click()
SDE_HappyFlow.Suggestion_2.click()
SDE_HappyFlow.Submit_React.click()
cy.wait(40000)
//Click Attached Tab And check Unverified' Label
SDE_HappyFlow.Attached_Tab.click()
SDE_HappyFlow.QuestionCard_1.contains('CRF: Allergies-AT')
SDE_HappyFlow.QuestionCard_Label_1.contains('Unverified')
SDE_HappyFlow.QuestionCard_2.contains('CRF: Blood Pressure AT')
SDE_HappyFlow.QuestionCard_Label_2.contains('Unverified')

SDE_HappyFlow.QuestionCard_3.contains('CRF: Age AT')
SDE_HappyFlow.QuestionCard_Label_3.contains('Unverified')

//Click Change Attachment -1
cy.wait(20000)
SDE_HappyFlow.Question_Card_1.first().click()
SDE_HappyFlow.React_Action.first().click({force: true})
SDE_HappyFlow.React_Reason.click()
SDE_HappyFlow.React_Changeattachment.click()
SDE_HappyFlow.Reattach.click()
SDE_HappyFlow.Upload_File.click()
  const filepath5 = 'AUTOMATION.png'; 
  // Path to your PNG file
  SDE_HappyFlow.File_Upload.attachFile(filepath5);
  cy.wait(20000)
//If we upload all matching image it does not shows as Verification results
SDE_HappyFlow.Continue_React.click()
SDE_HappyFlow.Confirm_React.click()
SDE_HappyFlow. Suggestion_1.click()
SDE_HappyFlow.Submit_React.click()
cy.wait(40000)
//Click Change Attachment -2
SDE_HappyFlow.Question_CardReattach_1.click({force: true})
SDE_HappyFlow.React_Reason.click()
SDE_HappyFlow.React_Changeattachment.click()

SDE_HappyFlow.Reattach.click()
SDE_HappyFlow.Upload_File.click()
    const filepath6 = 'AUTOMATION.png'; 
    // Path to your PNG file
    SDE_HappyFlow.File_Upload.attachFile(filepath6);
    cy.wait(40000)
    //If we upload all matching image it does not shows as Verification results
    SDE_HappyFlow.Continue_React.click()
    SDE_HappyFlow.Confirm_React.click()
//cy.get('[data-cy="right-chip-Allergies-AT"]').click()
SDE_HappyFlow.Suggestion_3.click()

SDE_HappyFlow.Submit_React.click()
cy.wait(40000)

//Click Change Attachment-3

SDE_HappyFlow.Unattached_Tab.click({force: true})
SDE_HappyFlow.Question_CardReattach_2.click()
SDE_HappyFlow.React_Changeattachment.click()
SDE_HappyFlow.Reattach.click()
SDE_HappyFlow.Upload_File.click()
  const filepath7 = 'AUTOMATION.png'; 
    // Path to your PNG file
    SDE_HappyFlow.File_Upload.attachFile(filepath7);
    cy.wait(40000)
    //If we upload all matching image it does not shows as Verification results
    SDE_HappyFlow.Continue_React.click()
    SDE_HappyFlow.Confirm_React.click()
//cy.get('[data-cy="right-chip-Allergies-AT"]').click()
SDE_HappyFlow.Suggestion_4.click()
SDE_HappyFlow.Submit_React.click()
cy.wait(40000)
//Click Attached Tab
SDE_HappyFlow.Attached_Tab.click()
cy.wait(20000)

//question status 'unverified' label should not be show on question card
SDE_HappyFlow.QuestionCard_1.contains('CRF: Allergies-AT').should('not.contain', 'Unverified')


SDE_HappyFlow. QuestionCard_2.contains('CRF: Blood Pressure AT').should('not.contain', 'Unverified')
//cy.get('[data-cy="question-card-cm2n6fno508ntzdk3qjay0ip3"]', { timeout: 10000 }).contains('CRF: Age AT').should('not.contain', 'Unverified')
SDE_HappyFlow.QuestionCard_4.contains('CRF: Date of Service AT').should('not.contain', 'Unverified')
//Click Logout
SDE_HappyFlow.Profile_Header.click()
SDE_HappyFlow.Logout.click()

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
  SDE_HappyFlow.Search_Study.type("QAonCloud Test")   
  SDE_HappyFlow.Study_Version.contains("v.4.b").click()
  SDE_HappyFlow.Patient_Name.contains("QA_AU-04").click()
//Click Visit 

SDE_HappyFlow.Click_VisitName.click()
//click visit   
SDE_HappyFlow.QuestionCard_1.contains('CRF: Allergies-AT').should('not.contain', 'Unverified')
SDE_HappyFlow.QuestionCard_2.contains('CRF: Blood Pressure AT').should('not.contain', 'Unverified')
SDE_HappyFlow.QuestionCard_3.contains('CRF: Age AT').should('not.contain', 'Unverified')
SDE_HappyFlow.QuestionCard_4.contains('CRF: Date of Service AT').should('not.contain', 'Unverified')
//Check Pending Snippet-1   
SDE_HappyFlow.Question_Card_1.contains("CRF: Allergies-AT").click()
SDE_HappyFlow.Dettach.first().click({ force: true })
SDE_HappyFlow.Suggestion_1.click()
SDE_HappyFlow.Dropdown_DataEntry
  .should('have.attr', 'title', 'Allergies-AT')
  SDE_HappyFlow.Save_Snippet.click()
  SDE_HappyFlow.Check_Snippet.find('[data-cy="bottom-chip-Allergies-AT"]').should('exist')
//Click Submit
SDE_HappyFlow.Submit_React.click()
SDE_HappyFlow.Done_Snippet.click()
cy.wait(10000)

//Check Pending Snippet-2   
SDE_HappyFlow.Question_Card_2.contains("CRF: Blood Pressure AT").click() 
SDE_HappyFlow.Dettach.first().click({ force: true })
SDE_HappyFlow.Suggestion_3.click()
SDE_HappyFlow.Dropdown_DataEntry
  .should('have.attr', 'title', 'Blood Pressure AT')
  SDE_HappyFlow.Save_Snippet.click()
  SDE_HappyFlow.Check_Snippet.find('[data-cy="bottom-chip-BloodPressureAT"]').should('exist')
  SDE_HappyFlow.Submit_React.click()
  SDE_HappyFlow.Done_Snippet.click()

//Check Pending Snippet-3  
SDE_HappyFlow.Question_Card_3.contains("CRF: Age AT").click() 
SDE_HappyFlow.Dettach.first().click({ force: true })
SDE_HappyFlow.Suggestion_4.click()
SDE_HappyFlow.Dropdown_DataEntry
  .should('have.attr', 'title', 'Age AT')
  SDE_HappyFlow.Save_Snippet.click()
  SDE_HappyFlow.Check_Snippet.find('[data-cy="bottom-chip-AgeAT"]').should('exist')
  SDE_HappyFlow.Submit_React.click()
  SDE_HappyFlow.Done_Snippet.click()

//Check Pending Snippet-4  
SDE_HappyFlow.Question_Card.contains("CRF: Date of Service AT").click() 
SDE_HappyFlow.Dettach.first().click({ force: true })
SDE_HappyFlow.Suggestion_2.click()
SDE_HappyFlow.Dropdown_DataEntry
  .should('have.attr', 'title', ' Date of Service AT')
  SDE_HappyFlow.Save_Snippet.click()
  SDE_HappyFlow.Check_Snippet.find('[data-cy="bottom-chip-DateofServiceAT"]').should('exist')
  SDE_HappyFlow.Submit_React.click()
  SDE_HappyFlow.Done_Snippet.click()

//Check Snippet Complete Tab
SDE_HappyFlow.Complete_Snippet.click()
SDE_HappyFlow.QuestionCard_1.contains('CRF: Allergies-AT')
SDE_HappyFlow.QuestionCard_2.contains('CRF: Blood Pressure AT')
SDE_HappyFlow.QuestionCard_3.contains('CRF: Age AT')
//cy.get('[data-cy="question-card-cm2n6j4ki08p8zdk3d4xchxo9"]').contains('CRF: Date of Service AT')
//Click Logout
SDE_HappyFlow.Profile_Header.click()
SDE_HappyFlow.Logout.click()
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
  SDE_HappyFlow.Search_Study.type("QAonCloud Test")   
  SDE_HappyFlow.Study_Version.contains("v.4.b").click()
  SDE_HappyFlow.Patient_Name.contains("QA_AU-04").click()
//Click Visit
SDE_HappyFlow.Click_VisitName.click()

 //Check Review Snippet-1
 SDE_HappyFlow.Question_Card_1.contains("CRF: Allergies-AT").click() 
 SDE_HappyFlow.Review_Snippet.first().click({ force: true })
 SDE_HappyFlow.Canvas_Container.screenshot('Allergies')
 SDE_HappyFlow.Approve_SA.click()
//Click Close 
SDE_HappyFlow.Close_carousel.click()

//Check Review Snippet-2
SDE_HappyFlow.Question_Card_2.contains("CRF: Blood Pressure AT").click() 
SDE_HappyFlow.Review_Snippet_1.first().click({ force: true })
SDE_HappyFlow.Canvas_Container.screenshot('Blood')
SDE_HappyFlow.Approve_SA.click()
//Click Close 
SDE_HappyFlow.Close_carousel.click()
//Check Review Snippet-3
SDE_HappyFlow.Question_Card_3.contains("CRF: Age AT").click() 
SDE_HappyFlow.Review_Snippet_2.first().click({ force: true })
SDE_HappyFlow.Canvas_Container.screenshot('year')
SDE_HappyFlow.Approve_SA.click()
 //Click Close 
 SDE_HappyFlow.Close_carousel.click()
//Check Review Snippet-4
  //cy.get('[data-cy="question-card-cm2n6j4ki08p8zdk3d4xchxo9"] > [data-cy="question-card"]').contains("CRF:  Date of Service AT").click() 
  SDE_HappyFlow.Review_Snippet_3.first().click({ force: true })
  SDE_HappyFlow.Canvas_Container.screenshot('Date')

  SDE_HappyFlow.Approve_SA.click()
  //cy.get('[data-cy="carousel-close"]').click()


    //Click Review Tab
    SDE_HappyFlow.Accepted_Snippet.click({force: true})
    SDE_HappyFlow.Question_Card_1.contains("CRF: Allergies-AT").click() 
SDE_HappyFlow.Question_Card_2.contains("CRF: Blood Pressure AT").click() 
SDE_HappyFlow.Question_Card_3.contains("CRF: Age AT").click() 
    //cy.get('[data-cy="question-card-cm2n6j4ki08p8zdk3d4xchxo9"] > [data-cy="question-card"]').contains("CRF: Date of Service AT").click() 

//Click Logout
SDE_HappyFlow.Profile_Header.click()
SDE_HappyFlow.Logout.click()
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
         SDE_HappyFlow.Search_Study.type("QAonCloud Test")   
         SDE_HappyFlow.Study_Version.contains("v.4.b").click()
         SDE_HappyFlow.Patient_Name.contains("QA_AU-04",{ timeout:30000 }).click()
     //Click Visit
     SDE_HappyFlow.Click_VisitName.click()
//Check Data Entry-Allergies-AT
SDE_HappyFlow.Question_Card_1.contains("CRF: Allergies-AT").click() 
SDE_HappyFlow.Data_EntryAction.first().click({ force: true })
SDE_HappyFlow.Data_Input.first().type("allergen")
SDE_HappyFlow.Data_Inputcarousel.click()
  //Check Data Entry- Blood Pressure
  SDE_HappyFlow.Data_EntryAction.first().click().type("120")
  SDE_HappyFlow.Data_Input_1.click()
//Check Data Entry- Age AT
SDE_HappyFlow.Data_Inputcarousel_1.click({force: true})
SDE_HappyFlow.Select_DataEntry.click();
SDE_HappyFlow.Data_Inputcarousel.click()

//Check Data Entry- Date of Service
SDE_HappyFlow.Data_EntryAction.first().click({ force: true })
SDE_HappyFlow.Data_Entry_Antpicker.click({force: true})
SDE_HappyFlow.Ant_PickerInput.click()
SDE_HappyFlow.Data_Inputcarousel.click({ force: true })
//Click Review Tab
SDE_HappyFlow.Filled_Partial.click()
SDE_HappyFlow.Question_Card_3.contains("CRF: Age AT")
// cy.get('[data-cy="question-card-cm2n6j4ki08p8zdk3d4xchxo9"] > [data-cy="question-card"]').contains("CRF: Date of Service AT")
//Click Logout
SDE_HappyFlow.Profile_Header.click()
SDE_HappyFlow.Logout.click()
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
     SDE_HappyFlow.Search_Study.type("QAonCloud Test")   
     SDE_HappyFlow.Study_Version.contains("v.4.b").click()
     SDE_HappyFlow.Patient_Name.contains("QA_AU-04",{ timeout:30000 }).click()
 //Click Visit
 SDE_HappyFlow.Click_VisitName.click()
    
   //Check Data Entry 2- Age AT
   SDE_HappyFlow.Question_Card_3.contains("CRF: Age AT").click() 
   SDE_HappyFlow.Data_EntryAction.first().click({ force: true })
   SDE_HappyFlow.DataEntry_Selection.first().click()
   SDE_HappyFlow.Select_DataEntry.click();
   SDE_HappyFlow.Data_Inputcarousel.click()
    
  //Check Data Entry- Date of Service
  SDE_HappyFlow.Data_Entry_Antpicker.click()
  SDE_HappyFlow.PickerInput.contains('24').click()
  SDE_HappyFlow.Data_Inputcarousel.click({ force: true })
    //Click Data Entry Tab
    SDE_HappyFlow.Filled.click()
    SDE_HappyFlow.Question_Card.contains("CRF: Date of Service AT")
  //Click Logout
  SDE_HappyFlow.Profile_Header.click()
  SDE_HappyFlow.Logout.click()
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
 SDE_HappyFlow.Search_Study.type("QAonCloud Test")   
 SDE_HappyFlow.Study_Version.contains("v.4.b").click()
 SDE_HappyFlow.Patient_Name.contains("QA_AU-04",{ timeout:30000 }).click()
//Click Visit
SDE_HappyFlow.Click_VisitName.click()
     //Check Data Verify- CRF: Date of Service AT
  
     SDE_HappyFlow.Question_Card.contains("CRF: Date of Service AT").click() 
     SDE_HappyFlow.Action_Menu.eq(1).click({force: true});
     SDE_HappyFlow.DataEntry_Accept.click()
     SDE_HappyFlow.Accept_DataEntry.click()
  //Click Verification complete Tab
  SDE_HappyFlow.Attached_Tab.click()
  SDE_HappyFlow.Question_Card.contains("CRF: Date of Service AT").click() 
  //Click Logout
  SDE_HappyFlow.Profile_Header.click()
  SDE_HappyFlow.Logout.click() 
  })
  it("Login to the Portal and login as signcrf", () => {
    cy.viewport(1280, 720)
    cy.visit("https://qa.akyrian.com/"),
     
    cy.get('#email').focus()
    cy.get('#email').type("signcrf@example.com")
    cy.get('#password').focus()
    cy.get('#password').type("Password!1", { log: false })
    cy.get('#loginAs-btn').click()
    cy.wait(4000)   
      //Search study   
      SDE_HappyFlow.Search_Study.type("QAonCloud Test")   
 SDE_HappyFlow.Study_Version.contains("v.4.b").click()
 SDE_HappyFlow.Patient_Name.contains("QA_AU-04",{ timeout:30000 }).click()
//Click Visit
SDE_HappyFlow.Click_VisitName.click()
  
   //Check Sign CRF Screen
   SDE_HappyFlow.Sign_Level.contains("Sign AUTOMATION-sign-CRF")
   SDE_HappyFlow.Sign_LevelText.contains("I, Sign CRF, the Clinical Trial Investigator certify that I have reviewed the data and can verify that it is accurate and contemporaneous")
   SDE_HappyFlow.SignCRF_Password.should('exist')
   SDE_HappyFlow.SignCRF_Dwld.contains("Sign")
  //Click Logout
  SDE_HappyFlow.Profile_Header.click()
  SDE_HappyFlow.Logout.click()
  })
})