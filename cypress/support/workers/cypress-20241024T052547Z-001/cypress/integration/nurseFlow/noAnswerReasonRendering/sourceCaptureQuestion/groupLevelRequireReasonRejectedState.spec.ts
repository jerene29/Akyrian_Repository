describe.skip('Group level mark no answer - for question that require reason in Attached pending snippet state [sourceCapture]', () => {
  before(() => {
    cy.reseedDB();
    cy.fillInloginAsFormV2({
      email: 'admin@example.com',
    });
    cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit1Visit1');
    cy.waitForReact();
    cy.get('[data-cy=sourceQuestionTab]').click();
  });

  it('Mark no answer Stress Question and Smell question - Group level in [REJECTED STATE]', () => {
    cy.get('[data-cy=NOT_AVAILABLE_REJECTED]').click();
    cy.clickQuickAction(
      '[data-cy=question-card-stress1]',
      '[data-cy=noanswer-action-stress1]',
      undefined,
      'bottom',
    );
    cy.get('[data-cy=question-stress1]').should('not.exist');
    cy.clickQuickAction(
      '[data-cy=question-card-smell1]',
      '[data-cy=noanswer-action-smell1]',
      undefined,
      'bottom',
    );
    cy.get('[data-cy=question-smell1]').should('not.exist');
  });

  it("Stress Question card and smell question card should have 'No Answer' Rendered in [PENDING APPROVAL STATE]", () => {
    cy.get('[data-cy=ACCEPTED_FROM_SOURCE_CAPTURE]').click().trigger('mouseout');
    cy.get('[data-cy=question-stress1]').contains('No Answer');
    cy.get('[data-cy=question-smell1]').contains('No Answer');
  });

  it("Stress Question card and smell question card should have 'No Answer' Rendered in [ALL STATE]", () => {
    cy.get('[data-cy=all-filter]').click();
    cy.get('[data-cy=question-stress1]').contains('No Answer');
    cy.get('[data-cy=question-smell1]').contains('No Answer');
  });
});
