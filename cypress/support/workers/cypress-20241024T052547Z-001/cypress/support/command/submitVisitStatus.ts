import { ISubmitVisitStatusMutationVariables } from '../../../src/graphQL/generated/graphql';

Cypress.Commands.add('defaultStartVisitForm', () => {
  cy.get('[data-cy=select-visit-status]').should('have.value', '');
  cy.get('[data-cy=button-submit-visit]').should('have.disabled');
});

Cypress.Commands.add(
  'fillAndStartVisitForm',
  (submitVisitStatusData: ISubmitVisitStatusMutationVariables, clickArrow = true) => {
    const submitVisitStatusDataForm = cy.get('#start-visit-form');
    submitVisitStatusDataForm.within(() => {
      cy.get('[data-cy=select-visit-status]').type('{enter}');
      cy.get('.oneline').then((el) => {
        if (el.find('#add-visit-select-site').length > 0) {
          cy.get('#add-visit-select-site').type('{downarrow}${enter}');
        }

        cy.fillInTodayForDateDropdown();
      });
    });
    cy.wrap(clickArrow).then(() => {
      if (clickArrow) {
        cy.get('[data-cy=button-submit-visit]').should('have.enabled');
        cy.get('.sidebar-toggle-arrow').click({ force: true });
      }
    });
  },
);

Cypress.Commands.add(
  'fillAndStartVisitFormNotOccured',
  (submitVisitStatusData: ISubmitVisitStatusMutationVariables) => {
    const submitVisitStatusDataForm = cy.get('#start-visit-form');
    submitVisitStatusDataForm.within(() => {
      cy.get('[data-cy=select-visit-status]').type('{downarrow}{enter}');
      cy.get('#select-visit-not-occured')
        .click({ force: true })
        .type('{downarrow}{downarrow}{downarrow}{downarrow}{enter}', { force: true })
        .type(`${submitVisitStatusData.other}{enter}`);
    });
    cy.get('[data-cy=button-submit-visit]').should('have.enabled').click({ force: true });
    cy.get('.sidebar-toggle-arrow').click({ force: true });
  },
);
