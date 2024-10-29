import moment from 'moment';

import { IVisitDetails } from '../../../../src/graphQL/generated/graphql';

describe.skip('Compound Question', () => {
  let visitDetails: IVisitDetails;

  const aliasVisitDetails = 'GetVisitDetails';
  const aliasSubmitDataEntry = 'updateWithSourceResponses';
  const aliasSubmitNoSource = 'updateNoSourceResponses';

  const assertForm = (multiInputQuestion, fieldOrder: number) => {
    multiInputQuestion?.fields.forEach((field, index) => {
      const prevVal =
        multiInputQuestion?.formFieldGroupResponse?.previousVisitResponse?.responses.find(
          (val) => val.formFieldId === field.id,
        );
      const fieldIndetifier = `${field.id}-${prevVal?.entryNumber}-${index}`;
      if (field?.id === prevVal?.formFieldId) {
        if (field.type === 'FREE_TEXT' || field.type === 'NUMERIC') {
          cy.get(`[data-cy=answer-input-field-${fieldIndetifier}]`).should(
            'have.value',
            prevVal.response,
          );
        } else if (field.type === 'DATE') {
          cy.get(
            `[data-cy=select-year-answer-input-field-${field.id}-0-${fieldOrder}] > .ant-select-selector > .ant-select-selection-item`,
          )
            .invoke('text')
            .should((text) => {
              // NOTE: edge case because cypress somehow get a text like "2021Year" eventhough on the logic it is either "2021" or "Year" so we check it by contains, at least for DATE type
              expect(text.toLocaleLowerCase()).to.contain(
                String(moment(prevVal.response).format('YYYY')).toLocaleLowerCase(),
              );
            });
          cy.get(
            `[data-cy=select-month-answer-input-field-${field.id}-0-${fieldOrder}] > .ant-select-selector > .ant-select-selection-item`,
          )
            .invoke('text')
            .should((text) => {
              // NOTE: edge case because cypress somehow get a text like "AprilMonth" eventhough on the logic it is either "April" or "Month" so we check it by contains, at least for DATE type
              expect(text.toLocaleLowerCase()).to.contain(
                String(moment(prevVal.response).format('MMMM')).toLocaleLowerCase(),
              );
            });
          cy.get(
            `[data-cy=select-date-answer-input-field-${field.id}-0-${fieldOrder}] > .ant-select-selector > .ant-select-selection-item`,
          )
            .invoke('text')
            .should((text) => {
              // NOTE: edge case because cypress somehow get a text like "2DD" eventhough on the logic it is either "2" or "DD" so we check it by contains, at least for DATE type
              expect(text.toLocaleLowerCase()).to.contain(
                String(moment(prevVal.response).format('D')).toLocaleLowerCase(),
              );
            });
        } else if (field.type === 'TIME') {
          cy.get(`[data-cy=answer-input-field-${fieldIndetifier}-input]`).should(
            'have.value',
            prevVal.response,
          );
        } else if (field.type === 'SINGLE_CHOICE' && prevVal.formFieldChoices.length) {
          cy.get(
            `[data-cy=answer-input-field-${fieldIndetifier}] > .ant-select > .ant-select-selector > .ant-select-selection-item`,
          ).should('have.text', prevVal.formFieldChoices[0].value);
        } else if (field.type === 'MULTIPLE_CHOICE' && prevVal.formFieldChoices.length) {
          prevVal.formFieldChoices.forEach((val) => {
            cy.get(`[data-cy=${val.id}`).should('have.text', val.value);
          });
        }
      }
    });
  };

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
    cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit3Visit1');
    cy.wait(`@${aliasVisitDetails}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        visitDetails = result.response.body.data.visitDetails;
      }
    });
  });

  beforeEach(() => {
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasSubmitDataEntry) {
        req.alias = req.body.operationName;
      }
    });
  });
  it('Use Prev Value on Multiple Input on No Source', () => {
    const multiInputQuestion = visitDetails.noSourceForm.fieldGroups.find(
      (question) => question.id === 'multiField1',
    );
    cy.wait(2000);
    cy.get('[data-cy=prev-val-field-freeText1-0-0]')
      .click()
      .then((_) => {
        assertForm(multiInputQuestion, 2);
      });
    cy.get('[data-cy=cancel-button-multiField1]').click();
  });

  it('Use Prev Value on Multi Entry Question on No Source', () => {
    const multiInputQuestion = visitDetails.noSourceForm.fieldGroups.find(
      (question) => question.id === 'multiEntryMultiField1',
    );
    cy.get('[data-cy=prev-val-field-freeText3-0-0]')
      .click()
      .then((_) => {
        assertForm(multiInputQuestion, 1);
      });
    cy.get('[data-cy=cancel-button-multiEntryMultiField1]').click();
  });

  it('Submit question on Visit 1, that question on Visit 3 should have previous value', () => {
    const multiInputQuestion = visitDetails.noSourceForm.fieldGroups.find(
      (question) => question.id === 'bodySys1',
    );
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasSubmitNoSource) {
        req.alias = req.body.operationName;
      }
    });
    cy.get('[data-cy=prev-val-field-ffEyes1-0-0]').should('not.exist');
    cy.get('[data-cy=sidebar-toggle-arrow]').click();
    cy.get('[data-cy=visit-visit1Visit1]').click();
    cy.wait(2000);
    cy.get('[data-cy=answer-input-field-ffEyes1-0-0]').click().type('{downarrow}{enter}');
    cy.get('[data-cy=save-button-bodySys1]').click();
    cy.wait(5000);
    cy.wait(`@${aliasSubmitNoSource}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        cy.get('[data-cy=visit-visit3Visit1]').click();
        cy.wait(5000);
        cy.get('[data-cy=prev-val-field-ffEyes1-0-0]').should('exist').click();
        assertForm(multiInputQuestion, 1);
        cy.get('[data-cy=cancel-button-bodySys1]').click();
      }
    });
  });

  it('Use Prev Value on Multiple Input on Source Capture', () => {
    const multiInputQuestion = visitDetails.withSourceForm.fieldGroups.find(
      (question) => question.id === 'multiFieldSC1',
    );
    cy.wait(2000);
    cy.get('[data-cy=sourceQuestionTab]').click();
    cy.get('[data-cy=MARK_UP_ACCEPTED]').click();
    cy.wait(3000);
    cy.clickQuickAction(
      '[data-cy=question-card-multiFieldSC1]',
      '[data-cy=data-entry-action-multiFieldSC1]', 
      undefined, 
      undefined, 
      'PARENT_RELATION',
    );
    cy.get('[data-cy=data-entry-action-multiFieldSC1]').should('be.visible');
    cy.get('.slick-active [data-cy=prev-val-field-freeText4-0-0]')
      .click()
      .then((_) => {
        assertForm(multiInputQuestion, 2);
      });
    cy.get('.slick-active [data-cy=submit-data-entry]').first().click();
    cy.wait(`@${aliasSubmitDataEntry}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        cy.get('[data-cy=alert-success]').should('exist');
        cy.get('.slick-active [data-cy=close-data-entry]').first().trigger('click');
      }
    });
  });

  it('Use Prev Value on Multi Entry Question on Source Capture', () => {
    const questionId = 'multiEntrySC1';
    const multiInputQuestion = visitDetails.withSourceForm.fieldGroups.find(
      (question) => question.id === questionId,
    );
    cy.wait(2000);
    cy.clickQuickAction(
      `[data-cy=question-card-${questionId}]`,
      `[data-cy=data-entry-action-${questionId}]`,
    );
    cy.get('.slick-active [data-cy=prev-val-field-freeText5-0-0]').click();
    assertForm(multiInputQuestion, 2);

    cy.get(`.slick-active [data-cy=trash-button-multiEntrySC1-0]`).click();
    cy.get(`.slick-active [data-cy=trash-button-multiEntrySC1-1]`).click();
    cy.get(`.slick-active [data-cy=add-answer-${questionId}]`).click();
    cy.get('.slick-active [data-cy=answer-input-field-freeText5-1-0]').type('New Value');
    cy.get('.slick-active [data-cy=submit-data-entry]').click();
    cy.wait(`@${aliasSubmitDataEntry}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        cy.get('.slick-active [data-cy=close-data-entry]').click();
        cy.get('[data-cy=alert-success]').should('exist');
      }
    });
  });
});
