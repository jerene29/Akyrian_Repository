import 'cypress-localstorage-commands';
import { 
  userDataDataEntryA,
  userDataDataEntryB,
  userDataSourceCapture,
  userDataSnippetAssassment,
  userDataVerification,
  mockUserDataInvestigator
} from '../../../src/constant/testFixtures';

describe('Audit Trail No Source', () => {
  const aliasVisitDetails = 'GetVisitDetails';
  const aliasPatientVisitDetails = 'PatientVisitDetails';
  const aliasAuditTrail = 'GetAuditTrail';
  const aliasRejectQuestion = 'RejectInvestigator';

  before(() => {
    cy.beforeSetup(userDataDataEntryB);
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
    // cy.intercept('/login');
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

  describe('Reject With Source Data Entry', () => {
    it('Fill Data Entry as 1st Data Entry', () => {
      cy.get('[data-cy=sourceQuestionTab]')
        .should('be.visible')
        .click()
        .get('[data-cy=MARK_UP_ACCEPTED]')
        .click();
      cy.clickQuickAction(
        '[data-cy=question-card-dataEntryTest1]',
        '[data-cy=data-entry-action-dataEntryTest1]',
        'center',
        'topRight',
      );
      cy.get('.slick-active [data-cy=answer-input-field-dataEntryField1-0-0]')
        .should('be.visible')
        .type('test');
      cy.get('.slick-active [data-cy=submit-data-entry]').first().click();
      cy.get('[data-cy=alert-success]').should('contain.text', 'Question Submitted');
      cy.get('[data-cy=modal-close]').first().click({ force: true });
    });

    it('Fill Data Entry as 2nd Data Entry', () => {
      relogAsDifferentUser(userDataDataEntryA.email);
      cy.clickQuickAction(
        '[data-cy=question-card-dataEntryTest1]',
        '[data-cy=data-entry-action-dataEntryTest1]',
        'center',
        'topRight',
      );
      cy.get('.slick-active [data-cy=answer-input-field-dataEntryField1-0-0]')
        .should('be.visible')
        .type('test 2');
      cy.get('.slick-active [data-cy=submit-data-entry]').first().click();
      cy.get('[data-cy=alert-success]').should('contain.text', 'Question Submitted');
      cy.get('[data-cy=modal-close]').first().click({ force: true });
    });

    it('Reject Data Entry With Verification User', () => {
      relogAsDifferentUser(userDataVerification.email);
      cy.get('[data-cy=sourceQuestionTab]').click();
      cy.get('[data-cy=FILLED]').click();
      cy.clickQuickAction(
        '[data-cy=question-card-dataEntryTest1]',
        '[data-cy=verify-action-dataEntryTest1]',
      );
      cy.get('.slick-active [data-cy=reject-data-entry]').should('be.visible').click();
      cy.get('.slick-active [data-cy=reject-reason] > .ant-select > .ant-select-selector')
        .click()
        .type('{downarrow}{enter}');
      cy.get('.slick-active [data-cy=submit-reject-reason]').click();
      cy.get('.slick-active [data-cy=modal-close]').click({ force: true });
      cy.get('[data-cy=alert-success]', { timeout: 10000 }).should('contain.text', 'Rejected');
    });

    it('Reject Snippet With Snippet Assesment User', () => {
      relogAsDifferentUser(userDataSnippetAssassment.email);
      cy.get('[data-cy=sourceQuestionTab]').click();
      cy.get('[data-cy=REJECTED]').click();

      cy.clickQuickAction(
        '[data-cy=question-card-dataEntryTest1]',
        '[data-cy=accept-reject-action-dataEntryTest1]',
        undefined,
        undefined,
        'PARENT_RELATION',
      );

      cy.get('.slick-active [data-cy=reject-mark-up]').should('be.visible').click();
      cy.get('.slick-active [data-cy=modal-close]').click({ force: true });
      cy.get('[data-cy=alert-success]').should('contain.text', 'Moved to Rejected');
      // TODO: change this cy.wait() after refetching the page, this is temporary fix
      cy.wait(`@${aliasVisitDetails}`);
      cy.scrollToElement('[data-cy=MARK_UP_ACCEPTED]').click();
      cy.get('[data-cy=audit-trail-button-dataEntryTest1]').first().click();
      cy.wait(`@${aliasAuditTrail}`).then((result) => {
        if (result?.response?.statusCode === 200) {
          cy.get('[data-cy="verifier-rejected-reason-Data Entry 1"]').contains(
            'Incorrect source captured',
          );
          cy.get('[data-cy="event-title-MARK_UP_REJECTED"]');
          cy.get('[data-cy=modal-close]').first().click();
        }
      });
    });

    it('Fill Data Entry 2 With No Answer', () => {
      relogAsDifferentUser(userDataDataEntryB.email);
      cy.get('[data-cy=sourceQuestionTab]').click();
      cy.get('[data-cy=MARK_UP_ACCEPTED]').click();
      cy.scrollToElement('[data-cy=question-card-dataEntryTest2]');
      cy.clickQuickAction(
        '[data-cy=question-card-dataEntryTest2]',
        '[data-cy=data-entry-action-dataEntryTest2]',
      );
      cy.get('.slick-active [data-cy=answer-input-field-dataEntryField2-0-0]').click();
      cy.get('[data-cy=answer-input-field-dataEntryField2-0-0-mark-no-answer]').click();
      cy.get('.slick-active [data-cy=submit-data-entry]').click();
      cy.get('[data-cy=alert-success]').should('contain.text', 'Question Submitted');
      cy.get('[data-cy=modal-close]').first().click({ force: true });

      relogAsDifferentUser(userDataSourceCapture.email);
      cy.get('[data-cy=sourceQuestionTab]').click();
      cy.get('[data-cy=NEED_REASON_NOT_AVAILABLE]', { timeout: 10000 }).click();
      cy.wait(1000)
      cy.scrollToElement('[data-cy=question-card-dataEntryTest2]');
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

    it('Reject Data Entry 2 With Verification User', () => {
      relogAsDifferentUser(userDataVerification.email);
      cy.get('[data-cy=sourceQuestionTab]').click();
      cy.get('[data-cy=FILLED]').click();
      cy.wait(1000)
      cy.scrollToElement('[data-cy=question-card-dataEntryTest2]');
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
      cy.wait(1000)
      cy.scrollToElement('[data-cy=question-card-dataEntryTest2]');
      cy.clickQuickAction(
        '[data-cy=question-card-dataEntryTest2]',
        '[data-cy=accept-reject-action-dataEntryTest2]',
      );
      cy.get('.slick-active [data-cy=approve-mark-up]').click();
      cy.get('[data-cy=alert-success]').should('contain.text', 'Snippet accepted');
      cy.get('.slick-active [data-cy=modal-close]').click({ force: true });
    });

    it('Fill Data Entry 2 as 1st Data Entry', () => {
      relogAsDifferentUser(userDataDataEntryB.email);
      cy.get('[data-cy=REJECTED_DATA_ENTRY]').click();
      cy.scrollToElement('[data-cy=question-card-dataEntryTest2]');
      cy.clickQuickAction(
        '[data-cy=question-card-dataEntryTest2]',
        '[data-cy=edit-data-entry-action-dataEntryTest2]',
        undefined,
        undefined,
        'PARENT_RELATION',
      );
      cy.get('.slick-active [data-cy=answer-input-field-dataEntryField2-0-0]').type('test');
      cy.get('.slick-active [data-cy=submit-data-entry]').first().click();
      cy.get('[data-cy=alert-success]').should('contain.text', 'Question Submitted');
      cy.get('[data-cy=modal-close]').first().click({ force: true });
    });

    it('Fill Data Entry 2 as 2nd Data Entry', () => {
      relogAsDifferentUser(userDataDataEntryA.email);
      cy.scrollToElement('[data-cy=question-card-dataEntryTest2]');
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
      cy.clickQuickAction(
        '[data-cy=question-card-dataEntryTest2]',
        '[data-cy=verify-action-dataEntryTest2]',
        undefined,
        undefined,
        'PARENT_RELATION',
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
      cy.get('[data-cy=INVESTIGATOR_REJECTED]')
        .click({ force: true })
        .trigger('mouseleave', { force: true });
      cy.get('[data-cy=audit-trail-button-dataEntryTest2]').first().click();
      cy.wait(`@${aliasAuditTrail}`).then((result) => {
        if (result?.response?.statusCode === 200) {
          cy.wait(3000);
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
