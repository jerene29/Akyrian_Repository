import 'cypress-localstorage-commands';
import { 
  userDataDataEntryA, 
  userDataDataEntryB, 
  userDataSourceCapture,
  userDataVerification,
  userDataSnippetAssassment,
  mockUserDataInvestigator,
} from '../../../src/constant/testFixtures';

describe('Audit Trail No Source', () => {
  const aliasVisitDetails = 'GetVisitDetails';
  const aliasPatientVisitDetails = 'PatientVisitDetails';
  const aliasAuditTrail = 'GetAuditTrail';
  const aliasRejectQuestion = 'RejectInvestigator';

  before(() => {
    cy.clearLocalStorageSnapshot();
    cy.reseedDB();
    cy.fillInloginAsFormV2({
      email: userDataDataEntryA.email,
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
      }
    });
  });

  function relogAsDifferentUser(email: string) {
    cy.logout();
    cy.intercept('/login');
    cy.fillInloginAsFormV2({
      email,
    });
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasVisitDetails) {
        req.alias = req.body.operationName;
      }
    });

    cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit1Visit1');
    cy.wait(`@${aliasVisitDetails}`);
    cy.waitForReact();
  }

  describe('Reject With Source Data Entry Mark No Answer', () => {
    it('Fill Data Entry 2 With No Answer', () => {
      cy.get('[data-cy=sourceQuestionTab]').click();
      cy.get('[data-cy=MARK_UP_ACCEPTED]').click();
      cy.get('[data-cy=question-card-dataEntryTest2]').scrollIntoView();
      cy.clickQuickAction(
        '[data-cy=question-card-dataEntryTest2]',
        '[data-cy=data-entry-action-dataEntryTest2]',
      );
      cy.get('.slick-active [data-cy=answer-input-field-dataEntryField2-0-0]')
        .should('be.visible')
        .click();
      cy.get('[data-cy=answer-input-field-dataEntryField2-0-0-mark-no-answer]').click();
      cy.get('.slick-active [data-cy=submit-data-entry]').first().click();
      cy.get('[data-cy=alert-success]').should('contain.text', 'Question Submitted');
      cy.get('[data-cy=modal-close]').first().click({ force: true });

      relogAsDifferentUser(userDataSourceCapture.email);
      cy.get('[data-cy=sourceQuestionTab]').click();
      cy.get('[data-cy=NEED_REASON_NOT_AVAILABLE]', { timeout: 10000 }).click();
      cy.get('[data-cy=question-card-dataEntryTest2]', { timeout: 10000 }).should('be.visible');
      cy.wait(500);
      cy.get('[data-cy=question-card-dataEntryTest2]').scrollIntoView();
      cy.clickQuickAction(
        '[data-cy=question-card-dataEntryTest2]',
        '[data-cy=addReason-action-dataEntryTest2]',
      );
      cy.get('[data-cy=mark-no-answer-reason] > .ant-select > .ant-select-selector')
        .click()
        .type('{downarrow}{enter}');
      cy.get('[data-cy=submit-add-reason]').click();
      cy.get('[data-cy=alert-success]').should('contain.text', 'Reason provided');
    });

    it('Reject Data Entry With Verification User', () => {
      relogAsDifferentUser(userDataVerification.email);
      cy.get('[data-cy=sourceQuestionTab]').click();
      cy.get('[data-cy=FILLED]').click();
      cy.get('[data-cy=question-card-dataEntryTest2]', { timeout: 10000 }).should('be.visible');
      cy.wait(500);
      cy.get('[data-cy=question-card-dataEntryTest2]').scrollIntoView();
      cy.clickQuickAction(
        '[data-cy=question-card-dataEntryTest2]',
        '[data-cy=verify-action-dataEntryTest2]',
        false,
      );
      cy.get('.slick-active [data-cy=reject-data-entry]').click();
      cy.get('.slick-active [data-cy=reject-reason] > .ant-select > .ant-select-selector')
        .click()
        .type('{downarrow}{enter}');
      cy.get('.slick-active [data-cy=submit-reject-reason]').click();
      cy.get('.slick-active [data-cy=modal-close]').click({ force: true });
      cy.get('[data-cy=alert-success]').should('contain.text', 'Rejected');
    });

    it('Accept Data Entry 2 Snippet', () => {
      relogAsDifferentUser(userDataSnippetAssassment.email);
      cy.get('[data-cy=sourceQuestionTab]').click();
      cy.get('[data-cy=REJECTED]').click();
      cy.clickQuickAction(
        '[data-cy=question-card-dataEntryTest2]',
        '[data-cy=accept-reject-action-dataEntryTest2]',
      );
      cy.get('.slick-active [data-cy=approve-mark-up]').click();
      cy.get('[data-cy=alert-success]').should('contain.text', 'Snippet accepted');
      cy.get('.slick-active [data-cy=modal-close]').click({ force: true });
    });

    it('Fill Data Entry 2 as 1st Data Entry', () => {
      relogAsDifferentUser(userDataDataEntryA.email);
      cy.get('[data-cy=sourceQuestionTab]').click();
      cy.get('[data-cy=REJECTED_DATA_ENTRY]').click();
      cy.get('[data-cy=question-card-dataEntryTest2]').scrollIntoView();
      cy.clickQuickAction(
        '[data-cy=question-card-dataEntryTest2]',
        '[data-cy=edit-data-entry-action-dataEntryTest2]',
      );
      cy.get('.slick-active [data-cy=answer-input-field-dataEntryField2-0-0]').type('test');
      cy.get('.slick-active [data-cy=submit-data-entry]').first().click();
      cy.get('[data-cy=alert-success]').should('contain.text', 'Question Submitted');
      cy.get('[data-cy=modal-close]').first().click({ force: true });
    });

    it('Fill Data Entry 2 as 2nd Data Entry', () => {
      relogAsDifferentUser(userDataDataEntryB.email);
      cy.get('[data-cy=question-card-dataEntryTest2]').scrollIntoView();
      cy.clickQuickAction(
        '[data-cy=question-card-dataEntryTest2]',
        '[data-cy=data-entry-action-dataEntryTest2]',
      );
      cy.get('.slick-active [data-cy=answer-input-field-dataEntryField2-0-0]').type('test 2');
      cy.get('.slick-active [data-cy=submit-data-entry]').first().click();
      cy.get('[data-cy=alert-success]').should('contain.text', 'Question Submitted');
      cy.get('[data-cy=modal-close]').first().click({ force: true });
    });

    it('Accept Data Entry 2 With Verification User', () => {
      relogAsDifferentUser(userDataVerification.email);
      cy.get('[data-cy=sourceQuestionTab]').click();
      cy.get('[data-cy=FILLED]').click();

      cy.scrollToElement('[data-cy=question-card-dataEntryTest2]');
      cy.wait(500);
      cy.clickQuickAction(
        '[data-cy=question-card-dataEntryTest2]',
        '[data-cy=verify-action-dataEntryTest2]',
        'center',
      );

      cy.get('[data-cy=first-data-entry-dataEntryTest2]').click({ multiple: true, force: true });
      cy.get('[data-cy=accept-data-entry-dataEntryTest2]').click({ multiple: true, force: true });
      cy.get('[data-cy=alert-success]').should('contain.text', 'Question Approved');
      cy.get('[data-cy=modal-close]').first().click({ force: true });
    });

    it('Reject Data Entry 2 With Investigator User', () => {
      cy.logout();
      cy.intercept('/login');
      cy.fillInloginAsFormV2({
        email: mockUserDataInvestigator.email,
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
      cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/all-visits');
      cy.wait(`@${aliasPatientVisitDetails}`);
      cy.waitForReact();

      cy.clickQuickAction(
        '[data-cy="Data Entry 2"]',
        '[data-cy=reject-question-action-dataEntryTest2]',
        'center',
      );
      cy.get('[data-cy=reject-reason] > .ant-select > .ant-select-selector')
        .click()
        .type('{downarrow}{enter}');
      cy.get('[data-cy=submit-reject-reason]').click();
      cy.wait(`@${aliasRejectQuestion}`);
      cy.get('[data-cy=alert-success]').should('contain.text', 'Question has been rejected');
      cy.reload();
      cy.get('[data-cy=INVESTIGATOR_REJECTED]')
        .scrollIntoView({ timeout:10000 })
        .click();
      cy.get('[data-cy=audit-trail-button-dataEntryTest2]').first().click();
      cy.wait(`@${aliasAuditTrail}`).then((result) => {
        if (result?.response?.statusCode === 200) {
          cy.get('[data-cy="no-answer-reason-reason-Data Entry 2"]').contains(
            'Source document unavailable',
          );
          cy.get('[data-cy="verifier-rejected-reason-Data Entry 2"]').contains(
            'Incorrect source captured',
          );
          cy.get('[data-cy="investigator-rejected-reason-Data Entry 2"]').contains(
            'Incorrect source captured',
          );
          cy.get('[data-cy=modal-close]').first().click();
        }
      });
    });
  });
});
