import {
  GetVisitDetailSourceDocument,
  GetPatientListDocument,
  GetVisitListDocument,
  AcceptMarkUpFfgrDocument,
  RejectMarkUpFfgrDocument,
  UpdateWithSourceResponsesDocument,
} from '../../../../src/graphQL/generated/graphql';

const mockUserData = {
  email: 'birch@example.com',
};

describe('Login as verifier entry', () => {
  let visitDetailsSource: any;
  const aliasPatientList = GetPatientListDocument.definitions[0].name.value;
  const aliasVisitList = GetVisitListDocument.definitions[0].name.value;
  const aliasVisitDetails = 'GetVisitDetails';

  before(() => {
    cy.clearLocalStorageSnapshot();
    cy.reseedDB();
    cy.visit('/');
    cy.fillInloginAsFormV2(mockUserData);
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasPatientList) {
        req.alias = req.body.operationName;
      }

      if (req.body.operationName === aliasVisitList) {
        req.alias = req.body.operationName;
      }

      if (req.body.operationName === aliasVisitDetails) {
        req.alias = req.body.operationName;
      }
    });
    cy.waitForReact();
    cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit1Visit1');
    cy.wait(`@${aliasPatientList}`);
    cy.wait(`@${aliasVisitList}`);
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

  it('Shows both first and second data entry answer performed by the data entry when login as verifier user', () => {
    const questionId = 'temporalLobe1';
    const scResponse = visitDetailsSource.filter((question) => question?.id === questionId)[0]
      .formFieldGroupResponse.sourceCaptureResponses;
    const firstDataEntry = scResponse.filter((resp) => !resp.isSecondDataEntry);
    const secondDataEntry = scResponse.filter((resp) => resp.isSecondDataEntry);

    cy.get('[data-cy=REJECTED]').click();
    cy.get(`[data-cy=accept-reject-action-${questionId}] svg`).click({ force: true });
    cy.waitForReact();

    if (firstDataEntry.length && secondDataEntry.length) {
      cy.get(`[data-cy=first-data-entry-${questionId}]`).should('exist');
      cy.get(`[data-cy=second-data-entry-${questionId}]`).should('exist');
    }
    cy.get('[data-cy=modal-close]').first().click({ force: true });
  });

  it('Shows only 1 data entry if the question only have one data entry', () => {
    const questionId = 'mouth1';
    const scResponse = visitDetailsSource.filter((question) => question?.id === questionId)[0]
      .formFieldGroupResponse.sourceCaptureResponses;
    const firstDataEntry = scResponse.filter((resp) => !resp.isSecondDataEntry);
    const secondDataEntry = scResponse.filter((resp) => resp.isSecondDataEntry);

    cy.get(`[data-cy=accept-reject-action-${questionId}] svg`).click({ force: true });
    cy.waitForReact();
    if (firstDataEntry.length && !secondDataEntry.length) {
      cy.get(`[data-cy=first-data-entry-${questionId}]`).should('exist');
      cy.get(`[data-cy=second-data-entry-${questionId}]`).should('not.exist');
    }
    cy.get('[data-cy=modal-close]').first().click({ force: true });
  });
});
