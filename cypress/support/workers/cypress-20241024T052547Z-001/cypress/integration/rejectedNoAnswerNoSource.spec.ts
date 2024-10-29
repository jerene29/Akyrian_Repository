import { mockUserDataAdmin, mockUserDataInvestigator } from '../../src/constant/testFixtures';
import {
  GetPatientListDocument,
  GetVisitListDocument,
  SubmitVisitStatusDocument,
  GetStudyListDocument,
  RejectInvestigatorDocument,
} from '../../src/graphQL/generated/graphql';
import { d } from '../helper';

const aliasPatientList = GetPatientListDocument.definitions[0].name.value;
const aliasVisitList = GetVisitListDocument.definitions[0].name.value;
const aliasStudyList = GetStudyListDocument.definitions[0].name.value;
const aliasSubmitVisit = SubmitVisitStatusDocument.definitions[0].name.value;
const aliasRejectInvestigator = RejectInvestigatorDocument.definitions[0].name.value;
let visitList: any;

describe('REJECTED AND NO ANSWER in No Source', () => {
  before(() => {
    cy.reseedDB();
    cy.clearLocalStorageSnapshot();
    cy.fillInloginAsFormV2(mockUserDataAdmin);

    cy.saveLocalStorage();
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasPatientList) {
        req.alias = req.body.operationName;
      }

      if (req.body.operationName === aliasVisitList) {
        req.alias = req.body.operationName;
      }
    });
    cy.visit(`/visit/testRevisionId1`);
    cy.wait(`@${aliasVisitList}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        visitList = result.response.body.data.visitList;
        cy.wait(500);
        cy.intercept('POST', '/graphql', (req) => {
          if (req.body.operationName === aliasSubmitVisit) {
            req.alias = req.body.operationName;
          }
        });
        cy.customRequest(SubmitVisitStatusDocument, {
          siteId: 'bellevueHospital1',
          status: 'OCCURRED',
          visitDate: '2021-10-31T05:00:00.000Z',
          visitDidNotOccurOtherReason: null,
          visitDidNotOccurReasonId: null,
          visitId: visitList[0].id,
        }).then(() => {
          console.log('success1');
        });
        cy.wait(`@${aliasSubmitVisit}`);

        cy.customRequest(SubmitVisitStatusDocument, {
          siteId: 'bellevueHospital1',
          status: 'OCCURRED',
          visitDate: '2021-10-31T05:00:00.000Z',
          visitDidNotOccurOtherReason: null,
          visitDidNotOccurReasonId: null,
          visitId: visitList[1].id,
        }).then(() => {
          console.log('success2');
        });
        cy.wait(`@${aliasSubmitVisit}`);
      }
    });

    /**
     * to trigger fetch because customRequest doesn't trigger visit list refetch
     */
    cy.visit(`/visit/testRevisionId1`);
  });
  describe('Login Using Admin', () => {
    describe('Mark No Answer', () => {
      describe('Question Did the subject consent for the Study? - Group level', () => {
        it('Select patient', () => {
          cy.get(`#bellevuePatient1-selectable-patient`).click();
        });
        it('Click quick action no answer', () => {
          cy.get('[data-cy=question-card-consentQuestion1]').realHover({ scrollBehavior: false });
          cy.get('[data-cy=noanswer-action-consentQuestion1]').should('be.visible');
          cy.get('[data-cy=noanswer-action-consentQuestion1]').click({ force: true });

          cy.get('[data-cy=question-card-consentQuestion1] [data-cy=question-card]').click({
            force: true,
            scrollBehavior: false,
          });
          cy.get('[data-cy=question-card-consentQuestion1] [data-cy=open-modal-noanswer]').click({
            force: true,
          });
        });
        it('Select state pending approval', () => {
          cy.get('#ACCEPTED_FROM_SOURCE_CAPTURE').click().trigger('mouseout');
        });
        it('Check No answer detail', () => {
          cy.get('#question-form-parent-consentQuestion1').contains('No Answer');
          cy.get('#question-form-parent-consentQuestion1').contains('Akyrian Admin');
          cy.get('#question-form-parent-consentQuestion1').contains(
            '(Akyrian People, Bellevue Hospital)',
          );
        });
      });
      describe('Question Does the subject have any medical history or baseline conditions? - GROUP level', () => {
        it('Select state unanswered & Click quick action no answer', () => {
          cy.get('#UNFILLED').click().trigger('mouseout');
          cy.get('[data-cy=question-card-hasMedHistory1] [data-cy=question-card]').click({
            force: true,
            scrollBehavior: false,
          });
          cy.get('[data-cy=question-card-hasMedHistory1] [data-cy=open-modal-noanswer]').click({
            force: true,
          });
          cy.get('[data-cy=mark-no-answer-reason-select]').type('{downarrow}{enter}');
          cy.get('[data-cy=button-submit-noanswer]').click();
          cy.wait(2000);
        });
        it('Select state pending acceptance & Check No answer detail', () => {
          cy.get('#FILLED').click().trigger('mouseout');
          cy.get('#question-form-parent-hasMedHistory1').contains('No Answer');
          cy.get('#question-form-parent-hasMedHistory1').contains(
            'The study subject was unable to undergo the medical examination or test',
          );
          cy.get('#question-form-parent-hasMedHistory1').contains('Akyrian Admin');
          cy.get('#question-form-parent-hasMedHistory1').contains(
            '(Akyrian People, Bellevue Hospital)',
          );
        });
        it('Reset answer', () => {
          cy.get('[data-cy=question-card-hasMedHistory1] [data-cy=question-card]').click({
            force: true,
            scrollBehavior: false,
          });
          cy.get(
            '[data-cy=question-card-hasMedHistory1] [data-cy=reset-answer-action-icon-hasMedHistory1]',
          ).click({ force: true });
          cy.get('[data-cy=reset-answer-select]').type('{enter}');
          cy.get('[data-cy=button-submit-reset-answer]').click();
          cy.wait(2000);
        });
      });
      describe('Other reason for Question Does the subject have any medical history or baseline conditions? - GROUP level', () => {
        it('Select state unanswered', () => {
          cy.get('#UNFILLED').click().trigger('mouseout');
        });
        it('Click quick action no answer', () => {
          cy.get('[data-cy=question-card-hasMedHistory1] [data-cy=question-card]').click({
            force: true,
            scrollBehavior: false,
          });
          cy.get('[data-cy=question-card-hasMedHistory1] [data-cy=open-modal-noanswer]').click({
            force: true,
          });
          cy.get('[data-cy=mark-no-answer-reason-select]')
            .type('{uparrow}{enter}')
            .type('no answer other reason');
          cy.get('[data-cy=button-submit-noanswer]').click();
          cy.wait(2000);
        });
        it('Select state pending acceptance', () => {
          cy.get('#FILLED').click().trigger('mouseout');
        });
        it('Check No answer other reason detail', () => {
          cy.get('#question-form-parent-hasMedHistory1').contains('No Answer');
          cy.get('#question-form-parent-hasMedHistory1').contains('no answer other reason');
          cy.get('#question-form-parent-hasMedHistory1').contains('Akyrian Admin');
          cy.get('#question-form-parent-hasMedHistory1').contains(
            '(Akyrian People, Bellevue Hospital)',
          );
        });
      });
      describe('Mark no answer in state pending acceptance', () => {
        it('Mark no answer with suggested reason by dropdown', () => {
          cy.get('[data-cy=question-card-hasMedHistory1] [data-cy=question-card]').click({
            force: true,
            scrollBehavior: false,
          });
          cy.get('[data-cy=question-card-hasMedHistory1] [data-cy=open-modal-noanswer]').click({
            force: true,
          });
          cy.get('[data-cy=mark-no-answer-change-reason-select]').type('{enter}');
          cy.get('[data-cy=mark-no-answer-reason-select]').type('{enter}');
          cy.get('[data-cy=button-submit-noanswer]').click();
          cy.wait(2000);
        });
        it('Check no answer detail shoul have reason "The study subject refused the medical examination or test"', () => {
          cy.get('#question-form-parent-hasMedHistory1').contains('No Answer');
          cy.get('#question-form-parent-hasMedHistory1').contains(
            'The study subject refused the medical examination or test',
          );
          cy.get('#question-form-parent-hasMedHistory1').contains('Akyrian Admin');
          cy.get('#question-form-parent-hasMedHistory1').contains(
            '(Akyrian People, Bellevue Hospital)',
          );
        });
        it('Mark no answer with other reason', () => {
          cy.get('[data-cy=question-card-hasMedHistory1] [data-cy=question-card]').click({
            force: true,
            scrollBehavior: false,
          });
          cy.get('[data-cy=question-card-hasMedHistory1] [data-cy=open-modal-noanswer]').click({
            force: true,
          });
          cy.get('[data-cy=mark-no-answer-change-reason-select]').type('{enter}');
          cy.get('[data-cy=mark-no-answer-reason-select]')
            .type('{uparrow}{enter}')
            .type('testing other reason');
          cy.get('[data-cy=button-submit-noanswer]').click();
          cy.wait(2000);
        });
        it('Check no answer detail should have reason "testing other reason"', () => {
          cy.get('#question-form-parent-hasMedHistory1').contains('No Answer');
          cy.get('#question-form-parent-hasMedHistory1').contains('testing other reason');
          cy.get('#question-form-parent-hasMedHistory1').contains('Akyrian Admin');
          cy.get('#question-form-parent-hasMedHistory1').contains(
            '(Akyrian People, Bellevue Hospital)',
          );
        });
        it('Reset answer', () => {
          cy.get('[data-cy=question-card-hasMedHistory1] [data-cy=question-card]').click({
            force: true,
            scrollBehavior: false,
          });
          cy.get(
            '[data-cy=question-card-hasMedHistory1] [data-cy=reset-answer-action-icon-hasMedHistory1]',
          ).click({ force: true });
          cy.get('[data-cy=reset-answer-select]').type('{enter}');
          cy.get('[data-cy=button-submit-reset-answer]').click();
          cy.wait(2000);
        });
      });
      describe('Question Ethnicity of the subject? - field level', () => {
        it('Select state unanswered', () => {
          cy.get('#UNFILLED').click().trigger('mouseout');
        });
        it('Mark no answer', () => {
          cy.get('[data-cy=answer-input-field-ffEthnicity1-0-0]').type('{uparrow}{enter}');
          cy.get('[data-cy=save-button-ethnicity1]').click();
          cy.wait(2000);
        });
        it('Check question in state pending approval', () => {
          cy.get('#ACCEPTED_FROM_SOURCE_CAPTURE').click().trigger('mouseout');
        });
        it('Check detail no answer (no reason required)', () => {
          cy.get('#question-form-parent-ethnicity1 [data-cy=title-No-Answer]').contains(
            'No Answer',
          );
          cy.get('#question-form-parent-ethnicity1 [data-cy=desc-No-Answer]').should('not.exist');
          cy.get('#question-form-parent-ethnicity1 [data-cy=name-No-Answer]').contains(
            'Akyrian Admin',
          );
          cy.get('#question-form-parent-ethnicity1 [data-cy=role-No-Answer]').contains(
            '(Akyrian People, Bellevue Hospital)',
          );
        });
      });
      describe('Question Does the subject have any medical history or baseline conditions? - field level', () => {
        it('Select state unanswered & Checked Mark no answer on hasMedHistory1', () => {
          cy.get('#UNFILLED').click().trigger('mouseout');
          cy.get('[data-cy=question-card-hasMedHistory1] [type="radio"]').check('noAnswer');
          cy.get('[data-cy=save-button-hasMedHistory1]').should('have.attr', 'disabled');
          cy.get('[data-cy=no-answer-reason-select-hasMedHistory1]').click().type('{enter}');
          cy.get('[data-cy=save-button-hasMedHistory1]').should('not.have.attr', 'disabled');
          cy.get('[data-cy=save-button-hasMedHistory1]').click();
          cy.wait(2000);
        });
        it('Select state pending acceptance & Check No answer detail on hasMedHistory1', () => {
          cy.get('#FILLED').click().trigger('mouseout');
          cy.get('#question-form-parent-hasMedHistory1').contains('No Answer');
          cy.get('#question-form-parent-hasMedHistory1').contains(
            'The study subject refused the medical examination or test',
          );
          cy.get('#question-form-parent-hasMedHistory1').contains('Akyrian Admin');
          cy.get('#question-form-parent-hasMedHistory1').contains(
            '(Akyrian People, Bellevue Hospital)',
          );
        });
        it('Reset answer', () => {
          cy.get('[data-cy=question-card-hasMedHistory1] [data-cy=question-card]').click({
            force: true,
            scrollBehavior: false,
          });
          cy.get(
            '[data-cy=question-card-hasMedHistory1] [data-cy=reset-answer-action-icon-hasMedHistory1]',
          ).click({ force: true });
          cy.get('[data-cy=reset-answer-select]').type('{enter}');
          cy.get('[data-cy=button-submit-reset-answer]').click();
          cy.wait(2000);
        });
      });
      describe('Question with other reason Does the subject have any medical history or baseline conditions? - field level', () => {
        it('Select state unanswered & Checked Mark no answer on hasMedHistory1', () => {
          cy.get('#UNFILLED').click().trigger('mouseout');
          cy.get('[data-cy=question-card-hasMedHistory1] [type="radio"]').check('noAnswer');
          cy.get('[data-cy=save-button-hasMedHistory1]').should('have.attr', 'disabled');
          cy.get('[data-cy=no-answer-reason-select-hasMedHistory1]')
            .click()
            .type('{uparrow}{enter}')
            .type('no answer other reasonss');
          cy.get('[data-cy=save-button-hasMedHistory1]').should('not.have.attr', 'disabled');
          cy.get('[data-cy=save-button-hasMedHistory1]').click();
          cy.wait(2000);
        });
        it('Select state pending acceptance & Check No answer detail on hasMedHistory1', () => {
          cy.get('#FILLED').click().trigger('mouseout');
          cy.get('#question-form-parent-hasMedHistory1').contains('No Answer');
          cy.get('#question-form-parent-hasMedHistory1').contains('no answer other reasonss');
          cy.get('#question-form-parent-hasMedHistory1').contains('Akyrian Admin');
          cy.get('#question-form-parent-hasMedHistory1').contains(
            '(Akyrian People, Bellevue Hospital)',
          );
        });
        it('Reset answer', () => {
          cy.get('[data-cy=question-card-hasMedHistory1] [data-cy=question-card]').click({
            force: true,
            scrollBehavior: false,
          });
          cy.get(
            '[data-cy=question-card-hasMedHistory1] [data-cy=reset-answer-action-icon-hasMedHistory1]',
          ).click({ force: true });
          cy.get('[data-cy=reset-answer-select]').type('{enter}');
          cy.get('[data-cy=button-submit-reset-answer]').click();
          cy.wait(2000);
        });
      });
    });

    describe('Rejected', () => {
      describe('No Answer then Rejected for multi answer', () => {
        it('Select visit 1', () => {
          cy.get('[data-cy=visit-visit1Visit4]').click();
        });
        it('MarkNoAnswer the question with multi answer with specific reason', () => {
          cy.get('[data-cy=answer-input-field-singleChoiceMultiEntryFFId1-0-0]')
            .click()
            .type('{uparrow}{enter}');
          cy.get('[data-cy=add-answer-singleChoiceMultiEntryId1]').click();
          cy.get('[data-cy=answer-input-field-singleChoiceMultiEntryFFId1-1-0]')
            .click()
            .type('{uparrow}{enter}');
          cy.get('[data-cy=no-answer-reason-select-singleChoiceMultiEntryId1]')
            .click()
            .type('{enter}');
          cy.get('[data-cy=save-button-singleChoiceMultiEntryId1]').click();

          // This is needed rather than using cy.wait(2000) waiting to finish submitting and refetch
          cy.get('[data-cy=alert-success]', { timeout: 5000 }).should('exist');
          cy.get('[data-cy=answer-input-field-singleChoiceMultiEntryFFId1-0-0]').should(
            'not.exist',
          );

          cy.get('[data-cy=answer-input-field-singleChoiceFFId-0-0]')
            .click()
            .type('{uparrow}{enter}');
          cy.get('[data-cy=add-answer-singleChoiceId1]').click();
          cy.get('[data-cy=answer-input-field-singleChoiceFFId-1-0]')
            .click()
            .type('{uparrow}{enter}');
          cy.get('[data-cy=no-answer-reason-select-singleChoiceId1]')
            .click()
            .type('{uparrow}{enter}')
            .type('Testing other reason');
          cy.get('[data-cy=save-button-singleChoiceId1]').click();

          // This is needed rather than using cy.wait(2000) waiting to finish submitting and refetch
          cy.get('[data-cy=alert-success]', { timeout: 5000 }).should('exist');
          cy.get('[data-cy=answer-input-field-singleChoiceFFId-0-0]').should('not.exist');
        });
        it('Select state pending acceptance and check detail no answer', () => {
          cy.get('#FILLED').click().trigger('mouseout');
          cy.get(
            '#question-form-parent-singleChoiceMultiEntryId1 [data-cy=answer-entry-1] [data-cy=title-No-Answer]',
          ).contains('No Answer');
          cy.get(
            '#question-form-parent-singleChoiceMultiEntryId1 [data-cy=answer-entry-1] [data-cy=desc-No-Answer]',
          ).contains('The study subject refused the medical examination or test');
          cy.get(
            '#question-form-parent-singleChoiceMultiEntryId1 [data-cy=answer-entry-1] [data-cy=name-No-Answer]',
          ).contains('Akyrian Admin');
          cy.get(
            '#question-form-parent-singleChoiceMultiEntryId1 [data-cy=answer-entry-1] [data-cy=role-No-Answer]',
          ).contains('(Akyrian People, Bellevue Hospital)');

          cy.get(
            '#question-form-parent-singleChoiceMultiEntryId1 [data-cy=answer-entry-2] [data-cy=title-No-Answer]',
          ).contains('No Answer');
          cy.get(
            '#question-form-parent-singleChoiceMultiEntryId1 [data-cy=answer-entry-2] [data-cy=desc-No-Answer]',
          ).contains('The study subject refused the medical examination or test');
          cy.get(
            '#question-form-parent-singleChoiceMultiEntryId1 [data-cy=answer-entry-2] [data-cy=name-No-Answer]',
          ).contains('Akyrian Admin');
          cy.get(
            '#question-form-parent-singleChoiceMultiEntryId1 [data-cy=answer-entry-2] [data-cy=role-No-Answer]',
          ).contains('(Akyrian People, Bellevue Hospital)');

          cy.get(
            '#question-form-parent-singleChoiceId1 [data-cy=answer-entry-1] [data-cy=title-No-Answer]',
          ).contains('No Answer');
          cy.get(
            '#question-form-parent-singleChoiceId1 [data-cy=answer-entry-1] [data-cy=desc-No-Answer]',
          ).contains('Testing other reason');
          cy.get(
            '#question-form-parent-singleChoiceId1 [data-cy=answer-entry-1] [data-cy=name-No-Answer]',
          ).contains('Akyrian Admin');
          cy.get(
            '#question-form-parent-singleChoiceId1 [data-cy=answer-entry-1] [data-cy=role-No-Answer]',
          ).contains('(Akyrian People, Bellevue Hospital)');

          cy.get(
            '#question-form-parent-singleChoiceId1 [data-cy=answer-entry-2] [data-cy=title-No-Answer]',
          ).contains('No Answer');
          cy.get(
            '#question-form-parent-singleChoiceId1 [data-cy=answer-entry-2] [data-cy=desc-No-Answer]',
          ).contains('Testing other reason');
          cy.get(
            '#question-form-parent-singleChoiceId1 [data-cy=answer-entry-2] [data-cy=name-No-Answer]',
          ).contains('Akyrian Admin');
          cy.get(
            '#question-form-parent-singleChoiceId1 [data-cy=answer-entry-2] [data-cy=role-No-Answer]',
          ).contains('(Akyrian People, Bellevue Hospital)');
        });
        it('Rejected the question with specific reason and other reason', () => {
          cy.get('[data-cy=question-card-singleChoiceMultiEntryId1] [data-cy=question-card]').click(
            { force: true, scrollBehavior: false },
          );
          cy.get(
            '[data-cy=question-card-singleChoiceMultiEntryId1] [data-cy=accept-reject-action]',
          ).click({ force: true });
          cy.get('#monitor-flow-body-singleChoiceMultiEntryId1').within(() => {
            cy.get('[data-cy=reject-data-entry]').click({ force: true, multiple: true });
            cy.get('[data-cy=reject-reason]').type('{downarrow}{enter}');
            cy.get('[data-cy=submit-reject-reason]').click();
            cy.wait(2000);
          });

          cy.get('.slick-active [data-cy=modal-close]').click({ force: true, multiple: true });
          cy.wait(1000);
          cy.get('[data-cy=question-card-singleChoiceId1] [data-cy=question-card]').click({
            force: true,
            scrollBehavior: false,
          });
          cy.get('[data-cy=question-card-singleChoiceId1] [data-cy=accept-reject-action]').click({
            force: true,
          });
          cy.get('.slick-active #monitor-flow-body-singleChoiceId1').within(() => {
            cy.get('[data-cy=reject-data-entry]').click();
            cy.wait(1000);
            cy.get('[data-cy=reject-reason]')
              .type('{uparrow}{enter}')
              .type('Rejected other reason');
            cy.wait(1000);
            cy.get('[data-cy=submit-reject-reason]').click();
            cy.wait(2000);
          });
        });
        it('Select state Rejected', () => {
          cy.get('#REJECTED').click().trigger('mouseout');
        });
        it('Check rejected reason and no answer detail', () => {
          cy.get(
            '#question-form-parent-singleChoiceMultiEntryId1 [data-cy=answer-entry-1] [data-cy=title-No-Answer]',
          ).contains('No Answer');
          cy.get(
            '#question-form-parent-singleChoiceMultiEntryId1 [data-cy=answer-entry-1] [data-cy=desc-No-Answer]',
          ).contains('The study subject refused the medical examination or test');
          cy.get(
            '#question-form-parent-singleChoiceMultiEntryId1 [data-cy=answer-entry-1] [data-cy=name-No-Answer]',
          ).contains('Akyrian Admin');
          cy.get(
            '#question-form-parent-singleChoiceMultiEntryId1 [data-cy=answer-entry-1] [data-cy=role-No-Answer]',
          ).contains('(Akyrian People, Bellevue Hospital)');

          cy.get(
            '#question-form-parent-singleChoiceMultiEntryId1 [data-cy=answer-entry-2] [data-cy=title-No-Answer]',
          ).contains('No Answer');
          cy.get(
            '#question-form-parent-singleChoiceMultiEntryId1 [data-cy=answer-entry-2] [data-cy=desc-No-Answer]',
          ).contains('The study subject refused the medical examination or test');
          cy.get(
            '#question-form-parent-singleChoiceMultiEntryId1 [data-cy=answer-entry-2] [data-cy=name-No-Answer]',
          ).contains('Akyrian Admin');
          cy.get(
            '#question-form-parent-singleChoiceMultiEntryId1 [data-cy=answer-entry-2] [data-cy=role-No-Answer]',
          ).contains('(Akyrian People, Bellevue Hospital)');

          cy.get(
            '[data-cy=question-card-singleChoiceMultiEntryId1] [data-cy=title-Rejected]',
          ).contains('Rejected');
          cy.get(
            '[data-cy=question-card-singleChoiceMultiEntryId1] [data-cy=desc-Rejected]',
          ).contains('Incorrect subject');
          cy.get(
            '[data-cy=question-card-singleChoiceMultiEntryId1] [data-cy=name-Rejected]',
          ).contains('Akyrian Admin');
          cy.get(
            '[data-cy=question-card-singleChoiceMultiEntryId1] [data-cy=role-Rejected]',
          ).contains('(Akyrian People, Bellevue Hospital)');
          cy.get(
            '#question-form-parent-singleChoiceId1 [data-cy=answer-entry-1] [data-cy=title-No-Answer]',
          ).contains('No Answer');
          cy.get(
            '#question-form-parent-singleChoiceId1 [data-cy=answer-entry-1] [data-cy=desc-No-Answer]',
          ).contains('Testing other reason');
          cy.get(
            '#question-form-parent-singleChoiceId1 [data-cy=answer-entry-1] [data-cy=name-No-Answer]',
          ).contains('Akyrian Admin');
          cy.get(
            '#question-form-parent-singleChoiceId1 [data-cy=answer-entry-1] [data-cy=role-No-Answer]',
          ).contains('(Akyrian People, Bellevue Hospital)');

          cy.get(
            '#question-form-parent-singleChoiceId1 [data-cy=answer-entry-2] [data-cy=title-No-Answer]',
          ).contains('No Answer');
          cy.get(
            '#question-form-parent-singleChoiceId1 [data-cy=answer-entry-2] [data-cy=desc-No-Answer]',
          ).contains('Testing other reason');
          cy.get(
            '#question-form-parent-singleChoiceId1 [data-cy=answer-entry-2] [data-cy=name-No-Answer]',
          ).contains('Akyrian Admin');
          cy.get(
            '#question-form-parent-singleChoiceId1 [data-cy=answer-entry-2] [data-cy=role-No-Answer]',
          ).contains('(Akyrian People, Bellevue Hospital)');

          cy.get('[data-cy=question-card-singleChoiceId1] [data-cy=title-Rejected]').contains(
            'Rejected',
          );
          cy.get('[data-cy=question-card-singleChoiceId1] [data-cy=desc-Rejected]').contains(
            'Rejected other reason',
          );
          cy.get('[data-cy=question-card-singleChoiceId1] [data-cy=name-Rejected]').contains(
            'Akyrian Admin',
          );
          cy.get('[data-cy=question-card-singleChoiceId1] [data-cy=role-Rejected]').contains(
            '(Akyrian People, Bellevue Hospital)',
          );
        });
        it('Select all state', () => {
          cy.get('[data-cy=all-filter-text]').click().trigger('mouseout');
        });
        it('Check rejected reason and no answer detail in view modal', () => {
          cy.get('#singleChoiceMultiEntryId1').click();
          cy.get(
            '#question-form-parent-singleChoiceMultiEntryId1 [data-cy=answer-entry-1] [data-cy=title-No-Answer]',
          ).contains('No Answer');
          cy.get(
            '#question-form-parent-singleChoiceMultiEntryId1 [data-cy=answer-entry-1] [data-cy=desc-No-Answer]',
          ).contains('The study subject refused the medical examination or test');
          cy.get(
            '#question-form-parent-singleChoiceMultiEntryId1 [data-cy=answer-entry-1] [data-cy=name-No-Answer]',
          ).contains('Akyrian Admin');
          cy.get(
            '#question-form-parent-singleChoiceMultiEntryId1 [data-cy=answer-entry-1] [data-cy=role-No-Answer]',
          ).contains('(Akyrian People, Bellevue Hospital)');

          cy.get(
            '#question-form-parent-singleChoiceMultiEntryId1 [data-cy=answer-entry-2] [data-cy=title-No-Answer]',
          ).contains('No Answer');
          cy.get(
            '#question-form-parent-singleChoiceMultiEntryId1 [data-cy=answer-entry-2] [data-cy=desc-No-Answer]',
          ).contains('The study subject refused the medical examination or test');
          cy.get(
            '#question-form-parent-singleChoiceMultiEntryId1 [data-cy=answer-entry-2] [data-cy=name-No-Answer]',
          ).contains('Akyrian Admin');
          cy.get(
            '#question-form-parent-singleChoiceMultiEntryId1 [data-cy=answer-entry-2] [data-cy=role-No-Answer]',
          ).contains('(Akyrian People, Bellevue Hospital)');

          cy.get(
            '[data-cy=question-card-singleChoiceMultiEntryId1] [data-cy=title-Rejected]',
          ).contains('Rejected');
          cy.get(
            '[data-cy=question-card-singleChoiceMultiEntryId1] [data-cy=desc-Rejected]',
          ).contains('Incorrect subject');
          cy.get(
            '[data-cy=question-card-singleChoiceMultiEntryId1] [data-cy=name-Rejected]',
          ).contains('Akyrian Admin');
          cy.get(
            '[data-cy=question-card-singleChoiceMultiEntryId1] [data-cy=role-Rejected]',
          ).contains('(Akyrian People, Bellevue Hospital)');
          cy.get('[data-cy=modal-close]').click();
          cy.wait(500);

          cy.get('[data-cy=question-card-singleChoiceId1]').click();
          cy.wait(500);
          cy.get(
            '#question-form-parent-singleChoiceId1 [data-cy=answer-entry-1] [data-cy=title-No-Answer]',
          ).contains('No Answer');
          cy.get(
            '#question-form-parent-singleChoiceId1 [data-cy=answer-entry-1] [data-cy=desc-No-Answer]',
          ).contains('Testing other reason');
          cy.get(
            '#question-form-parent-singleChoiceId1 [data-cy=answer-entry-1] [data-cy=name-No-Answer]',
          ).contains('Akyrian Admin');
          cy.get(
            '#question-form-parent-singleChoiceId1 [data-cy=answer-entry-1] [data-cy=role-No-Answer]',
          ).contains('(Akyrian People, Bellevue Hospital)');

          cy.get(
            '#question-form-parent-singleChoiceId1 [data-cy=answer-entry-2] [data-cy=title-No-Answer]',
          ).contains('No Answer');
          cy.get(
            '#question-form-parent-singleChoiceId1 [data-cy=answer-entry-2] [data-cy=desc-No-Answer]',
          ).contains('Testing other reason');
          cy.get(
            '#question-form-parent-singleChoiceId1 [data-cy=answer-entry-2] [data-cy=name-No-Answer]',
          ).contains('Akyrian Admin');
          cy.get(
            '#question-form-parent-singleChoiceId1 [data-cy=answer-entry-2] [data-cy=role-No-Answer]',
          ).contains('(Akyrian People, Bellevue Hospital)');

          cy.get('[data-cy=question-card-singleChoiceId1] [data-cy=title-Rejected]').contains(
            'Rejected',
          );
          cy.get('[data-cy=question-card-singleChoiceId1] [data-cy=desc-Rejected]').contains(
            'Rejected other reason',
          );
          cy.get('[data-cy=question-card-singleChoiceId1] [data-cy=name-Rejected]').contains(
            'Akyrian Admin',
          );
          cy.get('[data-cy=question-card-singleChoiceId1] [data-cy=role-Rejected]').contains(
            '(Akyrian People, Bellevue Hospital)',
          );
          cy.get('[data-cy=modal-close]').click();
        });
        it('Reset the questions', () => {
          cy.get('[data-cy=REJECTED]').click().trigger('mouseout');
          cy.get(
            '[data-cy=question-card-singleChoiceMultiEntryId1] [data-cy=reset-answer-action-icon-singleChoiceMultiEntryId1]',
          ).click({ force: true });
          cy.get(d`reset-answer-modal`).should('be.visible');
          cy.get(d`reset-answer-modal-description`).should(
            'have.text',
            'This item will be moved back to Unanswered',
          );
          cy.get('[data-cy=button-submit-reset-answer]').click({ force: true });
          cy.wait(1000);
          cy.get(
            '[data-cy=question-card-singleChoiceId1] [data-cy=reset-answer-action-icon-singleChoiceId1]',
          ).click({ force: true });
          cy.get(d`reset-answer-modal`).should('be.visible');
          cy.get(d`reset-answer-modal-description`).should(
            'have.text',
            'This item will be moved back to Unanswered',
          );
          cy.get('[data-cy=button-submit-reset-answer]').click({ force: true });
          cy.wait(1000);
        });
      });

      describe('Rejected by admin', () => {
        describe('Reject Question Did the patient experience any allergies - suggestion reason', () => {
          it('Select visit 1 and go to UNFILLED state', () => {
            cy.get('[data-cy=visit-visit1Visit4]').click();
            cy.get('[data-cy=UNFILLED]').click().trigger('mouseout');
          });
          it('Answer the question', () => {
            cy.get(
              '[data-cy=question-card-singleChoiceMultiEntryId1] [data-cy=question-card]',
            ).click({ force: true, scrollBehavior: false });
            cy.get('[data-cy=answer-input-field-singleChoiceMultiEntryFFId1-0-0]').type('{enter}');
            cy.get('[data-cy=save-button-singleChoiceMultiEntryId1]').click();
            cy.wait(2000);
          });
          it('Select state pending acceptance', () => {
            cy.get('#FILLED').click().trigger('mouseout');
          });
          it('Reject question by quick action accept/reject', () => {
            cy.get(
              '[data-cy=question-card-singleChoiceMultiEntryId1] [data-cy=question-card]',
            ).click({ force: true, scrollBehavior: false });
            cy.get(
              '[data-cy=question-card-singleChoiceMultiEntryId1] [data-cy=accept-reject-action]',
            ).click({ force: true });
            cy.get('.slick-active [data-cy=reject-data-entry]').click();
            cy.get('.slick-active [data-cy=reject-reason]').type('{enter}');
            cy.get('.slick-active [data-cy=submit-reject-reason]').click();
            cy.wait(2000);
          });

          it('Select state Rejected', () => {
            cy.get('[data-cy=REJECTED]').click().trigger('mouseout');
          });
          it('Check rejected reason detail', () => {
            cy.get(
              '[data-cy=question-card-singleChoiceMultiEntryId1] [data-cy=title-Rejected]',
            ).contains('Rejected');
            cy.get(
              '[data-cy=question-card-singleChoiceMultiEntryId1] [data-cy=desc-Rejected]',
            ).contains('Data entry error');
            cy.get(
              '[data-cy=question-card-singleChoiceMultiEntryId1] [data-cy=name-Rejected]',
            ).contains('Akyrian Admin');
            cy.get(
              '[data-cy=question-card-singleChoiceMultiEntryId1] [data-cy=role-Rejected]',
            ).contains('(Akyrian People, Bellevue Hospital)');
          });
        });
        describe('Reject QUestion What is subject overall condition during symptomps? - with other reason', () => {
          it('Select state unanswered', () => {
            cy.get('[data-cy=UNFILLED]').click().trigger('mouseout');
          });
          it('Answer the question', () => {
            cy.get('[data-cy=question-card-radioButtonId1] [data-cy=question-card]').click({
              force: true,
              scrollBehavior: false,
            });
            cy.get('[data-cy=answer-input-field-radioButtonFFId-0-0]').type('{enter}');
            cy.wait(500);
            cy.get('[data-cy=save-button-radioButtonId1]').click();
            cy.wait(2000);
          });
          it('Select state pending acceptance', () => {
            cy.get('#FILLED').click().trigger('mouseout');
          });
          it('Reject question by quick action accept/reject', () => {
            cy.get('[data-cy=question-card-radioButtonId1] [data-cy=question-card]').click({
              force: true,
              scrollBehavior: false,
            });
            cy.get('[data-cy=question-card-radioButtonId1] [data-cy=accept-reject-action]').click({
              force: true,
            });
            cy.get('.slick-active [data-cy=reject-data-entry]').click();
            cy.get('.slick-active [data-cy=reject-reason]')
              .type('{uparrow}{enter}')
              .type('this is other reasons');
            cy.get('.slick-active [data-cy=submit-reject-reason]').click();
            cy.wait(2000);
          });
          it('Select state Rejected', () => {
            cy.get('[data-cy=REJECTED]').click().trigger('mouseout');
          });
          it('Check rejected reason detail', () => {
            cy.get('[data-cy=question-card-radioButtonId1] [data-cy=title-Rejected]').contains(
              'Rejected',
            );
            cy.get('[data-cy=question-card-radioButtonId1] [data-cy=desc-Rejected]').contains(
              'this is other reasons',
            );
            cy.get('[data-cy=question-card-radioButtonId1] [data-cy=name-Rejected]').contains(
              'Akyrian Admin',
            );
            cy.get('[data-cy=question-card-radioButtonId1] [data-cy=role-Rejected]').contains(
              '(Akyrian People, Bellevue Hospital)',
            );
          });
          // should check in all state too
        });
      });

      describe('To be Rejected by investigator', () => {
        describe('Reject Question How many times does the subject experience this symptomps? and Findings for entire body system: (with suggest reason and other reason', () => {
          it('Select state unanswered', () => {
            cy.get('#UNFILLED').click().trigger('mouseout');
          });
          it('Answer that 2 questions', () => {
            cy.get('[data-cy=answer-input-field-singleChoiceFFId-0-0]').type('{enter}');
            cy.get('[data-cy=save-button-singleChoiceId1]').click();
            cy.wait(3000);

            cy.get('[data-cy=alert-success]', { timeout: 5000 }).should('exist');
            cy.get('[data-cy=answer-input-field-singleChoiceFFId-0-0]').should('not.exist');

            cy.get('[data-cy=answer-input-field-ffEyes1-0-0]').click().type('{enter}');
            cy.get('[data-cy=save-button-bodySys1]').click();
            cy.wait(2000);

            cy.get('[data-cy=alert-success]', { timeout: 5000 }).should('exist');
            cy.get('[data-cy=answer-input-field-ffEyes1-0-0]').should('not.exist');
          });
          it('Select state pending acceptance', () => {
            cy.get('#FILLED').click().trigger('mouseout');
          });
          it('Accept question by quick action accept/reject', () => {
            cy.clickQuickAction('[data-cy=question-card-singleChoiceId1]', '[data-cy=accept-reject-action-singleChoiceId1]')
            cy.get('.slick-active [data-cy=accept-data-entry-singleChoiceId1]').click();
            cy.wait(3000);
            cy.get('.slick-active [data-cy=accept-data-entry-bodySys1]').click();
            cy.wait(3000);
          });
          it('Check that 2 cards in state accepted', () => {
            cy.get('#ACCEPTED').click().trigger('mouseout');
            cy.get('[data-cy=question-card-singleChoiceId1] [data-cy=question-card]').should(
              'exist',
            );
            cy.get('[data-cy=question-card-bodySys1] [data-cy=question-card]').should('exist');
          });
          it('logout', () => {
            cy.logout();
            cy.clearLocalStorage();
          });
        });
      });
    });
  });

  describe('Login using investigator user', () => {
    before(() => {
      cy.clearLocalStorage();
      cy.fillInloginAsFormV2(mockUserDataInvestigator);
      cy.saveLocalStorage();
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasPatientList) {
          req.alias = req.body.operationName;
        }
        if (req.body.operationName === aliasStudyList) {
          req.alias = req.body.operationName;
        }
      });
      // cy.waitForReact();
      cy.visit('/visit/testRevisionId1');
      cy.wait(`@${aliasPatientList}`);
      cy.wait(`@${aliasStudyList}`);
      cy.waitForReact();
    });
    describe('Reject Question How many times does the subject experience this symptomps? and Findings for entire body system: (with suggest reason and other reason', () => {
      it('Show visit list and visit 1', () => {
        cy.wait(500);
        cy.get(`[data-cy=sidebar-toggle-arrow]`).click();
        cy.wait(500);
      });
      it('Reject question How many times does the subject experience this symptomps? and Findings for entire body system: (with suggest reason and other reason', () => {
        cy.intercept('POST', '/graphql', (req) => {
          if (req.body.operationName === aliasRejectInvestigator) {
            req.alias = req.body.operationName;
          }
        });
        cy.get('#singleChoiceId1 [data-cy=reject-answer-icon]').click({ force: true });
        cy.get('[data-cy=reject-reason]').type('{enter}');
        cy.get('[data-cy=submit-reject-reason]').click();
        cy.wait(2000);

        cy.get('#bodySys1 [data-cy=reject-answer-icon]').click({ force: true });
        cy.get('[data-cy=reject-reason]')
          .type('{uparrow}{enter}')
          .type('other reason by investigator');
        cy.get('[data-cy=submit-reject-reason]').click();
        cy.wait(`@${aliasRejectInvestigator}`);
        cy.wait(2000);
        cy.get('[data-cy=INVESTIGATOR_REJECTED]').click({ force: true });
        cy.wait(500);
        cy.get('#singleChoiceId1').should('exist');
        cy.get('#bodySys1').should('exist');
      });

      it('logout', () => {
        cy.logout();
        cy.clearLocalStorage();
      });
    });
  });

  describe('Login using admin user', () => {
    describe('Check Question that rejected by investigator -> How many times does the subject experience this symptomps? and Findings for entire body system: (with suggest reason and other reason', () => {
      before(() => {
        cy.clearLocalStorage();
        cy.fillInloginAsFormV2(mockUserDataAdmin);
        cy.saveLocalStorage();
        cy.intercept('POST', '/graphql', (req) => {
          if (req.body.operationName === aliasPatientList) {
            req.alias = req.body.operationName;
          }

          if (req.body.operationName === aliasVisitList) {
            req.alias = req.body.operationName;
          }
          if (req.body.operationName === aliasStudyList) {
            req.alias = req.body.operationName;
          }
        });
        cy.visit('/visit/testRevisionId1');
        cy.wait(`@${aliasPatientList}`);
        cy.wait(`@${aliasVisitList}`);
        cy.wait(`@${aliasStudyList}`);
      });
      it('Select patient', () => {
        cy.wait(500);
        cy.get(`[data-cy=sidebar-toggle-arrow]`).click();
        cy.wait(500);
      });
      it('Select visit 1', () => {
        cy.wait(500);
        cy.get('[data-cy=visit-visit1Visit4]').click();
        cy.wait(500);
      });
      it('Select rejected state', () => {
        cy.get('#REJECTED').click();
      });
      it('Check that 2 question with rejected detail', () => {
        cy.get('[data-cy=question-card-singleChoiceId1] [data-cy=title-Rejected]').contains(
          'Rejected',
        );
        cy.get('[data-cy=question-card-singleChoiceId1] [data-cy=desc-Rejected]').contains(
          'Data entry error',
        );
        cy.get('[data-cy=question-card-singleChoiceId1] [data-cy=name-Rejected]').contains(
          'Sign CRF',
        );
        cy.get('[data-cy=question-card-singleChoiceId1] [data-cy=role-Rejected]').contains(
          '(Sign CRF User, Bellevue Hospital)',
        );

        cy.get('[data-cy=question-card-bodySys1] [data-cy=title-Rejected]').contains('Rejected');
        cy.get('[data-cy=question-card-bodySys1] [data-cy=desc-Rejected]').contains(
          'other reason by investigator',
        );
        cy.get('[data-cy=question-card-bodySys1] [data-cy=name-Rejected]').contains('Sign CRF');
        cy.get('[data-cy=question-card-bodySys1] [data-cy=role-Rejected]').contains(
          '(Sign CRF User, Bellevue Hospital)',
        );
      });
    });
  });
});
