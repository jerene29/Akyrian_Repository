import {
  GetStudyRevisionListDocument,
  StudyCollectionDocument,
  UpdateStudyRevisionStatusDocument,
} from '../../../src/graphQL/generated/graphql';
import 'cypress-localstorage-commands';

describe('Archive study test', () => {
  const aliasStudyRevisionList = GetStudyRevisionListDocument.definitions[0].name.value;
  const aliasStudyCollection = StudyCollectionDocument.definitions[0].name.value;
  const aliasArchive = UpdateStudyRevisionStatusDocument.definitions[0].name.value;
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
          (study) => study.id === 'study1revisionDev1a',
        )[0];
      }
    });
    cy.waitForReact();
  });

  beforeEach(() => {
    cy.waitForReact();
    cy.restoreLocalStorageCache();
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  describe('Archive a study', () => {
    it('Select a card', () => {
      cy.get('#active-study1revisionDev2a').click();
    });
    it('Select quick action archive', () => {
      cy.get('[data-cy=icon-archive]').click();
    });
    it('Check modal archive content', () => {
      cy.get('[data-cy=archive-modal]').should('exist');
      cy.get('[data-cy=confirmation-modal-title]').contains(
        'Are you sure you want to archive this study?',
      );
      cy.get('[data-cy=confirmation-modal-desc]').contains(
        'If you wish to unarchive this study, please contact support',
      );
    });
    it('Click archive button', () => {
      cy.get('[data-cy=confirmModal-confirmButton]').should('have.text', 'Archive');
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasArchive) {
          req.alias = req.body.operationName;
        }
        if (req.body.operationName === aliasStudyRevisionList) {
          req.alias = req.body.operationName;
        }
        if (req.body.operationName === aliasStudyCollection) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=confirmModal-confirmButton]').click();
      cy.wait(`@${aliasArchive}`);
      cy.wait(`@${aliasStudyRevisionList}`);
      cy.wait(`@${aliasStudyCollection}`);
    });
  });

  describe('Check card that moved to archived', () => {
    it('Select a card in archived group', () => {
      cy.scrollToElement('#archived-pause-study1revisionDev2a').click();
    });
  });
});
