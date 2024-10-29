import 'cypress-localstorage-commands';

import Colors from '../../src/constant/Colors';

describe('Audit Trail Icon Investigator', () => {
  const aliasVisitDetails = 'PatientVisitDetails';
  const aliasRejectQuestion = 'RejectInvestigator';
  const aliasAuditTrail = 'GetAuditTrail';

  before(() => {
    cy.clearLocalStorageSnapshot();
    cy.reseedDB();
    cy.fillInloginAsFormV2({
      email: 'signcrf@example.com',
    });
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasVisitDetails) {
        req.alias = req.body.operationName;
      }
    });
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasRejectQuestion) {
        req.alias = req.body.operationName;
      }
    });
    cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/all-visits');
    cy.wait(`@${aliasVisitDetails}`);
    cy.waitForReact();
  });

  beforeEach(() => {
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasAuditTrail) {
        req.alias = req.body.operationName;
      }
    });
  });

  it('Reject Question', () => {
    cy.waitForReact();
    cy.get('[data-cy=Receptor]').should('be.visible').realHover({
      scrollBehavior: 'nearest',
      position: 'center',
      pointer: 'mouse',
    });
    cy.wait(3000); // Waiting view FFGR so it won't get race condition with reject question
    cy.clickQuickAction(
      '[data-cy=Receptor]',
      '[data-cy=reject-question-action-receptor1]',
      'nearest',
    );
    cy.get('[data-cy=reject-reason] > .ant-select > .ant-select-selector')
      .click()
      .type('{downarrow}{enter}');
    cy.get('[data-cy=submit-reject-reason]').click();
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasVisitDetails) {
        req.alias = req.body.operationName;
      }
    });
    cy.wait(`@${aliasRejectQuestion}`);
    cy.wait(`@${aliasVisitDetails}`, { timeout: 60000 });
  });

  it('Go to Rejected State, audit trail icon should have orange badge', () => {
    cy.waitForReact();
    cy.get('[data-cy=INVESTIGATOR_REJECTED]')
      .click({ force: true })
      .trigger('mouseout', { force: true });
    cy.get('.ant-badge-dot')
      .first()
      .should('exist')
      .should(
        'have.css',
        'background',
        `${Colors.secondary.brightOrange150} none repeat scroll 0% 0% / auto padding-box border-box`,
      );
  });

  it('Open audit trail and then close it, the orange badge on the icon should dissapeared', () => {
    cy.wait(3000);
    cy.get('[data-cy=audit-trail-button-receptor1]').click();
    cy.wait(`@${aliasAuditTrail}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        // to make sure any query and state update finish need check the events is rendered/visible
        cy.get('[data-cy=event-title-INVESTIGATOR_REJECTED]').should('be.visible');
        cy.get('[data-cy=event-title-INVESTIGATOR_VIEWED]').should('be.visible');
        cy.get('[data-cy=modal-close]').first().click();
        cy.get('.ant-badge-dot').should('not.exist');
      }
    });
  });
});
