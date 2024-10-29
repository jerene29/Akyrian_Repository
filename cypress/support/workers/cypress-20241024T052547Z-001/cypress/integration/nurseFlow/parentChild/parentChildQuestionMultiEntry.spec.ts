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
    cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit1Visit1');
  });

  it('Select Parent Child Question with multi-entry', () => {
    cy.get('[data-cy=question-card-multiEntryPC1]').scrollIntoView();
    cy.get('[data-cy=answer-input-field-parentField1-0-0] > .ant-select > .ant-select-selector')
      .click()
      .type('{enter}');
    cy.get('[data-cy=answer-input-field-childField1-0-1]').should('exist').type('CHILD A ANSWER 1');
    cy.get('[data-cy=add-answer-multiEntryPC1]').should('exist').click();
    cy.get('[data-cy=trash-button-multiEntryPC1-0]').should('exist');
    cy.get('[data-cy=answer-input-field-parentField1-1-0] > .ant-select')
      .should('exist')
      .click()
      .type('{downarrow}{enter}');
    cy.get('[data-cy=answer-input-field-childField2-1-1]').should('exist').type('CHILD B ANSWER 2');
    cy.get('[data-cy=add-answer-multiEntryPC1]').should('exist').click();
    cy.get('[data-cy=answer-input-field-parentField1-2-0] > .ant-select')
      .should('exist')
      .type('{downarrow}{downarrow}{enter}');
    cy.get('[data-cy=answer-input-field-childField3-2-1]').should('not.exist');
  });

  it('Remove second Entry, Should retain third answer', () => {
    cy.get('[data-cy=trash-button-multiEntryPC1-1]').should('exist').click();
  });
});
