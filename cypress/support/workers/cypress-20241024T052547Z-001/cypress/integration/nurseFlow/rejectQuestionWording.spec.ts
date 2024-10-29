describe("Group level mark no answer - for question that doesn't require reason [sourceCapture]", () => {
  before(() => {
    cy.reseedDB();
    cy.fillInloginAsFormV2({
      email: 'admin@example.com',
    });
    cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit1Visit1');
    cy.waitForReact();
    cy.get('[data-cy=sourceQuestionTab]').click();
  });

  it('Mark no answer Hearing Question (does not require reason)', () => {
    cy.get('[data-cy=question-hearing1]')
      .realHover()
      .then(() => {
        cy.get('[data-cy=noanswer-action-hearing1] [data-cy=open-modal-noanswer] ').click({
          force: true,
        });
      });
    cy.wait(2000);
  });

  it('Question should have "No Answer" as an answer ', () => {
    cy.get('[data-cy=ACCEPTED_FROM_SOURCE_CAPTURE]').click().trigger('mouseout');
    cy.get('[data-cy=question-hearing1]').contains('No Answer');
    cy.get('[data-cy=question-hearing1]')
      .realHover()
      .then(() => {
        cy.get('[data-cy=add-query-action]').click({ force: true });
      });
    cy.get('[data-cy=No-Answer-status] [data-cy=title-No-Answer]').contains('No Answer');
    cy.get('[data-cy=No-Answer-status] [data-cy=name-No-Answer]').contains('Akyrian Admin');
    cy.get('[data-cy=No-Answer-status] [data-cy=role-No-Answer]').contains(
      '(Akyrian People, University of Tokyo Hospital)',
    );
    cy.get('[data-cy=modal-close]').click();
    cy.wait(500);
    cy.get('[data-cy=all-filter]').click();
    cy.get('[data-cy=question-hearing1]').contains('No Answer');
  });
});
