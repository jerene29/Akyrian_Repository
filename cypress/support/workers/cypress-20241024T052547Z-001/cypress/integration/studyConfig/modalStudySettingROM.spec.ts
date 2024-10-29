import {
  GetStudyRevisionListDocument,
  StudyCollectionDocument,
  EditStudyRevisionDetailDocument,
} from '../../../src/graphQL/generated/graphql';
import 'cypress-localstorage-commands';

describe('Test all menu card when study is read only', () => {
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

  it('Click a read only study card', () => {
    cy.get('#active-study1revisionDev2c').should('exist');
    cy.get('#active-study1revisionDev2c').click();
  });
  it('Quick actions show up and click study settings icon', () => {
    cy.get('[data-cy=quickactions]').should('exist');
    cy.get('[data-cy=icon-system-study-settings]').should('exist').click();
  });
  it('Check disable click in menu study', () => {
    cy.get('[data-cy=textfield-container-study-organization]').should(
      'have.css',
      'pointer-events',
      'none',
    );
    cy.get('#btn-submit').should('have.css', 'pointer-events', 'none');
  });
  it('Check disable click in menu reasons', () => {
    cy.get('[data-cy=menu-item-reason]').click().wait(1000);
    cy.get('[data-cy=edit-card-visitDidNotOccurReasons]').click();
    cy.get('[data-cy=edit-card-visitDidNotOccurReasons]').should(
      'have.css',
      'cursor',
      'not-allowed',
    );
  });
  it('Check disable click in menu visits', () => {
    cy.get('[data-cy=menu-item-visit]').click().wait(1000);
    cy.get('[data-cy=edit-card-templateScreeningRev2cDev]').click();
    cy.get('[data-cy=edit-card-templateScreeningRev2cDev]').should(
      'have.css',
      'cursor',
      'not-allowed',
    );
  });
  it('Check disable click in menu forms', () => {
    cy.get('[data-cy=menu-item-form]').click().wait(1000);
    cy.get('[data-cy=edit-card-consentRev2cDevId1]').click();
    cy.get('[data-cy=edit-card-consentRev2cDevId1]').should('have.css', 'cursor', 'not-allowed');
  });
});
