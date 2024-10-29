describe('Reject question From investigator Role [sourceCapture]', () => {
  before(() => {
    cy.reseedDB();
    cy.fillInloginAsFormV2({
      email: 'signcrf@example.com',
    });
    cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit1Visit1');
    cy.waitForReact();
  });

  it('Reject Rececptor with provided reject reason ', () => {
    cy.get('[data-cy=Receptor]')
      .realHover()
      .then(() => {
        cy.get('[data-cy=reject-question-action-receptor1] [data-cy=reject-answer-icon]').click({
          force: true,
        });
      });
    cy.get('.ant-modal-body [data-cy=reject-question-modal]').within(() => {
      cy.get('[data-cy=reject-reason]').type('{enter}'); // Data entry error
      cy.get('[data-cy=submit-reject-reason]').click({ force: true });
    });
    cy.get('[data-cy=Receptor]').should('not.exist');
  });

  it("Reject Hair Question with custom reject reason 'Using OTHER reason'", () => {
    cy.get('[data-cy=Hair]')
      .realHover()
      .then(() => {
        cy.get('[data-cy=reject-question-action-hair1] [data-cy=reject-answer-icon]').click({
          force: true,
        });
      });
    cy.get('.ant-modal-body [data-cy=reject-question-modal]').within(() => {
      cy.get('[data-cy=reject-reason]')
        .click({ force: true })
        .type('{uparrow}{enter}')
        .type('Other hair reason'); // Other hair reason
      cy.get('[data-cy=submit-reject-reason]').click({ force: true });
    });
  });
});
