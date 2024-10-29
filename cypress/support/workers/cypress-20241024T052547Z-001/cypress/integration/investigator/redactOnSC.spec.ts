import { mockUserDataInvestigator } from '../../../src/constant/testFixtures';

describe('Redaction Tool on question that bypass verifier flow', () => {
  const redaction = {
    x: 270,
    y: 50,
    x2: 320,
    y2: 100,
  };

  before(() => {
    cy.reseedDB();
    cy.fillInloginAsFormV2(mockUserDataInvestigator);
    cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/all-visits');
    cy.waitForReact();
  });

  it('Expand Image and create redaction, Done button should be enabled and should enable user to submit', () => {
    cy.clickQuickAction(
      `[data-cy=question-card-receptor1]`,
      `[data-cy=redact-action-receptor1]`,
      undefined,
      undefined,
      'SVG',
    );
    cy.drawSingleRect(redaction);
    cy.get('[data-cy=done-snippet-button]').click();
    cy.get('[data-cy=alert-success]', { timeout: 20000 })
      .should('exist')
      .should('have.text', 'Source Capture successfully updated');
  });
});
