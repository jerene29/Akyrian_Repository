import { log } from 'console';
import { IFieldGroupVisitDetail } from '../../../../src/graphQL/generated/graphql';

describe('Multiple Choice Input', () => {
  const questionId = 'sideEffects1';
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

  it('Select question that have multiple choice input', () => {
    cy.clickQuickAction(
      `[data-cy=question-card-${questionId}]`,
      `[data-cy=data-entry-action-${questionId}]`,
    );
  });

  it('Submit button is disabled if input is not selected yet', () => {
    cy.get('[data-cy=submit-data-entry]').should('be.disabled');
  });

  it('Select multiple choice', () => {
    cy.get(
      '.slick-active [data-cy=textfield-container-answer-input-field-sideEffectVac1-0-0] > [data-cy=select-container]',
    )
      .first()
      .click();
    cy.get('.rc-virtual-list-holder-inner > :nth-child(1)').click();
    cy.get('.rc-virtual-list-holder-inner > :nth-child(2)').click();
  });

  it('Should have 2 choices', () => {
    cy.get('.slick-active [data-cy=headache1]').should('exist');
    cy.get('.slick-active [data-cy=stomachAche1]').should('exist');
  });

  it('Delete Choice by clicking remove icon inside choice pill', () => {
    cy.get('.slick-active [data-cy=remove-choice]').first().click();
    cy.get('.slick-active [data-cy=headache1]').should('not.exist');
  });

  it('Submit button should enabled after select minimal one answer', () => {
    cy.get('.slick-active [data-cy=submit-data-entry]').should('be.enabled');
  });

  it('Clear multiple choices answers by clicking reset icon', () => {
    cy.get('.slick-active [data-cy=multi-choice-reset-button-sideEffects1]').first().click();
    cy.get('.slick-active [data-cy=stomachAche1]').should('not.exist');
  });

  it('Submit button should disabled if selected answers is cleared', () => {
    cy.get('.slick-active [data-cy=submit-data-entry]').should('be.disabled');
  });

  it('Select multiple choice and select mark no answer, other answer should remove and only mark no answer is selected', () => {
    cy.get(
      '.slick-active [data-cy=textfield-container-answer-input-field-sideEffectVac1-0-0] > [data-cy=select-container]',
    )
      .first()
      .click();
    cy.get('.rc-virtual-list-holder-inner > :nth-child(1)').click();
    cy.get('.rc-virtual-list-holder-inner > :nth-child(2)').click();
    cy.get('.rc-virtual-list-holder-inner > :nth-child(8)').click();
    cy.get('.slick-active [data-cy=headache1]').should('not.exist');
    cy.get('.slick-active [data-cy=stomachAche1]').should('not.exist');
    cy.get('.slick-active [data-cy=modal-title]').first().click();
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
        cy.visit('/visit/testRevisionId1/toDaiHospital1/toDaiPatient1/visit1Visit2')
        cy.get('[data-cy=sourceQuestionTab]').click();
        cy.get('[data-cy=FILLED]').click();
        cy.get(`[data-cy=question-${questionId}`).should('exist');
      }
    });
  });
});
