import {
  GetStudyRevisionListDocument,
  StudyCollectionDocument,
  UpdateFolderPathDocument,
  PushRevisionToNextEnvDocument,
} from '../../../src/graphQL/generated/graphql';

describe('Push study to next env inside a folder', () => {
  const aliasStudyRevisionList = GetStudyRevisionListDocument.definitions[0].name.value;
  const aliasStudyCollection = StudyCollectionDocument.definitions[0].name.value;
  const aliasUpdateFolderName = UpdateFolderPathDocument.definitions[0].name.value;
  const aliasPushNextEnv = PushRevisionToNextEnvDocument.definitions[0].name.value;

  let selectedCard: any;
  let listFolder: any;
  let resultPushToEnv: any;

  before(() => {
    cy.reseedDB();
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasStudyRevisionList) {
        req.alias = req.body.operationName;
      }
      if (req.body.operationName === aliasStudyCollection) {
        req.alias = req.body.operationName;
      }
    });
    cy.fillInloginAsForm({
      email: 'admin@example.com',
    });
    cy.saveLocalStorage();
    cy.waitForReact();
    cy.wait(`@${aliasStudyCollection}`);
    cy.wait(`@${aliasStudyRevisionList}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        selectedCard = result.response.body.data.studyRevisionList.studyRevisions.filter(
          (study) => study.id === 'study1revisionDev1a',
        )[0];
      }
    });
  });

  describe('Create folder', () => {
    it('Select a card', () => {
      cy.get('#active-study1revisionDev2a').click();
    });
    it('CLick create add to folder quick action', () => {
      cy.get('[data-cy=icon-add-to-folder]').click();
    });
    it('Fill input folder name', () => {
      cy.get('[data-cy=edit-folder-name]').clear();
      cy.get('[data-cy=edit-folder-name]').type('testing-folder');
    });
    it('CLick save button', () => {
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasStudyRevisionList) {
          req.alias = req.body.operationName;
        }
        if (req.body.operationName === aliasUpdateFolderName) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=study-setting-save-button]').click();
      cy.wait(`@${aliasStudyRevisionList}`);
      cy.wait(`@${aliasUpdateFolderName}`);
      cy.get('.all-development-studies').click();
    });
  });
  describe('Move study v.2.e inside a folder and push to next env', () => {
    it('Click a card', () => {
      cy.get('#active-study1revisionDev2e').click();
    });
    it('Click move to folder quick action', () => {
      cy.get('[data-cy=icon-move-to-folder]').click();
    });
    it('Check modal content', () => {
      cy.get('[data-cy=folder-modal-title]').should('have.text', 'Move to Folder');
      cy.get(`#folder-modal-study1revisionDev2a`).should('exist');
      cy.get(`#folder-modal-study1revisionDev2a`).click();
    });
    it('Click select button', () => {
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasStudyRevisionList) {
          req.alias = req.body.operationName;
        }
        if (req.body.operationName === aliasUpdateFolderName) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=button-submit-updatefolder]').click();
      cy.get('[data-cy=alert-success]').should('exist');
      cy.get('[data-cy=alert-success]').should('have.text', 'Study has been moved to folder');
      cy.wait(`@${aliasStudyRevisionList}`);
      cy.wait(`@${aliasUpdateFolderName}`);
      cy.wait(5000);
    });
    it('Click study v.2.e card', () => {
      cy.get('#folder-list-study1revisionDev2e').click();
    });
    it('Click move to folder quick action', () => {
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasPushNextEnv) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=right-button-quickactions]').click({ force: true });
      cy.wait(`@${aliasPushNextEnv}`).then((res) => {
        if (res.response?.statusCode === 200) {
          resultPushToEnv = res.response?.body.data.pushRevisionToNextEnv.id;
        }
      });
      cy.wait(5000);
    });
    it('Check study v.2.e in staging', () => {
      cy.wait(2000);
      cy.get('#env-selector-STAGING').click();
      cy.get(`#active-${resultPushToEnv}`).click();
      cy.get(`#active-${resultPushToEnv}`).contains('v.2.e');
    });
  });
});
