const goOffline = () => {
  cy.log('**go offline**')
    .then(() => {
      return Cypress.automation('remote:debugger:protocol', {
        command: 'Network.enable',
      });
    })
    .then(() => {
      return Cypress.automation('remote:debugger:protocol', {
        command: 'Network.emulateNetworkConditions',
        params: {
          offline: true,
          latency: -1,
          downloadThroughput: -1,
          uploadThroughput: -1,
        },
      });
    });
};

  /** This test was previously working with session.
   * Currently there is no way to create expired access token, so this test is skipped. */
  describe.skip('Expired Token status', () => {
  before(() => {
    cy.reseedDB();
    cy.clearLocalStorageSnapshot();
    localStorage.removeItem('SessionFeature');
    cy.visit('/login');
    cy.fillInloginAsFormV2({
      email: 'oak@example.com',
    });
    cy.saveLocalStorage();
  });

  beforeEach(() => {
    cy.restoreLocalStorageCache();
    localStorage.removeItem('SessionFeature');
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
    localStorage.removeItem('SessionFeature');
  });

  describe('Set Expired Token', () => {
    it('Success', () => {
      cy.url()
        .should('include', '/dashboard')
        .then(() => {
          cy.customRequest(null, {
            updateUserInput: {
              email: 'oak@example.com',
              expiresAt: '2021-09-12T08:39:45.815Z',
            },
          }).then((res) => {
            console.log(res, 'response');
            cy.wait(1000);
            cy.url().should('include', '/login');
            cy.get('.text-error').should(
              'have.text',
              'Session timed out, you have been logged out',
            );
          });
        });
    });
  });
});

// Enable this once the issue with error message is fixed
describe.skip('Invalid Token status', () => {
  before(() => {
    cy.clearLocalStorageSnapshot();
    cy.visit('/login');
    cy.fillInloginAsFormV2({
      email: 'oak@example.com',
    });
    localStorage.removeItem('SessionFeature');
    cy.saveLocalStorage();
  });

  beforeEach(() => {
    cy.restoreLocalStorageCache();
    localStorage.removeItem('SessionFeature');
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
    localStorage.removeItem('SessionFeature');
  });

  describe('Set Invalid Token', () => {
    it('Success', () => {
      cy.url()
        .should('include', '/dashboard')
        .then(() => {
          cy.clearLocalStorage();
          cy.clearAuthCookies();
          cy.wait(1000);
          cy.url().should('include', '/login');
          cy.get('.text-error').should('have.text', 'Session invalid: logged out');
        });
    });
  });
});

describe('No Internet connection status', () => {
  before(() => {
    cy.clearLocalStorageSnapshot();
    cy.visit('/login');
    cy.fillInloginAsFormV2({
      email: 'oak@example.com',
    });
    cy.saveLocalStorage();
    localStorage.removeItem('SessionFeature');
  });

  beforeEach(() => {
    cy.restoreLocalStorageCache();
    localStorage.removeItem('SessionFeature');
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
    localStorage.removeItem('SessionFeature');
  });

  describe('Set browser offline', () => {
    it('Success', () => {
      cy.url()
        .should('include', '/dashboard')
        .then(() => {
          goOffline();
          cy.wait(1000);
          cy.get('.text-error', { timeout: 10000 }).should(
            'have.text',
            'There is no internet connection. Please try again later',
          );
        });
    });
  });
});
