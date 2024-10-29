import {
  GetStudyRevisionListDocument,
  StudyCollectionDocument,
  PushRevisionToNextEnvDocument,
} from '../../../src/graphQL/generated/graphql';
import 'cypress-localstorage-commands';

describe('Push to Next Environment test', () => {
  const aliasStudyRevisionList = GetStudyRevisionListDocument.definitions[0].name.value;
  const aliasStudyCollection = StudyCollectionDocument.definitions[0].name.value;
  const aliasPushNextEnv = PushRevisionToNextEnvDocument.definitions[0].name.value;
  let initVersionPushStaging: any;
  let initVersionPushUat: any;
  let selectedCard: any;
  let resultPushToEnv: any;
  let previousCardId: any;
  let previousId2: any;
  let previousId3: any;
  let previousId: any;
  let cardCheck: any;

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

  describe('Push to Staging from Development environment', () => {
    it('Click a study card', () => {
      cy.get(`#active-study1revisionDev2e`).click();
    });
    it('Check version', () => {
      cy.get(`#active-study1revisionDev2e`).contains('v.2.e');
    });
    it('Check quick action push to staging', () => {
      cy.get('[data-cy=right-button-quickactions]').should('exist');
      cy.get('[data-cy=right-button-quickactions]').should('have.text', 'Push to Staging');
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
          previousId = res.response?.body.data.pushRevisionToNextEnv.id;
          previousCardId = '#active-study1revisionDev2e';
        }
      });
      cy.wait(`@${aliasStudyRevisionList}`);
      cy.wait(1000);
    });
    it('Quick action push to staging should hidden', () => {
      cy.get('#env-selector-DEVELOPMENT').click();
      cy.get(`${previousCardId}`).click();
      cy.get('[data-cy=right-button-quickactions]').should('not.exist');
    });
    it('Check card that pushed in staging', () => {
      cy.get('#env-selector-STAGING').click();
      cy.get(`#active-${resultPushToEnv}`).click();
      cy.get(`#active-${resultPushToEnv}`).contains('v.2.e');
    });
  });

  describe('Push to Uat from Staging environment', () => {
    previousCardId = resultPushToEnv;
    it('Click a study card', () => {
      cy.get(`#active-${resultPushToEnv}`).click();
    });
    it('Check quick action push to uat', () => {
      cy.get('[data-cy=right-button-quickactions]').should('exist');
      cy.get('[data-cy=right-button-quickactions]').should('have.text', 'Push to UAT');
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
          previousId2 = res.response?.body.data.pushRevisionToNextEnv.id;
        }
      });
      cy.wait(`@${aliasStudyRevisionList}`);
    });
    it('Quick action push to uat should hidden', () => {
      cy.get('#env-selector-STAGING').click();
      cy.get(`#active-${previousId}`).click();
      cy.get('[data-cy=right-button-quickactions]').should('not.exist');
    });
    it('Check card that pushed in uat', () => {
      cy.get('#env-selector-UAT').click();
      cy.get(`#active-${resultPushToEnv}`).click();
      cy.get(`#active-${resultPushToEnv}`).contains('v.2.e');
    });
  });

  describe('Push to Production from Uat environment', () => {
    previousCardId = resultPushToEnv;

    it('Click a study card', () => {
      cy.get(`#active-${resultPushToEnv}`).click();
    });
    it('Check quick action push to production', () => {
      cy.get('[data-cy=right-button-quickactions]').should('exist');
      cy.get('[data-cy=right-button-quickactions]').should('have.text', 'Push to Production');
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
          previousId3 = res.response?.body.data.pushRevisionToNextEnv.id;
        }
      });
      cy.wait(`@${aliasStudyRevisionList}`);
    });
    it('Quick action push to prod should hidden', () => {
      cy.get('#env-selector-UAT').click();
      cy.get(`#active-${previousId2}`).click();
      cy.get('[data-cy=right-button-quickactions]').should('not.exist');
    });
    it('Check card that pushed in production', () => {
      cy.get('#env-selector-PRODUCTION').click();
      cy.get(`#active-${resultPushToEnv}`).click();
      cy.get(`#active-${resultPushToEnv}`).contains('v.2.e');
    });
  });

  describe('Check hide quick actions in read only mode study', () => {
    it('Select development environment', () => {
      cy.get('#env-selector-DEVELOPMENT').click();
    });
    it('Select a study card that in read only status', () => {
      cy.get('#active-study1revisionDev2a').click();
    });
    it('Button push should hidden', () => {
      cy.get('[data-cy=right-button-quickactions]').should('not.exist');
    });
    it('Button edit should hidden', () => {
      cy.get('[data-cy=btn-edit-study]').should('not.exist');
    });
    it('Quick action clone should hidden', () => {
      cy.get('[data-cy=icon-version]').should('not.exist');
    });
    it('Quick action rename should hidden', () => {
      cy.get('[data-cy=icon-pencil-edit]').should('not.exist');
    });
    it('Quick action pause should hidden', () => {
      cy.get('[data-cy=icon-pause]').should('not.exist');
    });
    it('Quick action unpause should hidden', () => {
      cy.get('[data-cy=unpause]').should('not.exist');
    });
  });
});
