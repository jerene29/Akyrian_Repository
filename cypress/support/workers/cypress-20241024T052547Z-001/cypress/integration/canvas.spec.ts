import { mockUserDataAdmin } from '../../src/constant/testFixtures';
import {
  GetVisitDetailsDocument,
  IWithSourceForm,
  IFieldGroupVisitDetail,
  UpdateFfgrMarkupDocument,
} from '../../src/graphQL/generated/graphql';

const multiSnippetPadding = 50;

const updateYPaddingSnippet = (
  snippet: { x: number; y: number; x2: number; y2: number },
  padding = multiSnippetPadding,
) => ({
  ...snippet,
  y: snippet.y - padding,
});

describe(
  'Canvas',
  {
    viewportHeight: 789,
    viewportWidth: 1440,
  },
  () => {
    const singleSnippet = {
      x: 50,
      y: 50,
      x2: 100,
      y2: 100,
    };

    const multiSnippet = [
      {
        x: 200,
        y: 50,
        x2: 250,
        y2: 100,
      },
      {
        x: 220,
        y: 130,
        x2: 270,
        y2: 180,
      },
      {
        x: 190,
        y: 200,
        x2: 250,
        y2: 250,
      },
      {
        x: 170,
        y: 270,
        x2: 230,
        y2: 320,
      },
    ];

    const redaction = {
      x: 270,
      y: 50,
      x2: 320,
      y2: 100,
    };

    let markupRejected: IFieldGroupVisitDetail[] = [];
    const aliasSource = GetVisitDetailsDocument.definitions[0].name.value;
    let visitDetailsSource: IWithSourceForm = {} as IWithSourceForm;

    before(() => {
      cy.reseedDB();

      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasSource) {
          req.alias = req.body.operationName;
        }
      });

      cy.fillInloginAsFormV2(mockUserDataAdmin);
      cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit1Visit1');
      cy.waitForReact();

      cy.wait(`@${aliasSource}`).then((result) => {
        if (result?.response?.statusCode === 200) {
          cy.get('[data-cy=sourceQuestionTab]').click();
          visitDetailsSource = result.response.body.data.visitDetails.withSourceForm;
        }
      });
    });

    describe('Edit MarkedUp and Rejected snippet test', () => {
      before(() => {
        cy.get('[data-cy=NOT_AVAILABLE_REJECTED]').click();
        cy.clickQuickAction(
          '[data-cy=question-card-brain1]',
          '[data-cy=question-card-brain1] > .question-card-action-menu > .ant-row > [data-cy="edit-snippet-action-brain1"]',
        );

        const selectedFG = visitDetailsSource.fieldGroups.filter((FG) => FG.id === 'brain1');
        let scId = '';
        if (selectedFG[0] && selectedFG[0].formFieldGroupResponse?.sourceCaptureId) {
          scId = selectedFG[0].formFieldGroupResponse.sourceCaptureId;
        }

        if (scId) {
          markupRejected = visitDetailsSource.fieldGroups.filter(
            (FG) =>
              FG.formFieldGroupResponse?.sourceCaptureId === scId &&
              FG.formFieldGroupResponse.status === 'MARK_UP_REJECTED',
          );
        }
      });

      after(() => {
        cy.exitCanvasModal();
        cy.get('[data-cy=ATTACHED]').click();
      });

      // change the expected result based on https://ikeguchiholdings.monday.com/boards/1959201049/pulses/3342548023
      it('MarkedUp and rejected snippet should not be drawn on the canvas on first render unless its a selected question from quick action', () => {
        cy.waitForCanvasToLoad();
        cy.removeTooltipIfVisible();
        cy.checkIfModalIsEditMode();
        cy.getSnapshot('[data-cy=canvas-content]');
      });

      // Adjustmen required based on monday task id #3413201197
      it('Activate the zoom in canvas tool on edit mode will zoom automatically to the most bottom rectangle and the DE form modal still opens', () => {
        cy.clickSnippetTool('ZoomIn');
        cy.checkIfModalIsEditMode();
        cy.clickSnippetTool('Snippet');
        cy.drawSingleRect({ x: 600, y: 200, x2: 700, y2: 350 }, 'top-left', true);
        cy.checkIfModalIsEditMode();
      });

      it('ZoomOut when editing mode will zoom OUT and still showing the modal', () => {
        cy.removeTooltipIfVisible();
        cy.clickSnippetTool('ZoomOut');
        cy.checkIfModalIsEditMode();
      });

      // test scenario modification https://ikeguchiholdings.monday.com/boards/1959201049/pulses/3210990071
      it('Go to form view, and the snippets should not be there, because it hasnt modified yet', () => {
        cy.clickCancelNonStreamline();
        cy.get('[data-cy=form-view]').click();
        cy.getSnapshot('[data-cy=canvas-content]');
      });

      it('Click trash icon on bottom menu for status rejected will not show modal edit reason and will directly delete the snippet', () => {
        cy.get('[data-cy=native-view]').click();
        cy.clickSnippetTool('ZoomOut');
        cy.removeChipFromBottomSection('BloodPressure', 'delete', false, false);
        cy.checkChipAfterRemoveSnippet('BloodPressure');
      });

      it('Clicking on bottom chip and then edit button with status MarkedUp should show the edit reason modal, and after submit reason remove the question', () => {
        cy.clickBottomChip('RightEye');
        cy.editSnippetFromBottomSection('RightEye');
        cy.editSnippetReasonModal();
        cy.get('[data-cy=streamline-dropdown-data-entry-question]').should('exist');
        cy.hoverBottomChip('RightEye', {
          scrollBehavior: 'center',
          position: 'center',
          pointer: 'mouse',
        });
        cy.get('[data-cy=bottom-chip-delete-RightEye]').should('exist').click();
        cy.checkChipAfterRemoveSnippet('RightEye');
      });

      it('Clicking on bottom chip and then edit button with status MarkedUp should show edit reason modal, and click cancel should not begin the editing', () => {
        cy.clickBottomChip('Lungs');
        cy.editSnippetFromBottomSection('Lungs');
        cy.editSnippetReasonModal(false);
        cy.get('[data-cy=non-streamline-save-snippet]').should('not.exist');
        cy.getSnapshot('[data-cy=canvas-content]');
      });

      it('Clicking on bottom chip and edit with status Rejected will not show edit reason modal and can be edited directly', () => {
        cy.clickBottomChip('Brain');
        cy.editSnippetFromBottomSection('Brain');
        cy.clickCancelNonStreamline();
      });

      it.skip('Click trash icon on bottom menu for status MarkedUp will show modal edit reason, then after submit the snippet it will be gone', () => {
        cy.clickBottomChip('Lungs');
        cy.removeChipFromBottomSection('Lungs', 'delete', true);
        cy.checkChipAfterRemoveSnippet('Lungs');
      });
    });

    describe.skip('Basic Snippet', () => {
      before(() => {
        cy.clearLocalStorageSnapshot();
        cy.intercept('POST', '/graphql', (req) => {
          if (req.body.operationName === aliasSource) {
            req.alias = req.body.operationName;
          }
        });
        cy.fillInloginAsFormV2(mockUserDataAdmin);
        cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit1Visit1');
        cy.waitForReact();

        cy.wait(`@${aliasSource}`).then((result) => {
          if (result?.response?.statusCode === 200) {
            visitDetailsSource = result.response.body.data.visitDetails.withSourceForm;
            cy.get('[data-cy=sourceQuestionTab]').click();
          }
        });
        cy.get('[data-cy=ATTACHED]').click();
      });

      it('default submit button should be disabled when the user opens the snippet ', () => {
        cy.clickQuickAction(
          '[data-cy=question-card-bloodType1]',
          '[data-cy=question-card-bloodType1] > .question-card-action-menu > .ant-row > [data-cy="snippet-action-bloodType1"]',
        );

        cy.waitForCanvasToLoad();
        cy.removeTooltipIfVisible();
        cy.waitForReact();
        cy.submitSnippetButtonIsDisabled();
      });

      it('draw a basic single snippet should enable the submit button in the bottom section', () => {
        cy.drawSnippetAndSelect(singleSnippet, 'Respiration rate');
        cy.checkSubmitButtonActive('submit-bottom-chips-menu');
        cy.checkChipAfterCreateSnippet('Respirationrate');
      });

      it('delete snippet from the canvas should disable the submit button', () => {
        cy.editSnippetFromBottomSection('Respirationrate');
        cy.clickXIcon(singleSnippet, undefined, true);
        cy.submitSnippetButtonIsDisabled();
      });

      it('draw a basic multi snippet inside the canvas', () => {
        cy.clickSnippetTool('Snippet');
        cy.drawSnippetAndSelect(multiSnippet, 'Blood Type', true);
        cy.getSnapshot('[data-cy=canvas-content]');
        cy.clickBottomChip('BloodType');
      });

      it('draw redaction should activate the submit button', () => {
        cy.get('[data-cy=Redaction]').click();
        const redactionSnippet = {
          x: 300,
          y: 50,
          x2: 350,
          y2: 100,
        };
        cy.clickSnippetTool('Redaction');
        cy.removeTooltipIfVisible();
        cy.drawSingleRect(redactionSnippet);
        cy.checkSubmitButtonActive('submit-bottom-chips-menu');

        // delete the redaction snippet
        cy.clickRect(redactionSnippet);
        cy.clickXIcon(redactionSnippet, 'redaction');

        cy.submitSnippetButtonIsDisabled();
        cy.clickSnippetTool('Snippet');
        cy.removeTooltipIfVisible();
        cy.drawSnippetAndSelect(singleSnippet, 'Respiration rate');
        cy.clickBottomChip('Respirationrate');
      });
    });

    describe.skip('Bottom Chips Menu', () => {
      it('Hovering over the bottom chips should show the snippet (Respiration Rate)', () => {
        cy.removeChipFromBottomSection('BloodType');
        cy.hoverBottomChip('Respirationrate');
        cy.isViewModeSnippetOCR('Respiration rate');
        cy.zoomReset();
        cy.drawSnippetAndSelect(multiSnippet, 'Blood Type', true);
      });

      it('Clicking on the bottom chip should still show the current snippet (Blood Type)', () => {
        cy.clickBottomChip('BloodType');
        cy.checkBottomChipActiveOrInactive('BloodType');
      });

      it('Clicking on the other bottom chip should remove the previous snippet and show the current snippet (Respiration Rate)', () => {
        cy.clickBottomChip('Respirationrate');
        cy.checkBottomChipActiveOrInactive('Respirationrate');
      });

      it('Drawing and Deleting snippet from canvas should update bottom section and floating bar chips', () => {
        cy.removeChipFromBottomSection('Respirationrate');
        cy.get('[data-cy=canvas-container] canvas').realHover({
          scrollBehavior: 'center',
          position: 'center',
          pointer: 'mouse',
        });
        cy.zoomReset();
        cy.drawSingleRect(singleSnippet);
        // #3308969066 and #3308969044
        cy.checkBottomChipActiveOrInactive('BloodType', false);
        cy.get('[data-cy=streamline-dropdown-data-entry-question]').should('exist').click();
        cy.selectLabelFromCanvasDropdown('Respiration rate');
        cy.checkChipAfterCreateSnippet('Respirationrate');
      });
    });

    describe.skip('Opacity Tool', () => {
      it('Click on the opacity tool will show the slider bar', () => {
        cy.clickSnippetTool('Opacity');
        cy.get('[data-cy=opacity-input-slider]').should('be.visible');
      });

      it('Update opacity value to 90%', () => {
        cy.clickBottomChip('BloodType');
        cy.get('[data-cy=opacity-input-slider]').setSliderValue(90);
        cy.clickSnippetTool('Opacity');
        cy.zoomReset();
        cy.isViewModeSnippetOCR('Blood Type');
        cy.getSnapshot('[data-cy=canvas-content]', {
          failureThreshold: 0.02,
          failureThresholdType: 'percent',
        });

        // Reset Snippet opacity to 50 and remove snippet focus from the blood type
        cy.clickSnippetTool('Opacity');
        cy.get('[data-cy=opacity-input-slider]').setSliderValue(50);
        cy.clickSnippetTool('Opacity');
        cy.clickBottomChip('BloodType');
        cy.checkBottomChipActiveOrInactive('BloodType');
      });
    });

    describe.skip('Hover Snippet', () => {
      it('Clicking on bottom chip and mouseOver on the snippet should not show transformer and x icon', () => {
        const snippetToDraw = multiSnippet[1];
        cy.onHoverTo(snippetToDraw);
        cy.isViewModeSnippetOCR('Blood Type');
      });
    });

    describe.skip('Delete multi snippet', () => {
      it('click x on the last snippet inside the canvas will move the DE form to the previous snippet', () => {
        const lastSnippet = multiSnippet[multiSnippet.length - 1];
        cy.clickBottomChip('BloodType');
        cy.editSnippetFromBottomSection('BloodType', true);
        cy.zoomReset();
        cy.clickXIcon(updateYPaddingSnippet(lastSnippet));
        // delete multi snippet should not remove the current label #3440411974
        cy.get('[data-cy=streamline-dropdown-data-entry-question]').contains('Blood Type');
        cy.getSnapshot('[data-cy=canvas-content]');
      });

      it('after click x beside the snippet in the middle, the DE form will remain on the last', () => {
        const middleSnippet = multiSnippet[1];
        cy.clickXIcon(updateYPaddingSnippet(middleSnippet), 'snippet', true);
        cy.getSnapshot('[data-cy=canvas-content]');
        cy.clickSaveSnippetButton();
      });
    });

    describe.skip('Connector', () => {
      it('should show connector following cursor movement', () => {
        const moveTo = { x: 300, y: 350, force: true };
        cy.clickBottomChip('Respirationrate');
        cy.editSnippetFromBottomSection('Respirationrate', true);
        cy.get('[data-cy=canvas-container] canvas').trigger('mousemove', moveTo);
        cy.getSnapshot('[data-cy=canvas-content]');
        cy.clickSaveSnippetButton();
      });
    });

    describe.skip('Edit snippet', () => {
      it('click bottom chip and click edit pencil icon should change snippet and connector stroke to dotted, and DE form should be showing', () => {
        cy.clickBottomChip('BloodType');
        cy.editSnippetFromBottomSection('BloodType');
        cy.checkIfModalIsEditMode();
        cy.getSnapshot('[data-cy=canvas-content]');
        cy.zoomReset();
      });

      it('draw new snippet + click save snippet button', () => {
        cy.zoomReset();
        const snippetToDraw = multiSnippet[multiSnippet.length - 1];
        cy.drawSingleRect(snippetToDraw);
        cy.getSnapshot('[data-cy=canvas-content]');
        cy.clickSaveSnippetButton();
      });

      it('select snippet item will close the edit form', () => {
        cy.clickBottomChip('Respirationrate');
        cy.removeChipFromBottomSection('Respirationrate', 'delete');

        cy.editSnippetFromBottomSection('BloodType', true, true);
        cy.get('[data-cy=streamline-dropdown-data-entry-question]').should('exist').click();
        cy.get('div[title="Respiration rate"]').click();
        cy.isViewModeSnippetOCR('Respiration rate');
      });
    });

    describe.skip('Dragging snippet', () => {
      before(() => {
        cy.drawSnippetAndSelect(singleSnippet, 'Blood Type');
      });

      after(() => {
        cy.exitCanvasModal();
      });

      it('can overlap to other snippets', () => {
        const target = multiSnippet[0];
        const targetPoint = { x: target.x, y: target.y };
        cy.draggingRect(
          updateYPaddingSnippet(singleSnippet),
          { x: targetPoint.x, y: targetPoint.y - multiSnippetPadding },
          'BloodType',
          undefined,
          true,
        );
        cy.get('[data-cy=streamline-dropdown-data-entry-question]').contains('Blood Type');
        cy.wait(100);
        cy.clickSaveSnippetButton();
      });

      it('drag until the end of canvas should not go beyond the canvas', () => {
        cy.get('[data-cy=canvas-container]')
          .invoke('css', 'height')
          .then((height) => {
            const source = multiSnippet[multiSnippet.length - 1];
            const heightNum = String(height).slice(0, String(height).length - 2);
            const targetPoint = { x: source.x, y: Number(heightNum) };
            cy.draggingRect(
              updateYPaddingSnippet(source),
              targetPoint,
              'Respirationrate',
              true,
              true,
            );
            cy.getSnapshot('[data-cy=canvas-content]');
            cy.editSnippetFromBottomSection('Respirationrate');
          });
      });
    });

    /** START FROM ATTACHED WITH NO BOTTOM SECTION CHIPS */
    describe.skip('Transforming snippet', () => {
      before(() => {
        cy.clearLocalStorageSnapshot();
        cy.intercept('POST', '/graphql', (req) => {
          if (req.body.operationName === aliasSource) {
            req.alias = req.body.operationName;
          }
        });
        cy.fillInloginAsFormV2(mockUserDataAdmin);
        cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit1Visit1');
        cy.waitForReact();

        cy.wait(`@${aliasSource}`).then((result) => {
          if (result?.response?.statusCode === 200) {
            visitDetailsSource = result.response.body.data.visitDetails.withSourceForm;
            cy.get('[data-cy=sourceQuestionTab]').click();
          }
        });
        cy.get('[data-cy=ATTACHED]').click();
      });

      beforeEach(() => {
        cy.clickQuickAction(
          '[data-cy=question-card-bloodType1]',
          '[data-cy=question-card-bloodType1] > .question-card-action-menu > .ant-row > [data-cy="snippet-action-bloodType1"]',
        );
        cy.waitForCanvasToLoad();
        cy.removeTooltipIfVisible();
        cy.drawSnippetAndSelect(multiSnippet, 'Respiration rate', true);
      });

      afterEach(() => {
        cy.exitCanvasModal();
      });

      it('snippet can overlap to other snippets', () => {
        cy.drawSnippetAndSelect(singleSnippet, 'Blood Type');
        const target = multiSnippet[0];
        cy.transformingRect(
          {
            x: singleSnippet.x2,
            y: singleSnippet.y + (singleSnippet.y2 - singleSnippet.y) / 2,
          },
          {
            x: target.x + 10,
            y: target.y2,
          },
          'BloodType',
        );
        cy.getSnapshot('[data-cy=canvas-content]');
      });

      it('transforming top to bottom beyond original bottom line, to check if the transformer works and, the connector not broken', () => {
        const targetSnippet = multiSnippet[multiSnippet.length - 1];
        cy.transformingRect(
          {
            x: targetSnippet.x2,
            y: targetSnippet.y,
          },
          {
            x: targetSnippet.x,
            y: targetSnippet.y2 + 40,
          },
          'Respirationrate',
          true,
        );
        cy.zoomReset();
        cy.getSnapshot('[data-cy=canvas-content]');
      });

      it('transform until the end of snippet should not go beyond the canvas', () => {
        cy.get('[data-cy=canvas-container]')
          .invoke('css', 'height')
          .then((height) => {
            const source = multiSnippet[multiSnippet.length - 1];
            const heightNum = String(height).slice(0, String(height).length - 2);
            cy.transformingRect(
              {
                x: source.x + (source.x2 - source.x) / 2,
                y: source.y2,
              },
              {
                x: source.x,
                y: Number(heightNum),
              },
              'Respirationrate',
              true,
            );
            cy.getSnapshot('[data-cy=canvas-content]');
          });
      });
    });

    /** START FROM ATTACHED WITH NO BOTTOM SECTION CHIPS */
    describe.skip('Snippet menu position', () => {
      before(() => {
        cy.clickQuickAction(
          '[data-cy=question-card-bloodType1]',
          '[data-cy=question-card-bloodType1] > .question-card-action-menu > .ant-row > [data-cy="snippet-action-bloodType1"]',
        );
        cy.waitForCanvasToLoad();
        cy.removeTooltipIfVisible();
        cy.drawSnippetAndSelect(multiSnippet, 'Respiration rate', true);
      });

      after(() => {
        cy.exitCanvasModal();
      });

      it('DE Form default position is on the bottom', () => {
        cy.editSnippetFromBottomSection('Respirationrate');
        cy.getSnapshot('[data-cy=canvas-content]');
      });

      it('DE Form should still be on the very bottom after draw a new snippet on the top of the canvas', () => {
        cy.drawSingleRect(singleSnippet);
        cy.getSnapshot('[data-cy=canvas-content]');
      });

      it('DE Form should be updated to the very bottom of the canvas after draw a new one below the last multi snippet', () => {
        const snippet = {
          x: 370,
          y: 290,
          x2: 420,
          y2: 390,
        };
        cy.drawSingleRect(snippet);
        cy.getSnapshot('[data-cy=canvas-content]');
        cy.clickSaveSnippetButton();
      });
    });

    /** START FROM ATTACHED WITH NO BOTTOM SECTION CHIPS */
    describe.skip('Redaction', () => {
      before(() => {
        cy.clickQuickAction(
          '[data-cy=question-card-bloodType1]',
          '[data-cy=question-card-bloodType1] > .question-card-action-menu > .ant-row > [data-cy="snippet-action-bloodType1"]',
        );
        cy.waitForCanvasToLoad();
        cy.removeTooltipIfVisible();
        cy.drawSnippetAndSelect(singleSnippet, 'Respiration rate');
      });

      after(() => {
        cy.exitCanvasModal();
      });

      it('Check redaction UI', () => {
        cy.clickSnippetTool('Redaction');
        cy.removeTooltipIfVisible();
        cy.drawMultiRect(multiSnippet);
        cy.getSnapshot('[data-cy=canvas-content]');
      });

      it('Allow overlap to another redaction', () => {
        const rect = multiSnippet[multiSnippet.length - 2];
        const targetRect = multiSnippet[multiSnippet.length - 1];
        cy.clickRect(rect);
        cy.draggingRect(rect, {
          x: rect.x2,
          y: targetRect.y + (targetRect.y2 - targetRect.y) / 2,
        });
        cy.clickRect(targetRect);
        cy.draggingRect(targetRect, {
          x: targetRect.x2 + 20,
          y: targetRect.y + (targetRect.y2 - targetRect.y) / 2,
        });
        cy.getSnapshot('[data-cy=canvas-content]');
      });

      it('Allow overlap to snippet', () => {
        const targetRect = multiSnippet[0];
        cy.setSnippetToolsTooltipToBeHidden();
        cy.draggingRect(
          singleSnippet,
          {
            x: targetRect.x + (targetRect.x2 - targetRect.x) / 2,
            y: targetRect.y + (targetRect.y2 - targetRect.y) / 2,
          },
          'Respirationrate',
          true,
          true,
        );
        cy.getDEModalContainer().should('be.visible');
        cy.getSnapshot('[data-cy=canvas-content]');
      });
    });

    /** START FROM ATTACHED WITH NO BOTTOM SECTION CHIPS */
    describe.skip('Zooming', () => {
      before(() => {
        cy.clearLocalStorageSnapshot();
        cy.intercept('POST', '/graphql', (req) => {
          if (req.body.operationName === aliasSource) {
            req.alias = req.body.operationName;
          }
        });
        cy.fillInloginAsFormV2(mockUserDataAdmin);
        cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit1Visit1');
        cy.waitForReact();

        cy.wait(`@${aliasSource}`).then((result) => {
          if (result?.response?.statusCode === 200) {
            visitDetailsSource = result.response.body.data.visitDetails.withSourceForm;
            cy.get('[data-cy=sourceQuestionTab]').click();
          }
        });
        cy.get('[data-cy=ATTACHED]').click();

        cy.clickQuickAction(
          '[data-cy=question-card-bloodType1]',
          '[data-cy=question-card-bloodType1] > .question-card-action-menu > .ant-row > [data-cy="snippet-action-bloodType1"]',
        );
        cy.waitForCanvasToLoad();
        cy.waitForReact();
        cy.removeTooltipIfVisible();
        cy.drawSnippetAndSelect(multiSnippet, 'Blood Type', true);
      });

      after(() => {
        cy.exitCanvasModal();
      });

      it('Zooming on form view and click submit should zoom out the canvas to original scale', () => {
        cy.get('[data-cy=form-view]').click();
        cy.clickSnippetTool('ZoomIn');
        cy.clickSubmitToFormViewDisplayButton();
        cy.wait(2000);
        cy.get('[data-cy=canvas-content]').matchImageSnapshot({
          failureThreshold: 100,
          failureThresholdType: 'percent',
        });
      });

      it("UI element on zoom in shouldn't get larger, and image will fill entire canvas container", () => {
        cy.clickBackToMarkupDisplayButton();
        cy.clickSnippetTool('ZoomIn');
        cy.clickBottomChip('BloodType', true);
        cy.get('[data-cy=canvas-content]').matchImageSnapshot({
          failureThreshold: 100,
          failureThresholdType: 'percent',
        });
      });

      it('UI element on zoom out should go back to original size', () => {
        cy.clickSnippetTool('ZoomOut');
        cy.isViewModeSnippetOCR('Blood Type');
        cy.get('[data-cy=canvas-content]').matchImageSnapshot({
          failureThreshold: 100,
          failureThresholdType: 'percent',
        });
      });

      it('Zoomed in automatically on clicking the floating bar chips that has a suggestion / hotspot and highlight snippet', () => {
        cy.clickChipInFloatingBar('Respirationrate', 2000);
        cy.getSnapshot('[data-cy=canvas-content]');
      });

      it('Clicking the same floating bar chips that has a suggestion / hotspot will cycle through it', () => {
        cy.clickChipInFloatingBar('Respirationrate', 2000);
        cy.getSnapshot('[data-cy=canvas-content]');
      });

      it('It will automatically zoomed out if there is no hotspot anymore', () => {
        cy.clickChipInFloatingBar('Respirationrate', 2000);
        cy.getSnapshot('[data-cy=canvas-content]');
      });

      it('Click the hotspot should display the modal with the question label in it', () => {
        const respirationRatePosition = {
          x: 200,
          y: 240,
        };
        cy.get('[data-cy=canvas-container] canvas')
          .trigger('mousemove', {
            x: respirationRatePosition.x,
            y: respirationRatePosition.y,
            isPrimary: true,
            force: true,
          })
          .wait(100)
          .trigger('mousedown', {
            x: respirationRatePosition.x,
            y: respirationRatePosition.y,
            isPrimary: true,
            force: true,
          })
          .wait(100)
          .trigger('mouseup', {
            x: respirationRatePosition.x,
            y: respirationRatePosition.y,
            isPrimary: true,
            force: true,
          });
        cy.wait(2000);
        cy.get('[data-cy=streamline-dropdown-data-entry-question]').contains('Respiration rate');
        cy.get('[data-cy=streamline-dropdown-data-entry-question]').should('exist');
        cy.get('[data-cy=non-streamline-save-snippet]').should('exist');
      });
    });

    /** START FROM ATTACHED WITH BLOOD TYPE CHIP IN THE BOTTOM SECTION CHIPS */
    describe.skip('Form view', () => {
      before(() => {
        cy.clickQuickAction(
          '[data-cy=question-card-bloodType1]',
          '[data-cy=question-card-bloodType1] > .question-card-action-menu > .ant-row > [data-cy="snippet-action-bloodType1"]',
        );
        cy.waitForCanvasToLoad();
        cy.removeTooltipIfVisible();
        cy.drawSnippetAndSelect(singleSnippet, 'Blood Type');
      });

      after(() => {
        cy.exitCanvasModal();
      });

      it('Click respiration rate hotspot in floating bar, then draw multi snippet, then save snippet, then go to form view, it should show all snippet image', () => {
        const multiSnippetOffset = multiSnippet.map((snippet) => {
          snippet.x += 500;
          snippet.x2 += 500;
          return snippet;
        });

        cy.clickChipInFloatingBar('Respirationrate', 2000);
        cy.drawSnippetAndSelect(multiSnippetOffset, 'Respiration rate', true);
        cy.get('[data-cy=form-view]').click();
        cy.getSnapshot('[data-cy=canvas-content]');
        cy.get('[data-cy=native-view]').click();
        cy.removeChipFromBottomSection('Respirationrate', 'delete');
      });

      it('Add redaction between snippets and add new snippet then confirm, go to form view, check if the form view is still correct and new snippet is there', () => {
        cy.clickSnippetTool('Redaction');
        cy.removeTooltipIfVisible();
        cy.wait(1000);
        cy.zoomReset();
        cy.isViewModeSnippetOCR('Blood Type');
        cy.drawSingleRect(redaction);
        cy.clickSnippetTool('Snippet');
        cy.removeTooltipIfVisible();
        cy.drawSnippetAndSelect(multiSnippet, 'Respiration rate', true);
        cy.get('[data-cy=form-view]').click();
        cy.getSnapshot('[data-cy=canvas-content]');
        cy.get('[data-cy=native-view]').click();
        cy.removeChipFromBottomSection('Respirationrate', 'delete');
      });

      it('Draw new snippet without confirm, the form view and submit button should be disabled', () => {
        cy.get('[data-cy=native-view]').click();
        cy.wait(1000);
        cy.zoomReset();
        cy.isViewModeSnippetOCR('Blood Type');
        cy.drawSingleRect(multiSnippet[3]);
        cy.get('[data-cy=form-view]').should('have.css', 'cursor', 'not-allowed');
        cy.submitSnippetButtonIsDisabled();
        cy.clickXIcon(multiSnippet[3]);
      });

      it('Draw new snippet and confirm, then submit snippet, the snippet should be there', () => {
        cy.get('[data-cy=native-view]').click();
        cy.drawSnippetAndSelect(multiSnippet, 'Respiration rate', true);
        cy.clickSubmitToFormViewDisplayButton();
        cy.getSnapshot('[data-cy=canvas-content]');
      });

      it('Delete a rect from multi snippet and go to form view', () => {
        cy.clickBackToMarkupDisplayButton();
        cy.clickBottomChip('Respirationrate', true);
        cy.editSnippetFromBottomSection('Respirationrate');
        cy.clickXIcon(updateYPaddingSnippet(multiSnippet[multiSnippet.length - 1]));
        cy.clickSaveSnippetButton();
        cy.wait(1000);
        cy.get('[data-cy=form-view]').click();
        cy.getSnapshot('[data-cy=canvas-content]');
      });

      it('Delete a rect from multi snippet and submit snippet', () => {
        cy.get('[data-cy=native-view]').click();
        cy.clickBottomChip('Respirationrate', true);
        cy.editSnippetFromBottomSection('Respirationrate');
        cy.clickXIcon(multiSnippet[multiSnippet.length - 2]);
        cy.clickSaveSnippetButton();
        cy.wait(1000);
        cy.clickSubmitToFormViewDisplayButton();
        cy.getSnapshot('[data-cy=canvas-content]');
      });

      it('Edit snippet, click save snippet and go to form view', () => {
        cy.clickBackToMarkupDisplayButton();
        cy.clickBottomChip('Respirationrate', true);
        cy.editSnippetFromBottomSection('Respirationrate');
        cy.drawSingleRect(multiSnippet[multiSnippet.length - 2], 'top-left', true);
        cy.clickSaveSnippetButton();
        cy.wait(1000);
        cy.get('[data-cy=form-view]').click();
        cy.getSnapshot('[data-cy=canvas-content]');
      });

      it('Edit snippet, without click save snippet and go to form view should cancel edit mode and snippet should be updated', () => {
        cy.get('[data-cy=native-view]').click();
        cy.clickBottomChip('Respirationrate', true);
        cy.editSnippetFromBottomSection('Respirationrate');
        cy.drawSingleRect(multiSnippet[multiSnippet.length - 1]);
        cy.clickSaveSnippetButton();
        cy.wait(1000);
        cy.get('[data-cy=form-view]').click();
        cy.getSnapshot('[data-cy=canvas-content]');
      });

      it('Edit snippet, click save snippet and go to submit snippet', () => {
        cy.get('[data-cy=native-view]').click();
        cy.clickBottomChip('Respirationrate', true);
        cy.editSnippetFromBottomSection('Respirationrate');
        cy.clickXIcon(updateYPaddingSnippet(multiSnippet[multiSnippet.length - 1]));
        cy.clickSaveSnippetButton();
        cy.wait(1000);
        cy.clickSubmitToFormViewDisplayButton();
        cy.getSnapshot('[data-cy=canvas-content]');
      });

      it('Edit snippet, without click save snippet and submit snippet should cancel edit mode and snippet should be updated', () => {
        cy.clickBackToMarkupDisplayButton();
        cy.clickBottomChip('Respirationrate', true);
        cy.editSnippetFromBottomSection('Respirationrate');
        cy.drawSingleRect(multiSnippet[multiSnippet.length - 1]);
        cy.clickSaveSnippetButton();
        cy.wait(1000);
        cy.clickSubmitToFormViewDisplayButton();
        cy.getSnapshot('[data-cy=canvas-content]');
      });

      it('Hover into bottom chip when in form view, should not be able to see nor click edit and delete icon', () => {
        cy.clickBackToMarkupDisplayButton();
        cy.get('[data-cy=native-view]').click();
        cy.clickBottomChip('Respirationrate', true);
        cy.wait(1000);
        cy.get('[data-cy=form-view]').click();
        cy.checkBottomChipClickableHoverable('Respirationrate', false);
        cy.clickSubmitToFormViewDisplayButton();
      });

      it('On Form view click on rectangle should not redirect to native view', () => {
        cy.clickBackToMarkupDisplayButton();
        cy.get('[data-cy=form-view]').click();
        cy.clickRect({
          x: 20,
          y: 80,
          x2: 70,
          y2: 120,
        });
        cy.getSnapshot('[data-cy=canvas-content]');
      });

      it('Go to form view, and finally back to snippet or grayout page. The snippet page should not select any bottom chips', () => {
        cy.get('[data-cy=native-view]').click();
        cy.clickBottomChip('BloodType');
        cy.editSnippetFromBottomSection('BloodType');
        cy.zoomReset();
        cy.wait(1000);
        cy.drawSingleRect(
          { ...singleSnippet, x: singleSnippet.x + 70, x2: singleSnippet.x2 + 70 },
          'top-left',
          true,
        );
        cy.checkBottomChipActiveOrInactive('BloodType');
        cy.clickSaveSnippetButton();

        cy.get('[data-cy=form-view]').click();
        cy.get('[data-cy=native-view]').click();
        cy.get('[data-cy=canvas-container] canvas').realHover({
          scrollBehavior: 'center',
          position: 'center',
          pointer: 'mouse',
        });
        cy.checkBottomChipActiveOrInactive('BloodType', false);
        cy.checkBottomChipActiveOrInactive('Respirationrate', false);
        cy.removeChipFromBottomSection('Respirationrate', 'delete');
      });
    });

    describe.skip('Submitting snippet', () => {
      before(() => {
        cy.get('[data-cy=NOT_AVAILABLE_REJECTED]').click();
        cy.clickQuickAction(
          '[data-cy=question-card-brain1]',
          '[data-cy=question-card-brain1] > .question-card-action-menu > .ant-row > [data-cy="edit-snippet-action-brain1"]',
        );
        cy.waitForCanvasToLoad();
        cy.removeTooltipIfVisible();
      });

      it('Delete a marked up item, and submit snippet should keep deleted chip on right menu', () => {
        cy.clickCancelNonStreamline();
        cy.clickSnippetTool('ZoomOut');
        cy.clickBottomChip('BloodPressure', true);
        cy.removeChipFromBottomSection('BloodPressure', 'delete');
        cy.clickSubmitToFormViewDisplayButton();
        const aliasUpdateFFGRMarkup = UpdateFfgrMarkupDocument.definitions[0].name.value;
        cy.intercept('POST', '/graphql', (req) => {
          if (req.body.operationName === aliasUpdateFFGRMarkup) {
            req.alias = req.body.operationName;
            req.reply({
              data: {
                updateFFGRsMarkUp: [
                  {
                    formFieldGroupResponseId: markupRejected[0].formFieldGroupResponse?.id,
                    error: null,
                    updatedFFG: {
                      id: 'lungs1',
                      formFieldGroupResponse: {
                        id: markupRejected[0].formFieldGroupResponse?.id,
                        status: 'ATTACHED',
                        __typename: 'FormFieldGroupResponse',
                      },
                      __typename: 'FieldGroupVisitDetail',
                    },
                    __typename: 'UpdatedBulkFFGR',
                  },
                ],
              },
            });
          }
        });
        cy.get('[data-cy=done-snippet-button]').click();
        cy.wait(`@${aliasUpdateFFGRMarkup}`);
      });

      it('On attached sc, select snippet item and submit should not show snippet item chip on right menu', () => {
        cy.get('[data-cy=ATTACHED]').click();
        cy.clickQuickAction(
          '[data-cy=question-card-bloodType1]',
          '[data-cy=question-card-bloodType1] > .question-card-action-menu > .ant-row > [data-cy="snippet-action-bloodType1"]',
        );
        cy.waitForCanvasToLoad();
        cy.removeTooltipIfVisible();
        cy.waitForReact();
        cy.removeTooltipIfVisible();
        cy.drawSnippetAndSelect(singleSnippet, 'Respiration rate');
        cy.clickSubmitToFormViewDisplayButton();
        const aliasUpdateFFGRMarkup = UpdateFfgrMarkupDocument.definitions[0].name.value;
        cy.intercept('POST', '/graphql', (req) => {
          if (req.body.operationName === aliasUpdateFFGRMarkup) {
            req.alias = req.body.operationName;
            req.reply({
              data: {
                updateFFGRsMarkUp: [
                  {
                    formFieldGroupResponseId: markupRejected[0].formFieldGroupResponse?.id,
                    error: null,
                    updatedFFG: {
                      id: 'lungs1',
                      formFieldGroupResponse: {
                        id: markupRejected[0].formFieldGroupResponse?.id,
                        status: 'MARKED_UP',
                        __typename: 'FormFieldGroupResponse',
                      },
                      __typename: 'FieldGroupVisitDetail',
                    },
                    __typename: 'UpdatedBulkFFGR',
                  },
                ],
              },
            });
          }
        });
        cy.get('[data-cy=done-snippet-button]').click();
        cy.wait(`@${aliasUpdateFFGRMarkup}`);
      });
    });
  },
);
