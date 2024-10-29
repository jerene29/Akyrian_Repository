import {
  ResetPasswordDocument,
  SendOtpResetPasswordDocument,
  ValidateOtpResetPasswordDocument,
} from '../../../src/graphQL/generated/graphql';
describe('Forgot Password', () => {
  const generateArrayValue = (length: number, fill: string) => {
    const arr = Array(length).fill(fill);
    return arr;
  };

  const documentData: any = {
    resetPassword: ResetPasswordDocument.definitions[0],
    sendOtpResetPassword: SendOtpResetPasswordDocument.definitions[0],
    validateOtpResetPassword: ValidateOtpResetPasswordDocument.definitions[0],
  };

  const combination = {
    password: 'Password2@',
    confirmPassword: 'Password2@',
  };
  const otpValue = generateArrayValue(6, '9');

  const resetPasswordAlias = documentData.resetPassword.name.value;
  const sendOtpResetPasswordAlias = documentData.sendOtpResetPassword.name.value;
  const validateOtpResetPasswordAlias = documentData.validateOtpResetPassword.name.value;
  const userLoginAlias = 'userLogin';

  before(() => {
    cy.reseedDB();
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false;
    });
    cy.visit('/login');
    cy.waitForReact();
  });

  describe('Insert Email', () => {
    it('Check button & form forgot password', () => {
      cy.get('.forgot-password').click();
      cy.get('.reset-password-form').should('be.visible');
      cy.get('input[name="emailResetPassword"]').should('have.value', '');
      cy.get('#btn-submit-reset-password').should('be.disabled');
    });

    it('Fill Email and submit', () => {
      cy.get('input[name="emailResetPassword"]').type('forgot@mock.com');
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === resetPasswordAlias) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('#btn-submit-reset-password').should('be.enabled').click();
      cy.wait(`@${resetPasswordAlias}`).then((response) => {
        if (response.response) {
          cy.get('[data-cy=alert-success]')
            .should('exist')
            .contains(
              'If you have an account with us, we just sent you password reset instructions.',
            );
        }
      });
    });
  });

  describe('Create Password', () => {
    before(() => {
      cy.reseedDB();
      cy.visit(`${Cypress.env('REACT_APP_BASE_URL')}/reset-password/resetPasswordToken`);
    });

    it('Password should be empty', () => {
      cy.clearSetPasswordForm();
    });

    it('Insert Password & insert otp', () => {
      cy.fillSetPasswordForm(combination).then(() => {
        cy.intercept('POST', '/graphql', (req) => {
          if (req.body.operationName === sendOtpResetPasswordAlias) {
            req.alias = req.body.operationName;
          }
        });

        cy.get('[data-cy=login-button]').should('be.enabled').click();

        cy.wait(`@${sendOtpResetPasswordAlias}`).then((response: any) => {
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
    });

    it('Submit Otp', () => {
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === validateOtpResetPasswordAlias) {
          req.alias = req.body.operationName;
        }
      });

      cy.get('[data-cy=submit-otp]').click();

      cy.wait(`@${validateOtpResetPasswordAlias}`).then(() => {
        cy.get('[data-cy=alert-success]')
          .should('exist')
          .contains('The Password has been successfully updated');
        cy.url().should('include', `/login`);
      });
    });

    it('Error recently used password', () => {
      cy.visit(`${Cypress.env('REACT_APP_BASE_URL')}/reset-password/resetPasswordToken`);
      cy.clearSetPasswordForm();
      cy.fillSetPasswordForm(combination).then(() => {
        cy.intercept('POST', '/graphql', (req) => {
          if (req.body.operationName === sendOtpResetPasswordAlias) {
            req.alias = req.body.operationName;
          }
        });

        cy.get('[data-cy=login-button]').should('be.enabled').click();

        cy.get('[data-cy=error-alert]').should('exist');
        cy.visit('/login');
      });
    });

    it('Login with new Password', () => {
      cy.intercept('POST', '/api/auth/token?grantType=password', (req) => {
        req.alias = userLoginAlias;
      });

      cy.get('input[name="email"]').type('forgot@mock.com', { force: true });
      cy.get('input[name="password"]').type(combination.password, { force: true });
      cy.get('#loginAs-btn').click();

      cy.wait(`@${userLoginAlias}`).then((response) => {
        expect(response.response?.statusCode).to.eq(200);
        expect(response.response?.body.success).to.be.true;
        expect(response.response?.body.user).to.have.property('id', 'forgotMockUserIdProd');
      });
    });
  });

  describe('Resend Forgot Password', () => {
    before(() => {
      cy.clearAuthCookies();
      cy.visit(
        `${Cypress.env('REACT_APP_BASE_URL')}/reset-password-expired/forgotexpired@mock.com`,
      );
    });

    it('Submit Resend reset password', () => {
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === resetPasswordAlias) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('.resend-password').click();
      cy.wait(`@${resetPasswordAlias}`).then((response) => {
        if (response.response) {
          cy.get('[data-cy=alert-success]')
            .should('exist')
            .contains(
              'If you have an account with us, we just sent you password reset instructions.',
            );
        }
      });
    });
  });
});
