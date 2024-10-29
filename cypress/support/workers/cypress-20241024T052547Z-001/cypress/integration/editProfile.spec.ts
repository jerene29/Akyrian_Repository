import 'cypress-localstorage-commands';

import {
  ConfigureMyProfileDocument,
  GetUserFromTokenDocument,
  MyProfileDocument,
  SendOtpChangeProfileDocument,
  ValidateOtpChangeProfileDocument,
} from '../../src/graphQL/generated/graphql';
import { LOCAL_PASSWORD } from '../support/command/others';

const DocumentData: any = {
  configureMyProfile: ConfigureMyProfileDocument.definitions[0],
  getUserFromToken: GetUserFromTokenDocument.definitions[0],
  myProfile: MyProfileDocument.definitions[0],
  sendOtpChangeProfile: SendOtpChangeProfileDocument.definitions[0],
  validateOtpChangeProfile: ValidateOtpChangeProfileDocument.definitions[0],
};

const mockCurrentUserData = {
  email: 'changeprofile@mock.com',
  password: LOCAL_PASSWORD,
};
const mockUpdatedUserData = {
  email: 'changeprofile2@mock.com',
  password: LOCAL_PASSWORD,
  firstName: 'Nurse',
  lastName: 'Joy',
  phone: '5055055050',
};

const mockChangePasswordUserData = {
  email: 'changepassword@mock.com',
  password: LOCAL_PASSWORD,
};
const mockUpdatedChangePasswordUserData = {
  email: 'changepassword@mock.com',
  password: 'Password!2',
};

const generateArrayValue = (length: number, fill: string) => {
  const arr = Array(length).fill(fill);
  return arr;
};

const otpValue = generateArrayValue(6, '9');

describe('Edit Profile', () => {
  const aliasConfigureMyProfile = DocumentData.configureMyProfile.name.value;
  const aliasGetUserFromToken = DocumentData.getUserFromToken.name.value;
  const aliasMyProfile = DocumentData.myProfile.name.value;
  const aliasSendOtpChangeProfile = DocumentData.sendOtpChangeProfile.name.value;
  const aliasValidateOtpChangeProfile = DocumentData.validateOtpChangeProfile.name.value;

  before(() => {
    cy.clearLocalStorageSnapshot();
    cy.reseedDB();
    cy.fillInloginAsFormV2(mockCurrentUserData);
    cy.saveLocalStorage();
    cy.waitForReact();
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasMyProfile) {
        req.alias = req.body.operationName;
      }
    });
    cy.visit('/dashboard');
    cy.wait(`@${aliasMyProfile}`);
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  describe('Open Edit Profile Modal', () => {
    beforeEach(() => {
      cy.restoreLocalStorageCache();
    });

    afterEach(() => {
      cy.saveLocalStorageCache();
    });

    it('Open profile pullover', () => {
      cy.get('[data-cy=header-user-popover-trigger]').should('exist');
      cy.get('[data-cy=header-user-popover-trigger]').click();
    });
    it('Open the Edit Profile Modal', () => {
      cy.get('[data-cy=btn-edit-profile]').should('exist');
      cy.get('[data-cy=btn-edit-profile]').click();
      cy.get('[data-cy=modal-edit-profile]').should('exist');
    });
  });

  describe('Edit User Data', () => {
    beforeEach(() => {
      cy.restoreLocalStorageCache();
    });

    afterEach(() => {
      cy.saveLocalStorageCache();
    });

    it('Show the form', () => {
      cy.get('#edit-profile-form').should('exist');
    });
    it('Show the text fields', () => {
      cy.get('[data-cy=edit-profile-first-name-textfield]').should('exist');
      cy.get('[data-cy=edit-profile-last-name-textfield]').should('exist');
      cy.get('[data-cy=edit-profile-email-textfield]').should('exist');
      cy.get('[data-cy=edit-profile-phone-textfield]').should('exist');
      cy.get('[data-cy=edit-profile-change-password-button]').should('exist');
      cy.get('[data-cy=edit-profile-change-avatar-button]').should('exist');
    });
    it('Show the error messages', () => {
      // F: 'TEST-ABCD', L: '', E: 'TEST-ABCD', P: '1234'
      cy.get('[data-cy=edit-profile-first-name-textfield]').clear().type('TEST-ABCD').blur();
      cy.get('[data-cy=edit-profile-last-name-textfield]').clear().type('TEST-ABCD').blur();
      cy.get('[data-cy=edit-profile-email-textfield]').clear().type('TEST-ABCD').blur();
      cy.get('[data-cy=edit-profile-phone-textfield]').clear().type('1234').blur();

      cy.get('[data-cy=invalid-input]').contains('Email address is invalid');
      cy.get('[data-cy=invalid-input]').contains('Phone number is invalid');
    });
    it('Sucessfully save edit profile changes', () => {
      cy.get('[data-cy=edit-profile-first-name-textfield]')
        .clear()
        .type(mockUpdatedUserData.firstName)
        .blur();
      cy.get('[data-cy=edit-profile-last-name-textfield]')
        .clear()
        .type(mockUpdatedUserData.lastName)
        .blur();
      cy.get('[data-cy=edit-profile-email-textfield]')
        .clear()
        .type(mockUpdatedUserData.email)
        .blur();
      cy.get('[data-cy=edit-profile-phone-textfield]')
        .clear()
        .type(mockUpdatedUserData.phone)
        .blur();

      cy.get('[data-cy=edit-profile-save-button]').should('not.be.disabled');
    });
  });

  describe('Submit edit profile changes', () => {
    beforeEach(() => {
      cy.restoreLocalStorageCache();
    });

    afterEach(() => {
      cy.saveLocalStorageCache();
    });

    it('Submit changes', () => {
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasConfigureMyProfile) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=edit-profile-save-button]').click();
      cy.clearLocalStorage();
      cy.wait(`@${aliasConfigureMyProfile}`);
      cy.url().should('include', `/login`);
    });
  });

  describe('Should complete email verification', () => {
    before(() => {
      cy.clearLocalStorage();
    });

    it('Send OTP', () => {
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasGetUserFromToken) {
          req.alias = req.body.operationName;
        }
        if (req.body.operationName === aliasSendOtpChangeProfile) {
          req.alias = req.body.operationName;
        }
      });
      cy.visit(`${Cypress.env('REACT_APP_BASE_URL')}/change-profile/changeProfileToken`);
      cy.wait(`@${aliasGetUserFromToken}`);
      cy.wait(`@${aliasSendOtpChangeProfile}`).then((response: any) => {
        if (response.response) {
          cy.get('.ant-modal-body')
            .should('be.visible')
            .then(() => {
              cy.get('[data-cy=submit-otp]').should('be.disabled');
              Cypress.Promise.all([
                otpValue.map((value, i) => {
                  cy.get(`.otp-container > :nth-child(${i + 1})`).type(value);
                }),
                cy.get('[data-cy=submit-otp]').should('be.enabled'),
              ]);
            });
        }
      });
    });

    it('Submit OTP', () => {
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasValidateOtpChangeProfile) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=submit-otp]').click();
      cy.wait(`@${aliasValidateOtpChangeProfile}`).then(() => {
        cy.get('[data-cy=alert-success]').should('exist').contains('Your profile has been updated');
        cy.url().should('include', `/login`);
      });
    });

    it('Login with new credentials', () => {
      cy.fillInloginAsFormV2(mockUpdatedUserData);
      cy.saveLocalStorage();
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasMyProfile) {
          req.alias = req.body.operationName;
        }
      });
      cy.visit('/dashboard');
      cy.wait(`@${aliasMyProfile}`);
    });

    describe('Open Edit Profile Modal', () => {
      beforeEach(() => {
        cy.restoreLocalStorageCache();
      });

      afterEach(() => {
        cy.saveLocalStorageCache();
      });

      it('Open profile pullover', () => {
        cy.get('[data-cy=header-user-popover-trigger]').should('exist');
        cy.get('[data-cy=header-user-popover-trigger]').click();
      });
      it('Open the Edit Profile Modal', () => {
        cy.get('[data-cy=btn-edit-profile]').should('exist');
        cy.get('[data-cy=btn-edit-profile]').click();
        cy.get('[data-cy=modal-edit-profile]').should('exist');
      });
    });

    describe('Check Updated User Data', () => {
      beforeEach(() => {
        cy.restoreLocalStorageCache();
      });

      afterEach(() => {
        cy.saveLocalStorageCache();
      });

      it('Show the form', () => {
        cy.get('#edit-profile-form').should('exist');
      });
      it('Show the text fields', () => {
        cy.get('[data-cy=edit-profile-first-name-textfield]').should(
          'have.value',
          mockUpdatedUserData.firstName,
        );
        cy.get('[data-cy=edit-profile-last-name-textfield]').should(
          'have.value',
          mockUpdatedUserData.lastName,
        );
        cy.get('[data-cy=edit-profile-email-textfield]').should(
          'have.value',
          mockUpdatedUserData.email,
        );
        cy.get('[data-cy=edit-profile-phone-textfield]').should(
          'have.value',
          mockUpdatedUserData.phone,
        );
      });
    });
  });
});

describe('Edit Password', () => {
  const aliasConfigureMyProfile = DocumentData.configureMyProfile.name.value;
  const aliasGetUserFromToken = DocumentData.getUserFromToken.name.value;
  const aliasMyProfile = DocumentData.myProfile.name.value;
  const aliasSendOtpChangeProfile = DocumentData.sendOtpChangeProfile.name.value;
  const aliasValidateOtpChangeProfile = DocumentData.validateOtpChangeProfile.name.value;

  before(() => {
    cy.clearLocalStorageSnapshot();
    cy.reseedDB();
    cy.fillInloginAsFormV2(mockChangePasswordUserData);
    cy.saveLocalStorage();
    cy.waitForReact();
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasMyProfile) {
        req.alias = req.body.operationName;
      }
    });
    cy.visit('/dashboard');
    cy.wait(`@${aliasMyProfile}`);
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  describe('Open Edit Profile Modal', () => {
    beforeEach(() => {
      cy.restoreLocalStorageCache();
    });

    afterEach(() => {
      cy.saveLocalStorageCache();
    });

    it('Open profile pullover', () => {
      cy.get('[data-cy=header-user-popover-trigger]').should('exist');
      cy.get('[data-cy=header-user-popover-trigger]').click();
    });
    it('Open the Edit Profile Modal', () => {
      cy.get('[data-cy=btn-edit-profile]').should('exist');
      cy.get('[data-cy=btn-edit-profile]').click();
      cy.get('[data-cy=modal-edit-profile]').should('exist');
    });
  });

  describe('Change User Password', () => {
    beforeEach(() => {
      cy.restoreLocalStorageCache();
    });

    afterEach(() => {
      cy.saveLocalStorageCache();
    });

    it('Open the Change Password Modal', () => {
      cy.get('[data-cy=edit-profile-change-password-button]').should('exist');
      cy.get('[data-cy=edit-profile-change-password-button]').click();
      cy.get('[data-cy=modal-change-password]').should('exist');
    });
    it('Show the form', () => {
      cy.get('#change-password-form').should('exist');
    });
    it('Show the text fields', () => {
      cy.get('[data-cy=change-password-old-password-textfield').should('exist');
      cy.get('[data-cy=change-password-new-password-textfield').should('exist');
      cy.get('[data-cy=change-password-confirmation-password-textfield').should('exist');
    });
    it('Show the error messages', () => {
      // O: 'Test', N: 'Test', C: ''
      cy.get('[data-cy=change-password-old-password-textfield').clear().type('Test').blur();
      cy.get('[data-cy=invalid-input').contains('Password must be 8 or more characters');

      // O: '', N: 'Test', C: ''
      cy.get('[data-cy=change-password-old-password-textfield').clear().blur();
      cy.get('[data-cy=change-password-new-password-textfield').clear().type('Test').blur();
      cy.get('[data-cy=invalid-input').contains('Password must be 8 or more characters');

      // O: '', N: 'Test1234', C: ''
      cy.get('[data-cy=change-password-new-password-textfield').clear().type('Test1234').blur();
      cy.get('[data-cy=invalid-input').contains(
        'Password must have characters with a combination of alphanumeric and special characters',
      );

      // O: 'Test1234', N: 'Test1234', C: ''
      cy.get('[data-cy=change-password-old-password-textfield').clear().type('Test1234').blur();
      cy.get('[data-cy=invalid-input').contains(
        'New password should not be same as the old password',
      );

      // O: 'Test1234', N: 'Test1234', C: 'Test'
      cy.get('[data-cy=change-password-confirmation-password-textfield')
        .clear()
        .type('Test')
        .blur();
      cy.get('[data-cy=invalid-input').contains('Password entries must match');
    });
    it('Successfully save change password changes', () => {
      // O: 'Akyrian!1', N: 'Password!2', C: 'Password!2'
      cy.get('[data-cy=change-password-old-password-textfield')
        .clear()
        .type(mockChangePasswordUserData.password)
        .blur();
      cy.get('[data-cy=change-password-new-password-textfield')
        .clear()
        .type(mockUpdatedChangePasswordUserData.password)
        .blur();
      cy.get('[data-cy=change-password-confirmation-password-textfield')
        .clear()
        .type(mockUpdatedChangePasswordUserData.password)
        .blur();
    });
  });

  describe('Submit edit password changes', () => {
    beforeEach(() => {
      cy.restoreLocalStorageCache();
    });

    afterEach(() => {
      cy.saveLocalStorageCache();
    });

    it('Submit changes', () => {
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasConfigureMyProfile) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=change-password-save-button]').click();
      cy.clearLocalStorage();
      cy.wait(`@${aliasConfigureMyProfile}`);
      cy.get('[data-cy=alert-success]').should(
        'have.text',
        'Please check your email to complete the pending profile updates',
      );
      cy.url().should('include', `/login`);
    });
  });

  describe('Should complete email verification', () => {
    before(() => {
      cy.clearLocalStorage();
    });

    it('Send OTP', () => {
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasGetUserFromToken) {
          req.alias = req.body.operationName;
        }
        if (req.body.operationName === aliasSendOtpChangeProfile) {
          req.alias = req.body.operationName;
        }
      });
      cy.visit(`${Cypress.env('REACT_APP_BASE_URL')}/change-profile/changeProfileToken`);
      cy.wait(`@${aliasGetUserFromToken}`);
      cy.wait(`@${aliasSendOtpChangeProfile}`).then((response: any) => {
        if (response.response) {
          cy.get('.ant-modal-body')
            .should('be.visible')
            .then(() => {
              cy.get('[data-cy=submit-otp]').should('be.disabled');
              Cypress.Promise.all([
                otpValue.map((value, i) => {
                  cy.get(`.otp-container > :nth-child(${i + 1})`).type(value);
                }),
                cy.get('[data-cy=submit-otp]').should('be.enabled'),
              ]);
            });
        }
      });
    });

    it('Submit OTP', () => {
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasValidateOtpChangeProfile) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=submit-otp]').click();
      cy.wait(`@${aliasValidateOtpChangeProfile}`).then(() => {
        cy.get('[data-cy=alert-success]').should('exist').contains('Your profile has been updated');
        cy.url().should('include', `/login`);
      });
    });

    it('Login with new credentials', () => {
      cy.fillInloginAsFormV2(mockUpdatedChangePasswordUserData);
      cy.saveLocalStorage();
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasMyProfile) {
          req.alias = req.body.operationName;
        }
      });
      cy.visit('/dashboard');
      cy.wait(`@${aliasMyProfile}`);
    });

    describe('Open Edit Profile Modal', () => {
      beforeEach(() => {
        cy.restoreLocalStorageCache();
      });

      afterEach(() => {
        cy.saveLocalStorageCache();
      });

      it('Open profile pullover', () => {
        cy.get('[data-cy=header-user-popover-trigger]').should('exist');
        cy.get('[data-cy=header-user-popover-trigger]').click();
      });
      it('Open the Edit Profile Modal', () => {
        cy.get('[data-cy=btn-edit-profile]').should('exist');
        cy.get('[data-cy=btn-edit-profile]').click();
        cy.get('[data-cy=modal-edit-profile]').should('exist');
      });
    });
  });
});
