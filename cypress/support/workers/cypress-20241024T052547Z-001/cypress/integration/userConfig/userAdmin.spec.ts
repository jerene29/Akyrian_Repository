import 'cypress-localstorage-commands';
import {
  UserConfigDocument,
  InviteNewUserDocument,
  EditUserPermissionDocument,
  SetUserTrainingCompletionDocument,
  DeactivateUserDocument,
  ReactivateUserDocument,
  BulkPauseUserPermissionDocument,
  ResetPasswordDocument,
} from '../../../src/graphQL/generated/graphql';
import { mockUserDataAdmin } from '../../../src/constant/testFixtures';

const path = require('path');

const downloadsFolder = Cypress.config('downloadsFolder');
let envString = '';
if (!Cypress.env('TESTRUNNER_ENV')) {
  envString = '.csv';
}

const mockFilteredUser = [
  { name: 'Professor Birch', organization: 'Pfizer', study: 'CVD-19' },
  { name: 'Nurse Joy', organization: 'Pfizer', study: 'CVD-19' },
  { name: 'Sign CRF', organization: 'Pfizer', study: 'EBOLA' },
];

describe('User Admin Landing Page', () => {
  const aliasUserListDocument = UserConfigDocument.definitions[0].name.value;

  before(() => {
    cy.task('deleteFolder', downloadsFolder);
    cy.beforeSetup(mockUserDataAdmin);
    cy.visit('/login');
    cy.waitForReact();
    cy.saveLocalStorage();
    cy.visit('/study');
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  it('Should render landing page of user admin', () => {
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasUserListDocument) {
        req.alias = req.body.operationName;
      }
    });
    cy.get('[data-cy=header-btn-config]', { timeout: 10000 })
      .should('be.visible')
      .click();
    cy.wait(`@${aliasUserListDocument}`);
    cy.get('[data-cy=user-admin-summary]').should('exist');
    cy.get('[data-cy=user-admin-table]').should('exist');
  });

  it('Should filter users by user names', () => {
    cy.get('[data-cy=user-admin-search-bar-icon]', { timeout: 10000 })
      .should('be.visible')
      .click();
    cy.get('[data-cy=user-admin-search-bar-textfield]')
      .should('be.visible')
      .type(mockFilteredUser[0].name, { force: true });
    cy.get('.ant-table-cell').contains(mockFilteredUser[0].name);
    cy.get('[data-cy=user-admin-search-bar-textfield]').clear().blur();
  });

  it('Should filter users by user organization names', () => {
    cy.get('[data-cy=user-admin-search-bar-icon]', { timeout: 10000 })
      .should('be.visible')
      .click();
    cy.get('[data-cy=user-admin-search-bar-textfield]')
      .should('be.visible')
      .type(mockFilteredUser[1].organization, { force: true });
    cy.get('.ant-table-cell').contains(mockFilteredUser[1].name);
    cy.get('[data-cy=user-admin-search-bar-textfield]').clear().blur();
  });

  it('Should filter users by user study names', () => {
    cy.get('[data-cy=user-admin-search-bar-icon]', { timeout: 10000 })
      .should('be.visible')
      .click();
    cy.get('[data-cy=user-admin-search-bar-textfield]')
      .should('be.visible')
      .type(mockFilteredUser[2].study, { force: true });
    cy.get('.ant-table-cell').contains(mockFilteredUser[2].name);
    cy.get('[data-cy=user-admin-search-bar-textfield]').clear().blur();
  });

  it('Should show table user studies when icon arrow clicked', () => {
    cy.get('[data-row-key=studyConfigUser2] [data-cy=user-admin-arrow-icon]', { timeout: 10000 })
      .should('be.visible')
      .click();
    cy.get('[data-cy=table-user-studies]').should('be.visible');
    cy.get('[data-row-key=studyConfigUser2] [data-cy=user-admin-arrow-icon]').click();
  });

  it('Should show checkbox and quick action when bulk button clicked', () => {
    cy.get('[data-cy=user-admin-bulk-button]', { timeout: 10000 })
      .should('be.visible')
      .click();
    cy.get('[data-cy=user-admin-quick-action]').should('be.visible');
    cy.get('[data-cy=user-admin-checkbox-title]').should('exist');
    cy.get('[data-cy=user-admin-bulk-button]')
      .should('be.visible')
      .click();
  });

  it('Should show tooltip when lock icon hovered', () => {
    cy.get('[data-cy=lock-icon-user-admin]', { timeout: 10000 })
      .first()
      .should('be.visible')
      .trigger('mouseover');
    cy.get('[data-cy=locked-user-tooltip]').should('be.visible');
    cy.get('[data-cy=lock-icon-user-admin]')
      .first()
      .trigger('mouseout');
  });

  it('Should show confirmation modal when admin reset a locked account', () => {
    cy.get('[data-row-key=studyConfigUser2] [data-cy=user-admin-sync-icon]', { timeout: 10000 })
      .should('be.visible')
      .trigger('mouseover');
    cy.get('[data-cy=reset-locked-account-tooltip]').should('be.visible');
    cy.get('[data-row-key=studyConfigUser2] [data-cy=user-admin-sync-icon]')
      .trigger('mouseout')
      .click();
    cy.get('[data-cy=reset-account-modal]')
      .should('be.visible')
      .find('[data-cy=confirmModal-cancelButton]')
      .click();
  });

  it('Should show confirmation modal when admin re-activate an account', () => {
    cy.get('[data-cy=user-admin-btn-reactivate]', { timeout: 10000 })
      .first()
      .should('be.visible')
      .click();
    cy.get('[data-cy=reactivate-account-modal]')
      .should('be.visible')
      .find('[data-cy=confirmModal-cancelButton]')
      .click();
  });

  it('Should show confirmation modal when admin archive an account', () => {
    cy.get('[data-row-key=studyConfigUser2] [data-cy=user-admin-archive-icon]', { timeout: 10000 })
      .should('be.visible')
      .click();
    cy.get('[data-cy=archive-account-modal]')
      .should('be.visible')
      .find('[data-cy=confirmModal-cancelButton]')
      .click();
  });

  it('Should show Manage Training Record modal when admin click icon training record', () => {
    cy.get('[data-row-key=studyConfigUser2] [data-cy=training-record-icon]', { timeout: 10000 })
      .should('be.visible')
      .click();
    cy.get('[data-cy=modal-manage-training-record-user]')
      .should('be.visible')
      .find('[data-cy=add-training-record-cancel-btn]')
      .click();
  });

  describe('Export User List', () => {
    before(() => {
      cy.get('[data-cy=user-admin-bulk-button]').should('exist').click();

      cy.get('[data-cy=user-admin-checkbox-verifierUser1]').should('exist').click();

      cy.get('[data-cy=user-admin-checkbox-dataEntryUser1]').should('exist').click();
    });

    beforeEach(() => {
      cy.restoreLocalStorage();
    });

    afterEach(() => {
      cy.saveLocalStorage();
    });

    it('Should download export file when admin click export button', () => {
      cy.get('[data-cy=icon-export]').should('exist');
      cy.get('[data-cy=icon-export]')
        .click()
        .then(() => {
          cy.wait(3000);
          const filename = path.join(downloadsFolder, 'download' + envString);
          cy.wait(3000);
          cy.readFile(filename, { timeout: 15000 }).then((data) => {
            cy.task('csvToJson', data).then((data) => {
              const userIds = data.map((user) => user.id);
              userIds.forEach((id) => {
                if (id === 'verifierUser1') {
                  expect(id).equal('verifierUser1');
                } else {
                  expect(id).equal('dataEntryUser1');
                }
              });
            });
          });
        });
    });
  });

  describe('Add New User', () => {
    const aliasInviteNewUser = InviteNewUserDocument.definitions[0].name.value;

    beforeEach(() => {
      cy.restoreLocalStorage();
    });

    afterEach(() => {
      cy.saveLocalStorage();
    });

    it('Should open Add New User Form Modal', () => {
      cy.get('[data-cy=btn-add-new-user]').click();
      cy.get('[data-cy=modal-add-user]').should('be.visible');
      cy.get('[data-cy=add-new-user-save-btn]').should('be.disabled');
    });

    it('Should disable Next Button when the input not valid', () => {
      cy.get('[data-cy=add-new-user-firstName]').clear().type('TEST-ABCD').blur();
      cy.get('[data-cy=add-new-user-lastName]').clear().type('TEST-ABCD').blur();
      cy.get('[data-cy=add-new-user-email]').clear().type('TEST-ABCD').blur();
      cy.get('[data-cy=add-new-user-phoneNumber]').clear().type('1234').blur();

      cy.get('[data-cy=invalid-input]').contains('Email address is invalid');
      cy.get('[data-cy=invalid-input]').contains('Phone number is invalid');
      cy.get('[data-cy=add-new-user-save-btn]').should('be.disabled');
    });

    it('Should open Add User to Study Modal when User profile fulfilled', () => {
      cy.get('[data-cy=add-new-user-firstName]').clear().type('FirstName').blur();
      cy.get('[data-cy=add-new-user-lastName]').clear().type('LastName').blur();
      cy.get('[data-cy=add-new-user-email]').clear().type('firstname@lastname.com').blur();
      cy.get('[data-cy=add-new-user-phoneNumber]').clear().type('5055055050').blur();

      cy.get('[data-cy=add-new-user-save-btn]').should('be.enabled').click();
      cy.get('[data-cy=add-user-to-study-header]').should('be.visible');
    });

    it('Should clear all Input if Study change', () => {
      cy.get('[data-cy=add-user-study-study] input')
        .click({ force: true })
        .type('CVD-19', { force: true })
        .get('.study-option')
        .contains('CVD-19')
        .click();
      cy.get('[data-cy=add-user-study-site] input').first().should('be.empty');
      cy.get('[data-cy=add-user-study-role] input').first().should('be.empty');
    });

    it('Should open Training Record Modal when User study fulfilled', () => {
      cy.get('[data-cy=add-user-study-study] input')
        .click({ force: true })
        .type('CVD-19', { force: true })
        .get('.study-option')
        .contains('CVD-19')
        .click();
      cy.get('[data-cy=add-user-study-site] input')
        .click({ force: true })
        .get('.site-option')
        .contains('University of Tokyo Hospital')
        .click();
      cy.get('[data-cy=add-user-study-role] input')
        .click({ force: true })
        .type('Data Entry User', { force: true })
        .get('.role-option')
        .contains('Data Entry User')
        .click();
      cy.get('[data-cy=add-user-study-save-btn]').should('be.enabled').click();
      cy.get('[data-cy=modal-manage-training-record-user]').should('be.visible');
    });

    it('Should open Edit Profile Modal when User training record confirmed', () => {
      cy.get('[data-cy=modal-manage-training-record-user]').should('be.visible');
      cy.get('[data-cy=modal-manage-training-record-user]')
        .find('[data-cy=add-training-record-save-btn]')
        .click();
      cy.get('[data-cy=modal-edit-profile]').should('be.visible');
    });

    it('Should show success alert when Add User Success', () => {
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasInviteNewUser) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=edit-profile-save-button]').should('exist').click();
      cy.wait(`@${aliasInviteNewUser}`).then((res) => {
        if (res) {
          cy.get('[data-cy=success-invite-confirmation-modal]')
            .should('exist')
            .contains('has been successfully invited');
          cy.get('[data-cy=confirmModal-confirmButton]')
            .should('exist')
            .click({ force: true, multiple: true });
        }
      });
    });
  });

  describe('Add User Permission', () => {
    const aliasEditUserPermission = EditUserPermissionDocument.definitions[0].name.value;

    beforeEach(() => {
      cy.restoreLocalStorage();
    });

    afterEach(() => {
      cy.saveLocalStorage();
    });

    xit('Should open Add User to Study Modal', () => {
      cy.get('[data-cy=user-admin-arrow-icon]').should('exist');
      cy.get('[data-cy=user-admin-arrow-icon]').first().click();
      cy.get('[data-cy=add-permission-btn]').should('exist').click();
      cy.get('[data-cy=add-user-to-study-header]').should('be.visible');
    });

    xit('Should show alert when success adding new permission', () => {
      cy.get('[data-cy=add-user-study-study] input')
        .click({ force: true })
        .type('EBOLA', { force: true })
        .get('.study-option')
        .contains('EBOLA')
        .click();
      cy.get('[data-cy=add-user-study-site] input')
        .click({ force: true })
        .get('.site-option')
        .contains('University of Tokyo Hospital')
        .click();
      cy.get('[data-cy=add-user-study-role] input')
        .click({ force: true })
        .type('Super User', { force: true })
        .get('.role-option')
        .contains('Super User')
        .click();

      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasEditUserPermission) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=add-user-study-save-btn]').should('be.enabled').click();
      cy.wait(`@${aliasEditUserPermission}`).then((res) => {
        if (res) {
          cy.get('[data-cy=alert-success]').should('exist');
          cy.get('[data-cy=user-admin-arrow-icon]').should('exist');
          cy.get('[data-cy=user-admin-arrow-icon]').first().click();
        }
      });
    });
  });

  describe('Edit User Permission', () => {
    const aliasEditUserPermission = EditUserPermissionDocument.definitions[0].name.value;

    beforeEach(() => {
      cy.restoreLocalStorage();
    });

    afterEach(() => {
      cy.saveLocalStorage();
    });

    xit('Should open Add User to Study Modal with existing value', () => {
      cy.get('[data-cy=user-admin-arrow-icon]').should('exist');
      cy.get('[data-cy=user-admin-arrow-icon]').first().click();
      cy.get('[data-cy=edit-permission-btn]').first().should('exist').click();
      cy.get('[data-cy=add-user-to-study-header]').should('be.visible');

      cy.get('[data-cy=add-user-study-study] .ant-select-selection-item')
        .first()
        .should('contain', 'CVD-19');
    });

    xit('Should show alert when success editing new permission', () => {
      cy.get('[data-cy=add-user-study-site] input')
        .first()
        .click({ force: true })
        .get('.site-option')
        .contains('University of Tokyo Hospital')
        .click();
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasEditUserPermission) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=add-user-study-save-btn]').should('be.enabled').click();
      cy.wait(`@${aliasEditUserPermission}`).then((res) => {
        if (res) {
          cy.get('[data-cy=alert-success]').should('exist');
          cy.get('[data-cy=user-admin-arrow-icon]').should('exist');
          cy.get('[data-cy=user-admin-arrow-icon]').first().click();
        }
      });
    });
  });

  describe('Manage Training Record', () => {
    const aliasTrainingCompletion = SetUserTrainingCompletionDocument.definitions[0].name.value;

    beforeEach(() => {
      cy.restoreLocalStorage();
    });

    afterEach(() => {
      cy.saveLocalStorage();
    });

    xit('Should open modal when Training Record icon clicked', () => {
      cy.get('[data-cy=training-record-icon]').should('exist');
      cy.get('[data-cy=training-record-icon]').first().click();
      cy.get('[data-cy=modal-manage-training-record-user]')
        .should('be.visible')
        .find('[data-cy=add-training-record-save-btn]')
        .should('be.disabled');
    });

    xit('Should show alert when success managing training record', () => {
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasTrainingCompletion) {
          req.alias = req.body.operationName;
        }
        if (req.body.operationName === aliasUserListDocument) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=platform-training-checkbox]').should('exist').click();
      cy.get('[data-cy=add-training-record-save-btn]').should('be.enabled').click();
      cy.wait(`@${aliasTrainingCompletion}`).then((res) => {
        if (res) {
          cy.get('[data-cy=alert-success]').should('exist');
        }
      });
      cy.wait(`@${aliasUserListDocument}`);
      cy.get('[data-cy=user-admin-arrow-icon]').should('exist');
      cy.get('[data-cy=user-admin-arrow-icon]').first().click();
    });
  });

  describe('Interact with user status', () => {
    const aliasDeactivateUser = DeactivateUserDocument.definitions[0].name.value;
    const aliasReactivateUser = ReactivateUserDocument.definitions[0].name.value;
    const aliasBulkPauseUser = BulkPauseUserPermissionDocument.definitions[0].name.value;
    const aliasResetPassword = ResetPasswordDocument.definitions[0].name.value;
    const aliasResendInvite = InviteNewUserDocument.definitions[0].name.value;

    beforeEach(() => {
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasUserListDocument) {
          req.alias = req.body.operationName;
        }
      });
      cy.restoreLocalStorage();
    });

    afterEach(() => {
      cy.wait(`@${aliasUserListDocument}`);
      cy.saveLocalStorage();
    });

    it('Should be able to resend new user invitation', () => {
      cy.get('[data-cy=resend-invite-text-button]').should('exist');
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasResendInvite) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=resend-invite-text-button]').first().click({ force: true });
      cy.get('[data-cy=alert-success]').should('exist');
    });

    it('Should be able to deactivate user', () => {
      cy.get('[data-cy=user-admin-archive-icon]').should('exist');
      cy.get('[data-cy=user-admin-archive-icon]').first().click();
      cy.get('[data-cy=archive-account-modal]').should('be.visible');
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasDeactivateUser) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=archive-account-modal]')
        .find('[data-cy=confirmModal-confirmButton]')
        .click();
      cy.wait(`@${aliasDeactivateUser}`).then((res) => {
        if (res) {
          cy.get('[data-cy=alert-success]').should('exist');
        }
      });
    });

    it('Should be able to reactivate user', () => {
      cy.get('[data-cy=user-admin-btn-reactivate]').should('exist');
      cy.get('[data-cy=user-admin-btn-reactivate]').first().click();
      cy.get('[data-cy=reactivate-account-modal]').should('be.visible');
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasReactivateUser) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=reactivate-account-modal]')
        .find('[data-cy=confirmModal-confirmButton]')
        .click();
      cy.wait(`@${aliasReactivateUser}`).then((res) => {
        if (res) {
          cy.get('[data-cy=alert-success]').should('exist');
        }
      });
    });

    it('Should be able to pause user permission', () => {
      cy.get('[data-cy=pause-user-icon]').should('exist');
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasBulkPauseUser) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=pause-user-icon]').first().click();
      cy.wait(`@${aliasBulkPauseUser}`).then((res) => {
        if (res) {
          cy.get('[data-cy=alert-success]').should('exist');
        }
      });
    });

    it('Should be able to unpause user permission', () => {
      cy.get('[data-cy=play-icon-user-admin]').should('exist');
      cy.get('[data-cy=play-icon-user-admin]').first().trigger('mouseover');
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasBulkPauseUser) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=play-user-tooltip]')
        .should('be.visible')
        .find('[data-cy=unpause-user-text-button]')
        .click();
      cy.wait(`@${aliasBulkPauseUser}`).then((res) => {
        if (res) {
          cy.get('[data-cy=alert-success]').should('exist');
        }
      });
    });

    it('Should be able to send reset password email to user', () => {
      cy.get('[data-cy=user-admin-sync-icon]').should('exist');
      cy.get('[data-cy=user-admin-sync-icon]').first().click();
      cy.get('[data-cy=reset-account-modal]').should('be.visible');
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasResetPassword) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=reset-account-modal]').find('[data-cy=confirmModal-confirmButton]').click();
      cy.wait(`@${aliasResetPassword}`).then((res) => {
        if (res) {
          cy.get('[data-cy=alert-success]').should('exist');
        }
      });
    });
  });
});
