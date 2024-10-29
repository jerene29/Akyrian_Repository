import {
  CreateStudyDocument,
  GetStudyRevisionListDocument,
  StudyCollectionDocument,
  StudyRevisionReasonListDocument,
  UpdateStudyConfigReasonDocument,
} from '../../../src/graphQL/generated/graphql';
import 'cypress-localstorage-commands';

const reasonsDictionary: any = {
  visitDidNotOccurReasons: {
    allow: 'allowVisitDidNotOccurOtherReason',
    reason: 'Visit did not Occur',
  },
  formFieldUpdatedReasons: {
    allow: 'allowFormFieldUpdatedOtherReason',
    reason: 'No Source - Edit Answer',
  },
  formFieldResetReasons: {
    allow: 'allowFormFieldResetOtherReason',
    reason: 'No Source - Reset Answer',
  },
  formFieldNotAvailableReasons: {
    allow: 'allowFormFieldNotAvailableOtherReason',
    reason: 'No Source - Mark No Answer',
  },
  noSourceReviewRejectedReasons: {
    allow: 'allowNoSourceReviewRejectedReasonsOtherReason',
    reason: 'No Source - Reject Answer',
  },
  investigatorRejectedReasons: {
    allow: 'allowInvestigatorRejectedOtherReason',
    reason: 'No Source - Investigator Reject',
  },
  verifierRejectedReasons: {
    allow: 'allowVerifierRejectedOtherReason',
    reason: 'Source Capture - Rejected Data Entry',
  },
  markUpRejectedReasons: {
    allow: 'allowMarkUpRejectedReasonsOtherReason',
    reason: 'Source Capture - Reject Snippet & Reject Source Capture',
  },
  sourceCaptureDetachReasons: {
    allow: 'allowSourceCaptureDetachReasonsOtherReason',
    reason: 'Source Capture - Detach and Change Attachment',
  },
  markUpEditReasons: {
    allow: 'allowMarkUpEditReasonsOtherReason',
    reason: 'Source Capture - Edit Snippet',
  },
  sourceCaptureFieldNotAvailableReasons: {
    allow: 'allowSourceCaptureFieldNotAvailableOtherReason',
    reason: 'Source Capture - Mark No Answer',
  },
  sourceCaptureRevertNoAnswerReasons: {
    allow: 'allowSourceCaptureRevertNoAnswerOtherReason',
    reason: 'Source Capture - Revert No Answer',
  },
  sourceCaptureFieldUpdatedReasons: {
    allow: 'allowSourceCaptureFieldUpdatedOtherReason',
    reason: 'Source Capture - Edit Data Entry',
  },
  sourceCaptureInvestigatorRejectedReasons: {
    allow: 'allowSourceCaptureInvestigatorRejectedOtherReason',
    reason: 'Source Capture - Investigator Reject',
  },
};
const aliasStudyRevisionList = GetStudyRevisionListDocument.definitions[0].name.value;
const aliasStudyCollection = StudyCollectionDocument.definitions[0].name.value;
const aliasStudyReason = StudyRevisionReasonListDocument.definitions[0].name.value;
const aliasUpdateReason = UpdateStudyConfigReasonDocument.definitions[0].name.value;
const aliasCreateaStudy = CreateStudyDocument.definitions[0].name.value;
const studyConfigList = [];
const studyCollection: any = [];
let pausedStudies: any;
let archivedStudies: any;
let allStudyRevisionList: any;
let studyDevCard: any;
let selectedReason: any;
let reasons: any;
let newStudy: any;
const buttonList = ['DEVELOPMENT', 'STAGING', 'UAT', 'PRODUCTION'];

describe.skip('Reasons Test', () => {
  before(() => {
    cy.reseedDB();
    cy.fillInloginAsForm({
      email: 'admin@example.com',
    });
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasStudyRevisionList) {
        req.alias = req.body.operationName;
      }
      if (req.body.operationName === aliasStudyCollection) {
        req.alias = req.body.operationName;
      }
    });
    cy.visit('/study');
    cy.wait(`@${aliasStudyCollection}`);
    cy.wait(`@${aliasStudyRevisionList}`).then((res) => {
      if (res.response?.statusCode === 200) {
        allStudyRevisionList = res.response.body.data.studyRevisionList.studyRevisions;
        studyDevCard = allStudyRevisionList.filter(
          (study) => study.environment === 'DEVELOPMENT',
        )[0];
      }
    });
    cy.waitForReact();
  });

  beforeEach(() => {
    cy.restoreLocalStorageCache();
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  describe('Check all reasons', () => {
    it('Select a study card and go to study-page', () => {
      cy.get('[data-cy=hi-user]').should('exist');
      cy.get(`#active-study1revisionDev2e`).click();
      cy.get('[data-cy=btn-edit-study').click();
    });
    it('Select study settin icon', () => {
      cy.get('[data-cy=study-settings-icon]').click();
    });
    it('Select reasons menu and check all reasons', () => {
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasStudyReason) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=menu-item-reason]').click();
      cy.wait(`@${aliasStudyReason}`).then((res) => {
        if (res.response?.statusCode === 200) {
          reasons = res.response.body.data.studyRevisionReasonList;
          Object.keys(reasons).map((key) => {
            if (reasons[key].length && key !== '__typename') {
              cy.get(`[data-cy=study-setting-card-list-name-${key}]`).should('exist');
              cy.get(`[data-cy=study-setting-card-list-name-${key}]`).should(
                'have.text',
                `${reasonsDictionary[key].reason}`,
              );
              cy.get(`[data-cy=total-reasons-${key}]`).should(
                'have.text',
                `${reasons[key].length} Reasons`,
              );
              if (reasons[reasonsDictionary[key].allow]) {
                cy.get(`[data-cy=allow-other-reason-${key}]`).should(
                  'have.text',
                  'Allow free text reason (Other)',
                );
              }
            }
          });
        }
      });
    });
  });

  describe('Check reasons props', () => {
    it('Select edit reason (pencil icon)', () => {
      cy.get('[data-cy=edit-card-visitDidNotOccurReasons]').click();
    });
    it('Check all props for input reasons', () => {
      selectedReason = reasons['visitDidNotOccurReasons'];
      cy.wrap(selectedReason).each((el: any) => {
        cy.get(`[data-cy=reason-input-${el?.id}]`).should('exist');
        // cy.get(`[data-cy=reason-input-${el.id}]`).should('have.text', `${el.title}`)
      });
    });
  });

  describe('Check form validation', () => {
    it('Check save disability for the first time', () => {
      cy.get('[data-cy=study-setting-save-button]').should('be.enabled');
    });
    it('Add reason', () => {
      cy.get('[data-cy=add-reason]').click();
      cy.get('[data-cy=study-setting-save-button]').should('be.disabled');
    });
    it('Type new reasons and check minimal value', () => {
      selectedReason.push({ id: '0-newReason', title: 'Reason testing' });
      cy.get(`[data-cy=reason-input-0-newReason]`).click();
      cy.get(`[data-cy=reason-input-0-newReason]`).type('Reas');
      cy.get('[data-cy=study-setting-save-button]').should('be.disabled');
      cy.get(`[data-cy=reason-input-0-newReason]`).type('on testing');
      cy.get('[data-cy=study-setting-save-button]').should('be.enabled');
    });
    it('Turn off allow other reason', () => {
      cy.get('[data-cy=allow-other-reason]').click();
      cy.get('[data-cy=study-setting-save-button]').should('be.enabled');
    });
    it('Delte a reason input', () => {
      selectedReason.splice(1, 1);
      cy.get(`[data-cy=delete-reason-${selectedReason[1].id}]`).click();
      cy.get('[data-cy=study-setting-save-button]').should('be.enabled');
    });
  });

  describe('Update reason', () => {
    it('Click save', () => {
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasUpdateReason) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=study-setting-save-button]').click();
      cy.wait(`@${aliasUpdateReason}`);
      cy.get('[data-cy=alert-success]').should('exist');
      cy.clearLocalStorageSnapshot();
      cy.clearAuthCookies();
      cy.wait(1000);
    });
  });
});

describe('Crete new study and check all the reasons', () => {
  before('Create new study', () => {
    cy.reseedDB();
    cy.fillInloginAsForm({
      email: 'admin@example.com',
    });
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasStudyRevisionList) {
        req.alias = req.body.operationName;
      }
      if (req.body.operationName === aliasStudyCollection) {
        req.alias = req.body.operationName;
      }
    });
    cy.visit('/study');
    cy.wait(`@${aliasStudyCollection}`);
    cy.wait(`@${aliasStudyRevisionList}`);
    cy.waitForReact();
    cy.get('#create-study').click();
    cy.wait(5000);
    cy.get('[data-cy=textfield-container-study-organization]')
      .should('exist')
      .type('{downarrow}{enter}');
    cy.wait(1000);
    cy.get('[data-cy=textfield-container-study-organization]').contains('Pfizer');
    cy.wait(1000);

    cy.get('[data-cy=textfield-container-study-operatingOrganization]').type('{downarrow}{enter}');
    cy.wait(1000);

    cy.get('#studyName').clear();
    cy.get('#studyName').type('testing');

    cy.get('[data-cy=textfield-container-study-subject]').type('{downarrow}{enter}');

    cy.get('#studyProtocol').clear();
    cy.get('#studyProtocol').type('testing-subject');

    cy.get('#studyDescription').click();
    cy.get('#studyDescription').type('testing description');

    cy.get('#automaticRegex .ant-checkbox-input').check();
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasCreateaStudy) {
        req.alias = req.body.operationName;
      }
    });
    cy.get('#btn-submit').click();
    cy.wait(`@${aliasCreateaStudy}`).then((result) => {
      cy.wrap(result).then(() => {
        if (result?.response?.statusCode === 200) {
          newStudy = result.response.body.data.createStudy.studyRevision;

          cy.get('[data-cy=alert-success]')
            .should('exist')
            .contains('This Study has been added successfully');
          cy.wait(3000);
          cy.intercept('POST', '/graphql', (req) => {
            if (req.body.operationName === aliasStudyRevisionList) {
              req.alias = req.body.operationName;
            }
            if (req.body.operationName === aliasStudyCollection) {
              req.alias = req.body.operationName;
            }
          });
          cy.visit('/study');
          cy.wait(`@${aliasStudyCollection}`);
          cy.wait(`@${aliasStudyRevisionList}`);
          cy.waitForReact();
          cy.wait(5000);
        }
      });
    });
    cy.wrap(newStudy).then(() => {
      cy.scrollToElement(`#active-${newStudy.id}`).should('exist').click();
    });
  });

  it('Select study settin icon', () => {
    cy.get('[data-cy=icon-system-study-settings]').click();
    // cy.get('[data-cy=study-settings-icon]').click();
  });
  it('Select reasons menu and check all reasons', () => {
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasStudyReason) {
        req.alias = req.body.operationName;
      }
    });
    cy.get('[data-cy=menu-item-reason]').click();
    cy.wait(`@${aliasStudyReason}`).then((res) => {
      if (res.response?.statusCode === 200) {
        reasons = res.response.body.data.studyRevisionReasonList;
        Object.keys(reasons).map((key) => {
          if (key !== '__typename' && !key.includes('allow')) {
            cy.get(`[data-cy=study-setting-card-list-name-${key}]`).should('exist');
            if (reasonsDictionary[key] && reasonsDictionary[key].reason) {
              cy.get(`[data-cy=study-setting-card-list-name-${key}]`).should(
                'have.text',
                `${reasonsDictionary[key].reason}`,
              );
            }
            cy.get(`[data-cy=total-reasons-${key}]`).should(
              'have.text',
              `${reasons[key].length} Reasons`,
            );
            if (reasons[reasonsDictionary[key]] && reasons[reasonsDictionary[key].allow]) {
              cy.get(`[data-cy=allow-other-reason-${key}]`).should(
                'have.text',
                'Allow free text reason (Other)',
              );
            }
          }
        });
      }
    });
  });
});
