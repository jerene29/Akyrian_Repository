const anyPOSTRequest = 'anyPOSTRequest';

describe('Reject question from Rejected Markup [sourceCapture]', () => {
  before(() => {
    cy.reseedDB();
    cy.fillInloginAsFormV2({
      email: 'admin@example.com',
    });
    cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit1Visit1');
    cy.waitForReact();
    cy.get('[data-cy=sourceQuestionTab]').click();
  });

  it('Reject Blood Pressure Question in Mark up rejected [MARK_UP_REJECTED] state', () => {
    cy.get('[data-cy=NOT_AVAILABLE_REJECTED]').click().trigger('mouseout');
    cy.clickQuickAction(
      '[data-cy=question-bloodPressure1]',
      '[data-cy=clear-snippet-action-bloodPressure1]',
      undefined,
      undefined,
      'SVG',
    );
    cy.intercept('POST', '/graphql').as(anyPOSTRequest);
    cy.get('[data-cy=confirmModal-confirmButton]').click({ force: true });
    cy.wait(`@${anyPOSTRequest}`);
    cy.wait(4000);
  });

  it('Blood Pressure question should have correct reject reason rendering in Rejected [NOT_AVAILABLE_REJECTED] state', () => {
    // NOTE: alternative to scrollTo('top')/scrollIntoView() which doesn't work, so we use this approach to make first question get into view
    cy.get('[data-cy=UNATTACHED]').click().trigger('mouseout');
    cy.get('[data-cy=NOT_AVAILABLE_REJECTED]').click().trigger('mouseout');
    cy.get('[data-cy=question-card-bloodPressure1] > [data-cy=question-card]')
      .should('exist')
      .realHover()
      // NOTE: because question can't be clicked and this ensure the hover succeed
      .click();

    cy.get('[data-cy=Rejected-status] [data-cy=title-Rejected]').contains('Rejected');
    cy.get('[data-cy=Rejected-status] [data-cy=desc-Rejected]').contains('Incorrect snippet');
    cy.get('[data-cy=Rejected-status] [data-cy=name-Rejected]').contains('Professor Birch');
    cy.get('[data-cy=Rejected-status] [data-cy=role-Rejected]').contains(
      '(Snippet Assessment & No Source Review User, University of Tokyo Hospital)',
    );
    cy.get('[data-cy=img-front-mulSiteSourceCapture1]').click();
    cy.get('[data-cy=Rejected-Reason]').trigger('mouseover');
    cy.get('.ant-tooltip-inner [data-cy=Rejected-status] [data-cy=title-Rejected]').contains(
      'Rejected',
    );
    cy.get('.ant-tooltip-inner [data-cy=Rejected-status] [data-cy=desc-Rejected]').contains(
      'Incorrect snippet',
    );
    cy.get('.ant-tooltip-inner [data-cy=Rejected-status] [data-cy=name-Rejected]').contains(
      'Professor Birch',
    );
    cy.get('.ant-tooltip-inner [data-cy=Rejected-status] [data-cy=role-Rejected]').contains(
      '(Snippet Assessment & No Source Review User, University of Tokyo Hospital)',
    );
    cy.wait(500);
    cy.get('[data-cy=carousel-close] > path').click();
  });

  it('Reject Brain Question in Mark up rejected [MARK_UP_REJECTED] state', () => {
    cy.clickQuickAction(
      '[data-cy=question-brain1]',
      '[data-cy=clear-snippet-action-brain1]',
      undefined,
      undefined,
      'SVG',
    );
    cy.intercept('POST', '/graphql').as(anyPOSTRequest);
    cy.get('[data-cy=confirmModal-confirmButton]').click({ force: true });
    cy.wait(`@${anyPOSTRequest}`);
  });

  it('Brain question should have correct reject reason rendering in Rejected [NOT_AVAILABLE_REJECTED] state', () => {
    cy.get('[data-cy=question-brain1]').click();
    cy.get('[data-cy=Rejected-status] [data-cy=title-Rejected]').contains('Rejected');
    cy.get('[data-cy=Rejected-status] [data-cy=desc-Rejected]').contains(
      'Incorrect source captured',
    );
    cy.get('[data-cy=Rejected-status] [data-cy=name-Rejected]').contains('Professor Birch');
    cy.get('[data-cy=Rejected-status] [data-cy=role-Rejected]').contains(
      '(Snippet Assessment & No Source Review User, University of Tokyo Hospital)',
    );

    cy.get('[data-cy=img-front-mulSiteSourceCapture1]').click();
    cy.get('[data-cy=Rejected-Reason]').trigger('mouseover');
    cy.get('.ant-tooltip-inner [data-cy=Rejected-status] [data-cy=title-Rejected]').contains(
      'Rejected',
    );
    cy.get('.ant-tooltip-inner [data-cy=Rejected-status] [data-cy=desc-Rejected]').contains(
      'Incorrect source captured',
    );
    cy.get('.ant-tooltip-inner [data-cy=Rejected-status] [data-cy=name-Rejected]').contains(
      'Professor Birch',
    );
    cy.get('.ant-tooltip-inner [data-cy=Rejected-status] [data-cy=role-Rejected]').contains(
      '(Snippet Assessment & No Source Review User, University of Tokyo Hospital)',
    );
    cy.get('[data-cy=carousel-close] > path').click();
  });
});
