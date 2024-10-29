import {
  GetStudyRevisionListDocument,
  StudyCollectionDocument,
  EditStudyRevisionDetailDocument,
} from '../../../src/graphQL/generated/graphql';
import 'cypress-localstorage-commands';
import { d } from '../../helper';

describe('Hidden visit test', () => {
  const aliasStudyRevisionList = GetStudyRevisionListDocument.definitions[0].name.value;
  const aliasStudyCollection = StudyCollectionDocument.definitions[0].name.value;
  const aliasRename = EditStudyRevisionDetailDocument.definitions[0].name.value;
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
    cy.waitForReact();
    cy.wait(500);
    cy.restoreLocalStorageCache();
    cy.wait(500);
  });

  afterEach(() => {
    cy.wait(500);
    cy.saveLocalStorageCache();
    cy.wait(500);
  });

  describe('Make a hidden visit', () => {
    it('Click a card', () => {
      cy.get('#active-study1revisionDev2e').should('exist');
      cy.get('#active-study1revisionDev2e').click();
    });
    it('Click edit study', () => {
      cy.get('[data-cy=btn-edit-study]').click();
    });
    it('Click add visit', () => {
      cy.get('#add-visit-icon').click();
    });
    it('Fill form to make hidden visit', () => {
      cy.get(d`visitName`)
        .clear()
        .type('testing hidden visit');
      cy.get(
        '[data-cy=selectVisitType] > .ant-select > .ant-select-selector > .ant-select-selection-item',
      ).type('${downarrow}{enter}');
    });
    it('Submit add visit', () => {
      cy.get('#button-add-visit').click();
      cy.get('[data-cy=alert-success]').contains('New Visit has been added');
    });
  });
});
