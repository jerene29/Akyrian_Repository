import {
  GetPatientListDocument,
  GetVisitListDocument,
  AcceptDataEntryFfgRsNoScDocument,
  IFormFieldGroupResponseStatus,
  IFieldGroupVisitDetailFragment,
  IFfgResponseQueryStatus,
} from '../../src/graphQL/generated/graphql';
import { userDataNoSourceReview } from '../../src/constant/testFixtures';
import 'cypress-localstorage-commands';

describe('Accept Reject No Source', () => {
  let visitDetailsSource: IFieldGroupVisitDetailFragment[];
  let resolvedQueryQuestion: IFieldGroupVisitDetailFragment[];
  let canAcceptAllQuestions: boolean;
  const aliasPatientList = GetPatientListDocument.definitions[0].name.value;
  const aliasVisitList = GetVisitListDocument.definitions[0].name.value;
  const aliasVisitDetails = 'GetVisitDetails';

  const aliasAcceptAllQuestions = AcceptDataEntryFfgRsNoScDocument.definitions[0].name.value;

  before(() => {
    cy.beforeSetup(userDataNoSourceReview);
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
    cy.visit('/visit/testRevisionId1/toDaiHospital1/toDaiPatient1/visit1Visit2');
    cy.wait(`@${aliasPatientList}`);
    cy.wait(`@${aliasVisitList}`);
    cy.get('[data-cy=noSourceQuestionTab]').click();
    cy.wait(`@${aliasVisitDetails}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        visitDetailsSource = result.response.body.data.visitDetails.noSourceForm.fieldGroups;
      }
    });
    cy.waitForReact();
  });

  beforeEach(() => {
    cy.restoreLocalStorageCache();
    resolvedQueryQuestion = visitDetailsSource.filter(
      (data) =>
        (data.responseQueryStatus === IFfgResponseQueryStatus.Resolved ||
          data.responseQueryStatus === IFfgResponseQueryStatus.None) &&
        data.formFieldGroupResponse?.status === IFormFieldGroupResponseStatus.Filled,
    );

    canAcceptAllQuestions = resolvedQueryQuestion.length > 1;
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  it('Select FILLED Status', { tags: '@smoke' }, () => {
    cy.waitForReact();
    cy.get('[data-cy=FILLED]').click();
  });

  it(
    "Don't show accept all component if accept all questions dont meet condition",
    { tags: '@smoke' },
    () => {
      if (!canAcceptAllQuestions) {
        cy.get('[data-cy=accept-all-container]').should('not.exist');
      }
    },
  );

  it("Show Accept all if there's resolved question more than 1", { tags: '@smoke' }, () => {
    if (canAcceptAllQuestions) {
      cy.get('[data-cy=accept-all-container]').should('exist');
      cy.get('[data-cy=accept-all-question-title]').should('exist');
      cy.get('[data-cy=accept-all-button]').should('exist');
      cy.get('[data-cy=accept-all-question-count]')
        .should('exist')
        .should('have.text', `(${resolvedQueryQuestion.length} Questions)`);
    } else {
      cy.get('[data-cy=accept-all-container]').should('not.exist');
    }
  });

  it('Open modal confirmation to accept all question', { tags: '@smoke' }, () => {
    if (canAcceptAllQuestions) {
      cy.get('[data-cy=accept-all-button]').should('exist').click();
      cy.get('[data-cy=accept-all-confirmation-modal]').should('exist');
      cy.get('[data-cy=confirmation-modal-img]').should('exist');
      cy.get('[data-cy=confirmation-modal-title]').should('exist');
      cy.get('[data-cy=confirmation-modal-desc]')
        .should('exist')
        .should('contain.text', `${resolvedQueryQuestion.length} answers`);
      cy.get('[data-cy=confirmModal-confirmButton]').should('exist');
      cy.get('[data-cy=confirmModal-cancelButton]').should('exist');
    }
  });

  it('Close the modal by clicking cancel', { tags: '@smoke' }, () => {
    if (canAcceptAllQuestions) {
      cy.get('[data-cy=confirmModal-cancelButton]').should('exist').click();
    }
  });

  it('Submit all question', { tags: '@smoke' }, () => {
    if (canAcceptAllQuestions) {
      cy.wait(1000);
      cy.get('[data-cy=accept-all-button]').should('exist').click();
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasAcceptAllQuestions) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=confirmModal-confirmButton]').click();
      cy.wait(`@${aliasAcceptAllQuestions}`).then((result) => {
        if (result?.response?.statusCode === 200) {
          cy.get('[data-cy=alert-success]').should('exist');
        }
      });
    }
  });
});
