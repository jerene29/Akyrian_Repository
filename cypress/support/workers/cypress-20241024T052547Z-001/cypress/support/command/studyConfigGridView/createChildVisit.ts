export function createChildVisit({ visitName = '' }) {
  cy.get('[data-cy=stickyAddButton-visit]').click();
  cy.get('[data-cy=visitName').click().type(visitName);
  cy.dropdownSelect({ name: 'selectVisitType', downAmount: 1 });
  cy.get('#button-add-visit').click();
}
