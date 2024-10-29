
/*
This file contains cypress tests covering specs T-22-002 and UDT-22-002
*/

import {
  GetPatientListDocument,
  GetVisitListDocument,
  GetVisitDetailsDocument,
  IFieldGroupVisitDetail,
  IWithSourceForm,
  GetVisitDetailSourceCaptureDocument,
} from '../../src/graphQL/generated/graphql';

import 'cypress-localstorage-commands';
import 'cypress-real-events';

describe.skip('Minimap', () => {
  let visitDetails: IWithSourceForm = {} as IWithSourceForm;

  let unattachedFGs: IFieldGroupVisitDetail[] = [];

  const aliasGetPatient =
    'name' in GetPatientListDocument.definitions[0]
      ? GetPatientListDocument.definitions[0].name?.value
      : 'GetPatientList';
  const aliasGetVisit =
    'name' in GetVisitListDocument.definitions[0]
      ? GetVisitListDocument.definitions[0].name?.value
      : 'GetVisitList';
  const aliasGetVisitDetailSC =
    'name' in GetVisitDetailsDocument.definitions[0]
      ? GetVisitDetailsDocument.definitions[0].name?.value
      : 'GetVisitDetails';
  const aliasVisitDetailSourceCapture =
    'name' in GetVisitDetailSourceCaptureDocument.definitions[0]
      ? GetVisitDetailSourceCaptureDocument.definitions[0].name?.value
      : 'GetVisitDetailSourceCapture';
  const aliasVisitDetail =
    'name' in GetVisitDetailsDocument.definitions[0]
      ? GetVisitDetailsDocument.definitions[0].name?.value
      : 'GetVisitDetails';

  before(() => {
    cy.clearLocalStorageSnapshot();
    cy.reseedDB();
    cy.fillInloginAsFormV2({
      email: 'streamlinesc@example.com',
    });
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasGetVisitDetailSC) {
        req.alias = req.body.operationName;
      }
      if (req.body.operationName === aliasGetPatient) {
        req.alias = req.body.operationName;
      }
      if (req.body.operationName === aliasGetVisit) {
        req.alias = req.body.operationName;
      }
    });
    cy.visit('/visit/testRevisionId1/bellevueHospital1/kylieMatulich/visit1VisitKYM');
    cy.wait(`@${aliasGetPatient}`);
    cy.wait(`@${aliasGetVisit}`);
    cy.wait(`@${aliasGetVisitDetailSC}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        visitDetails = result.response.body.data.visitDetails.withSourceForm;
        unattachedFGs = visitDetails.fieldGroups
          ?.filter(
            (FG: IFieldGroupVisitDetail) => FG.formFieldGroupResponse?.status === 'UNATTACHED',
          )
          .sort((a, b) => {
            if (a.id > b.id) {
              return 1;
            }
            if (a.id < b.id) {
              return -1;
            }
            return 0;
          });
      }
    });
    // navigate to the desired tab (Source Capture Questions)
    cy.waitForReact();
    cy.get('[data-cy=sourceQuestionTab').click();
  });

  describe('Manual redaction', {
    "retries": 1
  }, 
  () => {
    it('Uploading pdf', () => {
      cy.get('[data-cy=todoCard-captureButton]').should('exist').first().click();
      cy.uploadFile('multipage2.pdf');
      cy.get('[data-cy=confirmModal-cancelButton]', { timeout: 40000 }).click();
      cy.get('[data-cy=manual-redact-button]').should('be.visible').click();
      cy.get('[data-cy=start-redact-or-continue]').should('be.visible');
    });

    it('Doing manual redaction before drawing a rectangle', () => {
      cy.get('[data-cy=start-redacting-button]').click();
      cy.drawSingleRect({
        x: 50,
        y: 50,
        x2: 200,
        y2: 200,
      });
      cy.wait(1000);
      cy.get('[data-cy=redaction-complete-button]').click();
      cy.get('[data-cy=confirm-redact-button]', { timeout: 10000 }).should('be.visible').click();
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasVisitDetailSourceCapture) {
          req.alias = req.body.operationName;
        }
      });
      cy.wait(`@${aliasVisitDetailSourceCapture}`);
      cy.get('[data-cy=sc-okay-button]').should('be.visible').click();
      cy.waitForCanvasToLoad();
      cy.wait(1000);
      cy.getSnapshot('[data-cy=canvas-content]', {
        failureThreshold: 0.15,
        failureThresholdType: 'percent',
      });
    });

    it('Get snapshot of the minimap as well', function () {
      cy.wait(100);
      cy.getSnapshot('[data-cy=minimap-container]', {
        failureThreshold: 0.1,
        failureThresholdType: 'percent',
      });
      //close the view to setup retries
      cy.get('[data-cy=capture-modal-close-icon]').click();
      cy.get('[data-cy=confirmModal-confirmButton]').click();
    });
  });

  describe('Snippet creation and reduction', () => {

    it('Uploading pdf', () => {
      cy.get('[data-cy=todoCard-captureButton]').should('exist').first().click();
      cy.uploadFile('multipage2.pdf');
      cy.get('[data-cy=confirmModal-cancelButton]', { timeout: 40000 }).click();
      cy.get('[data-cy=manual-redact-button]').should('be.visible').click();
      cy.get('[data-cy=start-redact-or-continue]').should('be.visible');
    });

    it('Doing manual redaction before drawing a rectangle', () => {
      cy.get('[data-cy=start-redacting-button]').click();
      cy.drawSingleRect({
        x: 50,
        y: 50,
        x2: 200,
        y2: 200,
      });
      cy.wait(1000);
      cy.get('[data-cy=redaction-complete-button]').click();
      cy.get('[data-cy=confirm-redact-button]', { timeout: 10000 }).should('be.visible').click();
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasVisitDetailSourceCapture) {
          req.alias = req.body.operationName;
        }
      });
      cy.wait(`@${aliasVisitDetailSourceCapture}`);
      cy.get('[data-cy=sc-okay-button]').should('be.visible').click();
      cy.waitForCanvasToLoad();
    });

    it('Verify that the minimap image updates with a black square corresponding to redaction area', function () {
      cy.get('[data-cy=right-chip-Brain]', { timeout: 10000 }).click();
      cy.wait(2000);
      cy.getSnapshot('[data-cy=capture-snippet-container]', {
        failureThreshold: 0.1,
        failureThresholdType: 'percent',
      });
    });

    it('Adds snippet shortcut after snippets creation', function () {
      cy.get('[data-cy=textfield-container-answer-input-field-ffBrainCon1-0-0]', {
        timeout: 1000,
      }).type('Exists');
      cy.get('[data-cy=streamline-save-data-entry]').click();

      //Check for newly created snippet is present on bottom chip
      cy.get('[data-cy=bottom-chip-Brain]', { timeout: 30000 }).should('be.visible');
      cy.wait(100);
    });

    it('Edit snippets', function () {
      cy.get('[data-cy=bottom-chip-edit-Brain]').click();
      cy.get('[data-cy=textfield-container-answer-input-field-ffBrainCon1-0-0]', {
        timeout: 1000,
      }).type('Yes');
      cy.get('[data-cy=edit-reason-select-brain1]', { timeout: 5000 }).click();
      cy.get('[data-cy=select-container] > .ant-select > .ant-select-selector')
        .click()
        .type('{enter}');
      cy.get('[data-cy=streamline-save-data-entry]').click();
      cy.get('[data-cy=bottom-chip-Brain]', { timeout: 30000 }).should('be.visible');
    });
    it('Delete snippets', function () {
      //deletion of snippets
      cy.get('[data-cy=bottom-chip-delete-Brain]').click(); //delete button
      cy.get('[data-cy=detach-snippet-reason-select] > .ant-select > .ant-select-selector')
        .click()
        .type('{enter}');
      cy.get('[data-cy=submit-detach-snippet-reason]').click();
      //close the canvas
      cy.get('[data-cy=capture-modal-close-icon]').click();
      cy.get('[data-cy=confirmModal-confirmButton]').click();
    });
  });

  describe('Test Minimaps existence', () => {
    it('Minimap should be visible', () => {
      cy.clickQuickAction(
        `[data-cy=question-card-${unattachedFGs[0].id}]`,
        `[data-cy=capture-action-${unattachedFGs[0].id}]`,
      );

      cy.uploadFile('multipage2.pdf');
      cy.get('[data-cy=confirmModal-cancelButton]', { timeout: 40000 }).click();
      cy.get('[data-cy=minimap-container]', { timeout: 10000 }).should('be.visible');
      cy.wait(500);
      cy.getSnapshot('[data-cy=minimap-container]', {
        failureThreshold: 0.1,
        failureThresholdType: 'percent',
      });
      //close the view
      cy.get('[data-cy=capture-modal-close-icon]').click();
      cy.get('[data-cy=confirmModal-confirmButton]').click();
      //this wait here is nessessary because the browser needs to properly render the page
    });
  });

  describe('Interacting with minimap Scrollbar', () => {

    it('Uploading pdf', () => {
      cy.clickQuickAction(
        `[data-cy=question-card-${unattachedFGs[0].id}]`,
        `[data-cy=capture-action-${unattachedFGs[0].id}]`,
      );
      cy.get('.ant-tooltip').invoke('attr', 'style', 'display: none');

      cy.uploadFile('multipage2.pdf');
      cy.get('[data-cy=confirmModal-cancelButton]', { timeout: 40000 }).click();

      cy.get('[data-cy=minimap-container]', { timeout: 30000 }).should('be.visible');
    });

    it('Clicking on lower right corner to make scrollbar jump down and take a snapshot to validate it.', () => {
      cy.get('[data-cy=minimap-container]', { timeout: 30000 }).click('bottomRight');
      cy.wait(500);
      cy.getSnapshot('[data-cy=minimap-container]', {
        failureThreshold: 0.1,
        failureThresholdType: 'percent',
      });
    });

    it('Clicking on upper right corner to make scrollbar jump up and take a snapshot to validate it.', () => {
      cy.get('[data-cy=minimap-container]', { timeout: 30000 })
        .click('topRight');
      cy.wait(500);
      cy.getSnapshot('[data-cy=minimap-container]', {
        failureThreshold: 0.1,
        failureThresholdType: 'percent',
      });
    });
    it('Dragging the Scrollbar by mouse', () => {
      cy.get('[data-cy=minimap-container]')
        .realMouseDown({ position: 'topRight' })
        .realMouseMove(200, 0)
        .realMouseUp();
      //'close the window'
      cy.wait(200);
      cy.getSnapshot('[data-cy=minimap-container]', {
        failureThreshold: 0.1,
        failureThresholdType: 'percent',
      });
      cy.get('[data-cy=capture-modal-close-icon]').click();
      cy.get('[data-cy=confirmModal-confirmButton]').click();
    });
  });

  describe('Interacting with minimap view box', () => {
    it('Minimap view box is on the top looking at the beginning of pdf', () => {
      cy.clickQuickAction(
        `[data-cy=question-card-${unattachedFGs[0].id}]`,
        `[data-cy=capture-action-${unattachedFGs[0].id}]`,
      );
      cy.get('.ant-tooltip').invoke('attr', 'style', 'display: none');
      cy.uploadFile('multipage2.pdf');
      cy.get('[data-cy=confirmModal-cancelButton]', { timeout: 40000 }).click();

      cy.get('[data-cy=minimap-container]', { timeout: 40000 }).should('be.visible');
    });
    it('Click in the center of the minimap and  take screenshot.', () => {
      cy.get('[data-cy=minimap-container]', { timeout: 30000 }).click('center');
      cy.wait(500);
      cy.getSnapshot('[data-cy=capture-snippet-container]', {
        failureThreshold: 0.1,
        failureThresholdType: 'percent',
      });
    });
    it('Click down from the center and  take screenshot.', () => {
      cy.get('[data-cy=minimap-container]', { timeout: 30000 }).click('bottom');
      cy.wait(500);
      cy.getSnapshot('[data-cy=capture-snippet-container]', {
        failureThreshold: 0.1,
        failureThresholdType: 'percent',
      });
    });

    it('Supports Mousewheel interaction', () => {
      for (let i = 0; i < 15; i++) {
        cy.get('[data-cy=minimap-container]').trigger('wheel', { deltaY: -50 });
      }
      cy.wait(500);
      cy.getSnapshot('[data-cy=capture-snippet-container]', {
        failureThreshold: 0.1,
        failureThresholdType: 'percent',
      });
    });

    it('Supports dragging of the view box', () => {
      for (let i = 1; i < 6; i++) {
        const mouse_motion = i * 100;
        cy.get('[data-cy=minimap-container]')
          .realMouseDown()
          .realMouseMove(mouse_motion, 0)
          .realMouseUp();
        cy.wait(500);
      }
      cy.wait(500);
      cy.getSnapshot('[data-cy=capture-snippet-container]', {
        failureThreshold: 0.1,
        failureThresholdType: 'percent',
      });

      //Close the window
      cy.get('[data-cy=capture-modal-close-icon]').click();
      cy.get('[data-cy=confirmModal-confirmButton]').click();
    });
  });

  describe('Interacting with main canvas and checking minimap synchronization', () => {
    it('Uploading pdf', () => {
      cy.clickQuickAction(
        `[data-cy=question-card-${unattachedFGs[0].id}]`,
        `[data-cy=capture-action-${unattachedFGs[0].id}]`,
      );

      cy.get('.ant-tooltip').invoke('attr', 'style', 'display: none');

      cy.uploadFile('multipage2.pdf');
      cy.get('[data-cy=confirmModal-cancelButton]', { timeout: 30000 }).click();

      cy.get('[data-cy=canvas-container]', { timeout: 30000 }).should('be.visible');
    });

    describe('Clicking on zoom controls should zoom in and out the picture as well as minimap view box.', () => {
      it('Zoom in at 25% increment', () => {
        cy.get('[data-cy=ZoomIn-icon]').click();
        cy.wait(500);
        cy.getSnapshot('[data-cy=capture-snippet-container]', {
          failureThreshold: 0.1,
          failureThresholdType: 'percent',
        });
      });
      it('Zoom out at 25% increment', () => {
        cy.get('[data-cy=ZoomOut-icon]').click();
        cy.wait(500);
        cy.getSnapshot('[data-cy=capture-snippet-container]', {
          failureThreshold: 0.1,
          failureThresholdType: 'percent',
        });
      });

      it('Verify that Zoom in icon is grayed out when zoomed to 200%', () => {
        for (let i = 0; i < 4; i++) cy.get('[data-cy=ZoomIn-icon]').click();
        cy.wait(500);
        cy.getSnapshot('[data-cy=capture-snippet-container]', {
          failureThreshold: 0.1,
          failureThresholdType: 'percent',
        });
        cy.get('[data-cy=ZoomIn] > p.sc-hKFxyN').should('have.css', 'color', 'rgb(134, 137, 168)');
      });
      
      it('Verify that Zoom out icon is grayed out when zoomed on 25%', () => {
        for (let i = 0; i < 7; i++) cy.get('[data-cy=ZoomOut-icon]').click();
        cy.wait(500);
        cy.get('[data-cy=ZoomOut] > p.sc-hKFxyN').should('have.css', 'color', 'rgb(134, 137, 168)');

        //Tear down
        cy.get('[data-cy=capture-modal-close-icon]').click();
        cy.get('[data-cy=confirmModal-confirmButton]').click();
      });
    });

    describe('Mouse simulation.', () => {
      it('Uploading pdf', () => {
        cy.clickQuickAction(
          `[data-cy=question-card-${unattachedFGs[0].id}]`,
          `[data-cy=capture-action-${unattachedFGs[0].id}]`,
        );
        cy.get('.ant-tooltip').invoke('attr', 'style', 'display: none');
        cy.uploadFile('multipage2.pdf');
        cy.get('[data-cy=confirmModal-cancelButton]', { timeout: 40000 }).click();
        cy.get('[data-cy=minimap-container]', { timeout: 30000 }).should('be.visible');
      });
  
      it('Move Mousewheel down to scroll canvas down.', () => {
        cy.get('[data-cy=canvas-container]').trigger('wheel', { deltaY: 40 });
        cy.wait(100);
        cy.getSnapshot('[data-cy=capture-snippet-container]', {
          failureThreshold: 0.1,
          failureThresholdType: 'percent',
        });
      });

      it('Move mousewheel up to scroll canvas up', () => {
        cy.get('[data-cy=canvas-container]').trigger('wheel', { deltaY: -25 });
        cy.wait(500);
        cy.getSnapshot('[data-cy=capture-snippet-container]', {
          failureThreshold: 0.1,
          failureThresholdType: 'percent',
        });
      });

      it('Check that Dragging the canvas container works.', () => {
        for (let i = 0; i < 6; i++) {
          cy.get('[data-cy=canvas-container]')
            .realMouseDown({ position: 'center' })
            .realMouseMove(200, 0)
            .realMouseUp();
          cy.wait(500);
        }
        cy.getSnapshot('[data-cy=capture-snippet-container]', {
          failureThreshold: 0.1,
          failureThresholdType: 'percent',
        });

        //Close the window
        cy.get('[data-cy=capture-modal-close-icon]').click();
        cy.get('[data-cy=confirmModal-confirmButton]').click();
      });
    });
  });
});
