import {
  GetVisitTemplateListDocument,
  IVisitTemplate,
  CloneFormDocument,
  IFormDetailsFragment,
  RemoveFormFromAllVisitDocument,
  RemoveFormFromVisitDocument,
  CreateFormDocument,
  IFormFieldType,
} from '../../../src/graphQL/generated/graphql';

describe('Delete Clone Form', () => {
  const aliasVisitTemplateList = GetVisitTemplateListDocument.definitions[0].name.value;
  const aliasCloneForm = CloneFormDocument.definitions[0].name.value;
  const aliasRemoveFormFromAllVisitDoc = RemoveFormFromAllVisitDocument.definitions[0].name.value;
  const aliasRemoveFormFromVisitDocument = RemoveFormFromVisitDocument.definitions[0].name.value;
  const aliasCreateForm = CreateFormDocument.definitions[0].name.value;

  let clonedFormData: IFormDetailsFragment = {} as IFormDetailsFragment;
  let addedForm: IFormDetailsFragment = {} as IFormDetailsFragment;
  let visitTemplateList: IVisitTemplate[] = [];

  before(() => {
    cy.clearLocalStorage();
    cy.reseedDB();
    cy.fillInloginAsFormV2({
      email: 'admin@example.com',
    });
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasVisitTemplateList) {
        req.alias = req.body.operationName;
      }
    });
    cy.visit('/study/study1revisionDev1a');
    cy.wait(`@${aliasVisitTemplateList}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        visitTemplateList = result.response.body.data.visitTemplateList;
      }
    });
    cy.waitForReact();
  });

  describe('Clone Form', () => {
    it('Go to a form, hover it and click clone icon should add a new form', () => {
      cy.get(`[data-cy=visit-template-${visitTemplateList[1].id}]`).click({ force: true });
      cy.get(`[data-cy=form-${visitTemplateList[1].forms[0].id}]`).realHover();
      cy.get(`[data-cy=form-${visitTemplateList[1].forms[0].id}-clone]`).should('be.visible');
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasCloneForm) {
          req.alias = req.body.operationName;
        }
      });
      cy.get(`[data-cy=form-${visitTemplateList[1].forms[0].id}-clone]`).click();
      cy.wait(`@${aliasCloneForm}`).then((result) => {
        if (result?.response?.statusCode === 200) {
          clonedFormData = result.response.body.data.cloneForm;
          if (cy.get('.ant-tooltip')) {
            cy.get('.ant-tooltip').invoke('attr', 'style', 'display: none');
          }
          cy.get(`[data-cy=form-${clonedFormData.id}]`).should('be.visible');
        }
      });
    });

    it('On right side bar should be on edit mode for form and the input should be prefilled', () => {
      cy.get('[data-cy=right-side-bar]').should('be.visible');
      cy.get('[data-cy=create-edit-form]').should('be.visible');
      cy.checkFormDefaultPreFilled(clonedFormData);
    });
  });

  describe('Remove Form', () => {
    it('Go to a form, hover it and click delete icon should show confirmation modal', () => {
      cy.get('[data-cy=sidebar-toggle]').click();
      cy.get(`[data-cy=visit-template-${visitTemplateList[1].id}]`).click({ force: true });
      cy.get(`[data-cy=form-${visitTemplateList[1].forms[0].id}]`).realHover();
      cy.get(`[data-cy=form-${visitTemplateList[1].forms[0].id}-delete]`).should('be.visible');
      cy.get(`[data-cy=form-${visitTemplateList[1].forms[0].id}-delete]`).click();
      if (cy.get('.ant-tooltip')) {
        cy.get('.ant-tooltip').invoke('attr', 'style', 'display: none');
      }
      cy.get('[data-cy=delete-form-confirmation]').should('be.visible');
    });

    it('Click cancel should close confirmation modal', () => {
      cy.get('[data-cy=confirmModal-cancelButton]').click();
      cy.get('[data-cy=delete-form-confirmation]').should('not.be.visible');
    });

    it('Click delete icon again and check woring for only connection form', () => {
      cy.get(`[data-cy=form-${visitTemplateList[1].forms[0].id}]`).realHover();
      cy.get(`[data-cy=form-${visitTemplateList[1].forms[0].id}-delete]`).click();
      cy.get('[data-cy=delete-form-confirmation]').should('be.visible');
    });

    it('Click delete icon again and check woring for more than 1 connections form', () => {
      cy.get('[data-cy=confirmModal-cancelButton]').click();
      cy.get('[data-cy=sidebar-toggle]').click();
      cy.get(`[data-cy=visit-template-${visitTemplateList[0].id}]`).click({ force: true });
      cy.get(`[data-cy=form-${visitTemplateList[0].forms[0].id}]`).realHover();
      cy.get(`[data-cy=form-${visitTemplateList[0].forms[0].id}-delete]`).click();
      cy.get('[data-cy=delete-form-confirmation]').should('be.visible');
      cy.get('[data-cy=confirmation-modal-desc]').should(
        'contain',
        `This form is used in 2 different visits. Would you like to remove it from just this visit (${visitTemplateList[0].name}) or remove it from all visits?`,
      );
      cy.get('[data-cy=confirmModal-confirmButton]').should(
        'contain',
        `Remove from ${visitTemplateList[0].name}`,
      );
      cy.get('[data-cy=second-confirmModal-confirmButton]').should(
        'contain',
        `Remove from all ${visitTemplateList[0].forms[0].visitTemplateFormConnections.length} visits`,
      );
    });

    it('Remove from all visits', () => {
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasRemoveFormFromAllVisitDoc) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=second-confirmModal-confirmButton]').click();
      cy.wait(`@${aliasRemoveFormFromAllVisitDoc}`).then((result) => {
        if (result?.response?.statusCode === 200) {
          cy.get('[data-cy=delete-form-confirmation]').should('not.be.visible');
          cy.get(`[data-cy=form-${visitTemplateList[0].forms[0].id}]`).should('not.exist');

          const otherConnectiond =
            visitTemplateList[0].forms[0].visitTemplateFormConnections.filter(
              (connection) => connection.visitTemplate.id !== visitTemplateList[0].id,
            );
          otherConnectiond.map((connection) => {
            cy.get('[data-cy=sidebar-toggle]').click();
            cy.get(`[data-cy=visit-template-${connection.visitTemplate.id}]`).click({
              force: true,
            });
            cy.get(`[data-cy=form-${visitTemplateList[0].forms[0].id}]`).should('not.exist');
          });
        }
      });
    });

    it.skip('Remove form with parent question should also remove form of the parent question', () => {
      cy.get('[data-cy=sidebar-toggle]').click();
      cy.get(`[data-cy=visit-template-${visitTemplateList[3].id}]`).click({ force: true });
      cy.get(`[data-cy=add-form-button]`).click();
      cy.get('input[name="formName"]').type('Form 1');
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasCreateForm) {
          req.alias = req.body.operationName;
        }
      });

      cy.get('[data-cy=submit-create-form]').click();
      cy.get('[data-cy=button-loading]').should('be.visible');
      cy.wait(`@${aliasCreateForm}`).then((result) => {
        if (result?.response?.statusCode === 200) {
          addedForm = result?.response?.body.data.createForm;
          cy.get(`[data-cy=form-${addedForm.id}]`).should('be.visible');
          cy.get('[data-cy=add-new-question-page]').should('be.visible');
          cy.get('[data-cy=right-side-bar]').should('be.visible');
          cy.dragAndDrop('[data-cy=stock-drag-1]', '[data-cy=add-new-question-page]');
          cy.fillInQuestionDetails(
            8,
            { shortQuestion: 'Q 1', question: 'Q 1', oid: 'Q', keyword: 'Q 1' },
            IFormFieldType.SingleChoice,
            'group',
            true,
          );
          cy.get('[data-cy=question-attributes-children-forms-1]').scrollIntoView().check();
          cy.get('[data-cy=children-list-forms-1]').scrollIntoView().click();
          cy.get('.children-list-forms-1 .ant-select-item-option').should('have.length', 1);
          cy.get('.children-list-forms-1 .ant-select-item-option').then((res) => {
            res[0].click();
          });
          cy.saveCreateQuestion();
          cy.get(`[data-cy=form-parent-${visitTemplateList[3].forms[0].id}]`).should('be.visible');
          cy.get(`[data-cy=form-${visitTemplateList[3].forms[0].id}]`).realHover();
          cy.get(`[data-cy=form-${visitTemplateList[3].forms[0].id}-delete]`).click();
          cy.get('[data-cy=confirmModal-confirmButton]').click();
          cy.get(`[data-cy=form-${visitTemplateList[1].forms[0].id}]`).should('not.exist');
          cy.get(`[data-cy=form-${addedForm.id}]`).should('not.exist');
        }
      });
    });
  });
});
