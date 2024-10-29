import { IVisitTemplateType } from '../../../src/graphQL/generated/graphql';

Cypress.Commands.add('openSideBarShowVisit', () => {
  cy.get('.sidebar-toggle-arrow').click();
});

Cypress.Commands.add('fillInAddAdHocForm', () => {
  const name = 'addVisit';
  cy.multiSelect({ field: 'year', name });
  cy.multiSelect({ field: 'month', name });
  cy.multiSelect({ field: 'date', name });

  cy.get('#add-ad-hoc-visit-form').within(() => {
    cy.get('.add-visit-select-type').click().type('{enter}');

    cy.get('.add-visit-select-site').click().type('{enter}');
    cy.get('.ant-select-selection-item');
  });

  cy.get('#btn-submit-add-visit').should('have.enabled');
});

Cypress.Commands.add('submitAddAdHocForm', () => {
  cy.get('#btn-submit-add-visit').click({ force: true });
  cy.get('#btn-submit-add-visit').within(() => {
    cy.get('span[aria-label="loading"]');
  });
  cy.get('#btn-cancel-add-visit').should('have.disabled');
  cy.waitForReact();
  cy.get('[data-cy=alert-success]').contains('New Visit has been added');
  cy.get('.progress-visit-text').contains('Adhoc Visit');
  cy.get('.adhoc-label').contains('Ad-hoc Visit');
});

Cypress.Commands.add('renderAdHocModal', () => {
  cy.get('#add-visit-modal-button').scrollIntoView().should('be.visible');
  cy.get('#add-visit-modal-button').click();

  cy.get('#add-ad-hoc-visit-form').should('be.visible');
  cy.get('[data-cy=select-year-addVisit]').should('be.visible');
  cy.get('[data-cy=select-month-addVisit]').should('be.visible');
  cy.get('[data-cy=select-date-addVisit]').should('be.visible');
  cy.get('input[id="add-visit-select"]').should('have.value', '');

  cy.get('#btn-submit-add-visit').should('have.disabled');
  cy.get('#btn-cancel-add-visit').should('have.enabled');
});

Cypress.Commands.add('checkVisitInModal', (visit) => {
  cy.get(`[data-cy=study-setting-card-list-name-${visit.id}]`)
    .should('exist')
    .contains(`${visit.name}`);
  const visitType = visit.type === IVisitTemplateType.Scheduled ? 'Scheduled' : 'Ad-hoc';

  cy.get(`[data-cy=visit-type-${visit.id}]`).should('exist').contains(`${visitType} Visit`);
  if (visit.type !== IVisitTemplateType.AdHoc) {
    cy.get(`[data-cy=beforeWindow-${visit.id}]`)
      .should('exist')
      .contains(`D-${visit.visitBeforeWindow} Days`);
    cy.get(`[data-cy=afterWindow-${visit.id}]`)
      .should('exist')
      .contains(`D-${visit.visitAfterWindow} Days`);
    cy.get(`[data-cy=dayOffset-${visit.id}]`)
      .should('exist')
      .contains(
        visit.dayOffset === 0 ? 'Anchor Visit' : `${visit.dayOffset} days after Anchor Visit`,
      );
  }
  cy.get(`[data-cy=total-forms-${visit.id}]`).should('exist').contains(`${visit.countForm} Forms`);
  cy.get(`[data-cy=total-questions-${visit.id}`)
    .should('exist')
    .contains(`${visit.countFFG} Questions`);
  if (visit?.parents?.length > 0) {
    cy.wrap(visit.parents).each((parent) => {
      cy.get(`[data-cy=visit-parent-${parent.fieldId}`)
        .should('exist')
        .contains(`${parent.fieldQuestion}`);
    });
  }
  cy.get(`[data-cy=edit-card-${visit.id}]`).should('exist');
});
