import { OperationDefinitionNode } from 'graphql';
import 'cypress-localstorage-commands';
import { GetVisitDetailsDocument } from '../../../src/graphQL/generated/graphql';
import { userDataStreamlineSC } from '../../../src/constant/testFixtures';

/**
 * This test runner purpose is to test the functionality of Streamline User Quick action other than canvas Quick Action (detach, etc)
 */
describe('Streamline SC - Other Quick Action', () => {
  const visitDetailDefinitions = GetVisitDetailsDocument.definitions[0] as OperationDefinitionNode;

  const aliasVisitDetails = visitDetailDefinitions.name?.value;

  before(() => {
    cy.reseedDB();
    cy.fillInloginAsFormV2({
      email: userDataStreamlineSC.email,
    });
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasVisitDetails) {
        req.alias = req.body.operationName;
      }
    });

    cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit1Visit1');
    cy.wait(`@${aliasVisitDetails}`);

    cy.get('[data-cy=sourceQuestionTab]').click();
  });

  describe('Streamline SC - Detach Quick Action', () => {
    it('should go to "Snippet Complete, Pending DE" state and click detach quick action on Lungs Question', () => {
      cy.get('[data-cy=MARKED_UP]').click();
      cy.clickQuickAction(
        '[data-cy=question-lungs1]',
        '[data-cy=detach-action-lungs1]',
        undefined,
        undefined,
        'SVG',
      );
      cy.get('[data-cy=attach-reattach-container]').within(() => {
        cy.get('[data-cy=detach]').should('be.disabled');
        cy.get('[data-cy=attach-reattach-reason]').type('{enter}');
        cy.get('[data-cy=detach]').should('be.enabled').click();
      });
      cy.get('[data-cy=question-card-lungs1]').should('not.exist');
      cy.reload();
      cy.get('[data-cy=sourceQuestionTab]').click();
      cy.get('[data-cy=UNATTACHED]', { timeout: 10000 }).click();
      cy.get('[data-cy=question-card-lungs1]').should('exist').should('be.visible');
      cy.get('[data-cy=audit-trail-button-lungs1]').click();
      cy.get('[data-cy=detach-reason-Lungs]').should(
        'have.text',
        'Reason: Incorrect source captured',
      );
      cy.get('[data-cy=modal-close]').click();
    });
  });
});
