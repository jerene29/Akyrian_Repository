import moment = require('moment');
import {
  GetPatientListDocument,
  GetVisitListDocument,
  GetVisitDetailsDocument,
  IPatient,
  IVisitWithIndicator,
  IFieldGroupVisitDetail,
  ISitePatient,
  IWithSourceForm,
} from '../../src/graphQL/generated/graphql';

import 'cypress-localstorage-commands';
import { TimeFormat } from '../../src/constant/DateTimeFormat';

describe('Detach, Reattach, and Attach Source Capture', () => {
  let selectedPatient: IPatient[] = [];
  let selectedVisit: IVisitWithIndicator[] = [];
  let visitDetails: IWithSourceForm = {} as IWithSourceForm;

  let unattachedFGs: IFieldGroupVisitDetail[] = [];
  let attachedFGs: IFieldGroupVisitDetail[] = [];

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

  before(() => {
    cy.clearLocalStorageSnapshot();
    cy.reseedDB();
    cy.fillInloginAsFormV2({
      email: 'admin@example.com',
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
    cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit1Visit1');
    cy.wait(`@${aliasGetPatient}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        const selectedSite = result.response.body.data.sitePatientList.filter(
          (sitePatient: ISitePatient) => sitePatient.id === 'bellevueHospital1',
        );
        selectedPatient = selectedSite[0].patients.filter(
          (patient: IPatient) => patient.id === 'multiSitePatient1',
        );
      }
    });
    cy.wait(`@${aliasGetVisit}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        selectedVisit = result.response.body.data.visitList.filter(
          (visit: IVisitWithIndicator) => visit.id === 'visit1Visit1',
        );
      }
    });
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
        attachedFGs = visitDetails.fieldGroups?.filter(
          (FG: IFieldGroupVisitDetail) => FG.formFieldGroupResponse?.status === 'ATTACHED',
        );
      }
    });
    cy.waitForReact();
    cy.get('[data-cy=sourceQuestionTab').click();
  });

  describe('Attach', () => {
    it('Attaching - Questions: Go to Unattached state, click on capture quick action check Upload/ScreenCapture modal unattached questions data', () => {
      cy.openAndCheckAttachModal(unattachedFGs);
    });
  });

  describe('Attach - Upload non JPG, JPEG, PNG, PDF file', () => {
    it('Click "Upload Picture" , choose a file with type except jpg, png and pdf should show error message modal', () => {
      cy.uploadFile('patient.json');
      cy.get('.alert-error').should('be.visible');
    });
  });

  describe('Attach - Unverified', () => {
    it('click on capture quick action and take screenshot', () => {
      cy.get('[data-cy=screenshot-sc-button]').click();
    });

    it('check top info data is correct or not', () => {
      const dob = moment(selectedPatient[0].dob).utc().format('DD MMM YYYY');
      const visitDate = moment(selectedVisit[0].visitDate).format('DD MMM YYYY');
      cy.uploadRedaction('unverified');
      cy.get('[data-cy=sc-top-info]').should('be.visible');
      cy.get('[data-cy=top-info-sc-study-id]').should('be.visible');
      cy.get('[data-cy=top-info-sc-dob]').should('be.visible').contains(dob);
      cy.get('[data-cy=top-info-sc-taken]')
        .should('be.visible')
        .contains(`${moment().format('DD MMM YYYY')} at ${moment().format(TimeFormat)} `);
      cy.get('[data-cy=top-info-sc-visit-date]').should('be.visible').contains(visitDate);
    });
  });

  describe('Attach - Unverified - Manual Redaction', () => {
    const rect = {
      x: 200,
      y: 200,
      x2: 250,
      y2: 250,
    };

    const rect2 = {
      x: 270,
      y: 50,
      x2: 320,
      y2: 100,
    };

    it('click manual redact button and right menu should change to Start Redact or Continue menu', () => {
      cy.get('[data-cy=manual-redact-button]').click();
      cy.get('[data-cy=start-redact-or-continue]').should('be.visible');
    });

    it('try drawing on canvas should not do anything', () => {
      cy.drawSingleRect(rect);
      cy.get('[data-cy=canvas-content]').matchImageSnapshot({
        failureThreshold: 100,
        failureThresholdType: 'percent',
      });
    });

    it('click start redact will show redaction complete menu', () => {
      cy.get('[data-cy=start-redacting-button]').click();
      cy.get('[data-cy=redaction-complete-menu]').should('be.visible');
    });

    it('draw on canvas should create redaction rectangle', () => {
      cy.drawSingleRect(rect);
      cy.clickRect(rect);
      cy.get('[data-cy=canvas-content]').matchImageSnapshot({
        failureThreshold: 100,
        failureThresholdType: 'percent',
      });
    });

    it('click redaction complete should show confirmation screen, the previously clicked rectangle should not show transformer and x icon anymore (screenshot), and try drawing on canvas should not do anything', () => {
      cy.get('[data-cy=redaction-complete-button]').click();
      cy.get('[data-cy=confirm-or-redact-again-menu]').should('be.visible');
      cy.get('[data-cy=canvas-content]').matchImageSnapshot(
        'Redaction complete, transformer and x icon on rect should not be visible',
        { failureThreshold: 100, failureThresholdType: 'percent' },
      );
      cy.drawSingleRect(rect2);
      cy.get('[data-cy=canvas-content]').matchImageSnapshot(
        'After complete should not be able to draw',
        { failureThreshold: 100, failureThresholdType: 'percent' },
      );
    });

    it('click confirm should redirect to suggestion page then close it', () => {
      cy.confirmRedactionRedirectToSuggestion('confirm');
      cy.get('[data-cy=cancel-bottom-chips-menu]').click();
      cy.get('[data-cy=confirmModal-confirmButton]').click();
    });
  });

  describe('Attach - Unverified - Continue to Suggestion', () => {
    it('Upload image again and fill in first name last name, click on manual redact, then choose continue and should be redirected to suggestion page﻿', () => {
      cy.openAndCheckAttachModal(unattachedFGs);
      cy.get('[data-cy=screenshot-sc-button]').click();

      cy.uploadRedaction('unverified');
      cy.get('[data-cy=manual-redact-button]').click();
      cy.confirmRedactionRedirectToSuggestion('continue');
      cy.get('[data-cy=cancel-bottom-chips-menu]').click();
      cy.get('[data-cy=confirmModal-confirmButton]').click();
    });
  });

  describe('Attach - Verified', () => {
    it('Should show continue or start redaction page after upload and check canvas should be redacted. Then click continue', () => {
      cy.openAndCheckAttachModal(unattachedFGs);
      cy.uploadFile('EMR-kylie.jpg');

      cy.uploadRedaction('verified');
      cy.get('[data-cy=canvas-content]', { timeout: 20000 })
        .should('be.visible')
        .matchImageSnapshot({ failureThreshold: 100, failureThresholdType: 'percent' });
      cy.confirmRedactionRedirectToSuggestion('continue');
      cy.get('[data-cy=cancel-bottom-chips-menu]').click();
      cy.get('[data-cy=confirmModal-confirmButton]').click();
    });
  });
  describe('Detach', () => {
    it('go to Attach and click detach on quickAction', () => {
      cy.get('[data-cy=ATTACHED]').click({ force: true });
      cy.get(`[data-cy=question-card-${attachedFGs[0].id}]`)
        .should('exist')
        .scrollIntoView({ duration: 500 });
      cy.clickQuickAction(
        `[data-cy=question-card-${attachedFGs[0].id}]`,
        `[data-cy=detach-action-${attachedFGs[0].id}]`,
        undefined,
        undefined,
        'PARENT_RELATION',
      );
      cy.get('[data-cy=attach-reattach-reason] > .ant-select > .ant-select-selector')
        .click()
        .type('{enter}');
      cy.get('[data-cy=detach]').click();
    });
  });
});
