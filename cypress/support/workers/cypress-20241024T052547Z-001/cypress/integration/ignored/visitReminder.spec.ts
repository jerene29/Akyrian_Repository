describe('Visit Reminder', () => {
  before(() => {
    cy.visit('/visit/ckl9malch0155doqqt2hnaft9/ckl9mamo91934doqqz3j1l8o0/ckl9mamwl1986doqqt20kntqh');
    cy.waitForReact();
  });
  
  // work only assume seed data with above id is not with reminder
  it('Add visit reminder', () => {
    cy.get('.reminder-select').click({ force: true })// click & enter automatically select first value
      .type('{enter}');

    cy.get('#submit-reminder').click({ force: true });
  });
 
  it('Edit visit reminder', () => {
    cy.get('#edit-reminder-btn').click({ force: true });
    cy.get('.reminder-select').click({ force: true })// click & enter automatically select first value
      .type('{enter}');

    cy.get('#submit-reminder').click({ force: true });
  });
 
});