import {
  AddPatientDocument,
  IAddPatientMutationVariables,
  ISexType,
  SubmitVisitStatusDocument,
} from '../../../../src/graphQL/generated/graphql';

const mockUserData = {
  email: 'admin@example.com',
  studyId: 'sampleDemoStudy',
  studyRevisionId: 'demoRevision1',
};

describe('Parent Child Question on Nurse flow', () => {
  before(() => {
    cy.reseedDB();
    cy.fillInloginAsFormV2(mockUserData, mockUserData.studyId, mockUserData.studyRevisionId);
    cy.visit('/visit/demoRevision1');
  });

  it('Create new patient and navigate to screening visit', () => {
    cy.addRandomPatientScreening();
  });

  it('Should show one field initially on question Inclusion Criteria', () => {
    cy.get(
      '[data-cy=question-card-inclusionCriteria] > [data-cy=question-card] [data-cy=question-title-inclusionCriteria]',
    ).should('exist');
    cy.get('[data-cy=answer-input-field-ffAge-0-0]').should('exist');
    cy.get('[data-cy=answer-input-field-ffDyspnea-0-1]').should('not.exist');
    cy.get('[data-cy=answer-input-field-ffSignedInformedConsent-0-2] > .ant-select').should(
      'not.exist',
    );
    cy.get('[data-cy=question-card-inclusionCriteria] [data-cy=floating-label]').should(
      'have.text',
      'Age over 18 years',
    );
  });
  it('Fill Inclusion Criteria with "YES" Value, then answer CHILD question, then Change parent question value to "NO" then save the question', () => {
    cy.get(
      '[data-cy=question-card-inclusionCriteria] > [data-cy=question-card] [data-cy=question-title-inclusionCriteria]',
    ).should('exist');
    cy.get('[data-cy=answer-input-field-ffAge-0-0]').should('exist').click().type('{enter}');
    cy.get('[data-cy=answer-input-field-ffDyspnea-0-1]')
      .should('exist')
      .click()
      .type('{downarrow}{enter}');
    cy.get('[data-cy=answer-input-field-ffAge-0-0]').click().type('{downarrow}{enter}');
    cy.get('[data-cy=answer-input-field-ffSignedInformedConsent-0-2]').should('not.exist');
    cy.get('[data-cy=save-button-inclusionCriteria]').click();
  });
  it('Move to Filled state , question with Inclusion criteria should only have ONE answer', () => {
    cy.get('[data-cy=answer-entry-1] > *').should('have.length', 1);
  });
});
