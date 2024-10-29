import {
  AcceptMarkUpFfgrDocument,
  RejectMarkUpFfgrDocument,
  IFieldGroupVisitDetail,
} from '../../../src/graphQL/generated/graphql';

describe('Accept Reject Verifier Rejected', () => {
  let visitDetailsSource: IFieldGroupVisitDetail[] = [];
  const aliasVisitDetails = 'GetVisitDetails';
  const aliasAcceptMarkUp = AcceptMarkUpFfgrDocument.definitions[0] as any;
  const aliasRejectMarkUp = RejectMarkUpFfgrDocument.definitions[0] as any;

  const aliasing = {
    aliasAcceptMarkUp: aliasAcceptMarkUp.name.value,
    aliasRejectMarkUp: aliasRejectMarkUp.name.value,
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
    cy.visit('/visit/testRevisionId1/toDaiHospital1/toDaiPatient1/visit1Visit2');
    cy.wait(`@${aliasVisitDetails}`).then((result) => {
      cy.wrap(result).then(() => {
        if (result?.response?.statusCode === 200) {
          visitDetailsSource = result.response.body.data.visitDetails.withSourceForm.fieldGroups;
        }
      });
    });
  });

  describe('Reject Verifier Rejected', () => {
    it('Open edit data entry modal', () => {
      cy.get('[data-cy=sourceQuestionTab]').click();
      cy.get('[data-cy=NOT_AVAILABLE_REJECTED]').click();
      cy.clickQuickAction(
        '[data-cy=question-card-extermities1]',
        '[data-cy=accept-reject-action-extermities1]',
        undefined,
        undefined,
        'PARENT_RELATION',
      );
    });

    it('Show modal content', () => {
      cy.waitForReact();
      cy.get('[data-cy=modal-title]').should('exist');
      cy.get('.img-container').should('exist');
      cy.get('[data-cy=expand-image]').should('exist');
      cy.get('[data-cy=Rejected-status]').should('exist');
      cy.get('[data-cy=first-data-entry-extermities1').should('exist');
    });

    it('Submit reject verifier rejected without provide answer', () => {
      cy.waitForReact();
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasing.aliasRejectMarkUp) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('.slick-active [data-cy=reject-mark-up]').first().click();
      cy.wait(`@${aliasing.aliasRejectMarkUp}`).then((result) => {
        cy.wrap(result).then(() => {
          if (result?.response?.statusCode === 200) {
            cy.get('[data-cy=alert-success]');
          }
        });
      });
      cy.get('[data-cy=modal-close]').first().click({ force: true });
      // to wait for the rejected card to move on different section
      cy.wait(3000);
      cy.clickQuickAction(
        '[data-cy=question-card-mouth1]',
        '[data-cy=accept-reject-action-mouth1]',
        undefined,
        undefined,
        'PARENT_RELATION',
      );
    });
  });

  describe('Accept Verifier Rejected', () => {
    it('Show question answer', () => {
      cy.waitForReact();
      cy.get('[data-cy=question-answers]').should('exist');
    });

    it('Submit accept verifier rejected', () => {
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasing.aliasAcceptMarkUp) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('.slick-active [data-cy=approve-mark-up]').first().click();
      cy.wait(`@${aliasing.aliasAcceptMarkUp}`).then((result) => {
        cy.wrap(result).then(() => {
          if (result?.response?.statusCode === 200) {
            cy.waitForReact();
            cy.get('[data-cy=alert-success]');
            cy.get('[data-cy=modal-close]').first().click({ force: true });
            cy.get('[data-cy=question-card-mouth1', { timeout: 10000 }).should('not.exist');
          }
        });
      });
    });

    it('Question should move to expected state', () => {
      cy.scrollToElement('#filtered-questions');
      cy.get('[data-cy=question-card-extermities1]').should('exist');

      // Nvm this just to really make sure it goes to top, bcs it's failed on sorry cypress
      cy.scrollTo('top');
      cy.scrollTo(0, -5000);
      // NOTE: bcs of combining state, MARK_UP_REJECTED tab combined with NOT_AVAILABLE_REJECTED tab
      cy.get('[data-cy=REJECTED_DATA_ENTRY]').scrollIntoView().click({ force: true });
      cy.get('[data-cy=question-card-mouth1]').should('exist');
    });
  });
});
