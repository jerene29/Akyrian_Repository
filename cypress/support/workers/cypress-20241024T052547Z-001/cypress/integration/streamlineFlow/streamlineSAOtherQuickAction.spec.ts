import { OperationDefinitionNode } from 'graphql';
import 'cypress-localstorage-commands';
import { GetVisitDetailsDocument } from '../../../src/graphQL/generated/graphql';
import { d } from '../../helper';

/**
 * This test runner purpose is to test the functionality of Streamline SA Quick action other than review Quick Action (redact, view, etc)
 */
describe('Streamline SA - Other Quick Action', () => {
  const visitDetailDefinitions = GetVisitDetailsDocument.definitions[0] as OperationDefinitionNode;

  const aliasVisitDetails = visitDetailDefinitions.name?.value;
  const redactionRectangle1 = {
    x: 300,
    y: 50,
    x2: 320,
    y2: 100,
  };
  const redactionRectangle2 = {
    x: 300,
    y: 250,
    x2: 320,
    y2: 100,
  };

  before(() => {
    cy.reseedDB();
    cy.fillInloginAsFormV2({
      email: 'streamlinesa@example.com',
    });
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasVisitDetails) {
        req.alias = req.body.operationName;
      }
    });

    cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit1Visit1');
    cy.wait(`@${aliasVisitDetails}`);

    cy.get(d`sourceQuestionTab`).click();
  });

  describe('Streamline SA - Redact on Pending Review', () => {
    it('should go to "Pending Review" state and click redact quick action on Lungs Question (FILLED status)', () => {
      cy.get(d`FILLED`).click();
      cy.clickQuickAction(
        d`question-leftLungs1`,
        d`redact-action-leftLungs1`,
        undefined,
        undefined,
        'SVG',
      );
      cy.drawSingleRect(redactionRectangle1);
      cy.get(d`done-snippet-button`).click();
      cy.get(d`alert-success`, { timeout: 20000 })
        .should('exist')
        .should('have.text', 'Source Capture successfully updated');
    });
  });

  describe('Streamline SA - Redact on Pending Review', () => {
    it('should go to "Reviewed: Accepted" state and click redact quick action on Receptor Question (ACCEPTED status)', () => {
      cy.get(d`ACCEPTED`).click();
      cy.clickQuickAction(
        d`question-receptor1`,
        d`redact-action-receptor1`,
        undefined,
        undefined,
        'SVG',
      );
      cy.drawSingleRect(redactionRectangle2);
      cy.get(d`done-snippet-button`).click();
      cy.get(d`alert-success`, { timeout: 20000 })
        .should('exist')
        .should('have.text', 'Source Capture successfully updated');
    });
  });
});
