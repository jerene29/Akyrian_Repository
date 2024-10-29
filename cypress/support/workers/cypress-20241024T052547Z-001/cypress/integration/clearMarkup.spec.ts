import {
  GetVisitDetailsDocument,
  IFieldGroupVisitDetail,
  IWithSourceForm,
  UpdateFfgrMarkupDocument,
  IFfgrStatusEnum,
} from '../../src/graphQL/generated/graphql';

import 'cypress-localstorage-commands';

describe('Clear Snippet', () => {
  let visitDetails: IWithSourceForm = {} as IWithSourceForm;
  let previouslyClearedFG: IFieldGroupVisitDetail = {} as IFieldGroupVisitDetail;

  let markupRejectedFG: IFieldGroupVisitDetail[] = [];

  const aliasGetVisitDetailSC = GetVisitDetailsDocument.definitions[0].name.value;
  const alisUpdateFfgrMarkup = UpdateFfgrMarkupDocument.definitions[0].name.value;
  before(() => {
    cy.clearLocalStorageSnapshot();
    cy.reseedDB();
    cy.fillInloginAsFormV2({
      email: 'admin@example.com',
    });
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasGetVisitDetailSC) {
        req.alias = req.body.operationName;
      }
    });
    cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit1Visit1');
    cy.wait(`@${aliasGetVisitDetailSC}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        cy.get('[data-cy=sourceQuestionTab').click();
        visitDetails = result.response.body.data.visitDetails.withSourceForm;
        markupRejectedFG = visitDetails.fieldGroups?.filter(
          (FG: IFieldGroupVisitDetail) => FG.formFieldGroupResponse?.status === 'MARK_UP_REJECTED',
        );
      }
    });
    cy.waitForReact();
  });

  describe('Clear Snippet as Admin', () => {
    it('Go to rejected snippet state, and click clear snippet quick action', () => {
      cy.get('[data-cy=NOT_AVAILABLE_REJECTED').click();
      previouslyClearedFG = markupRejectedFG[0];
      cy.get(`[data-cy=question-card-${previouslyClearedFG.id}]`).should('be.visible');
      cy.clickQuickAction(
        `[data-cy=question-card-${previouslyClearedFG.id}]`,
        `[data-cy=clear-snippet-action-${previouslyClearedFG.id}]`,
        undefined,
        undefined,
        'SVG',
      );
      if (cy.get('.ant-tooltip')) {
        cy.get('.ant-tooltip').invoke('attr', 'style', 'display: none');
      }
    });

    it('Confirmation modal should show', () => {
      cy.get('[data-cy=clear-snippet-confirmation-modal]').should('be.visible');
      cy.get('[data-cy=confirmModal-confirmButton]');
    });

    it('Click confirm button, api call success should move the card from rejected snippet state', () => {
      cy.get('[data-cy=clear-snippet-confirmation-modal]').should('be.visible');
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === alisUpdateFfgrMarkup) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=confirmModal-confirmButton]').click();
      cy.wait(`@${alisUpdateFfgrMarkup}`).then((result) => {
        if (result?.response?.statusCode === 200) {
          cy.get(`[data-cy=${previouslyClearedFG.id}]`).should('not.exist');
        }
      });
    });
  });

  describe('Mark-up Cleared State', () => {
    before(() => {
      cy.clearLocalStorageSnapshot();
      cy.visit('/login');
      cy.fillInloginAsFormV2({
        email: 'elm@example.com',
      });
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasGetVisitDetailSC) {
          req.alias = req.body.operationName;
        }
      });
      cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit1Visit1');
      cy.waitForReact();
      cy.wait(`@${aliasGetVisitDetailSC}`).then((result) => {
        if (result?.response?.statusCode === 200) {
          cy.get('[data-cy=sourceQuestionTab').click();
          visitDetails = result.response.body.data.visitDetails.withSourceForm;
          markupRejectedFG = visitDetails.fieldGroups?.filter(
            (FG: IFieldGroupVisitDetail) =>
              FG.formFieldGroupResponse?.status === 'MARK_UP_REJECTED',
          );
        }
      });
      cy.waitForReact();
    });

    it('Login with user elm, go to SOURCE_CAPTURE_REJECTED (Mark-up Cleared) state and check if the previously cleared mark up is there and check if the rejected reason exist', () => {
      const rcRejectedState = visitDetails.userVisitData.filter((visitData) =>
        visitData.status.includes(IFfgrStatusEnum.SourceCaptureRejected),
      );
      const key = `${rcRejectedState[0].label}`.split(' ').join('');
      if (rcRejectedState[0]) {
        cy.get(`.${key}`).click();
        cy.get(`[data-cy=question-card-${previouslyClearedFG.id}]`).should('be.visible');
        cy.get('[data-cy=Rejected-status]').should('exist');
      }
    });
  });
});
