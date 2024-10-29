import 'cypress-localstorage-commands';

import {
  GetRedactionSourceCaptureDocument,
  GetVisitDetailsDocument,
  IFieldGroupVisitDetail,
} from '../../src/graphQL/generated/graphql';
import { mockUserDataAdmin } from '../../src/constant/testFixtures';

describe(
  'Source capture hashed process',
  {
    viewportHeight: 789,
    viewportWidth: 1440,
  },
  () => {
    let visitDetails;

    let unattachedFGs: IFieldGroupVisitDetail[] = [];

    const aliasGetRedaction =
      'name' in GetRedactionSourceCaptureDocument.definitions[0]
        ? GetRedactionSourceCaptureDocument.definitions[0].name?.value
        : 'GetRedactionSourceCapture';
    const aliasGetVisitDetailSC =
      'name' in GetVisitDetailsDocument.definitions[0]
        ? GetVisitDetailsDocument.definitions[0].name?.value
        : 'GetVisitDetails';
    before(() => {
      cy.reseedDB();
      cy.clearLocalStorageSnapshot();
      cy.fillInloginAsFormV2(mockUserDataAdmin);
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasGetVisitDetailSC) {
          req.alias = req.body.operationName;
        }
      });
      cy.waitForReact();
      cy.visit('/visit/testRevisionId1/bellevueHospital1/kylieMatulich/visit1VisitKYM');
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
          cy.get('[data-cy=sourceQuestionTab]').click();
        }
      });
    });

    describe('Success on hashed name redaction', () => {
      before(() => {
        cy.openAndCheckAttachModal(unattachedFGs);
      });

      it('it should redact right away and success in first try', () => {
        cy.uploadFile('EMR-kylie.jpg');
        cy.uploadRedaction('verified', false);
        cy.get('[data-cy=continue-to-suggestion-button]').click();
        cy.get('[data-cy=confirm-redact-button]').should('be.visible');
      });
    });

    describe('Failed on hashed name redaction with wrong image', () => {
      before(() => {
        cy.intercept('POST', '/graphql', (req) => {
          if (req.body.operationName === aliasGetVisitDetailSC) {
            req.alias = req.body.operationName;
          }
        });
        cy.visit('/visit/testRevisionId1/bellevueHospital1/kylieMatulich/visit1VisitKYM');
        cy.wait(`@${aliasGetVisitDetailSC}`).then((result) => {
          if (result?.response?.statusCode === 200) {
            visitDetails = result.response.body.data.visitDetails.withSourceForm;
            unattachedFGs = visitDetails.fieldGroups
              ?.filter(
                (FG: IFieldGroupVisitDetail) => FG.formFieldGroupResponse?.status === 'UNATTACHED',
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
            cy.get('[data-cy=sourceQuestionTab]').click();
          }
        });
        cy.openAndCheckAttachModal(unattachedFGs);
      });

      it('it should show no name found modal', () => {
        cy.uploadFile('EMR-kylong.png');
        cy.uploadRedaction('unverified', false);
        cy.get('[data-cy=no-name-found-modal]').should('be.visible');
      });
      it('it should found and redact new name', () => {
        cy.get('[data-cy=confirmModal-confirmButton]').should('be.visible').click();
        cy.get('[data-cy=sc-intake-container]').should('be.visible');
        cy.fillInFirstNameLastNameSCIntake({
          first: 'Kylong',
          last: 'Johan',
        });
        cy.get('[data-cy=submit-sc-intake-button]').should('be.visible').click();
        cy.intercept('POST', '/graphql', (req) => {
          if (req.body.operationName === aliasGetRedaction) {
            req.alias = req.body.operationName;
          }
        });
        cy.waitForRedactionResult(50);
        cy.get('[data-cy=verified-data-patientsName]').should('be.visible');
      });
    });

    describe('Reupload same wrong image but not confirmed affidavit', () => {
      before(() => {
        cy.intercept('POST', '/graphql', (req) => {
          if (req.body.operationName === aliasGetVisitDetailSC) {
            req.alias = req.body.operationName;
          }
        });
        cy.visit('/visit/testRevisionId1/bellevueHospital1/kylieMatulich/visit1VisitKYM');
        cy.wait(`@${aliasGetVisitDetailSC}`).then((result) => {
          if (result?.response?.statusCode === 200) {
            visitDetails = result.response.body.data.visitDetails.withSourceForm;
            unattachedFGs = visitDetails.fieldGroups
              ?.filter(
                (FG: IFieldGroupVisitDetail) => FG.formFieldGroupResponse?.status === 'UNATTACHED',
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
            cy.get('[data-cy=sourceQuestionTab]').click();
          }
        });
        cy.openAndCheckAttachModal(unattachedFGs);
      });
      it('it should show no name found modal again', () => {
        cy.uploadFile('EMR-kylong.png');
        cy.uploadRedaction('unverified', false);
        cy.get('[data-cy=no-name-found-modal]').should('be.visible');
      });
      it('it should found and redact new name and confirm affidavit', () => {
        cy.get('[data-cy=confirmModal-confirmButton]').should('be.visible').click();
        cy.get('[data-cy=sc-intake-container]').should('be.visible');
        cy.fillInFirstNameLastNameSCIntake({
          first: 'Kylong',
          last: 'Johan',
        });
        cy.get('[data-cy=submit-sc-intake-button]').should('be.visible').click();
        cy.intercept('POST', '/graphql', (req) => {
          if (req.body.operationName === aliasGetRedaction) {
            req.alias = req.body.operationName;
          }
        });
        cy.waitForRedactionResult(50);
        cy.get('[data-cy=verified-data-patientsName]').should('be.visible');

        cy.get('[data-cy=manual-redact-button]').click();
        cy.get('[data-cy=start-redact-or-continue]').should('be.visible');
        cy.get('[data-cy=continue-to-suggestion-button]').click();
        cy.get('[data-cy=confirm-redact-button]').should('be.visible').click();
        cy.intercept('POST', '/graphql', (req) => {
          if (req.body.operationName === aliasGetVisitDetailSC) {
            req.alias = req.body.operationName;
          }
        });
        cy.wait(`@${aliasGetVisitDetailSC}`);
      });
    });

    describe('Reupload same wrong image after confirm affidavit', () => {
      before(() => {
        cy.intercept('POST', '/graphql', (req) => {
          if (req.body.operationName === aliasGetVisitDetailSC) {
            req.alias = req.body.operationName;
          }
        });
        cy.visit('/visit/testRevisionId1/bellevueHospital1/kylieMatulich/visit1VisitKYM');
        cy.wait(`@${aliasGetVisitDetailSC}`).then((result) => {
          if (result?.response?.statusCode === 200) {
            visitDetails = result.response.body.data.visitDetails.withSourceForm;
            unattachedFGs = visitDetails.fieldGroups
              ?.filter(
                (FG: IFieldGroupVisitDetail) => FG.formFieldGroupResponse?.status === 'UNATTACHED',
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
            cy.get('[data-cy=sourceQuestionTab').click();
          }
        });
        cy.openAndCheckAttachModal(unattachedFGs);
      });

      it('it should redact right away because hashed name already changed', () => {
        cy.uploadFile('EMR-kylong.png');
        cy.uploadRedaction('unverified', false);
        cy.get('[data-cy=verified-data-patientsName]').should('be.visible');
      });
    });

    describe('Failed on hashed name with completely different Initials', () => {
      before(() => {
        cy.intercept('POST', '/graphql', (req) => {
          if (req.body.operationName === aliasGetVisitDetailSC) {
            req.alias = req.body.operationName;
          }
        });
        cy.visit('/visit/testRevisionId1/bellevueHospital1/kylieMatulich/visit1VisitKYM');
        cy.wait(`@${aliasGetVisitDetailSC}`).then((result) => {
          if (result?.response?.statusCode === 200) {
            visitDetails = result.response.body.data.visitDetails.withSourceForm;
            unattachedFGs = visitDetails.fieldGroups
              ?.filter(
                (FG: IFieldGroupVisitDetail) => FG.formFieldGroupResponse?.status === 'UNATTACHED',
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
            cy.get('[data-cy=sourceQuestionTab]').click();
          }
        });
        cy.openAndCheckAttachModal(unattachedFGs);
      });

      it('it should show no name found modal', () => {
        cy.uploadFile('dummy-capture.png');
        cy.uploadRedaction('unverified', false);
        cy.get('[data-cy=no-name-found-modal]').should('be.visible');
      });
      it('it should found name, redacted but not verified', () => {
        cy.get('[data-cy=confirmModal-confirmButton]').should('be.visible').click();
        cy.fillInFirstNameLastNameSCIntake({
          first: 'Frank',
          last: 'Gilmour',
        });
        cy.get('[data-cy=submit-sc-intake-button]').should('be.visible').click();
        cy.intercept('POST', '/graphql', (req) => {
          if (req.body.operationName === aliasGetRedaction) {
            req.alias = req.body.operationName;
          }
        });
        cy.waitForRedactionResult(50);
        cy.get('[data-cy=not-found-data-patientsName]').should('be.visible');
      });
    });
  },
);
