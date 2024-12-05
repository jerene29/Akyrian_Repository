class StudyConfig{
get logo(){
return cy.get('[data-cy="header-logo"]');
}

get TextVersion(){
return cy.get('[class="Text__StyledText-fcSGOX bKOoCf text-version"]');
}
get UserTitle(){
return cy.get('[data-cy="hi-user"]');
}
get UserSubTitle(){
return cy.get('[data-cy="user-instruction"]');
}
get CreateStudyTitle(){
return cy.get('#create-study');
}
get RecentlyViewed(){
return cy.get('[data-cy="text-recently-viewed"]')
}
get TabTitle_Dev(){
return cy.get('#env-selector-DEVELOPMENT > span:nth-of-type(1)')
}
get TabTitle_Stag(){
return cy.get('#env-selector-STAGING > span:nth-of-type(1)')
}
get TabTitle_UAT(){
return cy.get('#env-selector-UAT > span:nth-of-type(1)')
 }
get TabTitle_Prod(){
return cy.get('#env-selector-PRODUCTION > span:nth-of-type(1)')
}
get Search_Study(){
return cy.get('[data-cy="study-config-search-study"]')
}
get Study_Version(){
return cy.get('[class="Text__StyledText-fcSGOX liUSLx adjust-version mb-0.5"]')
}
get Study_Settings(){
return cy.get('[data-cy="icon-system-study-settings"]')
}
get Study_Edit(){
return cy.get('[data-cy="icon-pencil-edit"]')
}
get Study_Clone(){
return cy.get('[data-cy="icon-clone"]')
}
get Icon_version(){
return cy.get('[data-cy="icon-version"]')
}
get Create_Folder(){
return cy.get('[data-cy="icon-add-to-folder"]')
}
get Move_Folder(){
return cy.get('[data-cy="icon-move-to-folder"]')
}
get Folder_Archive(){
return cy.get('[data-cy="icon-archive"]')
}
get Folder_Pause(){
    return cy.get('[data-cy="icon-pause"]')
}
get Folder_Export(){
    return cy.get('[data-cy="icon-export"]')
}
get Edit_Study(){
    return cy.get('[data-cy="btn-edit-study"]')
}
get Quick_Actions(){
    return cy.get('[data-cy="right-button-quickactions"]')
}
get Add_Visit(){
    return cy.get('#add-visit-icon')
}
get Visit_Name(){
    return cy.get('[data-cy="visitName"]',{ timeout:30000 })
}
get Visit_Name_1(){
    return cy.get('[data-cy="visit-template-cm2q0o2bk0jjjzdk3d5c3fx0d"]',{ timeout:30000 })
}
get Visit_oid(){
    return cy.get('[data-cy="oid"]')
}
get Visit_dayOffset(){
    return cy.get('[data-cy="visit-dayOffset"]')
}
get visit_days_before(){
    return cy.get('[data-cy="visit-days-before"]')
}
get Visit_days_after(){
    return cy.get('[data-cy="visit-days-after"]')
}
get Add_Visit(){
    return cy.get('#add-visit-icon',{ timeout:30000 })
}
get AddVisit_Container (){
    return cy.get('[class="Button__Container-gknlFx jJqIYB button-add-visit"]')
}
get Detail_View (){
    return cy.get('[data-cy="detail-view"]')
}
get Grid_View (){
    return cy.get('[data-cy="grid-view"]')
}
get Add_Form (){
    return cy.get('[data-cy="add-form-button"]')
}
get Form_Input (){
    return cy.get('[data-cy="form-name-input"]')
}
get Form_OidInput (){
    return cy.get('[data-cy="form-oid-input"]')
}
get Submit_Form (){
    return cy.get('[data-cy="submit-create-form"]')
}
get noSCNeeded (){
    return cy.get('[name="attr-noSCNeeded"]',{ timeout:50000 })
}
get Short_Que_1 (){
    return cy.get('[data-cy="short-question-input-12"]',{ timeout:30000 })
}
get Long_Que_1 (){
    return cy.get('[data-cy="long-question-input-12"]',{ timeout:5000 })
}
get OidInput_1 (){
    return cy.get('[data-cy="oid-input-12"]')
}
get Ques_Save (){
    return cy.get('[data-cy="right-menu-save-button"]',{ timeout:50000 })
}
get Click_Library (){
    return cy.get('.ant-tabs-nav-list > :nth-child(2)',{ timeout:30000 })
}
get Click_Library_1 (){
    return cy.get('[class="ant-tabs-tab"]',{ timeout:30000 })
}
get Short_Que_2 (){
    return cy.get('[data-cy="short-question-input-14"]',{ timeout:30000 })
}
get Long_Que_2 (){
    return cy.get('[data-cy="long-question-input-14"]',{ timeout:5000 })
}
get OidInput_2 (){
    return cy.get('[data-cy="oid-input-14"]')
}
get KeyQuesInput_2 (){
    return cy.get('[data-cy="keyword-question-input-14"]')
}
get MaxQuesInput_2 (){
    return cy.get('[data-cy="number-max-digits-input-14"]')
}
get Mark_NoAns (){
    return cy.get('[name="attr-markAsNoAnswer"]')
}
get Short_Que_3 (){
    return cy.get('[data-cy="short-question-input-16"]',{ timeout:30000 })
}
get Long_Que_3 (){
    return cy.get('[data-cy="long-question-input-16"]',{ timeout:5000 })
}
get OidInput_3 (){
    return cy.get('[data-cy="oid-input-16"]')
}
get KeyQuesInput_3 (){
    return cy.get('[data-cy="keyword-question-input-16"]')
}
get Short_Que_4 (){
    return cy.get('[data-cy="short-question-input-18"]',{ timeout:30000 })
}
get Long_Que_4 (){
    return cy.get('[data-cy="long-question-input-18"]',{ timeout:5000 })
}
get OidInput_4 (){
    return cy.get('[data-cy="oid-input-18"]')
}
get KeyQuesInput_3 (){
    return cy.get('[data-cy="keyword-question-input-18"]')
}
get Profile_Header (){
    return cy.get('[data-cy="header-user-popover-trigger"]')
}
get Logout (){
    return cy.get('[data-cy="logout-text"]')
}
get Search_Study_1 (){
    return cy.get('[data-cy="onboarding-search-study"]')
}
get Study_Version (){
    return cy.get('[class="Text__StyledText-fcSGOX liUSLx adjust-version mb-0.5"]')
}
get Add_Patient (){
    return cy.get('#add-patient-icon > .ant-row > :nth-child(2) > .Text__StyledText-fcSGOX')
}
get Add_Patient_submit (){
    return cy.get('[data-cy="button-submit-add-patient"]',{ timeout:30000 })
}
get Add_Patient_FirstName (){
    return cy.get('#firstName')
}
get Add_Patient_LastName (){
    return cy.get('#lastName')
}
get Add_Patient_ID (){
    return cy.get('#patientStudyId')
}
get Click_PatientSite (){
    return cy.get('[data-cy="patient-site"]')
}
get Add_Patient_Gender (){
    return cy.get('input[type="radio"][name="FEMALE"]')
}
get Add_Patient_Year (){
    return cy.get('[data-cy="select-year-addPatient"]')
}
get Select_Add_Patient_Dropdowm (){
    return cy.get('[class="ant-select-item-option-content"]')
}
get Select_Add_Patient_Month (){
    return cy.get('[data-cy="select-month-addPatient"]')
}
get Select_Add_Patient_Date (){
    return cy.get('[data-cy="select-date-addPatient"]')
}
get Select_Add_Patient_DateOption (){
    return cy.get("[title='7'] > .ant-select-item-option-content")
}
get Add_Patient_Cancel (){
    return cy.get('[data-cy="button-cancel-add-patient"]')
}
get Start_PatientVisit(){
    return cy.get('[data-cy="button-start-visit"]',{ timeout:30000 })
}
get Visit_List(){
    return cy.get('#sider-visit-list[data-visit-name="Visit_01"]',{ timeout:30000 })
}
get Select_Visit(){
    return cy.get('[data-cy="select-visit-status"] > .ant-select-selector')
}
get Select_VisitOccur(){
    return cy.get("[label='Visit Did Occur'] > .ant-select-item-option-content")
}
get Select_VisitYear(){
    return cy.get('[data-cy="select-year"]')
}
get Select_VisitYearOption(){
    return cy.get("[title='2023'] > .ant-select-item-option-content",{ timeout:30000 }).eq(1)
}
get Select_VisitMonth(){
    return cy.get('[data-cy="select-month"]')
}
get Select_VisitMonthOption(){
    return cy.get("[title='February'] > .ant-select-item-option-content",{ timeout:30000 }).eq(1)
}
get Select_VisitDate(){
    return   cy.get('[data-cy="select-date"]')
}
get Select_VisitDateOption(){
    return cy.get("[title='5'] > .ant-select-item-option-content")
}
get Submit_Visit(){
    return cy.get('[data-cy="button-submit-visit"]')
}
get Question_Card(){
    return cy.get('[data-cy="question-card"]',{ timeout:30000 })
}
get SourceTab(){
    return cy.get('[data-cy="sourceQuestionTab"]',{ timeout:30000 })
}
get Source_cards(){
    return cy.get('[class="source-cards"]',{ timeout:30000 })
}
get SC_ProfileHeader(){
    return cy.get('[class="anticon anticon-down DownOutlined__Root-knxRmY jZCmAT img-icon img-right"]')
}
get Study_Count(){
    return cy.get('#study-count-question')
}
get Delete_Question(){
    return cy.get('[data-cy="delete-question-12"]',{ timeout:5000 })
}
get Confirm_Delete_Question(){
    return cy.get('[data-cy="confirmModal-confirmButton"]',{ timeout:5000 })
}
}
export default new StudyConfig();