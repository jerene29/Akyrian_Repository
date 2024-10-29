import { MARKED_AS_NO_ANSWER } from '../../../src/screens/Visit/constants';
import { INoSourceForm, SubmitVisitStatusDocument } from '../../../src/graphQL/generated/graphql';
import { d } from '../../helper';
import client from '../../utils/client';
import { aliasQuery } from '../../utils/graphql-test-utils';
import { mockUserDataAdmin } from '../../../src/constant/testFixtures';

describe('No Source Question List', () => {
  let noSourceData: INoSourceForm;
  const siteId = 'ciptoHospital1';
  const patientId = 'ciptoPatient1';
  const visitId = 'screeningVisit5';
  before(() => {
    cy.beforeSetup(mockUserDataAdmin);
    cy.visit('/visit');
    cy.waitForReact();
  });

  it('Create screening visit', () => {
    cy.wrap(
      client.mutate({
        mutation: SubmitVisitStatusDocument,
        variables: {
          visitId: 'screeningVisit5',
          siteId: 'ciptoHospital1',
          status: 'OCCURRED',
          visitDate: '2021-08-25T05:00:00.000Z',
          visitDidNotOccurReasonId: null,
          visitDidNotOccurOtherReason: null,
        },
      }),
    )
      .its('data')
      .should('exist');
    cy.visit(`/visit/testRevisionId1/${siteId}/${patientId}/${visitId}`);
    cy.intercept('POST', '/graphql', (req) => {
      aliasQuery(req, 'GetVisitDetails');
    });
    cy.wait('@gqlGetVisitDetailsQuery').then((res) => {
      noSourceData = res.response?.body.data.visitDetails.noSourceForm;
    });
  });

  it('Count the amount of question rendered, should be the same as backend response', () => {
    // compare it with the actual data from BE
    cy.get('[data-cy=question-card]').should('have.length', noSourceData.fieldGroups.length);
  });

  it('Filter with text "All" should have question length number equal to bakcend response', () => {
    cy.get('[data-cy=all-filter-text]').should('have.text', 'All');
    cy.get('[data-cy=all-filter-question-count]').should(
      'have.text',
      noSourceData.fieldGroups.length,
    );
  });

  describe('Question Tests', () => {
    it('Question card should have correct title', () => {
      cy.get('[data-cy=question-card]').each((_, index) => {
        const currentQuestion = noSourceData.fieldGroups[index];
        cy.get(`[data-cy=question-title-${currentQuestion.id}]`).should(
          'have.text',
          currentQuestion.question,
        );
      });
    });

    it('Question card should display the correct input type', () => {
      cy.get('[data-cy=question-card]').each((_, index) => {
        const currentQuestion = noSourceData.fieldGroups[index];
        cy.get(`[data-cy=question-title-${currentQuestion.id}]`).should(
          'have.text',
          currentQuestion.question,
        );
      });
    });

    describe('Question Submission on Unfilled state', () => {
      it.skip('Time Picker type submission', () => {
        // * Time Picker for Medical Report submitted at

        cy.get(d`answer-input-field-ffMedRep1-0-0-input`).click();
        // * Click 02:02 AM
        cy.get(':nth-child(1) > :nth-child(3) > .ant-picker-time-panel-cell-inner').click();
        cy.get(':nth-child(2) > :nth-child(3) > .ant-picker-time-panel-cell-inner').click();

        // * Click mark as no answer
        cy.get(d`answer-input-field-ffMedRep1-0-0-input`)
          .click()
          .get(d`question-date-mark-no-answer`)
          .click();

        cy.get(d`answer-input-field-ffMedRep1-0-0`).clear();

        cy.get(d`answer-input-field-ffMedRep1-0-0-input`).click();
        // * Click 02:03 AM again
        cy.get(':nth-child(1) > :nth-child(3) > .ant-picker-time-panel-cell-inner').click();
        cy.get(':nth-child(2) > :nth-child(4) > .ant-picker-time-panel-cell-inner').click();

        cy.get(d`save-button-medReport1`)
          .should('be.visible')
          .click();
        cy.get(d`save-button-medReport1`).should('not.exist');
      });

      it('Radio type submission', () => {
        cy.get('[data-cy=answer-input-field-ffMedHis1-0-0] > :nth-child(1) > .ant-radio').click();
        cy.get('[data-cy=save-button-hasMedHistory1]').should('be.visible').click({ force: true });
        cy.get('[data-cy=question-card-hasMedHistory1]').should('not.exist');
      });

      it.skip('Date type submission', () => {
        // dob input
        cy.multiSelect({ field: 'year-answer-input-field-ffDateConsent1-0-0' });
        cy.multiSelect({ field: 'month-answer-input-field-ffDateConsent1-0-0' });
        cy.multiSelect({ field: 'date-answer-input-field-ffDateConsent1-0-0' });
        cy.get('[data-cy=save-button-dateConsent1]').should('be.visible').click({ force: true });
        cy.get('[data-cy=question-card-dateConsent1]').should('not.exist');
      });

      it('Multi-choice type submission', () => {
        cy.get('[data-cy=textfield-container-answer-input-field-ffKnownAllergies1-0-0]').type(
          '{downArrow}',
        );
        cy.get('[label="Penicillin"] > .ant-select-item-option-content').click();
        cy.get('[label="Amoxicillin"] > .ant-select-item-option-content').click();
        cy.get('[data-cy=save-button-knownAllergies1]').should('be.visible').click({ force: true });
        cy.get('[data-cy=question-card-knownAllergies1]').should('not.exist');
      });

      it('Single choice type submission', () => {
        cy.get('[data-cy=answer-input-field-ffEthnicity1-0-0]').click();
        cy.get('[label="Hispanic or Latino"] > .ant-select-item-option-content').click();
        cy.get('[data-cy=save-button-ethnicity1]').should('be.visible').click({ force: true });
        cy.get('[data-cy=question-card-ethnicity1]').should('not.exist');
      });

      it('Free text type submission', () => {
        cy.get('[data-cy=answer-input-field-ffMedCon1-0-0]').type('test freetext from testrunner');
        cy.get('[data-cy=save-button-medCondition1]').should('be.visible').click({ force: true });
        cy.get('[data-cy=question-card-medCondition1]').should('not.exist');
      });
    });

    describe('Answer rendering', () => {
      it('Change to filled state', () => {
        cy.get('[data-cy=FILLED]').click();
      });
      describe('Radio Type answer rendering', () => {
        it('Should have title : Does the subject have any medical history or baseline conditions?', () => {
          cy.get('[data-cy=question-title-hasMedHistory1]').should(
            'have.text',
            'Does the subject have any medical history or baseline conditions?',
          );
        });
        it('Should have "Has medical history" as answer label', () => {
          cy.get(
            '[data-cy=question-card-hasMedHistory1] [data-cy=answer-entry-1] [data-cy=question-label-single-choice]',
          ).should('have.text', 'Has medical history ');
        });
        it('Should have "Yes" as an answer for first entry', () => {
          cy.get(
            '[data-cy=question-card-hasMedHistory1] [data-cy=answer-entry-1] [data-cy=question-answer-single-choice]',
          ).should('have.text', 'Yes');
        });
        // it('Should have title : Did the subject consent for the Study?', () => {
        //   cy.get('[data-cy=question-title-consentQuestion1]').should('have.text', 'Did the subject consent for the Study?');
        // });
        // it('Should have "Subject consent" as answer label', () => {
        //   cy.get('[data-cy=question-card-consentQuestion1] [data-cy=answer-entry-1] [data-cy=question-label-single-choice]').should('have.text', "Subject consent ");
        // });
        // it('Should have "Yes" as an answer for first entry', () => {
        //   cy.get('[data-cy=question-card-consentQuestion1] [data-cy=answer-entry-1] [data-cy=question-answer-single-choice]').should('have.text', 'Yes');
        // });
      });

      describe.skip('Date Type answer rendering', () => {
        it('Should have title : When subject consent?', () => {
          cy.get('[data-cy=question-title-dateConsent1]').should(
            'have.text',
            'When subject consent?',
          );
        });
        it('Should have "Subject consent date" as answer label', () => {
          cy.get(
            '[data-cy=question-card-dateConsent1] [data-cy=answer-entry-1] [data-cy=question-label-date]',
          ).should('have.text', 'Subject consent date ');
        });
        it('Should have "March 3rd 2021" as an answer for first entry', () => {
          cy.get(
            '[data-cy=question-card-dateConsent1] [data-cy=answer-entry-1] [data-cy=question-answer-date]',
          ).should('have.text', 'March 3rd 2021');
        });
      });
      describe('Multiple choice answer rendering', () => {
        it('Should have title : List of patient known medicine allergies:', () => {
          cy.get('[data-cy=question-title-knownAllergies1]').should(
            'have.text',
            'List of patient known medicine allergies:',
          );
        });
        it('Should have "Known Allergies" as answer label', () => {
          cy.get(
            '[data-cy=question-card-knownAllergies1] [data-cy=question-label-multiple-choice]',
          ).should('have.text', 'Known Allergies ');
        });
        it('Should have text "Penicillin" on 1st choice', () => {
          cy.get('[data-cy=question-card-knownAllergies1] [data-cy=answer-choice-1]').should(
            'have.text',
            'Penicillin',
          );
        });
        it('Should have text "Amoxicillin" on 1st choice', () => {
          cy.get('[data-cy=question-card-knownAllergies1] [data-cy=answer-choice-2]').should(
            'have.text',
            'Amoxicillin',
          );
        });
      });

      describe('Free text type answer rendering', () => {
        it('Should have title : Medical Condition', () => {
          cy.get('[data-cy=question-title-medCondition1]').should('have.text', 'Medical Condition');
        });
        it('Should have "Medical Condition" as answer label', () => {
          cy.get('[data-cy=question-card-medCondition1] [data-cy=question-label-free-text]').should(
            'have.text',
            'Medical Condition ',
          );
        });
        it('Should have text "test freetext from testrunner" as answer', () => {
          cy.get(
            '[data-cy=question-card-medCondition1] [data-cy=question-answer-free-text]',
          ).should('have.text', 'test freetext from testrunner');
        });
      });

      describe('Single choice type answer rendering', () => {
        it('Should have title : Ethnicity of the subject', () => {
          cy.get('[data-cy=question-title-ethnicity1]').should(
            'have.text',
            'Ethnicity of the subject',
          );
        });
        it('Should have "Ethnicity" as answer label', () => {
          cy.get(
            '[data-cy=question-card-ethnicity1] [data-cy=question-label-single-choice]',
          ).should('have.text', 'Ethnicity ');
        });
        it('Should have text "Hispanic or Latino" as an answer', () => {
          cy.get(
            '[data-cy=question-card-ethnicity1] [data-cy=question-answer-single-choice]',
          ).should('have.text', 'Hispanic or Latino');
        });
      });
    });

    describe('Modal Functionality test', () => {
      it('Change to filled state', () => {
        cy.get('[data-cy=FILLED]').click();
      });
      it.skip('Should show quick action on card hover', () => {
        cy.get('[data-cy=question-card-dateConsent1] [data-cy=question-card]').click({
          force: true,
          scrollBehavior: false,
        });
        cy.get('[data-cy=change-answer-action-hasMedHistory1]').should('be.visible');
        cy.get('[data-cy=noanswer-action-hasMedHistory1]').should('be.visible');
        cy.get('[data-cy=add-query-hasMedHistory1]').should('be.visible');
        cy.get('[data-cy=accept-reject-action-hasMedHistory1]').should('be.visible');
        cy.get('[data-cy=reset-answer-action-hasMedHistory1]').should('be.visible');
      });
      describe('Mark no answer modal', () => {
        it('Opening modal', () => {
          cy.clickQuickAction(
            '[data-cy=question-card-hasMedHistory1]',
            '[data-cy=noanswer-action-hasMedHistory1]',
            undefined,
            undefined,
            'SVG',
          );
          cy.get('[data-cy=no-answer-modal]').should('be.visible');
        });
        it('Should have the Change answer - Does the subject have any medical history or baseline conditions? as title', () => {
          cy.get('[data-cy=modal-title]').should(
            'have.text',
            'Mark as No Answer - Does the subject have any medical history or baseline conditions?',
          );
        });
        it('Should render [x] close button', () => {
          cy.get('[data-cy=modal-close]').should('exist');
        });
        it('Save button should be disable on open', () => {
          cy.get('[data-cy=button-submit-noanswer]').should('be.disabled');
        });
        it('Should enable save button on reason selected', () => {
          cy.get('[data-cy=mark-no-answer-change-reason-select] > .ant-select').click({
            force: true,
          });
          cy.get('[label="Data entry error"]').click({ force: true });
          cy.get('[data-cy=mark-no-answer-reason-select] > .ant-select').click({ force: true });
          cy.get('[label="The study subject refused the medical examination or test"]').click({
            force: true,
          });
          cy.get('[data-cy=button-submit-noanswer]').should('be.enabled');
        });
        it('Should disable save button if "Other" option is selected but does NOT have any value in it ', () => {
          cy.get('[data-cy=mark-no-answer-change-reason-select] > .ant-select').click({
            force: true,
          });
          cy.get('[label="Other"]').first().click({ force: true });
          cy.get('[data-cy=button-submit-noanswer]').should('be.disabled');
        });
        it('Should disable save button on text input filled but the text length was < 5 characters', () => {
          cy.get(
            '[data-cy=mark-no-answer-change-reason-select] > .ant-select .ant-select-selection-search-input',
          )
            .should('be.focused')
            .type('1234');
          cy.get('[data-cy=button-submit-noanswer]').should('be.disabled');
        });
        it('Should enable save button on text input filled but the text length was < 5 characters', () => {
          cy.get(
            '[data-cy=mark-no-answer-change-reason-select] > .ant-select .ant-select-selection-search-input',
          ).type('123456');
          cy.get('[data-cy=button-submit-noanswer]').should('be.enabled');
        });

        it('Should close modal [x] on close button click', () => {
          cy.get('[data-cy=cancel-mark-no-answer]').click();
          cy.get('[data-cy=no-answer-modal]').should('not.exist');
        });
      });

      describe('Reset Answer modall', () => {
        it('Opening modal', () => {
          cy.clickQuickAction(
            '[data-cy=question-card-hasMedHistory1]',
            '[data-cy=reset-answer-action-hasMedHistory1]',
            undefined,
            undefined,
            'SVG',
          );
          cy.get('[data-cy=reset-answer-modal]').should('be.visible');
        });
        it('Should have the Reset answer - Does the subject have any medical history or baseline conditions? as title', () => {
          cy.get('[data-cy=modal-title]').should(
            'have.text',
            'Reset answer - Does the subject have any medical history or baseline conditions?',
          );
        });
        it('Should render [x] close button', () => {
          cy.get('[data-cy=modal-close]').should('exist');
        });
        it('Save button should be disable on open', () => {
          cy.get('[data-cy=button-submit-reset-answer]').should('be.disabled');
        });
        it('Should enable save button on reason selected', () => {
          cy.get('[data-cy=reset-answer-select] > .ant-select').click({ force: true });
          cy.get('[label="Retry data input"]').click({ force: true });
          cy.get('[data-cy=button-submit-reset-answer]').should('be.enabled');
        });
        it('Should disable save button if "Other" option is selected but does NOT have any value in it ', () => {
          cy.get('[data-cy=reset-answer-select] > .ant-select').click({ force: true });
          cy.get('[label="Other"]').click({ force: true });
          cy.get('[data-cy=button-submit-reset-answer]').should('be.disabled');
        });
        it('Should disable save button on text input filled but the text length was < 5 characters', () => {
          cy.get('[data-cy=reset-answer-select] > .ant-select .ant-select-selection-search-input')
            .should('be.focused')
            .type('1234');
          cy.get('[data-cy=button-submit-reset-answer]').should('be.disabled');
        });
        it('Should enable save button on text input filled but the text length was < 5 characters', () => {
          cy.get(
            '[data-cy=reset-answer-select] > .ant-select .ant-select-selection-search-input',
          ).type('123456');
          cy.get('[data-cy=button-submit-reset-answer]').should('be.enabled');
        });
        it('Should close modal [x] on close button click', () => {
          cy.get('[data-cy=cancel-submit-reset-answer]').click();
          cy.get('[data-cy=no-answer-modal]').should('not.exist');
        });
      });
    });

    describe('Question edit on Filled state', () => {
      describe('Editing Radio input question', () => {
        it('Clicking on change answer quick action should show change answer modal', () => {
          cy.clickQuickAction(
            '[data-cy=question-card-hasMedHistory1]',
            '[data-cy=change-answer-action-hasMedHistory1]',
            undefined,
            undefined,
            'SVG',
          );
        });
        it('Save button should be visible', () => {
          cy.get('[data-cy=save-button-hasMedHistory1]').should('be.visible');
          cy.get('[data-cy=save-button-hasMedHistory1]').should('be.disabled');
          // cy.get('[data-cy=save-button-consentQuestion1]').should('be.visible');
        });
        it('Should show radio options instead answer', () => {
          cy.get('[data-cy=question-card-hasMedHistory1] .ant-radio-input').should('exist');
          // cy.get('[data-cy=question-card-consentQuestion1] .ant-radio-input').should('exist');
        });
        it('Should show "Yes" as checked', () => {
          cy.get('[data-cy=question-card-hasMedHistory1] input[type=radio]:checked').should(
            'have.value',
            'medHisYes1',
          );
          // cy.get('[data-cy=question-card-consentQuestion1] input[type=radio]:checked').should('have.value', 'consentYes1');
        });
        it('Should show 3 Radio options', () => {
          cy.get('[data-cy=question-card-hasMedHistory1] input[type=radio]').should(
            'have.length',
            3,
          );
          // cy.get('[data-cy=question-card-consentQuestion1] input[type=radio]').should('have.length', 3);
        });
        it('Change answer to No by check-ing radio input with "No" label', () => {
          cy.get('[data-cy=answer-input-field-ffMedHis1-0-0] > :nth-child(2) > .ant-radio').click();
          // cy.get('[data-cy=answer-input-field-ffConsentQuestion1-0-0] > :nth-child(2) > .ant-radio').click();
        });
        it('Radio option with "No" as label should be checked', () => {
          cy.get('[data-cy=question-card-hasMedHistory1] input[type=radio]:checked').should(
            'have.value',
            'medHisNo1',
          );
          // cy.get('[data-cy=question-card-consentQuestion1] input[type=radio]:checked').should('have.value', 'consentNo1');
        });
        it('Save button should be enabled', () => {
          cy.editNoSourceQuestionReason('hasMedHistory1');
          cy.get('[data-cy=save-button-hasMedHistory1]').should('be.enabled');
          // cy.get('[data-cy=save-button-consentQuestion1]').should('be.enabled');
        });
        it('Saving question', () => {
          cy.get('[data-cy=save-button-hasMedHistory1]').click({ force: true });
          cy.get('[data-cy=save-button-hasMedHistory1]').should('not.exist');
        });
        it('Should remove radio input and render answer instead', () => {
          cy.get('[data-cy=question-card-hasMedHistory1] .ant-radio-input').should('not.exist');
        });
        it('Should have "No" as an answer', () => {
          cy.get(
            '[data-cy=question-card-hasMedHistory1] [data-cy=answer-entry-1] [data-cy=question-answer-single-choice]',
          ).should('have.text', 'No');
        });
      });

      describe.skip('Editing Date input question', () => {
        it('Clicking on change answer quick action should show change answer modal', () => {
          cy.clickQuickAction(
            '[data-cy=question-card-dateConsent1]',
            '[data-cy=change-answer-action-dateConsent1]',
            undefined,
            undefined,
            'SVG',
          );
        });
        it('Save button should be visible', () => {
          cy.get('[data-cy=save-button-dateConsent1]').should('be.visible');
          cy.get('[data-cy=save-button-dateConsent1]').should('be.disabled');
        });
        it('Should show Date input instead answer', () => {
          cy.get(
            '[data-cy=select-year-answer-input-field-ffDateConsent1-0-0] > .ant-select-selector > .ant-select-selection-item',
          ).should('exist');
        });
        it('Should show "Mar 3, 2021" Value', () => {
          cy.get(
            '[data-cy=select-year-answer-input-field-ffDateConsent1-0-0] > .ant-select-selector > .ant-select-selection-item',
          ).should('have.text', '2021');
          cy.get(
            '[data-cy=select-month-answer-input-field-ffDateConsent1-0-0] > .ant-select-selector > .ant-select-selection-item',
          ).should('have.text', 'March');
          cy.get(
            '[data-cy=select-date-answer-input-field-ffDateConsent1-0-0] > .ant-select-selector > .ant-select-selection-item',
          ).should('have.text', '3');
        });
        it('Change answer to Feb 2, 2019', () => {
          cy.multiSelect({ field: 'year-answer-input-field-ffDateConsent1-0-0' });
          cy.multiSelect({ field: 'month-answer-input-field-ffDateConsent1-0-0' });
          cy.multiSelect({ field: 'date-answer-input-field-ffDateConsent1-0-0' });
        });
        it('Save button should be enabled', () => {
          cy.editNoSourceQuestionReason('dateConsent1');
          cy.get('[data-cy=save-button-dateConsent1]').should('be.enabled');
        });
        it('Saving question', () => {
          cy.get('[data-cy=save-button-dateConsent1]').click({ force: true });
          cy.get('[data-cy=save-button-dateConsent1]').should('not.exist');
        });
        it('Should remove date input and render answer instead', () => {
          cy.get('[data-cy=question-form-date-dropdown-container]').should('not.exist');
        });
        it('Should have "June 6th 2018" as an answer', () => {
          cy.get(
            '[data-cy=question-card-dateConsent1] [data-cy=answer-entry-1] [data-cy=question-answer-date]',
          ).should('have.text', 'June 6th 2018');
        });
      });

      describe('Editing Multiple choice question', () => {
        it('Clicking on change answer quick action should show change answer modal', () => {
          cy.clickQuickAction(
            '[data-cy=question-card-knownAllergies1]',
            '[data-cy=change-answer-action-knownAllergies1]',
            undefined,
            undefined,
            'SVG',
          );
        });
        it('Save button should be visible', () => {
          cy.get('[data-cy=save-button-knownAllergies1]').should('be.visible');
          cy.get('[data-cy=save-button-knownAllergies1]').should('be.disabled');
        });
        it('Should show Multichoice input instead answer', () => {
          cy.get('[data-cy=question-card-knownAllergies1] [data-cy=answer-choice-1]').should(
            'not.exist',
          );
          cy.get('[data-cy=question-card-knownAllergies1] [data-cy=answer-choice-2]').should(
            'not.exist',
          );
          cy.get('[data-cy=question-card-knownAllergies1] [data-cy=select-container]').should(
            'exist',
          );
        });
        it('Should show render previous answer value', () => {
          cy.get('[data-cy=question-card-knownAllergies1] [data-cy=penicillin1]')
            .should('exist')
            .should('be.visible');
          cy.get('[data-cy=question-card-knownAllergies1] [data-cy=amoxicillin1]')
            .should('exist')
            .should('be.visible');
        });
        it('Should render [x] remove icon on each answer pills', () => {
          cy.get('[data-cy=penicillin1] > .ant-tag-close-icon > [data-cy=remove-choice]')
            .should('exist')
            .should('be.visible');
          cy.get('[data-cy=amoxicillin1] > .ant-tag-close-icon > [data-cy=remove-choice]')
            .should('exist')
            .should('be.visible');
        });
        it('Should show dropdown on input click', () => {
          // NOTE: need enter 2 times for this test flow
          cy.get('[data-cy=textfield-container-answer-input-field-ffKnownAllergies1-0-0').type(
            '{enter}{enter}',
          );
          cy.get('[data-cy=question-card-knownAllergies1] .rc-virtual-list').should('be.visible');
        });
        it('Answered Choice should be highlited', () => {
          cy.get('[data-cy=question-card-knownAllergies1] div[label=Amoxicillin]').should(
            'have.class',
            'ant-select-item-option-selected',
          );
          // ToDo: figure out why penicilin is not selected
          cy.get('[data-cy=question-card-knownAllergies1] div[label=Penicillin]').should(
            'have.class',
            'ant-select-item-option-selected',
          );
        });
        it('Answer pill should be removed after [x] remove icon clicked', () => {
          cy.get('[data-cy=penicillin1] > .ant-tag-close-icon > [data-cy=remove-choice]').click();
          cy.get('[data-cy=question-card-knownAllergies1] [data-cy=penicillin1]').should(
            'not.exist',
          );
          cy.get('[data-cy=amoxicillin1] > .ant-tag-close-icon > [data-cy=remove-choice]').click();
          cy.get('[data-cy=question-card-knownAllergies1] [data-cy=amoxicillin1]').should(
            'not.exist',
          );
        });
        it('Option amoxicillin and penicillin should not highlited , since it was removed from selection ', () => {
          cy.get('[data-cy=question-card-knownAllergies1] div[label=Amoxicillin]').should(
            'not.have.class',
            'ant-select-item-option-selected',
          );
          cy.get('[data-cy=question-card-knownAllergies1] div[label=Penicillin]').should(
            'not.have.class',
            'ant-select-item-option-selected',
          );
        });
        it('Should render Mark as no answer option', () => {
          cy.get('[data-cy=question-card-knownAllergies1] div[label="Mark as No Answer"]').should(
            'exist',
          );
        });
        it('Select Aspirin ,Insulin, And Ibuprofen as new answer', () => {
          cy.get('[label="Aspirin"] > .ant-select-item-option-content').click();
          cy.get('[label="Ibuprofen"] > .ant-select-item-option-content').click();
          cy.get('[label="Insulin"] > .ant-select-item-option-content').click();
        });
        it('Aspirin, Insulin, And Ibuprofen should be highlited', () => {
          cy.get('[data-cy=question-card-knownAllergies1] div[label=Aspirin]').should(
            'have.class',
            'ant-select-item-option-selected',
          );
          cy.get('[data-cy=question-card-knownAllergies1] div[label=Insulin]').should(
            'have.class',
            'ant-select-item-option-selected',
          );
          cy.get('[data-cy=question-card-knownAllergies1] div[label=Ibuprofen]').should(
            'have.class',
            'ant-select-item-option-selected',
          );
        });
        it('Should render correct pills after changing answer', () => {
          cy.get('[data-cy=question-card-knownAllergies1] [data-cy=aspirin1]')
            .should('exist')
            .should('be.visible');
          cy.get('[data-cy=question-card-knownAllergies1] [data-cy=ibuprofen1]')
            .should('exist')
            .should('be.visible');
          cy.get('[data-cy=question-card-knownAllergies1] [data-cy=insulin1]')
            .should('exist')
            .should('be.visible');
        });

        it('Should render reset answer button', () => {
          cy.get('[data-cy=cancel-button-knownAllergies1]').should('exist').should('be.visible');
        });
        it('Should remove all pills on reset button clicked', () => {
          cy.get('[data-cy=textfield-container-answer-input-field-ffKnownAllergies1-0-0').type(
            '{enter}',
          );

          cy.get('[data-cy=multi-choice-reset-button-knownAllergies1]').click();
          cy.get('[data-cy=question-card-knownAllergies1] [data-cy=aspirin1]').should('not.exist');
          cy.get('[data-cy=question-card-knownAllergies1] [data-cy=ibuprofen1]').should(
            'not.exist',
          );
          cy.get('[data-cy=question-card-knownAllergies1] [data-cy=insulin1]').should('not.exist');
          cy.get('[data-cy=textfield-container-answer-input-field-ffKnownAllergies1-0-0').type(
            '{enter}',
          );

          cy.get('[label="Aspirin"] > .ant-select-item-option-content').click();
          cy.get('[label="Ibuprofen"] > .ant-select-item-option-content').click();
          cy.get('[label="Insulin"] > .ant-select-item-option-content').click();
        });

        it('Should remove all other answer if Mark as no Answer choice is selected', () => {
          cy.get('[data-cy=textfield-container-answer-input-field-ffKnownAllergies1-0-0').type(
            '{enter}',
          );
          cy.get('[label="Mark as No Answer"]').click();
          cy.get('[data-cy=question-card-knownAllergies1] [data-cy=aspirin1]').should('not.exist');
          cy.get('[data-cy=question-card-knownAllergies1] [data-cy=ibuprofen1]').should(
            'not.exist',
          );
          cy.get('[data-cy=question-card-knownAllergies1] [data-cy=insulin1]').should('not.exist');
          cy.get('[data-cy=textfield-container-answer-input-field-ffKnownAllergies1-0-0').type(
            '{enter}',
          );

          cy.get('[label="Aspirin"] > .ant-select-item-option-content').click();
          cy.get('[label="Ibuprofen"] > .ant-select-item-option-content').click();
          cy.get('[label="Insulin"] > .ant-select-item-option-content').click();
        });

        it('Saving question', () => {
          cy.editNoSourceQuestionReason('knownAllergies1');
          cy.get('[data-cy=save-button-knownAllergies1]').click({ force: true });
          cy.get('[data-cy=save-button-knownAllergies1]').should('not.exist');
        });
        it('Should remove Multi choice input and render answer instead', () => {
          cy.get('[data-cy=textfield-container-answer-input-field-ffKnownAllergies1-0-0').should(
            'not.exist',
          );
        });
        it('Should have text "Aspirin" on 1st choice', () => {
          cy.get('[data-cy=question-card-knownAllergies1] [data-cy=answer-choice-1]').should(
            'have.text',
            'Aspirin',
          );
        });
        it('Should have text "Insulin" on 1st choice', () => {
          cy.get('[data-cy=question-card-knownAllergies1] [data-cy=answer-choice-2]').should(
            'have.text',
            'Insulin',
          );
        });
        it('Should have text "Ibuprofen" on 1st choice', () => {
          cy.get('[data-cy=question-card-knownAllergies1] [data-cy=answer-choice-3]').should(
            'have.text',
            'Ibuprofen',
          );
        });
      });
      describe('Editing Single choice Question', () => {
        it('Clicking on change answer quick action should show change answer modal', () => {
          cy.clickQuickAction(
            '[data-cy=question-card-ethnicity1]',
            '[data-cy=change-answer-action-ethnicity1]',
            undefined,
            undefined,
            'SVG',
          );
        });
        it('Save button should be visible', () => {
          cy.get('[data-cy=save-button-ethnicity1]').should('be.visible');
          cy.get('[data-cy=save-button-ethnicity1]').should('be.disabled');
        });
        it('Should remove date input and render answer instead', () => {
          cy.get('[data-cy=answer-input-field-ffEthnicity1-0-0]').should('exist');
        });
        it('Should have "Hispanic or Latino" As pre-filled answer', () => {
          cy.get(
            '[data-cy=answer-input-field-ffEthnicity1-0-0] [title="Hispanic or Latino"]',
          ).should('exist');
        });
        it('Should show dropdown list onClick , and with "Hispanic or Latino" Option Highlited', () => {
          cy.get('[data-cy=answer-input-field-ffEthnicity1-0-0]').click();
          cy.get('[data-cy=question-card-ethnicity1] .rc-virtual-list').should('be.visible');
          cy.get(
            '[data-cy=question-card-ethnicity1] .rc-virtual-list div[label="Hispanic or Latino"]',
          )
            .should('have.class', 'ant-select-item-option-selected')
            .should('have.class', 'ant-select-item-option-active');
        });
        it('Should change answer to "Not reported"', () => {
          cy.get('[label="Not Hispanic or Latino"]').click();
          cy.get(
            '[data-cy=answer-input-field-ffEthnicity1-0-0] [title="Not Hispanic or Latino"]',
          ).should('exist');
        });
        it('Saving question', () => {
          cy.editNoSourceQuestionReason('ethnicity1');
          cy.get('[data-cy=save-button-ethnicity1]').click({ force: true });
          cy.get('[data-cy=save-button-ethnicity1]').should('not.exist');
        });
        it('Should have "Not Hispanic or Latino" as an answer', () => {
          cy.get(
            '[data-cy=question-card-ethnicity1] [data-cy=answer-entry-1] [data-cy=question-answer-single-choice]',
          ).should('have.text', 'Not Hispanic or Latino');
        });
      });
      describe('Editing Freetext question', () => {
        it('Clicking on change answer quick action should show change answer modal', () => {
          cy.clickQuickAction(
            '[data-cy=question-card-medCondition1]',
            '[data-cy=change-answer-action-medCondition1]',
            undefined,
            undefined,
            'SVG',
          );
        });

        it('Save button should be visible', () => {
          cy.get('[data-cy=save-button-medCondition1]').should('be.visible');
          cy.get('[data-cy=save-button-medCondition1]').should('be.disabled');
        });
        it('Should remove answer and render Text input with answered value', () => {
          cy.get('[data-cy=answer-input-field-ffMedCon1-0-0]')
            .should('exist')
            .should('have.value', 'test freetext from testrunner');
        });
        it('Should render Mark no answer icon', () => {
          cy.get('[data-cy=answer-input-field-ffMedCon1-0-0]').focus();
          cy.get('[data-cy=answer-input-field-ffMedCon1-0-0-mark-no-answer]').should('exist');
          cy.get('[data-cy=mark-no-answer-input-container-field-ffMedCon1-0-1]').click();
          cy.get(
            '[data-cy=mark-no-answer-input-container-field-ffMedCon1-0-1] [data-cy=mark-no-answer-tooltip-text]',
          ).should('have.text', 'Mark as No Answer');
        });
        it('Should change input value to "Mark As no Answer" on Mark no answer tooltip clicked', () => {
          cy.get('[data-cy=mark-no-answer-input-container-field-ffMedCon1-0-1]').click();
          cy.get('[data-cy=answer-input-field-ffMedCon1-0-0]')
            .should('exist')
            .should('have.value', MARKED_AS_NO_ANSWER);
        });
        it('Change input answer to "Editing test from test runner"', () => {
          cy.get('[data-cy=answer-input-field-ffMedCon1-0-0]')
            .clear()
            .type('Editing test from test runner');
        });
        it('Saving question', () => {
          cy.editNoSourceQuestionReason('medCondition1');
          cy.get('[data-cy=save-button-medCondition1]').click({ force: true });
          cy.get('[data-cy=save-button-medCondition1]').should('not.exist');
        });
        it('Should have "Editing test from test runner" as an answer', () => {
          cy.get(
            '[data-cy=question-card-medCondition1] [data-cy=answer-entry-1] [data-cy=question-answer-free-text]',
          ).should('have.text', 'Editing test from test runner');
        });
      });
    });
  });
});
