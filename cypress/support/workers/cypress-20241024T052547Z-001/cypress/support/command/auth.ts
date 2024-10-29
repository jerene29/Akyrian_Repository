import client from '../../utils/client';

Cypress.Commands.add('beforeSetup', (userData: any) => {
  cy.clearLocalStorage();
  cy.clearLocalStorageSnapshot();
  cy.reseedDB();
  cy.fillInloginAsFormV2({
    ...userData,
  });
});

Cypress.Commands.add('clearSetPasswordForm', () => {
  cy.get('input[name="password"]').should('have.value', '');
  cy.get('input[name="confirmPassword"]').should('have.value', '');
  cy.get('[data-cy=login-button]').should('be.disabled');
});

// Fill in the password form and if the password dont match, validate the login button and invalid input
Cypress.Commands.add('fillSetPasswordForm', (values) => {
  const sameValue = values.password === values.confirmPassword;
  cy.get('input[name="password"]').type(`${values.password}`);
  cy.get('input[name="confirmPassword"]').type(`${values.confirmPassword}`);
  if (!sameValue) {
    cy.get('[data-cy=login-button]').should('be.disabled');
    cy.get('input[name="confirmPassword"]').blur();
    cy.get('[data-cy=invalid-input]').should('be.visible');
    cy.get('[data-cy=invalid-input]').contains('match');
  }
});

Cypress.Commands.add('checkCount', (count) => {
  if (count) {
    cy.get('[data-cy=card-study-sidebar]').should('have.length', count);
  } else {
    cy.get('[data-cy=card-study-sidebar]').should('not.exist');
  }
});

Cypress.Commands.add('getStudyListSidebar', (document, category) => {
  client
    .mutate({
      mutation: document,
      variables: {
        category: category,
        isNurseFlow: true,
      },
    })
    .then((res) => {
      if (res.data && res.data.studyCollection) {
        const { studyCollection } = res.data;
        return studyCollection;
      }
    })
    .catch((err) => {
      throw err;
    });
});
