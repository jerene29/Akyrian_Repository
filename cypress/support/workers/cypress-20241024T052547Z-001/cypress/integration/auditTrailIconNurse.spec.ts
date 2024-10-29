import { mockUserDataAdmin } from '../../src/constant/testFixtures';
import 'cypress-localstorage-commands';

import Colors from '../../src/constant/Colors';

describe('Audit Trail Icon Nurse', () => {
  const aliasVisitDetails = 'GetVisitDetails';
  const aliasRejectQuestion = 'RejectDataEntryFFGRS';
  const aliasRejectScQuestion = 'RejectMarkUpFFGR';
  const aliasAuditTrail = 'GetAuditTrail';

  before(() => {
    cy.clearLocalStorageSnapshot();
    cy.reseedDB();
    cy.fillInloginAsFormV2(mockUserDataAdmin);
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
      }
    });
  });

  describe('Create Negative flow on No Source Capture Question', () => {
    it('Create Negative flow, check the question, the question should have audit trail with orange badge on the icon', () => {
      cy.get('[data-cy=noSourceQuestionTab]').click();
      cy.get('[data-cy=FILLED]').click();
      cy.get('.ant-badge-dot').should('not.exist');
      cy.clickQuickAction(
        '[data-cy=question-card-multiEntry1]',
        '[data-cy=accept-reject-action-multiEntry1]',
      );
      cy.get('.slick-active [data-cy=reject-data-entry]').should('be.visible').click();
      cy.get('.slick-active [data-cy=reject-reason] > .ant-select > .ant-select-selector')
        .click()
        .type('{downarrow}{enter}');
      cy.get('.slick-active [data-cy=submit-reject-reason]').click();
      cy.get('.slick-active [data-cy=modal-close]').click({ force: true });
      cy.get('[data-cy=REJECTED]').contains(1).click();
      cy.get('.ant-badge-dot').should(
        'have.css',
        'background',
        `${Colors.secondary.brightOrange150} none repeat scroll 0% 0% / auto padding-box border-box`,
      );
    });

    it('Open audit trail and then close it, the orange badge on the icon should be disappeared', () => {
      // Adding wait here to wait out the refetch before continuing because it affect the indicator state update
      cy.wait(4000);
      cy.get('[data-cy=audit-trail-button-multiEntry1]', { timeout: 10000 }).first().click();

      cy.wait(`@${aliasAuditTrail}`).then((result) => {
        if (result?.response?.statusCode === 200) {
          cy.wait(3000);
          cy.get('[data-cy=modal-close]').first().click();

          cy.get(' .ant-badge-dot').should('not.exist');
        }
      });
    });
  });

  describe('Create Negative flow on Source Capture Question', () => {
    it('Create Negative flow, check the question, the question should have audit trail with orange badge on the icon', () => {
      cy.get('[data-cy=sourceQuestionTab]').click();
      cy.get('[data-cy=MARKED_UP]').click();
      cy.get('.ant-badge-dot').should('not.exist');
      cy.clickQuickAction(
        '[data-cy=question-card-lungs1]',
        '[data-cy=review-sc-snippet-action-lungs1]',
        undefined,
        undefined,
        'PARENT_RELATION',
      );
      cy.get('canvas', { timeout: 20000 }).should('be.visible');

      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasRejectScQuestion) {
          req.alias = req.body.operationName;
        }
      });

      cy.get('[data-cy=overlapping-button-reject-snippet]').should('be.visible').click();
      cy.get('[data-cy=reject-snippet-overlay]').should('be.visible');
      cy.get('[data-cy=reject-reason]').first().click().type('${enter}');

      cy.checkHiddenInput('[data-cy=hidden-input-reject-reason]', 'lungsFFGR1', 5);

      cy.get('[data-cy=submit-reject-reason]').first().click();
      cy.get('[data-cy=alert-success]').should('contain.text', 'Snippet Rejected');
      cy.get('[data-cy=carousel-close]').click();
    });

    it('Open audit trail and then close it, the orange badge on the icon should be disappeared', () => {
      cy.get('[data-cy=NOT_AVAILABLE_REJECTED]').contains(8).click();
      cy.get('[data-cy=question-card-lungs1] .ant-badge-dot').should(
        'have.css',
        'background',
        `${Colors.secondary.brightOrange150} none repeat scroll 0% 0% / auto padding-box border-box`,
      );
      cy.get('[data-cy=audit-trail-button-lungs1]').click();
      cy.wait(`@${aliasAuditTrail}`).then((result) => {
        if (result?.response?.statusCode === 200) {
          cy.wait(3000);
          cy.get('[data-cy=modal-close]').first().click();

          cy.get('.ant-badge-dot').should('not.exist');
        }
      });
    });
  });
});
