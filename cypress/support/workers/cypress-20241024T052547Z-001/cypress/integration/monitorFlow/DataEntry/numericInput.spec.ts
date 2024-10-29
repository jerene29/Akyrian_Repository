import { MARKED_AS_NO_ANSWER } from '../../../../src/screens/Visit/constants';
import { IFieldGroupVisitDetail } from '../../../../src/graphQL/generated/graphql';

describe('Numeric Input', () => {
  const questionId = 'height1';
  let visitDetailsSource: IFieldGroupVisitDetail[] = [];

  const aliasVisitDetails = 'GetVisitDetails';
  const aliasSubmitDataEntry = 'updateWithSourceResponses';

  before(() => {
    cy.clearLocalStorageSnapshot();
    cy.reseedDB();
    cy.fillInloginAsFormV2({
      email: 'admin@example.com',
    });
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasVisitDetails) {
        req.alias = req.body.operationName;
      }
    });
    cy.waitForReact();
    cy.visit('/visit/testRevisionId1/toDaiHospital1/toDaiPatient1/visit1Visit2');
    cy.wait(`@${aliasVisitDetails}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        visitDetailsSource = result.response.body.data.visitDetails.withSourceForm.fieldGroups;
      }
    });
    cy.get('[data-cy=sourceQuestionTab]').click();
  });

  beforeEach(() => {
    cy.restoreLocalStorageCache();
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false;
    });
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  it('Select MARK_UP_ACCEPTED Status', () => {
    cy.get('[data-cy=MARK_UP_ACCEPTED]').click();
  });

  it('Select question that have numeric input', () => {
    cy.clickQuickAction(
      `[data-cy=question-card-${questionId}]`,
      `[data-cy=data-entry-action-${questionId}]`,
      'bottom',
    );
  });

  it('Submit button still disabled when numeric input is empty', () => {
    cy.get('.slick-active [data-cy=submit-data-entry]').should('be.disabled');
  });

  it('Shows invalid message when type character beside number on numeric input', () => {
    cy.get('.slick-active [data-cy=answer-input-field-ffHeight1-0-0]').first().type('hai');
    cy.get('.slick-active [data-cy=invalid-input]').should('exist');
  });

  it('Submit button is still disabled when input is invalid', () => {
    cy.get('.slick-active [data-cy=submit-data-entry]').should('be.disabled');
  });

  it('Click mark as no answer and error message should not exist', () => {
    cy.get('.slick-active [data-cy=ocr-suggestion]').click();
    cy.get('.slick-active [data-cy=answer-input-field-ffHeight1-0-0]').first().click();
    cy.get('.slick-active [data-cy=answer-input-field-ffHeight1-0-0-mark-no-answer]')
      .first()
      .click();
    cy.get('.slick-active [data-cy=answer-input-field-ffHeight1-0-0]')
      .first()
      .should('have.value', MARKED_AS_NO_ANSWER);
    cy.get('.slick-active [data-cy=invalid-input]').should('not.exist');
  });

  it('Submit button should enabled when numeric input value is Mark As no Answer', () => {
    cy.get('.slick-active [data-cy=submit-data-entry]').should('be.enabled');
  });

  it('Type correct value on numeric input', () => {
    cy.get('.slick-active [data-cy=answer-input-field-ffHeight1-0-0]').first().clear().type('45');
  });

  it('Check and click if there is a OCR Suggestion', () => {
    const data = visitDetailsSource?.filter((data: any) => data.id === questionId);
    if (data.length && data[0].formFieldGroupResponse?.sourceCaptureResponses[0].detectedValue) {
      cy.get('.slick-active [data-cy=ocr-suggestion]').first().click();
      cy.get('.slick-active [data-cy=answer-input-field-ffHeight1-0-0]')
        .first()
        .should(
          'have.value',
          data[0].formFieldGroupResponse?.sourceCaptureResponses[0].detectedValue,
        );
    }
  });

  it('Submit button should enabled when input value is numeric', () => {
    cy.get('.slick-active [data-cy=submit-data-entry]').should('be.enabled');
  });

  it('Submit question', () => {
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasSubmitDataEntry) {
        req.alias = req.body.operationName;
      }
    });
    cy.get('.slick-active [data-cy=submit-data-entry]').first().click();
    cy.wait(`@${aliasSubmitDataEntry}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        cy.get('[data-cy=alert-success]').should('exist');
        cy.get('.slick-active [data-cy=close-data-entry]').click({ force: true });
        cy.wait(5000);
        cy.get('[data-cy=FILLED_PARTIAL]').click();
        cy.get(`[data-cy=question-${questionId}`).should('exist');
      }
    });
  });
});
