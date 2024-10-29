import 'cypress-localstorage-commands';

describe('Audit Trail No Source', () => {
  const aliasVisitDetails = 'GetVisitDetails';
  const aliasPatientVisitDetails = 'PatientVisitDetails';
  const aliasAuditTrail = 'GetAuditTrail';
  const aliasRejectQuestion = 'RejectInvestigator';

  before(() => {
    cy.clearLocalStorageSnapshot();
    // cy.reseedDB();
    cy.fillInloginAsFormV2({
      email: 'admin@example.com',
    });
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasVisitDetails) {
        req.alias = req.body.operationName;
      }
    });

    cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/screeningVisit1');
    cy.wait(`@${aliasVisitDetails}`);
  });

  beforeEach(() => {
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasAuditTrail) {
        req.alias = req.body.operationName;
      }
    });
  });

  describe('Reject No Source Question', () => {
    it('Verifier Reject and Check Audit Trail Event', () => {
      cy.get('[data-cy=noSourceQuestionTab]').click();
      cy.get('[data-cy=answer-input-field-ffMedCon1-0-0]').type('test medical condition');
      cy.get('[data-cy=save-button-medCondition1]').click();
      cy.get('[data-cy=alert-success]').should('contain.text', 'Answer Submitted');
      cy.get('[data-cy=FILLED]').trigger('click');
      cy.clickQuickAction(
        '[data-cy=question-card-medCondition1]',
        '[data-cy=accept-reject-action-medCondition1]',
        false,
      );
      cy.get('.slick-active [data-cy=reject-data-entry]').should('be.visible').click();
      cy.get('.slick-active [data-cy=reject-reason] > .ant-select > .ant-select-selector')
        .click()
        .type('{downarrow}{enter}');
      cy.get('.slick-active [data-cy=submit-reject-reason]').click();
      cy.get('.slick-active [data-cy=modal-close]').click({ force: true });
      cy.wait(3000);
      cy.get('[data-cy=REJECTED]').click();
      cy.get('[data-cy=audit-trail-button-medCondition1]').click();
      cy.wait(`@${aliasAuditTrail}`).then((result) => {
        if (result?.response?.statusCode === 200) {
          cy.get('[data-cy="verifier-rejected-reason-Medical Condition"]').contains(
            'Incorrect subject',
          );
          cy.get('[data-cy=modal-close]').first().click();
        }
      });
    });

    it('Change answer and approved data entry with verifier user', () => {
      cy.clickQuickAction(
        '[data-cy=question-card-medCondition1]',
        '[data-cy=change-answer-action-medCondition1]',
        false,
      );
      cy.get('[data-cy=answer-input-field-ffMedCon1-0-0]').click();
      cy.get('[data-cy=answer-input-field-ffMedCon1-0-0-mark-no-answer]').click();
      cy.get('[data-cy=save-button-medCondition1]').click();
      cy.get('[data-cy=alert-success]').should('contain.text', 'Answer Submitted');
    });

    it('Reject data entry with investigator user', () => {
      cy.logout();
      cy.intercept('/login');
      cy.fillInloginAsFormV2({
        email: 'signcrf@example.com',
      });
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasPatientVisitDetails) {
          req.alias = req.body.operationName;
        }
      });
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasRejectQuestion) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-test=testRevisionId1]', { timeout: 10000 }).should('be.visible')
      cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/all-visits', {
        timeout: 20000,
      });
      cy.wait(`@${aliasPatientVisitDetails}`, { timeout: 60000 });
      cy.waitForReact();
      cy.get('[data-cy="Medical Condition"]').should('be.visible').realHover({
        scrollBehavior: 'nearest',
        position: 'center',
        pointer: 'mouse',
      });
      cy.wait(3000); // Waiting view FFGR so it won't get race condition with reject question
      cy.clickQuickAction(
        '[data-cy="Medical Condition"]',
        '[data-cy=reject-question-action-medCondition1]',
      );
      cy.get('[data-cy=reject-reason] > .ant-select > .ant-select-selector')
        .click()
        .type('{downarrow}{enter}');
      cy.get('[data-cy=submit-reject-reason]').click();
      cy.wait(`@${aliasRejectQuestion}`);

      // Previous intercept can be cached
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasPatientVisitDetails) {
          req.alias = `${aliasPatientVisitDetails}New`;
        }
      });
      cy.wait(`@${aliasPatientVisitDetails}New`, { timeout: 60000 });

      cy.waitForReact();
      cy.get('[data-cy=INVESTIGATOR_REJECTED]').click({ force: true });
      cy.get('[data-cy=audit-trail-button-medCondition1]').first().click();
      cy.wait(`@${aliasAuditTrail}`).then((result) => {
        if (result?.response?.statusCode === 200) {
          cy.get('[data-cy="investigator-rejected-reason-Medical Condition"]').contains(
            'Incorrect subject',
          );
          cy.get('[data-cy=modal-close]').first().click();
        }
      });
    });
  });
});
