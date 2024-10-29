import 'cypress-localstorage-commands';
import { RejectMarkUpFfgrDocument } from '../../../src/graphQL/generated/graphql';

describe('Audit Trail No Source', () => {
  const aliasVisitDetails = 'GetVisitDetails';
  const aliasAuditTrail = 'GetAuditTrail';
  const aliasRejectSC = RejectMarkUpFfgrDocument.definitions[0].name.value;

  before(() => {
    cy.clearLocalStorageSnapshot();
    cy.reseedDB();
    cy.fillInloginAsFormV2({
      email: 'snippetassessment@example.com',
    });
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasVisitDetails) {
        req.alias = req.body.operationName;
      }
    });

    cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit1Visit1');
    cy.wait(`@${aliasVisitDetails}`);
  });

  beforeEach(() => {
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasAuditTrail) {
        req.alias = req.body.operationName;
      } else if (req.body.operationName === aliasRejectSC) {
        req.alias = req.body.operationName;
      }
    });
  });

  describe('Reject With Source Question Snippet', () => {
    it('Snippet Reject and Check Audit Trail Event', () => {
      cy.get('[data-cy=MARKED_UP]').click();
      cy.clickQuickAction(
        '[data-cy=question-card-lungs1]',
        '[data-cy=review-sc-snippet-action-lungs1]',
      );
      cy.get('canvas', { timeout: 20000 }).should('be.visible');
      cy.get('[data-cy=overlapping-button-reject-snippet]').should('be.visible').click();
      cy.get('[data-cy=reject-reason] > .ant-select > .ant-select-selector')
        .click()
        .type('{downarrow}{enter}');
      cy.get('[data-cy=submit-reject-reason]').click();
      cy.get('[data-cy=alert-success]').should('contain.text', 'Snippet Rejected');
      cy.get('[data-cy=carousel-close]').click();
      cy.scrollToElement('[data-cy=MARK_UP_ACCEPTED]').click();
      cy.get('[data-cy=audit-trail-button-lungs1]', { timeout: 10000 }).click();
      cy.wait(`@${aliasAuditTrail}`).then((result) => {
        if (result?.response?.statusCode === 200) {
          cy.get('[data-cy="mark-up-rejected-reason-Lungs"]').contains('Incorrect snippet');
          cy.get('[data-cy=modal-close]').first().click();
        }
      });
    });

    it('Source Capture Reject and Check Audit Trail Event', () => {
      cy.get('[data-cy=MARKED_UP]').click();
      cy.clickQuickAction(
        '[data-cy=question-card-rightEye1]',
        '[data-cy=review-sc-snippet-action-rightEye1]',
      );
      cy.get('[data-cy=overlapping-button-reject-sc]').should('be.visible').click();
      cy.get('[data-cy=edit-reason] > .ant-select > .ant-select-selector')
        .click()
        .type('{downarrow}{enter}');
      cy.get('[data-cy=submit-reject-sc]').click();
      cy.wait(`@${aliasRejectSC}`).then((result) => {
        if (result?.response?.statusCode === 200) {
          cy.get('[data-cy=alert-success]').should('contain.text', 'Source Capture Rejected');
          cy.get('[data-cy=question-card-rightEye1]').should('not.exist');
        }
      });
      cy.scrollToElement('[data-cy=MARK_UP_ACCEPTED]').click();
      cy.get('[data-cy=audit-trail-button-rightEye1]', { timeout: 10000 }).click();
      cy.wait(`@${aliasAuditTrail}`).then((result) => {
        if (result?.response?.statusCode === 200) {
          cy.get('[data-cy="source-capture-rejected-reason-Right Eye"]').contains(
            'Incorrect snippet',
          );
          cy.get('[data-cy=modal-close]').first().click();
        }
      });
    });
  });
});
