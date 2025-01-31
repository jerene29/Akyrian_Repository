class SDE_HappyFlow{
    
    get Search_Study(){
    return cy.get('[data-cy="onboarding-search-study"]')
    }
    get Study_Version(){
    return cy.get('[class="Text__StyledText-fcSGOX liUSLx adjust-version mb-0.5"]')
    }

    get Patient_Name(){
    return cy.get('[class="Text__StyledText-fcSGOX gSpvOG sider-patient-name"]', { timeout: 10000 })
    }

    get Click_VisitName(){
    return cy.get('[data-cy="visit-cm3hbwbcu1oydigpb1zmetr4c"][data-visit-name="AUTOMATION-sign-CRF"]', { timeout: 30000 })
    }
    get SDE_Tab(){
    return cy.get('[data-cy="sourceQuestionTab"]', { timeout: 30000 })
    }
    get Question_Card_1(){
    return cy.get('[data-cy="question-card-cm2n696qj08n8zdk3hgiru340"] > [data-cy="question-card"]', { timeout: 50000 })
    }
    get Question_Card_2(){
    return cy.get('[data-cy="question-card-cm2n69vn408nhzdk3qzqxsxnv"] > [data-cy="question-card"]', { timeout: 10000 })
    }
    get Question_CardReattach_1(){
    return cy.get("[data-cy='reattach-action-cm2n69vn408nhzdk3qzqxsxnv'] > .question-card-action-menu-icon")
    }
    get Question_CardReattach_2(){
    return cy.get("[data-cy='reattach-action-cm2n6fno508ntzdk3qjay0ip3'] > .question-card-action-menu-icon", { timeout: 30000 })
 }
    get Question_Card_3(){
    return cy.get('[data-cy="question-card-cm2n6fno508ntzdk3qjay0ip3"] > [data-cy="question-card"]', { timeout: 10000 })
        }
    get Question_Card(){
    return cy.get('[data-cy="question-card-cm2n6j4ki08p8zdk3d4xchxo9"] > [data-cy="question-card"]', { timeout: 40000 })
    }
    get Open_ModalCapture(){
    return cy.get('[data-cy="open-modal-capture"]:visible', { timeout: 40000 })
    }
    get Upload_File(){
    return cy.get('[data-cy="upload-sc-button"]', { timeout: 10000 })
    }
    get File_Upload(){
    return cy.get('input[type="file"]', { timeout: 30000 })
    }
    get Verification(){
    return cy.get('[class="Text__StyledText-fcSGOX kZdsfX mb-3"]', { timeout: 30000 })
    }
    get PatientsName_Data(){
        return cy.get('[data-cy="verified-data-patientsName"]', { timeout: 40000 })
        }
    get PatientsName_NoData(){
    return cy.get('[data-cy="not-found-data-patientsName"]', { timeout: 30000 })
    }
    get DOB_Data(){
        return cy.get('[data-cy="verified-data-dateOfBirth"]', { timeout: 40000 })
    }
    get DOB_NoData(){
        return cy.get('[data-cy="not-found-data-dateOfBirth"]', { timeout: 40000 })
    }
    get Visitdate_data(){
        return cy.get('[data-cy="verified-data-visitDate"]', { timeout: 40000 })
    }
    get Visitdate_noData(){
        return cy.get('[data-cy="not-found-data-visitDate"]', { timeout: 40000 })
    }
    get Manual_React(){
        return cy.get('[data-cy="manual-redact-button"]', { timeout: 30000 })
    }
    get React_Action(){
        return cy.get('[data-cy="reattach-action"]', { timeout: 40000 })
    }
    get Reattach(){
        return cy.get("[data-cy='reattach']", { timeout: 40000 })
    }
    get React_Reason(){
        return cy.get('[data-cy="attach-reattach-reason"] > .ant-select > .ant-select-selector', { timeout:20000 })
    }
    get React_Changeattachment(){
        return cy.get("[label='Source Capture - Detach and Change Attachment'] > .ant-select-item-option-content", { timeout: 20000 })
    }
    get Continue_React(){
        return cy.get('[data-cy="continue-to-suggestion-button"]', { timeout: 40000 })
    }
    get Confirm_React(){
        return cy.get('[data-cy="confirm-redact-button"]', { timeout: 40000 })
    }
    get Suggestion_1(){
        return cy.get('[data-cy="right-chip-Allergies-AT"]', { timeout: 10000 })
    }
    get Suggestion_2(){
        return cy.get('[data-cy="right-chip-DateofServiceAT"]', { timeout: 10000 })
    }
    get Suggestion_3(){
        return cy.get('[data-cy="right-chip-BloodPressureAT"]', { timeout: 10000 })
    }
    get Suggestion_4(){
        return cy.get('[data-cy="right-chip-AgeAT"]', { timeout: 10000 })
    }
    get Submit_React(){
        return cy.get('[data-cy="submit-bottom-chips-menu"]', { timeout: 50000 })
    }
    get Unattached_Tab(){
        return cy.get('[data-cy="UNATTACHED"]', { timeout: 50000 })
    }
    get Attached_Tab(){
        return cy.get('[data-cy="ATTACHED"]', { timeout:40000 })
    }
    get QuestionCard_1(){
        return cy.get('[data-cy="question-card-cm2n696qj08n8zdk3hgiru340"]')
    }
    get QuestionCard_2(){
        return cy.get('[data-cy="question-card-cm2n69vn408nhzdk3qzqxsxnv"]')
    }
    get QuestionCard_3(){
        return cy.get('[data-cy="question-card-cm2n6fno508ntzdk3qjay0ip3"]')
    }
    get QuestionCard_4(){
        return cy.get('[data-cy="question-card-cm2n6j4ki08p8zdk3d4xchxo9"]')
    }
    get QuestionCard_Label_1(){
        return cy.get("[data-cy='question-cm2n696qj08n8zdk3hgiru340'] .kfcSTu")
    }
    get QuestionCard_Label_2(){
        return cy.get("[data-cy='question-cm2n69vn408nhzdk3qzqxsxnv'] .kfcSTu")
    }
    get QuestionCard_Label_3(){
        return cy.get("[data-cy='question-cm2n6fno508ntzdk3qjay0ip3'] .kfcSTu")
    }
    get Dettach(){
        return cy.get('[class="question-card-action-menu-icon icon-dettach"]', { timeout: 20000 })
    }
    get Dropdown_DataEntry(){
        return cy.get('[data-cy="streamline-dropdown-data-entry-question"] > .ant-select-selector > .ant-select-selection-item')
    }
    get Save_Snippet(){
        return cy.get('[data-cy="non-streamline-save-snippet"]', { timeout: 20000 })
    }
    get Check_Snippet(){
        return cy.get('.ant-row.mt-16.pl-4')
    }
    get Done_Snippet(){
        return ccy.get('[data-cy="done-snippet-button"] > .Text__StyledText-fcSGOX', { timeout: 10000 })
    }
    get Complete_Snippet(){
        return cy.get('[data-cy="MARKED_UP"]')
    }
    get Accepted_Snippet(){
        return cy.get('[data-cy="MARK_UP_ACCEPTED"]')
    }
    get Review_Snippet(){
        return cy.get('[data-cy="review-sc-snippet-action-cm2n696qj08n8zdk3hgiru340"] > .question-card-action-menu-icon', { timeout: 10000 })
    }
    get Review_Snippet_1(){
        return cy.get('[data-cy="review-sc-snippet-action-cm2n69vn408nhzdk3qzqxsxnv"] > .question-card-action-menu-icon', { timeout: 10000 })
    }
    get Review_Snippet_2(){
        return cy.get("[data-cy='review-sc-snippet-action-cm2n6fno508ntzdk3qjay0ip3'] > .question-card-action-menu-icon", { timeout: 5000 })
    }
    get Review_Snippet_3(){
        return cy.get("[data-cy='review-sc-snippet-action-cm2n6j4ki08p8zdk3d4xchxo9'] > .question-card-action-menu-icon", { timeout: 5000 })
    }
    get Canvas_Container(){
        return cy.get('[data-cy="canvas-container"] > .BaseCanvas__CanvasWrapper-bQdpLq > :nth-child(1) > .konvajs-content > canvas', { timeout: 10000 })
    }
    get Approve_SA(){
        return cy.get('[data-cy="button-approve-sa"]', { timeout: 10000 })
    }
    get Close_carousel(){
        return cy.get('[data-cy="carousel-close"]', { timeout: 10000 })
    }
    get Data_EntryAction(){
        return cy.get('[data-cy="data-entry-action"]',{ timeout:30000 })
    }
    get Data_Entry(){
        return cy.get('[data-cy="data-entry-action"]',{ timeout:30000 })
    }
    get Data_Entry_Antpicker(){
        return cy.get('.slick-active > :nth-child(1) > [data-cy="modal-container"] > [data-cy="carousel-container"] > [data-cy="content-outer-container"] > [data-cy="monitor-flow-body"] > [data-cy="data-entry-container"] > [data-cy="data-entry-input-container"] > [data-cy="question-input-container"] > .pb-20 > .flex > .ant-row > .ant-col > :nth-child(1) > .styles__CustomDateInputContainer-WEJQy > .styles__DatepickerContainer-dXEavp > .ant-picker > .ant-picker-input',{ timeout:30000 })
    }
    get Data_Input(){
        return cy.get('[data-cy="answer-input-field-cm2n696mo00000t5m8a76d1vb-0-0"]',{ timeout:30000 })
    }
    get Data_Input_1(){
        return cy.get('[data-cy="answer-input-field-cm2n69vll00010t5m329c90wf-0-0"]',{ timeout:10000 })
    }
    get Ant_PickerInput(){
        return cy.get('[title="2024-11-30"] > .ant-picker-cell-inner', { timeout: 10000 })
    }
    get PickerInput(){
        return cy.get('[class="ant-picker-cell ant-picker-cell-in-view"]', { timeout: 10000 })
    }
    get DataEntry_Selection(){
        return cy.get('[class="ant-select-selection-overflow"]')
    }
    get Data_Inputcarousel(){
        return cy.get('.slick-active > :nth-child(1) > [data-cy="modal-container"] > [data-cy="carousel-container"] > [data-cy="content-outer-container"] > [data-cy="monitor-flow-body"] > [data-cy="data-entry-container"] > [data-cy="data-entry-input-container"] > [data-cy="question-input-container"] > :nth-child(2) > .mt-60 > div > [data-cy="submit-data-entry"]',{ timeout:30000 })
    }
    get Data_Inputcarousel_1(){
        return cy.get('.slick-active > :nth-child(1) > [data-cy="modal-container"] > [data-cy="carousel-container"] > [data-cy="content-outer-container"] > [data-cy="monitor-flow-body"] > [data-cy="data-entry-container"] > [data-cy="data-entry-input-container"] > [data-cy="question-input-container"] > .pb-20 > .flex > .ant-row > [style="padding-left: 2.5px; padding-right: 2.5px;"] > .FloatingLabel__FloatingLabelContainer-cQJLhj > [data-cy="textfield-container-answer-input-field-cm2n6fnm300020t5mh6lfgqmv-0-0"] > [data-cy="select-container"] > [data-cy="answer-input-field-cm2n6fnm300020t5mh6lfgqmv-0-0"] > .ant-select-selector',{ timeout:30000 })
    }
    get Select_DataEntry(){
        return cy.get('[class="ant-select-item ant-select-item-option"][title="50 - 70"]',{ timeout:30000 })
    }
    get Filled_Partial(){
        return cy.get('[data-cy="FILLED_PARTIAL"]',{ timeout:30000 })
    }
    get Filled(){
        return cy.get('[data-cy="FILLED"]')
    }
    get Action_Menu(){
        return cy.get('.question-card-action-menu-icon')
    }
    get DataEntry_Accept(){
        return cy.get('[data-cy="first-data-entry-cm2n6j4ki08p8zdk3d4xchxo9"]')
    }
    get Accept_DataEntry(){
        return cy.get('[data-cy="accept-data-entry-cm2n6j4ki08p8zdk3d4xchxo9"]',{ timeout:10000 })
    }
    get Sign_Level(){
        return cy.get('[data-cy="sign-level"]',{ timeout:30000 })
    }
    get Sign_LevelText(){
        return cy.get('[class="Text__StyledText-fcSGOX dcoJJS"]')
    }
    get SignCRF_Password(){
        return  cy.get('[data-cy="input-password"]')
    }
    get SignCRF_Dwld(){
        return  cy.get('[data-cy="btn-sign"]')
    }
    get Profile_Header(){
        return cy.get('[class="anticon anticon-down DownOutlined__Root-knxRmY jZCmAT img-icon img-right"]')
    }
    get Logout(){
        return cy.get('[data-cy="logout-text"]')
    }
    }

    export default new SDE_HappyFlow();