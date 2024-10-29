import { mockUserDataAdmin } from '../../../src/constant/testFixtures';
import {
  IFieldGroupVisitDetail,
  AcceptDataEntryFfgrWithScDocument,
  RejectDataEntryFfgrsDocument,
} from '../../../src/graphQL/generated/graphql';

describe('Verifier - Accept/Reject Data Entry', () => {
  let visitDetailsSource: IFieldGroupVisitDetail[] = [];
  const aliasVisitDetails = 'GetVisitDetails';

  const aliasAcceptDataEntry = AcceptDataEntryFfgrWithScDocument.definitions[0].name.value;
  const aliasRejectDataEntry = RejectDataEntryFfgrsDocument.definitions[0].name.value;

  let filledData: any = [];

  const questionId1 = 'heart1';
  const questionId2 = 'leftLungs1';

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
    filledData = visitDetailsSource?.filter(
      (data) =>
        data.formFieldGroupResponse?.status === 'FILLED' ||
        data.formFieldGroupResponse?.status === 'FILLED_FROM_SOURCE_CAPTURE',
    );
  });

  it('Select FILLED Status', () => {
    cy.get('[data-cy=FILLED]').click();
  });

  describe('Reject Data Entry', () => {
    it('Check and Open Modal Verify Modal', () => {
      cy.clickQuickAction(
        `[data-cy=question-card-${questionId1}]`,
        `[data-cy=verify-action-${questionId1}`,
      );
    });

    it('Open Reject Reason Data Entry', () => {
      cy.get('.slick-active [data-cy=reject-data-entry').first().click();
    });

    it('Select One Of Reject Reasons', () => {
      if (filledData?.length) {
        cy.get('.slick-active [data-cy=reject-reason]').first().click().type('${enter}');
        cy.get('.slick-active [data-cy=monitor-flow-body]').first().click();
      }
    });

    it('Submit Reject Data Entry Selected Reason', () => {
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasRejectDataEntry) {
          req.alias = req.body.operationName;
        }
      });

      if (filledData?.length) {
        cy.get(`.slick-active [data-cy=submit-reject-reason]`).first().click();
        cy.wait(`@${aliasRejectDataEntry}`).then((result) => {
          if (result?.response?.statusCode === 200) {
            cy.waitForReact();
            cy.get('[data-cy=alert-success]');
          }
        });
      }
    });
  });

  describe('Accept Data Entry', () => {
    it('Check if it has concordance or not, if it has concordance select first entry', () => {
      let firstEntry = [];
      let secondEntry = [];

      if (filledData.length) {
        firstEntry = filledData[0]?.formFieldGroupResponse?.sourceCaptureResponses.filter(
          (x) => !x.isSecondDataEntry,
        );
        secondEntry = filledData[0]?.formFieldGroupResponse?.sourceCaptureResponses.filter(
          (x) => x.isSecondDataEntry,
        );
      }

      if (firstEntry.length && secondEntry.length) {
        cy.get(`.slick-active [data-cy=first-data-entry-${questionId2}]`).click();
        cy.get(`.slick-active [data-cy=second-data-entry-${questionId2}]`).first();
      }
    });

    it('Check if there is unresolved query, and if there is no unresolved query then accept the question', () => {
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasAcceptDataEntry) {
          req.alias = req.body.operationName;
        }
      });

      cy.get(`.slick-active [data-cy=accept-data-entry-${questionId2}]`).first().click();

      cy.wait(`@${aliasAcceptDataEntry}`).then((result) => {
        if (result?.response?.statusCode === 200) {
          if (filledData.length > 2) {
            cy.get('.slick-active [data-cy=modal-close]').first().click();
          }
        }
      });
    });

    it('Questions move to expected state', () => {
      cy.scrollToElement('#filtered-questions');
      cy.get('[data-cy=NOT_AVAILABLE_REJECTED]').click({ force: true });
      cy.get(`[data-cy=question-${questionId1}`).should('exist');
      cy.get('[data-cy=ACCEPTED]').click({ force: true });
      cy.get(`[data-cy=question-${questionId2}`).should('exist');
    });
  });
});
