import { IFieldGroupVisitDetail } from '../../../../src/graphQL/generated/graphql';

describe('Multi Entry Question', () => {
  const questionId = 'bodyTemp1';
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
  it('Select MARK_UP_ACCEPTED Status', () => {
    cy.get('[data-cy=MARK_UP_ACCEPTED]').click();
  });

  it('Select question that have multi entry answer', () => {
    cy.clickQuickAction(
      `[data-cy=question-card-${questionId}]`,
      `[data-cy=data-entry-action-${questionId}]`,
    );
  });

  it('Submit button is disabled', () => {
    cy.get('.slick-active [data-cy=submit-data-entry]').should('be.disabled');
  });

  it('Fill in the first entry', () => {
    cy.get('.slick-active [data-cy=answer-input-field-ffTemp1-0-0').type('11');
    cy.get('.slick-active [data-cy=answer-input-field-ffTempUnit1-0-1')
      .click()
      .type('{downarrow}${enter}');
  });

  it('Add second entry answer', () => {
    cy.get('.slick-active [data-cy=add-answer-bodyTemp1]').click();
  });

  it('Fill in the second entry', () => {
    cy.get('.slick-active [data-cy=answer-input-field-ffTemp1-1-0').type('22');
    cy.get('.slick-active [data-cy=answer-input-field-ffTempUnit1-1-1')
      .click()
      .type('{downarrow}${enter}');
  });

  it('Add third entry answer', () => {
    cy.get('.slick-active [data-cy=add-answer-bodyTemp1]').click();
  });

  it('Fill in the third entry', () => {
    cy.get('.slick-active [data-cy=answer-input-field-ffTemp1-2-0').type('33');
    cy.get('.slick-active [data-cy=answer-input-field-ffTempUnit1-2-1')
      .click()
      .type('{downarrow}${enter}');
  });

  it('Should have 3 row of answer', () => {
    // why there is 4 childrens, because the last children was the add answer button container
    // we only want to check the input children
    cy.get('.slick-active [data-cy=question-input-container]').children().should('have.length', 5);
  });

  it('Delete first entry answer', () => {
    cy.get('.slick-active [data-cy=trash-button-bodyTemp1-0]').click();
  });

  it('Should have 2 row of answer', () => {
    // there is 4 childrens, because the last children was the add answer button container
    // we only want to check the input children
    cy.get('.slick-active [data-cy=question-input-container]').children().should('have.length', 4);
  });

  it('Add another data entry', () => {
    cy.get('.slick-active [data-cy=add-answer-bodyTemp1]').click();
    cy.get('.slick-active [data-cy=answer-input-field-ffTemp1-2-0').type('44');
    cy.get('.slick-active [data-cy=answer-input-field-ffTempUnit1-2-1').click().type('{enter}');
  });

  it('delete entry row number 2', () => {
    cy.get('.slick-active [data-cy=trash-button-bodyTemp1-1]').click();
  });

  it('Submit button should enabled if all input is filled', () => {
    cy.get('.slick-active [data-cy=submit-data-entry]').should('be.enabled');
  });

  it('Disabled button if there are input field that have no value', () => {
    cy.get('.slick-active [data-cy=answer-input-field-ffTemp1-1-0').clear();
    cy.get('.slick-active [data-cy=submit-data-entry]').should('be.disabled');
  });

  it('Enabled button again all the input field have values', () => {
    cy.get('.slick-active [data-cy=answer-input-field-ffTemp1-1-0').type('34');
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
        cy.get('.slick-active [data-cy=close-data-entry').click();
        cy.wait(5000);
        cy.get('[data-cy=FILLED]').click();
        cy.get(`[data-cy=question-${questionId}`).should('exist');
      }
    });
  });
});
