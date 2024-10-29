import { IVisitTemplateCreateInput } from "graphQL/generated/graphql";

export type VisitInputType = {
  dayOffsetFromPreviousVisit?: number | string;
  visitBeforeWindow?: number | string;
  visitAfterWindow?: number | string;
  visitName?: string;
  isFirstVisit?: boolean;
};

Cypress.Commands.add('fillAddVisitConfiguration', (params: VisitInputType) => {
  if (params.dayOffsetFromPreviousVisit !== '') {
    cy.get('[data-cy=dayOffsetFromPreviousVisit]')
      .should('not.be.disabled')
      .type(`${ params.dayOffsetFromPreviousVisit }`);
  }
  if (params.visitBeforeWindow !== '') {
    cy.get('[data-cy=visitBeforeWindow]')
      .should('not.be.disabled')
      .type(`${ params.visitBeforeWindow }`);
  }
  if (params.visitAfterWindow !== '') {
    cy.get('[data-cy=visitAfterWindow]')
      .should('not.be.disabled')
      .type(`${ params.visitAfterWindow }`);
  }
});

Cypress.Commands.add('fillEditVisitConfiguration', (params: VisitInputType) => {
  cy.get("body").then($body => {
    if (params.visitName && params.visitName !== '') {
      cy.get('[data-cy=visit-name]').type(`${ params.visitName }`);
    } else if ($body.find('[data-cy=visit-name]').length > 0) {
      cy.get('[data-cy=visit-name]').clear();
    }
    if (params.dayOffsetFromPreviousVisit && params.dayOffsetFromPreviousVisit !== '') {
      cy.get('[data-cy=dayOffsetFromPreviousVisit]').type(`${ params.dayOffsetFromPreviousVisit }`);
    } else if ($body.find('[data-cy=dayOffsetFromPreviousVisit]').length > 0) {
      cy.get('[data-cy=dayOffsetFromPreviousVisit]').clear();
    }
    if (params.visitBeforeWindow && params.visitBeforeWindow !== '') {
      cy.get('[data-cy=visitBeforeWindow]').type(`${ params.visitBeforeWindow }`);
    } else if ($body.find('[data-cy=visitBeforeWindow]').length > 0) {
      cy.get('[data-cy=visitBeforeWindow]').clear();
    }
    if (params.visitAfterWindow && params.visitAfterWindow !== '') {
      cy.get('[data-cy=visitAfterWindow]').type(`${ params.visitAfterWindow }`);
    } else if ($body.find('[data-cy=visitAfterWindow]').length > 0) {
      cy.get('[data-cy=visitAfterWindow]').clear();
    }
  });
});

Cypress.Commands.add('fillAddVisitOrFormNumber', (amount: number) => {
  cy.get('[data-cy=modal-add_visitform]').type(`${ amount }`);
  cy.react('ModalAddVisitComp').get('[data-cy=submit]').click();
});