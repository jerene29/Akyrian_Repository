/// <reference types="cypress" />
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
const email = Cypress.env('email');       // Get email from environment variables
const password = Cypress.env('password')
//Login Page
describe('Akyrian SDE FLow',()=> {
  let RandomvisitID;

  before(() => {
    // Generate RandomvisitID once before all tests
    const randomNumber1 = Math.floor(Math.random() * 100) // Random number between 100 and 999
    RandomvisitID = `QA_YQ-${randomNumber1}`; // Assign it to the variable
  });
    let lastId = 6;

 it("Login to the Portal and login as StudyConfig user", () => {
    cy.AkyrianSDELogin_studyconfig(email,password)
    //Check Logo
    cy.get('[data-cy="header-logo"]').should('be.visible')
    cy.get('[class="Text__StyledText-fcSGOX bKOoCf text-version"]').contains("SDE v.2.2.14 2.2.14 Qa").should('exist')
//Check Study Config User
cy.get('[data-cy="hi-user"]').should('have.text','Hi, Study Config.')
cy.get('[data-cy="user-instruction"]').should('have.text','please select your study from the list below or add a new study')
//Check Add Study Button
cy.get('#create-study').contains("Add New Study").should('be.visible')
//Check Recently Viewed
cy.get('[data-cy="text-recently-viewed"]').contains("Recently Viewed").should('be.visible')
//Check Tabs
cy.get('#env-selector-DEVELOPMENT > span:nth-of-type(1)').contains("DEVELOPMENT").should('exist')
cy.get('#env-selector-STAGING > span:nth-of-type(1)').contains("STAGING").should('exist')
cy.get('#env-selector-UAT > span:nth-of-type(1)').contains("UAT").should('exist')
cy.get('#env-selector-PRODUCTION > span:nth-of-type(1)').contains("PRODUCTION").should('exist')
//Search study
cy.get('[data-cy="study-config-search-study"]').contains("Search")
cy.get('[data-cy="study-config-search-study"]').type("QAonCloud Test") 
//Check version  
cy.get('[class="Text__StyledText-fcSGOX liUSLx adjust-version mb-0.5"]').contains("v.4.d").click()
//Check Quick Actions menu
cy.get('[data-cy="icon-system-study-settings"]').contains("Study Settings").should('exist')
cy.get('[data-cy="icon-pencil-edit"]').contains("Rename").should('exist')
cy.get('[data-cy="icon-clone"]').contains("+ New Study").should('exist')
cy.get('[data-cy="icon-version"]').contains("+ Create v.4.e").should('exist')
cy.get('[data-cy="icon-add-to-folder"]').contains("Create Folder").should('exist')
cy.get('[data-cy="icon-move-to-folder"]').contains("Move to Folder").should('exist')
cy.get('[data-cy="icon-archive"]').contains("Archive").should('exist')
cy.get('[data-cy="icon-pause"]').contains("Pause").should('exist')
cy.get('[data-cy="icon-export"]').contains("Export Config").should('exist')
cy.get('[data-cy="btn-edit-study"]').contains("Edit Study").should('exist')
cy.get('[data-cy="right-button-quickactions"]').contains("Push to Staging").should('exist')

//CLick Edit study
cy.get('[data-cy="btn-edit-study"]').click()
//Click  Study
cy.get('#add-visit-icon').click()
cy.wait(10000)
//Add visit
cy.get('[data-cy="visitName"]',{ timeout:30000 }).type("Visit_01")
cy.get('[data-cy="oid"]').type("D01")
cy.get('[data-cy="visit-dayOffset"]').type("3")
cy.get('[data-cy="visit-days-before"]').type("3")
cy.get('[data-cy="visit-days-after"]').type("3")
//cy.get('#button-add-visit').click()
cy.get('[class="Button__Container-gknlFx jJqIYB button-add-visit"]').click()
//CLick visit
cy.get('[data-cy="visit-name"]').contains("Visit_01").click()
/*
//Add Form
cy.get('[data-cy="add-form-button"]').click()
cy.get('[data-cy="form-name-input"]').type("Automation_Study")
cy.get('[data-cy="form-oid-input"]').type("14")
cy.get('[data-cy="submit-create-form"]').click()

cy.wait(50000)


//cy.dragAndDrop('[data-cy="field-card-0"]', '[data-cy="add-new-question-page"]');
cy.get('[data-cy="field-card-0"]') .trigger('mousedown', { which: 1 })
cy.wait(10000)
*/
/*
cy.get('.QuestionCanvas__MainContainer-bSeVBC').trigger('mousemove').trigger('mouseup', { force: true }); 
const dataTransfer = new DataTransfer;
cy.get('[data-cy="field-card-0"]').trigger('dragstart', { dataTransfer: new DataTransfer() })
cy.get('[data-cy="add-new-question-page"]').trigger('drop', { dataTransfer: new DataTransfer() })
cy.get('[data-cy="field-card-0"]').trigger('dragend')


*/
/*
cy.get('[data-cy="field-card-0"]').then(($el) => {
    const draggable = $el[0];

    cy.window().then((win) => {
        const dataTransfer = new win.DataTransfer();

        // Dispatch the dragstart event
        draggable.dispatchEvent(new win.DragEvent('dragstart', { dataTransfer }));

        // Locate the drop target and dispatch events
        cy.get('[data-cy="add-new-question-page"]').then(($target) => {
            const dropTarget = $target[0];

            // Make sure the drop target is visible and interactable
            cy.wrap(dropTarget).should('be.visible');

            // Dispatch dragenter and drop events
            dropTarget.dispatchEvent(new win.DragEvent('dragenter', { dataTransfer }));
            dropTarget.dispatchEvent(new win.DragEvent('drop', { dataTransfer }));
        });

        // Dispatch the dragend event
        draggable.dispatchEvent(new win.DragEvent('dragend', { dataTransfer }));
    });
});
*/
cy.dragAndDrop(
  "[data-cy='field-card-0'] .ant-row", 
  "[class='QuestionCanvas__Container-dHhNeJ hzHpYc']", 
  { timeout: 50000 },  // Timeout for the drag-and-drop operation
  0 // Optional: Vertical offset if needed
).then(() => {
  // Ensure the drop is successful, by waiting for a new element to appear
  cy.get('[data-cy="add-new-question-page"]')
    .find('[data-cy="question-input-container"]', { timeout: 10000 })  // Wait for the element with increased timeout
    .should('exist')  // Assert it exists after drag-and-drop
    .and('be.visible');  // Optionally check if it's visible
});
  cy.get('[name="attr-noSCNeeded"]',{ timeout:50000 }).click()
  cy.get('[data-cy="short-question-input-12"]',{ timeout:30000 }).click( {force: true}).type("Text Question")
  cy.get('[data-cy="long-question-input-12"]',{ timeout:5000 }).click( {force: true}).type("Text Question") .invoke('text').as('Q1')
  cy.get('[data-cy="long-question-input-12"]').then(($text1) => {
    const Q1 = $text1.text()
    cy.get('[data-cy="long-question-input-12"]',{ timeout:10000 }).should('contain', Q1)
  cy.get('[data-cy="oid-input-12"]').type("Test")
  //cy.get('[data-cy="keyword-question-input-12"]').type("Visit_01")
  cy.get('[data-cy="right-menu-save-button"]',{ timeout:50000 }).click()
  cy.wait(20000)
//Click Library
cy.get('.ant-tabs-nav-list > :nth-child(2)',{ timeout:30000 }).click()
  //Second Question
  cy.dragAndDrop(
    "[data-cy='field-card-6'] .ant-row", 
    "[class='Stock__Container-iVFJIT gVXgVN']",
    
    0 // Optional: Vertical offset if needed
  ).then(() => {
    cy.get('[data-cy="add-new-question-page"]')
    .find('[data-cy="question-input-container"]') 
    .should('exist') 
  });
   //cy.get('[name="attr-noSCNeeded"]').click()
   cy.get('[data-cy="short-question-input-14"').click( {force: true}).type("Numeric Question")
   cy.get('[data-cy="long-question-input-14"]').click( {force: true}).type("Numeric Question") .invoke('text').as('Q3')
   cy.get('[data-cy="long-question-input-14"]').then(($text1) => {
     const Q3 = $text1.text()
     cy.get('[data-cy="long-question-input-14"]').should('contain', Q3)
   cy.get('[data-cy="oid-input-14"]').type("Test2")
   cy.get('[data-cy="keyword-question-input-14"]').click( {force: true}).type("Visit_01")
   cy.get('[data-cy="number-max-digits-input-14"]').click( {force: true}).type("4")
 
   cy.get('[data-cy="right-menu-save-button"]').click()
 
   cy.wait(20000)
  

  //Click Library
  //cy.get('[data-cy="field-card-container-14"]').click()
  cy.get('[class="ant-tabs-tab"]',{ timeout:30000 }).dblclick()
  cy.dragAndDrop(
    '[data-cy="field-card-7"] .ant-row', 
    '.eiFHyU .ant-row',   0// Optional: Vertical offset if needed
  ).then(() => {
    cy.get('[data-cy="add-new-question-page"]')
    .find('[data-cy="question-input-container"]') 
    .should('exist')  // Assert it exists after drag-and-drop
    .and('be.visible')
  });
    //Third Question

 //cy.get('[name="attr-noSCNeeded"]').click()
  cy.get('[data-cy="short-question-input-16"').click({force: true}).type("ZZXX")
  cy.get('[data-cy="long-question-input-16"]').click( {force: true}).type("ZXZXX").invoke('text').as('Q4')
  cy.get('[data-cy="long-question-input-16"]').then(($text1) => {
    const Q4 = $text1.text()
    cy.get('[data-cy="long-question-input-16"]').should('contain', Q4)

  cy.get('[data-cy="oid-input-16"]').type("ZZXX")
  cy.get('[data-cy="keyword-question-input-16"]').click( {force: true}).type("XSZZZ")
  cy.get('[name="attr-markAsNoAnswer"]').click( {force: true})

  cy.get('[data-cy="right-menu-save-button"]').click()
  cy.wait(20000)
  
  
//Fourth Question
cy.get('[class="ant-tabs-tab"]').click()
cy.wait(20000)
cy.dragAndDrop(
  '[data-cy="field-card-5"]', 
  '.QuestionCanvas__Container-dHhNeJ',
  0 // Optional: Vertical offset if needed
).then(() => {
  cy.get('[data-cy="add-new-question-page"]')
  .find('[data-cy="question-input-container"]') 
  .should('exist') 
});
cy.wait(20000)
 cy.get('[name="attr-noSCNeeded"]').click()
  cy.get('[data-cy="short-question-input-18"]').click({force: true}).type("Upload File")
  cy.get('[data-cy="long-question-input-18"]').click( {force: true}).type("Upload").invoke('text').as('Q5')
  cy.get('[data-cy="long-question-input-18"]').then(($text1) => {
    const Q5 = $text1.text()
    cy.get('[data-cy="long-question-input-18"]').should('contain', Q5)

  cy.get('[data-cy="oid-input-18"]').type("FileUpload")
  cy.get('[name="attr-markAsNoAnswer"]').click( {force: true})

  cy.get('[data-cy="right-menu-save-button"]').click()
  cy.wait(20000)
  //Fifth Question
cy.get('[class="ant-tabs-tab"]').click()
cy.wait(20000)
cy.dragAndDrop(
  '[data-cy="field-card-8"]', 
  ('.QuestionCanvas__MainContainer-bSeVBC'),
  0 // Optional: Vertical offset if needed
).then(() => {
  cy.get('[data-cy="add-new-question-page"]')
  .find('[data-cy="question-input-container"]') 
  .should('exist') 
});
cy.wait(20000)

//cy.get('[name="attr-noSCNeeded"]').click()
 /*
cy.get('[data-cy="short-question-input-16"').click( {force: true}).type("ZZXX")
cy.get('[data-cy="long-question-input-16"]').click( {force: true}).type("ZXZXX").invoke('text').as('Question_3')
cy.get('[data-cy="oid-input-16"]').type("ZZXX")
cy.get('[data-cy="keyword-question-input-16"]').click( {force: true}).type("XSZZZ")
cy.get('[name="attr-markAsNoAnswer"]').click( {force: true})

cy.get('[data-cy="right-menu-save-button"]').click()
cy.wait(20000)

//Check Dev Tab
//cy.get('[data-cy="field-card-container-12"] > :nth-child(1) > .TopQuestionInfo__Container-eALmLQ > .ant-col-18').should('contain', 'Question_1')
//cy.get('[data-cy="field-card-container-14"] > :nth-child(1) > .TopQuestionInfo__Container-eALmLQ > .ant-col-18').should('contain', 'Question_3')
//cy.get('[data-cy="field-card-container-16"] > :nth-child(1) > .TopQuestionInfo__Container-eALmLQ > .ant-col-18').should('contain', 'Question_2')
*/
cy.get('[data-cy="header-logo"]',{ timeout:30000 }).click()
/*
//Delete the added Question
//Search study
cy.get('[data-cy="study-config-search-study"]').type("QAonCloud Test")   
cy.get('[class="Text__StyledText-fcSGOX liUSLx adjust-version mb-0.5"]')
  .contains("v.4.d")
  .then(() => {
    // Now check the second element
    return cy.get('#study-count-question').contains("3");
  });
  cy.get('[class="Text__StyledText-fcSGOX liUSLx adjust-version mb-0.5"]').contains("v.4.d").click()
  //CLick Edit study
  cy.get('[data-cy="btn-edit-study"]').click()
 //CLick visit
 cy.get('[data-cy="sidebar-toggle"]').click()

cy.get('[data-cy="visit-template-cm2q0o2bk0jjjzdk3d5c3fx0d"]').contains("Visit_01").click()
//Delete Added Questions
cy.get('[data-cy="delete-question-12"]').click()
cy.wait(1000)
cy.get('[data-cy="confirmModal-confirmButton"]').click()
cy.wait(1000)
cy.get('[data-cy="delete-question-12"]').click()
cy.wait(1000)
cy.get('[data-cy="confirmModal-confirmButton"]').click()
cy.wait(1000)
cy.get('[data-cy="delete-question-12"]').click()
cy.wait(1000)
cy.get('[data-cy="confirmModal-confirmButton"]').click()
cy.wait(1000)
*/
cy.get('[data-cy="header-user-popover-trigger"]').click()
cy.get('[data-cy="logout-text"]').click()
});
  
  })
})
 })
})
})
/*
it("Login as Source Capture user and check the Question in EDC and SDE Tab", () => {
  cy.viewport(1280, 720)
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
   cy.visit("https://qa.akyrian.com/"),
  cy.get('#email').focus()
  cy.get('#email').type("auto.sourcecapture@gmail.com")
  cy.get('#password').focus()
  cy.get('#password').type("Password!1", { log: false })
  cy.get('#loginAs-btn').click()
  cy.wait(10000)    
  //Search study
  //Search study  
  function getRandomLetters() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // All uppercase letters
    return letters.charAt(Math.floor(Math.random() * letters.length)) + 
           letters.charAt(Math.floor(Math.random() * letters.length));
  }           // Generates a random number between 0 and 9999
  const uniqueName = `DIVYA_${getRandomLetters()}`;
  cy.get('[data-cy="onboarding-search-study"]').type("QAonCloud Test")   
  cy.get('[class="Text__StyledText-fcSGOX liUSLx adjust-version mb-0.5"]').contains("v.4.d").click()
  //click Add Study Subject Button    
cy.wait(10000)         
cy.get('#add-patient-icon > .ant-row > :nth-child(2) > .Text__StyledText-fcSGOX').dblclick()
cy.get('[data-cy="button-submit-add-patient"]').should('be.disabled')
cy.get('#firstName').clear().type(uniqueName);
cy.get('#lastName').type("Automation01")
cy.get('#patientStudyId').clear().type(RandomvisitID)
cy.get('[data-cy="patient-site"]').click()
cy.get('input[type="radio"][name="FEMALE"]').check();
      //Add visit
    cy.get('[data-cy="select-year-addPatient"]').click()
    cy.get('[class="ant-select-item-option-content"]').contains('2023').click()
    cy.get('[data-cy="select-month-addPatient"]').click()
    cy.get('[class="ant-select-item-option-content"]').contains('January').click()
    cy.get('[data-cy="select-date-addPatient"]').click()
    cy.get("[title='7'] > .ant-select-item-option-content").click( )
         cy.get('[data-cy="button-submit-add-patient"]',{ timeout:30000 }).should('exist');
         cy.get('[data-cy="button-cancel-add-patient"]').should('exist');
        cy.get('[data-cy="button-submit-add-patient"]').click()
        //cy.get('[data-cy="button-cancel-add-patient"]').click()
    //Click start
    cy.get('[data-cy="button-start-visit"]',{ timeout:30000 }).click()
       cy.get('#sider-visit-list[data-visit-name="Visit_01"]',{ timeout:30000 }).click()

       cy.get('[data-cy="select-visit-status"] > .ant-select-selector').click()
       cy.get("[label='Visit Did Occur'] > .ant-select-item-option-content").click()
       cy.get('[data-cy="select-year"]').click()
       cy.get("[title='2023'] > .ant-select-item-option-content",{ timeout:30000 }).eq(1).click()
       cy.get('[data-cy="select-month"]').click()
        cy.get("[title='February'] > .ant-select-item-option-content",{ timeout:30000 }).eq(1).click()
   
        cy.get('[data-cy="select-date"]').click()
        cy.get("[title='5'] > .ant-select-item-option-content").click({force: true} )
        //Click Submit
        cy.get('[data-cy="button-submit-visit"]').click()
        //cy.get('#btn-cancel-add-visit').click()

//Check EDC Question
  cy.get('[data-cy="question-card"]',{ timeout:30000 }).then(($text1) => {
  const Q1 = $text1.val();
  cy.get('[data-cy="question-card"]',{ timeout:30000 }).should('contain', Q1)
  //Check SDE Question
  cy.get('[data-cy="sourceQuestionTab"]',{ timeout:30000 }).click()
  cy.get('[class="source-cards"]').eq(0).then(($text1) => {
    const Q2 = $text1.val();
    cy.get('[class="source-cards"]',{ timeout:30000 }).eq(0).should('contain', Q2)
    
      cy.get('[class="source-cards"]',{ timeout:30000 }).eq(1).then(($text1) => {
      const Q3 = $text1.val();
      cy.get('[class="source-cards"]').eq(1).should('contain', Q3)

//Click Logout
cy.get('[class="anticon anticon-down DownOutlined__Root-knxRmY jZCmAT img-icon img-right"]').click()
cy.get('[data-cy="logout-text"]').click()
})
    })
  })
})
*/

/*
it("Login as StudyConfig user and Delete the Question", () => {
  cy.AkyrianSDELogin_studyconfig(email,password)
//Delete the added Question
//Search study
cy.get('[data-cy="study-config-search-study"]').type("QAonCloud Test")   
cy.get('[class="Text__StyledText-fcSGOX liUSLx adjust-version mb-0.5"]')
.contains("v.4.d")
.then(() => {
  // Now check the second element
  return cy.get('#study-count-question').contains("3");
});
cy.get('[class="Text__StyledText-fcSGOX liUSLx adjust-version mb-0.5"]').contains("v.4.d").click()
//CLick Edit study
cy.get('[data-cy="btn-edit-study"]').click()
//CLick visit
cy.get('[data-cy="visit-name"]').contains("Visit_01").click()

//cy.get('[data-cy="visit-template-cm2q0o2bk0jjjzdk3d5c3fx0d"]').contains("Visit_01").click()
//Delete Added Questions
cy.get('[data-cy="delete-question-12"]',{ timeout:5000 }).click()
cy.get('[data-cy="confirmModal-confirmButton"]',{ timeout:5000 }).click()
cy.get('[data-cy="delete-question-12"]',{ timeout:5000 }).click()
cy.get('[data-cy="confirmModal-confirmButton"]',{ timeout:5000 }).click()
cy.get('[data-cy="delete-question-12"]',{ timeout:5000 }).click()
cy.get('[data-cy="confirmModal-confirmButton"]',{ timeout:5000 }).click()

cy.get('[data-cy="header-user-popover-trigger"]',{ timeout:5000 }).click()
cy.get('[data-cy="logout-text"]').click()
});
  })
*/