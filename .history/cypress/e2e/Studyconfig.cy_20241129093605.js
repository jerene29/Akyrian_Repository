/// <reference types="cypress" />
import StudyConfig from "../../PageObjects/Studyconfig.js"

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
    StudyConfig.logo.should('be.visible')
    StudyConfig.TextVersion.contains("SDE v.2.2.14 2.2.14 Qa").should('exist')
//Check Study Config User
StudyConfig.UserTitle.should('have.text','Hi, Study Config.')
StudyConfig.UserSubTitle.should('have.text','please select your study from the list below or add a new study')
//Check Add Study Button
StudyConfig.CreateStudyTitle.contains("Add New Study").should('be.visible')
//Check Recently Viewed
StudyConfig.RecentlyViewed.contains("Recently Viewed").should('be.visible')
//Check Tabs
StudyConfig.TabTitle_Dev.contains("DEVELOPMENT").should('exist')
StudyConfig.TabTitle_Stag.contains("STAGING").should('exist')
StudyConfig.TabTitle_UAT.contains("UAT").should('exist')
StudyConfig.TabTitle_Prod.contains("PRODUCTION").should('exist')
//Search study
StudyConfig.Search_Study.contains("Search")
StudyConfig.Search_Study.type("QAonCloud Test") 
//Check version  
StudyConfig.Study_Version.contains("v.4.d").click()
//Check Quick Actions menu
StudyConfig.Study_Settings.contains("Study Settings").should('exist')
StudyConfig.Study_Edit.contains("Rename").should('exist')
StudyConfig.Study_Clone.contains("+ New Study").should('exist')
StudyConfig.Icon_version.contains("+ Create v.4.e").should('exist')
StudyConfig.Create_Folder.contains("Create Folder").should('exist')
StudyConfig.Move_Folder.contains("Move to Folder").should('exist')
StudyConfig.Folder_Archive.contains("Archive").should('exist')
StudyConfig.Folder_Pause.contains("Pause").should('exist')
StudyConfig.Folder_Export.contains("Export Config").should('exist')
StudyConfig.Edit_Study.contains("Edit Study").should('exist')
StudyConfig.Quick_Actions.contains("Push to Staging").should('exist')

//CLick Edit study
StudyConfig.Edit_Study.click()
//Click  Study
StudyConfig.Add_Visit.click()
cy.wait(10000)
//Add visit
StudyConfig.Visit_Name.type("Visit_01")
StudyConfig.Visit_oid.type("D01")
StudyConfig.Visit_dayOffset.type("3")
StudyConfig.visit_days_before.type("3")
StudyConfig.Visit_days_after.type("3")
//StudyConfig.Add_Visit.click()
StudyConfig.AddVisit_Container.click()
//CLick visit
StudyConfig.Visit_Name.contains("Visit_01").click()
//Check VIew
StudyConfig.Detail_View.contains("Detail View")
StudyConfig.Grid_View.contains("Grid View")


/*
//Add Form
StudyConfig.Add_Form.click()
StudyConfig.Form_Input.type("Automation_Study")
StudyConfig.Form_OidInput.type("14")
StudyConfig.Submit_Form.click()

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
StudyConfig.noSCNeeded.click()
StudyConfig.Short_Que_1.click( {force: true}).type("Text Question")
StudyConfig.Long_Que_1.click( {force: true}).type("Text Question") .invoke('text').as('Q1')
StudyConfig.Long_Que_1.then(($text1) => {
    const Q1 = $text1.text()
StudyConfig.Long_Que_1.should('contain', Q1)
StudyConfig.OidInput_1.type("Test")
  //cy.get('[data-cy="keyword-question-input-12"]').type("Visit_01")
StudyConfig.Ques_Save.click()
cy.wait(20000)
//Click Library
StudyConfig.Click_Library.click()
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
StudyConfig.Short_Que_2.click( {force: true}).type("Numeric Question")
StudyConfig.Long_Que_2.click( {force: true}).type("Numeric Question") .invoke('text').as('Q3')
StudyConfig.Long_Que_2.then(($text1) => {
     const Q3 = $text1.text()
StudyConfig.Long_Que_2.should('contain', Q3)
StudyConfig.OidInput_2.type("Test2")
StudyConfig.KeyQuesInput_2.click( {force: true}).type("Visit_01")
StudyConfig.MaxQuesInput_2 .click( {force: true}).type("4")
 
StudyConfig.Ques_Save.click()
 
   cy.wait(20000)
  

  //Click Library
  //cy.get('[data-cy="field-card-container-14"]').click()
  StudyConfig.Click_Library_1.dblclick()
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
 StudyConfig.Short_Que_3.click({force: true}).type("ZZXX")
 StudyConfig.Long_Que_3.click( {force: true}).type("ZXZXX").invoke('text').as('Q4')
 StudyConfig.Long_Que_3.then(($text1) => {
    const Q4 = $text1.text()
StudyConfig.Long_Que_3.should('contain', Q4)
StudyConfig.OidInput_3.type("ZZXX")
StudyConfig.KeyQuesInput_3.click( {force: true}).type("XSZZZ")
StudyConfig.Mark_NoAns.click( {force: true})

  StudyConfig.Ques_Save.click()
  cy.wait(20000)
  
  
//Fourth Question
StudyConfig.Click_Library_1.dblclick()
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
StudyConfig.noSCNeeded.click()
StudyConfig.Short_Que_4.click({force: true}).type("Upload File")
StudyConfig.Long_Que_4.click( {force: true}).type("Upload").invoke('text').as('Q5')
StudyConfig.Long_Que_4.then(($text1) => {
    const Q5 = $text1.text()
    StudyConfig.Long_Que_4.should('contain', Q5)

    StudyConfig.OidInput_4.type("FileUpload")
  StudyConfig.Mark_NoAns.click( {force: true})

  StudyConfig.Ques_Save.click()
  cy.wait(20000)
  /*
  cy.get('[data-cy="field-card-container-18"]').click()
  //Fifth Question
cy.get('[class="ant-tabs-tab"]').click()
cy.wait(20000)

cy.dragAndDrop(
  '[data-cy="field-card-8"]', 
  '[class="QuestionCanvas__Group-eNrJmB cupvXx"]',
  50 // Optional: Vertical offset if needed
).then(() => {
  cy.get('[data-cy="add-new-question-page"]')
  .find('[data-cy="question-input-container"]') 
  .should('exist') 
});
cy.wait(20000)
*/
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
StudyConfig.logo.click()
StudyConfig.Profile_Header.click()
StudyConfig.Logout.click()
});
})
})
})
})

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
  StudyConfig.Search_Study_1.type("QAonCloud Test")   
  StudyConfig.Study_Version_1.contains("v.4.d").click()
  //click Add Study Subject Button    
cy.wait(10000)         
StudyConfig.Add_Patient.dblclick()
StudyConfig.Add_Patient_submit.should('be.disabled')
StudyConfig.Add_Patient_FirstName.clear().type(uniqueName);
StudyConfig.Add_Patient_LastName.type("Automation01")
StudyConfig.Add_Patient_ID.clear().type(RandomvisitID)
StudyConfig.Click_PatientSite.click()
StudyConfig. Add_Patient_Gender.check();
      //Add visit
      StudyConfig.Add_Patient_Year.click()
      StudyConfig.Select_Add_Patient_Dropdowm.contains('2023').click()
      StudyConfig.Select_Add_Patient_Month.click()
      StudyConfig.Select_Add_Patient_Dropdowm.contains('January').click()
      StudyConfig.Select_Add_Patient_Date.click()
      StudyConfig.Select_Add_Patient_DateOption.click( )
      StudyConfig.Add_Patient_submit.should('exist');
      StudyConfig.Add_Patient_Cancel.should('exist');
      StudyConfig.Add_Patient_submit.click()
        //cy.get('[data-cy="button-cancel-add-patient"]').click()
    //Click start
    StudyConfig.Start_PatientVisit.click()
    StudyConfig.Visit_List.click()

    StudyConfig.Select_Visit.click()
    StudyConfig.Select_VisitOccur.click()
    StudyConfig.Select_VisitYear.click()
    StudyConfig.Select_VisitYearOption.click()
    StudyConfig.Select_VisitMonth.click()
    StudyConfig.Select_VisitMonthOption.click()
   
    StudyConfig.Select_VisitDate.click()
    StudyConfig.Select_VisitDateOption.click({force: true} )
        //Click Submit
        StudyConfig.Submit_Visit.click()
        //cy.get('#btn-cancel-add-visit').click()

//Check EDC Question
StudyConfig.Question_Card.then(($text1) => {
  const Q1 = $text1.val();
  StudyConfig.Question_Card.should('contain', Q1)
  //Check SDE Question
  StudyConfig.SourceTab.click()
  StudyConfig.Source_cards.eq(0).then(($text1) => {
    const Q2 = $text1.val();
    StudyConfig.Source_cards.eq(0).should('contain', Q2)
    
    StudyConfig.Source_cards.eq(1).then(($text1) => {
      const Q3 = $text1.val();
      StudyConfig.Source_cards.eq(1).should('contain', Q3)

//Click Logout
StudyConfig.SC_ProfileHeader.click()
StudyConfig.Source_cards.Logout.click()
})
})
})
})



it("Login as StudyConfig user and Delete the Question", () => {
  cy.AkyrianSDELogin_studyconfig(email,password)
//Delete the added Question
//Search study
StudyConfig.Search_Study.type("QAonCloud Test")   
StudyConfig.Study_Version
.contains("v.4.d")
.then(() => {
  // Now check the second element
  return StudyConfig.Study_Count.contains("4");
});
StudyConfig.Study_Version.contains("v.4.d").click()
//CLick Edit study
StudyConfig.Edit_Study.click()
//CLick visit
StudyConfig.Visit_Name.contains("Visit_01").click()

//cy.get('[data-cy="visit-template-cm2q0o2bk0jjjzdk3d5c3fx0d"]').contains("Visit_01").click()
//Delete Added Questions
StudyConfig.Delete_Question.click()
StudyConfig.Confirm_Delete_Question.click()
StudyConfig.Delete_Question.click()
StudyConfig.Confirm_Delete_Question.click()
StudyConfig.Delete_Question.click()
StudyConfig.Confirm_Delete_Question.click()
StudyConfig.Delete_Question.click()
StudyConfig.Confirm_Delete_Question.click()
StudyConfig.Profile_Header.click()
StudyConfig.Logout.click()
});
})