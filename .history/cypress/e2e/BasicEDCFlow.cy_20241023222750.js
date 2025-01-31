

/// <reference types="cypress" />
import Loginpage from "../../support/Pageobjects/Login";

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
describe('Akyrian Login', function() {
it("Login to the Portal", () => {
cy.AkyrianLogin(email,password)

//After login verify Dashboard Page
Loginpage.logo_AfterLogin.should('be.visible')
Loginpage.logo_Text.contains("Good Day,").should('exist')
Loginpage.logo_Text1.contains("Streamline SC").should('exist')
Loginpage.Study_Text.contains("Select your study :").should('exist')
//Check Side panel buttons
cy.get('[data-cy="btn-study"]').contains("New Assigned Studies")
cy.get('[data-cy="btn-study"]').contains("New Paused Studies")
//Check Study Cards
cy.get('[class="Text__StyledText-fcSGOX fvNYh study-name ellipsis mb-0.5"]').contains("QAonCloud Test")
cy.get('[class="Text__StyledText-fcSGOX liUSLx adjust-version mb-0.5"]').contains("v.4.a")
cy.get('#study-count-visit').should('be.visible')
cy.get('#study-count-question').should('be.visible')
//Check Tabs (UAT,STG)c
cy.get('#env-selector-DEVELOPMENT').click()
cy.get('#env-selector-STAGING').click()
cy.get('#env-selector-UAT').click()
cy.get('#env-selector-PRODUCTION').click()
//Check Profile Dropdown
cy.get('[data-cy="header-user-popover-trigger"]').click()   
cy.get('[data-cy="last-login-date"]').should('be.visible')
cy.get('[data-cy="last-login-time"]').should('be.visible')
cy.get('[data-cy="btn-edit-profile"]').contains("Edit Profile").should('be.visible')
cy.get('[data-cy="logout-text"]').contains("Logout").should('be.visible')
//Check Edit Profile popupcy.get('[data-cy="btn-edit-profile"]').click()cy.get('[class="Text__StyledText-fcSGOX kNgNur ml-3"]').contains("Edit Profile").should('be.visible')cy.get('[data-cy="edit-profile-change-password-button"]').contains("Change Password")
cy.get('[data-cy="edit-profile-save-button"]').contains("Done").should('be.visible')
cy.get('[data-cy="edit-profile-cancel-button"]').contains("Cancel").click()
//Check Search Studycy.get('[data-cy="onboarding-search-study"]').type("QAonCloud Test")
cy.get('[class="Text__StyledText-fcSGOX gOUrvZ right clear-text pointer"]').click()
//Check Links  (bottom links)
cy.get('[class="Text__StyledText-fcSGOX YAXFE pointer"]').contains("Data Privacy Statement")
cy.get('[class="Text__StyledText-fcSGOX YAXFE pointer"]').contains("Privacy & Policy")
//Study Page
//Search study
cy.get("#study-version").contains('v.4.b').click()
cy.wait(1000)
Loginpage.Allstudy_Text.contains("All Sites & Study Subjects").should('exist')
cy.wait(5000)
//Check Tabs
cy.get('[data-cy="noSourceQuestionTab"]').contains("EDC (Traditional)").should('exist')
cy.get('[data-cy="sourceQuestionTab"]').contains("Source Capture Questions (SDE)").should('exist')
//Check Side Panel
cy.get('[class="Text__StyledText-fcSGOX gSpvOG sider-patient-name"]').contains("QA_AU-01").should('exist')
cy.get('[class="Text__StyledText-fcSGOX FjWUc patient-gender-dob"]').contains("Male, 01 Jul 1972").should('exist')
cy.get('[class="Sider__Wrapper-hsXPIG jTnfEX sidebar-patient-initial-badge"]').contains("ML").should('exist')
cy.get('[class="Text__StyledText-fcSGOX gSpvOG sider-patient-name"]').contains("QA_AU-01").click()

/*//Check the count of Incomplete Questions
cy.get('[class="StatusIndicator__IndicatorCircle-dYxCWK jjdcaZ ant-tooltip-open"]').trigger('mouseover')
//Check Sider Filter
cy.get('[class="sidebar-filter-icon"]').click()
cy.get('[data-cy="0-option"].Sider__SelectableOption-rVhHg').contains("Expand Site")
cy.get('[data-cy="1-option"].Sider__SelectableOption-rVhHg').contains("Collapse Site")
cy.get('[data-cy="0-filter"].Sider__SelectableOption-rVhHg').contains("Study ID")
cy.get('[data-cy="1-filter"].Sider__SelectableOption-rVhHg').contains("Outstanding Task")
cy.get('[data-cy="2-filter"].Sider__SelectableOption-rVhHg').contains("Unverified Question")
cy.get('[data-cy="3-filter"].Sider__SelectableOption-rVhHg').contains("Unresolved Query")
cy.get('[data-cy="4-filter"].Sider__SelectableOption-rVhHg').contains("Answered Query")
cy.get('[data-cy="5-filter"].Sider__SelectableOption-rVhHg').contains("Query Newly Assigned To Me")
//Check Buttons
cy.get('#add-patient-icon').click()
cy.get('[data-cy="button-cancel-add-patient"]').click()
//Visit Page
//click visit 3
cy.get('[data-cy="visit-cm24cnm8k02mxvx8auqnhq355"]').contains("new visit 3").click()
cy.wait(5000)
//Check Tabs
cy.get('[data-cy="all-filter"]').click()
cy.get('[data-cy="UNFILLED"]').click()
cy.get('[data-cy="REJECTED"]').click()
cy.get('[data-cy="FILLED"]').click()
cy.get('[data-cy="ACCEPTED_FROM_SOURCE_CAPTURE"]').click()
//Check Links
cy.get('[data-cy="todolist-UNFILLED"]').contains("5 item(s) that need to be answered").click()
//Check Search fields
cy.get('[class="Search__Container-gdsMBV jauHxI"]').type("date")
cy.get('[class="Text__StyledText-fcSGOX gOUrvZ right clear-text pointer"]').click()
//Check Button
cy.get('#add-visit-modal-button').contains("+ Add Visit").click()

//Check Visit date (year, month,day) dropdowns
cy.get('[data-cy="select-year-addVisit"]').click()
cy.get('[data-cy="select-month-addVisit"]').click()
cy.get('[data-cy="select-date-addVisit"]').click()
cy.get('#add-visit-select').click()
cy.get('#btn-submit-add-visit').contains("Submit")
cy.get('#btn-cancel-add-visit').contains("Cancel").click()
//Check Color
cy.get('[class="Button__Container-gknlFx hMdVMW all-button"]').should('have.css', 'background-color', 'rgb(61, 97, 215)')
cy.get('[class="Button__Container-gknlFx idcgYq QuestionsFilter__ButtonFilterQuestion-gZbsvJ kTWwIu Unanswered"]').should('have.css', 'background-color', 'rgb(215, 20, 99)')
cy.get('[class="Button__Container-gknlFx fiEsKW QuestionsFilter__ButtonFilterQuestion-gZbsvJ koCdoQ Rejected"]').should('have.css', 'background-color', 'rgb(160, 4, 69)')
cy.get('[class="Button__Container-gknlFx dYAXcg QuestionsFilter__ButtonFilterQuestion-gZbsvJ WxvsK Answered"]').should('have.css', 'background-color', 'rgb(0, 118, 114)')
cy.get('[class="Button__Container-gknlFx dYAXcg QuestionsFilter__ButtonFilterQuestion-gZbsvJ kgOsCc PendingApproval"]').should('have.css', 'background-color', 'rgb(0, 118, 114)')
//Questions Check Text Fields
cy.get('[data-cy="all-filter"]').click()
cy.get('[data-cy="question-title-cm226tq6o0kz814ev5hs86itn"]').contains("Indication/Diagnosis:(T)").should('exist')
cy.get('[data-cy="question-title-cm226tqch0kzg14evi17ksxwu"]').contains("Start Date Medication:").should('exist')
cy.get('[data-cy="question-title-cm226tqxy0l0z14ev4ggwb5pe"]').contains("What are the dosage, frequency, duration, and mode of delivery?(N)").should('exist')
cy.get('[data-cy="question-title-cm226tqgo0kzo14evx8adxtw7"]').contains("Date of Service").should('exist')
cy.get('[data-cy="question-title-cm226tr0x0l1714evkv8gwe2j"]').contains("any Social Hx (MS)").should('exist')
//Check Tabs (Unanswered)
cy.get('[data-cy="UNFILLED"]').click()
cy.get('[data-cy="question-title-cm226tq6o0kz814ev5hs86itn"]').contains("Indication/Diagnosis:(T)").should('exist')
cy.get('[data-cy="question-title-cm226tqch0kzg14evi17ksxwu"]').contains("Start Date Medication:").should('exist')
//Questions Check Text Fields
cy.get('[data-cy="all-filter"]').click()
cy.get('[data-cy="question-title-cm226tq6o0kz814ev5hs86itn"]').contains("Indication/Diagnosis:(T)").should('exist')
cy.get('[data-cy="question-title-cm226tqch0kzg14evi17ksxwu"]').contains("Start Date Medication:").should('exist')
cy.get('[data-cy="question-title-cm226tqxy0l0z14ev4ggwb5pe"]').contains("What are the dosage, frequency, duration, and mode of delivery?(N)").should('exist')
cy.get('[data-cy="question-title-cm226tqgo0kzo14evx8adxtw7"]').contains("Date of Service").should('exist')
cy.get('[data-cy="question-title-cm226tr0x0l1714evkv8gwe2j"]').contains("any Social Hx (MS)").should('exist')
//Check Tabs (Unanswered)
cy.get('[data-cy="UNFILLED"]').click()
cy.get('[data-cy="question-title-cm226tq6o0kz814ev5hs86itn"]').contains("Indication/Diagnosis:(T)").should('exist')
cy.get('[data-cy="question-title-cm226tqch0kzg14evi17ksxwu"]').contains("Start Date Medication:").should('exist')
cy.get('[data-cy="question-title-cm226tqxy0l0z14ev4ggwb5pe"]').contains("What are the dosage, frequency, duration, and mode of delivery?(N)").should('exist')
cy.get('[data-cy="question-title-cm226tqgo0kzo14evx8adxtw7"]').contains("Date of Service").should('exist')
cy.get('[data-cy="question-title-cm226tr0x0l1714evkv8gwe2j"]').contains("any Social Hx (MS)").should('exist')

cy.get('[data-cy="all-filter"]').click()
cy.get('[data-cy="answer-input-field-cm226tq8y0kzb14ev67n9vigy-0-0"]').type("hypertension")
cy.get('[data-cy="save-button-cm226tq6o0kz814ev5hs86itn"]').click()
cy.wait(5000)
cy.get('[data-cy="FILLED"]').click()
cy.get('[data-cy="question-title-cm226tq6o0kz814ev5hs86itn"]').contains("Indication/Diagnosis:(T)").should('exist')
//Check Date Picker and Time picker
cy.get('[data-cy="all-filter"]').click()
cy.get('[class="ant-picker-input"]').eq(0).click()
cy.get('[class="ant-picker-cell ant-picker-cell-in-view"]', { timeout: 10000 }).contains('30').click()
cy.get('[class="ant-picker-time-panel-cell-inner"]', { timeout: 10000 }).contains('2').click()
cy.get('[class="ant-btn ant-btn-primary ant-btn-sm"]').click()
cy.wait(1000)
cy.get('[data-cy="save-button-cm226tqch0kzg14evi17ksxwu"]').click()
cy.wait(10000)
//Check the "Numeric Fields" Questions 
cy.get('[data-cy="question-title-cm226tqxy0l0z14ev4ggwb5pe"]').contains("What are the dosage, frequency, duration, and mode of delivery?(N)").should('exist')
cy.get('[data-cy="answer-input-field-cm226tqyh0l1214evogzolxqj-0-0"]').type("22")
cy.get('[data-cy="save-button-cm226tqxy0l0z14ev4ggwb5pe"]').click()
cy.wait(5000)
//Check the "Date Picker" Question 
cy.get('[class="ant-picker-input"]').click()
cy.get('[class="ant-picker-cell ant-picker-cell-in-view"]', { timeout: 10000 }).contains('24').click()
cy.get('[data-cy="save-button-cm226tqgo0kzo14evx8adxtw7"]').click()
cy.wait(5000)
//Check the "Radio Buttons" Question 
cy.get('[class="ant-radio-group ant-radio-group-outline radio-group-single-select coachmark_streamlinesc_dataEntryField"]').contains('Mark as No Answer').click()
cy.get('[data-cy="no-answer-reason-select-cm226tr0x0l1714evkv8gwe2j"]').click()
cy.get('.ant-select-item-option-active').contains("No Source - Mark No Answer").click()
//cy.get('[data-cy="no-answer-reason-select-cm226tr0x0l1714evkv8gwe2j"]').type("Noanswer")
cy.get('[data-cy="save-button-cm226tr0x0l1714evkv8gwe2j"]').click()
cy.wait(5000)
//Check Pending Approval Tab
cy.get('[data-cy="ACCEPTED_FROM_SOURCE_CAPTURE"]').click()
cy.get('[data-cy="question-title-cm226tr0x0l1714evkv8gwe2j"]').contains("any Social Hx (MS)").should('exist')
cy.wait(5000)
*/
//click visit 2
cy.get('[data-cy="visit-cm24cnm8k02myvx8axc1nvmwr"]').contains("new visit 2").click()
//Check the "Dropdown" Type Question 
cy.get('[data-cy="question-title-cm226tqn10l0414ev9hpkhqab"]').contains("Do you have any pre-existing medical conditions (e.g., diabetes, heart disease, high blood pressure)? (Yes/No)").should('exist')
cy.get('[data-cy="visit-cm24cnm8k02myvx8axc1nvmwr"]').contains("new visit 2").click()
cy.get('[data-cy="answer-input-field-cm226tqnl0l0714evp289p8ge-0-0"]').click()
cy.get('[class="ant-select-item-option-content"]').contains("high blood pressure -C").click()
cy.get('[data-cy="save-button-cm226tqn10l0414ev9hpkhqab"]').click()
cy.wait(5000)
//Check the "Upload Image" Question 
cy.get('[data-cy="question-title-cm226tqux0l0r14eviw2uuutm"]').contains("Source capture for investigator review").should('exist')
cy.get('[class="Text__StyledText-fcSGOX gOxGSv"]').contains("Upload a file").click()
cy.get('[data-cy="confirmation-modal-title"]').contains("Warning").should('exist')
cy.get('[data-cy="confirmation-modal-desc"]').contains("Do not upload any file that contains Personally Identifiable Information (PII). If the file you are uploading contains PII, please redact them on the next step.").should('exist')
cy.get('[data-cy="confirmation-modal-validationInfo"]').contains("You can only upload the following file types: JPEG, PNG or PDF with a 10 MB limit.").should('exist')
cy.get('[data-cy="confirmModal-confirmButton"]').contains("Upload File").should('exist')
cy.get('[data-cy="confirmModal-cancelButton"]').contains("Never Mind").should('exist')
cy.wait(15000)
cy.wait(5000)
cy.get('[data-cy="confirmModal-confirmButton"]').click()
const filepath = 'SCImage.png'; 
// Path to your PNG file
cy.get('input[type="file"]').attachFile(filepath);
cy.get('[data-cy="start-redact-or-continue"]').scrollIntoView() 
cy.wait(15000)
cy.get('[class="Button__Container-gknlFx gLNRtR btn-continue"]', { timeout: 10000 }).click({ force: true })
cy.wait(15000)

cy.get('[data-cy="confirm-redact-button"]').click()
cy.get('[data-cy="save-button-cm226tqux0l0r14eviw2uuutm"]').click()
/*cy.get('[data-cy="confirmModal-confirmButton"]').then(($button) => {
    $button[0].click({ force: true })
});
cy.wait(5000)
const PNG= 'Image_sc.png'
cy.wait(1000)
cy.get('[data-cy="confirmModal-confirmButton"]').attachFile(PNG);
cy.get('[data-cy="confirmModal-confirmButton"]').then(($button) => {
$button[0].click({ force: true })
});



//click visit 3
cy.get('[data-cy="visit-cm24cnm8k02mxvx8auqnhq355"]').contains("new visit 3").click()
cy.wait(5000)




//Mark as No answer
cy.get('[data-cy="FILLED"]').click()
cy.get('[data-cy="noanswer-action-cm226tq6o0kz814ev5hs86itn"]').click({ force: true })
cy.get('[data-cy="mark-no-answer-change-reason-select"]').click()

cy.get('[class="ant-select-item-option-content"]').contains("Other").click()
cy.get('#mark-no-answer-change-reason-select-id').type('Change')
cy.wait(5000)
cy.get('[data-cy="button-submit-noanswer"]').click()
//Check the Reset Pop up
cy.get('[data-cy="reset-answer-action-icon-cm226tq6o0kz814ev5hs86itn"]').click({ force: true })
cy.get('[data-cy="modal-title"]').contains("Reset Answer - Indication/Diagnosis:(T)").should('exist')
cy.get('[data-cy="question-label-free-text"]').contains("Indication/Diagnosis: ").should('exist')
cy.get('[data-cy="question-answer-free-text"]').contains("hypertension").should('exist')
cy.get('[data-cy="reset-answer-modal-description"]').contains("This item will be moved back to Unanswered").should('exist')
cy.get('[data-cy="reset-answer-select"]').contains("Put your reason here").should('exist')
cy.get('[data-cy="reset-answer-select"]').click()
cy.get('[class="ant-select-item ant-select-item-option ant-select-item-option-active"]').contains("Other").click()
cy.get('#rc_select_15').type("resetanswer")
cy.get('[data-cy="button-submit-reset-answer"]').contains("Submit").should('exist')
cy.get('[data-cy="cancel-submit-reset-answer"]').contains("Cancel").should('exist')
cy.get('[data-cy="button-submit-reset-answer"]').click()

//Edit Answer
cy.get('[data-cy="change-answer-action-icon-cm226tq6o0kz814ev5hs86itn"]').click({ force: true })
cy.get('[data-cy="answer-input-field-cm226tq8y0kzb14ev67n9vigy-0-0"]').clear().type("LowBP")
cy.wait(5000)
cy.get('[data-cy="edit-reason-select-cm226tq6o0kz814ev5hs86itn"]').click()
cy.get('[class="ant-select-item-option-content"]').contains("Other").click()
cy.get('#rc_select_4').type('Change')
cy.get('[data-cy="save-button-cm226tq6o0kz814ev5hs86itn"]').click()
//Check Dropdown
cy.get('#rc_select_12').type("resetanswer")
cy.get('[data-cy="button-submit-reset-answer"]').contains("Submit").should('exist')
cy.get('[data-cy="cancel-submit-reset-answer"]').contains("Cancel").should('exist')
cy.get('[data-cy="button-submit-reset-answer"]').click()

cy.get('[data-cy="all-filter"]').click()
//Check Dropdown
cy.get('[data-cy="FILLED"]').click()

Loginpage.SDE_Text.contains("Source Capture Questions (SDE)").should('exist')
Loginpage.Add_study.contains("Add Study Subject").should('exist')
Loginpage.EDC_Hint.click()
Loginpage.EDC_Hint1.contains("These are CRF questions that have no source data").should('exist')
Loginpage.SDE_Hint.click()
Loginpage.SDE_Hint1.contains("These are CRF questions that have source documents such as the Electronic Medical Records, lab reports, etc.").should('exist')
Loginpage.EDC.click()
Loginpage.Stream_Text.contains("Hi, Streamline SC.").should('exist')
Loginpage.Click_StudySubject.click()
Loginpage.StudySubject.contains("QA_AU-01").should('exist')
//click visit 3
Loginpage.Click_Newvisit.contains("new visit 3").click()
cy.wait(5000)
//Check the screen
Loginpage.All.contains("All").should('exist')
//Loginpage.Unanswered.contains("Unanswered").should('exist')
//Loginpage.Rejected.contains("Rejected").should('exist')
//Loginpage.Answered.contains("Answered").should('exist')
//Loginpage.Pending_Approval.contains("Pending Approval").should('exist')
Loginpage.Q1.contains("Indication/Diagnosis:(T)").should('exist')
Loginpage.Q11Type.type("hypertension")Loginpage.Save.click()
cy.wait(5000)
Loginpage.Answered_Tab.click()Loginpage.Q1.contains("Indication/Diagnosis:(T)").should('exist')
Loginpage.All_Tab.click()Loginpage.Q2.should('contain', "What are the dosage, frequency, duration, and mode of delivery?(N)");
Loginpage.Q1Type.click().type("22")
Loginpage.Save.click()cy.wait(5000)
Loginpage.Answered_Tab.click()
Loginpage.Q2.contains("What are the dosage, frequency, duration, and mode of delivery?(N)").should('exist')
Loginpage.All_Tab.click()
Loginpage.Q2.contains("Date of Service").should('exist')
Loginpage.Q2Type.click()
cy.get('[class="ant-picker-cell ant-picker-cell-in-view"]', { timeout: 10000 }).contains('24').click()
Loginpage.Save.click()
cy.wait(5000)
Loginpage.Answered_Tab.click()
Loginpage.Q2.contains("Date of Service").should('exist')
Loginpage.All_Tab.click()
Loginpage.Q4.contains("any Social Hx (MS)").should('exist')
Loginpage.No.click()
cy.wait(1000)
Loginpage.Save.click()
cy.wait(5000)
Loginpage.Answered_Tab.click()
Loginpage.Q4.contains("any Social Hx (MS)").should('exist')
Loginpage.All_Tab.click()
//Click Answered Tab and check the status
Loginpage.Answered_Tab.click()
Loginpage.Q1.contains("Indication/Diagnosis:(T)").should('exist')
Loginpage.Q2.contains("What are the dosage, frequency, duration, and mode of delivery?(N)").should('exist')
Loginpage.Q3.contains("Date of Service").should('exist')
Loginpage.Q4.contains("any Social Hx (MS)").should('exist')
//Reset Answers
//Loginpage.Answered_Q1.eq(0).trigger('mouseover')
cy.wait(10000)
Loginpage.Reset_Answer.click()
 // Ensure the reset button is visible after hovering
cy.wait(1000)
Loginpage.Reset_Answer_Title.contains("Reset Answer - Indication/Diagnosis:(T)").should('exist')
Loginpage.Reset_Answer_Title1.contains("Indication/Diagnosis: ").should('exist')
Loginpage.Reset_Answer_Title2.contains("hypertension").should('exist')
Loginpage.Reset_Answer_Title3.contains("This item will be moved back to Unanswered").should('exist')
Loginpage.Reset_Dropdown_Title.contains("Put your reason here").should('exist')
Loginpage.Reset_Dropdown.click()
Loginpage.Reset_Dropdown_select.click()
Loginpage.Reset_Dropdown_Type.type("resetanswer")
Loginpage.Reset_Submit.contains("Submit").should('exist')
Loginpage.Reset_Cancel.contains("Cancel").should('exist')
Loginpage.Reset_Submit.click()
//click All Tab
Loginpage.All_Tab.click()
Loginpage.Q1.contains("Indication/Diagnosis:(T)").should('exist')

Loginpage.Answered_Tab.click()
Loginpage.Q2.contains("What are the dosage, frequency, duration, and mode of delivery?(N)").should('exist')
Loginpage.Reset_Answer.click()
Loginpage.Reset_Answer_Title.contains("Reset Answer - What are the dosage, frequency, duration, and mode of delivery?(N)").should('exist')
Loginpage.Reset_Answer_Title1.contains("INTERVENTION").should('exist')
Loginpage.Reset_Answer_Title2.contains("22").should('exist')
Loginpage.Reset_Answer_Title3.contains("This item will be moved back to Unanswered").should('exist')
Loginpage.Reset_Dropdown_Title.contains("Put your reason here").should('exist')
Loginpage.Reset_Dropdown.click()
Loginpage.Reset_Dropdown_select.click()
Loginpage.Reset_Dropdown_Type.type("resetanswer")
Loginpage.Reset_Submit.contains("Submit").should('exist')
Loginpage.Reset_Cancel.contains("Cancel").should('exist')
Loginpage.Reset_Submit.click()

//click All Tab
Loginpage.All_Tab.click()
Loginpage.Q2.contains("What are the dosage, frequency, duration, and mode of delivery?(N)").should('exist')

Loginpage.Answered_Tab.click()
Loginpage.Q1.contains("Date of Service").should('exist')
Loginpage.Reset_Answer.click()
Loginpage.Reset_Answer_Title.contains("Reset Answer - Date of Service").should('exist')
Loginpage.Reset_Answer_Title1.contains("Date of Service").should('exist')
Loginpage.Reset_Answer_Title2.contains("October 24th 2024").should('exist')
Loginpage.Reset_Answer_Title3.contains("This item will be moved back to Unanswered").should('exist')
Loginpage.Reset_Dropdown_Title.contains("Put your reason here").should('exist')
Loginpage.Reset_Dropdown.click()
Loginpage.Reset_Dropdown_select.click()
Loginpage.Reset_Dropdown_Type.type("resetanswer")
Loginpage.Reset_Submit.contains("Submit").should('exist')
Loginpage.Reset_Cancel.contains("Cancel").should('exist')
Loginpage.Reset_Submit.click()

//click All Tab
Loginpage.All_Tab.click()
Loginpage.Q3.contains("Date of Service").should('exist')

Loginpage.Answered_Tab.click()
Loginpage.Q1.contains("any Social Hx (MS)").should('exist')
Loginpage.Reset_Answer.click()
Loginpage.Reset_Answer_Title.contains("Reset Answer - any Social Hx (MS)").should('exist')
Loginpage.Reset_Answer_Title1.contains("Do you have any Social Hx").should('exist')
Loginpage.Reset_Answer_Title2.contains("NO").should('exist')
Loginpage.Reset_Answer_Title3.contains("This item will be moved back to Unanswered").should('exist')
Loginpage.Reset_Dropdown_Title.contains("Put your reason here").should('exist')
Loginpage.Reset_Dropdown.click()
Loginpage.Reset_Dropdown_select.click()
Loginpage.Reset_Dropdown_Type.type("resetanswer")
Loginpage.Reset_Submit.contains("Submit").should('exist')
Loginpage.Reset_Cancel.contains("Cancel").should('exist')
Loginpage.Reset_Submit.click()
//click All Tab
Loginpage.All_Tab.click()
Loginpage.Q4.contains("any Social Hx (MS)").should('exist')
//Click Unanswered Tab
Loginpage.Unanswered_Tab.click()
Loginpage.Q1.contains("Indication/Diagnosis:(T)").should('exist')
Loginpage.Q2.contains("What are the dosage, frequency, duration, and mode of delivery?(N)").should('exist')
Loginpage.Q3.contains("Date of Service").should('exist')
Loginpage.Q4.contains("any Social Hx (MS)").should('exist')
*/
})
})