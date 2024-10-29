import { IFieldGroupVisitDetail } from '../../../../src/graphQL/generated/graphql';

describe('Date Input', () => {
  const questionId = 'datesVaccinate1';
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

  it('Select question that have date answer', () => {
    cy.clickQuickAction(
      `[data-cy=question-card-${questionId}]`,
      `[data-cy=data-entry-action-${questionId}]`,
    );
  });

  it('Submit button is disabled before select date', () => {
    cy.get('.slick-active [data-cy=submit-data-entry]').should('be.disabled');
  });

  it('Check and click if there is a OCR Suggestion', () => {
    const data = visitDetailsSource?.filter((data: any) => data.id === questionId);
    if (data[0].formFieldGroupResponse?.sourceCaptureResponses[0].detectedValue) {
      cy.get('.slick-active [data-cy=ocr-suggestion]').first().click();
    }
  });

  it.skip('Add mark as no answer on second entry', () => {
    cy.get('.slick-active [data-cy=add-answer-datesVaccinate1]').first().click();
    // dob input
    cy.multiSelect({ field: `year-answer-input-field-vaccinateDates1-1-0` });
    cy.multiSelect({ field: `month-answer-input-field-vaccinateDates1-1-0` });
    cy.multiSelect({ field: `date-answer-input-field-vaccinateDates1-1-0` });

    // check this mark as no answer on dateDropdown, still failing
    cy.get('[data-cy=question-date-dropdown-mark-no-answer-1]').first().click();
    cy.get('[data-cy=container-date-dropdown-no-answer-1]').should('exist');
  });

  it.skip('Submit question', () => {
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasSubmitDataEntry) {
        req.alias = req.body.operationName;
      }
    });
    cy.get('.slick-active [data-cy=submit-data-entry]').first().click();
    cy.wait(`@${aliasSubmitDataEntry}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        cy.get('[data-cy=alert-success]').should('exist');
        cy.get('.slick-active [data-cy=close-data-entry').first().click();
        cy.wait(3000);
        cy.get('[data-cy=FILLED_PARTIAL]').click();
        cy.get(`[data-cy=question-${questionId}`).should('exist');
      }
    });
  });
});
