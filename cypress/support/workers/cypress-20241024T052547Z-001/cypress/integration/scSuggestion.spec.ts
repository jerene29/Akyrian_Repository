import 'cypress-localstorage-commands';

import {
  GetVisitDetailsDocument,
  IFieldGroupVisitDetail,
  ISuggestionFormField,
  AttachFfgRsToSourceCaptureDocument,
} from '../../src/graphQL/generated/graphql';
import generateColors from '../../src/helpers/generateColors';

describe(
  'SC Suggestion',
  {
    viewportHeight: 789,
    viewportWidth: 1440,
  },
  () => {
    let visitDetails;

    let unattachedFGs: IFieldGroupVisitDetail[] = [];

    const aliasGetVisitDetailSC =
      'name' in GetVisitDetailsDocument.definitions[0]
        ? GetVisitDetailsDocument.definitions[0].name?.value
        : 'GetVisitDetails';
    const aliasAttachFfgRsToSourceCaptureDocument =
      'name' in AttachFfgRsToSourceCaptureDocument.definitions[0]
        ? AttachFfgRsToSourceCaptureDocument.definitions[0].name?.value
        : 'AttachFfgRsToSourceCapture';
    before(() => {
      cy.reseedDB();
      cy.clearLocalStorageSnapshot();
      cy.fillInloginAsFormV2({
        email: 'admin@example.com',
      });
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasGetVisitDetailSC) {
          req.alias = req.body.operationName;
        }
      });
      cy.waitForReact();
      cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit1Visit1');
      cy.wait(`@${aliasGetVisitDetailSC}`).then((result) => {
        if (result?.response?.statusCode === 200) {
          visitDetails = result.response.body.data.visitDetails.withSourceForm;
          unattachedFGs = visitDetails.fieldGroups
            ?.filter(
              (FG: IFieldGroupVisitDetail) =>
                FG.formFieldGroupResponse?.status === 'UNATTACHED' ||
                FG.formFieldGroupResponse?.status === 'NOT_AVAILABLE_REJECTED' ||
                FG.formFieldGroupResponse?.status === 'NOT_AVAILABLE_INVESTIGATOR_REJECTED' ||
                FG.formFieldGroupResponse?.status === 'SOURCE_CAPTURE_REJECTED',
            )
            .sort((a: IFieldGroupVisitDetail, b: IFieldGroupVisitDetail) => {
              if (a.id > b.id) {
                return 1;
              }
              if (a.id < b.id) {
                return -1;
              }
              return 0;
            });
          cy.get('[data-cy=sourceQuestionTab').click();
        }
      });
    });

    describe('Source Capture Suggestion', () => {
      let suggestionsSC: ISuggestionFormField[] = [];

      before(() => {
        cy.openAndCheckAttachModal(unattachedFGs);
        cy.uploadFile('EMR-kylie.jpg');
        cy.uploadRedaction('verified');
        cy.confirmRedactionRedirectToSuggestion('continue');
      });

      it('Right Chips Menu: Check questions and colors', () => {
        cy.fixture('detachReattachAndAttachSC.json').then((value) => {
          const dataSuggestion = value.suggestionSC.data;
          suggestionsSC = dataSuggestion.sourceCaptureSuggestions.suggestionFormField;
          dataSuggestion.sourceCaptureSuggestions.suggestionFormField.map(
            (FF: ISuggestionFormField, index: number) => {
              const colorWithOpacity = generateColors.getColorsSuggestion(index);
              const colorSplit = colorWithOpacity.split(',');
              const colorWithoutOpacity = `${colorSplit
                .splice(0, colorSplit.length - 1)
                .join(', ')})`;
              cy.wait(5000);
              cy.get(`[data-cy=right-chip-text-${FF.shortQuestion.split(' ').join('')}]`).should(
                'exist',
              );
              cy.get(`[data-cy=right-chip-${FF.shortQuestion.split(' ').join('')}]`)
                .realHover()
                .should('have.css', 'border-color', colorWithoutOpacity);
            },
          );
        });
      });

      it('Right Chips Menu: Check right menu onHover chips should change button fill color, and update canvas highlighting the hovered question (screen shot)', () => {
        cy.get(
          `[data-cy=right-chip-text-${suggestionsSC[0].shortQuestion.split(' ').join('')}]`,
        ).trigger('mouseover');
        cy.wait(1000);
        cy.get('[data-cy=canvas-content]').matchImageSnapshot({
          failureThreshold: 100,
          failureThresholdType: 'percent',
        });
      });

      it('Right Chips Menu: Click chip should move it to Bottom Chip Menu', () => {
        cy.get(
          `[data-cy=right-chip-${suggestionsSC[0].shortQuestion.split(' ').join('')}]`,
        ).click();
        cy.get(`[data-cy=right-chip-${suggestionsSC[0].shortQuestion.split(' ').join('')}]`).should(
          'not.exist',
        );
        cy.get(
          `[data-cy=bottom-chip-${suggestionsSC[0].shortQuestion.split(' ').join('')}]`,
        ).should('be.visible');
      });

      it('Bottom Chips menu: ﻿onHover chips should change button fill color, show x icon on chip, and update canvas highlighting the hovered question (screen shot)', () => {
        cy.get(
          `[data-cy=bottom-chip-${suggestionsSC[0].shortQuestion.split(' ').join('')}]`,
        ).trigger('mouseover');
        cy.wait(1000);
        cy.get('[data-cy=canvas-content]').matchImageSnapshot({
          failureThreshold: 100,
          failureThresholdType: 'percent',
        });
      });

      it('Bottom Chips menu: onClick x icon on chip should move the chip back to right menu', () => {
        cy.get(
          `[data-cy=bottom-chip-${suggestionsSC[0].shortQuestion.split(' ').join('')}]`,
        ).realHover();
        cy.get(
          `[data-cy=bottom-chip-delete-${suggestionsSC[0].shortQuestion.split(' ').join('')}]`,
        ).click();
        cy.get(`[data-cy=right-chip-${suggestionsSC[0].shortQuestion.split(' ').join('')}]`).should(
          'be.visible',
        );
      });

      it('Hovering on highlight should show highlight and  hover on chips as well', () => {
        const area = suggestionsSC[0].detectedRegions[3];
        cy.get('[data-cy=canvas-container] canvas').trigger('mousemove', {
          x: area.x + area.w / 2,
          y: area.y + area.h / 2,
          force: true,
        });

        cy.wait(2000);

        const colorWithOpacity = generateColors.getColorsSuggestion(0);
        const colorSplit = colorWithOpacity.split(',');
        const colorWithoutOpacity = `${colorSplit.splice(0, colorSplit.length - 1).join(', ')})`;
        cy.get(`[data-cy=right-chip-${suggestionsSC[0].shortQuestion.split(' ').join('')}]`)
          .realHover()
          .should('have.css', 'border-color', colorWithoutOpacity);
        cy.get('[data-cy=canvas-content]').matchImageSnapshot({
          failureThreshold: 100,
          failureThresholdType: 'percent',
        });
      });

      it('Submit SC Suggestion', () => {
        cy.get(
          `[data-cy=right-chip-${suggestionsSC[0].shortQuestion.split(' ').join('')}]`,
        ).click();
        cy.get(
          `[data-cy=right-chip-${suggestionsSC[1].shortQuestion.split(' ').join('')}]`,
        ).click();
        cy.fixture('detachReattachAndAttachSC.json').then((value) => {
          const dataAttchFFGR = value.attachFFGr.data;

          cy.intercept('POST', '/graphql', (req) => {
            if (req.body.operationName === aliasAttachFfgRsToSourceCaptureDocument) {
              req.alias = req.body.operationName;
              req.reply({
                data: dataAttchFFGR,
              });
            }
          });
          cy.get('[data-cy=submit-bottom-chips-menu]').click();
          cy.wait(`@${aliasAttachFfgRsToSourceCaptureDocument}`).then((result) => {
            if (result?.response?.statusCode === 200) {
              cy.wait(2000);
            }
          });
        });
      });
    });
  },
);
