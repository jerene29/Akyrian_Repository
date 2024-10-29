import { IFieldGroupVisitDetail } from '../../../../src/graphQL/generated/graphql';

describe('Compound Question', () => {
  const questionId = 'bloodPressure1';
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

  it('Select question that have multi entry answer', () => {
    cy.clickQuickAction(
      `[data-cy=question-card-${questionId}]`,
      `[data-cy=data-entry-action-${questionId}]`,
    );
  });

  it('Submit button is disabled if all the inputs are unfilled', () => {
    cy.get('.slick-active [data-cy=submit-data-entry]').should('be.disabled');
  });

  it('Fill all the inputs', () => {
    cy.waitForReact();
    cy.get('.slick-active [data-cy=answer-input-field-ffSystolic1-0-0]').first().type('11');
    cy.get('.slick-active [data-cy=answer-input-field-ffdoastolic1-0-1]').type('12');
    cy.get('.slick-active [data-cy=answer-input-field-ffBPUnit1-0-2]')
      .click()
      .type('{downarrow}${enter}');
  });

  it('Submit button should enabled if all the inputs are filled', () => {
    cy.get('.slick-active [data-cy=submit-data-entry]').should('be.enabled');
  });

  it('Should disabled button if there is invalid input value', () => {
    cy.get('.slick-active [data-cy=answer-input-field-ffSystolic1-0-0]').type('e');
    cy.get('.slick-active [data-cy=invalid-input]').should('exist');
    cy.get('.slick-active [data-cy=submit-data-entry]').should('be.disabled');
  });

  it('Should disabled button if there is unfilled input value', () => {
    cy.get('.slick-active [data-cy=answer-input-field-ffSystolic1-0-0]').clear();
    cy.get('.slick-active [data-cy=submit-data-entry]').should('be.disabled');
    cy.get('.slick-active [data-cy=answer-input-field-ffSystolic1-0-0]').type('22');
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
        cy.get('.slick-active [data-cy=close-data-entry]').click();
        cy.wait(5000);
        cy.get('[data-cy=FILLED_PARTIAL]').click();
        cy.get(`[data-cy=question-${questionId}`).should('exist');
      }
    });
  });
});
