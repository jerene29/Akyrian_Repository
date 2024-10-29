import { mockUserDataAdmin } from '../../../src/constant/testFixtures';

describe('No Source Rejected state modals check', () => {
  before(() => {
    cy.reseedDB();
    cy.fillInloginAsFormV2(mockUserDataAdmin);
    cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/screeningVisit1');
    cy.waitForReact();
  });

  it('Move to rejected State, There should be two questions', () => {
    cy.get('[data-cy=REJECTED]').click();
    cy.get('[data-cy=question-card-knownAllergies1] > [data-cy=question-card]').should('exist');
    cy.get('[data-cy=question-card-race1] > [data-cy=question-card]').should('exist');
  });

  it('Known allergies question , mark no answer quick action should not show any modal', () => {
    cy.clickQuickAction(
      '[data-cy=question-card-knownAllergies1]',
      '[data-cy=noanswer-action-knownAllergies1]',
    );
    cy.get('[data-cy=question-card-knownAllergies1]').should('not.exist');
  });

  it('Reset answer modal should not show any modal', () => {
    cy.clickQuickAction('[data-cy=question-card-race1]', '[data-cy=reset-answer-action-race1]');
  });
});
