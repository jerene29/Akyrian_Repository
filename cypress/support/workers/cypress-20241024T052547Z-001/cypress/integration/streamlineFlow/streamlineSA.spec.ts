import { OperationDefinitionNode } from 'graphql';
import 'cypress-localstorage-commands';
import {
  GetVisitDetailsDocument,
  UpdateWithSourceResponsesDocument,
} from '../../../src/graphQL/generated/graphql';

const redactionPosition = {
  x: 200,
  y: 50,
  x2: 250,
  y2: 100,
};

const singleSnippet = {
  x: 50,
  y: 50,
  x2: 100,
  y2: 100,
};

describe.skip('Streamline Flow Snippet Assesment', () => {
  const visitDetailDefinitions = GetVisitDetailsDocument.definitions[0] as OperationDefinitionNode;
  const updateWithSourceDefinitions = UpdateWithSourceResponsesDocument
    .definitions[0] as OperationDefinitionNode;

  const aliasVisitDetails = visitDetailDefinitions.name?.value;
  const aliasSubmitDataEntry = updateWithSourceDefinitions.name?.value;

  before(() => {
    cy.clearLocalStorageSnapshot();
    cy.reseedDB();
  });

  describe('Admin Flow', () => {
    it('Login as admin user', () => {
      cy.fillInloginAsFormV2({
        email: 'admin@example.com',
      });
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasVisitDetails) {
          req.alias = req.body.operationName;
        }
      });

      cy.visit('/visit/testRevisionId1/bellevueHospital1/kylieMatulich/visit1VisitKYM');
      cy.wait(`@${aliasVisitDetails}`);

      cy.get('[data-cy=sourceQuestionTab]').click();
      cy.get('[data-cy=UNATTACHED]').click().trigger('mouseout');
    });

    it('Upload SC', () => {
      cy.clickQuickAction(`[data-cy=question-card-abdomen1]`, `[data-cy=capture-action-abdomen1]`);
      cy.uploadFile('EMR-kylie.jpg');
      cy.uploadRedaction('unverified', false);
      cy.get('[data-cy=continue-to-suggestion-button]').click();
      cy.get('[data-cy=confirm-redact-button]').click();
      cy.get('canvas', { timeout: 90000 }).should('be.visible');
      cy.get('[data-cy=submit-bottom-chips-menu]').should('be.disabled');
      cy.get('[data-cy=right-chip-Abdomen]').click();
      cy.get('[data-cy=right-chip-Heartbeatpatient]').click();
      cy.get('[data-cy=right-chip-Brain]').click();
      cy.get('[data-cy=submit-bottom-chips-menu]').should('be.enabled').click();
      cy.get('[data-cy=alert-success]', { timeout: 10000 })
        .should('be.visible')
        .should('contain.text', 'Source capture submitted');
    });

    it('Create Snippet for Abdomen', () => {
      cy.get('[data-cy=ATTACHED]').click().trigger('mouseout');
      cy.clickQuickAction(`[data-cy=question-card-abdomen1]`, `[data-cy=snippet-action-abdomen1]`);
      cy.get('[data-cy=submit-bottom-chips-menu]').should('be.disabled');
      cy.drawSnippetAndSelect(singleSnippet, 'Abdomen');
      cy.get('[data-cy=submit-bottom-chips-menu]').should('be.enabled').click();
      cy.get('[data-cy=done-snippet-button]').click();
      cy.get('[data-cy=alert-success]', { timeout: 5000 })
        .should('be.visible')
        .should('contain.text', 'Snippet submitted');
    });

    it('Create Snippet for Heartbeat Patient', () => {
      cy.get('[data-cy=ATTACHED]').click().trigger('mouseout');
      cy.clickQuickAction(`[data-cy=question-card-heart1]`, `[data-cy=snippet-action-heart1]`);
      cy.get('[data-cy=submit-bottom-chips-menu]').should('be.disabled');
      cy.drawSnippetAndSelect(singleSnippet, 'Heartbeat patient');
      cy.get('[data-cy=submit-bottom-chips-menu]').should('be.enabled').click();
      cy.get('[data-cy=done-snippet-button]').click();
      cy.get('[data-cy=alert-success]', { timeout: 5000 })
        .should('be.visible')
        .should('contain.text', 'Snippet submitted');
      cy.wait(4000);
    });

    /** currently intermittent failing where edit snippet modal not showing up*/
    it('Edit one of the Completed Snippet under Pending Review, should pre-selected to the selected chip', () => {
      cy.get('[data-cy=MARKED_UP]').click().trigger('mouseout');
      cy.clickQuickAction('[data-cy=question-card-heart1]', '[data-cy=edit-snippet-action-heart1]');
      cy.editSnippetReasonModal();
      cy.clickCancelNonStreamline();
      cy.clickBottomChip('Abdomen');
      cy.clickEditButtonStreamline();
      cy.editSnippetReasonModal();
    });

    it('After Save Snippet Should on View Mode State', () => {
      cy.clickSaveSnippetButton();
      cy.get('[data-cy=monitor-flow-body]').should('be.visible');
      cy.exitCanvasPage(true);
    });

    it('Reject Snippet Abdomen & Heartbeat Patient', () => {
      cy.get('[data-cy=MARKED_UP]').click().trigger('mouseout');
      cy.clickQuickAction(
        '[data-cy=question-card-heart1]',
        '[data-cy=review-sc-snippet-action-heart1]',
      );
      cy.get('[data-cy=overlapping-button-reject-snippet]').click();
      cy.get('[data-cy=reject-reason] > .ant-select > .ant-select-selector')
        .click()
        .type('{downarrow}{enter}');
      cy.get('[data-cy=submit-reject-reason]').click();
      cy.get('[data-cy=overlapping-button-reject-snippet]').click();
      cy.get('[data-cy=reject-reason] > .ant-select > .ant-select-selector')
        .click()
        .type('{downarrow}{enter}');
      cy.get('[data-cy=submit-reject-reason]').click();
    });

    it('Check Question Chip Should Not Show Previous Reason Modal', () => {
      cy.get('[data-cy=NOT_AVAILABLE_REJECTED]').click();
      cy.get('[data-cy=question-heart1]').should('exist').click();
      cy.clickQuickAction('[data-cy=question-card-heart1]', '[data-cy=edit-snippet-action-heart1]');
      // Test hover on rejected chip, container rejected should not blinked
      cy.getSnapshot('[data-cy=rejected-right-section]'); // should only shows 1 question in single row in rejected section
      cy.get('[data-cy=bottom-chip-text-Heartbeatpatient]').realHover();
      // Done Test Blinked
      cy.clickSaveSnippetButton();
      cy.get('#monitor-flow-body-heart1 > div.mt-3 > [data-cy=reject-data-entry]').should(
        'not.exist',
      );
      cy.get('[data-cy=bottom-chip-delete-Heartbeatpatient]').click();
      cy.drawSingleRect(redactionPosition);
      cy.get('#monitor-flow-body-heart1 > div.mt-3 > [data-cy=reject-data-entry]').should(
        'not.exist',
      );
      cy.exitCanvasPage(true);
      cy.logout();
      cy.reload();
    });
  });

  describe('Mark No Answer FFG and Input FFG with New Source Capture as Admin User', () => {
    it('Login as admin user', () => {
      cy.fillInloginAsFormV2({
        email: 'admin@example.com',
      });
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasVisitDetails) {
          req.alias = req.body.operationName;
        }
      });

      cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit1Visit1');
      cy.wait(`@${aliasVisitDetails}`);

      cy.get('[data-cy=sourceQuestionTab]').click();
      cy.get('[data-cy=UNATTACHED]').click().trigger('mouseout');
    });

    describe('Mark No Answer Questions', () => {
      it('Mark Weight as No Answer from Unattached State', () => {
        cy.clickQuickAction(`[data-cy=question-card-weight1]`, `[data-cy=noanswer-action-weight1]`);
        cy.get('[data-cy=button-submit-noanswer]').should('be.disabled');
        // Note : sometimes the mark no answer quickaction tooltip is still visible and blocked the dropdown
        cy.get('[data-cy=mark-no-answer-reason-select]').click({ force: true }).type(`{enter}`);
        cy.get('[data-cy=button-submit-noanswer]').click();
        cy.get('[data-cy=alert-success]', { timeout: 5000 }).should('be.visible');
      });
      it('Mark Weight as No Answer from Unattached State', () => {
        cy.get('[data-cy=ATTACHED]').click().trigger('mouseout');
        cy.clickQuickAction(
          `[data-cy=question-card-bloodType1]`,
          `[data-cy=noanswer-action-bloodType1]`,
        );
        cy.get('[data-cy=button-submit-noanswer]').should('be.disabled');
        // Note : sometimes the mark no answer quickaction tooltip is still visible and blocked the dropdown
        cy.get('[data-cy=mark-no-answer-reason-select]').click({ force: true }).type(`{enter}`);
        cy.get('[data-cy=button-submit-noanswer]').click();
        cy.get('[data-cy=alert-success]', { timeout: 5000 }).should('be.visible');
      });
    });

    describe('Upload SC and Input Entry for Muscle', () => {
      it('Upload SC for muscle', () => {
        cy.get('[data-cy=UNATTACHED]').click().trigger('mouseout');
        cy.clickQuickAction(`[data-cy=question-card-muscle1]`, `[data-cy=capture-action-muscle1]`);
        cy.uploadFile('dummy-screenshot.png');
        cy.uploadRedaction('unverified', false);
        cy.get('[data-cy=manual-redact-button]').click();
        cy.get('[data-cy=continue-to-suggestion-button]').click();
        cy.get('[data-cy=confirm-redact-button]').click();
        cy.get('canvas', { timeout: 60000 }).should('be.visible');
        cy.get('[data-cy=submit-bottom-chips-menu]').should('be.disabled');
        cy.get('[data-cy=right-chip-Muscle]').click();
        cy.get('[data-cy=submit-bottom-chips-menu]').should('be.enabled').click();
        cy.get('[data-cy=alert-success]', { timeout: 10000 })
          .should('be.visible')
          .should('contain.text', 'Source capture submitted');
        cy.get('[data-cy=question-card-muscle1]').should('not.exist');
      });

      it('Create Snippet for muscle', () => {
        cy.get('[data-cy=ATTACHED]').click().trigger('mouseout');
        cy.clickQuickAction(`[data-cy=question-card-muscle1]`, `[data-cy=snippet-action-muscle1]`);
        cy.get('[data-cy=submit-bottom-chips-menu]').should('be.disabled');
        cy.drawSnippetAndSelect(singleSnippet, 'Muscle');
        cy.get('[data-cy=submit-bottom-chips-menu]').should('be.enabled').click();
        cy.get('[data-cy=done-snippet-button]').click();
        cy.get('[data-cy=alert-success]', { timeout: 5000 })
          .should('be.visible')
          .should('contain.text', 'Snippet submitted');
      });

      it('Accept Snippet for muscle', () => {
        cy.get('[data-cy=MARKED_UP]').click().trigger('mouseout');
        cy.clickQuickAction(
          '[data-cy=question-card-muscle1]',
          '[data-cy=review-sc-snippet-action-muscle1]',
        );
        cy.get('canvas', { timeout: 20000 }).should('be.visible');
        cy.get('[data-cy=button-approve-sa]').click();
        cy.get('[data-cy=alert-success]', { timeout: 15000 })
          .should('be.visible')
          .should('contain.text', 'Approved');
        cy.get('[data-cy=carousel-close]', { timeout: 40000 }).click();
      });

      it('Input DE for muscle', () => {
        cy.intercept('POST', '/graphql', (req) => {
          if (req.body.operationName === aliasSubmitDataEntry) {
            req.alias = req.body.operationName;
          }
        });

        cy.get('[data-cy=MARK_UP_ACCEPTED]').click().trigger('mouseout');
        cy.clickQuickAction(
          '[data-cy=question-card-muscle1]',
          '[data-cy=data-entry-action-muscle1]',
        );
        cy.get('.slick-active [data-cy=answer-input-field-ffMuscleCon1-0-0]').type('123', {
          delay: 10,
        });
        cy.get('.slick-active [data-cy=submit-data-entry]').click();
        cy.wait(`@${aliasSubmitDataEntry}`).then((result) => {
          if (result?.response?.statusCode === 200) {
            cy.get('[data-cy=alert-success]', { timeout: 5000 })
              .should('be.visible')
              .should('contain.text', 'Question Submitted');
            cy.get('.slick-active [data-cy=close-data-entry').click();
          }
        });
      });
    });
  });

  describe('Check Streamline SA Flow', () => {
    it('login as streamline SA user', () => {
      cy.logout();
      cy.fillInloginAsFormV2({
        email: 'streamlinesa@example.com',
      });
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasVisitDetails) {
          req.alias = req.body.operationName;
        }
      });
      cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit1Visit1');
      cy.wait(`@${aliasVisitDetails}`);
      cy.get('[data-cy=sourceQuestionTab]').click();
      cy.get('[data-cy=FILLED]').click().trigger('mouseout');
    });

    it('Open Streamline SA Canvas from quick action ', () => {
      cy.clickQuickAction(
        `[data-cy=question-card-heart1]`,
        `[data-cy=review-sc-snippet-action-heart1]`,
      );
      cy.get('canvas', { timeout: 20000 }).should('be.visible');
    });

    it('Check Available Quick Action', () => {
      cy.get('[data-cy=ZoomIn]').should('be.visible');
      cy.get('[data-cy=ZoomOut]').should('be.visible');
      cy.get('[data-cy=Opacity]').should('be.visible');
      cy.get('[data-cy=add-query-action]').should('be.visible');
      cy.get('[data-cy=snippet-action]').should('be.visible');
    });

    it('Check Redaction Quick Action', () => {
      cy.get('[data-cy=snippet-action]').click();
      cy.get('[data-cy=done-snippet-button]').should('be.disabled');
      cy.get('canvas', { timeout: 80000 }).should('be.visible');
      cy.drawSingleRect(redactionPosition);
      cy.get('[data-cy=done-snippet-button]').should('be.enabled').click();
      cy.get('canvas', { timeout: 80000 }).should('be.visible');
      cy.wait(8000);
      cy.getSnapshot('[data-cy=canvas-content]', {
        failureThreshold: 0.01,
        failureThresholdType: 'percent',
      });
      cy.get('[data-cy=carousel-close]').click();
      cy.wait(5000);
    });

    describe('Accept & Reject Snippet/SourceCapture/DataEntry', () => {
      describe('Reject Snippet Heartbeat FFGR', () => {
        it('Check Heartbeat Markup', () => {
          if (cy.get('.ant-tooltip')) {
            cy.get('.ant-tooltip').invoke('attr', 'style', 'display: none');
          }
          cy.clickQuickAction(
            `[data-cy=question-card-heart1]`,
            `[data-cy=review-sc-snippet-action-heart1]`,
          );
          cy.get('[data-cy=verifier-title-heart1]').contains('Heartbeat patient:');
          cy.get('canvas', { timeout: 20000 }).should('be.visible');
          cy.getSnapshot('[data-cy=canvas-content]', {
            failureThreshold: 0.01,
            failureThresholdType: 'percent',
          });
          cy.checkSnippetAssessmentUI('FILLED_FROM_SC');
        });
        it('Check reject snippet modal functionality', () => {
          cy.checkRejectModalFunctionality('Snippet');
        });
        it('Reject snippet', () => {
          cy.rejectSnippet({
            onSuccess: () => {
              cy.get('[data-cy=alert-success]', { timeout: 5000 })
                .should('be.visible')
                .should('contain.text', 'Snippet Rejected');
              // move to next question
              cy.get(`[data-cy=verifier-title-bloodType1]`).should('be.visible');
              cy.wait(5000);
            },
          });
        });
      });

      describe('Accept Blood Type FFGR (Mark No Answer from Attached State)', () => {
        it('Open From Quick Action and Check Markup', () => {
          cy.get('canvas', { timeout: 20000 }).should('be.visible');
          cy.getSnapshot('[data-cy=canvas-content]', {
            failureThreshold: 0.01,
            failureThresholdType: 'percent',
          });
          cy.get('[data-cy=verifier-title-bloodType1]').contains('Blood Type');
          cy.checkSnippetAssessmentUI('MARKED_NO_ANSWER_WITH_SC_FROM_ATTACHED');
        });

        it('Accept Data Entry Blood Type', () => {
          cy.acceptDE({
            onSuccess: () => {
              cy.get('[data-cy=alert-success]', { timeout: 15000 })
                .should('be.visible')
                .should('contain.text', 'Approved');
              // move to next question
              cy.get(`[data-cy=verifier-title-leftLungs1]`).should('be.visible');
              cy.wait(5000);
            },
          });
        });
      });

      describe('Reject Source Capture Left lungs (Mark No Answer From Filled State)', () => {
        it('Check Left Lungs Markup', () => {
          cy.get('[data-cy=verifier-title-leftLungs1]').contains('Left Lungs condition:');
          cy.get('canvas', { timeout: 20000 }).should('be.visible');
          cy.getSnapshot('[data-cy=canvas-content]', {
            failureThreshold: 0.01,
            failureThresholdType: 'percent',
          });
          cy.checkSnippetAssessmentUI('MARKED_NO_ANSWER_WITH_SC_FROM_FILLED');
        });
        it('Check reject source capture modal functionality', () => {
          cy.checkRejectModalFunctionality('SC');
        });
        it('Reject source capture', () => {
          cy.rejectSC({
            onSuccess: () => {
              cy.get('[data-cy=alert-success]', { timeout: 15000 })
                .should('be.visible')
                .should('contain.text', 'Source Capture Rejected');
              // move to next question
              cy.get(`[data-cy=verifier-title-teeth1]`).should('be.visible');
              cy.wait(5000);
            },
          });
        });
      });

      describe('Reject Data Entry Teeth', () => {
        it('Check Teeth Markup', () => {
          cy.get('[data-cy=verifier-title-teeth1]').contains('Teeth condition:');
          cy.get('canvas', { timeout: 20000 }).should('be.visible');
          cy.getSnapshot('[data-cy=canvas-content]', {
            failureThreshold: 0.01,
            failureThresholdType: 'percent',
          });
          cy.checkSnippetAssessmentUI('FILLED_FROM_SC');
        });
        it('Check reject data entry modal functionality', () => {
          cy.checkRejectModalFunctionality('DE');
        });
        it('Reject data entry', () => {
          cy.rejectDE({
            onSuccess: () => {
              cy.get('[data-cy=alert-success]', { timeout: 15000 })
                .should('be.visible')
                .should('contain.text', 'Rejected');

              // move to next question
              cy.get(`[data-cy=verifier-title-muscle1]`).should('be.visible');
              cy.wait(5000);
            },
          });
        });
      });

      describe('Accept Date Entry Muscle (SC with small snapshot)', () => {
        it('Check Muscle markup', () => {
          cy.get('[data-cy=verifier-title-muscle1]').contains('Muscle condition:');
          cy.get('canvas', { timeout: 20000 }).should('be.visible');
          cy.getSnapshot('[data-cy=canvas-content]', {
            failureThreshold: 0.01,
            failureThresholdType: 'percent',
          });
          cy.checkSnippetAssessmentUI('FILLED_FROM_SC');
        });
        it('Accept Data Entry Muscle', () => {
          cy.acceptDE({
            onSuccess: () => {
              cy.get('[data-cy=alert-success]', { timeout: 15000 })
                .should('be.visible')
                .should('contain.text', 'Approved');
              // move to next question
              cy.get(`[data-cy=verifier-title-datesVaccinate1]`).should('be.visible');
              cy.wait(5000);
            },
          });
        });
      });

      describe('Accept Date Entry Vaccination Dates (Have Second Data Entry)', () => {
        it('Check Vaccination Dates markup', () => {
          cy.get('[data-cy=verifier-title-datesVaccinate1]').contains(
            'When are patient get injected with vaccine?',
          );
          cy.get('canvas', { timeout: 20000 }).should('be.visible');
          cy.getSnapshot('[data-cy=canvas-content]', {
            failureThreshold: 0.01,
            failureThresholdType: 'percent',
          });
          cy.checkSnippetAssessmentUI('FILLED_FROM_SC');
        });
        it('Accept Data Entry Vaccination Dates', () => {
          cy.get('[data-cy=button-approve-sa]').should('be.disabled');
          cy.get('[data-cy=first-data-entry-datesVaccinate1]').click();
          cy.get('[data-cy=button-approve-sa]').should('be.enabled');
          cy.acceptDE({
            onSuccess: () => {
              cy.get('[data-cy=alert-success]', { timeout: 15000 })
                .should('be.visible')
                .should('contain.text', 'Approved');
              cy.get('[data-cy=carousel-close]').click();
              cy.wait(5000);
            },
          });
        });
      });

      describe('Reject Data Entry Weight (Mark No Answer With No SC)', () => {
        it('Reject Data Entry Weight', () => {
          cy.clickQuickAction(
            `[data-cy=question-card-weight1]`,
            `[data-cy=review-sc-snippet-action-weight1]`,
          );
          cy.get('[data-cy=verifier-title-weight1]').contains('Patient weight:');
          cy.checkSnippetAssessmentUI('MARKED_NO_ANSWER_WITHOUT_SC');
          cy.get('[data-cy=title-No-Answer]').should('be.visible');
          cy.get('[data-cy=reject-de-bottom-button]').should('be.visible').contains('Reject');
          cy.get('[data-cy=button-approve-sa]').should('be.visible').contains('Approve');
          cy.rejectDE({
            onSuccess: () => {
              cy.get('[data-cy=alert-success]', { timeout: 15000 })
                .should('be.visible')
                .should('contain.text', 'Rejected');
            },
          });
        });
      });
    });
  });
});
