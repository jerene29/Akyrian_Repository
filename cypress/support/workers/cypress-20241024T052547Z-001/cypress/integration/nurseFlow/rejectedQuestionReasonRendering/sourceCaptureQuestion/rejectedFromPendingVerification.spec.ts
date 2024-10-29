describe('Reject question from pending verification state [sourceCapture]', () => {
  before(() => {
    cy.reseedDB();
    cy.fillInloginAsFormV2({
      email: 'admin@example.com',
    });
    cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit1Visit1');
    cy.waitForReact();
    cy.get('[data-cy=sourceQuestionTab]').click();
  });

  it('Reject Heartbeat Question and Left Lungs Question in Data Entry Complete, Pending Verification [FILLED] state', () => {
    cy.get('[data-cy=FILLED]').click().trigger('mouseout');
    cy.clickQuickAction(
      '[data-cy=question-card-heart1]',
      '[data-cy=verify-action-heart1]',
      undefined,
      undefined,
      'SVG',
    );
    cy.get('.slick-active [data-cy=reject-data-entry]').click();
    cy.get('.slick-active [data-cy=reject-reason]').type('{enter}');
    cy.get('.slick-active [data-cy=submit-reject-reason]').click({ force: true });
    cy.get('.slick-active [data-cy=modal-close]').click({ force: true });
    cy.get('[data-cy=question-heart1]').should('not.exist');
    cy.clickQuickAction('[data-cy=question-card-leftLungs1]', '[data-cy=verify-action-leftLungs1]');
    cy.get('.slick-active [data-cy=reject-data-entry]').click();
    cy.get('.slick-active [data-cy=reject-reason]').type('{uparrow}{enter}');
    cy.get('.slick-active [data-cy=reject-reason]').type('other reason left lungs');
    cy.get('.slick-active [data-cy=submit-reject-reason]').click({ force: true });
    cy.get('.slick-active [data-cy=modal-close]').click({ force: true });
    cy.get('[data-cy=question-leftLungs1]').should('not.exist');
  });

  it('Heartbeat question should have correct rejected reason rendering in [REJECTED] State', () => {
    cy.get('[data-cy=NOT_AVAILABLE_REJECTED]').click().trigger('mouseout');

    cy.clickQuickAction(
      '[data-cy=question-card-heart1]',
      '[data-cy=accept-reject-action-heart1]',
      undefined,
      undefined,
      'SVG',
    );
    cy.get('#monitor-flow-body-heart1').within(() => {
      cy.get('[data-cy=Rejected-status] [data-cy=title-Rejected]').contains('Rejected');
      cy.get('[data-cy=Rejected-status] [data-cy=desc-Rejected]').contains('Data entry error');
      cy.get('[data-cy=Rejected-status] [data-cy=name-Rejected]').contains('Akyrian Admin');
      cy.get('[data-cy=Rejected-status] [data-cy=role-Rejected]').contains(
        '(Akyrian People, University of Tokyo Hospital)',
      );
      cy.get('[data-cy=modal-close]').click();
      cy.wait(500);
    });

    cy.get('[data-cy=question-heart1]').realHover().click();

    cy.get('[data-cy=Rejected-status] [data-cy=title-Rejected]').contains('Rejected');
    cy.get('[data-cy=Rejected-status] [data-cy=desc-Rejected]').contains('Data entry error');
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
      'Data entry error',
    );
    cy.get('.ant-tooltip-inner [data-cy=Rejected-status] [data-cy=name-Rejected]').contains(
      'Akyrian Admin',
    );
    cy.get('.ant-tooltip-inner [data-cy=Rejected-status] [data-cy=role-Rejected]').contains(
      '(Akyrian People, University of Tokyo Hospital)',
    );
    cy.wait(500);
    cy.get('[data-cy=carousel-close] > path').click({ force: true });
  });

  it('Left Lungs question should have correct rejected reason rendering in [REJECTED] State', () => {
    cy.clickQuickAction(
      '[data-cy=question-card-leftLungs1]',
      '[data-cy=accept-reject-action-leftLungs1]',
      undefined,
      undefined,
      'SVG',
    );
    cy.get('.slick-active #monitor-flow-body-leftLungs1').within(() => {
      cy.get('[data-cy=Rejected-status] [data-cy=title-Rejected]').contains('Rejected');
      cy.get('[data-cy=Rejected-status] [data-cy=desc-Rejected]').contains(
        'other reason left lungs',
      );
      cy.get('[data-cy=Rejected-status] [data-cy=name-Rejected]').contains('Akyrian Admin');
      cy.get('[data-cy=Rejected-status] [data-cy=role-Rejected]').contains(
        '(Akyrian People, University of Tokyo Hospital)',
      );
      cy.get('[data-cy=modal-close]').click({ force: true });
      cy.wait(500);
    });

    cy.get('[data-cy=question-leftLungs1]').realHover().click();

    cy.get('[data-cy=Rejected-status] [data-cy=title-Rejected]').contains('Rejected');
    cy.get('[data-cy=Rejected-status] [data-cy=desc-Rejected]').contains('other reason left lungs');
    cy.get('[data-cy=Rejected-status] [data-cy=name-Rejected]').contains('Akyrian Admin');
    cy.get('[data-cy=Rejected-status] [data-cy=role-Rejected]').contains(
      '(Akyrian People, University of Tokyo Hospital)',
    );

    cy.get('[data-cy=img-front-mulSiteSourceCapture1Dup1]').click();
    cy.get('[data-cy=Rejected-Reason]').trigger('mouseover');
    cy.get('.ant-tooltip-inner [data-cy=Rejected-status] [data-cy=title-Rejected]').contains(
      'Rejected',
    );
    cy.get('.ant-tooltip-inner [data-cy=Rejected-status] [data-cy=desc-Rejected]').contains(
      'other reason left lungs',
    );
    cy.get('.ant-tooltip-inner [data-cy=Rejected-status] [data-cy=name-Rejected]').contains(
      'Akyrian Admin',
    );
    cy.get('.ant-tooltip-inner [data-cy=Rejected-status] [data-cy=role-Rejected]').contains(
      '(Akyrian People, University of Tokyo Hospital)',
    );
    cy.wait(500);
    cy.get('[data-cy=carousel-close] > path').click();
  });

  it('Heartbeat Question and Left Lungs Question should have correct rejected reason in [ALL STATE]', () => {
    cy.get('[data-cy=all-filter]').click();

    cy.get('[data-cy=question-heart1]').click();
    cy.get('.ant-modal-content [data-cy=Rejected-status] [data-cy=title-Rejected]').contains(
      'Rejected',
    );
    cy.get('.ant-modal-content [data-cy=Rejected-status] [data-cy=desc-Rejected]').contains(
      'Data entry error',
    );
    cy.get('.ant-modal-content [data-cy=Rejected-status] [data-cy=name-Rejected]').contains(
      'Akyrian Admin',
    );
    cy.get('.ant-modal-content [data-cy=Rejected-status] [data-cy=role-Rejected]').contains(
      '(Akyrian People University of Tokyo Hospital)',
    );
    cy.get('[data-cy=modal-close]').click({ force: true });
    cy.wait(500);

    cy.get('[data-cy=question-leftLungs1]').click();
    cy.get('.ant-modal-content [data-cy=Rejected-status] [data-cy=title-Rejected]').contains(
      'Rejected',
    );
    cy.get('.ant-modal-content [data-cy=Rejected-status] [data-cy=desc-Rejected]').contains(
      'other reason left lungs',
    );
    cy.get('.ant-modal-content [data-cy=Rejected-status] [data-cy=name-Rejected]').contains(
      'Akyrian Admin',
    );
    cy.get('.ant-modal-content [data-cy=Rejected-status] [data-cy=role-Rejected]').contains(
      '(Akyrian People University of Tokyo Hospital)',
    );
    cy.get('[data-cy=modal-close]').click({ force: true });
    cy.wait(500);
  });
});

describe('Question Left Lungs in state Verifier Rejected (submit Rejected)', () => {
  it('Select state Verifier Rejected', () => {
    cy.get('[data-cy=NOT_AVAILABLE_REJECTED]').click().trigger('mouseout');
  });
  it('Reject the question', () => {
    cy.clickQuickAction(
      '[data-cy=question-card-leftLungs1]',
      '[data-cy=accept-reject-action-leftLungs1]',
      undefined,
      undefined,
      'SVG',
    );
    cy.get('[data-cy=reject-mark-up]').click({ multiple: true, force: true });
    cy.get('[data-cy=modal-close]').click({ force: true, multiple: true });
    cy.get('[data-cy=alert-success]', { timeout: 30000 });
    // NOTE: it's exist because NOT_AVAILABLE_REJECTED and MARK_UP_REJECTED are in 1 tab
    // cy.get('[data-cy=question-leftLungs1]').should('not.exist');
  });
  it(' Check rejected info under image stack and in carousel modal rejected notif tooltip', () => {
    // wait for question to move status
    cy.wait(3000);
    cy.get('[data-cy=NOT_AVAILABLE_REJECTED]').click().trigger('mouseout');
    cy.get('[data-cy=question-leftLungs1]').realHover().click();
    cy.get('[data-cy=Rejected-status] [data-cy=title-Rejected]').contains('Rejected');
    cy.get('[data-cy=Rejected-status] [data-cy=desc-Rejected]').contains('other reason left lungs');
    cy.get('[data-cy=Rejected-status] [data-cy=name-Rejected]').contains('Akyrian Admin');
    cy.get('[data-cy=Rejected-status] [data-cy=role-Rejected]').contains(
      '(Akyrian People, University of Tokyo Hospital)',
    );

    cy.get('[data-cy=img-front-mulSiteSourceCapture1Dup1]').click();
    cy.get('[data-cy=Rejected-Reason]').trigger('mouseover');
    cy.get('.ant-tooltip-inner [data-cy=Rejected-status] [data-cy=title-Rejected]').contains(
      'Rejected',
    );
    cy.get('.ant-tooltip-inner [data-cy=Rejected-status] [data-cy=desc-Rejected]').contains(
      'other reason left lungs',
    );
    cy.get('.ant-tooltip-inner [data-cy=Rejected-status] [data-cy=name-Rejected]').contains(
      'Akyrian Admin',
    );
    cy.get('.ant-tooltip-inner [data-cy=Rejected-status] [data-cy=role-Rejected]').contains(
      '(Akyrian People, University of Tokyo Hospital)',
    );
    cy.get('[data-cy=carousel-close] > path').click();
  });
});
