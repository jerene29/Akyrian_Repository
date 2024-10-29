Cypress.Commands.add('multipleChoiceInput', () => {
  it('Submit button is disabled if input is not selected yet', () => {
    cy.get('[data-cy=submit-data-entry]').should('be.disabled');
  })

  it('Select multiple choice', () => {
    cy.get('[data-cy=textfield-container-answer-input-field-sideEffectVac1-0-0]').first().click({ force: true }).type('{downarrow}{enter}{downarrow}{enter}');
    cy.get('[data-cy=monitor-flow-body]').first().click({ force: true, multiple: true });
  })

  it('Should have 2 choices', () => {
    cy.get('[data-cy=musclePain1]').should('exist')
    cy.get('[data-cy=stomachAche1]').should('exist')
  })

  it('Delete Choice by clicking remove icon inside choice pill', () => {
    cy.get('[data-cy=remove-choice]').first().click({ force: true, multiple: true })
  })

  it('Submit button should enabled after select minimal one answer', () => {
    cy.get('[data-cy=submit-data-entry]').should('be.enabled')
  })

  it('Clear multiple choices answers by clicking reset icon', () => {
    cy.get('[data-cy=cancel-button-sideEffects1]').first().click({ force: true });
  })

  it('Submit button should disabled if selected answers is cleared', () => {
    cy.get('[data-cy=submit-data-entry]').should('be.disabled')
  })

  it('Select multiple choice with search type in', () => {
    cy.get('[data-cy=textfield-container-answer-input-field-sideEffectVac1-0-0]').first().click().type('Fe{enter}{backspace}{backspace}Chi{enter}{backspace}{backspace}{backspace}')
    cy.get('[data-cy=monitor-flow-body]').first().click({ force: true, multiple: true });
  })

  it('Submit button should enabled after select answer again', () => {
    cy.get('[data-cy=submit-data-entry]').should('be.enabled')
  })

  it('Delete multiple choice answer with backspace', () => {
    cy.get('[data-cy=textfield-container-answer-input-field-sideEffectVac1-0-0]').first().click().type('{backspace}{backspace}');
    cy.get('[data-cy=monitor-flow-body]').first().click({ force: true, multiple: true });
  })
})