import 'cypress-localstorage-commands';

import {
  GetRoleConfigStudyListDocument,
  GetRoleConfigDocument,
  EditBulkRolePrivilegesDocument,
} from '../../../src/graphQL/generated/graphql';

import * as path from 'path';

const downloadsFolder = Cypress.config('downloadsFolder');
let envString = '';
if (!Cypress.env('TESTRUNNER_ENV')) {
  envString = '.csv';
}

const mockFilteredStudy = [{ name: 'CVD-19' }, { name: 'EBOLA' }];

const mockFilteredRole = [{ name: 'Test' }, { name: 'Admin' }];
const dummyRoleName1 = 'Super Admin 1 test';
const dummyInvalidName = 'asd';
const dummyRoleName2 = 'Super Admin 2';
const dummyRoleName3 = 'Super Admin 3';
const dummyRoleName2Duplicated = 'super admin 2';

describe('Role Config Landing Page', () => {
  const aliasRoleConfigStudyList = GetRoleConfigStudyListDocument.definitions[0].name.value;
  const aliasRoleConfig = GetRoleConfigDocument.definitions[0].name.value;
  const aliasEditRolePrivileges = EditBulkRolePrivilegesDocument.definitions[0].name.value;

  before(() => {
    cy.task('deleteFolder', downloadsFolder);
    cy.clearLocalStorageSnapshot();
    cy.reseedDB();
    cy.visit('/login');
    cy.waitForReact();
    cy.fillInloginAsFormV2({
      email: 'admin@example.com',
    });
    cy.saveLocalStorage();

    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasRoleConfigStudyList) {
        req.alias = req.body.operationName;
      }
    });

    cy.waitForReact();
    cy.visit('/study');
    cy.get('[data-cy=header-btn-config]').should('exist').click();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  it('Should render landing page of role config', () => {
    cy.get('[data-cy=role-config-tab]').click();
    cy.wait(`@${aliasRoleConfigStudyList}`);
    cy.get('[data-cy=landing-role-config]').should('exist');
    cy.get('[data-cy=role-config-study-list]').should('exist');
  });

  it('Should filter study by study names', () => {
    cy.get('[data-cy=role-config-study-search-bar-icon]').should('exist').click();
    cy.get('[data-cy=role-config-study-search-bar-textfield]')
      .should('exist')
      .type(mockFilteredStudy[0].name, { force: true });
    cy.get('[data-cy=sl-studyTestId1]').contains(mockFilteredStudy[0].name);
    cy.get('[data-cy=role-config-study-search-bar-textfield]').clear().blur();
    cy.get('[data-cy=role-config-study-search-bar-icon]').should('exist').click();
    cy.get('[data-cy=role-config-study-search-bar-textfield]')
      .should('exist')
      .type(mockFilteredStudy[1].name, { force: true });
    cy.get('[data-cy=sl-studyTestId2]').contains(mockFilteredStudy[1].name);
    cy.get('[data-cy=role-config-study-search-bar-textfield]').clear().blur();
  });

  it('Should render role config table when study clicked', () => {
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasRoleConfig) {
        req.alias = req.body.operationName;
      }
    });
    cy.get('[data-cy=sl-studyTestId2]').should('exist').click();
    cy.wait(`@${aliasRoleConfig}`);
    cy.get('[data-cy=table-role-config]').should('exist');
  });

  it('Should filter role by role names', () => {
    cy.get('[data-cy=role-config-role-search-bar-icon]').should('exist').click();
    cy.get('[data-cy=role-config-role-search-bar-textfield]')
      .should('exist')
      .type(mockFilteredRole[0].name, { force: true });
    cy.get('.ant-empty').should('exist');
    cy.get('[data-cy=role-config-role-search-bar-textfield]').clear().blur();
    cy.get('[data-cy=role-config-role-search-bar-icon]').should('exist').click();
    cy.get('[data-cy=role-config-role-search-bar-textfield]')
      .should('exist')
      .type(mockFilteredRole[1].name, { force: true });
    cy.get('.ant-row').contains(mockFilteredRole[1].name);
    cy.get('[data-cy=role-config-role-search-bar-textfield]').clear().blur();
  });

  describe('Add a new Role', () => {
    it('Should disable Add New Role button and Floating button when adding a new Role', () => {
      cy.get('[data-cy=rc-add-new]').should('exist').click();
      cy.get('[data-cy=rc-float-btn]').should('be.disabled');
      cy.get('[data-cy=rc-add-new]').should('be.disabled');
      cy.get('[data-cy=rc-quick-action]').should('be.visible');
    });

    it('Should disable submit button when roleName <= 5 char and selected privilege <= 0', () => {
      cy.get('[data-cy=rc-submit-btn').should('be.disabled');
    });

    it('Should disable submit button when roleName <= 5 char and selected privilege >= 1', () => {
      cy.get('[data-cy=rc-role-name]').should('exist').clear();
      cy.get('[data-cy=rc-UserAdmin').check();
      cy.get('[data-cy=rc-submit-btn').should('be.disabled');
      cy.get('[data-cy=rc-role-name]').should('exist').clear().type(dummyInvalidName);
      cy.get('[data-cy=rc-submit-btn').should('be.disabled');
      cy.get('[data-cy=rc-UserAdmin').uncheck();
    });

    it('Should disable submit button when roleName >= 5 char and selected privilege <= 0', () => {
      cy.get('[data-cy=rc-role-name]').should('exist').clear().type(dummyRoleName1);
      cy.get('[data-cy=rc-submit-btn').should('be.disabled');
    });

    it('Should enable submit button when roleName >= 5 char and selected privilege >= 1', () => {
      cy.get('[data-cy=rc-role-name]').should('exist').clear().type(dummyRoleName1);
      cy.get('[data-cy=rc-UserAdmin').check();
      cy.get('[data-cy=rc-submit-btn').should('be.enabled');
      cy.get('[data-cy=rc-UserAdmin').uncheck();
      cy.get('[data-cy=rc-cancel-btn]').click();
    });

    it('Should show a toast when success adding a new role 1', () => {
      cy.get('[data-cy=rc-add-new]').should('exist').click();
      cy.get('[data-cy=rc-submit-btn').should('be.visible').should('be.disabled');
      cy.get('[data-cy=rc-role-name]').should('exist').clear().type(dummyInvalidName);
      cy.get('[data-cy=rc-submit-btn').should('be.disabled');
      cy.get('[data-cy=rc-role-name]').should('exist').clear().type(dummyRoleName1);
      cy.get('[data-cy=rc-UserAdmin').check();
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasEditRolePrivileges) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=rc-submit-btn').click();
      cy.wait(`@${aliasEditRolePrivileges}`).then((res) => {
        if (res) {
          cy.get('[data-cy=alert-success]').should('exist');
          cy.contains(dummyRoleName1);
        }
      });
    });
  });

  describe('Edit Role Privileges', () => {
    it('Should disable Save button when there is no changes', () => {
      cy.get('[data-cy=rc-edit-config]').should('exist').click();
      cy.get('[data-cy=rc-quick-action]').should('be.visible');
      cy.get('[data-cy=rc-submit-btn').should('be.disabled');
      cy.get('[data-cy=rc-cancel-btn]').click();
    });

    it('Should disable signcrf checkbox after checking another site privileges', () => {
      cy.get('[data-cy=rc-edit-config]').click();
      cy.get('[data-cy=rc-SourceCapture]').first().check();
      cy.get('[data-cy=rc-SignCrf]').first().should('be.disabled');
      cy.get('[data-cy=rc-SourceCapture]').first().uncheck();
      cy.get('[data-cy=rc-SignCrf]').first().should('be.enabled');
      cy.get('[data-cy=rc-cancel-btn').click();
    });

    it('Should show a fail toast when entering privileges with 5 site privileges', () => {
      cy.get('[data-cy=rc-edit-config').click();
      cy.get('[data-cy=rc-SourceCapture').first().check();
      cy.get('[data-cy=rc-SourceMarkUp').first().check();
      cy.get('[data-cy=rc-SnippetAssessment').first().check();
      cy.get('[data-cy=rc-DataEntry').first().check();
      cy.get('[data-cy=rc-Verification').first().check();
      cy.get('[data-cy=rc-submit-btn').click();
      cy.get('[data-cy=rc-edit-confirmation-modal').should('be.visible');
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasEditRolePrivileges) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=rc-confirm-btn]').click();
      cy.wait(`@${aliasEditRolePrivileges}`).then((res) => {
        if (res) {
          cy.get('[data-cy=error-alert]')
            .should('exist')
            .should('have.text', 'You cannot combine all 5 site privileges.');
        }
      });
    });
  });

  describe('Add a new Role Again', () => {
    it('Should show a toast when success adding a new role 2', () => {
      cy.get('[data-cy=rc-add-new]').should('exist').click();
      cy.get('[data-cy=rc-role-name]').should('exist').clear().type(dummyRoleName2);
      cy.get('[data-cy=rc-UserAdmin').check();
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasEditRolePrivileges) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=rc-submit-btn').click();
      cy.wait(`@${aliasEditRolePrivileges}`).then((res) => {
        if (res) {
          cy.get('[data-cy=alert-success]').should('exist');
        }
      });
    });
  });

  describe('Edit a Role Name and Privilege', () => {
    it('Should show a success toast when editing a new role 3', () => {
      cy.get('[data-cy=rc-edit-config').click();
      cy.get('[data-cy=rc-role-name]').first().clear();
      cy.get('[data-cy=rc-submit-btn').should('be.disabled');
      cy.get('[data-cy=rc-role-name]').first().type(dummyRoleName3);
      cy.get('[data-cy=rc-UserAdmin').uncheck();
      cy.get('[data-cy=rc-submit-btn').should('be.disabled');
      cy.get('[data-cy=rc-SnippetAssessment').check();
      cy.get('[data-cy=rc-submit-btn').click();
      cy.get('[data-cy=rc-edit-confirmation-modal').should('be.visible');
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasEditRolePrivileges) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=rc-confirm-btn]').click();
      cy.wait(`@${aliasEditRolePrivileges}`).then((res) => {
        if (res) {
          cy.get('[data-cy=alert-success]').should('exist');
        }
      });
    });

    it('Should show a fail toast when entering role name with duplicated name', () => {
      cy.get('[data-cy=rc-edit-config').click();
      cy.get('[data-cy=rc-role-name]').first().clear().type(dummyRoleName2Duplicated);
      cy.get('[data-cy=rc-UserAdmin').check();
      cy.get('[data-cy=rc-submit-btn').click();
      cy.get('[data-cy=rc-edit-confirmation-modal').should('be.visible');
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasEditRolePrivileges) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=rc-confirm-btn]').click();
      cy.wait(`@${aliasEditRolePrivileges}`).then((res) => {
        if (res) {
          cy.get('[data-cy=error-alert]')
            .should('exist')
            .should(
              'have.text',
              'Role name already exists or has been reserved by the system. Please use another role name.',
            );
        }
      });
      // Testing bugfix where after got error from BE, these 2 buttons still disabled
      cy.get('[data-cy=rc-add-new]').should('not.have.attr', 'disabled');
      cy.get('[data-cy=rc-edit-config]').should('not.have.attr', 'disabled');
    });

    it('Should disable add and edit button when on add or edit mode', () => {
      // NOTE: expect every button clickable
      cy.get('[data-cy=rc-add-new]').should('not.have.attr', 'disabled');
      cy.get('[data-cy=rc-edit-config]').should('not.have.attr', 'disabled');
      cy.get('[data-cy=role-config-export-button]').should('not.have.attr', 'disabled');

      cy.get('[data-cy=rc-add-new]').click();

      // NOTE: expect every button unclickable
      cy.get('[data-cy=rc-add-new]').should('have.attr', 'disabled');
      cy.get('[data-cy=rc-edit-config]').should('have.attr', 'disabled');
      cy.get('[data-cy=role-config-export-button]').should('have.attr', 'disabled');

      cy.get('[data-cy=rc-cancel-btn]').click();

      // NOTE: expect every button clickable
      cy.get('[data-cy=rc-add-new]').should('not.have.attr', 'disabled');
      cy.get('[data-cy=rc-edit-config]').should('not.have.attr', 'disabled');
      cy.get('[data-cy=role-config-export-button]').should('not.have.attr', 'disabled');

      cy.get('[data-cy=rc-edit-config]').click();

      // NOTE: expect every button unclickable
      cy.get('[data-cy=rc-add-new]').should('have.attr', 'disabled');
      cy.get('[data-cy=rc-edit-config]').should('have.attr', 'disabled');
      cy.get('[data-cy=role-config-export-button]').should('have.attr', 'disabled');

      cy.get('[data-cy=rc-cancel-btn]').click();
    });
  });

  describe('Export Role Privileges', () => {
    it('Should download export file when admin click export button', () => {
      cy.get('[data-cy=role-config-export-button]').should('exist');
      cy.get('[data-cy=role-config-export-button]')
        .click()
        .then(() => {
          cy.wait(3000);
          const filename = path.join(downloadsFolder, 'download' + envString);
          cy.wait(3000);
          cy.readFile(filename, { timeout: 15000 }).should('exist');
        });
    });
  });
});
