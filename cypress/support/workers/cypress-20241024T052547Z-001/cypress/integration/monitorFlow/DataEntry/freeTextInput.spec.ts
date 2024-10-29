import { MARKED_AS_NO_ANSWER } from '../../../../src/screens/Visit/constants';
import { IFieldGroupVisitDetail } from '../../../../src/graphQL/generated/graphql';

describe('Free Text Input', () => {
  const questionId = 'abdomen1';
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

  it('Select question that have free text input', () => {
    cy.clickQuickAction(
      `[data-cy=question-card-${questionId}]`,
      `[data-cy=data-entry-action-${questionId}]`,
    );
  });

  it('Submit button still disabled when free text input is empty', () => {
    cy.get('.slick-active [data-cy=submit-data-entry]').should('be.disabled');
  });

  it('Focus and type on free text input', () => {
    cy.get('.slick-active [data-cy=answer-input-field-ffAbdomenCon1-0-0]')
      .first()
      .type('Hello World');
  });

  it('Focus on free text input and click mark as no answer', () => {
    cy.get('.slick-active [data-cy=answer-input-field-ffAbdomenCon1-0-0-mark-no-answer]')
      .first()
      .click();
    cy.get('.slick-active #field-ffAbdomenCon1-0').should('have.value', MARKED_AS_NO_ANSWER);
  });

  it('Focus and type on free text input', () => {
    cy.get('.slick-active [data-cy=answer-input-field-ffAbdomenCon1-0-0]')
      .first()
      .clear()
      .type('Hello World Again');
  });

  it('Check and click if there is a OCR Suggestion', () => {
    const data = visitDetailsSource?.filter((data: any) => data.id === questionId);
    const detectedValue = data[0].formFieldGroupResponse?.sourceCaptureResponses[0]?.detectedValue;
    if (detectedValue) {
      cy.get('.slick-active [data-cy=ocr-suggestion]').should('exist').first().click();
      cy.get('.slick-active #field-ffAbdomenCon1-0').should('have.value', detectedValue);
    }
  });

  it('Submit button should enabled when free text input have value', () => {
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
        cy.get('.slick-active [data-cy=close-data-entry').first().click({ force: true });
        cy.wait(5000);
        cy.get('[data-cy=FILLED]').click();
        cy.get(`[data-cy=question-${questionId}`).should('exist');
      }
    });
  });
});
