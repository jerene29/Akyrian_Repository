import {
  IFieldGroupVisitDetailFragment,
  RevertNoAnswerDocument,
  DetachScDocument,
} from '../../src/graphQL/generated/graphql';
import 'cypress-localstorage-commands';

describe('Rejected state should not required reason when doing action', () => {
  let visitDetailsSource: IFieldGroupVisitDetailFragment[];
  const aliasVisitDetails = 'GetVisitDetails';

  const aliastRevertQuestion = RevertNoAnswerDocument.definitions[0].name.value;
  const aliastDetachSc = DetachScDocument.definitions[0].name.value;

  before(() => {
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
        visitDetailsSource = result.response.body.data.visitDetails.noSourceForm.fieldGroups;
      }
    });
    cy.get('[data-cy=sourceQuestionTab]').click();
  });

  beforeEach(() => {
    cy.restoreLocalStorageCache();
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  it('Select Rejected Status', () => {
    cy.waitForReact();
    cy.get('[data-cy=NOT_AVAILABLE_REJECTED]').click();
  });

  it('Open revert answer and it should not required reason', () => {
    const questionId = 'smell1';
    cy.wrap(questionId).then(() => {
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliastRevertQuestion) {
          req.alias = req.body.operationName;
        }
      });
      cy.get(`[data-cy=revert-action-${questionId}]`).should('be.visible');
      cy.get(`[data-cy=revert-action-${questionId}]`).click({ force: true });
      cy.wait(2000);
      cy.get('[data-cy=submit-reject-reason]')
        .first()
        .should('not.be.disabled')
        .click({ force: true });
      cy.wait(`@${aliastRevertQuestion}`).then((result) => {
        if (result?.response?.statusCode === 200) {
          cy.get('[data-cy=alert-success]');
        }
      });
    });
  });

  it('Detach without asking reason', () => {
    const questionId = 'stress1';
    cy.wrap(questionId).then(() => {
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliastDetachSc) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=NOT_AVAILABLE_REJECTED]').click();
      cy.clickQuickAction(
        `[data-cy=question-card-${questionId}]`,
        `[data-cy=detach-action-${questionId}]`,
      );
      cy.get('[data-cy=attach-reattach-container]').should('not.exist');
      cy.wait(`@${aliastDetachSc}`).then((result) => {
        cy.wrap(result).then(() => {
          if (result?.response?.statusCode === 200) {
            cy.get('[data-cy=alert-success]');
          }
        });
      });
    });
  });

  it('Change attachment without asking reason and open attach modal', () => {
    cy.wait(1000);
    const questionId = 'bloodType1';
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliastDetachSc) {
        req.alias = req.body.operationName;
      }
    });
    cy.get(`[data-cy=question-card-${questionId}]`).realHover();
    cy.clickQuickAction(
      `[data-cy=question-card-${questionId}]`,
      `[data-cy=reattach-action-${questionId}]`,
    );
    cy.get('[data-cy=attach-reattach-container]').should('not.exist');
    cy.wait(`@${aliastDetachSc}`).then((result) => {
      cy.wrap(result).then(() => {
        if (result?.response?.statusCode === 200) {
          cy.wait(500);
          cy.get('[data-cy=unattached-questions-list]').should('exist');
        }
      });
    });
  });
});
