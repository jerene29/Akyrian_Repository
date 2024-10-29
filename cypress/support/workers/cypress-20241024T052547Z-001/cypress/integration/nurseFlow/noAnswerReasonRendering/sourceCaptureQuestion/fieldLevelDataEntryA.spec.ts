import { mockUserDataInvestigator, userDataDataEntryA, mockUserDataAdmin } from "../../../../../src/constant/testFixtures";

describe('Reject question From investigator Role [sourceCapture]', () => {
  before(() => {
    cy.reseedDB();
    cy.fillInloginAsFormV2({
      email: mockUserDataInvestigator.email,
    });
    cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit1Visit1');
    cy.waitForReact();
  });

  it('Reject Rececptor with provided reject reason ', () => {
    cy.clickQuickAction('[data-cy=Receptor]', '[data-cy=reject-question-action-receptor1]');
    cy.get('.ant-modal-body [data-cy=reject-question-modal]').within(() => {
      cy.get('[data-cy=reject-reason]').type('{enter}'); // Data entry error
      cy.get('[data-cy=submit-reject-reason]').click({ force: true });
    });
    cy.get('[data-cy=alert-success]', { timeout: 5000 });
    cy.wait(6000);
    cy.get('[data-cy=Receptor]').should('not.exist');
  });

  it("Reject Hair Question with custom reject reason 'Using OTHER reason'", () => {
    cy.clickQuickAction('[data-cy=Hair]', '[data-cy=reject-question-action-hair1]');
    cy.get('.ant-modal-body [data-cy=reject-question-modal]').within(() => {
      cy.get('[data-cy=reject-reason]')
        .click({ force: true })
        .type('{uparrow}{enter}')
        .type('Other hair reason'); // Other hair reason
      cy.get('[data-cy=submit-reject-reason]').click({ force: true });
    });
    cy.wait(1500);
    cy.logout();
  });
});

describe('Reject question from pending verification state [sourceCapture]', () => {
  before(() => {
    cy.reload();
    cy.clearLocalStorageSnapshot();
    cy.fillInloginAsFormV2({
      email: userDataDataEntryA.email,
    });
    cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit1Visit1');
    cy.waitForReact();
    cy.get('[data-cy=sourceQuestionTab]').click();
  });

  it('Question Temperature mark no answer in quick action Data Entry', () => {
    cy.clickQuickAction('[data-cy=question-bodyTemp1]', '[data-cy=data-entry-action-bodyTemp1]');
    cy.get('.slick-active #monitor-flow-body-bodyTemp1').within(() => {
      cy.get('[data-cy=answer-input-field-ffTemp1-0-0]').type('123');
      cy.get('[data-cy=answer-input-field-ffTempUnit1-0-1]').type('{uparrow}{enter}');
      cy.get('[data-cy=submit-data-entry]').click();
    });
    cy.get('[data-cy=alert-success]').should('exist');
    cy.get('.slick-active [data-cy=modal-close]').click({ force: true });

    cy.logout();
  });
});

describe('Login using Admin user to Add Reason in state Reason Required', () => {
  before(() => {
    cy.reload();
    cy.clearLocalStorageSnapshot();
    cy.fillInloginAsFormV2({
      email: mockUserDataAdmin.email,
    });
    cy.waitForReact();
    cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit1Visit1');
    cy.get('[data-cy=sourceQuestionTab]').click();
  });

  describe('Question Temperature add reason in state Reason Required', () => {
    it('Select state Reason Required', () => {
      cy.get('[data-cy=NEED_REASON_NOT_AVAILABLE]').click().trigger('mouseout');
      cy.wait(3000);
    });
    it('Add reason', () => {
      cy.get('[data-cy=question-bodyTemp1]')
        .realHover()
        .then(() => {
          cy.get('[data-cy=question-card-bodyTemp1] [data-cy=addReason-action] [data-cy]').click();
        });
      cy.get('.ant-modal-body').within(() => {
        cy.get('[data-cy=No-Answer-status] [data-cy=title-No-Answer]').contains('No Answer');
        cy.get('[data-cy=No-Answer-status] [data-cy=name-No-Answer]').contains('Data Entry A');
        cy.get('[data-cy=No-Answer-status] [data-cy=role-No-Answer]').contains(
          '(Data Entry User, University of Tokyo Hospital)',
        );
      });
      cy.get('[data-cy=mark-no-answer-reason] > .ant-select > .ant-select-selector')
        .click()
        .type('{downarrow}{enter}'); // Source document unavailable
      cy.get('[data-cy=submit-add-reason]').click();
      cy.wait(1000);
    });
    it('Select state Data Entry Complete Pending Verification', () => {
      cy.get('[data-cy=FILLED]').click().trigger('mouseout');
    });
    it('Check no answer detail info in quick action Verify', () => {
      cy.scrollToElement('[data-cy=question-bodyTemp1]')
        .realHover()
        .then(() => {
          cy.get(
            '[data-cy=question-card-bodyTemp1] [data-cy=verify-action-bodyTemp1] [data-cy]',
          ).click({ force: true });
        });
      cy.get('#monitor-flow-body-bodyTemp1').within(() => {
        cy.get(
          '[data-cy=second-data-entry-bodyTemp1] [data-cy=No-Answer-status] [data-cy=title-No-Answer]',
        ).contains('No Answer');
        cy.get(
          '[data-cy=second-data-entry-bodyTemp1] [data-cy=No-Answer-status] [data-cy=desc-No-Answer]',
        ).contains('Source document unavailable');
        cy.get(
          '[data-cy=second-data-entry-bodyTemp1] [data-cy=No-Answer-status] [data-cy=name-No-Answer]',
        ).contains('Data Entry A');
        cy.get(
          '[data-cy=second-data-entry-bodyTemp1] [data-cy=No-Answer-status] [data-cy=role-No-Answer]',
        ).contains('(Data Entry User, University of Tokyo Hospital)');
        cy.get('[data-cy=modal-close]').click();
      });
    });
  });

  describe('Check question Receptor and Hair that rejected by investigator', () => {
    it('Select state Rejected Data Entry', () => {
      cy.get('[data-cy=NOT_AVAILABLE_REJECTED]').click().trigger('mouseout');
    });
    it('Check rejected Receptor info under image stack and in carousel modal rejected notif tooltip', () => {
      cy.get('[data-cy=question-receptor1]').click();
      cy.get('[data-cy=Rejected-status] [data-cy=title-Rejected]').contains('Rejected');
      cy.get('[data-cy=Rejected-status] [data-cy=desc-Rejected]').contains('Data entry error');
      cy.get('[data-cy=Rejected-status] [data-cy=name-Rejected]').contains('Sign CRF');
      cy.get('[data-cy=Rejected-status] [data-cy=role-Rejected]').contains(
        '(Sign CRF User, University of Tokyo Hospital)',
      );

      cy.get('[data-cy=img-front-mulSiteSourceCapture1]').click();
      cy.get('[data-cy=Rejected-Reason]').trigger('mouseover');
      cy.get('.ant-tooltip-inner [data-cy=Rejected-status] [data-cy=title-Rejected]').contains(
        'Rejected',
      );
      cy.get('.ant-tooltip-inner [data-cy=Rejected-status] [data-cy=desc-Rejected]').contains(
        'Data entry error',
      );
      cy.get('.ant-tooltip-inner [data-cy=Rejected-status] [data-cy=name-Rejected]').contains(
        'Sign CRF',
      );
      cy.get('.ant-tooltip-inner [data-cy=Rejected-status] [data-cy=role-Rejected]').contains(
        '(Sign CRF User, University of Tokyo Hospital)',
      );
      cy.wait(500);
      cy.get('[data-cy=carousel-close] > path').click();
    });
    it('Check rejected Hair info under image stack and in carousel modal rejected notif tooltip', () => {
      cy.get('[data-cy=question-hair1]').click();
      cy.get('[data-cy=Rejected-status] [data-cy=title-Rejected]').contains('Rejected');
      cy.get('[data-cy=Rejected-status] [data-cy=desc-Rejected]').contains('Other hair reason');
      cy.get('[data-cy=Rejected-status] [data-cy=name-Rejected]').contains('Sign CRF');
      cy.get('[data-cy=Rejected-status] [data-cy=role-Rejected]').contains(
        '(Sign CRF User, University of Tokyo Hospital)',
      );

      cy.get('[data-cy=img-front-mulSiteSourceCapture1]').click();
      cy.get('[data-cy=Rejected-Reason]').trigger('mouseover');
      cy.get('.ant-tooltip-inner [data-cy=Rejected-status] [data-cy=title-Rejected]').contains(
        'Rejected',
      );
      cy.get('.ant-tooltip-inner [data-cy=Rejected-status] [data-cy=desc-Rejected]').contains(
        'Other hair reason',
      );
      cy.get('.ant-tooltip-inner [data-cy=Rejected-status] [data-cy=name-Rejected]').contains(
        'Sign CRF',
      );
      cy.get('.ant-tooltip-inner [data-cy=Rejected-status] [data-cy=role-Rejected]').contains(
        '(Sign CRF User, University of Tokyo Hospital)',
      );
      cy.wait(500);
      cy.get('[data-cy=carousel-close] > path').click();
    });
    it('Check rejected Detail in view modal that 2 cards in All State', () => {
      cy.get('[data-cy=all-filter]').click();

      cy.get('[data-cy=question-receptor1]').click();
      cy.get('.ant-modal-content [data-cy=Rejected-status] [data-cy=title-Rejected]').contains(
        'Rejected',
      );
      cy.get('.ant-modal-content [data-cy=Rejected-status] [data-cy=desc-Rejected]').contains(
        'Data entry error',
      );
      cy.get('.ant-modal-content [data-cy=Rejected-status] [data-cy=name-Rejected]').contains(
        'Sign CRF',
      );
      cy.get('.ant-modal-content [data-cy=Rejected-status] [data-cy=role-Rejected]').contains(
        '(Sign CRF User University of Tokyo Hospital)',
      );
      cy.get('[data-cy=modal-close]').click({ force: true });
      cy.wait(500);

      cy.get('[data-cy=question-hair1]').click();
      cy.get('.ant-modal-content [data-cy=Rejected-status] [data-cy=title-Rejected]').contains(
        'Rejected',
      );
      cy.get('.ant-modal-content [data-cy=Rejected-status] [data-cy=desc-Rejected]').contains(
        'Other hair reason',
      );
      cy.get('.ant-modal-content [data-cy=Rejected-status] [data-cy=name-Rejected]').contains(
        'Sign CRF',
      );
      cy.get('.ant-modal-content [data-cy=Rejected-status] [data-cy=role-Rejected]').contains(
        '(Sign CRF User University of Tokyo Hospital)',
      );
      cy.get('[data-cy=modal-close]').click({ force: true });
      cy.wait(500);
    });
  });
});
