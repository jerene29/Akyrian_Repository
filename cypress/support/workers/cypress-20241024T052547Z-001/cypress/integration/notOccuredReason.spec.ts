import {
  GetVisitListDocument,
  GetPatientListDocument,
  LockPatientDocument,
} from '../../src/graphQL/generated/graphql';
import 'cypress-localstorage-commands';

describe('Test not occured reason', () => {
  const aliasPatientList = GetPatientListDocument.definitions[0].name.value;
  const aliasVisitList = GetVisitListDocument.definitions[0].name.value;
  const aliasLockPatient = LockPatientDocument.definitions[0].name.value;

  const interception = (operationName: any[]) => {
    cy.intercept('POST', '/graphql', (req) => {
      operationName.map((operation) => {
        if (req.body.operationName === operation) {
          req.alias = req.body.operationName;
        }
      });
    });
  };

  before(() => {
    cy.reseedDB();
    cy.clearLocalStorageSnapshot();
    cy.fillInloginAsFormV2({
      email: 'admin@example.com',
    });
    interception([aliasPatientList, aliasVisitList]);
    cy.visit('/visit');
    // cy.visit('/visit/testRevisionId1/toDaiHospital1/cks5x2rcs13134e3n36ytg34gy')
    cy.wait(`@${aliasPatientList}`);
    cy.wait(`@${aliasVisitList}`);
    cy.waitForReact();
  });

  beforeEach(() => {
    cy.waitForReact();
    cy.restoreLocalStorageCache();
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  it('add not occured reason in visit no source', () => {
    interception([aliasPatientList, aliasLockPatient, aliasVisitList]);
    cy.get('#multiSitePatient1-selectable-patient').click();
    cy.wait(`@${aliasLockPatient}`);
    cy.wait(`@${aliasVisitList}`);
    cy.get('[data-cy=visit-exitVisit1]').click();
    cy.get('[data-cy=select-visit-status]').click();
    cy.get('[data-cy=select-visit-status]').type('{downarrow}{enter}');
    cy.get('#select-visit-not-occured').click();
    cy.get('#select-visit-not-occured').type('{downarrow}{enter}', { force: true });
    cy.get('[data-cy=button-submit-visit]').click();
    cy.wait(6000);
    cy.logout();
  });
});

describe('Login using joy user', () => {
  const aliasPatientList = GetPatientListDocument.definitions[0].name.value;
  const aliasVisitList = GetVisitListDocument.definitions[0].name.value;
  const aliasLockPatient = LockPatientDocument.definitions[0].name.value;

  const interception = (operationName: any[]) => {
    cy.intercept('POST', '/graphql', (req) => {
      operationName.map((operation) => {
        if (req.body.operationName === operation) {
          req.alias = req.body.operationName;
        }
      });
    });
  };

  before(() => {
    cy.clearLocalStorageSnapshot();
    cy.visit('/login');
    cy.fillInloginAsFormV2({
      email: 'joy@example.com',
    });
    cy.saveLocalStorage();
    cy.waitForReact();
    interception([aliasPatientList, aliasVisitList]);
    cy.visit('/visit');
    cy.wait(`@${aliasPatientList}`);
    cy.wait(`@${aliasVisitList}`);
  });
  beforeEach(() => {
    cy.restoreLocalStorageCache();
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  it('Check exit visit not occur reason', () => {
    interception([aliasPatientList, aliasLockPatient, aliasVisitList]);
    cy.get('#multiSitePatient1-selectable-patient').click();
    cy.wait(`@${aliasLockPatient}`);
    cy.wait(`@${aliasVisitList}`);
    cy.wait(3000);
    cy.get('[data-cy=visit-exitVisit1]').click();
    cy.get('[data-cy=text-not-occured]').contains(
      'Akyrian Admin have stated this visit did not occur because',
    );
    cy.get('#status-not-occured').contains('Subject had transportation issues');
    cy.clearLocalStorage();
  });
});
