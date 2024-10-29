import {
  GetStudyRevisionListDocument,
  IStudyEnvironment,
  StudyCollectionDocument,
  UpdateFolderPathDocument,
} from '../../../src/graphQL/generated/graphql';
import 'cypress-localstorage-commands';

describe('Moving folder test no drag', () => {
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
    it('Select two cards', () => {
      cy.get('#active-study1revisionDev2a').click();
      cy.get('#active-study1revisionDev2c').click({ ctrlKey: true });
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
      cy.get('.all-development-studies').click();
    });
  });

  describe('Moving folder by modal', () => {
    it('Click a card', () => {
      cy.get('#active-study1revisionDev1a').click();
      cy.get('#active-study1revisionDev1b').click({ ctrlKey: true });
    });
    it('Click move to folder quick action', () => {
      cy.get('[data-cy=icon-move-to-folder]').click();
    });
    it('Check modal content', () => {
      cy.get('[data-cy=folder-modal-title]').should('have.text', 'Move to Folder');
      cy.wrap(listFolder).each((el) => {
        cy.get(`#folder-modal-${el.id}`).should('exist');
        cy.get(`#folder-modal-${el.id}`).contains(`${el.path.slice(1)}`);
        cy.get(`#folder-modal-${el.id}`).click();
      });
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
    });
  });
});

describe('Create new folder in folder modal', () => {
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

  it('Click a card', () => {
    cy.get('#active-study1revisionDev1a').click();
    cy.get('#active-study1revisionDev1b').click({ ctrlKey: true });
  });
  it('Click move to folder quick action', () => {
    cy.get('[data-cy=icon-move-to-folder]').click();
  });
  it('Click create new folder button', () => {
    cy.get('[data-cy=button-create-new-folder]').click();
    cy.wait(500);
  });
  it('Fill input folder name', () => {
    cy.get('[data-cy=edit-folder-name]').clear();
    cy.get('[data-cy=edit-folder-name]').type('testing-folder2');
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
    cy.get('.all-development-studies').click();
  });
});

describe('Moving folder test by click in paused or archived', () => {
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
    cy.saveLocalStorage();
    cy.waitForReact();
    cy.wait(`@${aliasStudyCollection}`);
    cy.wait(`@${aliasStudyRevisionList}`);
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

  describe('Moving card by folder modal in paused', () => {
    it('Move a card into a folder by folder ', () => {
      cy.get('#archived-pause-study1revisionDev2b').click();
      cy.wait(500).get('[data-cy=icon-move-to-folder]').click();
      cy.wait(500).get('#folder-modal-study1revisionDev2e').should('exist').click();
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
      cy.get('#folder-list-study1revisionDev2b').click();
      cy.wait(1000).get('.all-development-studies').click();
      cy.wait(5000);
    });
  });

  describe('Moving card by folder modal in archived', () => {
    it('Move a card into a folder by folder ', () => {
      cy.get('#archived-pause-study1revisionDev2d').click();
      cy.wait(500).get('[data-cy=icon-move-to-folder]').click();
      cy.wait(500).get('#folder-modal-study1revisionDev2a').should('exist').click();
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
      cy.get('#folder-list-study1revisionDev2d').click();
    });
  });
});

describe('Error for folder with same name', () => {
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
    it('Create folder with same name', () => {
      cy.get('#active-study1revisionDev2c').click();
      cy.wait(1000).get('[data-cy=icon-add-to-folder]').click();
      cy.get('[data-cy=edit-folder-name]').clear();
      cy.get('[data-cy=edit-folder-name]').type('testing-folder');
      cy.wait(1000).get('[data-cy=study-setting-save-button]').click();
      cy.get('[data-cy=error-alert]').should('exist').contains('Folder name already exist');
    });
  });
});
