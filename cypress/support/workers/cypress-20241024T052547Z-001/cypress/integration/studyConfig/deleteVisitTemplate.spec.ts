import {
  GetVisitTemplateListDocument,
  IVisitTemplate,
  IVisitTemplateType,
  IFormFieldType,
} from '../../../src/graphQL/generated/graphql';
import 'cypress-localstorage-commands';

describe('Delete Visit', () => {
  const aliasVisitTemplateList = GetVisitTemplateListDocument.definitions[0].name.value;

  let visitTemplateList: IVisitTemplate[] = [];
  let adHocVisit: IVisitTemplate[] = [];

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
        adHocVisit = visitTemplateList.filter((visit) => visit.type === IVisitTemplateType.AdHoc);
      }
    });
    cy.waitForReact();
  });

  describe('DELETE A VISIT WITHOUT RELATION', () => {
    it('Hover on visit should show delete quick action icon and click it should show confirmation modal', () => {
      cy.get(`[data-cy=visit-template-${visitTemplateList[0].id}]`).click({ force: true });
      cy.get('[data-cy=sidebar-toggle]').click();
      cy.get(`[data-cy=visit-template-${visitTemplateList[0].id}]`).realHover();
      cy.get(`[data-cy=visit-template-${visitTemplateList[0].id}-delete]`).should('be.visible');
      cy.get(`[data-cy=visit-template-${visitTemplateList[0].id}-delete]`).click();
      cy.get('[data-cy=delete-visit-template-modal]').should('be.visible');
    });

    it('Click cancel on confirmation modal should not remove the visit from the list', () => {
      cy.get('[data-cy=confirmModal-cancelButton]').click();
      cy.get('[data-cy=sidebar-toggle]').click();
      cy.get(`[data-cy=visit-template-${visitTemplateList[0].id}]`).should('be.visible');
    });

    it('Click delete visit quick action again and click delete should remove the visit from list', () => {
      cy.get(`[data-cy=visit-template-${visitTemplateList[0].id}]`).realHover();
      cy.get(`[data-cy=visit-template-${visitTemplateList[0].id}-delete]`).should('be.visible');
      cy.get(`[data-cy=visit-template-${visitTemplateList[0].id}-delete]`).click();
      cy.get('[data-cy=confirmModal-confirmButton]').click();
      cy.wait(1000);
      cy.get('[data-cy=sidebar-toggle]').click();
      cy.get(`[data-cy=visit-template-${visitTemplateList[0].id}]`).should('not.exist');
    });
  });

  describe.skip('DELETE A VISIT WITH RELATION', () => {
    it('Create a question with child visit and check if the selected visit is on the question card', () => {
      cy.get(`[data-cy=visit-template-${visitTemplateList[1].id}]`).click({ force: true });
      cy.wait(1000);
      cy.dragAndDrop('[data-cy=stock-drag-1]', '[data-cy=add-new-question-page]');
      cy.fillInQuestionDetails(
        8,
        { shortQuestion: 'Q 1', question: 'Q 1', oid: 'Q', keyword: 'Q 1' },
        IFormFieldType.SingleChoice,
        'group',
        true,
      );
      cy.get('[data-cy=question-attributes-children-visits-1]').scrollIntoView().check();
      cy.get('[data-cy=children-list-visits-1]').scrollIntoView().click();
      cy.get('.children-list-visits-1 .ant-select-item-option').should('have.length', 1);
      cy.get('.children-list-visits-1 .ant-select-item-option').then((res) => {
        res[0].click();
      });
      cy.saveCreateQuestion();
      cy.get(`[data-cy=form-parent-${adHocVisit[0].id}]`).should('be.visible');
    });

    it('Hover on the child visit and click delete quick action should show delete confirmation moda, check wording for visit with relation', () => {
      cy.get('[data-cy=sidebar-toggle]').click();
      cy.get(`[data-cy=visit-template-${adHocVisit[0].id}]`).realHover();
      cy.get(`[data-cy=visit-template-${adHocVisit[0].id}-delete]`).should('be.visible');
      cy.get(`[data-cy=visit-template-${adHocVisit[0].id}-delete]`).click();
      cy.get('[data-cy=confirmModal-confirmButton]').click();
      cy.wait(1000);
      cy.get('[data-cy=sidebar-toggle]').click();
      cy.get(`[data-cy=visit-template-${adHocVisit[0].id}]`).should('not.exist');
    });

    it('Check on question card, the child visit should be removed', () => {
      cy.get(`[data-cy=visit-template-${visitTemplateList[1].id}]`).click({ force: true });
      cy.get(`[data-cy=form-parent-${adHocVisit[0].id}]`).should('not.exist');
    });
  });
});
