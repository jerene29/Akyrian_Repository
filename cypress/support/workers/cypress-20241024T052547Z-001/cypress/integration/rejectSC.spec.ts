import {
  GetVisitDetailsDocument,
  IFieldGroupVisitDetail,
  RejectMarkUpFfgrDocument,
} from '../../src/graphQL/generated/graphql';
import { userDataSnippetAssassment } from '../../src/constant/testFixtures';
import 'cypress-localstorage-commands';

describe('Reject Source Capture', () => {
  let previouslyClearedFG: IFieldGroupVisitDetail = {} as IFieldGroupVisitDetail;
  let markedUpFFG: IFieldGroupVisitDetail[] = [];

  const aliasGetVisitDetailSC = GetVisitDetailsDocument.definitions[0].name.value;
  const aliasRejectSC = RejectMarkUpFfgrDocument.definitions[0].name.value;

  before(() => {
    cy.beforeSetup(userDataSnippetAssassment);
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasGetVisitDetailSC) {
        req.alias = req.body.operationName;
      }
    });
    cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit1Visit1');
    cy.waitForReact();
    cy.wait(`@${aliasGetVisitDetailSC}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        cy.get('[data-cy=sourceQuestionTab]').click();
        markedUpFFG = result.response.body.data.visitDetails.withSourceForm.fieldGroups?.filter(
          (FG: IFieldGroupVisitDetail) => FG.formFieldGroupResponse?.status === 'MARKED_UP',
        );
      }
    });
    cy.waitForReact();
  });

  describe('Reject SC', () => {
    it('Go to Pending Review state, and click review quick action and Accept Reject SC Snippet modal should show ', () => {
      cy.get('[data-cy=MARKED_UP').click();
      previouslyClearedFG = markedUpFFG[0];
      cy.clickQuickAction(
        `[data-cy=question-card-${previouslyClearedFG.id}]`,
        `[data-cy=review-sc-snippet-action-${previouslyClearedFG.id}]`,
        undefined,
        undefined,
        'PARENT_RELATION',
      );
      if (cy.get('.ant-tooltip')) {
        cy.get('.ant-tooltip').invoke('attr', 'style', 'display: none');
      }
      cy.get('canvas', { timeout: 20000 }).should('be.visible');
    });

    it('click reject sc on top of image should show reject sc modal then click cancel should close modal reason reject sc and still show SC canvas', () => {
      cy.get('[data-cy=overlapping-button-reject-sc]').click();
      cy.get('[data-cy=close-reject-sc]').should('be.visible').click();
      cy.get('canvas', { timeout: 20000 }).should('be.visible');
    });

    it('Click reject sc again, select reason and submit, api call success should move the card from Pending Mark-Up Acceptance state', () => {
      cy.get('[data-cy=overlapping-button-reject-sc]').click();
      cy.get('[data-cy=submit-reject-sc]').should('be.visible');
      cy.get('[data-cy=edit-reason] > .ant-select > .ant-select-selector').click();
      cy.get('.ant-select-item-option-active > .ant-select-item-option-content').type('{enter}');
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasRejectSC) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=submit-reject-sc]').click();
      cy.wait(`@${aliasRejectSC}`).then((result) => {
        if (result?.response?.statusCode === 200) {
          cy.get('[data-cy=alert-success]').should('contain.text', 'Source Capture Rejected');
          cy.get(`[data-cy=${previouslyClearedFG.id}]`).should('not.exist');
        }
      });
    });
  });
});
