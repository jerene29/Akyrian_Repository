import {
  GetFormFieldGroupDocument,
  GetStudyRevisionListDocument,
  StudyCollectionDocument,
} from '../../../src/graphQL/generated/graphql';

describe('Test for Modal Setting - Question', () => {
  const aliasStudyRevisionList = GetStudyRevisionListDocument.definitions[0].name.value;
  const aliasStudyCollection = StudyCollectionDocument.definitions[0].name.value;
  const aliasFFG = GetFormFieldGroupDocument.definitions[0].name.value;

  let dataFFG: any;

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

  // beforeEach(() => {
  //     cy.wait(500);
  //     cy.restoreLocalStorage();
  //     cy.wait(500);
  // });

  // afterEach(() => {
  //     cy.wait(500);
  //     cy.saveLocalStorage();
  //     cy.wait(500);
  // });

  describe('Question Cards - Details UI', () => {
    it('Select Production Env', () => {
      cy.get('#env-selector-PRODUCTION').click();
    });
    it('Select study card', () => {
      cy.get('#active-testRevisionId1').click();
    });
    it('Select icon study setting', () => {
      cy.get('[data-cy=icon-system-study-settings]').click();
      cy.wait(5000);
    });
    it('open modal setting - question and check all content', () => {
      cy.wait(2000);
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasFFG) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=menu-item-question]').click();
      cy.wait(`@${aliasFFG}`).then((result) => {
        if (result?.response?.statusCode === 200) {
          dataFFG = result.response.body.data.formFieldGroups.slice(0, 21);
          cy.checkDetailQuestion(dataFFG);
          cy.wait(4000);
          cy.checkSearchQuestion(dataFFG);
        }
      });
      cy.wait(1000);
    });
  });
});
