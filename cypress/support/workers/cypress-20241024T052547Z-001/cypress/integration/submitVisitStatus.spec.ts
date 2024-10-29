import {
  GetPatientListDocument,
  GetVisitListDocument,
  AddPatientDocument,
  LockPatientDocument,
  GetPatientLockListDocument,
  IPatientLockNoPatientDetailFragment,
} from '../../src/graphQL/generated/graphql';
import { mockUserDataAdmin } from '../../src/constant/testFixtures';

describe('Submit Visit Status', () => {
  let submitVisitStatusData: any = {};
  let statusUpdated = [] as any;
  let patientStudyId = '';
  const aliasing = {
    getPatient: GetPatientListDocument.definitions[0] as any,
    getPatientLock: GetPatientLockListDocument.definitions[0] as any,
    getVisit: GetVisitListDocument.definitions[0] as any,
    aliasLockPatient: LockPatientDocument.definitions[0] as any,
    addPatient: AddPatientDocument.definitions[0] as any,
  };
  const alias = aliasing.getPatient.name.value;
  const getVisit = aliasing.getVisit.name.value;
  const aliasLockPatient = aliasing.aliasLockPatient.name.value;
  const getPatientLockList = aliasing.getPatientLock.name.value;
  let sites = [] as any;
  let patientLocks = [] as Array<IPatientLockNoPatientDetailFragment>;

  before(() => {
    cy.reseedDB();
    cy.fillInloginAsFormV2(mockUserDataAdmin);
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === getPatientLockList) {
        req.alias = req.body.operationName;
      }
      if (req.body.operationName === alias) {
        req.alias = req.body.operationName;
      }
      if (req.body.operationName === getVisit) {
        req.alias = req.body.operationName;
      }
    });

    cy.visit('/visit');
    cy.wait(`@${getPatientLockList}`, { timeout: 10000 }).then((result) => {
      if (result.response?.body?.data?.patientLockList) {
        patientLocks = result.response.body.data.patientLockList;
      }
    });
    cy.wait(`@${alias}`, { timeout: 10000 }).then((result) => {
      if (result.response?.body) {
        sites = result.response.body.data.sitePatientList;
        statusUpdated = result.response.body.data.sitePatientList[0]?.patients.find(
          (patient: any) => {
            return (
              patient.status === 'UNSET' &&
              !patientLocks.some(({ patientId }) => patientId === patient.id)
            );
          },
        );
        patientStudyId = statusUpdated?.patientStudyId;
      }
    });

    cy.wait(`@${getVisit}`, { timeout: 15000 });

    cy.fixture('visit.json').then((value) => {
      submitVisitStatusData = value.submitVisitStatusData;
    });
    cy.waitForReact();
  });

  describe('Submit', () => {
    let patientId = '';
    it('Show patient list', () => {
      cy.wrap(patientStudyId).then(() => {
        cy.get('.sidebar-patients-container .ant-collapse')
          .find('[data-cy=selectable-patient]')
          .contains('p', patientStudyId)
          .click({ force: true });

        cy.wait(2000);
        cy.get('[data-cy=button-start-visit]').click({ force: true });
      });
    });
    it('change visit status', () => {
      cy.defaultStartVisitForm();
    });

    it('fill and submit data occured', () => {
      cy.wrap(submitVisitStatusData).then(() => {
        cy.fillAndStartVisitForm({ ...submitVisitStatusData });
      });
    });

    it('Status updated occured', () => {
      cy.wrap(patientStudyId).then(() => {
        cy.get('[data-cy=selectable-patient]')
          .contains('p', `${patientStudyId}`)
          .then(() => {
            cy.get('[data-cy=selectable-patient]').find('[data-cy=INCOMPLETE]');
          });
      });
    });

    it('fill and submit patient form success', () => {
      cy.defaultAddPatientForm();
      const generate = {
        firstNameInitial: 'J',
        middleNameInitial: 'K',
        lastNameInitial: 'T',
        patientStudyId: 'JKT-482021',
        site: sites[0].name[0],
        dob: 'jan011990',
        gender: `MALE`,
      };
      cy.wrap(generate).then(() => {
        const alias = aliasing.addPatient.name.value;
        cy.fillInAddPatientForm(generate, true, false);
        cy.intercept('POST', '/graphql', (req) => {
          if (req.body.operationName === alias) {
            req.alias = req.body.operationName;
          }
        });
        cy.get('#button-submit-add-patient').click();
        cy.react('Button', {
          props: {
            id: 'button-submit-add-patient',
            loading: true,
          },
        });
        cy.wait(`@${alias}`).then((res) => {
          if (res) {
            patientId = res.response?.body.data.addPatient.patient.id;
            cy.react('Button', {
              props: {
                id: 'button-submit-add-patient',
                loading: false,
              },
            });
            cy.react('Modal', {
              props: {
                id: 'modal-add-patient',
                visible: false,
              },
            });
          }
        });
      });
    });

    it('start visit', () => {
      cy.wrap(patientId).then(() => {
        cy.get(`#${patientId}-selectable-patient`)
          .contains('.sider-patient-name', `JKT-482021`)
          .click({ force: true })
          .then(() => {
            cy.get('[data-cy=button-start-visit]').click({ force: true });
          });
        cy.defaultStartVisitForm();
      });
    });

    it('fill and submit not occured', () => {
      cy.wrap(submitVisitStatusData).then(() => {
        cy.fillAndStartVisitFormNotOccured({ ...submitVisitStatusData });
        cy.wait(3000);
      });
    });

    it('Status updated not occured', () => {
      cy.wrap(submitVisitStatusData).then(() => {
        cy.get('#status-not-occured').should('have.text', `${submitVisitStatusData.other}`);
      });
    });

    it('Validate other reason when visit did not occur', () => {
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasLockPatient) {
          req.alias = req.body.operationName;
        }
        if (req.body.operationName === getVisit) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('#bellevuePatient1-selectable-patient').click();
      cy.wait(`@${aliasLockPatient}`, { timeout: 15000 });
      cy.wait(`@${getVisit}`, { timeout: 15000 });
      cy.wait(2000);

      cy.get('[data-cy=visit-visit1Visit4]').click();
      cy.wait(2000);

      cy.get('[data-cy=select-visit-status]').type('{downarrow}{enter}');
      cy.wait(1000);

      cy.get('#select-visit-not-occured').type('{uparrow}{enter}', { force: true }).blur();
      cy.get('[data-cy=button-submit-visit]').should('be.disabled');

      cy.get('#select-visit-not-occured').type('other reason').blur();
      cy.get('[data-cy=button-submit-visit]').should('be.enabled');

      cy.get('#select-visit-not-occured').type('{downarrow}{enter}', { force: true });
      cy.get('[data-cy=button-submit-visit]').should('be.enabled');

      cy.get('#select-visit-not-occured').clear().type('oth').blur();
      cy.get('[data-cy=button-submit-visit]').should('be.disabled');
    });
  });
});
