describe('Invitation Expired', () => {
  let emailInviter = '';
  const replaceText = (text: any) => {
    const textResult = text.replace(' ', '%20');
    return textResult;
  };
  let fixtureData = {} as any;
  before(() => {
    cy.clearAuthCookies();
    cy.visit(`${Cypress.env('REACT_APP_BASE_URL')}/invitation-expired/admin@example.com`);
    cy.fixture('auth.json').then(value => {
      fixtureData = value.invitationExpired;
    });
    cy.url().then(url => {
      emailInviter = url.split('/')[4];
    });
  });

  it('page is visible', () => {
    cy.wrap(fixtureData).then(() => {
      cy.get('[data-cy=title]').should('have.text', fixtureData.title);
      cy.get('[data-cy=body]').should('have.text', fixtureData.body);
      cy.get('[data-cy=contact-button]').should('not.be.disabled')
      cy.get('.mailto').should('have.attr', 'href', `mailto:${emailInviter}?subject=${replaceText(fixtureData.subject)}&body=${replaceText(fixtureData.bodyEmail)}`);
    })
  });
});