import {
  IFieldGroupVisitDetail,
  UpdateWithSourceResponsesDocument,
} from '../../../src/graphQL/generated/graphql';
import { mockUserDataAdmin } from '../../../src/constant/testFixtures';

describe('Rejected Data Entry', () => {
  let visitDetailsSource: IFieldGroupVisitDetail[] = [];
  const aliasVisitDetails = 'GetVisitDetails';

  const aliasDataEntry = UpdateWithSourceResponsesDocument.definitions[0].name.value;
  const questionId = 'temporalLobe1';

  before(() => {
    cy.clearLocalStorageSnapshot();
    cy.reseedDB();
    cy.fillInloginAsFormV2(mockUserDataAdmin);
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasVisitDetails) {
        req.alias = req.body.operationName;
      }
    });
    cy.waitForReact();
    cy.visit('/visit/testRevisionId1/toDaiHospital1/toDaiPatient1/visit1Visit2');
    cy.get('[data-cy=sourceQuestionTab]').click();
    cy.wait(`@${aliasVisitDetails}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        visitDetailsSource = result.response.body.data.visitDetails.withSourceForm.fieldGroups;
      }
    });
  });

  beforeEach(() => {
    cy.restoreLocalStorageCache();
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  it('Select Rejected Data Entry Status', () => {
    cy.get('[data-cy=REJECTED_DATA_ENTRY]').click();
  });

  it('Open edit data entry modal', () => {
    cy.waitForReact();
    cy.clickQuickAction(
      `[data-cy=question-card-${questionId}]`,
      `[data-cy=edit-data-entry-action-${questionId}`,
    );
  });

  it('Fill the form and submit', () => {
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasDataEntry) {
        req.alias = req.body.operationName;
      }
    });
    cy.get('.slick-active [data-cy=answer-input-field-ffTemporalCon1-0-0]')
      .first()
      .type('Hello World');
    cy.waitForReact();
    cy.get('.slick-active [data-cy=submit-data-entry]').first().click();
    cy.wait(`@${aliasDataEntry}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        cy.get('[data-cy=alert-success]').should('exist');
        cy.get('.slick-active [data-cy=close-data-entry]').click({ force: true });
        cy.wait(5000);
        cy.waitForReact();
        cy.get('[data-cy=FILLED_PARTIAL]').click();
        cy.get(`[data-cy=question-${questionId}`).should('exist');
      }
    });
  });
});
