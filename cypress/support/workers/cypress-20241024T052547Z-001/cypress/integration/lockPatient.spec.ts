import {
  GetPatientListDocument,
  LockPatientDocument,
  ReleasePatientLockDocument,
} from '../../src/graphQL/generated/graphql';
import client from '../utils/client';

import 'cypress-localstorage-commands';
import { mockUserDataAdmin } from '../../src/constant/testFixtures';

describe('Locking an unlocked patient', () => {
  let sitePatientList = [];
  let lockPatientObject = [];

  const aliasGetPatient = GetPatientListDocument.definitions[0].name.value;
  const aliasLockPatient = LockPatientDocument.definitions[0].name.value;

  before(() => {
    cy.clearLocalStorageSnapshot();
    cy.fillInloginAsFormV2(mockUserDataAdmin);
    cy.saveLocalStorage();
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasGetPatient) {
        req.alias = aliasGetPatient;
      }
    });
    cy.visit('/visit');
    cy.waitForReact();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  it('Select patient and save the data', () => {
    cy.wait(`@${aliasGetPatient}`).then((result) => {
      if (result.response?.statusCode === 200) {
        if (result.response.body.data) {
          sitePatientList = result.response.body.data.sitePatientList;
        } else {
          throw new Error(`Get Patient List: ${result.response.body.errors[0].message}`);
        }
      }
    });
  });

  it('Validate whether lockPatient object is null before locking and release it if not null', () => {
    if (
      sitePatientList[0].patients[0].patientLock &&
      sitePatientList[0].patients[0].patientLock.user.email !== 'admin@example.com'
    ) {
      cy.wrap(
        client.mutate({
          mutation: ReleasePatientLockDocument,
        }),
      )
        .its('data.releasePatientLock.success')
        .should('be.true');
    }
  });

  it('Lock the patient and validate whether lockPatient object response is not null after locking', () => {
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasLockPatient) {
        req.alias = aliasLockPatient;
      }
    });

    cy.get(`[id=${sitePatientList[0].patients[0].id}-selectable-patient]`).click({ force: true });

    cy.wait(`@${aliasLockPatient}`).then((result) => {
      if (result.response?.statusCode === 200) {
        if (result.response.body.data) {
          lockPatientObject = result.response.body.data.lockPatient;

          if (!lockPatientObject) {
            throw new Error('Lock Patient: lockPatient object is null!');
          }
        } else {
          throw new Error(`Lock Patient: ${result.response.body.errors[0].message}`);
        }
      }
    });
  });
});
