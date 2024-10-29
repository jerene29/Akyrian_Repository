import 'cypress-localstorage-commands';

describe.skip('Platform and study training not received', () => {
  before(() => {
    cy.clearLocalStorageSnapshot();
    cy.reseedDB();
    cy.loginAndAcceptPlatformPrivacy('nosourcereview-signcrf@example.com');
    cy.waitForReact();
  });

  it('Should show modal confirmation that prevent user to access the study', () => {
    cy.wait(1000);
    cy.get('#studyTestId1').click();
    cy.get('[data-cy=user-training-modal]').should('exist');
  });

  it('Should redirect back to dashboard if user access visit page throught url directly', () => {
    cy.visit('/visit');
    cy.wait(1000);
    cy.url().should('contain', '/dashboard');
    cy.get('[data-cy=user-training-modal]').should('exist');
  });
});