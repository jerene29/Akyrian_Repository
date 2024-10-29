import {
  GetVisitDetailsDocument,
  GetVisitDetailSourceCaptureDocument,
} from '../../../src/graphQL/generated/graphql';
import { recursiveScrollCheck } from '../../support/command/streamline';

const snippetRegion = {
  x: 0,
  y: 250,
  x2: 400,
  y2: 400,
};
describe('Streamline and redaction bug test', () => {
  const aliasVisitDetailSourceCapture =
    'name' in GetVisitDetailSourceCaptureDocument.definitions[0]
      ? GetVisitDetailSourceCaptureDocument.definitions[0].name?.value
      : 'GetVisitDetailSourceCapture';
  const aliasVisitDetail =
    'name' in GetVisitDetailsDocument.definitions[0]
      ? GetVisitDetailsDocument.definitions[0].name?.value
      : 'GetVisitDetails';
  before(() => {
    cy.reseedDB();
    cy.fillInloginAsFormV2({
      email: 'streamlinesc@example.com',
    });

    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasVisitDetailSourceCapture) {
        req.alias = req.body.operationName;
      }
      if (req.body.operationName === aliasVisitDetail) {
        req.alias = req.body.operationName;
      }
    });

    cy.visit('/visit/testRevisionId1/bellevueHospital1/kylieMatulich/visit1VisitKYM');
    cy.wait(`@${aliasVisitDetail}`);
    cy.waitForReact();
    cy.get('[data-cy=sourceQuestionTab]').click();
  });

  describe('Upload verified SC will not showing no name found for next unverified upload', () => {
    it('Upload Verified SC', () => {
      cy.get('[data-cy=todoCard-captureButton]').should('exist').first().click();
      cy.get('[data-cy=screenshot-sc-button]').should('be.visible');
      cy.get('[data-cy=upload-sc-button]').should('be.visible');
      cy.uploadFile('EMR-kylie.jpg');
      cy.uploadRedaction('verified', false);
      cy.get('[data-cy=continue-to-suggestion-button]').click();
      cy.get('[data-cy=confirm-redact-button]').should('be.visible').click();
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasVisitDetailSourceCapture) {
          req.alias = req.body.operationName;
        }
      });
      cy.wait(`@${aliasVisitDetailSourceCapture}`, { timeout: 65000 });
      cy.get('[data-cy=milestone-popup-continuelater-button-Snippet]').should('be.visible').click();
    });
    it('Upload Unverified SC should not showing no name found modal', () => {
      cy.get('[data-cy=todoCard-captureButton]').should('exist').first().click();
      cy.get('[data-cy=screenshot-sc-button]').should('be.visible');
      cy.get('[data-cy=upload-sc-button]').should('be.visible');
      cy.uploadFile('EMR-kylong.png');
      cy.uploadRedaction('unverified', false);
      cy.get('[data-cy=manual-redact-button]').should('be.visible').click();
      cy.get('[data-cy=start-redact-or-continue]').should('be.visible');
    });
  });

  describe.skip('Manual redaction', () => {
    it('Doing manual redaction before affidavit should not showing blue rectangle after confirming it', () => {
      cy.get('[data-cy=start-redacting-button]').click();
      cy.drawSingleRect({
        x: 50,
        y: 50,
        x2: 200,
        y2: 200,
      });
      cy.get('[data-cy=redaction-complete-button]').click();
      cy.get('[data-cy=confirm-redact-button]').should('be.visible').click();
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasVisitDetailSourceCapture) {
          req.alias = req.body.operationName;
        }
      });
      cy.wait(`@${aliasVisitDetailSourceCapture}`);
      cy.get('[data-cy=sc-okay-button]').should('be.visible').click();
      cy.waitForCanvasToLoad();
      cy.getSnapshot('[data-cy=canvas-content]');
    });

    it('Doing manual redaction on streamline canvas will upload create new redaction after click next', () => {
      cy.drawSingleRect(snippetRegion);
      cy.get('[data-cy=streamline-dropdown-data-entry-question]').should('be.visible').click();
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(2000);
      recursiveScrollCheck(0, 'Lungs');
      cy.get(`[data-cy=streamline-dropdown-data-entry-question-option-Lungs]`)
        .should('be.visible')
        .click();
      cy.get(`[data-cy='streamline-save-data-entry']`).should('be.visible').click();
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasVisitDetailSourceCapture) {
          req.alias = req.body.operationName;
        }
      });
      cy.wait(`@${aliasVisitDetailSourceCapture}`);
      cy.get(`[data-cy=streamline-edit-data-entry]`).should('be.visible');
      cy.clickCanvasTools('Redaction');
      cy.drawSingleRect({
        x: 350,
        y: 0,
        x2: 450,
        y2: 100,
      });
      cy.get('[data-cy=next-bottom-chips-menu]').click();
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasVisitDetailSourceCapture) {
          req.alias = req.body.operationName;
        }
      });
      cy.wait(`@${aliasVisitDetailSourceCapture}`, { timeout: 65000 });
      cy.get('[data-cy=back-to-canvas-bottom-chips-menu]', { timeout: 30000 }).click();
      cy.getSnapshot('[data-cy=canvas-content]');
    });
  });

  describe.skip('Snippet cache and suggestion', () => {
    it('Check if the suggestion and expand snippet image exist', () => {
      cy.get('[data-cy=bottom-chip-Lungs]').click();
      cy.get(`[data-cy=streamline-edit-data-entry]`).should('be.visible').click();
      cy.get(`[data-cy=ocr-suggestion]`).should('be.visible');
      // Waiting for image snippet cache completly uploaded
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(5000);
      cy.get(`[data-cy=toggle-streamline-de-expand-icon]`).should('be.visible').click();
      // Waiting for image snippet to load
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(3000);
      cy.get('[data-cy=modal-snippet] [src*=SNIPPET]');
      cy.getSnapshot(`[data-cy=modal-snippet]`, {
        failureThreshold: 0.1,
        failureThresholdType: 'percent',
      });
    });
    it('Move the snippet and check the snippet cache change in expand modal', () => {
      cy.get('[data-cy=DEForm-inside-modal-back-compact-view-button-extended]').should('be.visible').click();
      cy.draggingRect(snippetRegion, { x: 300, y: 275 }, undefined, undefined, true, true);
      // Waiting for image snippet cache completly uploaded
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(5000);
      cy.get(`[data-cy=toggle-streamline-de-expand-icon]`).should('be.visible').click();
      // Waiting for image snippet to load
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(3000);
      cy.get('[data-cy=modal-snippet] [src*=SNIPPET]');
    });
    it('Canceling update snippet wont update snippet cache in review your work', () => {
      cy.get(`[data-cy=streamline-close-data-entry-extended]`).should('be.visible').click();
      cy.get('[data-cy=next-bottom-chips-menu]').click();
      cy.get('[data-cy=modal-snippet] [src*=SNIPPET]');
    });
  });
});
