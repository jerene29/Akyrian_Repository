/* eslint-disable @typescript-eslint/no-namespace */
// / <reference types="Cypress" />
// --------------------------------------
// Log in and return auth token.
// --------------------------------------
// Cypress.Commands.add('login', () => {
//   const apiLoginRoot = Cypress.env('API_LOGIN_ROOT');

//   const body = {
//     email,
//     password,
//   };

//   return cy.request({
//     method: 'POST',
//     url: `${apiLoginRoot}/oauth/token`,
//     body,
//   });
// });

// --------------------------------------
// --------------------------------------

// eslint-disable-next-line @typescript-eslint/no-namespace
import 'cypress-file-upload';
import 'cypress-localstorage-commands';
import { Options } from 'cypress-image-snapshot';
import { addMatchImageSnapshotCommand } from 'cypress-image-snapshot/command';
import { Position, ScrollBehaviorOptions } from 'cypress-real-events/getCypressElementCoordinates';
import {
  IFieldGroupVisitDetail,
  IForm,
  IFormDetailsFragment,
  IFormFieldGroup,
  INotificationWithData,
  IFormFieldType,
} from '../../../src/graphQL/generated/graphql';
import { VisitInputType } from './studyConfigGrid';
import { RealHoverOptions } from 'cypress-real-events/commands/realHover';
import { OCRLabel, OCRName, SnippetTool } from './canvas';
import { StudyConfigGridViewCommands } from './studyConfigGridView';
import {
  RejectModal,
  AcceptRejectParams,
  CheckStreamMilestoneCounterInput,
  CheckResultAfterConfirmInReviewYourWorkInput,
  ModalCaptureInvoker,
  SnippetAndDataEntryInput,
  CheckDEForm,
  CheckDEInReviewYourWork,
  OCRNameInput,
  CheckBubbleInput,
  QuestionType,
  WorkflowBarStatus,
  InputTypeId,
} from './streamline';

type PatientType = 'SLO-OMN192' | 'TKK-TUH278';
addMatchImageSnapshotCommand({
  failureThreshold: 0.03, // threshold for entire image
  failureThresholdType: 'percent', // percent of image or number of pixels
  customDiffConfig: { threshold: 0.1 }, // threshold for each pixel
  capture: 'viewport', // capture viewport in screenshot
});
declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      graphQL(method: string, data: { query: string; variables: any }): Chainable<Subject>;
      defaultAddPatientForm(isAutoGenerate?: boolean): Promise<any>;
      fillInAddPatientForm(addPatientData: any, withSuccess: any, isAutoGenerate: any): void;
      multiSelect(args: { field: string; name?: string; count?: number }): void;
      fillInAddPatientFormValidation(): void;
      fillInAddPatientFormValidationSite(): void;
      hideSideBar(): void;
      scrollToElement(selector: string, duration?: number): Chainable<Subject>;
      cssDisableMotion(selector?: string): void;
      addRandomPatientScreening(): void;
      getSnapshot(selector: string, options?: Options): Chainable<Subject>;
      getElementSnapshot(selector?: string): Chainable<Subject>;
      getTextSnapshot(selector?: string): Chainable<Subject>;
      shouldBeVisible(selector: string): Chainable<Subject>;
      shouldNotBeVisible(selector: string): Chainable<Subject>;
      hover(selector: string): Chainable<Subject>;
      isGone(selector: string, timeout?: number): Chainable<Subject>;
      getStyleSnapshot(
        declaration: keyof CSSStyleDeclaration,
        selector?: string,
      ): Chainable<Subject>;
      getCSSClassSnapshot(selector: string): Chainable<Subject>;
      dropdownSelect(args: {
        name: string;
        upAmount?: number;
        downAmount?: number;
      }): Chainable<Subject>;

      // generic form commands
      fillInTodayForDateDropdown(): void;

      // GridView Commands Collection
      studyConfigGridView: () => StudyConfigGridViewCommands;

      // START VISIT
      openSideBarShowVisit(): void;
      defaultStartVisitForm(): void;
      fillAndStartVisitForm(submitVisitStatusData: any, clickArrow?: boolean): Promise<void>;
      fillAndStartVisitFormNotOccured(submitVisitStatusData: any): void;
      fillInAddAdHocForm(): void;
      submitAddAdHocForm(): void;
      renderAdHocModal(): void;

      // LOGIN
      fillInloginAsFormV2(
        data: any,
        studyId?: string,
        studyRevisionId?: string,
        pageType?: 'study-question',
        acceptPolicy?: boolean,
      ): void;
      loginAs(email: string, studyId?: string, studyRevisionId?: string): void;
      fillInloginAsForm(data: any, redirectToVisit?: boolean): void;

      // LOCAL STORAGE
      saveLocalStorageCache(): void;
      restoreLocalStorageCache(): void;
      clearLocalStorage(): void;

      // VISIT DETAILS
      openAndSubmitEditAnswerReason(): Promise<any>;
      checkSaveCancelAndInputBehavior(FG: any): void;
      checkFilterExceptAllFilter(visitDetails: any): void;
      checkFilterAllFilter(visitDetails: any): void;
      checkTotalQuestionCardExceptOnAllFilter(visitDetails: any): void;
      checkHiddenInput(getParam: string, expectedId: string, retries: number): void;
      checkStateLabelCount(getParam: string, expectedCount: number, retries: number): void;
      checkAuditTrail(visitDetails: any): void;
      checkQuickActions(visitDetails: any): void;
      checkQueryButton(visitDetails: any): void;
      checkAssociated(associates: any, firstFGID: any): void;
      checkHighlight(firstFG: any): void;
      clickQuickAction(
        parentSelector: string,
        iconSelector: string,
        scrollBehavior?: ScrollBehaviorOptions,
        position?: RealHoverOptions['position'],
        type?: 'NORMAL' | 'PARENT_RELATION' | 'SVG',
      ): void;
      editNoSourceQuestionReason(ffgrId: string, reasonLabel?: string): void;
      // SNIPPET CANVAS
      drawSingleRect(
        point: { x: number; y: number; x2: number; y2: number },
        drawFrom?: 'bottom-right' | 'top-left',
        force?: boolean,
      ): void;
      drawMultiRect(points: { x: number; y: number; x2: number; y2: number }[]): void;
      clickRect(point: { x: number; y: number; x2: number; y2: number }): void;
      clickXIcon(
        point: { x: number; y: number; x2: number; y2: number },
        type?: 'redaction' | 'snippet',
        force?: boolean,
      ): void;
      clickEditOrConfirmIconBelowSnippet(point: {
        x?: number;
        y?: number;
        x2: number;
        y2: number;
      }): void;
      selectMarkup(
        OCRName: OCRName,
        point: { x: number; y: number; x2: number; y2: number },
        markupIndex?: number,
        position?: 'top' | 'bottom' | 'left',
        clickBottomChip?: boolean,
      ): void;
      hoverMarkup(
        point: { x: number; y: number; x2: number; y2: number },
        markupIndex?: number,
      ): void;
      onHoverTo(point: { x: number; y: number; x2: number; y2: number }): void;
      draggingRect(
        rect: { x: number; y: number; x2: number; y2: number },
        targetPoint: { x: number; y: number },
        OCRName?: OCRName,
        withBottomChipClick?: boolean,
        force?: boolean,
        dragWithNoLoop?: boolean,
      ): void;
      transformingRect(
        rect: { x: number; y: number },
        targetPoint: { x: number; y: number },
        OCRName?: OCRName,
        withBottomChipClick?: boolean,
      ): void;
      setSliderValue(value: number): Chainable<void>;
      dragFloatingBarTo(to: Position): void;
      exitCanvasModal(): void;
      zoomReset(): void;
      exitStreamlineCanvasModal(): void;
      waitForCanvasToLoad(): void;
      removeChipFromBottomSection(
        OCRName: OCRName,
        type?: 'all' | 'delete' | 'assert',
        showReasonModal?: boolean,
        isHoveringChip?: boolean,
      ): void;
      chipShouldHaveNoColorHighlight(OCRName: OCRName): void;
      openSnippetReasonModal(OCRName: OCRName): void;
      detachSCWithOtherReason(OCRName: OCRName, action: 'submit' | 'cancel'): void;
      checkBottomChipActiveOrInactive(OCRName: OCRName, checkActive?: boolean): void;
      checkBottomChipClickableHoverable(OCRName: OCRName, showEditDeleteIcon?: boolean): void;
      editSnippetReasonModal(isSubmitting?: boolean): void;
      submitSnippetButtonIsDisabled(): void;
      drawSnippetAndSelect(
        point:
          | { x: number; y: number; x2: number; y2: number }
          | { x: number; y: number; x2: number; y2: number }[],
        label: OCRLabel,
        isMultiSnippet?: boolean,
        force?: boolean,
      ): void;
      selectLabelFromCanvasDropdown(label: OCRLabel): void;
      clickBottomChip(OCRName: OCRName, withZoomReset?: boolean): void;
      hoverBottomChip(OCRName: OCRName, options?: RealHoverOptions): void;
      editSnippetFromBottomSection(
        OCRName: OCRName,
        withBottomChipClick?: boolean,
        useShouldExist?: boolean,
      ): void;
      removeTooltipIfVisible(): void;
      checkChipAfterRemoveSnippet(OCRName: OCRName): void;
      checkChipAfterCreateSnippet(OCRName: OCRName): void;
      setSnippetToolsTooltipToBeHidden(): void;
      clickSnippetTool(tool: SnippetTool): void;
      clickSubmitToFormViewDisplayButton(): void;
      clickBackToMarkupDisplayButton(): void;
      clickChipInFloatingBar(
        OCRName: OCRName | OCRNameInput,
        waitZoomedInToSnippetFor?: number,
      ): void;
      removeStreamlineBackdropIfVisible(): void;
      isViewModeSnippetOCR(OCRLabel: OCRLabel): void;
      checkIfModalIsEditMode(isStreamline?: boolean): void;
      clickCancelNonStreamline(): void;
      monitorFlowModaIsVisible(): void;

      // SOURCE CAPTURE
      openAndCheckAttachModal(FGs: IFieldGroupVisitDetail[]): Promise<any>;
      clickSaveSnippetButton(): void;
      fillInFirstNameLastNameSCIntake(name: { first: string; last: string }): Promise<any>;
      getUnverifiedData(patientData: {
        patientsName: boolean;
        dateOfBirth: boolean;
        visitDate: boolean;
      }): Promise<any>;
      confirmRedactionRedirectToSuggestion(
        type: 'continue' | 'confirm',
        useFixture?: boolean,
        isStreamline?: boolean,
      ): Promise<any>;
      confirmRedactionToSuggestionNoWait(
        type: 'continue' | 'confirm',
        useFixture?: boolean,
        isStreamline?: boolean,
      ): Promise<any>;
      waitForRedactionResult(retries: number): Promise<any>;
      waitForSuggestionResult(retries: number): Promise<any>;
      uploadRedaction(type: 'verified' | 'unverified', useFixture?: boolean): Promise<any>;
      getColor(index: number): Promise<any>;
      checkStateData(questionFilter: any, patient: any, rejectedName: any): void;
      markAsNoAnswerStates(questionFilter: any, patient: any, rejectedName: any): void;

      // TODOLIST
      checkTodolistNoSource(todolistData: any): void;
      checkTodolistSource(todolistData: any): void;

      // Study Config
      defaultCreateStudy(): void;
      fillCreateStudy(createStudyData: any): void;
      checkInputIfEmpty(): void;
      createStudy(args: { name?: string; formCount: number; visitCount: number }): void;

      // Study Config - Question
      dragAndDrop(subject: any, target: any, yPos?: number): Promise<any>;
      checkActiveQuestionFieldUI(dataCy: string, source?: 'stock'): void;
      openCollapseQuestionDetails(type: 'group' | 'field', withAnswer?: boolean): void;
      checkQuestionAttributes(
        type: 'editable' | 'uneditable',
        questionType: 'group' | 'field' | 'both',
        FFG: IFormFieldGroup,
        FFIndex: number,
      ): void;
      fillInQuestionDetails(
        lastId: number,
        data: { shortQuestion: string; question: string; oid: string; keyword: string },
        FFType: IFormFieldType,
        type: 'field' | 'group',
        noSCNeeded?: boolean,
      ): void;
      fillInQuestionAnswers(ids?: string[]): Promise<void>;
      clearQuestionDetails(lastId: number): void;
      saveCreateQuestion(): Promise<any>;
      saveUpdateQuestion(): Promise<any>;
      checkDetailQuestion(dataFFG: any, text?: string): void;
      checkSearchQuestion(text: string): void;

      // Study Config - Form
      openEditFormRightMenu(form: IForm): void;
      checkFormDefaultPreFilled(form: IFormDetailsFragment): void;
      checkEditFormStudySettingsDefault(form: IForm): void;
      checkEditFormStudySettingsAndSubmit(form: IForm): void;
      checkEditFormStudySettingsAndCancel(form: IForm): void;

      // OTHERS
      getFirstFGandSCandSCImgs(visitDetailsSource: any, visitData: any): Promise<any>;
      uploadFile(fileName: string, selector?: string): Promise<any>;
      checkSubmitButtonActive(submitButtonCy: string): void;
      clearAuthCookies(): void;
      reseedDB(): Promise<any>;
      customRequest(document: any, variables: any): Promise<any>;
      logout(): Promise<any>;
      checkVisitInModal(visit: any): void;
      checkQuestionValue(visitDetails: any, type: 'noSource' | 'source'): void;

      // AUTH
      beforeSetup(args?: any): void;
      clearSetPasswordForm(): void;
      fillSetPasswordForm(values: any): Promise<any>;
      checkCount(value: any): Promise<any>;
      getStudyListSidebar(document: any, category: any): Promise<any>;

      // SIDEBAR
      handleVisitList(index: any, visitCount: any): void;
      handlePatientList(site: any): void;

      // NOTIFICATION
      checkUINotifOnNurseDetails(
        notif: INotificationWithData,
        type: 'nurse-landing' | 'nurse-details',
      ): void;

      // SEARCH

      typeSearch(data: string): Promise<any>;
      getCurrentAndTotalQuestions(question: number, all: number): void;
      getSearchResult(
        current: number,
        filteredCurrent: number,
        filteredTotal: number,
        total: number,
        isInvestigator?: boolean,
      ): void;

      // Navigation
      navigateToPatient(patient: PatientType): void;

      // Modals
      checkModalHeader(title: string): void;

      // USER CONFIG
      approveTraining(): void;
      loginAndAcceptPlatformPrivacy(email: string): void;

      // Study config grid
      fillAddVisitConfiguration(params: VisitInputType): void;
      fillAddVisitOrFormNumber(amount: number): void;
      fillEditVisitConfiguration(params: VisitInputType): void;

      // Streamline SA
      rejectDE(params: AcceptRejectParams): void;
      rejectSC(params: AcceptRejectParams): void;
      rejectSnippet(params: AcceptRejectParams): void;
      acceptDE(params: AcceptRejectParams): void;
      checkRejectModalFunctionality(type: RejectModal): void;
      checkSnippetAssessmentUI(type: QuestionType): void;
      clickEditButtonStreamline(): void;

      // Streamline SC
      openSCFlow(): void;
      testModalCapture(invoker: ModalCaptureInvoker): void;
      uploadSCImage(): void;
      closeModalCapture(): void;
      checkUploadMilestoneProgress(progress: 'IN_PROGRESS' | 'NO_PROGRESS' | 'FINISHED'): void;
      useRedactSuggestionStreamline(): void;
      checkSCQueueExist(sourceCaptureId: string): void;
      addPatientForStreamline(params: { patientID: string }): void;
      checkConfirmationModalContent(params: { title: string; description?: string }): void;
      addSnippet(category: OCRNameInput, force?: boolean): void;
      snippetAndDataEntryStreamlineSC(input: SnippetAndDataEntryInput): void;
      getVisitDetailAndGoToSCTab(aliasVisitDetails: string | undefined, visit: string): void;
      goToStatusAndOpenSnippetQuickAction(status: WorkflowBarStatus, questionId: string): void;
      chipAndSnippetShouldHaveTheSameColor(OCRName: OCRName): void;
      flotingBarChipIsHiglighted(OCRName: OCRName, isHighlighted: boolean): void;
      clickFloatingBarChip(OCRName: OCRNameInput, force: boolean): void;
      skipDataEntryButtonShouldBeDisabled(shouldBe?: boolean): void;
      skipDEAfterDragSnippetAndSelectReasonShouldNotBeDisabled(OCRName: OCRName): void;
      clickAddDEOrEditButton(): void;
      clearDEField(): void;
      clickMarkAsNoAnswerIcon(OCRName: OCRName): void;
      selectMarkAsNoAnswerReason(OCRName: OCRName, chooseOther?: boolean): void;
      selectDEReason(OCRName: OCRName): void;
      fillDEFormAndSelectReason(OCRName: OCRName, OCRNameInput: OCRNameInput, type?: string): void;
      exitCanvasPage(confirmExit?: boolean): void;
      DEInputFormExist(OCRName: OCRName): Chainable<Subject>;
      addDEInputForm(OCRName: OCRName, value: string | number): void;
      noAnswerIsExistInSnippetViewMode(): void;
      checkMonitorFlowBodyVisibility(shouldIndicator: 'visible' | 'notExist'): void;
      checkValueDataEntry(params: CheckDEForm): void;
      clickCanvasTools(
        canvasTool: 'Snippet' | 'Redaction' | 'Opacity' | 'ZoomIn' | 'ZoomOut' | 'Grab',
        forceClick?: boolean,
      ): void;
      checkStreamlineMilestoneCounter(params: CheckStreamMilestoneCounterInput): void;
      checkBubbleBehaviour(params: CheckBubbleInput): void;
      toggleExpandMode(): void;
      toggleCompactMode(): void;
      checkDataEntryInReviewYourWork(params: CheckDEInReviewYourWork): void;
      checkResultAfterConfirmInReviewYourWork(
        params: CheckResultAfterConfirmInReviewYourWorkInput,
      ): void;
      checkSelectedBottomChipOnLeftSection(selector: string): void;
      checkSelectedBottomChipOnRightSection(selector: string): void;
      clickCancelStreamline(): void;
      getDEModalContainer(): Chainable<Subject>;
      getQuestionInputForm(
        inputType: InputTypeId,
        rowIndex: number,
        colIndex: number,
      ): Chainable<Subject>;
    }
  }
}
