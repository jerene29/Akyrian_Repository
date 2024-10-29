import "cypress-localstorage-commands";
import {
  ConfigureUserSettingsDocument,
  UserSettingsDocument,
} from "../../../src/graphQL/generated/graphql";

const DocumentData: any = {
  configureUserSettings: ConfigureUserSettingsDocument.definitions[0],
  userSettings: UserSettingsDocument.definitions[0],
};

const mockCurrentUser = {
  email: "admin@example.com",
  ,
};

const mockUpdatedUserSettings = {
  limitPasswordChange: "20",
  limitSystemInactivity: "20",
  limitFailedAttempts: "20",
  limitAccountDeactivation: "20",
};

describe("Edit User Settings", () => {
  const aliasConfigureUserSettings =
    DocumentData.configureUserSettings.name.value;
  const aliasUserSettings = DocumentData.userSettings.name.value;

  before(() => {
    cy.clearLocalStorageSnapshot();
    cy.visit("/login");
    cy.fillInloginAsFormV2(mockCurrentUser);
    cy.saveLocalStorage();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  describe("Open User Settings Modal", () => {
    beforeEach(() => {
      cy.restoreLocalStorageCache();
    });

    afterEach(() => {
      cy.saveLocalStorageCache();
    });

    it('Skip first time message', () => {
      cy.visit('/study');
    });
    it("Open the User Config Page", () => {
      cy.get("[data-cy=header-btn-config]").should("exist");
      cy.get("[data-cy=header-btn-config]").click();
    });
    it("Open the User Settings Modal", () => {
      cy.intercept("POST", "/graphql", (req) => {
        if (req.body.operationName === aliasUserSettings) {
          req.alias = req.body.operationName;
        }
      });
      cy.get("[data-cy=btn-user-settings]").should("exist");
      cy.get("[data-cy=btn-user-settings]").click();
      cy.get("[data-cy=modal-user-settings]").should("exist");
    });
  });

  describe("Edit User Settings Data", () => {
    beforeEach(() => {
      cy.restoreLocalStorageCache();
    });

    afterEach(() => {
      cy.saveLocalStorageCache();
    });

    describe(('Open User Settings Modal'), () => {
      beforeEach(() => {
        cy.restoreLocalStorageCache();
      });

      afterEach(() => {
        cy.saveLocalStorageCache();
      });

      it("Show and edit the password change settings", () => {
        cy.get("[data-cy=menu-item-passwordChange]").should("exist");
        cy.get("[data-cy=menu-item-passwordChange]").click();

        cy.get("[data-cy=user-settings-password-change-textfield]").should(
          "exist"
        );
        cy.get("[data-cy=user-settings-password-change-textfield")
          .clear()
          .type(mockUpdatedUserSettings.limitPasswordChange)
          .blur();
      });
      it("Show and edit the system inactivity settings", () => {
        cy.get("[data-cy=menu-item-systemInactivity]").should("exist");
        cy.get("[data-cy=menu-item-systemInactivity]").click();

        cy.get("[data-cy=user-settings-system-inactivity-textfield]").should(
          "exist"
        );
        cy.get("[data-cy=user-settings-system-inactivity-textfield")
          .clear()
          .type(mockUpdatedUserSettings.limitSystemInactivity)
          .blur();
      });
      it("Show and edit the failed attempts settings", () => {
        cy.get("[data-cy=menu-item-failedAttempts]").should("exist");
        cy.get("[data-cy=menu-item-failedAttempts]").click();

        cy.get("[data-cy=user-settings-failed-attempts-textfield]").should(
          "exist"
        );
        cy.get("[data-cy=user-settings-failed-attempts-textfield")
          .clear()
          .type(mockUpdatedUserSettings.limitFailedAttempts)
          .blur();
      });
      it("Show and edit the account deactivation settings", () => {
        cy.get("[data-cy=menu-item-accountDeactivation]").should("exist");
        cy.get("[data-cy=menu-item-accountDeactivation]").click();

        cy.get("[data-cy=user-settings-account-deactivation-textfield]").should(
          "exist"
        );
        cy.get("[data-cy=user-settings-account-deactivation-textfield")
          .clear()
          .type(mockUpdatedUserSettings.limitAccountDeactivation)
          .blur();
      });
      // PC: '20', SI: '20', FA: '20', AD: '20'
      it("Successfully save user settings changes", () => {
        cy.intercept("POST", "/graphql", (req) => {
          if (req.body.operationName === aliasConfigureUserSettings) {
            req.alias = req.body.operationName;
          }
        });
        cy.get("[data-cy=user-settings-save-button]").should("not.be.disabled");
        cy.get("[data-cy=user-settings-save-button]").click();
        cy.wait(`@${ aliasConfigureUserSettings }`).then((result) => {
          if (result?.response?.statusCode === 200) {
            cy.get("[data-cy=alert-success]")
              .should("exist")
              .contains("User settings has been updated");
          }
        });
      });
    });
  });
});
