import {
  GetStudyRevisionListDocument,
  IStudyEnvironment,
  StudyCollectionDocument,
  UpdateFolderPathDocument,
} from '../../../src/graphQL/generated/graphql';
import 'cypress-localstorage-commands';

describe('Moving folder test with drag', () => {
  const aliasStudyRevisionList = GetStudyRevisionListDocument.definitions[0].name.value;
  const aliasStudyCollection = StudyCollectionDocument.definitions[0].name.value;
  const aliasUpdateFolderName = UpdateFolderPathDocument.definitions[0].name.value;
  let selectedCard: any;
  let listFolder: any;

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
    cy.saveLocalStorageCache();
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
      cy.wait(`@${aliasStudyRevisionList}`).then((result) => {
        if (result?.response?.statusCode === 200) {
          const uniqueStudyRev = result.response.body.data.studyRevisionList.studyRevisions.filter(
            (value, idx, self) => {
              if (value.path !== '/') {
                return (
                  self
                    .map((x) => `${x.path}${x.environment}`)
                    .indexOf(`${value.path}${value.environment}`) === idx
                );
              }
              return value;
            },
          );
          listFolder = uniqueStudyRev.filter(
            (study) => study.path !== '/' && study.environment === IStudyEnvironment.Development,
          );
          selectedCard = result.response.body.data.studyRevisionList.studyRevisions.filter(
            (study) => study.id === 'study1revisionDev1a',
          )[0];
        }
      });
      cy.wait(`@${aliasUpdateFolderName}`);
      cy.wait(5000);
      cy.get('.all-development-studies').click();
      cy.wait(5000);
    });
  });

  describe('Moving to folder by drag', () => {
    it('Moving one card', () => {
      cy.dragAndDrop(`#active-study1revisionDev1b`, '#folder-study1revisionDev2a');
      cy.get('.all-development-studies').should('be.visible').click();
    });
    it('Moving two card', () => {
      cy.get('#active-study1revisionDev2e').should('be.visible').click();
      cy.get('#active-study1revisionDev2c').should('be.visible').click({ ctrlKey: true });
      cy.dragAndDrop(`#active-study1revisionDev2c`, '#folder-study1revisionDev2a', 650);
      cy.get('#folder-list-study1revisionDev2e').should('be.visible');
    });

    it('Push Study to next env inside folder, previous study should have background faded', () => {
      cy.wait(5000);
      cy.get('#folder-list-study1revisionDev2e').click();
      cy.get('[data-cy=right-button-quickactions]').click();
      cy.wait(5000);
      cy.get('#env-selector-DEVELOPMENT').click();
      cy.get('#folder-study1revisionDev2e').click();
      cy.get('#folder-list-study1revisionDev2e > .card-area')
        .should('have.css', 'background-color')
        .and('eq', 'rgba(53, 55, 74, 0.5)');
    });
  });
});

describe('Moving folder test with drag in paused and archived', () => {
  const aliasStudyRevisionList = GetStudyRevisionListDocument.definitions[0].name.value;
  const aliasStudyCollection = StudyCollectionDocument.definitions[0].name.value;
  const aliasUpdateFolderName = UpdateFolderPathDocument.definitions[0].name.value;
  let selectedCard: any;
  let listFolder: any;

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
    cy.saveLocalStorageCache();
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

  describe('Set a card to paused and a card to archived', () => {
    it('Set card to be paused', () => {
      cy.get('#active-study1revisionDev2e').click();
      cy.wait(500).get('[data-cy=icon-pause]').click();
      cy.wait(1000).get('[data-cy=confirmModal-confirmButton]').click();
      cy.wait(5000);
    });
    it('Check card is already in paused', () => {
      cy.get('#archived-pause-study1revisionDev2e').should('exist').click();
    });
    it('Set card to be archived', () => {
      cy.get('#active-study1revisionDev2a').click();
      cy.wait(500).get('[data-cy=icon-archive]').click();
      cy.wait(1000).get('[data-cy=archive-modal] [data-cy=confirmModal-confirmButton]').click();
      cy.wait(5000);
    });
    it('Check card is already in archived', () => {
      cy.get('#archived-pause-study1revisionDev2a').should('exist').click();
    });
  });

  describe('Create folder in paused and moved a card in paused to it', () => {
    it('Select a card in paused study', () => {
      cy.get('#archived-pause-study1revisionDev2e').click();
    });
    it('CLick create add to folder quick action', () => {
      cy.get('[data-cy=icon-add-to-folder]').click();
    });
    it('Fill input folder name', () => {
      cy.get('[data-cy=edit-folder-name]').clear();
      cy.get('[data-cy=edit-folder-name]').type('Testing folder paused');
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
      cy.wait(1000).get('#folder-list-study1revisionDev2e').click();
      cy.wait(1000).get('.all-development-studies').click();
      cy.wait(5000);
    });
  });
  describe('Create folder in archived and moved a card in paused to it', () => {
    it('Select a card in paused study', () => {
      cy.get('#archived-pause-study1revisionDev2a').click();
    });
    it('CLick create add to folder quick action', () => {
      cy.get('[data-cy=icon-add-to-folder]').click();
    });
    it('Fill input folder name', () => {
      cy.get('[data-cy=edit-folder-name]').clear();
      cy.get('[data-cy=edit-folder-name]').type('Testing folder archived');
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
      cy.get('#folder-list-study1revisionDev2a').click();
      cy.wait(1000).get('.all-development-studies').click();
      cy.wait(5000);
    });
  });
  describe('Moving to folder by drag in paused and archived', () => {
    it('Moving a card to folder in paused', () => {
      cy.dragAndDrop(`#archived-pause-study1revisionDev2b`, '#folder-study1revisionDev2e');
      cy.wait(1000);
      cy.get('.all-development-studies').click();
      cy.wait(1000);
    });
    it('Moving a card to folder in archived', () => {
      cy.dragAndDrop(`#archived-pause-study1revisionDev2d`, '#folder-study1revisionDev2a');
      cy.wait(1000);
      cy.get('.all-development-studies').click();
      cy.wait(1000);
    });
  });
});
