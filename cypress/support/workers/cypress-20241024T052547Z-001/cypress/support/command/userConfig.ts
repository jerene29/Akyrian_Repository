const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/;
Cypress.on('uncaught:exception', (err) => {
  /* returning false here prevents Cypress from failing the test */
  if (resizeObserverLoopErrRe.test(err.message)) {
    return false;
  }
});

Cypress.Commands.add('loginAndAcceptPlatformPrivacy', (email) => {
  cy.fillInloginAsFormV2(
    {
      email,
    },
    'studyTestId1',
    'testRevisionId1',
    'study-question',
    true,
  );
});
