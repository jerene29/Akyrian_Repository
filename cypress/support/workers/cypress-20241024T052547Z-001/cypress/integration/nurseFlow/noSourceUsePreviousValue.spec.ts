import { mockUserDataAdmin } from '../../../src/constant/testFixtures';

const mockUserData = {
  ...mockUserDataAdmin,
  studyId: 'sampleDemoStudy',
  studyRevisionId: 'demoRevision1',
};

describe('Previous value on no source visit 3', () => {
  before(() => {
    cy.reseedDB();
    cy.fillInloginAsFormV2(mockUserData, mockUserData.studyId, mockUserData.studyRevisionId);
    cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit3Visit1');
  });

  it('Fill Question using prev value btn', () => {
    cy.get('[data-cy=prev-val-field-freeText2-0-0]').click();
    cy.get('[data-cy=save-button-multiEntry1]').should('be.enabled').click();
    cy.get('[data-cy=question-card-multiEntry1]').should('not.exist');
  });

  it('Question should moved to filled state with correct answer', () => {
    cy.get('[data-cy=FILLED]').click();
    cy.get('[data-cy=question-card]').should('exist');
    cy.get('[data-cy=answer-entry-1]').should('exist');
    cy.get('[data-cy=answer-entry-1] [data-cy=question-answer-free-text]').should(
      'have.text',
      'This entry 1',
    );
    cy.get('[data-cy=answer-entry-2]').should('exist');
    cy.get('[data-cy=answer-entry-2] [data-cy=question-answer-free-text]').should(
      'have.text',
      'This entry 2',
    );
    cy.get('[data-cy=answer-entry-3]').should('exist');
    cy.get('[data-cy=answer-entry-3] [data-cy=question-answer-free-text]').should(
      'have.text',
      'This entry 3',
    );
  });
});
