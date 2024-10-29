import { IChildType } from '../../../src/graphQL/generated/graphql';
describe.skip('Test for question redirection on study settings modal', () => {
  const mockUserData = {
    email: 'admin@example.com',

    studyId: 'studyTestId1',
    studyRevisionId: 'testRevisionId1',
  };

  let visitTemplateId: string;
  let formFieldId: string;
  let formFieldGroupId: string;
  let formId: string;

  let parentFFId: string;

  before(() => {
    cy.reseedDB();
    cy.fillInloginAsFormV2(mockUserData);
    cy.waitForReact();
  });

  it('clone sample demo study from data seed ( Preparing test data.. )', () => {
    cy.get('#env-selector-PRODUCTION').click();
    cy.get('#active-demoRevision1').click();
    cy.get('[data-cy=btn-edit-study]').click();
    cy.wait(5000);
  });

  it('Open study setting modal', () => {
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === 'GetFormFieldGroup') {
        req.alias = req.body.operationName;
      }
    });
    cy.get('[data-cy=study-settings-icon]').click();
    cy.get('[data-cy=menu-item-question]').click();
    cy.wait(`@GetFormFieldGroup`).then(({ response }) => {
      const ffgrs = response?.body.data.formFieldGroups;

      formFieldId = ffgrs[0].fields[1].childs.find(
        (child: any) => child.childType === IChildType.FormField,
      ).id;
      formFieldGroupId = ffgrs[0].fields[2].childs.find(
        (child: any) => child.childType === IChildType.FormFieldGroup,
      ).id;
      visitTemplateId = ffgrs[0].fields[2].childs.find(
        (child: any) => child.childType === IChildType.VisitTemplate,
      ).id;
      formId = ffgrs[0].fields[2].childs.find(
        (child: any) => child.childType === IChildType.Form,
      ).id;
      parentFFId = ffgrs[0].fields[2].id;
    });
  });

  it('check redirection for formfield type children', () => {
    cy.get(`[data-cy=question-child-${formFieldId}]`).click();
    cy.get('[data-cy=modal-study-settings]').should('not.be.visible');
    cy.log('[INFO] IF THIS CASE IS FAILING , is seed data changed recently ?');
    cy.get('[data-cy=field-card-container-10]')
      .should('exist')
      .should('contain.text', 'Signed Informed Consent');
  });
  it('check redirection for Visit Type children ', () => {
    cy.get('[data-cy=study-settings-icon]').click();
    cy.get('[data-cy=menu-item-question]').click();
    cy.get(`[data-cy=ff-${parentFFId}] [data-cy=question-child-${visitTemplateId}`)
      .scrollIntoView()
      .click();
    cy.get('[data-cy=modal-study-settings]').should('not.be.visible');
    cy.log('[INFO] IF THIS CASE IS FAILING , is seed data changed recently ?');
    cy.get('[data-cy=field-card-container-8]')
      .should('exist')
      .should('contain.text', 'The study was prematurely terminated due to');
  });
  it('check redirectio for Form Type children', () => {
    cy.get('[data-cy=study-settings-icon]').click();
    cy.get('[data-cy=menu-item-question]').click();
    cy.get(`[data-cy=question-child-${formId}]`).click();
    cy.get(`[data-cy=form-${formId}`).should('be.visible');
    cy.log('[INFO] IF THIS CASE IS FAILING , is seed data changed recently ?');
    cy.get('[data-cy=short-question-top-7]').should('have.text', 'Exclusion Criteria');
    cy.get('[data-cy=short-question-top-8]').should('have.text', 'Pregnant woman');
    cy.get('[data-cy=short-question-top-9]').should('have.text', 'Inability to consent');
  });
});
