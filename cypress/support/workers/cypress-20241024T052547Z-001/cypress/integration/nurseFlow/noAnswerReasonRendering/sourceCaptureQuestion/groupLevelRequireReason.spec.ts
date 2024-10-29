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

  it('Mark no answer muscle Question (answered with provided Reason)', () => {
    cy.get('[data-cy=question-muscle1]').realHover({ scrollBehavior: 'center' });
    cy.get('[data-cy=noanswer-action-muscle1] [data-cy=open-modal-noanswer] ')
      .should('be.visible')
      .click({ scrollBehavior: false });
    cy.get('[data-cy=mark-no-answer-reason-select]').type('{enter}');
    cy.get('[data-cy=button-submit-noanswer]').click();
    cy.get('[data-cy=alert-success]', { timeout: 5000 });
  });

  it('Mark no answer Weight Question (answered with custom reason <Other Reason> )', () => {
    cy.get('[data-cy=question-weight1]').realHover({ scrollBehavior: 'center' });
    cy.get('[data-cy=noanswer-action-weight1] [data-cy=open-modal-noanswer] ')
      .should('be.visible')
      .click({ scrollBehavior: false });
    cy.get('[data-cy=mark-no-answer-reason-select]')
      .type('{uparrow}{enter}')
      .type('testing other reason group lvl');
    cy.get('[data-cy=button-submit-noanswer]').click();
    cy.get('[data-cy=alert-success]', { timeout: 5000 });
  });

  it('Muscle Question should have "Source document has no data" as mark no answer reason ', () => {
    cy.get('[data-cy=FILLED]').click();
    cy.scrollToElement('[data-cy=question-muscle1]').contains('No Answer');
    cy.scrollToElement('[data-cy=add-query-muscle1] [data-cy=add-query-action]').click({
      force: true,
    });
    cy.get('[data-cy=No-Answer-status] [data-cy=title-No-Answer]').contains('No Answer');
    cy.get('[data-cy=No-Answer-status] [data-cy=desc-No-Answer]').contains(
      'Source document has no data',
    );
    cy.get('[data-cy=No-Answer-status] [data-cy=name-No-Answer]').contains('Akyrian Admin');
    cy.get('[data-cy=No-Answer-status] [data-cy=role-No-Answer]').contains(
      '(Akyrian People, University of Tokyo Hospital)',
    );
    cy.get('[data-cy=modal-close]').click();
    cy.get('[data-cy=verify-action-muscle1] [data-cy]').click({ force: true });
    cy.get('[data-cy=No-Answer-status]  [data-cy=title-No-Answer]').contains('No Answer');
    cy.get('[data-cy=No-Answer-status]  [data-cy=desc-No-Answer]').contains(
      'Source document has no data',
    );
    cy.get('[data-cy=No-Answer-status]  [data-cy=name-No-Answer]').contains('Akyrian Admin');
    cy.get('[data-cy=No-Answer-status]  [data-cy=role-No-Answer]').contains(
      '(Akyrian People, University of Tokyo Hospital)',
    );
    cy.get('[data-cy=modal-close]').click({ force: true, multiple: true });
    cy.get('[data-cy=all-filter]').click();
    cy.get('[data-cy=question-muscle1]').contains('No Answer');
    cy.get('[data-cy=question-muscle1]').click({ force: true });
    cy.get('[data-cy=No-Answer-status] [data-cy=title-No-Answer]').contains('No Answer');
    cy.get('[data-cy=No-Answer-status] [data-cy=desc-No-Answer]').contains(
      'Source document has no data',
    );
    cy.get('[data-cy=No-Answer-status] [data-cy=name-No-Answer]').contains('Akyrian Admin');
    cy.get('[data-cy=No-Answer-status] [data-cy=role-No-Answer]').contains(
      '(Akyrian People, University of Tokyo Hospital)',
    );
    cy.get('[data-cy=modal-close]').click();
  });

  it('Weight question should have "testing other reason group lvl" as mark no answer reason', () => {
    cy.get('[data-cy=FILLED]').click();
    cy.get('[data-cy=question-weight1]').contains('No Answer');
    cy.get('[data-cy=add-query-weight1] [data-cy=add-query-action]').click({ force: true });
    cy.get('[data-cy=No-Answer-status] [data-cy=title-No-Answer]').contains('No Answer');
    cy.get('[data-cy=No-Answer-status] [data-cy=desc-No-Answer]').contains(
      'testing other reason group lvl',
    );
    cy.get('[data-cy=No-Answer-status] [data-cy=name-No-Answer]').contains('Akyrian Admin');
    cy.get('[data-cy=No-Answer-status] [data-cy=role-No-Answer]').contains(
      '(Akyrian People, University of Tokyo Hospital)',
    );
    cy.get('[data-cy=modal-close]').click();
    cy.get('[data-cy=verify-action-weight1] [data-cy]').click({ force: true });
    cy.get('[data-cy=No-Answer-status] [data-cy=title-No-Answer]').contains('No Answer');
    cy.get('[data-cy=No-Answer-status] [data-cy=desc-No-Answer]').contains(
      'testing other reason group lvl',
    );
    cy.get('[data-cy=No-Answer-status] [data-cy=name-No-Answer]').contains('Akyrian Admin');
    cy.get('[data-cy=No-Answer-status] [data-cy=role-No-Answer]').contains(
      '(Akyrian People, University of Tokyo Hospital)',
    );
    cy.get('[data-cy=modal-close]').click({ force: true, multiple: true });
    cy.get('[data-cy=all-filter]').click();
    cy.get('[data-cy=question-weight1]').contains('No Answer');
    cy.get('[data-cy=question-weight1]').click({ force: true });
    cy.get('[data-cy=No-Answer-status] [data-cy=title-No-Answer]').contains('No Answer');
    cy.get('[data-cy=No-Answer-status] [data-cy=desc-No-Answer]').contains(
      'testing other reason group lvl',
    );
    cy.get('[data-cy=No-Answer-status] [data-cy=name-No-Answer]').contains('Akyrian Admin');
    cy.get('[data-cy=No-Answer-status] [data-cy=role-No-Answer]').contains(
      '(Akyrian People, University of Tokyo Hospital)',
    );
    cy.get('[data-cy=modal-close]').click();
    cy.wait(500);
  });
});
