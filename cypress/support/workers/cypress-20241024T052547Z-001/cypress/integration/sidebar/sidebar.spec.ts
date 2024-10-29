import getPatientStudyId from '../../../src/helpers/getPatientStudyId';
import { mockUserDataAdmin } from '../../../src/constant/testFixtures';
import {
  GetPatientListDocument,
  ILandingStatusIndicator,
  GetVisitListDocument,
  IVisitStatusIndicator,
  LockPatientDocument,
  GetStudyListDocument,
} from '../../../src/graphQL/generated/graphql';

describe('Get Patient List', () => {
  let dataResult = {} as any;
  const filteredCountPatientIncomplete = (site: any[], index: number) => {
    const filteredCount = site[index].patients.filter(
      (result: any) => result.status === ILandingStatusIndicator.Incomplete,
    );
    return filteredCount ? filteredCount.length : 0;
  };

  const getPatient = GetPatientListDocument.definitions[0] as any;
  const getVisit = GetVisitListDocument.definitions[0] as any;
  const lockPatient = LockPatientDocument.definitions[0] as any;
  const getStudy = GetStudyListDocument.definitions[0] as any;
  const aliasing = {
    getPatient: getPatient.name.value,
    getVisits: getVisit.name.value,
    lockPatient: lockPatient.name.value,
    getStudy: getStudy.name.value,
  };

  describe('Get Site and patient list', () => {
    before(() => {
      cy.beforeSetup(mockUserDataAdmin);

      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasing.getPatient) {
          req.alias = req.body.operationName;
        }
      });
      cy.visit('/visit');
      cy.wait(`@${aliasing.getPatient}`).then((result) => {
        cy.wrap(result).then(() => {
          dataResult = result;
        });
      });
      cy.waitForReact();
    });

    beforeEach(() => {
      cy.restoreLocalStorageCache();
    });

    afterEach(() => {
      cy.saveLocalStorageCache();
    });

    it('Show count incomplete patients', () => {
      cy.wrap(dataResult).then(() => {
        const { response } = dataResult;
        cy.wrap(response).then(() => {
          if (response.statusCode === 200) {
            const patientList = response.body.data.sitePatientList;
            cy.wrap(patientList).then(() => {
              cy.wrap(patientList).each((element, index) => {
                cy.get(`.ant-collapse-header`).eq(index).click().realHover();
                const count = filteredCountPatientIncomplete(patientList, index);
                cy.wrap(count).then(() => {
                  cy.get('.tooltip-header-site').contains(
                    count ? `${count} Incomplete Patients` : /Not Started|Completed/g,
                  );
                  cy.wait(1000);
                });
              });
            });
          }
        });
      });
    });

    it('Show count incomplete visits', () => {
      cy.wrap(dataResult).then(() => {
        let visits = [] as any;
        cy.intercept('POST', '/graphql', (req) => {
          if (req.body.operationName === aliasing.getVisits) {
            req.alias = req.body.operationName;
          }
        });
        const { response } = dataResult;
        cy.wrap(response).then(() => {
          const patientList = response.body.data.sitePatientList;
          cy.get('[data-cy=pop-over]')
            .trigger('click')
            .then(() => {
              cy.get('[data-cy=0-option]').click({ force: true });
            });
          Cypress.on('uncaught:exception', (err, runnable) => {
            return false;
          });
          cy.wrap(patientList).then(() => {
            patientList.map((site: any) => {
              if (site.patients && site.patients.length > 0) {
                site.patients.map((patient: any) => {
                  if (
                    patient.patientLock === null &&
                    patient.status !== ILandingStatusIndicator.Unset &&
                    patient.id !== patient.id
                  ) {
                    cy.get(`[id=${patient.id}-selectable-patient]`)
                      .contains(`${patient.patientStudyId}`)
                      .click({ force: true });
                    cy.wait(`@${aliasing.getVisits}`).then((interception: any) => {
                      visits = interception.response.body.data.visitList;
                    });
                    cy.wait(1000).then(() => {
                      cy.wrap(visits).then(() => {
                        visits.map((visit: any) => {
                          if (
                            visit.status !== IVisitStatusIndicator.Unset &&
                            visit.status !== IVisitStatusIndicator.NotOccurred
                          ) {
                            cy.get(`#${visit.id}`)
                              .click({ force: true })
                              .then(() => {
                                cy.get('.tooltip-sidebar-visit-fixed').should(
                                  'have.text',
                                  `${visit.outstandingCount} Incomplete Questions`,
                                );
                              });
                            cy.wait(1000);
                          }
                        });
                      });
                    });
                    cy.wait(1500);
                    cy.get('.sidebar-toggle-arrow').click({ force: true });
                    // NOTE: on v2.1 it will be changed to incomplete visits again
                    cy.get('.tooltip-patient').should(
                      'have.text',
                      `${patient.outstandingTaskCount} Incomplete Questions`,
                    );
                    cy.wait(2000);
                  }
                });
              }
            });
          });
        });
      });
    });

    describe('List visit', () => {
      before(() => {
        cy.intercept('POST', '/graphql', (req) => {
          if (req.body.operationName === aliasing.lockPatient) {
            req.alias = req.body.operationName;
          }
        });
      });

      it('Show patient has not started', () => {
        cy.wrap(dataResult).then(() => {
          const { response } = dataResult;
          const patientList = response.body.data.sitePatientList;
          cy.wrap(patientList).then(() => {
            if (patientList && patientList.length > 0) {
              cy.get('[data-cy=pop-over]').click({ force: true });
              cy.wait(300).then(() => {
                cy.get('[data-cy="0-option"]').click({ force: true });
              });

              cy.wrap(patientList).each((element, index) => {
                cy.wrap(patientList[index].patients).each((ele, i) => {
                  if (
                    patientList[index].patients[i].patientLock === null &&
                    patientList[index].patients[i].status === ILandingStatusIndicator.Unset
                  ) {
                    const patientStudyId = getPatientStudyId({
                      site: patientList[index],
                      patient: patientList[index].patients[i],
                    });
                    cy.get(`[id=${patientList[index].patients[i].id}-selectable-patient]`)
                      .contains(`${patientStudyId}`)
                      .click({ force: true });
                    cy.wait(`@${aliasing.lockPatient}`).then((res) => {
                      cy.get('.sidebar-visits-container');
                      cy.wait(1500);
                      cy.get('.sidebar-toggle-arrow').click({ force: true });
                    });
                  }
                });
              });
            }
          });
        });
      });
    });
    describe('Logout admin', () => {
      it('Logout', () => {
        cy.logout();
      });
    });
  });
  describe('Get Site and patient list', () => {
    let abilities = true;
    before(() => {
      cy.fillInloginAsFormV2(mockUserDataAdmin);
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasing.getPatient) {
          req.alias = req.body.operationName;
        }

        if (req.body.operationName === aliasing.getStudy) {
          req.alias = req.body.operationName;
        }

        if (req.body.operationName === aliasing.lockPatient) {
          req.alias = req.body.operationName;
        }
      });

      cy.visit('/visit');

      cy.wait(`@${aliasing.getStudy}`).then((result) => {
        cy.wrap(() => {
          if (result.response?.body.data) {
            abilities =
              result.response?.body.data.studyList[0]?.latestStudyRevision?.abilities.viewPii;
          }
        });
      });

      cy.wait(`@${aliasing.getPatient}`).then((result) => {
        cy.wrap(() => {
          dataResult = result;
        });
      });
    });

    it('Check abilities', () => {
      cy.wrap(() => {
        const { response } = dataResult;
        const patientList = response.body.data.sitePatientList;
        if (patientList && patientList.length > 0) {
          cy.wrap(patientList).then(() => {
            patientList.map((site: any, i: number) => {
              cy.get(`.ant-collapse-header`)
                .eq(i)
                .click()
                .then(() => {
                  cy.wrap(() => {
                    if (site.patients && site.patients.length > 0) {
                      site.patients.map((patient: any) => {
                        if (
                          patient.patientLock === null &&
                          patient.status !== ILandingStatusIndicator.Unset
                        ) {
                          cy.get('#abilities').should(abilities ? 'exist' : 'not.exist');
                          cy.get(`[id=${patient.id}-selectable-patient]`)
                            .contains(`${patient.patientStudyId}`)
                            .click({ force: true });
                          cy.wait(`@${aliasing.lockPatient}`).then((res) => {
                            cy.get('.sidebar-visits-container');
                            cy.wait(1500);
                            cy.get('.sidebar-toggle-arrow').click({ force: true, multiple: true });
                          });
                        }
                      });
                    }
                  });
                });
            });
          });
        }
      });
    });

    it('check sidebar from study with patients to study with no patients', () => {
      cy.get('#multiSitePatient1-selectable-patient').click();
      cy.get('#patientId', { timeout: 10000 }).should('be.visible').contains('SLO-OMN193');
      cy.get('[data-cy=header-nurse-select]').click();
      cy.get('[data-cy=studyTestId1-study1revisionDev2c]').scrollIntoView().click();
      // expect sidebar to have no data on site with no patient
      cy.get('#patientId', { timeout: 10000 }).should('not.exist');
      cy.get('.ant-empty-description').should('be.visible');
    });
  });
});
