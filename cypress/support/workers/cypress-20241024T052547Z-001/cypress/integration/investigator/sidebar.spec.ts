import {
  GetPatientListDocument,
  GetVisitListDocument,
  ICustomPatientObject,
  LockPatientDocument,
  ILandingStatusIndicator,
} from '../../../src/graphQL/generated/graphql';

const moment = require('moment');

const mockUserData = {
  email: 'signcrf@example.com',
  studyId: 'studyTestId2',
  studyRevisionId: 'testRevisionId2',
};

describe('Sidebar Investigator', () => {
  const toggleValue = ['Pending', 'Signed'];
  const getPatient: any = GetPatientListDocument;
  const getVisit: any = GetVisitListDocument;
  const lockPatient: any = LockPatientDocument;

  let countToggle = {
    pending: 0,
    signed: 0,
  };

  let currentPatient = {
    pending: 0,
    signed: 0,
  };

  const aliasing = {
    getPatient: getPatient.definitions[0].name.value,
    getVisit: getVisit.definitions[0].name.value,
    lockPatient: lockPatient.definitions[0].name.value,
  };

  let donwloadPersites: any = [];
  let downloadAll: any = {};

  let sites: any = [];
  let patientCount = 0;
  let result = '';

  const filteredCountPatientSigned = (patient: any) => {
    const filteredSigned = patient?.sitePatientList.reduce((prev: number, current: number) => {
      return prev + current.patients.filter((patient: any) => patient.isSigned).length;
    }, 0);
    const filteredPending = patient?.sitePatientList.reduce((prev: number, current: number) => {
      return prev + current.patients.filter((patient: any) => !patient.isSigned).length;
    }, 0);
    return {
      filteredSigned: filteredSigned ? filteredSigned : 0,
      filteredPending: filteredPending ? filteredPending : 0,
    };
  };

  const getLastDownloadAllData = (patients: any) => {
    const getAllPatient = patients?.sitePatientList.reduce((prev: any, current: any) => {
      return [...prev, ...current.patients.map((patient: any) => patient)] as any;
    }, []) as ICustomPatientObject[];

    // ALL or per studyRevision
    const filteredPatient = getPatientUserDownloadHistories(getAllPatient);
    const filterPatientDownloadHistoriesAll = filteredPatient?.map(
      (patient: ICustomPatientObject) => {
        const lastDownload = patient.userDownloadHistories.sort((a, b) => {
          return sortDateByDownloadHistorie(b.latestDownloadedAt, a.latestDownloadedAt);
        });
        return {
          ...patient,
          userDownloadHistories: lastDownload[0],
        };
      },
    );

    const sortAllSitesUserDownloadHistories = filterPatientDownloadHistoriesAll?.sort((a, b) =>
      sortDateByDownloadHistorie(
        b.userDownloadHistories.latestDownloadedAt,
        a.userDownloadHistories.latestDownloadedAt,
      ).valueOf(),
    )[0];
    downloadAll = { ...downloadAll, ...sortAllSitesUserDownloadHistories };
    return sortAllSitesUserDownloadHistories;
  };

  const getLastAllDownloadPerSites = (patients: any) => {
    const getPerSites = patients?.sitePatientList.map((site: any) => {
      const tempSites = site.patients
        .filter((z: any) => z.userDownloadHistories.length)
        .map((patient: any) => {
          const lastDownload = patient.userDownloadHistories?.sort((a: any, b: any) => {
            return sortDateByDownloadHistorie(b.latestDownloadedAt, a.latestDownloadedAt);
          });
          return {
            ...patient,
            userDownloadHistories: lastDownload[0],
          };
        });
      return {
        ...site,
        patients: tempSites,
      };
    });
    donwloadPersites = [...donwloadPersites, ...getPerSites];
    return getPerSites;
  };

  const getPatientUserDownloadHistories = (patients: ICustomPatientObject[]) => {
    return patients?.filter(
      (patient: ICustomPatientObject) => patient.userDownloadHistories.length,
    );
  };

  const sortDateByDownloadHistorie = (b: string, a: string) =>
    new Date(b).valueOf() - new Date(a).valueOf();

  before(() => {
    cy.reseedDB();
    cy.fillInloginAsFormV2(mockUserData, mockUserData.studyId, mockUserData.studyRevisionId);
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasing.getPatient) {
        req.alias = req.body.operationName;
      }
      if (req.body.operationName === aliasing.getVisit) {
        req.alias = req.body.operationName;
      }
    });
    cy.visit('/visit/testRevisionId2');
    cy.wait(`@${aliasing.getPatient}`).then((response) => {
      countToggle.signed = filteredCountPatientSigned(response.response?.body.data).filteredSigned;
      countToggle.pending = filteredCountPatientSigned(
        response.response?.body.data,
      ).filteredPending;
      getLastAllDownloadPerSites(response.response?.body.data);
      getLastDownloadAllData(response.response?.body.data);
      cy.wait(`@${aliasing.getVisit}`);
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

  describe('Pending & signed patient', () => {
    it('Should have toggle button ', () => {
      cy.get('[data-cy=toggler]')
        .should('exist')
        .each((element, index) => {
          cy.wrap(element).should('have.value', toggleValue[index]);
          cy.get('[data-cy=count-toggle]')
            .eq(index)
            .should('have.text', index === 0 ? countToggle.pending : countToggle.signed);
        });
      cy.get('[data-cy=selectable-patient]').should('have.length', countToggle.pending);
      cy.get('[data-cy=sidebar-toggle-arrow]').click();
      cy.get('[data-cy=all-visit]').should('exist');
      cy.get('[data-cy=sidebar-toggle-arrow]').click();
      cy.get('[data-cy=toggle-button]').eq(1).click();
      cy.get('[data-cy=selectable-patient]').should('have.length', countToggle.signed);
      cy.get('[data-cy=icons-download-site]')
        .should('exist')
        .each((element, index) => {
          cy.wrap(element)
            .invoke('show')
            .trigger('mouseover')
            .then(() => {
              cy.get('[data-cy=download-fullname]')
                .eq(index)
                .should(
                  'have.text',
                  `Last downloaded by ${downloadAll.userDownloadHistories?.firstName} ${downloadAll.userDownloadHistories?.lastName}`,
                );
              cy.get('[data-cy=download-status]')
                .eq(index)
                .should('have.text', `Data downloaded was partial data`);
              cy.get('[data-cy=download-date]')
                .eq(index)
                .should(
                  'have.text',
                  `${moment(downloadAll.userDownloadHistories?.latestDownloadedAt).format(
                    'DD MMM YYYY',
                  )} at ${moment(downloadAll.userDownloadHistories?.latestDownloadedAt).format(
                    'LT',
                  )}`,
                );
              cy.wrap(element).invoke('show').trigger('mouseout');
            });
        });
      cy.get('[data-cy=icons-download-all]')
        .should('exist')
        .trigger('mouseover')
        .then(() => {
          cy.get('[data-cy=download-all-fullname]').should(
            'have.text',
            `Last downloaded by ${downloadAll.userDownloadHistories?.firstName} ${downloadAll.userDownloadHistories?.lastName}`,
          );
          cy.get('[data-cy=download-all-status]').should(
            'have.text',
            `Data downloaded was partial data`,
          );
          cy.get('[data-cy=download-all-date]').should(
            'have.text',
            `${moment(downloadAll.userDownloadHistories?.latestDownloadedAt).format(
              'DD MMM YYYY',
            )} at ${moment(downloadAll.userDownloadHistories?.latestDownloadedAt).format('LT')}`,
          );
          cy.get('[data-cy=icons-download-all]').trigger('mouseout');
        });
    });
  });

  describe('Filtered patient', () => {
    describe('Outstanding', () => {
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
        cy.get('[data-cy=pop-over]').click();
        cy.intercept('POST', '/graphql', (req) => {
          if (req.body.operationName === aliasing.getPatient) {
            req.alias = req.body.operationName;
          }
          if (req.body.operationName === aliasing.getVisit) {
            req.alias = req.body.operationName;
          }
        });
        cy.get('[data-cy="1-filter"]').click({ force: true });
        cy.wait(`@${aliasing.getPatient}`).then((res) => {
          if (res.response?.body && res.response.body.data.sitePatientList) {
            currentPatient.pending = filteredCountPatientSigned(
              res.response?.body.data,
            ).filteredPending;
            currentPatient.signed = filteredCountPatientSigned(
              res.response?.body.data,
            ).filteredSigned;
            sites = res.response.body.data.sitePatientList;
            patientCount = res.response.body.data.sitePatientList.reduce(
              (prev: any, current: any) => {
                return prev + current.patients.length;
              },
              0,
            );
            result = `Result: ${patientCount} out of ${currentPatient.pending} Patients`;
          }
        });
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
          cy.get('[data-cy=total-patient]').should('have.text', result);
          cy.get('[data-cy=selectable-patient]').should('have.length', patientCount);
          cy.get('[data-cy=toggler]')
            .should('exist')
            .each((element, index) => {
              cy.wrap(element).should('have.value', toggleValue[index]);
              cy.get('[data-cy=count-toggle]')
                .eq(index)
                .should('have.text', index === 0 ? currentPatient.pending : currentPatient.signed);
            });
          cy.wrap(sites).each((patient: any, i) => {
            const patients = patient.patients;
            cy.intercept('POST', '/graphql', (req) => {
              if (req.body.operationName === aliasing.lockPatient) {
                req.alias = req.body.operationName;
              }
              if (req.body.operationName === aliasing.getVisit) {
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
                      cy.wait(`@${aliasing.lockPatient}`, { timeout: 30000 });
                      cy.get('[data-cy=total-visit]', { timeout: 300000 }).should('exist');
                      cy.get('[data-cy=scroll-investigator]').scrollTo('bottom');
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
    describe('Unverfied', () => {
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

      it('Show Unverified Task', () => {
        cy.wait(1000);
        cy.get('[data-cy=pop-over]').click();
        cy.intercept('POST', '/graphql', (req) => {
          if (req.body.operationName === aliasing.getPatient) {
            req.alias = req.body.operationName;
          }
          if (req.body.operationName === aliasing.getVisit) {
            req.alias = req.body.operationName;
          }
        });
        cy.get('[data-cy="2-filter"]').click({ force: true });
        cy.wait(`@${aliasing.getPatient}`).then((res) => {
          if (res.response?.body && res.response.body.data.sitePatientList) {
            currentPatient.pending = filteredCountPatientSigned(
              res.response?.body.data,
            ).filteredPending;
            currentPatient.signed = filteredCountPatientSigned(
              res.response?.body.data,
            ).filteredSigned;
            sites = res.response.body.data.sitePatientList;
            patientCount = res.response.body.data.sitePatientList.reduce(
              (prev: any, current: any) => {
                return prev + current.patients.length;
              },
              0,
            );
            result = `Result: ${patientCount} out of ${countToggle.pending} Patients`;
            if (patientCount) {
              cy.get('[data-cy=pop-over]').click();
              cy.get(' [data-cy="0-option"]').click({ force: true });
            }
          }
        });
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
          cy.get('[data-cy=total-patient]').should('have.text', result);
          cy.get('[data-cy=selectable-patient]').should('have.length', patientCount);
          cy.get('[data-cy=toggler]')
            .should('exist')
            .each((element, index) => {
              cy.wrap(element).should('have.value', toggleValue[index]);
              cy.get('[data-cy=count-toggle]')
                .eq(index)
                .should('have.text', index === 0 ? currentPatient.pending : currentPatient.signed);
            });
          cy.wrap(sites).each((patient: any, i) => {
            const patients = patient.patients;
            cy.intercept('POST', '/graphql', (req) => {
              if (req.body.operationName === aliasing.lockPatient) {
                req.alias = req.body.operationName;
              }
              if (req.body.operationName === aliasing.getVisit) {
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
                      cy.wait(`@${aliasing.lockPatient}`, { timeout: 30000 });
                      cy.get('[data-cy=total-visit]', { timeout: 300000 }).should('exist');
                      cy.get('[data-cy=scroll-investigator]').scrollTo('bottom');
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
    describe('Unresolved', () => {
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
        cy.intercept('POST', '/graphql', (req) => {
          if (req.body.operationName === aliasing.getPatient) {
            req.alias = req.body.operationName;
          }
          if (req.body.operationName === aliasing.getVisit) {
            req.alias = req.body.operationName;
          }
        });
        cy.get('[data-cy="3-filter"]').click({ force: true });
        cy.wait(`@${aliasing.getPatient}`).then((res) => {
          if (res.response?.body && res.response.body.data.sitePatientList) {
            currentPatient.pending = filteredCountPatientSigned(
              res.response?.body.data,
            ).filteredPending;
            currentPatient.signed = filteredCountPatientSigned(
              res.response?.body.data,
            ).filteredSigned;
            sites = res.response.body.data.sitePatientList;
            patientCount = res.response.body.data.sitePatientList.reduce(
              (prev: any, current: any) => {
                return prev + current.patients.length;
              },
              0,
            );
            result = `Result: ${patientCount} out of ${countToggle.pending} Patients`;
            if (patientCount) {
              cy.get('[data-cy=pop-over]').click();
              cy.get(' [data-cy="0-option"]').click({ force: true });
            }
          }
        });
      });

      describe('Show patient', () => {
        beforeEach(() => {
          cy.restoreLocalStorageCache();
        });

        afterEach(() => {
          cy.saveLocalStorageCache();
        });

        it('Show Visit', () => {
          let patientId = '';
          cy.get('[data-cy=total-patient]').should('have.text', result);
          cy.get('[data-cy=selectable-patient]').should('have.length', patientCount);
          cy.get('[data-cy=toggler]')
            .should('exist')
            .each((element, index) => {
              cy.wrap(element).should('have.value', toggleValue[index]);
              cy.get('[data-cy=count-toggle]')
                .eq(index)
                .should('have.text', index === 0 ? currentPatient.pending : currentPatient.signed);
            });
          cy.wrap(sites).each((patient: any, i) => {
            const patients = patient.patients;
            cy.intercept('POST', '/graphql', (req) => {
              if (req.body.operationName === aliasing.lockPatient) {
                req.alias = req.body.operationName;
              }
              if (req.body.operationName === aliasing.getVisit) {
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
                      cy.wait(`@${aliasing.lockPatient}`, { timeout: 30000 });
                      cy.get('[data-cy=total-visit]', { timeout: 300000 }).should('exist');
                      cy.get('[data-cy=scroll-investigator]').scrollTo('bottom');
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
      beforeEach(() => {
        cy.restoreLocalStorageCache();
      });

      afterEach(() => {
        cy.saveLocalStorageCache();
      });

      it('Show Answered Task', () => {
        cy.wait(1000);
        cy.get('[data-cy=pop-over]').click();
        cy.intercept('POST', '/graphql', (req) => {
          if (req.body.operationName === aliasing.getPatient) {
            req.alias = req.body.operationName;
          }
          if (req.body.operationName === aliasing.getVisit) {
            req.alias = req.body.operationName;
          }
        });
        cy.get('[data-cy="4-filter"]').click({ force: true });
        cy.wait(`@${aliasing.getPatient}`).then((res) => {
          if (res.response?.body && res.response.body.data.sitePatientList) {
            currentPatient.pending = filteredCountPatientSigned(
              res.response?.body.data,
            ).filteredPending;
            currentPatient.signed = filteredCountPatientSigned(
              res.response?.body.data,
            ).filteredSigned;
            sites = res.response.body.data.sitePatientList;
            patientCount = res.response.body.data.sitePatientList.reduce(
              (prev: any, current: any) => {
                return prev + current.patients.length;
              },
              0,
            );
            result = `Result: ${patientCount} out of ${countToggle.pending} Patients`;
            if (patientCount) {
              cy.get('[data-cy=pop-over]').click();
              cy.get(' [data-cy="0-option"]').click({ force: true });
            }
          }
        });
      });

      describe('Show patient', () => {
        beforeEach(() => {
          cy.restoreLocalStorageCache();
        });

        afterEach(() => {
          cy.saveLocalStorageCache();
        });

        it('Show Visit', () => {
          let patientId = '';
          cy.get('[data-cy=total-patient]').should('have.text', result);
          cy.get('[data-cy=selectable-patient]').should('have.length', patientCount);
          cy.get('[data-cy=toggler]')
            .should('exist')
            .each((element, index) => {
              cy.wrap(element).should('have.value', toggleValue[index]);
              cy.get('[data-cy=count-toggle]')
                .eq(index)
                .should('have.text', index === 0 ? currentPatient.pending : currentPatient.signed);
            });
          cy.wrap(sites).each((patient: any, i) => {
            const patients = patient.patients;
            cy.intercept('POST', '/graphql', (req) => {
              if (req.body.operationName === aliasing.lockPatient) {
                req.alias = req.body.operationName;
              }
              if (req.body.operationName === aliasing.getVisit) {
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
                      cy.wait(`@${aliasing.lockPatient}`, { timeout: 30000 });
                      cy.get('[data-cy=total-visit]', { timeout: 300000 }).should('exist');
                      cy.get('[data-cy=scroll-investigator]').scrollTo('bottom');
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
