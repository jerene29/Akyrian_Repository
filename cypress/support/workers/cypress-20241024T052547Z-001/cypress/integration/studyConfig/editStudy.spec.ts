import {
  GetStudyRevisionListDocument,
  PushRevisionToNextEnvDocument,
  StudyCollectionDocument,
  CloneStudyRevisionDocument,
} from '../../../src/graphQL/generated/graphql';
import 'cypress-localstorage-commands';

describe('Test Edit Study in prod', () => {
  const aliasStudyRevisionList = GetStudyRevisionListDocument.definitions[0].name.value;
  const aliasStudyCollection = StudyCollectionDocument.definitions[0].name.value;
  const aliasCloneStudy = CloneStudyRevisionDocument.definitions[0].name.value;
  const aliasPushNextEnv = PushRevisionToNextEnvDocument.definitions[0].name.value;
  let resultPushToEnv: any;

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
    cy.wait(500);
    cy.restoreLocalStorageCache();
    cy.wait(500);
  });

  afterEach(() => {
    cy.wait(500);
    cy.saveLocalStorageCache();
    cy.wait(500);
  });

  it('Select a study card in dev and push to staging', () => {
    cy.get('#active-study1revisionDev2e').click();
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasStudyRevisionList) {
        req.alias = req.body.operationName;
      }
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
    cy.wait(`@${aliasStudyRevisionList}`);
    cy.wait(1000);
  });
  it('Check card that pushed in staging and push to uat', () => {
    cy.get('#env-selector-STAGING').click();
    cy.get(`#active-${resultPushToEnv}`).click();
    cy.get(`#active-${resultPushToEnv}`).contains('v.2.e');
    cy.wait(1000);
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasStudyRevisionList) {
        req.alias = req.body.operationName;
      }
      if (req.body.operationName === aliasPushNextEnv) {
        req.alias = req.body.operationName;
      }
    });
    cy.get('[data-cy=right-button-quickactions]').click();
    cy.wait(`@${aliasPushNextEnv}`).then((res) => {
      if (res.response?.statusCode === 200) {
        resultPushToEnv = res.response?.body.data.pushRevisionToNextEnv.id;
      }
    });
    cy.wait(`@${aliasStudyRevisionList}`);
  });
  it('Check card that pushed in uat', () => {
    cy.get('#env-selector-UAT').click();
    cy.get(`#active-${resultPushToEnv}`).click();
    cy.get(`#active-${resultPushToEnv}`).contains('v.2.e');
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasStudyRevisionList) {
        req.alias = req.body.operationName;
      }
      if (req.body.operationName === aliasPushNextEnv) {
        req.alias = req.body.operationName;
      }
    });
    cy.get('[data-cy=right-button-quickactions]').click();
    cy.wait(`@${aliasPushNextEnv}`).then((res) => {
      if (res.response?.statusCode === 200) {
        resultPushToEnv = res.response?.body.data.pushRevisionToNextEnv.id;
      }
    });
    cy.wait(`@${aliasStudyRevisionList}`);
  });
  it('Check card that pushed in prod and edit the study', () => {
    cy.get('#env-selector-PRODUCTION').click();
    cy.get(`#active-${resultPushToEnv}`).click();
    cy.get(`#active-${resultPushToEnv}`).contains('v.2.e');
  });
  it('Check quick action and Click edit study', () => {
    cy.wait(500);
    cy.get('#quick-actions-component').should('exist');
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasCloneStudy) {
        req.alias = req.body.operationName;
      }
    });
    cy.get('[data-cy=btn-edit-study]').click();
    cy.wait(`@${aliasCloneStudy}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        const newId = result.response.body.data.cloneStudyRevision.id;
        cy.url().should('include', `/study/${newId}`);
        cy.wait(2000);
        cy.get('[data-cy=header-logo]').click();
        cy.wait(1000);
        cy.get('#env-selector-DEVELOPMENT').click();
        cy.wait(1000);
        cy.get(`#active-${newId}`).click();
        cy.wait(500);
        cy.get(`#active-${newId}`).contains('v.3.a');
      }
    });
  });
});
