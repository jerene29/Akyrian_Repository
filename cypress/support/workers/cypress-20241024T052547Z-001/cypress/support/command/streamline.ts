import { OperationDefinitionNode } from 'graphql';
import {
  RejectMarkUpFfgrDocument,
  RejectDataEntryFfgrsDocument,
  AcceptDataEntryFfgrWithScDocument,
  GetVisitDetailsDocument,
} from '../../../src/graphQL/generated/graphql';
import { OCRName } from './canvas';

export type RejectModal = 'SC' | 'Snippet' | 'DE';
export type AcceptRejectParams = { onSuccess: () => void };

/**
 * @name rejectDE
 * @param nextQuestion nextquestion FFGR id after rejecting if any
 */
Cypress.Commands.add('rejectDE', ({ onSuccess }: AcceptRejectParams) => {
  const rejectDEDefinitions = RejectDataEntryFfgrsDocument
    .definitions[0] as OperationDefinitionNode;
  const visitDetailDefinitions = GetVisitDetailsDocument.definitions[0] as OperationDefinitionNode;

  const aliasRejectDE = rejectDEDefinitions.name?.value;
  const aliasVisitDetails = visitDetailDefinitions.name?.value;

  cy.get('[data-cy=reject-de-bottom-button]').should('exist').click();
  cy.intercept('POST', '/graphql', (req) => {
    if (req.body.operationName === aliasRejectDE) {
      req.alias = req.body.operationName;
    }
    if (req.body.operationName === aliasVisitDetails) {
      req.alias = req.body.operationName;
    }
  });
  cy.get('[data-cy=edit-reason]').click().type(`{enter}`);
  cy.get('[data-cy=submit-reject-de]').click();
  cy.wait(`@${aliasRejectDE}`);
  cy.wait(`@${aliasVisitDetails}`);
  onSuccess();
});

/**
 * @name rejectSnippet
 * @param nextQuestion nextquestion FFGR id after rejecting if any
 */
Cypress.Commands.add('rejectSnippet', ({ onSuccess }: AcceptRejectParams) => {
  const rejectMarkupDefinitions = RejectMarkUpFfgrDocument
    .definitions[0] as OperationDefinitionNode;
  const visitDetailDefinitions = GetVisitDetailsDocument.definitions[0] as OperationDefinitionNode;

  const aliasRejectMarkUp = rejectMarkupDefinitions.name?.value;
  const aliasVisitDetails = visitDetailDefinitions.name?.value;

  cy.get('[data-cy=overlapping-button-reject-snippet]').click();
  cy.intercept('POST', '/graphql', (req) => {
    if (req.body.operationName === aliasRejectMarkUp) {
      req.alias = req.body.operationName;
    }
    if (req.body.operationName === aliasVisitDetails) {
      req.alias = req.body.operationName;
    }
  });

  cy.get('[data-cy=reject-reason]').click().type(`{enter}`);
  cy.get('[data-cy=submit-reject-reason]').click();
  cy.wait(`@${aliasRejectMarkUp}`);
  cy.wait(`@${aliasVisitDetails}`);
  onSuccess();
});

/**
 * @name rejectSC
 * @param nextQuestion nextquestion FFGR id after rejecting if any
 */
Cypress.Commands.add('rejectSC', ({ onSuccess }: AcceptRejectParams) => {
  const rejectMarkupDefinitions = RejectMarkUpFfgrDocument
    .definitions[0] as OperationDefinitionNode;
  const visitDetailDefinitions = GetVisitDetailsDocument.definitions[0] as OperationDefinitionNode;

  const aliasRejectMarkUp = rejectMarkupDefinitions.name?.value;
  const aliasVisitDetails = visitDetailDefinitions.name?.value;

  cy.get('[data-cy=overlapping-button-reject-sc]').should('exist').click();
  cy.intercept('POST', '/graphql', (req) => {
    if (req.body.operationName === aliasRejectMarkUp) {
      req.alias = req.body.operationName;
    }
    if (req.body.operationName === aliasVisitDetails) {
      req.alias = req.body.operationName;
    }
  });
  cy.get('[data-cy=edit-reason]').click().type(`{enter}`);
  cy.get('[data-cy=submit-reject-sc]').click();
  cy.wait(`@${aliasRejectMarkUp}`);
  cy.wait(`@${aliasVisitDetails}`);
  onSuccess();
});

/**
 * @name acceptDE
 */
Cypress.Commands.add('acceptDE', ({ onSuccess }: AcceptRejectParams) => {
  const acceptDEWithSCDefinitions = AcceptDataEntryFfgrWithScDocument
    .definitions[0] as OperationDefinitionNode;
  const visitDetailDefinitions = GetVisitDetailsDocument.definitions[0] as OperationDefinitionNode;

  const aliasAcceptDE = acceptDEWithSCDefinitions.name?.value;
  const aliasVisitDetails = visitDetailDefinitions.name?.value;

  cy.intercept('POST', '/graphql', (req) => {
    if (req.body.operationName === aliasAcceptDE) {
      req.alias = req.body.operationName;
    }
    if (req.body.operationName === aliasVisitDetails) {
      req.alias = req.body.operationName;
    }
  });

  cy.get('[data-cy=button-approve-sa]').click();

  cy.wait(`@${aliasAcceptDE}`);
  cy.wait(`@${aliasVisitDetails}`);
  onSuccess();
});

/**
 * @name checkRejectModalFunctionality
 * @param type type of the reject modal
 */
Cypress.Commands.add('checkRejectModalFunctionality', (type: RejectModal) => {
  if (type === 'SC') {
    cy.get('[data-cy=overlapping-button-reject-sc]').should('exist').click();
    cy.get('[data-cy=reject-sc-overlay]').should('be.visible');
    cy.get('[data-cy=close-reject-sc]').click();
    cy.get('[data-cy=reject-sc-overlay]').should('not.exist');
  } else if (type === 'Snippet') {
    cy.get('[data-cy=overlapping-button-reject-snippet]').should('exist').click();
    cy.get('[data-cy=reject-snippet-overlay]').should('be.visible');
    cy.get('[data-cy=close-reject]').click();
    cy.get('[data-cy=reject-snippet-overlay]').should('not.exist');
  } else if (type === 'DE') {
    cy.get('[data-cy=reject-de-bottom-button]').should('exist').click();
    cy.get('[data-cy=reject-de-overlay]').should('be.visible');
    cy.get('[data-cy=close-reject-de]').click();
    cy.get('[data-cy=reject-de-overlay]').should('not.exist');
  }
});

export type QuestionType =
  | 'MARKED_NO_ANSWER_WITH_SC_FROM_FILLED'
  | 'MARKED_NO_ANSWER_WITHOUT_SC'
  | 'MARKED_NO_ANSWER_WITH_SC_FROM_ATTACHED'
  | 'FILLED_FROM_SC';

/**
 * @name checkSnippetAssessmentUI
 * @param type condition of the question
 */
Cypress.Commands.add('checkSnippetAssessmentUI', (type: QuestionType = 'FILLED_FROM_SC') => {
  if (type === 'MARKED_NO_ANSWER_WITH_SC_FROM_ATTACHED') {
    cy.get('[data-cy=sa-info-text]').contains(
      'By clicking approve, you will accept the Source Capture and Data Entry',
    );
    cy.get('[data-cy=No-Answer-status]').should('be.visible');
    cy.get('[data-cy=reject-de-bottom-button]').contains('Reject');
    cy.get('[data-cy=overlapping-button-reject-snippet]').should('not.exist');
    cy.get('[data-cy=overlapping-button-reject-sc]').should('not.exist');
    cy.get('[data-cy=button-approve-sa]').contains('Approve All');
  } else if (type === 'MARKED_NO_ANSWER_WITH_SC_FROM_FILLED') {
    cy.get('[data-cy=sa-info-text]').contains(
      'By clicking approve, you will accept the Source Capture and Data Entry',
    );
    cy.get('[data-cy=reject-de-bottom-button]').contains('Reject Data Entry');
    cy.get('[data-cy=No-Answer-status]').should('be.visible');
    cy.get('[data-cy=overlapping-button-reject-snippet]')
      .should('be.visible')
      .contains('Reject Snippet');
    cy.get('[data-cy=overlapping-button-reject-sc]')
      .should('be.visible')
      .contains('Reject Source Capture');
  } else if (type === 'MARKED_NO_ANSWER_WITHOUT_SC') {
    cy.get('[data-cy=sa-info-text]').contains('By clicking approve you will accept the Data Entry');
    cy.contains('No Image Found');
    cy.get('[data-cy=No-Answer-status]').should('be.visible');
    cy.get('[data-cy=reject-de-bottom-button]').contains('Reject');
    cy.get('[data-cy=overlapping-button-reject-snippet]').should('not.exist');
    cy.get('[data-cy=overlapping-button-reject-sc]').should('not.exist');
    cy.get('[data-cy=button-approve-sa]').contains('Approve');
  } else {
    cy.get('[data-cy=sa-info-text]').contains(
      'By clicking approve, you will accept the Source Capture, Snippet and Data Entry',
    );
    cy.get('[data-cy=reject-de-bottom-button]').contains('Reject Data Entry');
    cy.get('[data-cy=overlapping-button-reject-snippet]').contains('Reject Snippet');
    cy.get('[data-cy=overlapping-button-reject-sc]').contains('Reject Source Capture');
    cy.get('[data-cy=button-approve-sa]').contains('Approve All');
  }
});

// StreamlineSC helper command
export type ModalCaptureInvoker = 'TODO_CARD_BUTTON' | 'FLOATING_BUTTON' | 'QCARD_QUICK_ACTION';
export type OCRNameInput =
  | 'Weight'
  | 'Height'
  | 'Muscle'
  | 'Hearing'
  | 'VaccineSideEffects'
  | 'VaccineName'
  | 'Lungs'
  | 'Abdomen'
  | 'Extermities'
  | 'Spinal Cord'
  | 'Heartbeat patient'
  | 'Right Eye'
  | 'Brain'
  | 'Respiration rate'
  | 'Temporal Lobe'
  | 'Temperature'
  | 'BloodPressure';

export type SnippetAndDataEntryInput = {
  OCRName: OCRNameInput;
  isHotspot: boolean;
  dataEntryValue?: string | string[];
  expandModal?: boolean;
  isEditing?: boolean;
  force?: boolean;
};
export type CheckStreamMilestoneCounterInput = {
  type: 'snippet' | 'data-entry';
  targetValue: string;
};
export type CheckDEInReviewYourWork = {
  OCRName: OCRNameInput;
  dataEntryValue?: string;
};
export type CheckDEForm = {
  OCRName: OCRNameInput;
  dataEntryValue: string;
};
export type CheckBubbleInput = {
  OCRName: OCRNameInput;
  type: 'filled' | 'border' | 'empty';
  activateSnippet?: boolean;
};
export type CheckResultAfterConfirmInReviewYourWorkInput = {
  filterCy:
    | 'UNATTACHED'
    | 'NEED_REASON_NOT_AVAILABLE'
    | 'NOT_AVAILABLE_REJECTED'
    | 'MARKED_UP'
    | 'FILLED_PARTIAL'
    | 'FILLED'
    | 'FILLED_FROM_SOURCE_CAPTURE'
    | 'ACCEPTED_FROM_SOURCE_CAPTURE';
  questionCardCy: string;
};
export const snippetSCPosition: Record<
  OCRNameInput,
  {
    x: number;
    y: number;
    x2: number;
    y2: number;
  }
> = {
  Weight: {
    x: 120,
    y: 100,
    x2: 200,
    y2: 140,
  },
  Muscle: {
    x: 220,
    y: 100,
    x2: 300,
    y2: 140,
  },
  Hearing: {
    x: 320,
    y: 300,
    x2: 400,
    y2: 340,
  },
  VaccineSideEffects: {
    x: 420,
    y: 100,
    x2: 500,
    y2: 140,
  },
  Lungs: {
    x: 420,
    y: 80,
    x2: 500,
    y2: 120,
  },
  Abdomen: {
    x: 320,
    y: 150,
    x2: 400,
    y2: 190,
  },
  Extermities: {
    x: 320,
    y: 200,
    x2: 400,
    y2: 240,
  },
  'Respiration rate': {
    x: 500,
    y: 200,
    x2: 580,
    y2: 280,
  },
  'Temporal Lobe': {
    x: 400,
    y: 100,
    x2: 480,
    y2: 180,
  },
  'Heartbeat patient': { x: 900, y: 500, x2: 950, y2: 550 },
  'Spinal Cord': { x: 0, y: 0, x2: 0, y2: 0 },
  'Right Eye': { x: 0, y: 0, x2: 0, y2: 0 },
  Brain: { x: 0, y: 0, x2: 0, y2: 0 },
};

export type WorkflowBarStatus = 'MARKED_UP' | 'FILLED_PARTIAL' | 'NOT_AVAILABLE_REJECTED';

/**
 * It returns a string that is the data-cy attribute of the answer input field for the given OCRName
 * @param {OCRNameInput} OCRName - The name of the OCR field you want to get the data for.
 * @param [rowIndex=0] - This is the add answer / new row for the form field responses.
 * @returns A string
 */
const getAnswerInputDataCy = (OCRName: OCRNameInput, rowIndex = 0) => {
  // TODO: Might want to add input type in here
  switch (OCRName) {
    case 'Weight':
      return `answer-input-field-ffWeight1-${rowIndex}-0`;
    case 'Muscle':
      return `textfield-container-answer-input-field-ffMuscleCon1-${rowIndex}-0`;
    case 'Hearing':
      return `textfield-container-answer-input-field-ffHearingCon1-${rowIndex}-0`;
    case 'Abdomen':
      return `textfield-container-answer-input-field-ffAbdomenCon1-${rowIndex}-0`;
    case 'VaccineSideEffects':
      return `answer-input-field-sideEffectVac1-${rowIndex}-0`;
    case 'Lungs':
      return `textfield-container-answer-input-field-ffLungsCon1-${rowIndex}-0`;
    case 'Respiration rate':
      return `answer-input-field-ffBreath1-${rowIndex}-0`;
    case 'Temporal Lobe':
      return `textfield-container-answer-input-field-ffTemporalCon1-${rowIndex}-0`;
    case 'Temperature':
      return `answer-input-field-ffTemp1-${rowIndex}-0`;
    case 'Height':
      return `answer-input-field-ffHeight1-${rowIndex}-0`;
    case 'VaccineName':
      return `answer-input-field-vacName1-${rowIndex}-0`;
    default:
      return '';
  }
};

const getQuestionId = (OCRName: OCRNameInput) => {
  switch (OCRName) {
    case 'Respiration rate':
      return `breath1`;
    case 'Temporal Lobe':
      return `temporalLobe1`;
    default:
      return '';
  }
};

const getMarkAsNoAnswerDropdownDataCy = (OCRName: OCRNameInput) => {
  switch (OCRName) {
    case 'Weight':
      return 'edit-reason-select-no-answer-weight1';
    case 'Muscle':
      return 'edit-reason-select-no-answer-muscle1';
    default:
      return '';
  }
};

const getEditDEReasonDataCy = (OCRName: OCRNameInput) => {
  switch (OCRName) {
    case 'Weight':
      return 'edit-reason-select-weight1';
    case 'Lungs':
      return 'edit-reason-select-lungs1';
    default:
      return '';
  }
};

Cypress.Commands.add('testModalCapture', (invoker: ModalCaptureInvoker) => {
  if (invoker === 'TODO_CARD_BUTTON') {
    cy.get('[data-cy=todoCard-captureButton]').click();
    cy.get('[data-cy=capture-modal-header]').should('be.visible');
    cy.get('[data-cy=milestone-progress-bar]').should('be.visible');
    cy.get('[data-cy=modal-close-icon]').should('be.visible').click();
  } else if (invoker === 'FLOATING_BUTTON') {
    cy.get('[data-cy=floating-captureButton]').click();
    cy.get('[data-cy=capture-modal-header]').should('be.visible');
    cy.get('[data-cy=milestone-progress-bar]').should('be.visible');
    cy.get('[data-cy=modal-close-icon]').should('be.visible').click();
  } else {
    cy.clickQuickAction('[data-cy=question-card-muscle1]', '[data-cy=capture-action-muscle1]');
    cy.get('[data-cy=capture-modal-header]').should('be.visible');
    cy.get('[data-cy=milestone-progress-bar]').should('be.visible');
    cy.get('[data-cy=modal-close-icon]').should('be.visible').click();
  }
});

// Streamline SC Commands
Cypress.Commands.add('openSCFlow', () => {
  cy.get('[data-cy=floating-captureButton]').click();
  cy.get('[data-cy=capture-modal-header]').should('be.visible');
  cy.get('[data-cy=milestone-progress-bar]').should('be.visible');
});

Cypress.Commands.add('uploadSCImage', () => {
  cy.uploadFile('EMR-kylie.jpg');
  cy.uploadRedaction('verified', false);
});

Cypress.Commands.add('closeModalCapture', () => {
  cy.get('[data-cy=capture-modal-close-icon]').should('be.visible').click();
  cy.get('[data-cy=confirmModal-confirmButton]').should('be.visible').click();
});

Cypress.Commands.add(
  'checkUploadMilestoneProgress',
  (progress: 'IN_PROGRESS' | 'NO_PROGRESS' | 'FINISHED') => {
    if (progress === 'IN_PROGRESS') {
      cy.get('[data-cy="milestone-bar-line-Source Capture"]').should('have.css', 'opacity', '1');
    } else {
      cy.get('[data-cy="milestone-bar-line-Source Capture"]').should('have.css', 'opacity', '0');
    }
  },
);

Cypress.Commands.add('useRedactSuggestionStreamline', () => {
  cy.get('[data-cy=manual-redact-button]').should('be.visible').click();
  cy.get('[data-cy=continue-to-suggestion-button]').should('be.visible').click();
  cy.get('[data-cy=milestone-almostdone-popover]').should('be.visible');
});

Cypress.Commands.add('checkSCQueueExist', (sourceCaptureId: string) => {
  cy.get('[data-cy=streamline-sc-queue-card]', { timeout: 45000 }).should('be.visible').click();
  cy.get(`[data-cy=queue-card-${sourceCaptureId}]`).should('be.visible');
  cy.get('[data-cy=sc-queue-back-row]').should('be.visible').click();
});

Cypress.Commands.add(
  'checkConfirmationModalContent',
  ({ title, description }: { title: string; description?: string }) => {
    cy.get('[data-cy=confirmation-modal-title').should('be.visible').contains(title);
    if (description) {
      cy.get('[data-cy=confirmation-modal-desc').should('be.visible').contains(description);
    }
  },
);

Cypress.Commands.add('addPatientForStreamline', ({ patientID }: { patientID: string }) => {
  cy.get(`#${patientID}-selectable-patient`).should('be.visible').click({ force: true });
  cy.contains('Visit 1', { timeout: 35000 })
    .should('be.visible')
    .click({ multiple: true, force: true });
  cy.get('[data-cy=select-visit-status]').click().type(`{enter}`);
  cy.multiSelect({ field: 'year', count: 1 });
  cy.multiSelect({ field: 'month', count: 1 });
  cy.multiSelect({ field: 'date', count: 1 });
  cy.get('[data-cy=button-submit-visit]').click();
  cy.get('[data-cy=sourceQuestionTab]').click();
});
export function recursiveScrollCheck(count: number, OCRNameRemovedSpaces: string) {
  if (count >= 12) {
    return;
  }
  const scrollTo = [
    ['0%', '0%'],
    ['0%', '10%'],
    ['10%', '20%'],
    ['20%', '30%'],
    ['30%', '40%'],
    ['40%', '50%'],
    ['50%', '60%'],
    ['60%', '70%'],
    ['70%', '80%'],
    ['80%', '90%'],
    ['90%', '100%'],
    ['bottom'],
  ];
  const selectedScrollTo = scrollTo[count];
  cy.get(`div[class="rc-virtual-list-holder"]`)
    .scrollTo(selectedScrollTo[0], selectedScrollTo[1], {
      ensureScrollable: false,
      duration: 250,
    })
    .then((questionListDropdown) => {
      if (
        questionListDropdown
          .children()
          .find(`[data-cy=streamline-dropdown-data-entry-question-option-${OCRNameRemovedSpaces}]`)
          .is(':visible')
      ) {
        return;
      } else {
        count++;
        recursiveScrollCheck(count, OCRNameRemovedSpaces);
      }
    });
}

Cypress.Commands.add('addSnippet', (OCRName: OCRNameInput, force = false) => {
  const OCRNameRemovedSpaces = OCRName.replace(/\s/g, '');
  cy.get(`[data-cy=right-chip-${OCRNameRemovedSpaces}]`).scrollIntoView().should('be.visible');
  cy.drawSingleRect(snippetSCPosition[OCRName], 'top-left', force);
  cy.wait(3000);
  cy.get('[data-cy=streamline-dropdown-data-entry-question]').should('be.visible').click();
  const count = 0;
  recursiveScrollCheck(count, OCRNameRemovedSpaces);
  cy.get(`[data-cy=streamline-dropdown-data-entry-question-option-${OCRNameRemovedSpaces}]`)
    .should('be.visible')
    .click();
});

Cypress.Commands.add('skipDataEntryButtonShouldBeDisabled', (isDisabled = true) => {
  const shouldBe = isDisabled ? 'be.disabled' : 'not.be.disabled';
  cy.get(`[data-cy=streamline-save-data-entry]`).should(shouldBe);
});

// #3362175615
Cypress.Commands.add(
  'skipDEAfterDragSnippetAndSelectReasonShouldNotBeDisabled',
  (OCRName: OCRName) => {
    cy.skipDataEntryButtonShouldBeDisabled();
    cy.selectDEReason(OCRName);
    cy.skipDataEntryButtonShouldBeDisabled(false);
  },
);

Cypress.Commands.add(
  'fillDEFormAndSelectReason',
  (OCRName: OCRName, OCRNameInput: OCRNameInput, type = 'Temp') => {
    // check the DE reason and OCR suggestion should exist after snippet changes
    cy.get(`[data-cy=${getEditDEReasonDataCy(OCRNameInput)}]`).should('exist');
    cy.get('[data-cy=ocr-suggestion]').should('exist');
    cy.get(`[data-cy=${getAnswerInputDataCy(OCRNameInput)}]`)
      .should('exist')
      .click()
      .type(type);
    cy.selectDEReason(OCRName);
  },
);

Cypress.Commands.add(
  'snippetAndDataEntryStreamlineSC',
  ({
    OCRName,
    isHotspot,
    dataEntryValue,
    expandModal = false,
    isEditing = false,
    force = false,
  }: SnippetAndDataEntryInput) => {
    cy.clickSnippetTool('Snippet');

    const OCRNameRemovedSpaces = OCRName.replace(/\s/g, '');

    // start from snippet view mode
    if (isEditing) {
      cy.clickAddDEOrEditButton();
    } else if (!isHotspot) {
      cy.addSnippet(OCRName, force);
    } else {
      cy.clickChipInFloatingBar(OCRName);
    }

    if (expandModal) {
      cy.toggleExpandMode();
    }

    const saveDEButtonCY = 'streamline-save-data-entry';

    if (dataEntryValue) {
      if (isEditing) {
        // check submit button after click the edit mode should always be disabled
        cy.get(`[data-cy=${saveDEButtonCY}]`).should('be.disabled');
      }

      if (Array.isArray(dataEntryValue)) {
        for (let i = 0; i < dataEntryValue.length; i++) {
          cy.get(`[data-cy=${getAnswerInputDataCy(OCRName, i)}]`)
            .should('be.visible')
            .click()
            .type(dataEntryValue[i]);
          // Keep clicking add answer until the last array
          if (i !== dataEntryValue.length - 1) {
            cy.get(`[data-cy=add-answer-${getQuestionId(OCRName)}]`).click();
          }
        }
      } else {
        cy.get(`[data-cy=${getAnswerInputDataCy(OCRName)}]`)
          .should('be.visible')
          .click()
          .type(dataEntryValue);
      }
      cy.get(`[data-cy=${saveDEButtonCY}]`).should('be.visible').click();
      cy.get(`[data-cy=bottom-chip-${OCRNameRemovedSpaces}]`).should('be.visible');
    } else {
      cy.get(`[data-cy=${getAnswerInputDataCy(OCRName)}]`).should('be.visible');
      cy.get(`[data-cy=${saveDEButtonCY}]`).should('be.visible').click();
      cy.get(`[data-cy=bottom-chip-${OCRName}]`).should('be.visible');
      cy.get('[data-cy=modal-title-streamline').contains(OCRName);
    }
  },
);

Cypress.Commands.add(
  'checkMonitorFlowBodyVisibility',
  (shouldIndicator: 'visible' | 'notExist') => {
    cy.get('[data-cy=monitor-flow-body]').should(
      shouldIndicator === 'visible' ? 'be.visible' : 'not.exist',
    );
  },
);

Cypress.Commands.add('checkValueDataEntry', ({ OCRName, dataEntryValue }: CheckDEForm) => {
  cy.get('[data-cy=modal-title-streamline]').contains(OCRName);
  if (OCRName === 'Weight') {
    cy.get('[data-cy=question-answers]').contains(dataEntryValue);
  } else {
    cy.get('[data-cy=question-answers]').should('exist');
    cy.get('[data-cy=question-label-free-text]').contains(OCRName);
    cy.get('[data-cy=question-answer-free-text]').contains(dataEntryValue);
  }
});

Cypress.Commands.add(
  'clickCanvasTools',
  (canvasTool: 'Snippet' | 'Redaction' | 'Opacity' | 'ZoomIn' | 'ZoomOut', forceClick = false) => {
    cy.get(`[data-cy=${canvasTool}]`).should('be.exist').click({ force: forceClick });
  },
);

Cypress.Commands.add(
  'checkStreamlineMilestoneCounter',
  ({ type, targetValue }: CheckStreamMilestoneCounterInput) => {
    if (type === 'snippet') {
      cy.get('[data-cy=milestone-info-indicator-Snippet]').contains(targetValue);
    } else {
      cy.get('[data-cy="milestone-info-indicator-Data Entry"]').contains(targetValue);
    }
  },
);

Cypress.Commands.add(
  'checkBubbleBehaviour',
  ({ OCRName, type, activateSnippet = true }: CheckBubbleInput) => {
    if (type === 'empty') {
      // Greyed color bubble
      cy.get(`[data-cy="bubble-${OCRName}"]`)
        .should('have.css', 'border-color', 'rgb(66, 69, 100)')
        .and('have.css', 'background-color', 'rgb(53, 55, 74)');
    } else {
      if (type === 'filled') {
        cy.get(`[data-cy="bubble-${OCRName}"]`)
          .should('have.css', 'background-color', 'rgb(87, 123, 241)')
          .trigger('mouseover')
          .should('have.css', 'transform', 'matrix(1.5, 0, 0, 1.5, 0, 0)')
          .click();
        if (activateSnippet) {
          cy.get('[data-cy=modal-title-streamline]').contains(OCRName);
        }
      } else {
        cy.get(`[data-cy="bubble-${OCRName}"]`)
          .should('have.css', 'border-color', 'rgb(87, 123, 241)')
          .and('have.css', 'background-color', 'rgb(53, 55, 74)')
          .trigger('mouseover')
          .should('have.css', 'transform', 'matrix(1.5, 0, 0, 1.5, 0, 0)')
          .click();
        if (activateSnippet) {
          cy.get('[data-cy=modal-title-streamline]').contains(OCRName);
        }
      }
    }
  },
);

Cypress.Commands.add('toggleExpandMode', () => {
  cy.get('[data-cy=toggle-streamline-de-expand-icon]').should('be.visible').click();
  cy.get('[data-cy=DEForm-inside-modal-back-compact-view-button]').should('be.visible');
});

Cypress.Commands.add('toggleCompactMode', () => {
  cy.get('[data-cy=DEForm-inside-modal-back-compact-view-button]').should('be.visible').click();
  cy.get('[data-cy=toggle-streamline-de-expand-icon]').should('be.visible');
});

Cypress.Commands.add(
  'checkDataEntryInReviewYourWork',
  ({ OCRName, dataEntryValue }: CheckDEInReviewYourWork) => {
    // NOTE: Still incomplete, probably need data input type. Currently will only work on StreamlineSC spec
    if (dataEntryValue) {
      cy.get(`[data-cy=RYW-question-card-withDE-${OCRName}]`).should('exist');
      if (OCRName === 'Weight') {
        cy.get(`[data-cy=question-answer]`).contains(dataEntryValue);
      } else {
        cy.get(`[data-cy=question-answer-free-text]`).contains(dataEntryValue);
      }
    } else {
      cy.get(`[data-cy=RYW-question-card-noDE-${OCRName}]`).should('exist');
    }
  },
);

Cypress.Commands.add(
  'checkResultAfterConfirmInReviewYourWork',
  ({ filterCy, questionCardCy }: CheckResultAfterConfirmInReviewYourWorkInput) => {
    cy.get(`[data-cy=${filterCy}]`).click();
    cy.get(`[data-cy=${questionCardCy}]`).should('be.visible');
  },
);

Cypress.Commands.add('clickAddDEOrEditButton', () => {
  cy.get(`[data-cy=streamline-edit-data-entry]`).should('exist').click();
});

Cypress.Commands.add('clickMarkAsNoAnswerIcon', (OCRName) => {
  cy.get(`[data-cy=${getAnswerInputDataCy(OCRName)}]`)
    .should('be.visible')
    .click()
    .get('.no-answer-icon')
    .click();
});

Cypress.Commands.add('clearDEField', () => {
  cy.get(`[data-cy=clear-de-field`).should('be.visible').click();
});

Cypress.Commands.add('selectMarkAsNoAnswerReason', (OCRName, chooseOther) => {
  if (chooseOther) {
    cy.get(
      `[data-cy=${getMarkAsNoAnswerDropdownDataCy(OCRName)}] > .ant-select > .ant-select-selector`,
    )
      .should('exist')
      .click()
      .type(`{downarrow}{downarrow}{downarrow}{downarrow}{enter}`);
  } else {
    cy.get(`[data-cy=${getMarkAsNoAnswerDropdownDataCy(OCRName)}]`)
      .should('exist')
      .click()
      .type(`{downarrow}{enter}`);
  }
});

Cypress.Commands.add('clickCancelStreamline', () => {
  cy.get(`[data-cy=streamline-cancel-data-entry]`).should('exist').click();
});

Cypress.Commands.add('DEInputFormExist', (OCRName) => {
  return cy.get(`[data-cy=${getAnswerInputDataCy(OCRName)}]`).should('exist');
});

Cypress.Commands.add('addDEInputForm', (OCRName, value) => {
  cy.DEInputFormExist(OCRName).type(value).as('add-de');
  cy.get('@add-de');
});

Cypress.Commands.add('selectDEReason', (OCRName) => {
  cy.get(`[data-cy=${getEditDEReasonDataCy(OCRName)}]`)
    .should('exist')
    .click()
    .type(`{enter}`);
});

Cypress.Commands.add('noAnswerIsExistInSnippetViewMode', () => {
  cy.get(`[data-cy=No-Answer-status`).should('exist');
});

Cypress.Commands.add('exitCanvasPage', (confirmExit = true) => {
  cy.get('[data-cy=capture-modal-close-icon]').click();
  cy.checkConfirmationModalContent({
    title: 'Heads Up!',
    description: 'Are you sure you want to stop now and discard your work?',
  });
  if (confirmExit) {
    cy.get('[data-cy=confirmModal-confirmButton]')
      .should('exist')
      .click({ multiple: true, force: true });
  } else {
    cy.get('[data-cy=confirmModal-cancelButton]')
      .should('exist')
      .click({ multiple: true, force: true });
  }
});

Cypress.Commands.add('getVisitDetailAndGoToSCTab', (aliasVisitDetails, visit) => {
  cy.intercept('POST', '/graphql', (req) => {
    if (req.body.operationName === aliasVisitDetails) {
      req.alias = req.body.operationName;
    }
  });
  // Go to visit detail page
  cy.visit(visit);
  cy.wait(`@${aliasVisitDetails}`);
  cy.get('[data-cy=sourceQuestionTab]').click();
});

Cypress.Commands.add(
  'goToStatusAndOpenSnippetQuickAction',
  (status: WorkflowBarStatus, questionId) => {
    cy.get(`[data-cy=${status}]`).click();
    cy.clickQuickAction(
      `[data-cy=question-card-${questionId}]`,
      `[data-cy=edit-snippet-action-${questionId}]`,
      undefined,
      undefined,
      'SVG',
    );
  },
);

/** snippet DE form & floating bar chip should have the same color #3367689776 */
Cypress.Commands.add('chipAndSnippetShouldHaveTheSameColor', (OCRName) => {
  cy.get(`[data-cy="right-chip-${OCRName}"]`).then((rightChip) => {
    cy.get(`[data-cy=content-outer-container]`).should(
      'have.css',
      'border-color',
      rightChip.css('background-color'),
    );
  });
});

Cypress.Commands.add('clickEditButtonStreamline', () => {
  cy.get('[data-cy=non-streamline-edit-snippet]').should('exist').click();
});

Cypress.Commands.add('getDEModalContainer', () => {
  return cy.get(`[data-cy=content-outer-container]`);
});

export type InputTypeId = 'ffSystolic' | 'ffdoastolic' | 'ffBPUnit';

Cypress.Commands.add('getQuestionInputForm', (inputType, rowIndex = 0, colIndex = 0) => {
  return cy
    .get(`[data-cy=answer-input-field-${inputType}1-${rowIndex}-${colIndex}]`)
    .should('be.visible');
});
