import { RejectMarkUpFfgrDocument } from '../../../../../src/graphQL/generated/graphql';

const aliasRejectMarkUp = RejectMarkUpFfgrDocument.definitions[0].name.value;

describe('Group level mark no answer - for question that require reason [sourceCapture]', () => {
  before(() => {
    cy.reseedDB();
    cy.fillInloginAsFormV2({
      email: 'admin@example.com',
    });
    cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit1Visit1');
    cy.waitForReact();
    cy.get('[data-cy=sourceQuestionTab]').click();
  });

  it('Reject Right Eye Question and Lungs Question in Pending Mark-up acceptance [MARKED_UP] state', () => {
    cy.get('[data-cy=MARKED_UP]').click().trigger('mouseout');

    cy.clickQuickAction(
      `[data-cy=question-card-lungs1]`,
      `[data-cy=review-sc-snippet-action-lungs1]`,
      undefined,
      undefined,
      'PARENT_RELATION',
    );
    cy.get('canvas', { timeout: 20000 }).should('be.visible');
    cy.get('[data-cy=overlapping-button-reject-snippet]').should('exist').click();
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasRejectMarkUp) {
        req.alias = req.body.operationName;
      }
    });
    cy.get('[data-cy=reject-reason]').click().type(`{enter}`);
    cy.get('[data-cy=description-lungs1]').click();
    cy.get('[data-cy=submit-reject-reason]').click();
    cy.wait(`@${aliasRejectMarkUp}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        cy.get('[data-cy=alert-success]', { timeout: 5000 });
        cy.get('[data-cy=question-lungs1]').should('not.exist');
      }
    });
    cy.get('[data-cy=carousel-close]').click();
    cy.clickQuickAction(
      `[data-cy=question-card-rightEye1]`,
      `[data-cy=review-sc-snippet-action-rightEye1]`,
    );
    cy.get('canvas', { timeout: 20000 }).should('be.visible');
    cy.get('[data-cy=overlapping-button-reject-snippet]').should('exist').click();
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasRejectMarkUp) {
        req.alias = req.body.operationName;
      }
    });
    cy.get('[data-cy=reject-reason]')
      .click()
      .type(`{uparrow}{enter}`)
      .type('other reason right eye');
    cy.get('[data-cy=description-rightEye1]').click();
    cy.get('[data-cy=submit-reject-reason]').click();
    cy.wait(`@${aliasRejectMarkUp}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        cy.get('[data-cy=alert-success]', { timeout: 5000 });
        cy.get('[data-cy=question-rightEye1]').should('not.exist');
      }
    });
  });

  it('Lungs question should have correct reject reason in [MARK_UP_REJECTED] state', () => {
    cy.get('[data-cy=NOT_AVAILABLE_REJECTED]').click().trigger('mouseout');
    cy.get('[data-cy=question-lungs1]').realHover().click();
    cy.get('[data-cy=title-Rejected]').contains('Rejected');
    cy.get('[data-cy=desc-Rejected]').contains('Snippet blur');
    cy.get('[data-cy=name-Rejected]').contains('Akyrian Admin');
    cy.get('[data-cy=role-Rejected]').contains('(Akyrian People, University of Tokyo Hospital)');

    cy.get('[data-cy=img-front-mulSiteSourceCapture1]').click({ force: true });
    cy.get('[data-cy=Rejected-Reason]').trigger('mouseover');
    cy.get('.ant-tooltip-inner [data-cy=Rejected-status] [data-cy=title-Rejected]').contains(
      'Rejected',
    );
    cy.get('.ant-tooltip-inner [data-cy=Rejected-status] [data-cy=desc-Rejected]').contains(
      'Snippet blur',
    );
    cy.get('.ant-tooltip-inner [data-cy=Rejected-status] [data-cy=name-Rejected]').contains(
      'Akyrian Admin',
    );
    cy.get('.ant-tooltip-inner [data-cy=Rejected-status] [data-cy=role-Rejected]').contains(
      '(Akyrian People, University of Tokyo Hospital)',
    );
    cy.get('[data-cy=carousel-close] > path').click();
  });

  it('Right Eye question should have correct reject reason in [MARK_UP_REJECTED] state', () => {
    cy.get('[data-cy=question-rightEye1]').realHover().click();
    cy.get('[data-cy=Rejected-status] [data-cy=title-Rejected]').contains('Rejected');
    cy.get('[data-cy=Rejected-status] [data-cy=desc-Rejected]').contains('other reason right eye');
    cy.get('[data-cy=Rejected-status] [data-cy=name-Rejected]').contains('Akyrian Admin');
    cy.get('[data-cy=Rejected-status] [data-cy=role-Rejected]').contains(
      '(Akyrian People, University of Tokyo Hospital)',
    );

    cy.get('[data-cy=img-front-mulSiteSourceCapture1]').click();
    cy.get('[data-cy=Rejected-Reason]').trigger('mouseover');
    cy.get('.ant-tooltip-inner [data-cy=Rejected-status] [data-cy=title-Rejected]').contains(
      'Rejected',
    );
    cy.get('.ant-tooltip-inner [data-cy=Rejected-status] [data-cy=desc-Rejected]').contains(
      'other reason right eye',
    );
    cy.get('.ant-tooltip-inner [data-cy=Rejected-status] [data-cy=name-Rejected]').contains(
      'Akyrian Admin',
    );
    cy.get('.ant-tooltip-inner [data-cy=Rejected-status] [data-cy=role-Rejected]').contains(
      '(Akyrian People, University of Tokyo Hospital)',
    );
    cy.get('[data-cy=carousel-close] > path').click({ force: true });
  });

  it('Check rejected Detail in view modal that 2 cards in [ALL STATE]', () => {
    cy.get('[data-cy=all-filter]').click();
    cy.get('[data-cy=question-lungs1]').click();
    cy.get('.ant-modal-content [data-cy=Rejected-status] [data-cy=title-Rejected]').contains(
      'Rejected',
    );
    cy.get('.ant-modal-content [data-cy=Rejected-status] [data-cy=desc-Rejected]').contains(
      'Snippet blur',
    );
    cy.get('.ant-modal-content [data-cy=Rejected-status] [data-cy=name-Rejected]').contains(
      'Akyrian Admin',
    );
    cy.get('.ant-modal-content [data-cy=Rejected-status] [data-cy=role-Rejected]').contains(
      '(Akyrian People University of Tokyo Hospital)',
    );
    cy.get('[data-cy=modal-close]').click({ force: true });

    cy.get('[data-cy=question-rightEye1]').click();
    cy.get('.ant-modal-content [data-cy=Rejected-status] [data-cy=title-Rejected]').contains(
      'Rejected',
    );
    cy.get('.ant-modal-content [data-cy=Rejected-status] [data-cy=desc-Rejected]').contains(
      'other reason right eye',
    );
    cy.get('.ant-modal-content [data-cy=Rejected-status] [data-cy=name-Rejected]').contains(
      'Akyrian Admin',
    );
    cy.get('.ant-modal-content [data-cy=Rejected-status] [data-cy=role-Rejected]').contains(
      '(Akyrian People University of Tokyo Hospital)',
    );
    cy.get('[data-cy=modal-close]').click({ force: true });
  });
});
