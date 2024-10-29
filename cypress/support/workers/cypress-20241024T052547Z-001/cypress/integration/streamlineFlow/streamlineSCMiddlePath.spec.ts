import { OperationDefinitionNode } from 'graphql';
import 'cypress-localstorage-commands';
import {
  GetVisitDetailsDocument,
  IFieldGroupVisitDetail,
  IMarkUpRegion,
  IVisitDetails,
} from '../../../src/graphQL/generated/graphql';
import { snippetSCPosition } from '../../support/command/streamline';

describe.skip('Streamline SC', () => {
  const visitDetailDefinitions = GetVisitDetailsDocument.definitions[0] as OperationDefinitionNode;
  const aliasVisitDetails = visitDetailDefinitions.name?.value;
  let allFieldGroups: Array<IFieldGroupVisitDetail> = [];

  before(() => {
    cy.reseedDB();
    cy.fillInloginAsFormV2({
      email: 'streamlinesc@example.com',
    });
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasVisitDetails) {
        req.alias = req.body.operationName;
      }
    });

    cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit1Visit1');
    cy.wait(`@${aliasVisitDetails}`).then((res) => {
      const visitDetailRes: IVisitDetails = res.response?.body.data?.visitDetails;
      allFieldGroups = visitDetailRes.withSourceForm.fieldGroups;
    });

    cy.get('[data-cy=sourceQuestionTab]').click();
  });

  describe('Streamline SC - Edit Data Entry Quick Action', () => {
    /**
      S-13-015 Edit Data Entry - enables a user with Data Entry Privilege S-12-005 or Stacked SC Privilege S-12-013 to edit past data entry(s) on a Question-Snippet Pair S-16-027, clickable -
      scenario (user has the Stacked SC Privilege S-12-013):
      opens the Source Image Record S-16-024 with the Auto DE Modal S-02-019 for the particular question
     */

    it('should go to rejected state and click edit data entry quick action on Brain Question', () => {
      cy.get('[data-cy=NOT_AVAILABLE_REJECTED]').click();
      cy.clickQuickAction(
        `[data-cy=question-card-brain1]`,
        `[data-cy=edit-snippet-action-brain1]`,
        undefined,
        undefined,
        'SVG',
      );
      cy.get('[data-cy=monitor-flow-body]', { timeout: 20000 }).should('be.visible');
    });

    it('should open canvas with selected question on rejected section', () => {
      cy.checkSelectedBottomChipOnRightSection('[data-cy=bottom-chip-Brain]');
    });

    it('should disable the submit button because there hasnt been changes made (Edit from Rejected)', () => {
      cy.get('.streamline-submit-button').should('be.disabled');
    });

    // 3452254211
    it('Click add query button in compact view, should display the add query components', () => {
      cy.get('[data-cy=streamline-add-query]').click();
      cy.get('[data-cy=add-new-query-title-dialog]').scrollIntoView().should('be.visible');
      cy.get('[data-cy=close-query]').click();
    });

    // 3452254211
    it('Click add query button in Expand Mode view, should display the add query components', () => {
      cy.get('[data-cy=toggle-streamline-de-expand-icon]').click();
      cy.get('[data-cy=modal-add-query]').should('be.visible').click();
      cy.get('[data-cy=add-new-query-title-dialog]').scrollIntoView().should('be.visible');
      cy.get('[data-cy=close-query]').click();
      cy.get('[data-cy=DEForm-inside-modal-back-compact-view-button]').should('be.visible').click();
    });

    // #3413201107
    it('Floating bar section chips should not be highlighted because it has no hotspot', () => {
      cy.chipShouldHaveNoColorHighlight('Muscle');
      cy.chipShouldHaveNoColorHighlight('Hearing');
      cy.chipShouldHaveNoColorHighlight('VaccineSideEffects');
      cy.chipShouldHaveNoColorHighlight('Weight');
    });

    it('Clicking X icon to get out of canvas will prompt confirmation modal and cancel it', () => {
      cy.clickCancelStreamline();
      cy.get('[data-cy=capture-modal-close-icon]').click();
      cy.checkConfirmationModalContent({
        title: 'Heads Up!',
        description: 'Are you sure you want to stop now and discard your work?',
      });
      cy.get('[data-cy=confirmModal-cancelButton]').click({ multiple: true });
    });

    it('should show correct milestone data', () => {
      cy.checkStreamlineMilestoneCounter({ type: 'snippet', targetValue: '6/12' });
      cy.checkStreamlineMilestoneCounter({ type: 'data-entry', targetValue: '0/6' });
    });

    it('Edit data entry (Brain) and move the bottom chip from right section to left section', () => {
      cy.editSnippetFromBottomSection('Brain', false, true);
      // Edit Data Entry
      cy.get(`[data-cy=answer-input-field-ffBrainCon1-0-0]`)
        .should('exist')
        .click({ force: true })
        .type('washed');
      cy.get('[data-cy=streamline-save-data-entry]').should('be.visible').click();
      cy.checkSelectedBottomChipOnLeftSection('[data-cy=bottom-chip-Brain]');
      cy.checkValueDataEntry({ OCRName: 'Brain', dataEntryValue: 'washed' });
      cy.checkStreamlineMilestoneCounter({ type: 'snippet', targetValue: '6/12' });
      cy.checkStreamlineMilestoneCounter({ type: 'data-entry', targetValue: '1/6' });
    });

    it('Clicking X icon to get out of canvas will prompt confirmation modal and discard it', () => {
      cy.get('[data-cy=capture-modal-close-icon]').click();
      cy.checkConfirmationModalContent({
        title: 'Heads Up!',
        description: 'Are you sure you want to stop now and discard your work?',
      });
      cy.get('[data-cy=confirmModal-confirmButton]').click({ multiple: true, force: true });
    });
  });

  describe('Streamline SC - Edit Snippet Quick Action', () => {
    /**
      S-13-012 Edit Snippet - enables a user with Source Markup Privilege S-12-002 or the Stacked SC Privilege S-12-013 to edit a previously created Snippet S-16-047 from a source capture associated with a Source Capture Question Card S-16-044, clickable -
     */
    it('should go to Pending Data Entry state and click edit data entry quick action', () => {
      cy.get('[data-cy=MARKED_UP]').click();
      cy.clickQuickAction(
        `[data-cy=question-card-lungs1]`,
        `[data-cy=edit-snippet-action-lungs1]`,
        undefined,
        undefined,
        'SVG',
      );
      cy.get('[data-cy=monitor-flow-body]', { timeout: 20000 }).should('be.visible');
    });

    it('should open canvas and check question selected is on bottom left section', () => {
      cy.checkSelectedBottomChipOnLeftSection('[data-cy=bottom-chip-Lungs]');
    });

    it('should disable the submit button because there hasnt been changes made (Edit from MARKED_UP)', () => {
      cy.get('.streamline-submit-button').should('be.disabled');
    });

    it('should show correct milestone data', () => {
      cy.checkStreamlineMilestoneCounter({ type: 'snippet', targetValue: '6/12' });
      cy.checkStreamlineMilestoneCounter({ type: 'data-entry', targetValue: '1/6' });
    });

    // Test editing Snippet - NOTE: edit snippet still breaking - based on streamlineSC.spec.ts
    xit('should success editting snippet', () => {
      cy.editSnippetFromBottomSection('Lungs');

      // NOTE: Edit Snippet - waiting for how to move the snippet
      const lungsSnippetPosition = snippetSCPosition.Lungs;
      const newLungsSnippetPosition = {
        ...lungsSnippetPosition,
        y: lungsSnippetPosition.y - 10,
        y2: lungsSnippetPosition.y2 - 10,
      };
      cy.removeStreamlineBackdropIfVisible();
      cy.draggingRect(
        newLungsSnippetPosition,
        {
          x: newLungsSnippetPosition.x - 100,
          y: newLungsSnippetPosition.y - 20,
        },
        undefined,
        false,
        true,
      );

      cy.get('[data-cy=edit-reason-select-lungs1]').should('be.visible').click().type('{enter}');

      cy.get('[data-cy=streamline-save-data-entry]').should('be.visible').click();
      cy.checkStreamlineMilestoneCounter({ type: 'snippet', targetValue: '6/12' });
      cy.checkStreamlineMilestoneCounter({ type: 'data-entry', targetValue: '2/6' });
    });

    it('Clicking X icon to get out of canvas will prompt confirmation modal and discard it', () => {
      cy.clickCancelStreamline();
      cy.get('[data-cy=capture-modal-close-icon]').click();
      cy.checkConfirmationModalContent({
        title: 'Heads Up!',
        description: 'Are you sure you want to stop now and discard your work?',
      });
      cy.get('[data-cy=confirmModal-confirmButton]').click({ multiple: true, force: true });
    });
  });

  describe('Streamline SC - Enter Data & Edit Quick Action', () => {
    /**
      S-13-025 Edit - enables a user with the Stacked SC Privilege S-12-013 to edit a Snippet S-16-047 as well as past data entry(s) on a Question-Snippet Pair S-16-027, clickable -
      opens the Source Image Record S-16-024 with the Auto DE Modal S-02-019 for the particular question
     */

    // NOTE: Enter Data Entry
    it('Step 1. should go to Pending Data Entry and click enter data quick action', () => {
      cy.get('[data-cy=MARKED_UP]').click();
      cy.clickQuickAction(
        '[data-cy=question-rightEye1]',
        '[data-cy=data-entry-action-rightEye1]',
        undefined,
        undefined,
        'SVG',
      );
      cy.get('[data-cy=monitor-flow-body]', { timeout: 20000 }).should('be.visible');
    });

    it('should open canvas and check question selected is on bottom left section', () => {
      cy.checkSelectedBottomChipOnLeftSection('[data-cy=bottom-chip-RightEye]');
    });

    it('should disable the submit button because there hasnt been changes made (Edit from EDIT DATA ENTRY)', () => {
      cy.get('.streamline-submit-button').should('be.disabled');
    });

    it('should success entering new data entry (Right Eye)', () => {
      cy.get('[data-cy=modal-title-streamline]').contains('Right Eye');

      cy.get(`[data-cy=textfield-container-answer-input-field-ffRightEyeCon1-0-0]`)
        .should('exist')
        .click({ force: true })
        .type('100');
      cy.get('[data-cy=streamline-save-data-entry]').should('be.visible').click();

      cy.checkValueDataEntry({ OCRName: 'Right Eye', dataEntryValue: '100' });
      cy.checkStreamlineMilestoneCounter({ type: 'snippet', targetValue: '6/12' });
      cy.checkStreamlineMilestoneCounter({ type: 'data-entry', targetValue: '2/6' });
    });

    it('Clicking X icon to get out of canvas will prompt confirmation modal and discard it', () => {
      cy.get('[data-cy=capture-modal-close-icon]').click();
      cy.checkConfirmationModalContent({
        title: 'Heads Up!',
        description: 'Are you sure you want to stop now and discard your work?',
      });
      cy.get('[data-cy=confirmModal-confirmButton]').click({ multiple: true, force: true });
    });

    // NOTE: Edit Data Entry
    it('Step 2. Should go to Data Entry Completed and click edit quick action', () => {
      cy.get('[data-cy=FILLED]').click();
      cy.clickQuickAction(
        '[data-cy=question-rightEye1]',
        '[data-cy=edit-snippet-de-action-rightEye1]',
        undefined,
        undefined,
        'SVG',
      );
      cy.get('[data-cy=monitor-flow-body]', { timeout: 20000 }).should('be.visible');
    });

    it('should open canvas with selected question on left section', () => {
      cy.checkSelectedBottomChipOnLeftSection('[data-cy=bottom-chip-RightEye]');
    });

    it('should disable the submit button because there hasnt been changes made (Edit from DATA ENTRY COMPLETED)', () => {
      cy.get('.streamline-submit-button').should('be.disabled');
    });

    it('Edit data entry (Right Eye)', () => {
      cy.get('[data-cy=modal-title-streamline]').contains('Right Eye');

      cy.get(`[data-cy=textfield-container-answer-input-field-ffRightEyeCon1-0-0]`)
        .should('exist')
        .click({ force: true })
        .clear()
        .type('999');
      cy.get('[data-cy=edit-reason-select-rightEye1]').click().type('{enter}');
      cy.get('[data-cy=streamline-save-data-entry]').should('be.visible').click();

      cy.checkValueDataEntry({ OCRName: 'Right Eye', dataEntryValue: '999' });
      cy.checkStreamlineMilestoneCounter({ type: 'snippet', targetValue: '6/12' });
      cy.checkStreamlineMilestoneCounter({ type: 'data-entry', targetValue: '2/6' });
    });

    it('Clicking X icon to get out of canvas will prompt confirmation modal and discard it', () => {
      cy.get('[data-cy=capture-modal-close-icon]').click();
      cy.checkConfirmationModalContent({
        title: 'Heads Up!',
        description: 'Are you sure you want to stop now and discard your work?',
      });
      cy.get('[data-cy=confirmModal-confirmButton]').click({ multiple: true, force: true });
    });
  });

  describe('Streamline SC middle path known issue test', () => {
    before(() => {
      cy.goToStatusAndOpenSnippetQuickAction('NOT_AVAILABLE_REJECTED', 'bloodPressure1');
      cy.get('[data-cy=monitor-flow-body]', { timeout: 20000 }).should('be.visible');
    });

    // #3434638352
    it('Check if the rejected status button after snippet change is enabled (Save snippet & skip DE)', () => {
      const bloodPressure = allFieldGroups.find((x) => x.shortQuestion === 'Blood Pressure');
      const bloodPressureMarkupRegion: IMarkUpRegion | undefined =
        bloodPressure?.formFieldGroupResponse?.parsedMarkUpRegions[0];
      const { x, y, x2, y2 } = {
        x: bloodPressureMarkupRegion?.x ?? 0,
        y: bloodPressureMarkupRegion?.y ?? 0,
        x2: (bloodPressureMarkupRegion?.x ?? 0) + (bloodPressureMarkupRegion?.w ?? 0),
        y2: (bloodPressureMarkupRegion?.y ?? 0) + (bloodPressureMarkupRegion?.h ?? 0),
      };

      // wait until the canvas black box finish rendering before drag
      cy.wait(1000);

      cy.draggingRect(
        {
          x: x + 200,
          x2: x2 + 200,
          y: y / 2 - 50,
          y2: y2 / 2 - 50,
        },
        { x: x + 100, y: y / 2 + 150 },
        undefined,
        false,
        true,
      );
      cy.skipDataEntryButtonShouldBeDisabled(false);
    });

    // #3434638352
    it('Check the rejected status submit button after fill in the forms (Save snippet & DE)', () => {
      cy.get('[data-cy=answer-input-field-ffSystolic1-0-0]').type('78');
      // submit button should be disabled because not all of the form has been filled
      cy.skipDataEntryButtonShouldBeDisabled();
      cy.get('[data-cy=answer-input-field-ffdoastolic1-0-1]').type('78');
      cy.get('[data-cy=answer-input-field-ffBPUnit1-0-2]').click().type('{downarrow}{enter}');
      // submit button should now be enabled after all of the form has been filled
      cy.get('[data-cy=streamline-save-data-entry]').should('not.be.disabled');
    });
  });
});
