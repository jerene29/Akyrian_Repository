import {
  GetStudyRevisionListDocument,
  StudyCollectionDocument,
  EditStudyDetailDocument,
} from '../../../src/graphQL/generated/graphql';
import 'cypress-localstorage-commands';

describe('Test add and rename study', () => {
  const aliasStudyRevisionList = GetStudyRevisionListDocument.definitions[0].name.value;
  const aliasStudyCollection = StudyCollectionDocument.definitions[0].name.value;
  const aliasRename = EditStudyDetailDocument.definitions[0].name.value;
  let selectedCard: any;

  before(() => {
    cy.reseedDB();
    cy.clearLocalStorageSnapshot();
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
    cy.wait(`@${aliasStudyRevisionList}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        selectedCard = result.response.body.data.studyRevisionList.studyRevisions.filter(
          (study) => study.id === 'study1revisionDev2e',
        )[0];
      }
    });
    cy.waitForReact();
  });

  beforeEach(() => {
    cy.wait(500);
    cy.waitForReact();
    cy.restoreLocalStorageCache();
    cy.wait(500);
  });

  afterEach(() => {
    cy.wait(500);
    cy.saveLocalStorageCache();
    cy.wait(500);
  });

  describe('Add study modal', () => {
    it('Click a card', () => {
      cy.get('#active-study1revisionDev2e').should('exist');
      cy.get('#active-study1revisionDev2e').click();
    });
    it('Quick actions show up', () => {
      cy.get('[data-cy=quickactions]').should('exist');
    });
    it('Click new study in quick actions', () => {
      cy.get('[data-cy=icon-clone]').should('exist');
      cy.get('[data-cy=icon-clone]').click({ force: true });
      cy.get('#create-study-form').should('be.visible');
      cy.get('.icon-close').click();
      cy.wait(1000);
    });
  });

  describe('Rename modal', () => {
    it('Click a card', () => {
      cy.get('#active-study1revisionDev2e').should('exist');
      cy.get('#active-study1revisionDev2e').click();
    });
    it('Quick actions show up', () => {
      cy.get('[data-cy=quickactions]').should('exist');
    });
    it('Click rename in quick actions', () => {
      cy.get('[data-cy=icon-pencil-edit]').should('exist');
      cy.get('[data-cy=icon-pencil-edit]').click();
      cy.get('[data-cy=rename-modal]').should('be.visible');
    });
    it('Check rename modal content', () => {
      cy.get('[data-cy=title-rename-modal]').contains(`Rename Study - ${selectedCard.study.name}`);
      cy.get('[data-cy=instruction-rename-modal]').contains('Please enter new name for the study');
    });

    it('Success rename modal', () => {
      cy.get('[data-cy=textfield-container-rename-modal] > input').clear({ force: true });
      cy.get('[data-cy=textfield-container-rename-modal] > input').type('TEST-RENAME');
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasRename) {
          req.alias = req.body.operationName;
        }
        if (req.body.operationName === aliasStudyRevisionList) {
          req.alias = req.body.operationName;
        }
        if (req.body.operationName === aliasStudyCollection) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=button-submit-noanswer]').click();
      cy.wait(`@${aliasRename}`).then((res) => {
        if (res) {
          cy.get('[data-cy=alert-success]').should('exist');
        }
      });
    });
    it('Check updated rename study name', () => {
      cy.get('#active-study1revisionDev2e').contains('TEST-RENAME');
    });
  });
});
