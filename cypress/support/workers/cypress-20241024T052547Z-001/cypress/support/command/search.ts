
  Cypress.Commands.add('typeSearch', (value) => {
        cy.get('.right').eq(0).click()
        cy.get('input[name="search"]').should('have.value', '').type(value)
  });

  Cypress.Commands.add('getCurrentAndTotalQuestions', (current, total) => {
    cy.get('[data-cy=question-card]').should('have.length', current)
    cy.get('[data-cy=all-filter]').contains(total).click()
    cy.get('[data-cy=question-card]').should('have.length', total)
  })

  Cypress.Commands.add('getSearchResult', (current,filteredCurrent, filteredTotal, total, isInvestigator = false) => {
    cy.get(`[data-cy=${!isInvestigator ?'question-card' : 'card-investigator'}]`).should('have.length', current)
    cy.get('[data-cy=total-question]').should('have.text', `Result: ${filteredCurrent} out of ${filteredTotal} Questions`)
    cy.get('[data-cy=all-filter]').contains(filteredCurrent).click()
    cy.get(`[data-cy=${!isInvestigator ?'question-card' : 'card-investigator'}]`).should('have.length', filteredCurrent)
    cy.get('[data-cy=total-question]').should('have.text', `Result: ${filteredCurrent} out of ${total} Questions`)
  })
  