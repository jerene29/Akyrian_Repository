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
let RandomvisitID; // Declare a variable to store the visit ID

//Login Page
describe('SIGNCRF FLow',()=> {
    before(() => {
        // Generate RandomvisitID once before all tests
        const randomNumber1 = Math.floor(Math.random() * 900) + 100; // Random number between 100 and 999
        RandomvisitID = `ABC-ACB${randomNumber1}`; // Assign it to the variable
      });
    it("Login to the Portal and login as Source Capture User", () => {
        cy.viewport(1280, 720)
        cy.visit("https://qa.akyrian.com/"),
         
        cy.get('#email').focus()
        cy.get('#email').type("streamlinesc@example.com")
        cy.get('#password').focus()
        cy.get('#password').type("Password!1", { log: false })
        cy.get('#loginAs-btn').click()
        cy.wait(4000)         
          //Search study  
          function getRandomLetters() {
            const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // All uppercase letters
            return letters.charAt(Math.floor(Math.random() * letters.length)) + 
                   letters.charAt(Math.floor(Math.random() * letters.length));
          }           // Generates a random number between 0 and 9999
          const uniqueName = `DIVYA_${getRandomLetters()}`;
          cy.get('[data-cy="onboarding-search-study"]').type("CVD-19")   
         cy.get('[class="Text__StyledText-fcSGOX liUSLx adjust-version mb-0.5"]').contains("v.2.l").click()

//click Add Study Subject Button    
cy.wait(10000)         

cy.get('#add-patient-icon > .ant-row > :nth-child(2) > .Text__StyledText-fcSGOX').dblclick()
         cy.get('[data-cy="button-submit-add-patient"]').should('be.disabled')
         cy.get('#firstName').clear().type(uniqueName);
         cy.get('#lastName').type("Automation01")
         cy.get('#patientStudyId').clear().type(RandomvisitID)

         cy.get('[data-cy="patient-site"]').click()
         cy.get('[class="ant-select-item-option-content"]').contains('Bellevue Hospital').click()
         cy.get('input[type="radio"][name="FEMALE"]').check();
      
         cy.get('[data-cy="select-year-addPatient"]').click()
        cy.get('[class="ant-select-item-option-content"]').contains('2023').click()
         cy.get('[data-cy="select-month-addPatient"]').click()
         cy.get('[class="ant-select-item-option-content"]').contains('January').click()

         cy.get('[data-cy="select-date-addPatient"]').click()
         cy.get("[title='7'] > .ant-select-item-option-content").click( )
cy.wait(1000)
         cy.get('[data-cy="button-submit-add-patient"]').should('exist');
         cy.get('[data-cy="button-cancel-add-patient"]').should('exist');
        cy.get('[data-cy="button-submit-add-patient"]').click()
        //cy.get('[data-cy="button-cancel-add-patient"]').click()
       cy.wait(10000)
      
    //CLick Visit
    cy.get('[class="Text__StyledText-fcSGOX gSpvOG sider-patient-name"]').contains(RandomvisitID).click()
        //cy.get('[class="Text__StyledText-fcSGOX gSpvOG sider-patient-name"]').contains("ABC-ACB853").click()

    cy.wait(10000)

    cy.get('[class="Sider__Wrapper-hsXPIG jTnfEX sidebar-visits-container"]').click()
    cy.get('[data-cy="select-visit-status"] > .ant-select-selector').click()
    cy.get("[label='Visit Did Occur'] > .ant-select-item-option-content").click()
    cy.get('[data-cy="select-year"]').click()
    cy.wait(10000)
    cy.get("[title='2023'] > .ant-select-item-option-content").eq(1).click()
    cy.get('[data-cy="select-month"]').click()
     cy.wait(10000)
     cy.get("[title='February'] > .ant-select-item-option-content").eq(1).click()

     cy.get('[data-cy="select-date"]').click()
     cy.get("[title='5'] > .ant-select-item-option-content").click({force: true} )
     //Click Submit
     cy.get('[data-cy="button-submit-visit"]').click()
     //cy.get('#btn-cancel-add-visit').click()
cy.wait(1000)

//Check Tab
cy.get('[data-cy="question-card"]').contains("Test1").should('exist');
cy.get('[data-cy="answer-input-field-cm32ksnys00aj0t5ma0npcqfn-0-0"]').type("1")
cy.get('[data-cy="save-button-cm32kso0v0enaigpbly5gzbvb"]').click()
//Click Logout
 cy.get('[class="anticon anticon-down DownOutlined__Root-knxRmY jZCmAT img-icon img-right"]').click()
cy.get('[data-cy="logout-text"]').click()
})

it("Login to the Portal and login as Source Markup User", () => {
    cy.viewport(1280, 720)
    cy.visit("https://qa.akyrian.com/"),
     
    cy.get('#email').focus()
    cy.get('#email').type("streamlinesa@example.com")
    cy.get('#password').focus()
    cy.get('#password').type("Password!1", { log: false })
    cy.get('#loginAs-btn').click()
    cy.wait(4000)         
      //Search study  
     cy.get('[data-cy="onboarding-search-study"]').type("CVD-19")   
     cy.get('[class="Text__StyledText-fcSGOX liUSLx adjust-version mb-0.5"]').contains("v.2.l").click()
     
     //Check Add study Subject 
//click Add Study Subject Button    
cy.wait(20000)         
  
//CLick Visit
cy.get('[class="Text__StyledText-fcSGOX gSpvOG sider-patient-name"]').contains(RandomvisitID).click()
//cy.get('[class="Text__StyledText-fcSGOX gSpvOG sider-patient-name"]').contains("ABC-ACB853").click()

cy.wait(10000)

//Check Accept
cy.get('[data-cy="accept-reject-action"]').click({force: true})
cy.get('[data-cy="accept-data-entry-cm32kso0v0enaigpbly5gzbvb"]').click()
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
    cy.wait(4000)         



//Search study   
         cy.get('[data-cy="onboarding-search-study"]').type("CVD-19")   
         cy.get('[class="Text__StyledText-fcSGOX liUSLx adjust-version mb-0.5"]').contains("v.2.l").click()
 
         cy.wait(10000)
      //Click Pending Tab
      cy.get("[for='Pending'] .Text__StyledText-fcSGOX").click()
       //Check Sign CRF Screen
      //cy.get('[data-cy="sign-level"]').contains("Sign All Visits for + 'RandomvisitID'")
      cy.get('[class="Text__StyledText-fcSGOX dcoJJS"]').contains("I, Sign CRF, the Clinical Trial Investigator certify that I have reviewed the data and can verify that it is accurate and contemporaneous")
      cy.get('[data-cy="input-password"]').should('exist')
      cy.get('[data-cy="btn-sign"]').contains("Sign")
      //Download Patient
      cy.get('[for="Signed"] > .ToggleButton__Wrapper-dzZDXr > .Text__StyledText-fcSGOX').click()
      cy.get('[data-cy="btn-download-patient"]').click( {force: true})
      cy.get('[data-cy="confirmation-modal-title"]').contains("Encrypt File with Password")
      cy.get('[data-cy="confirmation-modal-desc"]').contains("Please create a password for the file you're downloading. You will need to enter this password to open the file. Make sure you remember the password because Akyrian will not store the password in the system")
      cy.get('[data-cy="input-password-lock-file"]').type("Password!1")
      cy.get('#btn-submit-lock-file').click()


      //Click Logout
      cy.get('[class="anticon anticon-down DownOutlined__Root-knxRmY jZCmAT img-icon img-right"]').click()
      cy.get('[data-cy="logout-text"]').click()
      })
      }) 