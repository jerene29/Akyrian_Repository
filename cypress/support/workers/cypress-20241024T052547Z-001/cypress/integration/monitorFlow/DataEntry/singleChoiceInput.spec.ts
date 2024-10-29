import { IFieldGroupVisitDetail } from '../../../../src/graphQL/generated/graphql';

describe('Single Choice Input', () => {
  const questionId = 'vaccine1';
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
    cy.visit('/visit/testRevisionId1/toDaiHospital1/toDaiPatient1/visit1Visit2');
    cy.wait(`@${aliasVisitDetails}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        visitDetailsSource = result.response.body.data.visitDetails.withSourceForm.fieldGroups;
      }
    });
    cy.get('[data-cy=sourceQuestionTab]').click();
  });

  it('Select MARK_UP_ACCEPTED Status', () => {
    cy.get('[data-cy=MARK_UP_ACCEPTED]').click();
  });

  it('Select question that have single choice input', () => {
    cy.clickQuickAction(`[data-cy=question-card-vaccine1]`, `[data-cy=data-entry-action-vaccine1]`);
  });

  it('Submit button is disabled if input is not selected yet', () => {
    cy.get('.slick-active [data-cy=submit-data-entry]').should('be.disabled');
  });

  it('Select Single Choice Anser', () => {
    cy.get('.slick-active [data-cy=answer-input-field-vacName1-0-0]')
      .click()
      .type('{downarrow}${enter}');
  });

  it('Change Select Single Choice Selected Anser', () => {
    cy.get('.slick-active [data-cy=answer-input-field-vacName1-0-0]')
      .click()
      .type('{downarrow}${downarrow}${enter}');
    cy.get('.slick-active [data-cy=monitor-flow-body]').click();
  });

  it('Check and click if there is a OCR Suggestion', () => {
    const data = visitDetailsSource?.filter((data: any) => data.id === 'vaccine1');
    if (data[0].formFieldGroupResponse?.sourceCaptureResponses[0].detectedValue) {
      cy.get('.slick-active [data-cy=ocr-suggestion]').should('exist').click();
    }
  });

  it('Submit button should enable after select single choice answer', () => {
    cy.get('.slick-active [data-cy=submit-data-entry]').should('be.enabled');
  });

  it('Submit question', () => {
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasSubmitDataEntry) {
        req.alias = req.body.operationName;
      }
    });
    cy.get('.slick-active [data-cy=submit-data-entry]').click();
    cy.wait(`@${aliasSubmitDataEntry}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        cy.get('[data-cy=alert-success]').should('exist');
        cy.get('.slick-active [data-cy=close-data-entry').trigger('click');
        cy.get('[data-cy=FILLED_PARTIAL]').click();
        cy.get(`[data-cy=question-vaccine1`).should('exist');
      }
    });
  });
});
