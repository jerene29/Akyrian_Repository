import { OperationDefinitionNode } from 'graphql';
import 'cypress-localstorage-commands';
import {
  GetVisitDetailsDocument,
  AddPatientDocument,
  GetVisitDetailSourceCaptureDocument,
  ISourceCapture,
  IVisitDetails,
  ISuggestionFormField,
  IMarkUpRegion,
  IFormFieldGroupResponseStatus,
  GetPatientListDocument,
} from '../../../src/graphQL/generated/graphql';
// Will needed for edit snippet
import { snippetSCPosition } from '../../support/command/streamline';

const redaction = {
  x: 270,
  y: 180,
  x2: 320,
  y2: 230,
};

const redactionPosition = {
  x: 120,
  y: 180,
  x2: 200,
  y2: 190,
};

const multiSnippet = [
  {
    x: 200,
    y: 180,
    x2: 250,
    y2: 230,
  },
  {
    x: 220,
    y: 260,
    x2: 270,
    y2: 310,
  },
  {
    x: 190,
    y: 330,
    x2: 250,
    y2: 380,
  },
];

const singleSnippet = {
  x: 50,
  y: 180,
  x2: 100,
  y2: 230,
};

const singleSnippet2 = {
  x: 200,
  y: 180,
  x2: 250,
  y2: 250,
};

describe('Streamline SC', () => {
  let sourceCaptureQueues: Array<ISourceCapture> = [];
  let sourceCaptureSuggestions: Array<ISuggestionFormField> = [];
  const visitDetailDefinitions = GetVisitDetailsDocument.definitions[0] as OperationDefinitionNode;

  const aliasVisitDetailSourceCapture =
    'name' in GetVisitDetailSourceCaptureDocument.definitions[0]
      ? GetVisitDetailSourceCaptureDocument.definitions[0].name?.value
      : 'GetVisitDetailSourceCapture';

  const patientListDefinition = GetPatientListDocument.definitions[0] as OperationDefinitionNode;

  const aliasVisitDetails = visitDetailDefinitions.name?.value;
  const aliasPatientList = patientListDefinition.name?.value;

  before(() => {
    cy.reseedDB();
    cy.fillInloginAsFormV2({
      email: 'streamlinesc@example.com',
    });
    cy.fixture('detachReattachAndAttachSC.json').then((value) => {
      sourceCaptureSuggestions = value.streamlineSuggestionSC.data.sourceCaptureSuggestions
        .suggestionFormField as Array<ISuggestionFormField>;
    });
  });

  describe('Edit Rejected DE FFGR Markup', () => {
    it('Rejected chip should stay on rejected section when there is no changes', () => {
      // #3474397722
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasVisitDetails) {
          req.alias = req.body.operationName;
        }
        if (req.body.operationName === aliasPatientList) {
          req.alias = req.body.operationName;
        }
      });
      cy.waitForReact();
      cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit1Visit1');
      cy.wait(`@${aliasPatientList}`);
      cy.wait(`@${aliasVisitDetails}`, { timeout: 70000 }).then((res) => {
        const visitDetailRes: IVisitDetails = res.response?.body.data?.visitDetails;
        const filteredFFGR = visitDetailRes.withSourceForm.fieldGroups.filter(
          ({ formFieldGroupResponse }) =>
            formFieldGroupResponse?.status === IFormFieldGroupResponseStatus.RejectedDataEntry,
        )[0];
        cy.get('[data-cy=sourceQuestionTab]').click();
        cy.get('[data-cy=NOT_AVAILABLE_REJECTED]').click().trigger('mouseout');
        cy.clickQuickAction(
          `[data-cy=question-card-${filteredFFGR.id}]`,
          `[data-cy=edit-data-entry-action-${filteredFFGR.id}]`,
        );
        cy.monitorFlowModaIsVisible();
        const secondRect = {
          x: 50,
          y: 50,
          x2: 100,
          y2: 100,
        };
        cy.drawSingleRect(secondRect, 'top-left', true);
        cy.clickXIcon(secondRect, 'snippet', true);
        cy.get('[data-cy=rejected-right-section-scroll-shadow]').contains('Spinal Cord');
      });
    });
  });

  // In case need to add new patient
  describe('Add new patient for streamline flow', () => {
    before(() => {
      cy.visit('/visit/testRevisionId1');
      cy.waitForReact();
    });

    let patientID = '';
    const aliasAddPatient =
      'name' in AddPatientDocument.definitions[0]
        ? AddPatientDocument.definitions[0].name?.value
        : 'AddPatient';
    const autoFilled = () => {
      const makeid = (length = 0, type: 'alphabet' | 'sex' | 'month' | 'years' | 'number') => {
        const result: Array<string> = [];
        const alphabeth = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const month = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'June',
          'July',
          'Aug',
          'Sept',
          'Oct',
          'Nov',
          'Dec',
        ];
        const numbers = '0123456789';
        const sex = ['MALE', 'INTERSEX', 'FEMALE'];
        for (let i = 0; i < length; i++) {
          result.push(
            type === 'alphabet'
              ? alphabeth.charAt(Math.floor(Math.random() * alphabeth.length))
              : type === 'sex'
              ? sex[Math.floor(Math.random() * sex.length)]
              : type === 'month'
              ? month[Math.floor(Math.random() * month.length)]
              : type === 'years'
              ? numbers.charAt(Math.floor(Math.random() * 2))
              : numbers.charAt(Math.floor(Math.random() * numbers.length)),
          );
        }
        return result.join('');
      };

      const generate = {
        firstNameInitial: 'Kylie',
        middleNameInitial: '',
        lastNameInitial: 'Matulich',
        patientStudyId: `${makeid(3, 'alphabet')}-${makeid(3, 'number')}${makeid(3, 'alphabet')}`,
        site: 'Bellevue Hospital',
        dob: new Date(1990, 10, 10),
        sex: `${makeid(1, 'sex')}`,
      };

      return generate;
    };

    it('fill and submit patient form success', () => {
      cy.waitForReact();
      cy.get('[data-cy=button-start-visit]').should('contain', 'Start');
      cy.defaultAddPatientForm();
      const generate = autoFilled();
      cy.fillInAddPatientForm(generate, true, false);
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasAddPatient) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('#button-submit-add-patient').click();
      cy.react('Button', {
        props: {
          id: 'button-submit-add-patient',
          loading: true,
        },
      });
      cy.wait(`@${aliasAddPatient}`).then((res) => {
        if (res) {
          patientID = res.response?.body.data.addPatient.patient.id;
          // visitID = res.response?.body.data.addPatient.patient.visitId;
          cy.react('Button', {
            props: {
              id: 'button-submit-add-patient',
              loading: false,
            },
          });
          cy.react('Modal', {
            props: {
              id: 'modal-add-patient',
              visible: false,
            },
          });
          cy.addPatientForStreamline({ patientID });
        }
      });
    });
  });

  describe('Streamline SC Upload Test', () => {
    before(() => {
      cy.getVisitDetailAndGoToSCTab(
        aliasVisitDetails,
        '/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit1Visit1',
      );
    });
    // Test open upload from 3 place: TodoCard, Floating Capture & Quick Action Button
    it('Open Streamline SC Upload Flow', () => {
      /**
       * Open Streamline SC Flow
       * - go to visit detail and open with source tab
       * - test open streamline sc flow on capture button and quick action (might need to make as a command since this can be a repeatable action)
       */
      cy.testModalCapture('TODO_CARD_BUTTON');
      cy.testModalCapture('FLOATING_BUTTON');
      cy.testModalCapture('QCARD_QUICK_ACTION');
      cy.waitForReact();
    });

    // Test upload image and restart the flow to check the milestone progress
    it('Test Upload & Milestone progress', () => {
      /**
       * Start Upload and Redaction
       * - upload image and after completed check if milestone is progressing (might need to use dummy data and intercept the upload mutation and make command)
       * - click capture SC again button and check if milestone is back to the start
       */
      cy.openSCFlow();
      cy.uploadSCImage();
      cy.checkUploadMilestoneProgress('IN_PROGRESS');
      cy.closeModalCapture();
      cy.openSCFlow();
      cy.checkUploadMilestoneProgress('NO_PROGRESS');
      cy.get('[data-cy=modal-close-icon]').should('be.visible').click();
    });

    // Test upload image and use the suggestion redaction button
    it('Manual Redaction and click continue to suggestion button', () => {
      /**
       * Manual Redaction and click continue to suggestion button
       * - click manual redaction button
       * - click continue to suggestion button and expect you're almost done popup is visible and then close modal
       */
      cy.openSCFlow();
      cy.uploadSCImage();
      cy.useRedactSuggestionStreamline();
      cy.closeModalCapture();
    });

    // Test upload image and use the suggestion redaction button, then continue later & check on SC queue
    it('Test Upload & Continue Later', () => {
      /**
       * Start Upload and Redaction
       * - upload image and after completed check if milestone is progressing (might need to use dummy data and intercept the upload mutation and make command)
       * - click capture SC again button and check if milestone is back to the start
       */
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasVisitDetailSourceCapture) {
          req.alias = req.body.operationName;
        }
      });
      cy.openSCFlow();
      cy.uploadSCImage();
      cy.useRedactSuggestionStreamline();
      cy.get('[data-cy=confirm-or-redact-again-menu]').should('be.visible');
      cy.get('[data-cy=confirm-redact-button]').should('be.visible').click();
      cy.wait(`@${aliasVisitDetailSourceCapture}`, { timeout: 65000 }).then((res) => {
        const visitDetailRes: IVisitDetails = res.response?.body.data?.visitDetails;
        sourceCaptureQueues = visitDetailRes.withSourceForm?.sourceCaptures.filter(
          (sc) => !sc?.formFieldGroupResponses.length,
        );
      });
      cy.get('[data-cy=milestone-popup-continuelater-button-Snippet]').should('be.visible').click();
      // Needed to wait for the loading indicator
      // Can't use waitForCanvas, so use the button to disappear instead.
      cy.get('[data-cy=sc-okay-button]', {
        timeout: 65000,
      }).should('not.exist');
    });
    it('Should check the source capture queue data', () => {
      cy.checkSCQueueExist(sourceCaptureQueues[0]?.id);
    });
  });

  describe.skip('Streamline SC Snippet & Data Entry Flow', () => {
    before(() => {
      cy.getVisitDetailAndGoToSCTab(
        aliasVisitDetails,
        '/visit/testRevisionId1/bellevueHospital1/kylieMatulich/visit1VisitKYM',
      );
    });
    it('Manual Redaction', () => {
      /**
       * Manual Redaction
       * - open quick action (might need to make as a command since this can be a repeatable action)
       * - upload image and after completed check if milestone is progressing (might need to use dummy data and intercept the upload mutation and make command)
       * - click manual redaction button
       * - click start redaction
       * - do redaction and continue
       */
      cy.openSCFlow();
      cy.uploadSCImage();
      cy.get('[data-cy=start-redacting-button]').should('be.visible').click();
      cy.drawSingleRect(redactionPosition);
      cy.get('[data-cy=redaction-complete-button]').should('be.visible').click();
      cy.get('[data-cy=milestone-almostdone-popover]').should('be.visible');
    });
    // Test opening canvas for SC Snippet & DE Flow
    it('Open canvas for snippet & data entry', () => {
      cy.confirmRedactionRedirectToSuggestion('confirm', true, true);
      cy.get('[data-cy=canvas-content]', { timeout: 60000 }).should('be.visible');
    });

    it('Check every canvas tools', () => {
      cy.get('[data-cy=Snippet-icon-selected]').should('exist');
      cy.clickCanvasTools('ZoomIn');
      cy.get('[data-cy=ZoomIn-icon]').should('exist');
      cy.clickCanvasTools('ZoomOut');
      cy.get('[data-cy=ZoomOut-icon]').should('exist');
      cy.clickCanvasTools('Redaction');
      cy.get('[data-cy=Redaction-icon-selected]').should('exist');
      cy.clickCanvasTools('ZoomOut');
      cy.get('[data-cy=ZoomOut-icon]').should('exist');
      cy.clickCanvasTools('Grab');
      cy.get('[data-cy=Grab-icon-selected]').should('exist');
      cy.clickCanvasTools('Snippet');
      cy.get('[data-cy=Snippet-icon-selected]').should('exist');
    });

    /** @see https://app.clickup.com/t/26422098/DEV-3027 */
    it('Check after change question should show the new input form', () => {
      cy.drawSingleRect(singleSnippet2);
      cy.get('[data-cy=streamline-dropdown-data-entry-question]').should('exist').type(`{enter}`);
      cy.DEInputFormExist('VaccineName');
      cy.wait(3000);
      cy.get('[data-cy=streamline-dropdown-data-entry-question]').type(`{downarrow}{enter}`);
      cy.DEInputFormExist('Temperature');
      cy.clickCancelStreamline();
    });

    /** @see https://app.clickup.com/t/26422098/DEV-3021 */
    it('Change question should not create a double highlight in the floating bar chips', () => {
      cy.clickChipInFloatingBar('Temperature');
      cy.get('[data-cy=streamline-dropdown-data-entry-question]')
        .should('exist')
        .type(`{downarrow}{enter}`);
      cy.DEInputFormExist('Height');
      cy.flotingBarChipIsHiglighted('Temperature', false);
      cy.flotingBarChipIsHiglighted('Height', true);
      cy.clickCancelStreamline();
    });

    it('After Click Clear Field, error inline message should not shown (Height)', () => {
      cy.clickChipInFloatingBar('Height', 2000);
      cy.addDEInputForm('Height', 'test');
      cy.get('[data-cy=invalid-input]').should('contain', 'Enter a whole number');
      cy.get('[data-cy=clear-de-field]').click();
      cy.get('[data-cy=invalid-input]').should('not.exist');
      // wait for de intermittent reposition
      cy.wait(3000);
      cy.clickCancelStreamline();
    });

    it('Save Snippet & Data Entry Abdomen', () => {
      cy.removeTooltipIfVisible();
      cy.clickCanvasTools('ZoomOut');
      cy.snippetAndDataEntryStreamlineSC({
        OCRName: 'Abdomen',
        isHotspot: false,
      });
      cy.clickAddDEOrEditButton();
      cy.addDEInputForm('Abdomen', '100');
      cy.get('[data-cy=streamline-save-data-entry]').should('be.visible').click();
      cy.get('[data-cy=next-bottom-chips-menu]').click();
      cy.get('[data-cy=done-review-your-work-bottom-chips-menu]').click();
      cy.reload();
    });

    it('Check Save Button When Snippet/DE changed & Validate Length of Reason', () => {
      cy.get('[data-cy=sourceQuestionTab]').click();
      cy.get('[data-cy=FILLED]').click();
      cy.clickQuickAction(
        '[data-cy=question-abdomen1]',
        '[data-cy=edit-snippet-de-action-abdomen1]',
        undefined,
        undefined,
        'SVG',
      );
      cy.monitorFlowModaIsVisible();
      cy.addDEInputForm('Abdomen', '1001');
      cy.get('[data-cy=edit-reason-select-abdomen1]')
        .should('exist')
        .click()
        .type(`{downarrow}{enter}`);
      cy.get('[data-cy=edit-reason-select-abdomen1]').type('1234');
      cy.get('[data-cy=streamline-save-data-entry]').should('be.disabled');
      cy.get('[data-cy=edit-reason-select-abdomen1]').type('5');
      cy.get('[data-cy=streamline-save-data-entry]').should('not.be.disabled');
      cy.clickCancelStreamline();
      // At this point, there is some weird case from cypress
      // so i need to click next first then clicking again Back To Canvas
      cy.get('[data-cy=next-bottom-chips-menu]').click();
      cy.get('[data-cy=back-to-canvas-bottom-chips-menu]').click();
    });

    it('Previous Answer Modal Should Not Shown', () => {
      cy.clickCanvasTools('Snippet');
      cy.get('[data-cy=ZoomOut]').realHover();
      cy.wait(200);
      cy.removeTooltipIfVisible();
      cy.drawSingleRect(singleSnippet);
      cy.get('[data-cy=question-answers]').should('not.exist');
      cy.removeTooltipIfVisible();
      cy.get('[data-cy=streamline-dropdown-data-entry-question]').should('exist').click();
      cy.selectLabelFromCanvasDropdown('Respiration rate');
      cy.clickCancelStreamline();
      cy.clickBottomChip('Abdomen');
      cy.get('[data-cy=bottom-chip-Abdomen]').realHover();
      cy.removeChipFromBottomSection('Abdomen', 'delete', true);
      cy.exitCanvasPage(true);
      cy.reload();
      cy.get('[data-cy=sourceQuestionTab]').click();
      cy.openSCFlow();
      cy.uploadSCImage();
      cy.get('[data-cy=start-redacting-button]').should('be.visible').click();
      cy.drawSingleRect(redactionPosition);
      cy.get('[data-cy=redaction-complete-button]').should('be.visible').click();
      cy.get('[data-cy=milestone-almostdone-popover]').should('be.visible');
      cy.confirmRedactionRedirectToSuggestion('confirm', true, true);
      cy.get('[data-cy=canvas-content]', { timeout: 60000 }).should('be.visible');
    });

    // #3401011871
    it('Click the chip in floating bar section and click x icon inside the canvas should not prompt a backdrop discard your work (Vaccine Name)', () => {
      cy.clickChipInFloatingBar('VaccineName', 2000);
      // snippet DE form & floating bar chip should have the same color #3367689776
      cy.chipAndSnippetShouldHaveTheSameColor('VaccineName');
      const vaccineName = sourceCaptureSuggestions.find(
        (suggestion) => suggestion.shortQuestion === 'Vaccine Name',
      );
      const firstVaccineHotspotDetectedRegion = vaccineName?.detectedRegions[0];
      const removeSnippetFromCanvas = (
        region: IMarkUpRegion | undefined,
        isCancelButton = false,
      ) => {
        if (region) {
          const { x, y, h, w } = region;
          if (isCancelButton) {
            cy.clickCancelStreamline();
          } else {
            cy.clickXIcon(
              {
                x: x - 25,
                y: y - 75,
                x2: x - 25 + w,
                y2: y - 75 + h,
              },
              'snippet',
              true,
            );
          }
          cy.wait(1000);
        }
      };
      removeSnippetFromCanvas(firstVaccineHotspotDetectedRegion);
      cy.get('.floating-bar-info').should('not.be.visible');
      cy.clickChipInFloatingBar('VaccineName', 2000);
      cy.get('[data-cy=confirmation-modal-title').should('not.exist');
      removeSnippetFromCanvas(firstVaccineHotspotDetectedRegion, true);
    });

    // #3428231863
    it('Create a manual snippet, pick a label from dropdown and click x icon inside the canvas should not prompt a backdrop discard your work (Muscle)', () => {
      cy.addSnippet('Muscle', true);
      cy.clickXIcon(snippetSCPosition['Muscle'], 'snippet', true);
      cy.clickChipInFloatingBar('Muscle', 2000);
      cy.get('[data-cy=confirmation-modal-title').should('not.exist');
    });

    // #3308969418
    it('Create a manual snippet, pick a label from dropdown and click once inside the canvas should not remove the DE form (Muscle)', () => {
      cy.addSnippet('Muscle', true);
      cy.get('[data-cy=canvas-container] canvas')
        .trigger('mousedown', { x: 100, y: 100, force: true })
        .realMouseUp();
      cy.getDEModalContainer().should('exist');
      cy.clickCancelStreamline();
    });

    // #3362067005
    it('Click hotspot in canvas should make the snippet editable, remove opacity, and hide all the OCR hotspots in canvas (Weight)', () => {
      const weight = sourceCaptureSuggestions.find(
        (suggestion) => suggestion.shortQuestion === 'Weight',
      );
      const x = Math.round(weight?.detectedRegions[0].x / 1.6) + 20;
      const y = Math.round(weight?.detectedRegions[0].y / 1.6) - 110;
      cy.get('[data-cy=canvas-container] canvas')
        .trigger('mousemove', {
          x,
          y,
          isPrimary: true,
          force: true,
        })
        .wait(100)
        .trigger('mousedown', {
          x,
          y,
          isPrimary: true,
          force: true,
        })
        .wait(100)
        .trigger('mouseup', {
          x,
          y,
          isPrimary: true,
          force: true,
        });
      cy.wait(2000);
      // snippet DE form & floating bar chip should have the same color #3367689776
      cy.chipAndSnippetShouldHaveTheSameColor('Weight');
      /** @see https://github.com/jaredpalmer/cypress-image-snapshot/issues/137#issuecomment-971762030 workaround for intermitten snapshot when zoom in.  */
      cy.get('[data-cy=canvas-content]').matchImageSnapshot();
    });

    it('Click X icon or Cancel button in hotspot in canvas should deselect the snippet, zoom out, and show all the OCR hotspots in canvas', () => {
      cy.get('[data-cy=streamline-cancel-data-entry]').should('exist').click();
      cy.wait(2000);
      cy.getSnapshot('[data-cy=canvas-content]');
    });

    // Test pressing on non hotspot question chip
    it('Clicking on non hotspot chip in the right question and draw a manual snippet should auto select the question (Muscle)', () => {
      cy.clickCanvasTools('ZoomIn');
      cy.get('[data-cy=ZoomIn-icon]').should('be.visible');
      cy.get('[data-cy=right-chip-Muscle]').scrollIntoView().should('be.visible').click();
      cy.get('[data-cy=error-alert]')
        .should('be.visible')
        .contains(
          'Hotspot not found! Please use the Snippet tool to manually select from the Source Capture',
        );
      // #3623639620
      cy.chipShouldHaveNoColorHighlight('Muscle');
      cy.drawSingleRect(singleSnippet);
      cy.get('[data-cy=streamline-dropdown-data-entry-question]').contains('Muscle');
      cy.clickCancelStreamline();
      cy.get('[data-cy=Snippet-icon-selected]').should('be.visible');
      cy.get('[data-cy=ZoomIn-icon]').should('be.visible');
    });

    // Test pressing next when there isn't a single bottom chips
    it('Clicking next to RYW when no snippet & DE will prompt confirmation modal', () => {
      cy.get('[data-cy=next-bottom-chips-menu]').click();
      cy.checkConfirmationModalContent({
        title: 'Heads Up!',
        description: 'There must be at least one new snippet or data entry',
      });
      cy.get('[data-cy=confirmModal-confirmButton').should('be.visible').click();
    });

    // Test pressing X icon (get out from canvas)
    it('Clicking X icon to get out of canvas will prompt confirmation modal and click cancel', () => {
      cy.exitCanvasPage(false);
    });

    // Test make snippet and then canceling
    it('Create snippet then cancelling', () => {
      cy.addSnippet('Lungs');
      cy.get('[data-cy=monitor-flow-body]').should('be.visible');
      cy.clickCanvasTools('Redaction');
      cy.checkConfirmationModalContent({
        title: 'Are you sure you want to discard your work for this question?',
      });
      cy.get('[data-cy=confirmModal-cancelButton').click();
      cy.get('[data-cy=monitor-flow-body]').should('be.visible');
      cy.clickCanvasTools('Redaction');
      cy.get('[data-cy=confirmModal-confirmButton').click({ multiple: true });
    });

    it('Clicking question chip with multiple detected hotspot value - 1st snippet', () => {
      // first hotspot
      cy.clickChipInFloatingBar('VaccineName');
      // Commented for now: running test-spec will generate snapshot that will fail on currents
      // cy.getSnapshot('[data-cy=canvas-content]');
      // Note: not using cy.get because cy.get requires the item to be visible and right now the floating-bar-info is
      // hidden below confirmation modal backdrop. temporary solution is to use cy.contains expecting the floating bar text is on the screen
      cy.contains('This chip has 2 snippet suggestions. Continue clicking on the chip to view all');
      cy.checkMonitorFlowBodyVisibility('visible');
    });
    it('Clicking question chip with multiple detected hotspot value - 2nd snippet', () => {
      // second hotspot
      cy.clickChipInFloatingBar('VaccineName');
      // Commented for now: running test-spec will generate snapshot that will fail on currents
      // cy.getSnapshot('[data-cy=canvas-content]');
      cy.checkMonitorFlowBodyVisibility('visible');

      // should have no hotspot anymore so modal won't show
      cy.clickChipInFloatingBar('VaccineName');
      cy.checkMonitorFlowBodyVisibility('notExist');
    });

    // Test SC Snippet & but skip DE
    it('Only snippet & skip data entry (Lungs)', () => {
      cy.snippetAndDataEntryStreamlineSC({ OCRName: 'Lungs', isHotspot: false });
      cy.checkStreamlineMilestoneCounter({ type: 'snippet', targetValue: '1/36' });
      cy.checkStreamlineMilestoneCounter({ type: 'data-entry', targetValue: '0/5' });
    });

    // Fill reason in other reason, cancel the modal, the detach again, the previous other reason should be resetted
    // NOTE: temporary skipped because it's affecting the next tests
    it('Other reason should not be persistent after cancel', () => {
      cy.detachSCWithOtherReason('Lungs', 'cancel');
      cy.openSnippetReasonModal('Lungs');
      cy.get('[data-cy=detach-snippet-reason-select]')
        .should('be.visible')
        .type('${enter}{downarrow}{enter}');
      cy.get('[data-cy=cancel-detach-snippet-reason]').click();
    });

    // Test cancel button after filling DE
    it('Edit data entry, fill data, then cancel should not shows error / white screen (Lungs)', () => {
      const muscleSnippetPosition = snippetSCPosition.Lungs;
      cy.draggingRect(
        { ...muscleSnippetPosition, y: muscleSnippetPosition.y + 200 },
        {
          x: muscleSnippetPosition.x,
          y: muscleSnippetPosition.y,
        },
        'Lungs',
        false,
        true,
        true,
      );

      // #3362175615
      cy.skipDEAfterDragSnippetAndSelectReasonShouldNotBeDisabled('Lungs');
      cy.fillDEFormAndSelectReason('Lungs', 'Lungs');
      cy.clickCancelStreamline();
      cy.get('[data-cy=streamline-edit-data-entry]').should('exist');
    });

    // Test editing Snippet and DE #3337406988
    it('Edit snippet & data entry (Lungs)', () => {
      const muscleSnippetPosition = snippetSCPosition.Lungs;
      cy.draggingRect(
        muscleSnippetPosition,
        {
          x: muscleSnippetPosition.x,
          y: muscleSnippetPosition.y,
        },
        'Lungs',
        false,
        true,
        true,
      );

      // Edit Data Entry
      cy.fillDEFormAndSelectReason('Lungs', 'Lungs');
      cy.get('[data-cy=streamline-save-data-entry]').should('be.visible').click();
      cy.checkStreamlineMilestoneCounter({ type: 'snippet', targetValue: '1/36' });
      cy.checkStreamlineMilestoneCounter({ type: 'data-entry', targetValue: '1/5' });
      cy.checkValueDataEntry({ OCRName: 'Lungs', dataEntryValue: 'Temp' });
    });

    // Check when click Edit button on answered question, the answer will initially displayed
    it('Click edit button on answered question, the answer should initially displayed', () => {
      cy.clickAddDEOrEditButton();
      cy.get('[data-cy=answer-input-field-ffLungsCon1-0-0]').contains('Temp');
      cy.clickCancelStreamline();
    });

    // NOTE: Next question - Removed for now, still need to figure out why the view snippet DE not showing
    it('Open DE Form for Hotspot question on next question press', () => {
      // Next question should invoke Weight Snippet & DE Form
      cy.get('[data-cy=view-snippet-de-next-question]').should('be.visible').click();
      cy.clickCanvasTools('ZoomOut');
      // Next question change based on order
      cy.get('#monitor-flow-body-vaccine1', {
        timeout: 15000,
      }).should('be.exist');
      cy.get('[data-cy=streamline-save-data-entry]').should('exist').click();
      cy.get(`[data-cy=bottom-chip-VaccineName]`).should('be.exist');
      cy.checkStreamlineMilestoneCounter({ type: 'snippet', targetValue: '2/36' });
      cy.checkStreamlineMilestoneCounter({ type: 'data-entry', targetValue: '1/5' });
    });

    it('Create a manual redaction and then click the chip by the floating bar. The canvas tool should be a snippet', () => {
      cy.clickSnippetTool('Redaction');
      cy.removeTooltipIfVisible();
      cy.drawSingleRect(redaction, undefined, true);
      cy.clickChipInFloatingBar('Weight', 2000);
      cy.get('[data-cy=Snippet] [data-cy=Snippet-icon-selected]').should('exist');
      cy.get('[data-cy=Redaction] [data-cy=Redaction-icon-selected]').should('not.exist');
      cy.get('[data-cy=streamline-cancel-data-entry]').should('exist').as('cancel-de');
      cy.get('@cancel-de').click();
    });

    it('Create a redaction and then submit a snippet should preserve the redaction markups', () => {
      cy.clickCanvasTools('Redaction');
      cy.drawSingleRect(redaction, undefined, true);
      cy.snippetAndDataEntryStreamlineSC({
        OCRName: 'Hearing',
        isHotspot: false,
        dataEntryValue: '123',
        expandModal: false,
        isEditing: false,
        force: true,
      });
      cy.removeChipFromBottomSection('Hearing', 'all', true, false);
    });

    // Test x icon inside the canvas after click hotspot
    it('Create multiple rectangle after click a chip in the floating bar (Weight) and click the x icon', () => {
      cy.clickCanvasTools('Snippet');
      cy.clickChipInFloatingBar('Weight', 2000);
      cy.drawSingleRect(snippetSCPosition['Heartbeat patient'], 'top-left', true);
      cy.clickXIcon(snippetSCPosition['Heartbeat patient'], 'snippet', true);
      cy.get('[data-cy=streamline-cancel-data-entry]').should('exist').click();
    });

    // Test disable button and mark as no answer reason dropdown
    it('Check disable submit button & mark as no answer (Weight)', () => {
      cy.clickCanvasTools('ZoomOut', true);
      cy.snippetAndDataEntryStreamlineSC({
        OCRName: 'Weight',
        isHotspot: true,
      });
      cy.clickAddDEOrEditButton();
      cy.clickMarkAsNoAnswerIcon('Weight');
      cy.selectMarkAsNoAnswerReason('Weight', true);
      cy.get('[data-cy=streamline-save-data-entry]').should('be.disabled');
      cy.selectMarkAsNoAnswerReason('Weight');
      cy.get('[data-cy=streamline-save-data-entry]').should('be.exist').click();
      cy.noAnswerIsExistInSnippetViewMode();
    });

    // #3434313116
    it('In a mark no answer reason question, submit button should be disabled because there`s no changes in the input form (Weight)', () => {
      cy.clickAddDEOrEditButton();
      cy.get('[data-cy=streamline-save-data-entry]').should('be.disabled');
    });

    it('After clear form field submit button should still be disabled. Add DE reason and fill in the input forms should enable the button again (Weight)', () => {
      cy.clearDEField();
      cy.get('[data-cy=streamline-save-data-entry]').should('be.disabled');
      cy.addDEInputForm('Weight', '100');
      cy.get('[data-cy=streamline-save-data-entry]').should('be.disabled');
      cy.selectDEReason('Weight');
      cy.get('[data-cy=streamline-save-data-entry]').should('not.be.disabled');
    });

    it('Should show 2 reason and the user must fill both of the reason to enable submit button (Weight)', () => {
      cy.clickMarkAsNoAnswerIcon('Weight');
      cy.get('[data-cy=streamline-save-data-entry]').should('be.disabled');
      cy.selectMarkAsNoAnswerReason('Weight');
      cy.get('[data-cy=streamline-save-data-entry]').should('not.be.disabled');
    });

    it('Should disable button on error input (Weight)', () => {
      cy.clearDEField();
      cy.addDEInputForm('Weight', '100kg');
      cy.get('[data-cy=streamline-save-data-entry]').should('be.disabled');
      cy.clearDEField();
      cy.addDEInputForm('Weight', 100);
      cy.get('[data-cy=streamline-save-data-entry]').should('not.be.disabled').click();
    });

    it('Check streamline milestone count (Weight)', () => {
      cy.checkStreamlineMilestoneCounter({ type: 'snippet', targetValue: '3/36' });
      cy.checkStreamlineMilestoneCounter({ type: 'data-entry', targetValue: '2/5' });
      cy.checkValueDataEntry({ OCRName: 'Weight', dataEntryValue: '100' });
      cy.exitCanvasPage();
    });

    // Testing expand modal mode
    it('Snippet & skip data entry with expand modal mode (Abdomen)', () => {
      cy.get('[data-cy=FILLED_PARTIAL]').click();
      cy.clickQuickAction(
        '[data-cy=question-card-weight1]',
        '[data-cy=question-card-weight1] > .question-card-action-menu > .ant-row > [data-cy="edit-snippet-de-action-weight1"]',
      );
      cy.monitorFlowModaIsVisible();
      cy.clickCancelStreamline();
      cy.snippetAndDataEntryStreamlineSC({
        OCRName: 'Abdomen',
        isHotspot: false,
        dataEntryValue: undefined,
        expandModal: true,
      });
      cy.checkStreamlineMilestoneCounter({ type: 'snippet', targetValue: '4/36' });
      cy.checkStreamlineMilestoneCounter({ type: 'data-entry', targetValue: '2/6' });
      cy.checkBubbleBehaviour({ OCRName: 'Abdomen', type: 'border', activateSnippet: false });
    });

    // Test editing expand modal mode
    it('Edit into save snippet & data entry in expand modal mode (Abdomen)', () => {
      cy.snippetAndDataEntryStreamlineSC({
        OCRName: 'Abdomen',
        isHotspot: false,
        dataEntryValue: '888',
        expandModal: true,
        isEditing: true,
      });
      cy.checkStreamlineMilestoneCounter({ type: 'snippet', targetValue: '4/36' });
      cy.checkStreamlineMilestoneCounter({ type: 'data-entry', targetValue: '3/6' });
    });

    // Testing bubble streamline behaviour
    it('Streamline Bubble Milestone behaviour', () => {
      cy.checkBubbleBehaviour({ OCRName: 'Lungs', type: 'filled' });
      cy.checkBubbleBehaviour({ OCRName: 'Abdomen', type: 'filled' });
      cy.checkBubbleBehaviour({ OCRName: 'Extermities', type: 'empty' });
    });

    // Testing exit canvas page and go back from quick action #3347143228
    it('Check everything is in order when exit from canvas page and go back from quick action', () => {
      cy.exitCanvasPage();
      cy.getVisitDetailAndGoToSCTab(
        aliasVisitDetails,
        '/visit/testRevisionId1/bellevueHospital1/kylieMatulich/visit1VisitKYM',
      );
      cy.goToStatusAndOpenSnippetQuickAction('MARKED_UP', 'vaccine1');
      cy.monitorFlowModaIsVisible();
      cy.get('[data-cy=streamline-cancel-data-entry]').should('exist').as('cancel-de');
      cy.get('@cancel-de').click();
      cy.checkStreamlineMilestoneCounter({ type: 'snippet', targetValue: '4/36' });
      cy.checkStreamlineMilestoneCounter({ type: 'data-entry', targetValue: '3/6' });
    });

    // Testing add answer submission in expand mode
    it('Add answer and submit in expand mode (Temporal Lobe)', () => {
      cy.snippetAndDataEntryStreamlineSC({
        OCRName: 'Temporal Lobe',
        isHotspot: false,
        dataEntryValue: ['123', '456'],
        expandModal: true,
        isEditing: false,
        force: true,
      });
    });

    // Testing exit canvas page and go to the other source capture id in another patient (SLO-OMN193)
    // and go back from quick action in the previous patient (KLM-120K1P) #3413201107
    it('Check everything is in order when added answer, exit from canvas page and go back from quick action', () => {
      cy.exitCanvasPage();
      cy.getVisitDetailAndGoToSCTab(
        aliasVisitDetails,
        '/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit1Visit1',
      );
      cy.goToStatusAndOpenSnippetQuickAction('MARKED_UP', 'lungs1');
      cy.get('[data-cy=streamline-cancel-data-entry]', { timeout: 20000 }).should('exist').click();

      cy.exitCanvasPage();
      cy.getVisitDetailAndGoToSCTab(
        aliasVisitDetails,
        '/visit/testRevisionId1/bellevueHospital1/kylieMatulich/visit1VisitKYM',
      );
      cy.goToStatusAndOpenSnippetQuickAction('MARKED_UP', 'vaccine1');
      cy.monitorFlowModaIsVisible();
      cy.wait(3000);
      cy.get('[data-cy=streamline-cancel-data-entry]').should('exist').click();
      cy.checkStreamlineMilestoneCounter({ type: 'snippet', targetValue: '5/36' });
      cy.checkStreamlineMilestoneCounter({ type: 'data-entry', targetValue: '4/7' });
    });

    // NOTE: Testing delete bottom chip - This test is working, but will break any next test because of leave you work modal
    it('Delete bottom chip (Temporal Lobe)', () => {
      cy.removeChipFromBottomSection('TemporalLobe', 'all', true, false);
      cy.checkStreamlineMilestoneCounter({ type: 'snippet', targetValue: '4/36' });
      cy.checkStreamlineMilestoneCounter({ type: 'data-entry', targetValue: '3/6' });
    });

    // NOTE: Initial plan for edit from Review your work
    it('Edit snippet & DE from review your work', () => {
      cy.get('[data-cy=alert-success]').should('not.exist');
      cy.get('[data-cy=next-bottom-chips-menu]').click();
      cy.get('[data-cy=RYW-question-Lungs-edit-button]').should('be.visible').click();
      cy.get('.streamline-submit-button').should('exist').should('be.disabled');
      cy.checkStreamlineMilestoneCounter({ type: 'snippet', targetValue: '4/36' });
      cy.checkStreamlineMilestoneCounter({ type: 'data-entry', targetValue: '3/6' });
      cy.checkBottomChipActiveOrInactive('Lungs');
      cy.get('[data-cy=modal-title-streamline]').contains('Lungs');
      cy.get(`[data-cy=textfield-container-answer-input-field-ffLungsCon1-0-0]`)
        .should('be.visible')
        .click()
        .type(' edit');
      cy.selectDEReason('Lungs');
      cy.get('[data-cy=streamline-save-data-entry]').should('be.visible').click();
      cy.get('[data-cy=question-answer-free-text]').contains('Temp edit');
    });

    // Test click form view in streamline, only shows the one that changes during that session only.
    it('Test form view in streamline flow', () => {
      cy.get('[data-cy=form-view]').click();
      cy.removeTooltipIfVisible();
      cy.getSnapshot('[data-cy=canvas-content]');
    });

    // Testing Review your work
    it('Confirm review your work', () => {
      cy.get('[data-cy=native-view]').click();
      cy.get('[data-cy=next-bottom-chips-menu]').click();
      cy.checkDataEntryInReviewYourWork({ OCRName: 'Abdomen', dataEntryValue: '888' });
      cy.checkDataEntryInReviewYourWork({ OCRName: 'Weight', dataEntryValue: '100' });
      cy.checkDataEntryInReviewYourWork({ OCRName: 'Lungs', dataEntryValue: 'Temp edit' });
      cy.get('[data-cy=done-review-your-work-bottom-chips-menu]').should('be.visible').click();
      /**
       * Testing if the completed card placed on their place correctly
       * Open Snippet complete, pending data entry (`MARKED_UP`) --> check for Hearing card (`question-hearing1`)
       * Open Pending Second Data Entry (`FILLED_PARTIAL`) --> check for Weight card (`question-weight1`)
       * Open Data Entry Complete (`FILLED_PARTIAL`) --> check for Muscle card (`question-muscle1`)
       */
      cy.checkResultAfterConfirmInReviewYourWork({
        filterCy: 'FILLED',
        questionCardCy: 'question-abdomen1',
      });
      cy.checkResultAfterConfirmInReviewYourWork({
        filterCy: 'FILLED_PARTIAL',
        questionCardCy: 'question-weight1',
      });
      cy.checkResultAfterConfirmInReviewYourWork({
        filterCy: 'FILLED',
        questionCardCy: 'question-lungs1',
      });
    });
    it('Prepare the data for next test case about second DE & check input form validation (Blood Pressure)', () => {
      cy.clickQuickAction(
        '[data-cy=question-card-abdomen1]',
        '[data-cy=question-card-abdomen1] > .question-card-action-menu > .ant-row > [data-cy="edit-snippet-de-action-abdomen1"]',
      );
      cy.monitorFlowModaIsVisible();
      cy.clickCancelStreamline();

      cy.clickFloatingBarChip('BloodPressure', true);
      cy.drawSingleRect(singleSnippet);

      cy.getQuestionInputForm('ffSystolic', 0, 0).click().type('test1');
      cy.getQuestionInputForm('ffdoastolic', 0, 1).click().type('test2');
      cy.getQuestionInputForm('ffBPUnit', 0, 2).type('${downarrow}{enter}');

      /** submit button disabled because there is 2 input error that should be a number */
      cy.get(`[data-cy=streamline-save-data-entry]`).should('exist').should('be.disabled');

      cy.getQuestionInputForm('ffSystolic', 0, 0).focus().clear();
      cy.getQuestionInputForm('ffSystolic', 0, 0).click().type('777');

      /**
       * @see https://app.clickup.com/t/26422098/DEV-2725
       * @see https://app.clickup.com/t/26422098/DEV-2729
       * validation of disable submit button logic
       * should still be disabled because diastolic still have an input error
       */
      cy.get(`[data-cy=streamline-save-data-entry]`).should('exist').should('be.disabled');

      /** now the submit button should be enabled */
      cy.getQuestionInputForm('ffdoastolic', 0, 1).focus().clear();
      cy.getQuestionInputForm('ffdoastolic', 0, 1).click().type('777');

      /** @see https://app.clickup.com/t/26422098/DEV-2774 other value test */
      cy.getQuestionInputForm('ffBPUnit', 0, 2).type('${downarrow}{downarrow}{enter}');
      cy.get(`[data-cy=streamline-save-data-entry]`).should('exist').should('be.disabled');

      cy.get('[data-cy=answer-input-field-ffBPUnit1-0-2]').within(() => {
        cy.get(`.ant-select-selection-search-input`).type('12345');
      });
      cy.get(`[data-cy=streamline-save-data-entry]`).should('exist').should('not.be.disabled');

      cy.get('[data-cy=answer-input-field-ffBPUnit1-0-2]').within(() => {
        cy.get(`.ant-select-selection-search-input`).clear();
      });
      cy.get(`[data-cy=streamline-save-data-entry]`).should('exist').should('be.disabled');

      cy.getQuestionInputForm('ffdoastolic', 0, 1).click().type('8');
      cy.get(`[data-cy=streamline-save-data-entry]`).should('exist').should('be.disabled');

      cy.getQuestionInputForm('ffdoastolic', 0, 1).focus().clear();
      cy.getQuestionInputForm('ffdoastolic', 0, 1).click().type('777');
      cy.get(`[data-cy=streamline-save-data-entry]`).should('exist').should('be.disabled');

      cy.get('[data-cy=answer-input-field-ffBPUnit1-0-2]').type('12345');

      cy.get(`[data-cy=streamline-save-data-entry]`)
        .should('exist')
        .should('not.be.disabled')
        .click();

      cy.checkStreamlineMilestoneCounter({ type: 'data-entry', targetValue: '4/7' });
    });

    // Check DE Counter after Second DE change the snippet. If Second DE change snippet, then the counter calculation also imapacted beucase
    // the Second DE will now be considered as First DE.
    it('Login as Second Data Entry, go to Pending Second Data Entry, click Edit Quick Action, Change Snippet, Then go back to First  Data Entry account', () => {
      cy.closeModalCapture();
      cy.logout();
      cy.clearLocalStorageSnapshot();
      cy.fillInloginAsFormV2({
        email: 'streamlinesc2@example.com',
      });
      cy.getVisitDetailAndGoToSCTab(
        aliasVisitDetails,
        '/visit/testRevisionId1/bellevueHospital1/kylieMatulich/visit1VisitKYM',
      );
      cy.get('[data-cy=MARKED_UP]').click();
      cy.clickQuickAction(
        '[data-cy=question-card-bloodPressure1]',
        '[data-cy=question-card-bloodPressure1] > .question-card-action-menu > .ant-row > [data-cy="edit-snippet-action-bloodPressure1"]',
      );
      cy.get('[data-cy=streamline-cancel-data-entry]').should('exist').click();
      cy.checkStreamlineMilestoneCounter({ type: 'data-entry', targetValue: '0/5' });
    });

    // Check when you submit question, then click next
    it('Click next button after submit question', () => {
      cy.getVisitDetailAndGoToSCTab(
        aliasVisitDetails,
        '/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit1Visit1',
      );
      cy.openSCFlow();
      cy.uploadSCImage();
      cy.get('[data-cy=manual-redact-button]').should('be.visible').click();
      cy.confirmRedactionToSuggestionNoWait('continue', true, true);
      cy.get('[data-cy=sc-okay-button]').should('be.visible').click();
      cy.get('[data-cy=right-chips-menu]').should('exist');

      cy.drawSnippetAndSelect(multiSnippet[0], 'Muscle');
      cy.get('[data-cy=monitor-flow-body]').should('be.visible');
      cy.get('[data-cy=streamline-save-data-entry]').should('exist').click();
      cy.get(`[data-cy=bottom-chip-Muscle]`).should('be.visible');
      cy.get('[data-cy=next-bottom-chips-menu]').click();
      cy.get('.ant-modal-body').contains('Muscle condition:');
    });

    it('Detach SC and fill Other reason, should be able to view Submit button and proceed', () => {
      cy.get('[data-cy=back-to-canvas-bottom-chips-menu]').click();
      cy.clickBottomChip('Muscle');
      cy.detachSCWithOtherReason('Muscle', 'submit');
      cy.checkChipAfterRemoveSnippet('Muscle');
    });
  });
});
