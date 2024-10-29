import { AddPatientDocument, IAddPatientMutationVariables, ISexType, SubmitVisitStatusDocument } from "../../../src/graphQL/generated/graphql";
import { randomAlphabet, randomAlphaNumeric, randomDate } from "../../helper/randomGenerator";
import client from "../../utils/client";
import { aliasMutation, aliasQuery } from "../../utils/graphql-test-utils";

const mockUserData = {
  email: "admin@example.com",
  ,
  studyId: "sampleDemoStudy",
  studyRevisionId: "demoRevision1"
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
    cy.get('[data-cy=question-card-inclusionCriteria] > [data-cy=question-card] [data-cy=question-title-inclusionCriteria]').should('exist');
    cy.get('[data-cy=answer-input-field-ffAge-0-0]').should('exist');
    cy.get('[data-cy=answer-input-field-ffDyspnea-0-1]').should('not.exist');
    cy.get('[data-cy=answer-input-field-ffSignedInformedConsent-0-2] > .ant-select').should('not.exist');
    cy.get('[data-cy=question-card-inclusionCriteria] [data-cy=floating-label]').should('have.text', 'Age over 18 years');
  });
  it('Should show second field When the first field have value "YES"', () => {
    cy.get('[data-cy=question-card-inclusionCriteria] > [data-cy=question-card] [data-cy=question-title-inclusionCriteria]').should('exist');
    cy.get('[data-cy=answer-input-field-ffAge-0-0]')
      .should('exist')
      .click()
      .type('{enter}');
    cy.get('[data-cy=answer-input-field-ffDyspnea-0-1]')
      .should('exist');
    cy.get('[data-cy=answer-input-field-ffSignedInformedConsent-0-2]')
      .should('not.exist');
    cy.get('[data-cy=save-button-inclusionCriteria]').should('be.disabled');
  });
  it('Should show third (3rd) field when second (2nd) field have value "YES"', () => {
    cy.get('[data-cy=answer-input-field-ffAge-0-0]')
      .should('exist')
      .click();
    cy.get('[data-cy=answer-input-field-ffDyspnea-0-1]')
      .should('exist')
      .click()
      .type('{enter}');
    cy.get('[data-cy=save-button-inclusionCriteria]').should('be.disabled');
    cy.get('[data-cy=answer-input-field-ffSignedInformedConsent-0-2]')
      .should('exist')
      .click()
      .type('{enter}');
  });

  it('Should enable save button when EVERY field rendered / showed is NOT EMPTY', () => {
    cy.get('[data-cy=save-button-inclusionCriteria]').should('be.enabled').click();
    cy.wait(2000);
  });

  it('Should render two new questions', () => {
    cy.wait(4000);
    cy.get('[data-cy=UNFILLED]').click();
    cy.get('[data-cy=question-card-inclusionCriteriaYesSignedInformedConsentFFG]').should('exist');
    cy.get('[data-cy=question-card-exclusionCriteria]').should('exist');
  });

});