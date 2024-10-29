import {
  GetPatientListDocument,
  GetVisitListDocument,
  StudyCollectionDocument,
  GetStudyRevisionListDocument,
} from '../../src/graphQL/generated/graphql';
import { mockUserDataAdmin } from '../../src/constant/testFixtures';

const aliasPatientList = GetPatientListDocument.definitions[0].name.value;
const aliasVisitList = GetVisitListDocument.definitions[0].name.value;
const aliasStudyRevList = GetStudyRevisionListDocument.definitions[0].name.value;

describe('Profile Toggle Button existence with user have study config and site flow', () => {
  const aliasStudyCollection = StudyCollectionDocument.definitions[0].name.value;
  before(() => {
    cy.beforeSetup(mockUserDataAdmin);
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasPatientList) {
        req.alias = req.body.operationName;
      }

      if (req.body.operationName === aliasVisitList) {
        req.alias = req.body.operationName;
      }
    });
    cy.visit('/visit');
    cy.wait(`@${aliasPatientList}`);
    cy.wait(`@${aliasVisitList}`);
    cy.waitForReact();
  });

  beforeEach(() => {
    cy.restoreLocalStorageCache();
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  describe('Go to study config', () => {
    it('Select profile and popover', () => {
      cy.get('[data-cy=header-user-popover-trigger]').click();
      cy.get('[data-cy=header-user-popover]').should('exist');
    });
    it('Check button toggle go to study config', () => {
      cy.get('.btn-goto-config-nurse').should('exist');
      cy.get('.btn-goto-config-nurse').should('have.text', 'Go to Study Config');
    });
    it('Click button toggle go to study config', () => {
      cy.get('.btn-goto-config-nurse').click();
    });
    it('Check url study config', () => {
      cy.url().should('include', '/study');
    });
  });

  describe('Go to site flow', () => {
    let lastLogin = {} as any;
    let listSiteRole = [] as any;
    before(() => {
      lastLogin = JSON.parse(localStorage.getItem('userInfo') || '{}');
      listSiteRole = JSON.parse(localStorage.getItem('userStudies') || '[]');
    });
    it('Select profile and popover', () => {
      cy.get('[data-cy=header-user-popover-trigger]').click();
      cy.get('[data-cy=header-user-popover]').should('exist');
    });
    it('Check button toggle go to study config', () => {
      cy.get('.btn-goto-config-nurse').should('exist');
      cy.get('.btn-goto-config-nurse')
        .should('have.text', 'Go to Site Flow')
        .click({ force: true });
      cy.wait(5000);
    });
    it('Check url study config', () => {
      cy.url().should('include', '/dashboard');
      cy.wait(1000);
    });

    it('Logout', () => {
      cy.logout();
    });
  });
});

describe('Profile Toggle Button not exist with user only have study config or site flow', () => {
  describe('User with only site flow', () => {
    before(() => {
      cy.clearLocalStorageSnapshot();
      cy.visit('/login');
      cy.fillInloginAsFormV2({
        email: 'dataentrya@example.com',
      });
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasPatientList) {
          req.alias = req.body.operationName;
        }

        if (req.body.operationName === aliasVisitList) {
          req.alias = req.body.operationName;
        }
      });
      cy.waitForReact();
      cy.visit('/visit');
      cy.wait(`@${aliasPatientList}`);
      cy.wait(`@${aliasVisitList}`);

      it('Select profile and popover', () => {
        cy.get('[data-cy=header-user-popover-trigger]').click();
        cy.get('[data-cy=header-user-popover]').should('exist');
      });
      it('Check button toggle go to study config', () => {
        cy.get('.btn-goto-config-nurse').should('not.exist');
      });
      it('Logout', () => {
        cy.get('[data-cy=logout-text]').click();
        cy.wait(1000);
      });
    });
  });

  describe('User with only study config', () => {
    before(() => {
      cy.clearLocalStorageSnapshot();
      cy.visit('/login');
      cy.fillInloginAsFormV2({
        email: 'baba@example.com',
      });
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasStudyRevList) {
          req.alias = req.body.operationName;
        }
      });
      cy.visit('/study');
      cy.waitForReact();
    });

    describe('Check profile', () => {
      it('Select profile and popover', () => {
        cy.get('[data-cy=header-user-popover-trigger]').click();
        cy.get('[data-cy=header-user-popover]').should('exist');
      });
      it('Check button toggle go to study config', () => {
        cy.get('.btn-goto-config-nurse').should('not.exist');
      });
    });
  });
});
