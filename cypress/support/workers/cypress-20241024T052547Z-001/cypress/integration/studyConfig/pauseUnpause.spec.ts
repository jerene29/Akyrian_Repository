import {
  GetStudyRevisionListDocument,
  StudyCollectionDocument,
  PushRevisionToNextEnvDocument,
} from '../../../src/graphQL/generated/graphql';
import 'cypress-localstorage-commands';
import { mockUserDataAdmin } from '../../../src/constant/testFixtures';

describe('Pause and Unpause test', () => {
  const aliasStudyRevisionList =
    GetStudyRevisionListDocument.definitions[0].name.value;
  const aliasStudyCollection =
    StudyCollectionDocument.definitions[0].name.value;
  const aliasPushNextEnv =
    PushRevisionToNextEnvDocument.definitions[0].name.value;

  let allStudyRevisionList: any = [];
  let studyEnvCard: any;
  let studyConfigList = [];
  let studyCollection: any = [];
  let pausedStudies: any;
  let resultPushToEnvId: any;

  before(() => {
    cy.reseedDB();
    cy.clearLocalStorageSnapshot();
    cy.fillInloginAsForm(mockUserDataAdmin);
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
    cy.wait(`@${aliasStudyRevisionList}`).then((res) => {
      if (res.response?.statusCode === 200) {
        allStudyRevisionList =
          res.response.body.data.studyRevisionList.studyRevisions;
        studyEnvCard = allStudyRevisionList.filter(
          (study) => study.environment === 'DEVELOPMENT',
        )[0];
      }
    });
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

  describe('Pause study at development environment', () => {
    it('Select a study card', () => {
      cy.get(`#active-study1revisionDev2e`).click();
      cy.get('[data-cy=quickactions]').should('exist');
    });
    it('Select pause quick action', () => {
      cy.get('[data-cy=icon-pause]').should('exist');
      cy.get('[data-cy=icon-pause]').click();
    });
    it('Check modal pause content', () => {
      cy.get('[data-cy=confirmation-modal-title]').should(
        'have.text',
        'Are you sure you want to pause this study?',
      );
      cy.get('[data-cy=confirmation-modal-desc]').should(
        'have.text',
        `You can continue the study again by going to 'Paused' section`,
      );
    });
    it('Click pause button', () => {
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasStudyRevisionList) {
          req.alias = req.body.operationName;
        }
        if (req.body.operationName === aliasStudyCollection) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=confirmModal-confirmButton]').click();
      cy.wait(`@${aliasStudyCollection}`);
      cy.wait(`@${aliasStudyRevisionList}`).then((res) => {
        if (res.response?.statusCode === 200) {
          allStudyRevisionList =
            res.response.body.data.studyRevisionList.studyRevisions;
          cy.wrap(allStudyRevisionList).each((study) => {
            if (study.id === studyEnvCard.id) {
              cy.get(`#archived-pause-${study.id}`).click();
              studyEnvCard = study;
            }
          });
        }
      });
    });
  });

  describe('Unpause study at development environment', () => {
    it('Select a study card', () => {
      cy.get(`#archived-pause-study1revisionDev2e`).click();
      cy.get('[data-cy=quickactions]').should('exist');
    });
    it('Select unpause quick action', () => {
      const unpauseButton = cy.get('[data-cy=icon-system-start]');
      unpauseButton.should('exist');
      unpauseButton.click();
    });
    it('Click unpause button', () => {
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasStudyRevisionList) {
          req.alias = req.body.operationName;
        }
        if (req.body.operationName === aliasStudyCollection) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=confirmModal-confirmButton]').click();
      cy.wait(`@${aliasStudyCollection}`);
      cy.wait(`@${aliasStudyRevisionList}`).then((res) => {
        if (res.response?.statusCode === 200) {
          allStudyRevisionList =
            res.response.body.data.studyRevisionList.studyRevisions;
          cy.wrap(allStudyRevisionList).each((study) => {
            if (study.id === studyEnvCard.id) {
              cy.get(`#active-study1revisionDev2e`).click();
              studyEnvCard = study;
            }
          });
        }
      });
    });
  });

  describe('Pause study at staging environment', () => {
    it('Select staging environment', () => {
      cy.get('#env-selector-STAGING').click();
      studyEnvCard = allStudyRevisionList.filter(
        (study) => study.environment === 'STAGING',
      )[0];
    });
    it('Select a study card', () => {
      cy.get(`#active-study1revisionStaging2c`).click();
      cy.get('[data-cy=quickactions]').should('exist');
    });
    it('Select pause quick action', () => {
      cy.get('[data-cy=icon-pause]').should('exist');
      cy.get('[data-cy=icon-pause]').click();
    });
    it('Check modal pause content', () => {
      cy.get('[data-cy=confirmation-modal-title]').should(
        'have.text',
        'Are you sure you want to pause this study?',
      );
      cy.get('[data-cy=confirmation-modal-desc]').should(
        'have.text',
        `You can continue the study again by going to 'Paused' section`,
      );
    });
    it('Click pause button', () => {
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasStudyRevisionList) {
          req.alias = req.body.operationName;
        }
        if (req.body.operationName === aliasStudyCollection) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=confirmModal-confirmButton]').click();
      cy.wait(`@${aliasStudyCollection}`);
      cy.wait(`@${aliasStudyRevisionList}`).then((res) => {
        if (res.response?.statusCode === 200) {
          allStudyRevisionList =
            res.response.body.data.studyRevisionList.studyRevisions;
          cy.wrap(allStudyRevisionList).each((study) => {
            if (study.id === studyEnvCard.id) {
              cy.get(`#archived-pause-study1revisionStaging2c`).click();
              studyEnvCard = study;
            }
          });
        }
      });
    });
  });

  describe('Unpause study at staging environment', () => {
    it('Select a study card', () => {
      cy.get(`#archived-pause-study1revisionStaging2c`).click();
      cy.get('[data-cy=quickactions]').should('exist');
    });
    it('Select unpause quick action', () => {
      const unpauseButton = cy.get('[data-cy=icon-system-start]');
      unpauseButton.should('exist');
      unpauseButton.click();
    });
    // it('Check modal pause content', () => {
    //     cy.get('[data-cy=confirmation-modal-title]').should('have.text', 'Are you sure you want to pause this study?')
    //     cy.get('[data-cy=confirmation-modal-desc]').should('have.text', `You can continue the study again by going to 'Paused' section`)
    // })
    it('Click unpause button', () => {
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasStudyRevisionList) {
          req.alias = req.body.operationName;
        }
        if (req.body.operationName === aliasStudyCollection) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=confirmModal-confirmButton]').click();
      cy.wait(`@${aliasStudyCollection}`);
    });
    it('Push study to uat', () => {
      cy.get(`#active-study1revisionStaging2c`).click();
      cy.wait(500);
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
          console.log(res.response?.body.data.pushRevisionToNextEnv, '<<<');
          resultPushToEnvId = res.response?.body.data.pushRevisionToNextEnv.id;
        }
      });
      cy.wait(`@${aliasStudyRevisionList}`);
      cy.wait(1000);
    });
  });

  describe('Pause study at uat environment', () => {
    it('Select uat environment', () => {
      cy.get('#env-selector-UAT').click();
      studyEnvCard = allStudyRevisionList.filter(
        (study) => study.environment === 'UAT',
      )[0];
    });
    it('Select a study card', () => {
      cy.get(`#active-${resultPushToEnvId}`).click();
      cy.get('[data-cy=quickactions]').should('exist');
    });
    it('Select pause quick action', () => {
      cy.get('[data-cy=icon-pause]').should('exist');
      cy.get('[data-cy=icon-pause]').click();
    });
    it('Check modal pause content', () => {
      cy.get('[data-cy=confirmation-modal-title]').should(
        'have.text',
        'Are you sure you want to pause this study?',
      );
      cy.get('[data-cy=confirmation-modal-desc]').should(
        'have.text',
        `You can continue the study again by going to 'Paused' section`,
      );
    });
    it('Click pause button', () => {
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasStudyRevisionList) {
          req.alias = req.body.operationName;
        }
        if (req.body.operationName === aliasStudyCollection) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=confirmModal-confirmButton]').click({ force: true });
      cy.wait(`@${aliasStudyCollection}`);
      cy.wait(`@${aliasStudyRevisionList}`).then((res) => {
        if (res.response?.statusCode === 200) {
          allStudyRevisionList =
            res.response.body.data.studyRevisionList.studyRevisions;
          cy.wrap(allStudyRevisionList).each((study) => {
            if (study.id === studyEnvCard.id) {
              cy.get(`#archived-pause-${resultPushToEnvId}`).click();
              studyEnvCard = study;
            }
          });
        }
      });
    });
  });

  describe('Unpause study at uat environment', () => {
    it('Select a study card', () => {
      cy.get(`#archived-pause-${resultPushToEnvId}`).click();
      cy.get('[data-cy=quickactions]').should('exist');
    });
    it('Select unpause quick action', () => {
      const unpauseButton = cy.get('[data-cy=icon-system-start]');
      unpauseButton.should('exist');
      unpauseButton.click();
    });
    it('Check modal pause content', () => {
      cy.get('[data-cy=confirmation-modal-title]').should(
        'have.text',
        'Are you sure you want to reactivate the study?',
      );
      cy.get('[data-cy=confirmation-modal-desc]').should(
        'have.text',
        `Unpausing this study means that this study will be accessible to site and monitor user again`,
      );
    });
    it('Click unpause button', () => {
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasStudyRevisionList) {
          req.alias = req.body.operationName;
        }
        if (req.body.operationName === aliasStudyCollection) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=confirmModal-confirmButton]').click();
      cy.wait(`@${aliasStudyCollection}`);
      cy.wait(`@${aliasStudyRevisionList}`);
    });
  });

  describe('Pause study at production environment', () => {
    it('Select production environment', () => {
      cy.get('#env-selector-PRODUCTION').click();
      studyEnvCard = allStudyRevisionList.filter(
        (study) => study.environment === 'PRODUCTION',
      )[0];
    });
    it('Select a study card', () => {
      cy.get(`#active-testRevisionId1`).click();
      cy.get('[data-cy=quickactions]').should('exist');
    });
    it('Select pause quick action', () => {
      cy.get('[data-cy=icon-pause]').should('exist');
      cy.get('[data-cy=icon-pause]').click();
    });
    it('Check modal pause content', () => {
      cy.get('[data-cy=confirmation-modal-title]').should(
        'have.text',
        'Are you sure you want to pause this study?',
      );
      cy.get('[data-cy=confirmation-modal-desc]').should(
        'have.text',
        `You can continue the study again by going to 'Paused' section`,
      );
    });
    it('Click pause button', () => {
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasStudyRevisionList) {
          req.alias = req.body.operationName;
        }
        if (req.body.operationName === aliasStudyCollection) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=confirmModal-confirmButton]').click();
      cy.wait(`@${aliasStudyCollection}`);
      cy.wait(`@${aliasStudyRevisionList}`).then((res) => {
        if (res.response?.statusCode === 200) {
          allStudyRevisionList =
            res.response.body.data.studyRevisionList.studyRevisions;
          cy.wrap(allStudyRevisionList).each((study) => {
            if (study.id === studyEnvCard.id) {
              cy.get(`#archived-pause-testRevisionId1`).click();
              studyEnvCard = study;
            }
          });
        }
      });
    });
  });

  describe('Unpause study at production environment', () => {
    it('Select a study card', () => {
      cy.get(`#archived-pause-testRevisionId1`).click();
      cy.get('[data-cy=quickactions]').should('exist');
    });
    it('Select unpause quick action', () => {
      const unpauseButton = cy.get('[data-cy=icon-system-start]');
      unpauseButton.should('exist');
      unpauseButton.click();
    });
    // it('Check modal pause content', () => {
    //     cy.get('[data-cy=confirmation-modal-title]').should('have.text', 'Are you sure you want to pause this study?')
    //     cy.get('[data-cy=confirmation-modal-desc]').should('have.text', `You can continue the study again by going to 'Paused' section`)
    // })
    it('Click unpause button', () => {
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasStudyRevisionList) {
          req.alias = req.body.operationName;
        }
        if (req.body.operationName === aliasStudyCollection) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=confirmModal-confirmButton]').click();
      cy.wait(`@${aliasStudyCollection}`);
    });
  });

  describe('Paused study should not have add patient in site flow', () => {
    it('Select development env', () => {
      cy.wait(1000).get('#env-selector-DEVELOPMENT').click();
    });
    it('Select a study card', () => {
      cy.get(`#active-study1revisionDev2e`).click();
      cy.get('[data-cy=quickactions]').should('exist');
    });
    it('Select pause quick action', () => {
      cy.get('[data-cy=icon-pause]').should('exist');
      cy.get('[data-cy=icon-pause]').click();
    });
    it('Check modal pause content', () => {
      cy.get('[data-cy=confirmation-modal-title]').should(
        'have.text',
        'Are you sure you want to pause this study?',
      );
      cy.get('[data-cy=confirmation-modal-desc]').should(
        'have.text',
        `You can continue the study again by going to 'Paused' section`,
      );
    });
    it('Click pause button', () => {
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasStudyRevisionList) {
          req.alias = req.body.operationName;
        }
        if (req.body.operationName === aliasStudyCollection) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=confirmModal-confirmButton]').click();
      cy.wait(`@${aliasStudyCollection}`);
      cy.wait(`@${aliasStudyRevisionList}`);
      cy.wait(3000);
    });
    it('Go to site flow and select paused card', () => {
      cy.get('[data-cy=header-user-avatar]').first().click();
      cy.get('[data-cy=toggle-button-site]')
        .contains('Go to Site Flow')
        .click();
      cy.wait(5000);
      cy.get('[data-test=study1revisionDev2e]').click();
      cy.wait(3000);
    });
    it('Check add patient shoult not exist', () => {
      cy.get('#add-patient-icon').should('not.exist');
    });
  });
});
