describe('Approve Rejecton question from Verifier Rejected state [sourceCapture]', () => {
  before(() => {
    cy.reseedDB();
    cy.fillInloginAsFormV2({
      email: 'admin@example.com',
    });
    cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit1Visit1');
    cy.waitForReact();
    cy.get('[data-cy=sourceQuestionTab]').click();
  });

  it('Approve Rejecttion Mouth Question in Verifier Rejected [REJECTED] state', () => {
    cy.get('[data-cy=NOT_AVAILABLE_REJECTED]').click().trigger('mouseout');
    cy.clickQuickAction('[data-cy=question-card-mouth1]', '[data-cy=accept-reject-action-mouth1]');
    cy.get('.slick-active #monitor-flow-body-mouth1').within(() => {
      cy.get('[data-cy=approve-mark-up]').click();
    });
    cy.wait(3000);
    cy.get('[data-cy=alert-success]');
    cy.get('.slick-active [data-cy=modal-close]').click({ force: true });
    cy.get('[data-cy=question-mouth1]', { timeout: 10000 }).should('not.exist');
  });

  it('Mouth question should have correct reject reason rendering in [REJECTED_DATA_ENTRY] state', () => {
    cy.get('[data-cy=REJECTED_DATA_ENTRY]').click().trigger('mouseout');
    cy.get('[data-cy=question-mouth1]').click();
    cy.get('[data-cy=Rejected-status] [data-cy=title-Rejected]').contains('Rejected');
    cy.get('[data-cy=Rejected-status] [data-cy=desc-Rejected]').contains(
      'Incorrect source captured',
    );
    cy.get('[data-cy=Rejected-status] [data-cy=name-Rejected]').contains('Samuel Oak');
    cy.get('[data-cy=Rejected-status] [data-cy=role-Rejected]').contains(
      '(Data Adjudicator & No Source Review User, University of Tokyo Hospital)',
    );
    cy.get('[data-cy=img-front-mulSiteSourceCapture1]').click();
    cy.get('[data-cy=Rejected-Reason]').trigger('mouseover');
    cy.get('.ant-tooltip-inner [data-cy=Rejected-status] [data-cy=title-Rejected]').contains(
      'Rejected',
    );
    cy.get('.ant-tooltip-inner [data-cy=Rejected-status] [data-cy=desc-Rejected]').contains(
      'Incorrect source captured',
    );
    cy.get('.ant-tooltip-inner [data-cy=Rejected-status] [data-cy=name-Rejected]').contains(
      'Samuel Oak',
    );
    cy.get('.ant-tooltip-inner [data-cy=Rejected-status] [data-cy=role-Rejected]').contains(
      '(Data Adjudicator & No Source Review User, University of Tokyo Hospital)',
    );
    cy.get('[data-cy=carousel-close] > path').click();
  });
});
