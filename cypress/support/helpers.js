export function recursiveScrollCheck(scrollAmount, item) {
    cy.get('body').then(($body) => {
      if ($body.find(`[data-cy="streamline-dropdown-data-entry-question-option-${item}"]`).length) {
        cy.get(`[data-cy="streamline-dropdown-data-entry-question-option-${item}"]`).click();
      } else {
        cy.scrollTo(0, scrollAmount);
        cy.wait(500);
        recursiveScrollCheck(scrollAmount + 100, item);
      }
    });
  }