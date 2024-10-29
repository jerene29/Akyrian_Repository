import {
  GetPatientListDocument,
  ILandingStatusIndicator,
  GetVisitListDocument,
  LockPatientDocument,
} from '../../../src/graphQL/generated/graphql';

describe.skip('Get Patient List', () => {
  const aliasing = {
    getPatients: GetPatientListDocument as any,
    getVisits: GetVisitListDocument as any,
    lockPatient: LockPatientDocument as any,
  };
  const alias = aliasing.getPatients.definitions[0].name.value;
  const getVisit = aliasing.getVisits.definitions[0].name.value;
  const lockPatientDocument = aliasing.lockPatient.definitions[0].name.value;
  let visitListData;
  let dataResult;
  let totalPatient = 0;

  const setDefaultValue = () => {
    visitListData = undefined;
    dataResult = undefined;
  };

  const getTotalPatient = (sitePatient: any) => {
    if (sitePatient) {
      const { sitePatientList } = sitePatient;
      const count = sitePatientList.reduce((prev: any, current: any) => {
        return prev + current.patients.length;
      }, 0);
      return count;
    } else return 0;
  };

  before(() => {
    cy.reseedDB();
    cy.fillInloginAsFormV2({
      email: 'admin@example.com',
    });
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === alias) {
        req.alias = req.body.operationName;
      }
      if (req.body.operationName === getVisit) {
        req.alias = req.body.operationName;
      }
    });
    cy.visit('/visit');
    cy.wait(`@${alias}`, { timeout: 10000 }).then((result) => {
      dataResult = result;
      totalPatient = getTotalPatient(result.response?.body.data);
    });
    cy.wait(`@${getVisit}`, { timeout: 15000 }).then((res) => {
      if (res.response && res.response.statusCode === 200) {
        visitListData = res.response.body.data.visitList;
      }
    });
    cy.waitForReact();
  });

  beforeEach(() => {
    cy.wait(1000);
    cy.restoreLocalStorageCache();
    cy.wait(1000);
  });

  afterEach(() => {
    cy.wait(1000);
    cy.saveLocalStorageCache();
    cy.wait(1000);
  });

  describe('Outstanding', () => {
    let sites: any = [];
    let patientCount = 0;
    const visitCount = 0;
    let result = '';
    const aliasPatient = aliasing.getPatients.definitions[0].name.value;
    const alias1 = aliasing.getVisits.definitions[0].name.value;
    const aliasesArr = [];

    before(() => {
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasPatient) {
          req.alias = req.body.operationName;
        }
        if (req.body.operationName === alias1) {
          req.alias = req.body.operationName;
        }
      });
    });

    beforeEach(() => {
      cy.wait(1000);
      cy.restoreLocalStorageCache();
      cy.wait(1000);
    });

    afterEach(() => {
      cy.wait(1000);
      cy.saveLocalStorageCache();
      cy.wait(1000);
    });

    it('Show Outstanding Task', () => {
      cy.wait(1000);
      cy.get('[data-cy=pop-over]').click();
      cy.get('[data-cy="1-filter"]').click({ force: true });
      cy.wait(`@${aliasPatient}`).then((res) => {
        if (res.response?.body && res.response.body.data.sitePatientList) {
          sites = res.response.body.data.sitePatientList;
          patientCount = res.response.body.data.sitePatientList.reduce(
            (prev: any, current: any) => {
              return prev + current.patients.length;
            },
            0,
          );
          result = `Result: ${
            patientCount !== totalPatient ? patientCount : 0
          } out of ${totalPatient} Patients`;
        }
      });
      cy.wait(`@${alias1}`, { timeout: 15000 });
      cy.get('[data-cy=pop-over]').click();
      cy.get(' [data-cy="0-option"]').click({ force: true });
    });

    describe('Show patient', () => {
      beforeEach(() => {
        cy.wait(1000);
        cy.restoreLocalStorageCache();
        cy.wait(1000);
      });

      afterEach(() => {
        cy.wait(1000);
        cy.saveLocalStorageCache();
        cy.wait(1000);
      });

      it('Show Visit', () => {
        cy.wait(1000);
        cy.get('[data-cy=total-patient]', { timeout: 10000 }).should(
          'have.text',
          `Result: 5 out of 15 Patients`,
        );
        cy.intercept('POST', '/graphql', (req) => {
          if (req.body.operationName === lockPatientDocument) {
            req.alias = req.body.operationName;
          }
          if (req.body.operationName === alias1) {
            req.alias = req.body.operationName;
          }
        });
        cy.get(`#multiSitePatient1-selectable-patient`)
          .click({ force: true })
          .then(() => {
            cy.wait(`@${lockPatientDocument}`, { timeout: 30000 });
            cy.get('[data-cy=total-visit]', { timeout: 300000 }).should('exist');
            cy.get('[data-cy=total-question]').should('exist');
            cy.wait(2000);
            cy.get('.sidebar-toggle-arrow').click({ force: true });
          });
      });
    });

    describe('Unverified', () => {
      let sitesUnverified = [];
      let patientCountUnverified = 0;
      const visitCountUnverified = 0;
      let resultUnverified = '';
      const aliasesUnverified = aliasing.getPatients.definitions[0].name.value;
      const alias1 = aliasing.getVisits.definitions[0].name.value;

      before(() => {
        cy.intercept('POST', '/graphql', (req) => {
          if (req.body.operationName === aliasesUnverified) {
            req.alias = req.body.operationName;
          }
          if (req.body.operationName === alias1) {
            req.alias = req.body.operationName;
          }
        });
      });

      it('Show Unverified Task', () => {
        cy.wait(1000);
        cy.get('[data-cy=pop-over]').click();
        cy.get('[data-cy="2-filter"]').click({ force: true });
        cy.wait(`@${aliasesUnverified}`).then((res) => {
          if (res.response?.body && res.response.body.data.sitePatientList) {
            sitesUnverified = res.response.body.data.sitePatientList;
            patientCountUnverified = res.response.body.data.sitePatientList.reduce(
              (prev: any, current: any) => {
                return prev + current.patients.length;
              },
              0,
            );
            resultUnverified = `Result: 0 out of ${totalPatient} Patients`;
          }
        });
        cy.get('[data-cy=pop-over]').click();
        cy.get(' [data-cy="0-option"]').click({ force: true });
      });

      describe('Show patient', () => {
        before(() => {
          cy.intercept('POST', '/graphql', (req) => {
            if (req.body.operationName === alias1) {
              req.alias = req.body.operationName;
            }
          });
        });

        it('Show Visit', () => {
          cy.wait(1000);
          cy.get('[data-cy=total-patient]', { timeout: 10000 }).should(
            'have.text',
            resultUnverified,
          );
        });
      });
    });

    describe('Unresolved', () => {
      let sites: any = [];
      let patientCount = 0;
      const visitCount = 0;
      let result = '';
      const aliasPatient = aliasing.getPatients.definitions[0].name.value;
      const alias1 = aliasing.getVisits.definitions[0].name.value;
      const aliasesArr = [];

      before(() => {
        cy.intercept('POST', '/graphql', (req) => {
          if (req.body.operationName === aliasPatient) {
            req.alias = req.body.operationName;
          }
          if (req.body.operationName === alias1) {
            req.alias = req.body.operationName;
          }
        });
      });

      beforeEach(() => {
        cy.wait(1000);
        cy.restoreLocalStorageCache();
        cy.wait(1000);
      });

      afterEach(() => {
        cy.wait(1000);
        cy.saveLocalStorageCache();
        cy.wait(1000);
      });

      it('Show Unresolved Task', () => {
        cy.wait(1000);
        cy.get('[data-cy=pop-over]').click();
        cy.get('[data-cy="3-filter"]').click({ force: true });
        cy.wait(`@${aliasPatient}`).then((res) => {
          if (res.response?.body && res.response.body.data.sitePatientList) {
            sites = res.response.body.data.sitePatientList;
            patientCount = res.response.body.data.sitePatientList.reduce(
              (prev: any, current: any) => {
                return prev + current.patients.length;
              },
              0,
            );
            result = `Result: ${
              patientCount !== totalPatient ? patientCount : 0
            } out of ${totalPatient} Patients`;
          }
        });
        cy.wait(`@${alias1}`, { timeout: 15000 });
        cy.get('[data-cy=pop-over]').click();
        cy.get(' [data-cy="0-option"]').click({ force: true });
      });

      describe('Show patient', () => {
        beforeEach(() => {
          cy.wait(1000);
          cy.restoreLocalStorageCache();
          cy.wait(1000);
        });

        afterEach(() => {
          cy.wait(1000);
          cy.saveLocalStorageCache();
          cy.wait(1000);
        });

        it('Show Visit', () => {
          let patientId = '';
          cy.wait(1000);
          cy.get('[data-cy=total-patient]', { timeout: 10000 }).should('have.text', result);
          cy.get('[data-cy=selectable-patient]').should('have.length', patientCount);
          cy.wrap(sites).each((patient: any, i) => {
            const patients = patient.patients;
            cy.intercept('POST', '/graphql', (req) => {
              if (req.body.operationName === lockPatientDocument) {
                req.alias = req.body.operationName;
              }
              if (req.body.operationName === alias1) {
                req.alias = req.body.operationName;
              }
            });
            cy.wrap(patients).each((ele: any, index) => {
              if (ele.patientLock === null && ele.status !== ILandingStatusIndicator.Unset) {
                if (JSON.stringify(ele) !== JSON.stringify(patientId)) {
                  cy.get(`#${ele.id}-selectable-patient`)
                    .click({ force: true })
                    .then(() => {
                      patientId = ele;
                      cy.wait(`@${lockPatientDocument}`, { timeout: 30000 });
                      cy.get('[data-cy=total-visit]', { timeout: 300000 }).should('exist');
                      cy.get('[data-cy=total-question]').should('exist');
                      cy.wait(2000);
                      cy.get('.sidebar-toggle-arrow').click({ force: true });
                    });
                }
              }
            });
          });
        });
      });
    });

    describe('Answered', () => {
      let sites: any = [];
      let patientCount = 0;
      const visitCount = 0;
      let result = '';
      const aliasPatient = aliasing.getPatients.definitions[0].name.value;
      const alias1 = aliasing.getVisits.definitions[0].name.value;
      const aliasesArr = [];

      before(() => {
        cy.intercept('POST', '/graphql', (req) => {
          if (req.body.operationName === aliasPatient) {
            req.alias = req.body.operationName;
          }
          if (req.body.operationName === alias1) {
            req.alias = req.body.operationName;
          }
        });
      });

      beforeEach(() => {
        cy.wait(1000);
        cy.restoreLocalStorageCache();
        cy.wait(1000);
      });

      afterEach(() => {
        cy.wait(1000);
        cy.saveLocalStorageCache();
        cy.wait(1000);
      });

      it('Show Answered Task', () => {
        cy.wait(1000);
        cy.get('[data-cy=pop-over]').click();
        cy.get('[data-cy="4-filter"]').click({ force: true });
        cy.wait(`@${aliasPatient}`).then((res) => {
          if (res.response?.body && res.response.body.data.sitePatientList) {
            sites = res.response.body.data.sitePatientList;
            patientCount = res.response.body.data.sitePatientList.reduce(
              (prev: any, current: any) => {
                return prev + current.patients.length;
              },
              0,
            );
            result = `Result: ${
              patientCount !== totalPatient ? patientCount : 0
            } out of ${totalPatient} Patients`;
          }
        });
        cy.wait(`@${alias1}`, { timeout: 15000 });
        cy.get('[data-cy=pop-over]').click();
        cy.get(' [data-cy="0-option"]').click({ force: true });
      });

      describe('Show patient', () => {
        beforeEach(() => {
          cy.wait(1000);
          cy.restoreLocalStorageCache();
          cy.wait(1000);
        });

        afterEach(() => {
          cy.wait(1000);
          cy.saveLocalStorageCache();
          cy.wait(1000);
        });

        it('Show Visit', () => {
          let patientId = '';
          cy.wait(1000);
          cy.get('[data-cy=total-patient]', { timeout: 10000 }).should('have.text', result);
          cy.get('[data-cy=selectable-patient]').should('have.length', patientCount);
          cy.wrap(sites).each((patient: any, i) => {
            const patients = patient.patients;
            cy.intercept('POST', '/graphql', (req) => {
              if (req.body.operationName === lockPatientDocument) {
                req.alias = req.body.operationName;
              }
              if (req.body.operationName === alias1) {
                req.alias = req.body.operationName;
              }
            });
            cy.wrap(patients).each((ele: any, index) => {
              if (ele.patientLock === null && ele.status !== ILandingStatusIndicator.Unset) {
                if (JSON.stringify(ele) !== JSON.stringify(patientId)) {
                  cy.get(`#${ele.id}-selectable-patient`)
                    .click({ force: true })
                    .then(() => {
                      patientId = ele;
                      cy.wait(`@${lockPatientDocument}`, { timeout: 30000 });
                      cy.get('[data-cy=total-visit]', { timeout: 300000 }).should('exist');
                      cy.get('[data-cy=total-question]').should('exist');
                      cy.wait(2000);
                      cy.get('.sidebar-toggle-arrow').click({ force: true });
                    });
                }
              }
            });
          });
        });
      });
    });
  });
});
