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
    let lastId = 6;

 it("Login to the Portal and login as Source Capture user", () => {
    cy.AkyrianSDELogin_studyconfig(email,password)
    //Search study
    cy.get('[data-cy="study-config-search-study"]').type("QAonCloud Test")   
cy.get('[class="Text__StyledText-fcSGOX liUSLx adjust-version mb-0.5"]').contains("v.4.d").click()
//CLick Edit study
cy.get('[data-cy="btn-edit-study"]').click()
//Click  Study
cy.get('#add-visit-icon').click()
cy.wait(10000)
cy.get('[data-cy="visitName"]').type("Visit_01")
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

const dataTransfer = new DataTransfer();
cy.get("[data-cy='field-card-0'] .ant-row").trigger("dragstart", { dataTransfer });
cy.get('.EmptyQuestion__Container-gQdEUg').trigger("dragend", { dataTransfer })


})  
})
