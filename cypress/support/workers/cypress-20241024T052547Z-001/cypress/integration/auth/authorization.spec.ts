import {
  SendOtpRegistrationDocument,
  ValidateOtpRegistrationDocument,
  AcceptPolicyDocument,
  StudyCollectionDocument,
  GetStudyRevisionListDocument,
  IStudyEnvironment,
  IStudyRevisionWithCountDetailFragment,
  StudyCollectionCountDocument,
  IStudyCollectionCategory,
} from '../../../src/graphQL/generated/graphql';
import { formatPhoneNumber, formatPhoneNumberIntl } from 'react-phone-number-input';

describe('Authorization', () => {
  before(() => {
    cy.reseedDB();
  });

  const AUTH_URL = `${Cypress.env('REACT_APP_BASE_URL')}/authorization/mockInvitationToken`;
  const invalidEmail = 'Email address is invalid';
  const passwordWithCombination =
    'Password must characters with a combination of alphanumeric and special characters';
  const lessPassword = 'Password requires a minimum of one lowercase and one uppercase letter';
  const password = {
    combination: {
      password: 'Password!1',
      confirmPassword: 'Password!1',
    },
    invalid: {
      password: '12345678',
      confirmPassword: '12345678',
    },
    different: {
      password: 'Akyrian!1',
      confirmPassword: 'Akyrian2022',
    },
    tooShort: {
      password: '1234567',
      confirmPassword: '1234567',
    },
    requireUpperCase: {
      password: 'password!1',
      confirmPassword: 'password!1',
    },
  };

  const passwordForType = !Cypress.env('TESTRUNNER_ENV') ? 'Password!1' : 'Akyrian!1';

  const generateArrayValue = (length: number, fill: string) => {
    const arr: Array<string> = Array(length).fill(fill);
    return arr;
  };

  const listEnvStudy = [
    IStudyEnvironment.Production,
    IStudyEnvironment.Uat,
    IStudyEnvironment.Staging,
    IStudyEnvironment.Development,
  ];

  const getStudyFilter = (
    studyFilter: IStudyRevisionWithCountDetailFragment[],
    search?: string,
  ) => {
    const newStudyFilters: any = listEnvStudy.map((list) => {
      const newStudy: any = {};

      let filteredBySearch = studyFilter;
      if (search) {
        filteredBySearch = filteredBySearch.filter((study) => {
          return study.study.name.toLowerCase().includes(search.toLowerCase());
        });
      }

      filteredBySearch = filteredBySearch.filter((study) => {
        return study.environment === list;
      });

      newStudy.list = filteredBySearch;
      newStudy.count = filteredBySearch.length;
      newStudy.env = list;
      return newStudy;
    });

    return newStudyFilters.reverse();
  };

  const submitPassword = (alias: any, withCancel = false, expectSuccess = true) => {
    const otpValue = generateArrayValue(6, '9');
    cy.clearSetPasswordForm();
    cy.fillSetPasswordForm(password.combination).then(() => {
      cy.get('[data-cy=login-button]').should('be.enabled').click();
      cy.wait(`@${alias}`).then((response: any) => {
        if (expectSuccess) {
          const phone = formatPhoneNumber(
            response.response.body.data.sendOTPRegistration.user.phone,
          );
          const code = formatPhoneNumberIntl(
            response.response.body.data.sendOTPRegistration.user.phone,
          );
          const dialingCode = code.split(' ')[0];
          const checkFrontNumberPhone =
            response.response.body.data.sendOTPRegistration.user.phone.includes('+');
          const resultPhoneNumber = checkFrontNumberPhone
            ? `(${dialingCode}) ${phone}`
            : response.response.body.data.sendOTPRegistration.user.phone;
          cy.get('.ant-modal-body')
            .should('be.visible')
            .then(() => {
              cy.get('[data-cy=submit-otp]').should('be.disabled');
              cy.get('#phone').should('have.text', resultPhoneNumber);
              if (withCancel) {
                cy.get('[data-cy=cancel-otp]')
                  .click()
                  .then(() => {
                    cy.visit('/login');
                  });
              } else {
                otpValue.map((value, i) => {
                  cy.get(`.otp-container > :nth-child(${i + 1})`).should('have.text', '');
                });
              }
            });
        } else {
          // This should be for an invitation error or if the user already registered
          cy.get('.alert-error')
            .should('exist')
            .then(() => {
              cy.visit('/login');
            });
        }
      });
    });
  };

  const handleSubmitAcceptPolicy = (alias: any, alias2: any, onLogin = false) => {
    cy.get('[data-cy=submit-accept-policy]').should('be.enabled').click();
    cy.wait(`@${alias}`);
    cy.wait(`@${alias2}`);
    if (!onLogin) {
      cy.get('[data-cy=alert-success]').should('exist');
    }
    cy.visit(`${Cypress.env('REACT_APP_BASE_URL')}/dashboard`);
    cy.url().should('eq', `${Cypress.env('REACT_APP_BASE_URL')}/dashboard`);
  };

  describe('Create Password', () => {
    describe('Failed fill password', () => {
      beforeEach(() => {
        cy.visit(AUTH_URL);
      });

      it('Fill a password that is invalid and check for errors', () => {
        cy.clearSetPasswordForm();
        cy.fillSetPasswordForm(password.invalid);
        cy.get('[data-cy=login-button]').should('be.disabled');
        cy.get('[data-cy=invalid-input]').contains('combination');
      });

      it('Fill a password that is too short and check for errors', () => {
        cy.clearSetPasswordForm();
        cy.fillSetPasswordForm(password.tooShort);
        cy.get('[data-cy=login-button]').should('be.disabled');
        cy.get('[data-cy=invalid-input]').contains('8');
      });

      it('Fill a password that is invalid combinations and check for errors', () => {
        cy.clearSetPasswordForm();
        cy.fillSetPasswordForm(password.requireUpperCase);
        cy.get('[data-cy=login-button]').should('be.disabled');
        cy.get('[data-cy=invalid-input]').should(
          'have.text',
          'Password requires a minimum of one lowercase and one uppercase letter',
        );
      });

      it('Fill password & confirm password different value ', () => {
        cy.clearSetPasswordForm();
        cy.fillSetPasswordForm(password.different);
      });
    });

    describe('Success fill password', () => {
      const alias = SendOtpRegistrationDocument.definitions[0].name.value;

      before(() => {
        cy.visit(AUTH_URL);
        cy.intercept('POST', '/graphql', (req) => {
          if (req.body.operationName === alias) {
            req.alias = req.body.operationName;
          }
        });
      });

      it('Successfully set the password if the password & confirm password are combination of alphanumeric and special characters that matched', () => {
        submitPassword(alias);
      });
    });
    describe('Modal OTP visible', () => {
      describe('Less OTP value', () => {
        let tooShortOtp: Array<string> = [];

        before(() => {
          tooShortOtp = generateArrayValue(3, '0');
        });

        it('input less otp value', () => {
          Cypress.Promise.all([
            tooShortOtp.map((value, i) => {
              cy.get(`.otp-container > :nth-child(${i + 1})`).type(value);
            }),
            cy.get('[data-cy=submit-otp]').should('be.disabled'),
          ]);
        });

        it('Remove Otp value', () => {
          Cypress.Promise.all([
            tooShortOtp.map((value: any, i: number) => {
              cy.get(`.otp-container > :nth-child(${tooShortOtp.length + 1 - (i + 1)})`).type(
                '{backspace}',
              );
              cy.get(`.otp-container > :nth-child(${tooShortOtp.length + 1 - (i + 1)})`).should(
                'have.text',
                '',
              );
            }),
          ]);
        });
      });

      describe('Invalid OTP value', () => {
        const alias = ValidateOtpRegistrationDocument.definitions[0].name.value;
        const alias2 = SendOtpRegistrationDocument.definitions[0].name.value;
        let invalidValue: Array<string> = [];

        before(() => {
          invalidValue = generateArrayValue(6, '0');
        });

        beforeEach(() => {
          cy.intercept('POST', '/graphql', (req) => {
            if (req.body.operationName === alias) {
              req.alias = req.body.operationName;
            }
            if (req.body.operationName === alias2) {
              req.alias = req.body.operationName;
            }
          });
        });

        it('input invalid otp value', () => {
          Cypress.Promise.all([
            invalidValue.map((value: any, i: number) => {
              cy.get(`.otp-container > :nth-child(${i + 1})`).type(value);
            }),
            cy.get('[data-cy=submit-otp]').should('be.enabled'),
          ]);
        });

        it('Submit otp', () => {
          cy.get('[data-cy=submit-otp]').click();
          cy.wait(`@${alias}`);
          cy.get('[data-cy=desc-invalid-otp]').should(
            'have.text',
            'Invalid OTP. Please recheck your OTP code or click resend button to issue a new OTP.',
          );
          cy.get('[data-cy=submit-otp]').should('have.text', 'Resend');
          invalidValue.map((__, i) => {
            cy.get(`.otp-container > :nth-child(${i + 1})`).should('have.text', '');
          });
        });

        it('Resend otp', () => {
          cy.get('[data-cy=submit-otp]').click();
          cy.wait(`@${alias2}`);
          cy.get('[data-cy=submit-otp]').should('be.disabled');
        });

        // it('Time out count down', () => {
        //   cy.wait(300000);
        //   cy.get('[data-cy=desc-invalid-otp]').should('have.text', 'Your OTP has been expired, please resend it.');
        // });
      });

      describe('valid OTP value', () => {
        const aliases = ValidateOtpRegistrationDocument.definitions[0].name.value;
        let validValue: string[] = [];

        before(() => {
          validValue = generateArrayValue(6, '9');
        });

        beforeEach(() => {
          cy.intercept('POST', '/graphql', (req) => {
            if (req.body.operationName === aliases) {
              req.alias = req.body.operationName;
            }
          });
          cy.restoreLocalStorageCache();
        });

        afterEach(() => {
          cy.saveLocalStorageCache();
        });

        it('input valid otp value', () => {
          Cypress.Promise.all([
            validValue.map((value, i) => {
              cy.get(`.otp-container > :nth-child(${i + 1})`).type(value);
            }),
            cy.get('[data-cy=submit-otp]').should('be.enabled'),
          ]);
        });

        it('submit otp', () => {
          cy.get('[data-cy=submit-otp]').click();
          cy.wait(`@${aliases}`);
          cy.get('#title-privacy').should('have.text', 'Privacy & Policy');
        });
      });

      describe('Submit Accept Policy', () => {
        const acceptPolicyAlias = AcceptPolicyDocument.definitions[0].name.value;
        const loginAlias = 'login';

        before(() => {
          cy.intercept('POST', '/graphql', (req) => {
            if (req.body.operationName === acceptPolicyAlias) {
              req.alias = req.body.operationName;
            }
          });
          cy.intercept('POST', '/api/auth/token?grantType=password', (req) => {
            req.alias = loginAlias;
          });
        });

        beforeEach(() => {
          cy.restoreLocalStorageCache();
        });

        afterEach(() => {
          cy.saveLocalStorageCache();
        });

        it('Submit and Success', () => {
          cy.get('[data-cy=submit-accept-policy]').should('be.enabled').click();
          cy.wait(`@${acceptPolicyAlias}`);
          cy.wait(`@${loginAlias}`);
          cy.get('[data-cy=alert-success]').should('exist');
          cy.url().should('eq', `${Cypress.env('REACT_APP_BASE_URL')}/dashboard`);
        });
      });
    });

    describe('User has been registered', () => {
      const alias = SendOtpRegistrationDocument.definitions[0].name.value;

      before(() => {
        cy.clearAuthCookies();
        cy.clearLocalStorage();
        cy.visit(AUTH_URL);
        cy.intercept('POST', '/graphql', (req) => {
          if (req.body.operationName === alias) {
            req.alias = req.body.operationName;
          }
        });
      });

      // TODO: simulate expired invitation -> seed db with legit invitation link, open the link, modify the link to be expired
      it('Fails with an error message if user has been registered', () => {
        submitPassword(alias, false, false);
      });
      //
    });
  });

  // =================== MUST EDIT USER ON DATABASE ======================

  // describe(('Create password & Login'), () => {

  //   describe(('Create Password'), () => {
  //     const alias = SendOtpRegistrationDocument.definitions[0].name.value;

  //     before(() => {
  //       cy.visit(AUTH_URL);
  //       cy.intercept('POST', '/graphql', req => {
  //         if (req.body.operationName === alias) {
  //           req.alias = req.body.operationName;
  //         }
  //       });
  //     });

  //     it('Fill password ', () => {
  //       submitPassword(alias);
  //     });
  //   });

  //   describe(('Insert Otp and Close Accept Policy'), () => {
  //     const aliases = ValidateOtpRegistrationDocument.definitions[0].name.value;
  //     let validValue = [];

  //     before(() => {
  //       validValue = generateArrayValue(6, '9');
  //     });

  //     beforeEach(() => {
  //       cy.intercept('POST', '/graphql', req => {
  //         if (req.body.operationName === aliases) {
  //           req.alias = req.body.operationName;
  //         }
  //       });
  //       cy.restoreLocalStorageCache();
  //     });

  //     afterEach(() => {
  //       cy.saveLocalStorageCache();
  //     });

  //     it(('input otp'), () => {
  //       Cypress.Promise.all([
  //         validValue.map((value, i) => {
  //           cy.get(`.otp-container > :nth-child(${i + 1})`).type(value);
  //         }), cy.get('[data-cy=submit-otp]').should('be.enabled')
  //       ]);
  //     });

  //     it(('submit otp'), () => {
  //       cy.get('[data-cy=submit-otp]').click();
  //       cy.wait(`@${aliases}`);
  //       cy.get('#title-privacy').should('have.text', 'Privacy & Policy')
  //         .then(() => {
  //           cy.get('[data-cy=submit-cancel-policy]').click();
  //         });
  //     });

  //   });

  //   describe(('Fill Password and redirect to login'), () => {
  //     const alias = SendOtpRegistrationDocument.definitions[0].name.value;

  //     before(() => {
  //       cy.intercept('POST', '/graphql', req => {
  //         if (req.body.operationName === alias) {
  //           req.alias = req.body.operationName;
  //         }
  //       });
  //     });

  //     it('Fill password ', () => {
  //       submitPassword(alias);
  //     });
  //   });

  //   describe(('Fill Email And Password at login page'), () => {
  //     const loginAlias = UserLoginDocument.definitions[0].name.value;
  //     let responseLogin;

  //     before(() => {
  //       cy.intercept('POST', '/graphql', req => {
  //         if (req.body.operationName === loginAlias) {
  //           req.alias = req.body.operationName;
  //         }
  //       });
  //       cy.clearLocalStorage();

  //       cy.fillInloginAsForm({
  //         email: 'invited@mock.com',
  //         password: 'password',
  //       });

  //       cy.wait(3000);
  //       responseLogin = JSON.parse(localStorage.getItem('loginAs'));

  //     });

  //     beforeEach(() => {
  //       cy.restoreLocalStorageCache();
  //       responseLogin = JSON.parse(localStorage.getItem('loginAs'));
  //     });

  //     afterEach(() => {
  //       cy.saveLocalStorageCache();
  //       responseLogin = JSON.parse(localStorage.getItem('loginAs'));
  //     });

  //     it(('Modal Accept Policy Visible'), () => {
  //       if (responseLogin) {
  //         if (responseLogin.success) {
  //           cy.url().should('eq', `${Cypress.env('REACT_APP_BASE_URL')}/dashboard`);
  //         } else {
  //           if (responseLogin.reason === IUserLoginFailureReason.UnfinishedAppPolicyProcess) {
  //             cy.get('.ant-modal-body').should('be.visible');
  //             cy.get('#title-privacy').should('have.text', 'Privacy & Policy');
  //           }
  //         }
  //       }
  //     });

  //   });

  //   describe(('Modal Accept Policy'), () => {
  //     const alias = AcceptPolicyDocument.definitions[0].name.value;
  //     const alias2 = UserLoginDocument.definitions[0].name.value;

  //     before(() => {
  //       cy.intercept('POST', '/graphql', req => {
  //         if (req.body.operationName === alias) {
  //           req.alias = req.body.operationName;
  //         }

  //         if (req.body.operationName === alias2) {
  //           req.alias = req.body.operationName;
  //         }
  //       });
  //       cy.clearLocalStorage();
  //     });

  //     beforeEach(() => {
  //       cy.restoreLocalStorageCache();
  //     });

  //     afterEach(() => {
  //       cy.saveLocalStorageCache();
  //     });

  //     it(('Submit Accept Policy'), () => {
  //       handleSubmitAcceptPolicy(alias, alias2, true);
  //     });

  //     it(('Success Accept Policy'), () => {
  //       cy.get('.text-overlap').should('exist');
  //     });

  //   });

  //   describe(('Fill Password without submit otp'), () => {
  //     const alias = SendOtpRegistrationDocument.definitions[0].name.value;

  //     before(() => {
  //       cy.visit(AUTH_URL);
  //       cy.intercept('POST', '/graphql', req => {
  //         if (req.body.operationName === alias) {
  //           req.alias = req.body.operationName;
  //         }
  //       });
  //     });

  //     it('Redirect to login', () => {
  //       submitPassword(alias, true);
  //     });

  //   });

  //   describe(('Fill Email And Password at login page'), () => {
  //     const loginAlias = UserLoginDocument.definitions[0].name.value;
  //     const aliases = ValidateOtpRegistrationDocument.definitions[0].name.value;
  //     let responseLogin;
  //     let validValue = [];

  //     before(() => {
  //       cy.intercept('POST', '/graphql', req => {
  //         if (req.body.operationName === loginAlias) {
  //           req.alias = req.body.operationName;
  //         }
  //         validValue = generateArrayValue(6, '9');
  //       });
  //       cy.clearLocalStorage();

  //       cy.fillInloginAsForm({
  //         email: 'invited@mock.com',
  //         password: 'password',
  //       });

  //       cy.wait(3000);
  //       responseLogin = JSON.parse(localStorage.getItem('loginAs'));

  //     });

  //     beforeEach(() => {
  //       cy.restoreLocalStorageCache();
  //       responseLogin = JSON.parse(localStorage.getItem('loginAs'));

  //       cy.intercept('POST', '/graphql', req => {
  //         if (req.body.operationName === aliases) {
  //           req.alias = req.body.operationName;
  //         }
  //       });
  //     });

  //     afterEach(() => {
  //       cy.saveLocalStorageCache();
  //       responseLogin = JSON.parse(localStorage.getItem('loginAs'));
  //     });

  //     it(('Modal OTP Visible'), () => {
  //       if (responseLogin) {
  //         if (responseLogin.success) {
  //           cy.url().should('eq', `${Cypress.env('REACT_APP_BASE_URL')}/dashboard`);
  //         } else {
  //           if (responseLogin.reason === IUserLoginFailureReason.UnfinishedAppPolicyProcess) {
  //             cy.get('.ant-modal-body').should('be.visible');
  //             cy.get('[data-cy=submit-otp]').should('be.disabled');
  //           }
  //         }
  //       }
  //     });

  //     it(('input otp'), () => {
  //       Cypress.Promise.all([
  //         validValue.map((value, i) => {
  //           cy.get(`.otp-container > :nth-child(${i + 1})`).type(value);
  //         }), cy.get('[data-cy=submit-otp]').should('be.enabled')
  //       ]);
  //     });

  //     it(('submit otp'), () => {
  //       cy.get('[data-cy=submit-otp]').click();
  //       cy.wait(`@${aliases}`);
  //     });

  //   });

  //   describe(('Modal Accept Policy'), () => {
  //     const alias = AcceptPolicyDocument.definitions[0].name.value;
  //     const alias2 = UserLoginDocument.definitions[0].name.value;

  //     before(() => {
  //       cy.intercept('POST', '/graphql', req => {
  //         if (req.body.operationName === alias) {
  //           req.alias = req.body.operationName;
  //         }

  //         if (req.body.operationName === alias2) {
  //           req.alias = req.body.operationName;
  //         }
  //       });
  //       cy.clearLocalStorage();
  //     });

  //     beforeEach(() => {
  //       cy.restoreLocalStorageCache();
  //     });

  //     afterEach(() => {
  //       cy.saveLocalStorageCache();
  //     });

  //     it(('Submit Accept Policy'), () => {
  //       handleSubmitAcceptPolicy(alias, alias2, true);
  //     });

  //     it(('Success Accept Policy'), () => {
  //       cy.get('.text-overlap').should('exist');
  //     });

  //   });

  // });

  // =================== LOGIN PAGE ======================
  describe('Login Page', () => {
    const userLoginAlias = 'login';

    before(() => {
      cy.clearLocalStorage();
      cy.visit('/login');
    });

    beforeEach(() => {
      cy.visit('/login');
    });

    it('Empty Field', () => {
      cy.get('input[name="email"]').should('have.value', '');
      cy.get('input[name="password"]').should('have.value', '');
      cy.get('#loginAs-btn').should('be.disabled');
    });

    it.skip('Wrong email & Password', () => {
      cy.get('input[name="email"]').type('admin@com', { force: true });
      cy.get('input[name="password"]').type('123456789', { force: true }).blur();
      cy.get('#loginAs-btn').should('be.disabled');
      cy.get('[data-cy=invalid-input]').each((element, index) => {
        cy.wrap(element).should('have.text', index === 0 ? invalidEmail : passwordWithCombination);
      });
    });

    it.skip('Wrong Password', () => {
      cy.get('input[name="email"]').type('admin@example.com', { force: true });
      cy.get('input[name="password"]').type('password!1', { force: true }).blur();
      cy.get('#loginAs-btn').should('be.disabled');
      cy.get('[data-cy=invalid-input]').each((element, index) => {
        cy.wrap(element).should('have.text', lessPassword);
      });
    });

    it('correct Password', () => {
      cy.get('input[name="email"]').type('admin@example.com', { force: true });
      cy.get('input[name="password"]').type(passwordForType, { force: true }).blur();
      cy.get('#loginAs-btn').should('be.enabled');
      cy.get('[data-cy=invalid-input]').should('not.exist');
    });

    it('Wrong email or password', () => {
      cy.get('input[name="email"]').type('admin@exampe.com', { force: true });
      cy.get('input[name="password"]').type(passwordForType, { force: true }).blur();
      cy.get('[data-cy=invalid-input]').should('not.exist');

      cy.intercept('POST', '/api/auth/token?grantType=password', (req) => {
        req.alias = userLoginAlias;
      });
      cy.get('#loginAs-btn').should('be.enabled').click();
      cy.wait(`@${userLoginAlias}`);
      cy.get('.text-error').should('exist');
    });
  });

  // =================== LANDING PAGE ======================

  describe('Landing page', () => {
    const aliasStudyRevision = GetStudyRevisionListDocument.definitions[0].name.value;
    const aliasStudyRevisionWithCount = StudyCollectionCountDocument.definitions[0].name.value;
    const aliasStudyCollection = StudyCollectionDocument.definitions[0].name.value;
    let organizationId: any = '';
    let studyOrganizations: any = [];
    let studyRevisonList: any = { studyRevisionList: { studyRevisions: {} } };
    let loginAs: any;
    let studyRevisonListCount: any = [];
    let studyCollection: any = [];
    let dataStudyRevision: any;
    let filterStudy: any = [];
    let filterNotFoundStudy = [];
    const searchFound = 'cvd';
    const searchNotFound = 'hello';

    before(() => {
      cy.clearLocalStorageSnapshot();
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasStudyRevision) {
          req.alias = req.body.operationName;
        }
        if (req.body.operationName === aliasStudyRevisionWithCount) {
          req.alias = req.body.operationName;
        }

        if (req.body.operationName === aliasStudyCollection) {
          req.alias = req.body.operationName;
        }
      });

      cy.fillInloginAsForm({
        email: 'sister@example.com',
      });

      cy.wait(`@${aliasStudyRevision}`).then((response: any) => {
        if (response.response.body.data) {
          studyRevisonList = response.response.body.data;
        }
      });

      cy.wait(`@${aliasStudyRevisionWithCount}`).then((response: any) => {
        if (response.response.body.data) {
          studyRevisonListCount = response.response.body.data;
        }
      });

      cy.wait(`@${aliasStudyCollection}`).then((response: any) => {
        if (response.response.body.data) {
          studyCollection = response.response.body.data;
        }
      });
      cy.waitForReact();
    });

    beforeEach(() => {
      cy.restoreLocalStorageCache();
      cy.wrap(loginAs).then(() => {
        loginAs = JSON.parse(localStorage.getItem('loginAs') || `{}`);
        if (loginAs) {
          organizationId = loginAs.user.organizationId;
          studyOrganizations = loginAs.user.studyOrganizations;
        }
      });
    });

    afterEach(() => {
      cy.wrap(loginAs).then(() => {
        loginAs = JSON.parse(localStorage.getItem('loginAs') || `{}`);
        if (loginAs) {
          organizationId = loginAs.user.organizationId;
          studyOrganizations = loginAs.user.studyOrganizations;
        }
      });
      cy.saveLocalStorageCache();
    });

    describe('on login', () => {
      it('Check organization default value', () => {
        console.log(studyOrganizations);
        cy.wrap(studyOrganizations).then(() => {
          if (studyOrganizations) {
            cy.get('.ant-select-selection-item').should('have.text', studyOrganizations[0].name);
          }
        });
      });

      it('Check organization list value', () => {
        cy.wrap(studyOrganizations).then(() => {
          if (studyOrganizations) {
            cy.get('.ant-select-selection-item').click();
            cy.get('.ant-select-item-option-content').each((el, index) => {
              expect(el).to.have.text(studyOrganizations[index].name);
            });
          }
        });
      });

      it('Check organization list value', () => {
        // cy.get('body').click();
      });
    });

    describe('Study List', () => {
      before(() => {
        dataStudyRevision = studyRevisonList.studyRevisionList.studyRevisions;
        filterStudy = getStudyFilter(dataStudyRevision, '');
      });

      it('Checking button list count', () => {
        cy.get('[data-cy=btn-list-env]').each((element, index) => {
          cy.wrap(filterStudy[index].count).then(() => {
            if (filterStudy[index].count) {
              expect(element).to.have.text(`${filterStudy[index].env}${filterStudy[index].count}`);
            }
          });
        });
      });

      describe('Study Length and value', () => {
        it('Checking study list length and value', () => {
          const count = studyCollection.studyCollection[0].studyRevisions.length;
          cy.get('[data-cy=btn-list-env]').each((element, index) => {
            cy.wrap(element)
              .click()
              .then(() => {
                cy.wrap(filterStudy).then(() => {
                  if (filterStudy[index].count) {
                    cy.get('[data-cy=card-study]').should('have.length', filterStudy[index].count);
                    cy.get('[data-cy=card-study]').each((ele, i) => {
                      if (filterStudy[index].list[i].status !== 'ACTIVE') {
                        cy.get('[data-cy=card-status-indicator]').each((ele, n) => {
                          cy.wrap(ele).should('exist');
                        });
                      }
                      cy.get('#study-namemain').each((ele, n) => {
                        cy.wrap(ele).should('have.text', filterStudy[index].list[n].study.name);
                      });
                      cy.get('#study-versionmain').each((ele, n) => {
                        cy.wrap(ele).should(
                          'have.text',
                          `v.${filterStudy[index].list[n].majorVersion}.${filterStudy[index].list[n].minorVersion}`,
                        );
                      });
                      cy.get('#study-protocolmain').each((ele, n) => {
                        cy.wrap(ele).should(
                          'have.text',
                          'Protocol : ' + filterStudy[index].list[n].protocol,
                        );
                        cy.wrap(n).then(() => {
                          if (filterStudy[index].list[n].countVisit > 0) {
                            cy.get('#study-count-visitmain')
                              .eq(n)
                              .should(
                                'have.text',
                                filterStudy[index].list[n].countVisit + 'Visits',
                              );
                          }
                          if (filterStudy[index].list[n].countFFG > 0) {
                            cy.get('#study-count-questionmain')
                              .eq(n)
                              .should(
                                'have.text',
                                filterStudy[index].list[n].countFFG + 'Questions',
                              );
                          }
                        });
                      });
                      cy.get('[data-cy=auditlog-comment]').should('not.exist');
                    });
                  }
                });
              });
          });
        });
      });

      describe('read new assigned study', () => {
        const studyCollectionDocument: any = StudyCollectionDocument.definitions[0];
        const aliasStudyCollections = studyCollectionDocument.name.value;
        const studyRevisionListData = [];
        before(() => {
          Cypress.on('uncaught:exception', (err, runnable) => {
            return false;
          });
          cy.waitForReact();
        });

        it('Check count', () => {
          cy.wrap(studyRevisonListCount).then(() => {
            const filtered = studyRevisonListCount.studyCollectionCount.filter(
              (study: any) => study.category !== IStudyCollectionCategory.RecentlyViewed,
            );
            cy.get('[data-cy=btn-study]').each((element, index) => {
              cy.wrap(element)
                .should(
                  'have.text',
                  `${filtered[index].unreadCount}${filtered[index].collectionName}`,
                )
                .click()
                .then(() => {
                  cy.wait(1500);
                  cy.getStudyListSidebar(StudyCollectionDocument, filtered[index].category).then(
                    (res) => {
                      if (res && res[0].studyRevisions.length) {
                        cy.checkCount(res[index].studyRevisions.length);
                      }
                    },
                  );
                  cy.wait(2000);
                });
            });
          });
        });
      });

      describe('Count should be 0', () => {
        const aliasesSidebar = StudyCollectionCountDocument.definitions[0].name.value;
        before(() => {
          // cy.intercept('POST', '/graphql', req => {
          //   if (req.body.operationName === bangsul) {
          //     req.alias = req.body.operationName;
          //   }
          // });
        });

        it('Back to All studies', () => {
          cy.intercept('POST', '/graphql', (req) => {
            if (req.body.operationName === aliasesSidebar) {
              req.alias = req.body.operationName;
            }
          });
          cy.get('[data-cy=back-study]').click({ force: true });
          cy.wait(`@${aliasesSidebar}`).then((res: any) => {
            if (res.response.body.data) {
              studyRevisonListCount = res.response.body.data;
              const filteredStudy = studyRevisonListCount.studyCollectionCount.filter(
                (study: any) => study.category !== IStudyCollectionCategory.RecentlyViewed,
              );
              cy.get('[data-cy=btn-study]').each((element, index) => {
                cy.wrap(element).should(
                  'have.text',
                  `${
                    filteredStudy[index].category === IStudyCollectionCategory.NewAssigned
                      ? 0
                      : filteredStudy[index].unreadCount
                  }${filteredStudy[index].collectionName}`,
                );
              });
            }
          });
        });
      });

      describe('Search Study', () => {
        before(() => {
          filterNotFoundStudy = getStudyFilter(dataStudyRevision, searchFound);
          filterStudy = getStudyFilter(dataStudyRevision, searchFound);
          filterStudy = filterStudy.filter((study: any) => study.count !== 0);
        });

        it('Checking found study', () => {
          cy.get('[data-cy=onboarding-search-study]').click();
          cy.get('#search')
            .type(searchFound)
            .then(() => {
              cy.get('[data-cy=btn-list-env]')
                .each((element, index) => {
                  cy.wrap(element)
                    .click()
                    .then(() => {
                      cy.wrap(getStudyFilter(dataStudyRevision, searchFound)[index].count).then(
                        () => {
                          if (getStudyFilter(dataStudyRevision, searchFound)[index].count) {
                            expect(element).to.have.text(
                              `${getStudyFilter(dataStudyRevision, searchFound)[index].env}${
                                getStudyFilter(dataStudyRevision, searchFound)[index].count
                              }`,
                            );
                            cy.get('#study-count').should(
                              'have.text',
                              `Result: ${
                                getStudyFilter(dataStudyRevision, searchFound)[index].count
                              } out of ${dataStudyRevision.length} Studies`,
                            );
                          }
                        },
                      );
                    });
                })
                .then(() => {
                  cy.get('#search').type('{selectall}{backspace}');
                });
            });
        });

        it('Checking not found study', () => {
          cy.get('#search')
            .type(searchNotFound)
            .then(() => {
              cy.get('#env-selector-DEVELOPMENT').contains('0');
              cy.get('#env-selector-STAGING').contains('0');
              cy.get('#env-selector-UAT').contains('0');
              cy.get('#env-selector-PRODUCTION').contains('0');
              cy.get('[data-cy=card-study]').should('not.exist');
            });
          cy.get('#study-count').should(
            'have.text',
            `Result: 0 out of ${dataStudyRevision.length} Studies`,
          );
        });
      });
    });
  });
});
