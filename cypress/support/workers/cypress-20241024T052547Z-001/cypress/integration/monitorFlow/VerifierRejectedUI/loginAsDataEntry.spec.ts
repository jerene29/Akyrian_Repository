import { IFieldGroupVisitDetail } from '../../../../src/graphQL/generated/graphql';

describe('Login as Data entry', () => {
  let visitDetailsSource: IFieldGroupVisitDetail[] = [];
  const aliasVisitDetails = 'GetVisitDetails';
  const aliasSubmitDataEntry = 'updateWithSourceResponses';

  before(() => {
    cy.clearLocalStorageSnapshot();
    cy.reseedDB();
  });

  describe('Answer as first data entry', () => {
    before(() => {
      cy.fillInloginAsFormV2({
        email: 'dataentrya@example.com',
      });
      cy.waitForReact();
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasVisitDetails) {
          req.alias = req.body.operationName;
        }
      });
      cy.visit('/visit/testRevisionId1/toDaiHospital1/toDaiPatient1/visit1Visit2');
      cy.wait(1000);
      cy.wait(`@${aliasVisitDetails}`).then((result) => {
        if (result?.response?.statusCode === 200) {
          visitDetailsSource = result.response.body.data.visitDetails.withSourceForm.fieldGroups;
        }
      });
    });

    beforeEach(() => {
      cy.restoreLocalStorageCache();

      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasSubmitDataEntry) {
          req.alias = req.body.operationName;
        }
      });
    });

    afterEach(() => {
      cy.saveLocalStorageCache();
    });

    it('Answer question', () => {
      cy.wait(1000);
      cy.get(`[data-cy=data-entry-action-height1] svg`).click({ force: true });
      cy.get('.slick-active [data-cy=answer-input-field-ffHeight1-0-0]').first().type('45');
      cy.get('.slick-active [data-cy=submit-data-entry]').first().click();
      cy.wait(`@${aliasSubmitDataEntry}`).then(() => {
        cy.get('.slick-active [data-cy=close-data-entry').click({ force: true });
        cy.logout();
        cy.wait(2000);
      });
    });
  });

  describe('Answer as second data entry', () => {
    before(() => {
      cy.fillInloginAsFormV2({
        email: 'dataentryb@example.com',
      });
      cy.waitForReact();
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasVisitDetails) {
          req.alias = req.body.operationName;
        }
      });
      cy.visit('/visit/testRevisionId1/toDaiHospital1/toDaiPatient1/visit1Visit2');
      cy.wait(1000);
      cy.wait(`@${aliasVisitDetails}`);
    });

    beforeEach(() => {
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasSubmitDataEntry) {
          req.alias = req.body.operationName;
        }
      });
    });

    it('Answer question', () => {
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasSubmitDataEntry) {
          req.alias = req.body.operationName;
        }
      });
      cy.wait(1000);
      cy.get(`[data-cy=data-entry-action-height1] svg`).click({ force: true });
      cy.get('.slick-active [data-cy=answer-input-field-ffHeight1-0-0]').first().type('55');
      cy.get('.slick-active [data-cy=submit-data-entry]').first().click();
      cy.wait(`@${aliasSubmitDataEntry}`).then(() => {
        cy.get('.slick-active [data-cy=close-data-entry').first().click();
      });
      cy.wait(2000);
    });

    it('Show answer perform by the current user', () => {
      cy.get('[data-cy=FILLED]').click();
      cy.get(`[data-cy=view-action-height1] svg`).click({ force: true });
      cy.get('.slick-active [data-cy=data-entry-answer]').first().should('exist');
      cy.get('.slick-active [data-cy=multiple-data-entry]').should('not.exist');
      cy.get('.slick-active [data-cy=modal-close]').first().click();
      cy.logout();
      cy.wait(2000);
    });
  });

  describe('Other data entry able to see both data entry answer', () => {
    before(() => {
      cy.fillInloginAsFormV2({
        email: 'rowan@example.com',
      });
      cy.waitForReact();
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasVisitDetails) {
          req.alias = req.body.operationName;
        }
      });
      cy.visit('/visit/testRevisionId1/toDaiHospital1/toDaiPatient1/visit1Visit2');
      cy.wait(1000);
      cy.wait(`@${aliasVisitDetails}`);
    });

    it('Show both answer perform by the other data entry', () => {
      cy.get('[data-cy=FILLED]').click();
      cy.get(`[data-cy=view-action-height1] svg`).click({ force: true });
      cy.get('.slick-active [data-cy=data-entry-answer]').should('not.exist');
      cy.get('.slick-active [data-cy=multiple-data-entry]').first().should('exist');
    });
  });
});
