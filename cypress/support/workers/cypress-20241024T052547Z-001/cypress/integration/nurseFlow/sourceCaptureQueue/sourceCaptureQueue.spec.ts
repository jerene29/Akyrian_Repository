import {
  GetVisitDetailsDocument,
  GetVisitDetailSourceCaptureDocument,
  ISourceCapture,
  IWithSourceForm,
} from '../../../../src/graphQL/generated/graphql';

describe('Display Source Capture Queue and its interaction', () => {
  let sourceData: IWithSourceForm;
  let sourceCaptureQueues: Array<ISourceCapture>;
  let sourceCaptureQueueCount = 0;

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

    cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit1Visit1');
    cy.wait(`@${aliasVisitDetail}`).then((res) => {
      sourceData = res.response?.body.data.visitDetails.withSourceForm;
      sourceCaptureQueues = sourceData?.sourceCaptures.filter(
        (sc) => !sc?.formFieldGroupResponses.length,
      );
      sourceCaptureQueueCount = sourceCaptureQueues?.length;
    });
    cy.waitForReact();
    cy.get('[data-cy=sourceQuestionTab]').click();
  });

  describe('Upload new source capture', () => {
    it('Create unverified source capture with Continue Later button', () => {
      cy.get('[data-cy=todoCard-captureButton]').should('exist').first().click();
      cy.get('[data-cy=screenshot-sc-button]').should('be.visible');
      cy.get('[data-cy=upload-sc-button]').should('be.visible');
      cy.uploadFile('EMR-kylong.png');
      cy.uploadRedaction('unverified', false);
      cy.get('[data-cy=manual-redact-button]').click();
      cy.get('[data-cy=start-redact-or-continue]').should('be.visible');
      cy.get('[data-cy=continue-to-suggestion-button]').click();
      cy.get('[data-cy=confirm-redact-button]').should('be.visible').click();
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasVisitDetailSourceCapture) {
          req.alias = req.body.operationName;
        }
      });
      cy.wait(`@${aliasVisitDetailSourceCapture}`).then((res) => {
        sourceData = res.response?.body.data.visitDetails.withSourceForm;
        sourceCaptureQueues = sourceData?.sourceCaptures.filter(
          (sc) => !sc?.formFieldGroupResponses.length,
        );
        sourceCaptureQueueCount = sourceCaptureQueues?.length;
      });
      cy.get('[data-cy=milestone-popup-continuelater-button-Snippet]').should('be.visible').click();
      cy.get('[data-cy=todolist-text-queue]').contains(
        `Source Capture Queue (${++sourceCaptureQueueCount})`,
      );
    });

    it('Create unverified source capture with Okay button', () => {
      cy.get('[data-cy=todoCard-captureButton]').should('exist').first().click();
      cy.get('[data-cy=screenshot-sc-button]').should('be.visible');
      cy.get('[data-cy=upload-sc-button]').should('be.visible');
      cy.uploadFile('EMR-kylong.png');
      cy.uploadRedaction('unverified', false);
      cy.get('[data-cy=manual-redact-button]').click();
      cy.get('[data-cy=start-redact-or-continue]').should('be.visible');
      cy.get('[data-cy=continue-to-suggestion-button]').click();
      cy.get('[data-cy=confirm-redact-button]').should('be.visible').click();
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasVisitDetailSourceCapture) {
          req.alias = req.body.operationName;
        }
      });
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasVisitDetail) {
          req.alias = req.body.operationName;
        }
      });
      cy.wait(`@${aliasVisitDetailSourceCapture}`).then((res) => {
        sourceData = res.response?.body.data.visitDetails.withSourceForm;
        sourceCaptureQueues = sourceData?.sourceCaptures.filter(
          (sc) => !sc?.formFieldGroupResponses.length,
        );
        sourceCaptureQueueCount = sourceCaptureQueues?.length;
      });
      cy.get('[data-cy=sc-okay-button]').should('be.visible').click();
      cy.waitForCanvasToLoad();
      cy.wait(`@${aliasVisitDetail}`).then((res) => {
        sourceData = res.response?.body.data.visitDetails.withSourceForm;
        sourceCaptureQueues = sourceData?.sourceCaptures.filter(
          (sc) => !sc?.formFieldGroupResponses.length,
        );
        sourceCaptureQueueCount = sourceCaptureQueues?.length;
      });
      cy.exitStreamlineCanvasModal();
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasVisitDetail) {
          req.alias = req.body.operationName;
        }
      });
      cy.wait(`@${aliasVisitDetail}`).then((res) => {
        sourceData = res.response?.body.data.visitDetails.withSourceForm;
        sourceCaptureQueues = sourceData?.sourceCaptures.filter(
          (sc) => !sc?.formFieldGroupResponses.length,
        );
        sourceCaptureQueueCount = sourceCaptureQueues?.length;
      });
      cy.get('[data-cy=todolist-text-queue]').contains(
        `Source Capture Queue (${sourceCaptureQueueCount})`, // Remove ++ because sourceCaptureQueueCount is updated on aliasVisitDetail
      );
    });
  });

  describe('Source capture queues entry points', () => {
    afterEach(() => {
      cy.get('[data-cy=back-to-scq').click();
    });
    it('Check the entry points from ToDo list banner', () => {
      cy.get('[data-cy=todolist-text-queue]').click();
      cy.get('[data-cy=sc-queue-main-container]').should('exist');
    });
    it('Check the entry points from stacked SC queue card Rejected tabs', () => {
      cy.get('[data-cy=UNATTACHED]').click().trigger('mouseout');
      cy.get('[data-cy=streamline-sc-queue-card]').click();
      cy.get('[data-cy=sc-queue-main-container]').should('exist');
    });
  });

  describe('Source capture actions', () => {
    it('Check if continue button bring to canvas screen', () => {
      cy.get('[data-cy=todolist-text-queue]').click();
      cy.get(`[data-cy=bottom-section-${sourceCaptureQueues[0].id}]`)
        .realHover()
        .find('.queue-card-continue-btn')
        .click();
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasVisitDetail) {
          req.alias = req.body.operationName;
        }
      });
      cy.waitForCanvasToLoad();
      cy.exitStreamlineCanvasModal(); // This discarding the queue
      cy.wait(`@${aliasVisitDetail}`).then((res) => {
        sourceData = res.response?.body.data.visitDetails.withSourceForm;
        sourceCaptureQueues = sourceData?.sourceCaptures.filter(
          (sc) => !sc?.formFieldGroupResponses.length,
        );
        sourceCaptureQueueCount = sourceCaptureQueues?.length;
      });
    });

    it('Create queue (1)', () => {
      cy.get('[data-cy=todoCard-captureButton]').should('exist').first().click();
      cy.get('[data-cy=screenshot-sc-button]').should('be.visible');
      cy.get('[data-cy=upload-sc-button]').should('be.visible');
      cy.uploadFile('EMR-kylong.png');
      cy.uploadRedaction('unverified', false);
      cy.get('[data-cy=manual-redact-button]').click();
      cy.get('[data-cy=start-redact-or-continue]').should('be.visible');
      cy.get('[data-cy=continue-to-suggestion-button]').click();
      cy.get('[data-cy=confirm-redact-button]').should('be.visible').click();
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasVisitDetailSourceCapture) {
          req.alias = req.body.operationName;
        }
      });
      cy.wait(`@${aliasVisitDetailSourceCapture}`).then((res) => {
        sourceData = res.response?.body.data.visitDetails.withSourceForm;
        sourceCaptureQueues = sourceData?.sourceCaptures.filter(
          (sc) => !sc?.formFieldGroupResponses.length,
        );
        sourceCaptureQueueCount = sourceCaptureQueues?.length;
      });
      cy.get('[data-cy=milestone-popup-continuelater-button-Snippet]').should('be.visible').click();
      cy.get('[data-cy=todolist-text-queue]').contains(
        `Source Capture Queue (${++sourceCaptureQueueCount})`,
      );
    });
    it('Create queue (2)', () => {
      cy.get('[data-cy=todoCard-captureButton]').should('exist').first().click();
      cy.get('[data-cy=screenshot-sc-button]').should('be.visible');
      cy.get('[data-cy=upload-sc-button]').should('be.visible');
      cy.uploadFile('EMR-kylong.png');
      cy.uploadRedaction('unverified', false);
      cy.get('[data-cy=manual-redact-button]').click();
      cy.get('[data-cy=start-redact-or-continue]').should('be.visible');
      cy.get('[data-cy=continue-to-suggestion-button]').click();
      cy.get('[data-cy=confirm-redact-button]').should('be.visible').click();
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasVisitDetailSourceCapture) {
          req.alias = req.body.operationName;
        }
      });
      cy.wait(`@${aliasVisitDetailSourceCapture}`).then((res) => {
        sourceData = res.response?.body.data.visitDetails.withSourceForm;
        sourceCaptureQueues = sourceData?.sourceCaptures.filter(
          (sc) => !sc?.formFieldGroupResponses.length,
        );
        sourceCaptureQueueCount = sourceCaptureQueues?.length;
      });
      cy.get('[data-cy=milestone-popup-continuelater-button-Snippet]').should('be.visible').click();
      cy.get('[data-cy=todolist-text-queue]').contains(
        `Source Capture Queue (${++sourceCaptureQueueCount})`,
      );
    });

    it('Test rename the source capture queue, should shows success alert ', () => {
      cy.get('[data-cy=todolist-text-queue]').click();
      const newName = sourceCaptureQueues[0].displayName + 'newName';
      cy.get(`[data-cy=bottom-section-${sourceCaptureQueues[0].id}]`)
        .realHover()
        .find(`[data-cy=input-text-sc-name-${sourceCaptureQueues[0].id}]`)
        .click();

      cy.get(`[data-cy=input-text-sc-name-${sourceCaptureQueues[0].id}]`).type(`${newName}{enter}`);
      cy.get('[data-cy=alert-success]').should('exist');
    });

    it('Test rename the source capture queue  with wrong format, should shows error alert', () => {
      cy.get(`[data-cy=bottom-section-${sourceCaptureQueues[0].id}]`)
        .realHover()
        .find(`[data-cy=input-text-sc-name-${sourceCaptureQueues[0].id}]`)
        .click();

      cy.get(`[data-cy=input-text-sc-name-${sourceCaptureQueues[0].id}]`).type(`#%+_{enter}`);
      cy.get('[data-cy=invalid-input]').should('exist');
      cy.get(`[data-cy=input-text-sc-name-${sourceCaptureQueues[0].id}]`).type(
        `{backspace}{backspace}{backspace}{backspace}{enter}`,
      );
    });

    it('Test sorting by addition date', () => {
      cy.get('[data-cy=sc-queue-select]').click().type('{enter}');
      cy.get('.sc-queue-display-name').first().contains(sourceCaptureQueues[0].displayName);
    });

    it('Test sorting alphabetically', () => {
      cy.get('[data-cy=sc-queue-select]').click().type('{downArrow}{enter}');
      cy.get('.sc-queue-display-name').first().contains(sourceCaptureQueues[1].displayName);
    });

    it('Check render unverified tag for unverified SC', () => {
      sourceCaptureQueues?.forEach((sc) => {
        if (!sc.isVerified) {
          cy.get(`[data-cy=bottom-section-${sc.id}]`)
            .find('[data-cy=unverified-tag]')
            .should('exist');
        }
      });
    });
  });

  describe('Source capture deletion', () => {
    it('Clicking trash icon, then cancel in modal will NOT move the SC from top to bottom section', () => {
      cy.get(`[data-cy=bottom-section-${sourceCaptureQueues[0].id}]`)
        .realHover()
        .find(`[data-cy=scq-delete-${sourceCaptureQueues[0].id}]`)
        .click();
      cy.get('[data-cy=sc-queue-delete-modal]')
        .should('exist')
        .find('[data-cy=confirmModal-cancelButton]')
        .click();
      cy.get('[data-cy=sc-queue-main-container]')
        .find(`[data-cy=queue-card-${sourceCaptureQueues[0].id}]`)
        .should('exist');
      cy.wait(5000);
      cy.get(`[data-cy=queue-card-${sourceCaptureQueues[0].id}]`).matchImageSnapshot({
        failureThreshold: 10,
        failureThresholdType: 'percent',
      });
    });

    it('Clicking trash icon, then confirm in modal will move the SC from top to bottom section', () => {
      cy.get(`[data-cy=bottom-section-${sourceCaptureQueues[0].id}]`)
        .realHover()
        .find(`[data-cy=scq-delete-${sourceCaptureQueues[0].id}]`)
        .click();
      cy.get('[data-cy=sc-queue-delete-modal]')
        .should('exist')
        .find('[data-cy=confirmModal-confirmButton]')
        .click();
      cy.get('[data-cy=sc-queue-deleted-container]')
        .find(`[data-cy=queue-card-${sourceCaptureQueues[0].id}]`)
        .should('exist');
      cy.wait(5000);
      cy.getSnapshot(`[data-cy=queue-card-${sourceCaptureQueues[0].id}]`);
    });

    it('Checking SC Queue retain period. It must be 30 days since its deleted', () => {
      cy.get(`[data-cy=bottom-section-${sourceCaptureQueues[0].id}]`)
        .realHover()
        .find(`[data-cy=scq-recover-${sourceCaptureQueues[0].id}]`)
        .contains('Recover (30 days)');
    });

    it('Checking if recover deleted source capture is working', () => {
      cy.get(`[data-cy=bottom-section-${sourceCaptureQueues[0].id}]`)
        .realHover()
        .find(`[data-cy=scq-recover-${sourceCaptureQueues[0].id}]`)
        .click();
      cy.get('[data-cy=alert-success]').should('exist');
      cy.get('[data-cy=sc-queue-deleted-container]')
        .find(`[data-cy=queue-card-${sourceCaptureQueues[0].id}]`)
        .should('not.exist');
      cy.get('[data-cy=sc-queue-main-container]')
        .find(`[data-cy=queue-card-${sourceCaptureQueues[0].id}]`)
        .should('exist');
    });
  });

  describe.skip('Source capture queue known issue test', () => {
    // when it comes from another source capture it should not retain the milestone counter to the SCQ #3413201107
    it('Check if the milestone counter gets resetted when it comes from another source capture', () => {
      cy.getVisitDetailAndGoToSCTab(
        aliasVisitDetail,
        '/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit1Visit1',
      );
      cy.goToStatusAndOpenSnippetQuickAction('MARKED_UP', 'lungs1');
      cy.checkStreamlineMilestoneCounter({ type: 'snippet', targetValue: '6/12' });
      cy.checkStreamlineMilestoneCounter({ type: 'data-entry', targetValue: '0/6' });
      cy.clickCancelStreamline();
      cy.exitCanvasPage();

      cy.get('[data-cy=todolist-text-queue]').click();
      cy.get(`[data-cy=bottom-section-${sourceCaptureQueues[1].id}]`).realHover();
      cy.get(`[data-cy=bottom-section-${sourceCaptureQueues[0].id}]`)
        .realHover()
        .find('.queue-card-continue-btn')
        .click();
      cy.waitForCanvasToLoad();
      cy.checkStreamlineMilestoneCounter({ type: 'snippet', targetValue: '0/6' });
      cy.checkStreamlineMilestoneCounter({ type: 'data-entry', targetValue: '0/0' });
      cy.exitStreamlineCanvasModal();
    });
  });
});
