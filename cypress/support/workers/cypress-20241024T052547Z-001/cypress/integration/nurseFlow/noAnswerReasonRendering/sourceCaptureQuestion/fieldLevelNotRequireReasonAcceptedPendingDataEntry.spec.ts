import { userDataDataEntryA } from "../../../../../src/constant/testFixtures";

describe.skip('Field level mark no answer - for question that require reason in Accepted Pending data Entry state [sourceCapture]', () => {
  before(() => {
    cy.reseedDB();
    cy.fillInloginAsFormV2({
      email: userDataDataEntryA.email,
    });
    cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit1Visit1');
    cy.waitForReact();
    cy.get('[data-cy=sourceQuestionTab]').click();
  });

  // tried to find a workaround, need to refactor
  it.only('Mark no answer Abdomen question in [MARK_UP_ACCEPTED STATE]', () => {
    cy.wait(2000);
    cy.get('[data-cy=MARK_UP_ACCEPTED]').should('be.visible').click();
    cy.clickQuickAction(
      '[data-cy=question-card-abdomen1]', 
      '[data-cy=question-card-abdomen1] > .question-card-action-menu > .ant-row > [data-cy=data-entry-action-abdomen1]'
      );
    // cy.clickQuickAction(
    //   '[data-cy=question-card-abdomen1]', 
    //   '[data-cy=data-entry-action-abdomen1]', 
    //   undefined, 
    //   undefined, 
    //   'PARENT_RELATION',
    //   );
    // cy.get('[data-cy=question-abdomen1]')
    //   .realHover()
    //   .then(() => {
    //     cy.get('[data-cy=data-entry-action-abdomen1] [data-cy=data-entry-action]').click({
    //       force: true,
    //     });
    //   });
    cy.get('.slick-active [data-cy=answer-input-field-ffAbdomenCon1-0-0]').click();
    cy.get('.slick-active [data-cy=answer-input-field-ffAbdomenCon1-0-0-mark-no-answer]').click();
    cy.get('.slick-active [data-cy=submit-data-entry]').click();
    cy.get('.slick-active [data-cy=modal-close]').click();
    cy.get('[data-cy=question-abdomen1]').should('not.exist');
  });

  it('Abdomen question should render the correct mark no answer reason', () => {
    cy.get('[data-cy=FILLED]').should('be.visible').click();
    cy.clickQuickAction(
      '[data-cy=question-card-abdomen1]', 
      '[data-cy=question-card-brain1] > .question-card-action-menu > .ant-row > [data-cy=view-action-abdomen1]'
      );
    // cy.get('[data-cy=question-abdomen1]')
    //   .realHover()
    //   .then(() => {
    //     // cy.get('[data-cy=data-entry-action-abdomen1] [data-cy=view-action-abdomen1]').click();
    //     cy.get('[data-cy="view-action-abdomen1"] [data-cy=view-action-abdomen1]').click({
    //       force: true,
    //     });
    //   });
    cy.get('#monitor-flow-body-abdomen1').within(() => {
      cy.get('[data-cy=No-Answer-status] [data-cy=title-No-Answer]').contains('No Answer');
      cy.get('[data-cy=No-Answer-status] [data-cy=name-No-Answer]').contains('Akyrian Admin');
      cy.get('[data-cy=No-Answer-status] [data-cy=role-No-Answer]').contains(
        '(Akyrian People, University of Tokyo Hospital)',
      );
      cy.get('[data-cy=modal-close]').click();
    });

    cy.get('[data-cy=question-abdomen1]')
      .realHover()
      .then(() => {
        // cy.get('[data-cy=data-entry-action-abdomen1] [data-cy]').click();
        cy.get('[data-cy=verify-action-abdomen1] [data-cy]').click({ force: true });
      });
    cy.get('#monitor-flow-body-abdomen1').within(() => {
      cy.get('[data-cy=No-Answer-status] [data-cy=title-No-Answer]').contains('No Answer');
      cy.get('[data-cy=No-Answer-status] [data-cy=name-No-Answer]').contains('Akyrian Admin');
      cy.get('[data-cy=No-Answer-status] [data-cy=role-No-Answer]').contains(
        '(Akyrian People, University of Tokyo Hospital)',
      );
      cy.get('[data-cy=modal-close]').click();
    });
  });
});
