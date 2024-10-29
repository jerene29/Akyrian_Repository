import {
  GetStudyRevisionListDocument,
  StudyCollectionDocument,
} from '../../../src/graphQL/generated/graphql';
import 'cypress-localstorage-commands';
describe('Export study by quick action', () => {
  const aliasStudyRevisionList = GetStudyRevisionListDocument.definitions[0].name.value;
  const aliasStudyCollection = StudyCollectionDocument.definitions[0].name.value;

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
    cy.wait(`@${aliasStudyRevisionList}`);
    cy.waitForReact();
  });

  beforeEach(() => {
    cy.waitForReact();
    cy.restoreLocalStorageCache();
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  it('Select production environment', () => {
    cy.get('#env-selector-PRODUCTION').click();
  });
  it('Select study card and export in quick action', () => {
    cy.get('#active-testRevisionId1').click();
    cy.wait(500);
    cy.get('[data-cy=icon-export]').click();
  });
  it('can stub print', function () {
    cy.visit('/study/testRevisionId1/export-study', {
      onBeforeLoad: (win) => {
        cy.stub(win, 'print');
      },
    });

    cy.window().then((win) => {
      win.print();

      expect(win.print).to.be.calledOnce;
    });
  });
});
