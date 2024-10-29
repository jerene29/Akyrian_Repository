describe('Group level mark no answer - for question that require reason in Attached pending snippet state [sourceCapture]', () => {
  before(() => {
    cy.reseedDB();
    cy.fillInloginAsFormV2({
      email: 'admin@example.com',
    });
    cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit1Visit1');
    cy.waitForReact();
    cy.get('[data-cy=sourceQuestionTab]').click();
  });

  it('Mark no answer Respiration Rate question and Blood Type question in attached pending snippet state - Group Level (specific reason & other reason)', () => {
    cy.get('[data-cy=ATTACHED]').click();
    cy.get('[data-cy=question-breath1]')
      .should('be.visible')
      .realHover()
      .then(() => {
        cy.get('[data-cy=noanswer-action-breath1] [data-cy=open-modal-noanswer]')
          .should('be.visible')
          .click();
      });
    cy.get('[data-cy=mark-no-answer-reason-select]').type('{uparrow}{uparrow}{enter}');
    cy.get('[data-cy=button-submit-noanswer]').click();
    cy.get('[data-cy=question-breath1]').should('not.exist');
    cy.get('[data-cy=question-bloodType1]')
      .realHover()
      .then(() => {
        cy.get('[data-cy=noanswer-action-bloodType1] [data-cy=open-modal-noanswer]').click({
          force: true,
        });
      });
    cy.get('[data-cy=mark-no-answer-reason-select]')
      .type('{uparrow}{enter}')
      .type('other reason for blood type');
    cy.get('[data-cy=button-submit-noanswer]').click({ force: true });
    cy.get('[data-cy=question-bloodType1]').should('not.exist');
  });

  it.skip('Respiration rate question should have "Test was unable to be performed" as mark no answer reason in [FILLED STATE]', () => {
    cy.get('[data-cy=FILLED]').click();
    cy.get('[data-cy=question-breath1]').contains('No Answer');
    cy.get('[data-cy=question-breath1]')
      .realHover()
      .then(() => {
        cy.get('[data-cy=add-query-breath1] [data-cy=add-query-action]').click({ force: true });
      });
    cy.get('[data-cy=No-Answer-status] [data-cy=title-No-Answer]').contains('No Answer');
    cy.get('[data-cy=No-Answer-status] [data-cy=desc-No-Answer]').contains(
      'Test was unable to be performed',
    );
    cy.get('[data-cy=No-Answer-status] [data-cy=name-No-Answer]').contains('Akyrian Admin');
    cy.get('[data-cy=No-Answer-status] [data-cy=role-No-Answer]').contains(
      '(Akyrian People, University of Tokyo Hospital)',
    );
    cy.get('[data-cy=modal-close]').click();
    cy.get('[data-cy=question-breath1]')
      .realHover()
      .then(() => {
        cy.get('[data-cy=verify-action-breath1] svg').click({ force: true });
      });
    cy.get('#monitor-flow-body-breath1').within(() => {
      cy.get('[data-cy=No-Answer-status] [data-cy=title-No-Answer]').contains('No Answer');
      cy.get('[data-cy=No-Answer-status] [data-cy=desc-No-Answer]').contains(
        'Test was unable to be performed',
      );
      cy.get('[data-cy=No-Answer-status] [data-cy=name-No-Answer]').contains('Akyrian Admin');
      cy.get('[data-cy=No-Answer-status] [data-cy=role-No-Answer]').contains(
        '(Akyrian People, University of Tokyo Hospital)',
      );
      cy.get('[data-cy=modal-close]').click();
    });

    cy.get(':nth-child(1)  [data-cy=No-Answer-status] [data-cy=title-No-Answer]').contains(
      'No Answer',
    );
    cy.get(':nth-child(1)  [data-cy=No-Answer-status] [data-cy=desc-No-Answer]').contains(
      'Test was unable to be performed',
    );
    cy.get(':nth-child(1)  [data-cy=No-Answer-status] [data-cy=name-No-Answer]').contains(
      'Akyrian Admin',
    );
    cy.get(':nth-child(1)  [data-cy=No-Answer-status] [data-cy=role-No-Answer]').contains(
      '(Akyrian People, University of Tokyo Hospital)',
    );

    cy.get('[data-cy=img-front-mulSiteSourceCapture2]').click();
    cy.get('[data-cy=noanswer-notif]').contains('No Answer');
    cy.get('[data-cy=noanswer-notif]')
      .realHover()
      .then(() => {
        cy.get('[data-cy=No-Answer-status] [data-cy=title-No-Answer]').contains('No Answer');
        cy.get('[data-cy=No-Answer-status] [data-cy=desc-No-Answer]').contains(
          'Test was unable to be performed',
        );
        cy.get('[data-cy=No-Answer-status] [data-cy=name-No-Answer]').contains('Akyrian Admin');
        cy.get('[data-cy=No-Answer-status] [data-cy=role-No-Answer]').contains(
          '(Akyrian People, University of Tokyo Hospital)',
        );
        cy.get('[data-cy=carousel-close]').click();
      });
  });
  it.skip('Blood type question should have "other reason for blood type" as mark no answer reason in [FILLED STATE]', () => {
    cy.get('[data-cy=question-bloodType1]').contains('No Answer');
    cy.get('[data-cy=question-bloodType1]')
      .realHover()
      .then(() => {
        cy.get('[data-cy=add-query-bloodType1] [data-cy=add-query-action] > path').click({
          force: true,
        });
      });
    cy.get('[data-cy=No-Answer-status] [data-cy=title-No-Answer]').contains('No Answer');
    cy.get('[data-cy=No-Answer-status] [data-cy=desc-No-Answer]').contains(
      'other reason for blood type',
    );
    cy.get('[data-cy=No-Answer-status] [data-cy=name-No-Answer]').contains('Akyrian Admin');
    cy.get('[data-cy=No-Answer-status] [data-cy=role-No-Answer]').contains(
      '(Akyrian People, University of Tokyo Hospital)',
    );
    cy.get('[data-cy=modal-close]').click();

    cy.get('[data-cy=question-bloodType1]')
      .realHover()
      .then(() => {
        cy.get('[data-cy=verify-action-bloodType1] svg').click({ force: true });
      });
    cy.get('#monitor-flow-body-bloodType1').within(() => {
      cy.get('[data-cy=No-Answer-status] [data-cy=title-No-Answer]').contains('No Answer');
      cy.get('[data-cy=No-Answer-status] [data-cy=desc-No-Answer]').contains(
        'other reason for blood type',
      );
      cy.get('[data-cy=No-Answer-status] [data-cy=name-No-Answer]').contains('Akyrian Admin');
      cy.get('[data-cy=No-Answer-status] [data-cy=role-No-Answer]').contains(
        '(Akyrian People, University of Tokyo Hospital)',
      );
      cy.get('[data-cy=modal-close]').click();
    });

    cy.get(':nth-child(2)  [data-cy=No-Answer-status] [data-cy=title-No-Answer]').contains(
      'No Answer',
    );
    cy.get(':nth-child(2)  [data-cy=No-Answer-status] [data-cy=desc-No-Answer]').contains(
      'other reason for blood type',
    );
    cy.get(':nth-child(2)  [data-cy=No-Answer-status] [data-cy=name-No-Answer]').contains(
      'Akyrian Admin',
    );
    cy.get(':nth-child(2)  [data-cy=No-Answer-status] [data-cy=role-No-Answer]').contains(
      '(Akyrian People, University of Tokyo Hospital)',
    );

    cy.get('[data-cy=img-front-mulSiteSourceCapture2]').click();
    cy.get('[data-cy=noanswer-notif]').contains('No Answer');
    cy.get('[data-cy=noanswer-notif]')
      .realHover()
      .then(() => {
        cy.get('[data-cy=No-Answer-status] [data-cy=title-No-Answer]').contains('No Answer');
        cy.get('[data-cy=No-Answer-status] [data-cy=desc-No-Answer]').contains(
          'other reason for blood type',
        );
        cy.get('[data-cy=No-Answer-status] [data-cy=name-No-Answer]').contains('Akyrian Admin');
        cy.get('[data-cy=No-Answer-status] [data-cy=role-No-Answer]').contains(
          '(Akyrian People, University of Tokyo Hospital)',
        );
        cy.get('[data-cy=carousel-close]').click();
      });
  });

  it('Respiration rate question should have "Test was unable to be performed" as mark no answer reason in [ALL STATE]', () => {
    cy.get('[data-cy=all-filter]').click();
    cy.get('[data-cy=question-breath1]').contains('No Answer');
    cy.get('[data-cy=question-breath1]').click();
    cy.get('[data-cy=No-Answer-status] [data-cy=title-No-Answer]').contains('No Answer');
    cy.get('[data-cy=No-Answer-status] [data-cy=desc-No-Answer]').contains(
      'Test was unable to be performed',
    );
    cy.get('[data-cy=No-Answer-status] [data-cy=name-No-Answer]').contains('Akyrian Admin');
    cy.get('[data-cy=No-Answer-status] [data-cy=role-No-Answer]').contains(
      '(Akyrian People, University of Tokyo Hospital)',
    );
    cy.get('[data-cy=modal-close]').click();
    cy.wait(500);
  });
  it('Blood type questeion should have "other reason for blood type" as mark no answer reason in [ALL STATE]', () => {
    cy.get('[data-cy=question-bloodType1]').contains('No Answer');
    cy.get('[data-cy=question-bloodType1]').click();
    cy.get('[data-cy=No-Answer-status] [data-cy=title-No-Answer]').contains('No Answer');
    cy.get('[data-cy=No-Answer-status] [data-cy=desc-No-Answer]').contains(
      'other reason for blood type',
    );
    cy.get('[data-cy=No-Answer-status] [data-cy=name-No-Answer]').contains('Akyrian Admin');
    cy.get('[data-cy=No-Answer-status] [data-cy=role-No-Answer]').contains(
      '(Akyrian People, University of Tokyo Hospital)',
    );
    cy.get('[data-cy=modal-close]').click();
    cy.wait(500);
  });
});
