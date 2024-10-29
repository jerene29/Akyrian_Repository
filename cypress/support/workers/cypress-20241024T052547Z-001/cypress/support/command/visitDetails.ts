import 'cypress-file-upload';
import { RealHoverOptions } from 'cypress-real-events/commands/realHover';
import { ScrollBehaviorOptions } from 'cypress-real-events/getCypressElementCoordinates';
import { isStatusIncluded } from '../../../src/helpers/statusValidation';

import {
  IFieldGroupVisitDetail,
  IFormFieldGroupResponseStatus,
  IFormFieldType,
  ISourceCapture,
} from '../../../src/graphQL/generated/graphql';

Cypress.Commands.add('openAndSubmitEditAnswerReason', () => {
  cy.get('[data-cy=change-answer-action] svg').click({ force: true });
  cy.get('[data-cy=edit-answer-modal]').should('exist');
  cy.get('[data-cy=edit-reason-select]').should('exist').click().type('{enter}');
  cy.get('[data-cy=begin-editing-button]').click();
});

Cypress.Commands.add('checkSaveCancelAndInputBehavior', (FG) => {
  // CHECK SAVE AND CANCEL ON CLICKING CARD BEHAVIOUR
  const questionCard = cy.get(`[data-cy=question-card-${FG.id}`);
  questionCard.trigger('click');

  // SAVE AND CANCEL SHOULD BE VISIBLE
  const saveButton = cy.get(`[data-cy=save-button-${FG.id}]`);
  saveButton.should('exist');
  // SAVE BUTTON SHOULD BE GREY
  saveButton.should('have.css', 'backgroundColor', 'rgb(134, 137, 168)');
  const cancelButton = cy.get(`[data-cy=cancel-button-${FG.id}]`);
  cancelButton.should('exist');

  // ON CLICK CANCEL, SAVE AND CANCEL BUTTON WILL DISAPPEAR
  cancelButton.trigger('click');
  saveButton.should('not.exist');
  cancelButton.should('not.exist');

  // CHECK ON FOCUS INPUT BEHAVIOUR
  FG.fields.map((field) => {
    // const questionCard = cy.get(`[data-cy=question-card-${FG.id}`);
    // questionCard.scrollIntoView();
    if (
      (field.type === IFormFieldType.SingleChoice && field.choices.length >= 3) ||
      field.type === IFormFieldType.MultipleChoice
    ) {
      // SELECT AN OPTION
      cy.get(`[data-cy=answer-input-${FG.id}-0] input`).click({ force: true });
      cy.get(`#${field.choices[0].id}`).click();

      // SAVE BUTTON SHOULD TURN BLUE
      const saveButton = cy.get(`[data-cy=save-button-${FG.id}]`);
      saveButton.should('have.css', 'backgroundColor', 'rgb(61, 97, 215)');

      // ON CLICK CANCEL
      cy.get(`[data-cy=cancel-button-${FG.id}]`).click();

      // SHOULD EMPTY SELECT INPUT
      cy.get(`[data-cy=answer-input-${FG.id}-0] input`).should('have.value', '');
    } else if (field.type !== IFormFieldType.File && field.type !== IFormFieldType.SingleChoice) {
      // TYPE ON THE INPUT
      const inputElContainer = cy.get(`[data-cy=answer-input-${FG.id}-0]`);
      if (field.type === IFormFieldType.Date) {
        // cy.get(`input[name=${field.id}0]`).click();
        cy.get(`input[name=${field.id}0-input]`).type('2021-01-01', { force: true });
      } else {
        inputElContainer.type('abc', { force: true });
      }

      // SAVE BUTTON SHOULD TURN BLUE
      const saveButton = cy.get(`[data-cy=save-button-${FG.id}]`);
      saveButton.should('have.css', 'backgroundColor', 'rgb(61, 97, 215)');

      // ON CLICK CANCEL
      cy.get(`[data-cy=cancel-button-${FG.id}]`).click();

      // SHOULD EMPTY INPUT
      cy.get(`[data-cy=answer-input-${FG.id}-0]`).should('have.value', '');
    } else if (field.type === IFormFieldType.SingleChoice && field.choices.length < 3) {
      // CLICK ON RADIO BUTTON
      const firstRadio = cy.get(`[data-cy=answer-input-${field.choices[0].id}-${FG.id}-0]`);
      firstRadio.parent().click({ force: true });
      cy.get(`[data-cy=answer-input-${field.choices[0].id}-${FG.id}-0]`).should('be.checked');

      // SAVE BUTTON SHOULD TURNED BLUE
      cy.get(`[data-cy=save-button-${FG.id}]`).should(
        'have.css',
        'backgroundColor',
        'rgb(61, 97, 215)',
      );

      // OTHER RADIO BUTTONS SHOULD NOT BE CHECKED BECAUSE ALREADY CHECKED ONE
      field.choices.map((choice, index) => {
        if (index !== 0) {
          cy.get(`[data-cy=answer-input-${choice.id}-${FG.id}-0]`).parent().click({ force: true });
          cy.get(`[data-cy=answer-input-${choice.id}-${FG.id}-0]`).should('not.be.checked');
        }
      });

      // CLICKING ON CANCEL BUTTON
      cy.get(`[data-cy=cancel-button-${FG.id}]`).click();

      // CHOULD UNCHECK ALL RADIO BUTTONS
      field.choices.map((choice) => {
        cy.get(`[data-cy=answer-input-${choice.id}-${FG.id}-0]`).should('not.be.checked');
      });
    } else if (field.type === IFormFieldType.File) {
      cy.get(`[data-cy=answer-input-${FG.id}-0]`)
        .click({
          multiple: true,
          force: true,
        })
        .then(() => {
          cy.get('[data-cy=warning-upload]').should('be.visible');
          cy.get('[data-cy=confirmModal-confirmButton]').should('be.visible');
          cy.get('[data-cy=confirmModal-cancelButton]').should('be.visible');
          cy.get('[data-cy=confirmModal-cancelButton]').click({
            multiple: true,
            force: true,
          });
        });
    }
    cy.wait(500);
  });
  cy.wait(500);
});

// TODO: Refactor this to handle data-cy with combination status now won't be used
Cypress.Commands.add('checkFilterExceptAllFilter', (withSourceForm) => {
  withSourceForm.userVisitData.map((visitData) => {
    cy.get(`[data-cy=${visitData.status[0]}]`).contains('p', visitData.label);
  });
});

// TODO: Refactor this to handle data-cy with combination status now won't be used
Cypress.Commands.add('checkFilterAllFilter', (withSourceForm) => {
  withSourceForm.allVisitData.map((visitData) => {
    const fieldGroups = withSourceForm.fieldGroups.filter((FG) =>
      visitData.status.includes(FG.formFieldGroupResponse.status),
    );
    if (fieldGroups.length > 0) {
      cy.get(`[data-cy=all-${visitData.status.join('')}]`)
        .should('exist')
        .contains('p', `${visitData.label} (${fieldGroups.length})`);
    }
  });
});

Cypress.Commands.add('checkTotalQuestionCardExceptOnAllFilter', (visitDetails) => {
  cy.get('[data-cy=all-filter]')
    .click()
    .then(() => {
      cy.get('[data-cy=question-container]').should('have.length', visitDetails.fieldGroups.length);
    });
});

// TODO: Refactor this to handle data-cy with combination status now won't be used
Cypress.Commands.add('checkQuestionValue', (visitDetails, type: 'source' | 'noSource') => {
  visitDetails.userVisitData.map((visitData) => {
    cy.get(`[data-cy=${visitData.status[0]}]`)
      .click()
      .then(() => {
        visitDetails.fieldGroups.map((FG) => {
          if (visitData.status.includes(FG.formFieldGroupResponse.status)) {
            cy.get(`[data-cy=question-${FG.id}`).contains(
              'p',
              type === 'source' ? FG.shortQuestion : FG.question,
            );
          }
        });
      });
  });
});

Cypress.Commands.add('checkAuditTrail', (visitDetails) => {
  visitDetails.userVisitData.map((visitData) => {
    cy.get(`[data-cy=${visitData.status[0]}]`)
      .click()
      .then(() => {
        visitDetails.fieldGroups.map((FG) => {
          if (visitData.status.includes(FG.formFieldGroupResponse.status)) {
            if (FG.hasAuditTrail) {
              cy.get('[data-cy=audit-trail-badge').should('not.exist');
              cy.get('[data-cy=audit-trail-text').should('exist');
              cy.get('[data-cy=audit-trail-icon').should('exist');
            } else if (FG.hasUnreadAuditTrail) {
              cy.get('[data-cy=audit-trail-badge').should('exist');
              cy.get('[data-cy=audit-trail-text').should('exist');
              cy.get('[data-cy=audit-trail-icon').should('exist');
            } else {
              cy.get('[data-cy=audit-trail-badge').should('not.exist');
              cy.get('[data-cy=audit-trail-text').should('not.exist');
              cy.get('[data-cy=audit-trail-icon').should('not.exist');
            }
          }
        });
      });
  });
});

Cypress.Commands.add('checkQuickActions', (visitDetails) => {
  visitDetails.userVisitData.map((visitData) => {
    const filterButtonEl = cy.get(`[data-cy=${visitData.status[0]}]`);
    filterButtonEl.click().then(() => {
      visitDetails.fieldGroups.map((FG) => {
        if (visitData.status.includes(FG.formFieldGroupResponse.status)) {
          const questionCard = cy.get(`[data-cy=question-card-${FG.id}`);
          questionCard.scrollIntoView();
          questionCard.trigger('mouseover');
          visitData.quickActions.map((quickAction) => {
            if (quickAction.edit) {
              cy.get('[data-cy=change-answer-action]').should('exist');
            } else {
              cy.get('[data-cy=change-answer-action]').should('not.exist');
            }
            if (quickAction.markAsNoAnswer) {
              cy.get('[data-cy=noanswer-action]').should('exist');
            } else {
              cy.get('[data-cy=noanswer-action]').should('not.exist');
            }
            if (quickAction.addQuery) {
              cy.get('[data-cy=add-query-action]').should('exist');
            } else {
              cy.get('[data-cy=add-query-action]').should('not.exist');
            }
            if (quickAction.acceptReject) {
              cy.get('[data-cy=accept-reject-action]').should('exist');
            } else {
              cy.get('[data-cy=accept-reject-action]').should('not.exist');
            }

            if (quickAction.capture) {
              cy.get('[data-cy=capture-action]').should('exist');
            } else {
              cy.get('[data-cy=capture-action]').should('not.exist');
            }

            if (quickAction.editReattach) {
              cy.get('[data-cy=reattach-action]').should('exist');
            } else {
              cy.get('[data-cy=reattach-action]').should('not.exist');
            }

            if (quickAction.detach) {
              cy.get('[data-cy=detach-action]').should('exist');
            } else {
              cy.get('[data-cy=detach-action]').should('not.exist');
            }

            if (quickAction.snippetMaking) {
              cy.get('[data-cy=snippet-action]').should('exist');
            } else {
              cy.get('[data-cy=snippet-action]').should('not.exist');
            }

            if (quickAction.editSnippet) {
              cy.get('[data-cy=edit-snippet-action]').should('exist');
            } else {
              cy.get('[data-cy=edit-snippet-action]').should('not.exist');
            }

            if (quickAction.acceptReject) {
              cy.get('[data-cy=accept-reject-action]').should('exist');
            } else {
              cy.get('[data-cy=accept-reject-action]').should('not.exist');
            }

            if (quickAction.dataEntry) {
              cy.get('[data-cy=data-entry-action]').should('exist');
            } else {
              cy.get('[data-cy=data-entry-action]').should('not.exist');
            }

            // NOT AVAILABLE UI
            if (quickAction.verification) {
              cy.get('[data-cy=verification-action]').should('exist');
            } else {
              cy.get('[data-cy=verification-action]').should('not.exist');
            }

            if (quickAction.addReason) {
              cy.get('[data-cy=addReason-action]').should('exist');
            } else {
              cy.get('[data-cy=addReason-action]').should('not.exist');
            }
          });
        }
      });
    });
  });
});

Cypress.Commands.add('checkQueryButton', (visitDetails) => {
  visitDetails.userVisitData.map((visitData) => {
    const filterButtonEl = cy.get(`[data-cy=${visitData.status[0]}]`);
    filterButtonEl.click().then(() => {
      visitDetails.fieldGroups.map((FG) => {
        if (visitData.status.includes(FG.formFieldGroupResponse.status)) {
          const queryInfo = visitData.queryVisitData.filter(
            (queryData) => queryData.responseQueryStatus === FG.responseQueryStatus,
          );
          if (queryInfo[0]) {
            const queryTag = cy.get(`[data-cy=query-tag-${FG.id}]`);
            queryTag.should('exist');
            queryTag.should('have.backgroundColor', queryInfo[0].labelColor);
            cy.get(`[data-cy=query-tag-${FG.id}] span p`).contains(queryInfo[0].label);
          } else {
            cy.get(`[data-cy=query-tag-${FG.id}]`).should('not.exist');
          }
        }
      });
    });
  });
});

Cypress.Commands.add('checkAssociated', (associates: Array<IFieldGroupVisitDetail>, firstFGID) => {
  associates.map((associatedFG) => {
    if (associatedFG.id !== firstFGID) {
      cy.get(`[data-cy=associated-${associatedFG.formFieldGroupResponse?.id}]`).should('exist');
    } else {
      cy.get(`[data-cy=associated-${associatedFG.formFieldGroupResponse?.id}]`).should('not.exist');
    }
  });
});

Cypress.Commands.add('checkHighlight', (firstFG) => {
  firstFG.formFieldGroupResponse.parsedDetectedRegions.map((region, index) => {
    cy.get(`[data-cy=highlight-${firstFG.formFieldGroupResponse.sourceCaptureId}]-${index}`).should(
      'be.visible',
    );
  });
});

Cypress.Commands.add('getFirstFGandSCandSCImgs', (visitDetailsSource, visitData) => {
  let firstFG: IFieldGroupVisitDetail | null = null;
  let firstSc = null;
  let sourceCaptImages: Array<ISourceCapture> = [];
  visitDetailsSource.fieldGroups.map((FG) => {
    if (
      FG.formFieldGroupResponse &&
      FG.formFieldGroupResponse.status !== IFormFieldGroupResponseStatus.Unattached
    ) {
      if (isStatusIncluded(visitData.status, FG.formFieldGroupResponse.status)) {
        const scs = visitDetailsSource.sourceCaptures.filter(
          (sc) => sc.id === FG.formFieldGroupResponse.sourceCaptureId,
        );
        sourceCaptImages = [...sourceCaptImages, ...scs];
        if (firstFG === null) {
          firstFG = FG;
          firstSc = scs[0];
        }
      }
    }
  });
  return {
    firstFG,
    firstSc,
    sourceCaptImages,
  };
});

Cypress.Commands.add(
  'clickQuickAction',
  (
    parentSelector: string,
    iconSelector: string,
    scrollBehavior: ScrollBehaviorOptions = 'center',
    position: RealHoverOptions['position'] = 'center',
    // NOTE: try between these 2 types whichever pass for your case
    type: 'NORMAL' | 'PARENT_RELATION' | 'SVG' = 'NORMAL',
  ) => {
    if (type === 'NORMAL') {
      cy.get(`${parentSelector}`)
        .should('be.visible')
        .realHover({
          scrollBehavior,
          position,
          pointer: 'mouse',
        })
        .get(`${iconSelector}`)
        .should('be.visible')
        .click({
          scrollBehavior: false,
          timeout: 10000,
        });
      cy.wait(1000);
    } else if (type === 'PARENT_RELATION') {
      cy.get(`${parentSelector}`)
        .should('be.visible')
        .realHover()
        .get(`${parentSelector} > .question-card-action-menu > .ant-row > ${iconSelector}`)
        .should('be.visible')
        .click();
      cy.wait(1000);
    } else if (type === 'SVG') {
      // TODO: use this later, maybe could solve intermittent quickAction on cypress
      cy.get(`${iconSelector} svg`).click({ force: true });
    }
  },
);

Cypress.Commands.add('editNoSourceQuestionReason', (ffgrId: string, reasonLabel?: string) => {
  cy.get(`[data-cy=edit-reason-select-${ffgrId}] > .ant-select`).click({ force: true });
  cy.get(`[label="${reasonLabel || 'Data entry error'}"]`).click({ force: true });
});
