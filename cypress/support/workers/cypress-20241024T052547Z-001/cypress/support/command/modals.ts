Cypress.Commands.add('checkModalHeader', (title: string) => {
  cy.get('[data-cy=modal-title]').should('have.text', title)
  cy.get('[data-cy=modal-icon]').should('exist')
})