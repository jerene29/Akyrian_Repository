import {
  GetPatientListDocument,
  GetVisitListDocument,
  GetVisitDetailsDocument,
  IFieldGroupVisitDetail,
  IWithSourceForm,
} from '../../src/graphQL/generated/graphql';

import 'cypress-localstorage-commands';

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
  cy.wait(`@${aliasGetPatient}`);
  cy.wait(`@${aliasGetVisit}`);
  cy.wait(`@${aliasGetVisitDetailSC}`).then((result) => {
    if (result?.response?.statusCode === 200) {
      visitDetails = result.response.body.data.visitDetails.withSourceForm;
      unattachedFGs = visitDetails.fieldGroups
        ?.filter((FG: IFieldGroupVisitDetail) => FG.formFieldGroupResponse?.status === 'UNATTACHED')
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

describe('pdf upload on SDE tab via the "Capture now" button', () => {
  describe('Capture modal', () => {
    it('Should mention pdf support in the source capture dialog.', () => {
      cy.get('[data-cy=todoCard-captureButton]', { timeout: 10000 }).click();
      cy.get('[data-cy=confirmation-modal-validationInfo]').contains(
        'You can only upload the following file types: JPEG, PNG or PDF with a 10 MB limit.',
      );
      cy.get('[data-cy=upload-sc-button]').contains('Upload File');
      cy.get('[data-cy=modal-close-icon]').click();
    });

    describe('Pdf validation via the "Capture now" button', () => {
      it('Should successfully upload a common valid pdf', () => {
        cy.get('[data-cy=todoCard-captureButton]').click();
        cy.uploadFile('pdf-example.pdf');
        cy.get('[data-cy=canvas-container]', { timeout: 20000 }).should('be.visible');
        cy.get('[data-cy=capture-modal-close-icon]').click();
        cy.get('[data-cy=confirmModal-confirmButton]').click();
      });

      it('Should successfully upload a 19 page pdf', () => {
        cy.get('[data-cy=todoCard-captureButton]').click();
        cy.uploadFile('19_pages.pdf');
        cy.get('[data-cy=canvas-container]', { timeout: 60000 }).should('be.visible');
        cy.get('[data-cy=capture-modal-close-icon]').click();
        cy.get('[data-cy=confirmModal-confirmButton]').click();
      });

      it('Should successfully upload a 20 page pdf', () => {
        cy.get('[data-cy=todoCard-captureButton]').click();
        cy.uploadFile('20_pages.pdf');
        cy.get('[data-cy=canvas-container]', { timeout: 60000 }).should('be.visible');
        cy.get('[data-cy=capture-modal-close-icon]').click();
        cy.get('[data-cy=confirmModal-confirmButton]').click();
      });

      it('Should fail size validation if PDF is larger than 10Mb', () => {
        cy.get('[data-cy=todoCard-captureButton]').click();
        cy.uploadFile('large.pdf');
        cy.get('[data-cy=error-alert]').contains(
          'PDF upload is limited to 10 MB in size and a total of 20 pages. Try splitting your file into fewer pages.',
        );
        cy.get('[data-cy=modal-close-icon]').click();
      });

      it('Should fail max page number validation if PDF contains more then 20 pages', () => {
        cy.get('[data-cy=todoCard-captureButton]').click();
        cy.uploadFile('21_pages.pdf');
        cy.get('[data-cy=error-alert]').contains(
          'PDF upload is limited to 10 MB in size and a total of 20 pages. Try splitting your file into fewer pages.',
        );
        cy.get('[data-cy=modal-close-icon]', { timeout: 10000 }).should('not.exist');
        cy.get('[data-cy=modal-close-icon]', { timeout: 10000 }).should('be.visible').click();
      });
    });
  });

  describe('Pdf validation via the capture quick action on the specific card', () => {
    it('Should successfully upload a 19 page pdf', () => {
      cy.clickQuickAction(
        `[data-cy=question-card-${unattachedFGs[0].id}]`,
        `[data-cy=capture-action-${unattachedFGs[0].id}]`,
      );
      cy.uploadFile('19_pages.pdf');
      cy.get('[data-cy=canvas-container]', { timeout: 60000 }).should('be.visible');
      cy.get('[data-cy=capture-modal-close-icon]').click();
      cy.get('[data-cy=confirmModal-confirmButton]').click();
    });

    it('Should successfully upload a 20 page pdf', () => {
      cy.clickQuickAction(
        `[data-cy=question-card-${unattachedFGs[0].id}]`,
        `[data-cy=capture-action-${unattachedFGs[0].id}]`,
      );
      cy.uploadFile('20_pages.pdf');
      cy.get('[data-cy=canvas-container]', { timeout: 60000 }).should('be.visible');
      cy.get('[data-cy=capture-modal-close-icon]').click();
      cy.get('[data-cy=confirmModal-confirmButton]').click();
    });

    it('Should fail size validation', () => {
      cy.clickQuickAction(
        `[data-cy=question-card-${unattachedFGs[0].id}]`,
        `[data-cy=capture-action-${unattachedFGs[0].id}]`,
      );
      cy.uploadFile('large.pdf');
      cy.get('.alert-error').should('be.visible');
      cy.get('[data-cy=error-alert]').contains(
        'PDF upload is limited to 10 MB in size and a total of 20 pages. Try splitting your file into fewer pages.',
      );
      cy.get('[data-cy=modal-close-icon]').click();
    });

    it('Should fail max page number validation', () => {
      cy.clickQuickAction(
        `[data-cy=question-card-${unattachedFGs[0].id}]`,
        `[data-cy=capture-action-${unattachedFGs[0].id}]`,
      );
      cy.uploadFile('21_pages.pdf');
      cy.get('.alert-error').should('be.visible');
      cy.get('[data-cy=error-alert]').contains(
        'PDF upload is limited to 10 MB in size and a total of 20 pages. Try splitting your file into fewer pages.',
      );
      //the dialogue will dissapear and reappeared again, that is why we are waiting for the old one to dissapear and new one to reappear.

      cy.get('[data-cy=modal-close-icon]', { timeout: 10000 }).should('not.exist');
      cy.get('[data-cy=modal-close-icon]', { timeout: 10000 }).should('be.visible').click();
    });
  });

  describe('File upload', () => {
    describe('Source Question Tab file upload', () => {
      it('Supports single page pdf uploads', () => {
        cy.clickQuickAction(
          `[data-cy=question-card-${unattachedFGs[0].id}]`,
          `[data-cy=capture-action-${unattachedFGs[0].id}]`,
        );

        cy.uploadFile('pdf-example.pdf');
        cy.get('[data-cy=canvas-container]', { timeout: 20000 }).should('be.visible');
        cy.wait(500);
        cy.getSnapshot('[data-cy=canvas-content]', {
          failureThreshold: 0.1,
          failureThresholdType: 'percent',
        });
        cy.get('[data-cy=capture-modal-close-icon]').click();
        cy.get('[data-cy=confirmModal-confirmButton]').click();
      });

      it('Supports multi-page pdf upload', () => {
        cy.clickQuickAction(
          `[data-cy=question-card-${unattachedFGs[0].id}]`,
          `[data-cy=capture-action-${unattachedFGs[0].id}]`,
        );

        cy.uploadFile('multipage.pdf');
        cy.get('[data-cy=canvas-container]', { timeout: 40000 }).should('be.visible');
        cy.wait(500);
        cy.getSnapshot('[data-cy=canvas-content]', {
          failureThreshold: 0.1,
          failureThresholdType: 'percent',
        });
        cy.get('[data-cy=capture-modal-close-icon]', { timeout: 30000 }).click();
        cy.get('[data-cy=confirmModal-confirmButton]').click();
      });
    });

    describe('Queries tab', () => {
      it('navigate to the queries tab', () => {
        cy.clickQuickAction('[data-cy=question-hearing1]', '[data-cy=add-query-hearing1]');
        cy.get('.ant-tooltip').invoke('attr', 'style', 'display: none');
        cy.get('[data-cy=upload-query]', { timeout: 10000 }).realClick();
      });

      describe('File validations', () => {
        it('Should run file size validation', () => {
          cy.uploadFile('large.pdf');
          cy.get('.alert-error').should('be.visible');
          cy.get('[data-cy=error-alert]').contains(
            'PDF upload is limited to 10 MB in size and a total of 20 pages. Try splitting your file into fewer pages.',
          );
        });
        it('Should fail max page number validation', () => {
          cy.uploadFile('21_pages.pdf');
          cy.get('.alert-error').should('be.visible');
          cy.get('[data-cy=error-alert]').contains(
            'PDF upload is limited to 10 MB in size and a total of 20 pages. Try splitting your file into fewer pages.',
          );
        });
      });

      describe('Upload pdf', () => {
        it('Supports single page pdf uploads', () => {
          cy.uploadFile('pdf-example.pdf');
          cy.get('[data-cy=canvas-container]', { timeout: 20000 }).should('be.visible');
          cy.wait(2000);
          cy.getSnapshot('[data-cy=canvas-content]', {
            failureThreshold: 0.1,
            failureThresholdType: 'percent',
          });
          cy.get('[data-cy=capture-modal-close-icon]', { timeout: 10000 }).click();
          cy.wait(500);
        });
        it('Supports multi-page pdf upload', () => {
          //this takes much time to render properly
          cy.uploadFile('multipage.pdf');
          cy.get('[data-cy=canvas-container]', { timeout: 40000 }).should('be.visible');
          cy.wait(4000);
          cy.getSnapshot('[data-cy=canvas-content]', {
            failureThreshold: 0.1,
            failureThresholdType: 'percent',
          });
          cy.get('[data-cy=capture-modal-close-icon]', { timeout: 5000 }).click();
          cy.get('[data-cy=modal-close]').click();
        });
      });
    });
  });
});

describe('EDC Tab', () => {
  describe('Navigate to EDC Tab and test pdf uploads', () => {
    it('Should allow a 20-page pdf document', () => {
      cy.get('[data-cy=noSourceQuestionTab]').click();
      cy.uploadFile('20_pages.pdf', 'input[data-cy=answer-input-fileMultiEntryId1-0]');
      cy.get('[data-cy=canvas-container]', { timeout: 60000 }).should('be.visible');
      cy.get('[data-cy=capture-modal-close-icon]').click();
    });

    it('Should fail size validation ', () => {
      cy.get('[data-cy=noSourceQuestionTab]').click();
      cy.uploadFile('large.pdf', 'input[data-cy=answer-input-fileMultiEntryId1-0]');
      cy.get('.alert-error').should('be.visible');
      cy.get('[data-cy=error-alert]').contains(
        'PDF upload is limited to 10 MB in size and a total of 20 pages. Try splitting your file into fewer pages.',
      );
    });

    it('Should fail a 21-page pdf document', () => {
      cy.uploadFile('21_pages.pdf', 'input[data-cy=answer-input-fileMultiEntryId1-0]');
      cy.get('.alert-error').should('be.visible');
      cy.get('[data-cy=error-alert]').contains(
        'PDF upload is limited to 10 MB in size and a total of 20 pages. Try splitting your file into fewer pages.',
      );
    });
  });

  describe('File Upload', () => {
    it('Supports single page pdf uploads', () => {
      cy.uploadFile('pdf-example.pdf', 'input[data-cy=answer-input-fileMultiEntryId1-0]');
      cy.get('[data-cy=canvas-container]', { timeout: 20000 }).should('be.visible');
      cy.wait(500);
      cy.getSnapshot('[data-cy=canvas-content]', {
        failureThreshold: 0.1,
        failureThresholdType: 'percent',
      });
      cy.get('[data-cy=capture-modal-close-icon]').click();
    });

    it('Supports multi-page pdf upload', () => {
      cy.uploadFile('multipage.pdf', 'input[data-cy=answer-input-fileMultiEntryId1-0]');
      cy.get('[data-cy=canvas-container]', { timeout: 20000 }).should('be.visible');
      cy.wait(1000);
      cy.getSnapshot('[data-cy=canvas-content]', {
        failureThreshold: 0.1,
        failureThresholdType: 'percent',
      });
      cy.get('[data-cy=capture-modal-close-icon]').click();
    });
  });
});
