import "cypress-localstorage-commands";
import {
  ConfigureUserProfileDocument,
  ResetPasswordDocument,
  DeactivateUserDocument,
  ReactivateUserDocument,
} from "../../../src/graphQL/generated/graphql";

const DocumentData: any = {
  configureUserProfile: ConfigureUserProfileDocument.definitions[0],
  deactivateUser: DeactivateUserDocument.definitions[0],
  reactivateUser: ReactivateUserDocument.definitions[0],
  resetPassword: ResetPasswordDocument.definitions[0],
};

const mockGlobalUserAdminData = {
  email: "admin@example.com",
  ,
};

const mockUpdatedUserData = {
  email: "changeprofile2@mock.com",
  ,
  firstName: "Change",
  lastName: "Profile",
  phone: "5055055050",
};

describe("User Admin Landing Page", () => {
  const aliasConfigureUserProfile = DocumentData.configureUserProfile.name.value;
  const aliasDeactivateUser = DocumentData.deactivateUser.name.value;
  const aliasReactivateUser = DocumentData.reactivateUser.name.value;
  const aliasResetPassword = DocumentData.resetPassword.name.value;

  before(() => {
    cy.clearLocalStorageSnapshot();
    cy.reseedDB();
    cy.fillInloginAsFormV2(mockGlobalUserAdminData);
    cy.saveLocalStorage();
    cy.waitForReact();
    cy.visit('/study');
    cy.get('[data-cy=header-btn-config]')
      .should('exist')
      .click();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  it('Should render landing page of user admin', () => {
    cy.get('[data-cy=user-admin-summary]').should('exist');
    cy.get('[data-cy=user-admin-table]').should('exist');
  });

  it('Should show modal page of user detail', () => {
    cy.get('[data-cy=name-lockedMockUserIdProd]').should('exist');
    cy.get('[data-cy=name-lockedMockUserIdProd]').click({force: true});
  });

  it(`Should show success message when admin reset the user's password`, () => {
    cy.intercept('POST', '/graphql', req => {
      if (req.body.operationName === aliasResetPassword) {
        req.alias = req.body.operationName;
      }
    });
    cy.get('[data-cy=user-detail-reset-password-button').should('exist');
    cy.get('[data-cy=user-detail-reset-password-button').click({multiple: true});
    cy.wait(`@${ aliasResetPassword }`).then(() => {
      cy.get('[data-cy=alert-success]').should('exist').contains('The password reset instructions has been sent to the email');
    });
  });

  it('Should show confirmation modal when admin deactivate an account', () => {
    cy.intercept('POST', '/graphql', req => {
      if (req.body.operationName === aliasDeactivateUser) {
        req.alias = req.body.operationName;
      }
    });
    cy.get(
      '[data-row-key="inviterMockUserIdProd"] > [style="text-align: center;"] > .ant-row > [data-cy=user-admin-archive-icon]',
    ).click();

    cy.get('[data-cy=archive-account-modal]').should('be.visible');
    cy.get('[data-cy=archive-account-modal]')
      .find('[data-cy=confirmModal-confirmButton]')
      .click();
    cy.wait(`@${ aliasDeactivateUser }`).then(() => {
      cy.get('[data-cy=alert-success]').should('exist').contains('User deactivated');
    });
  });

  it('Should show confirmation modal when admin reactivate an account', () => {
    cy.intercept('POST', '/graphql', req => {
      if (req.body.operationName === aliasReactivateUser) {
        req.alias = req.body.operationName;
      }
    });
    cy.get('[data-cy=name-inactiveMockUserIdProd]').click();
    cy.get('[data-cy=user-detail-reactivate-button]').should('exist');
    cy.get('[data-cy=user-detail-reactivate-button]').click();

    cy.get('[data-cy=user-detail-reactivate-confirmation-modal]').should('be.visible');
    cy.get('[data-cy=user-detail-reactivate-confirmation-modal]')
      .find('[data-cy=confirmModal-confirmButton]')
      .click();
    cy.wait(`@${ aliasReactivateUser }`).then(() => {
      cy.get('[data-cy=alert-success]').should('exist').contains('User reactivated');
    });
  });

  describe("Edit User Data", () => {

    beforeEach(() => {
      cy.restoreLocalStorage();
    });

    afterEach(() => {
      cy.saveLocalStorage();
    });

    it("Should show Modal Edit Profile", () => {
      cy.get("[data-cy=user-detail-edit-profile-button]").click();
      cy.get("[data-cy=modal-edit-profile]").should("be.visible");
      cy.get("[data-cy=edit-profile-save-button]").should("be.disabled");
    });

    it('Sucessfully save edit profile changes', () => {
      cy.intercept('POST', '/graphql', req => {
        if (req.body.operationName === aliasConfigureUserProfile) {
          req.alias = req.body.operationName;
        }
      });
      cy.wait(2000);
      cy.get('[data-cy=edit-profile-first-name-textfield]').type(`{selectall}${ mockUpdatedUserData.firstName }`);
      cy.get('[data-cy=edit-profile-last-name-textfield]').type(`{selectall}${ mockUpdatedUserData.lastName }`);
      cy.get('[data-cy=edit-profile-email-textfield]').type(`{selectall}${ mockUpdatedUserData.email }`);
      cy.get('[data-cy=edit-profile-phone-textfield]').type(`{selectall}${ mockUpdatedUserData.phone }`);

      cy.get('[data-cy=edit-profile-save-button]').should('not.be.disabled');
      cy.get('[data-cy=edit-profile-save-button]').click();
      cy.get('[data-cy=modal-edit-profile]').should('not.visible');
      cy.wait(`@${ aliasConfigureUserProfile }`);
    });
  });

});
