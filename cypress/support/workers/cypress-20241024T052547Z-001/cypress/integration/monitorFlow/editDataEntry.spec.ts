import { IFieldGroupVisitDetail } from '../../../src/graphQL/generated/graphql';
import { mockUserDataAdmin } from '../../../src/constant/testFixtures';

describe('Edit Data Entry', () => {
  let visitDetailsSource: IFieldGroupVisitDetail[] = [];
  const aliasVisitDetails = 'GetVisitDetails';
  const aliasSubmitDataEntry = 'updateWithSourceResponses';

  const questionAnswer = 'Super good condition';
  const editValue = 'I edit this';

  before(() => {
    cy.beforeSetup(mockUserDataAdmin);
    cy.visit('/');
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
    cy.get('[data-cy=sidebar-toggle-arrow]').click();
    cy.get('[data-cy=sourceQuestionTab]').click();
  });

  it('Answer Data Entry', () => {
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasSubmitDataEntry) {
        req.alias = req.body.operationName;
      }
    });
    cy.get('[data-cy=MARK_UP_ACCEPTED]').click().trigger('mouseout');
    cy.clickQuickAction(
      `[data-cy=question-card-abdomen1]`,
      `[data-cy=data-entry-action-abdomen1] svg`,
    );
    cy.get('.slick-active [data-cy=answer-input-field-ffAbdomenCon1-0-0]').type(questionAnswer, {
      delay: 10,
    });
    cy.get('.slick-active [data-cy=submit-data-entry]').click();
    cy.wait(`@${aliasSubmitDataEntry}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        cy.wait(2000);
        cy.get('.slick-active [data-cy=close-data-entry]').click();
        cy.get('[data-cy=alert-success]').should('exist');
      }
    });
  });

  it('Select FILLED Status', () => {
    cy.get('[data-cy=FILLED]').click().trigger('mouseout');
  });

  it("Hide edit data entry quick action for user admin because he's not answer the question heart", () => {
    cy.get(`[data-cy=question-muscle1]`).click().realHover();
    cy.get(`[data-cy=edit-data-entry-action-muscle1] svg`).should('not.exist');
  });

  it('Open edit data entry modal', () => {
    cy.clickQuickAction(
      `[data-cy=question-card-abdomen1]`,
      `[data-cy=edit-data-entry-action-abdomen1] svg`,
    );
  });

  it('Edit previous answer', () => {
    cy.get('[data-cy=answer-input-field-ffAbdomenCon1-0-0]')
      .first()
      .click()
      .clear()
      .type(editValue);
  });

  it('Select edit reason', () => {
    cy.get('.slick-active [data-cy=edit-reason-select-with-source-abdomen1]')
      .click()
      .type('{enter}');
  });

  it('Clicking submit button', () => {
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasSubmitDataEntry) {
        req.alias = req.body.operationName;
      }
    });
    cy.get('.slick-active [data-cy=submit-data-entry]').click();
    cy.wait(`@${aliasSubmitDataEntry}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        cy.get('[data-cy=alert-success]').should('exist');
      }
    });
  });

  it('Edited question asnwer should change according to edited value', () => {
    // Need this because on sorry cypress the test is slower and could fail because the state not updated yet while on local we don't even need to wait because the changes is less than 1 sec
    cy.wait(4000);
    cy.get(`[data-cy=view-action-abdomen1] svg`).should('exist').click({ force: true });
    cy.get('.slick-active [data-cy=question-answer-free-text]').should('have.text', editValue);
  });
});
