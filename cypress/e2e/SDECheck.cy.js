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
    const randomDay = Math.floor(Math.random() * 8) + 1; // This will give a number between 1 and 8
    const randomMonthIndex = Math.floor(Math.random() * 12); // Random month index (0-11)
    const randomYear = Math.floor(Math.random() * (2023 - 2017 + 1)) + 2017; // Random year (1980-2023)
  // Months array for conversion
  const months = [
    "January", "February", "March", "April", "May", "June", "July", "August",
    "September", "October", "November", "December"
];
const randomMonth = months[randomMonthIndex];
// This will give you the first 3 characters (e.g., "Jan", "Feb", "Oct")

// Convert month to a string if needed (for dropdown value matching)
const monthString = randomMonth < 10 ? `0${randomMonth}` : randomMonth;
cy.get('[data-cy="onboarding-search-study"]').type("QAonCloud Test")   
cy.get('[class="Text__StyledText-fcSGOX liUSLx adjust-version mb-0.5"]').contains("v.4.b").click()
cy.get('[class="Text__StyledText-fcSGOX gSpvOG sider-patient-name"]').contains("QA_AU-02").click()
//Add Visit
//Check Visit date (year, month,day) dropdowns
cy.get('#add-visit-modal-button').contains("+ Add Visit").click()
cy.get('[data-cy="select-year-addVisit"]').click()
cy.get('[class="ant-select-item-option-content"]').contains(randomYear).click()
cy.get('[data-cy="select-month-addVisit"]').click()
cy.contains(randomMonth).click({force: true})

cy.get('[data-cy="select-date-addVisit"] > .ant-select-selector > .ant-select-selection-item').click()
cy.wait(1000)
cy.get(`[title="${randomDay}"]`).scrollIntoView().click({ force: true });
// Select the day
 cy.wait(10000)

cy.get('#add-visit-select').click()
cy.get('[class="ant-select-item-option-content"]').contains("AUTOMATION-sign-CRF").click()
cy.get('#btn-cancel-add-visit').contains("Cancel")

cy.get('#btn-submit-add-visit').contains("Submit").click()
const formattedDay = randomDay.toString().padStart(2, '0')
const abbreviatedMonth = randomMonth.slice(0, 3)
const expectedDate = `Visit Occurred on ${formattedDay} ${abbreviatedMonth} ${randomYear}`;
cy.wait(20000)
//Add Visit and 
cy.get('[class="Text__StyledText-fcSGOX khrVmG progress-visit-text-status"]').should('contain', expectedDate).click()
//Click SDE Tab
cy.wait(20000)
cy.get('[data-cy="sourceQuestionTab"]').click()
//Click Logout
cy.get('[class="anticon anticon-down DownOutlined__Root-knxRmY jZCmAT img-icon img-right"]').click()
cy.get('[data-cy="logout-text"]').click()

})
})