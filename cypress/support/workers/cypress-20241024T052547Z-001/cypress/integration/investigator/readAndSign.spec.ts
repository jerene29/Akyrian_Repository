import {
  LoginDocument,
  GetPatientListDocument,
  GetVisitListDocument,
  PatientVisitDetailsDocument,
  SignDocument,
  LockPatientDocument,
  IVisitStatus,
  IFieldGroupPatientVisitDetail,
  IWithAndNoSourceForm,
  IVisitStatusIndicator,
} from '../../../src/graphQL/generated/graphql';
import { mockUserDataInvestigator } from '../../../src/constant/testFixtures';
import { LOCAL_PASSWORD } from '../../support/command/others';

const path = require('path');

interface IUnseenVisit {
  visitId?: string;
  visitStatus?: IVisitStatus;
  visitName?: string;
  questionCount: number;
}

type PatientVisitDetailWithVisitName = IWithAndNoSourceForm & {
  visitName?: string;
};

export interface IVisitSignedBy {
  visitId?: string;
  visitStatus?: IVisitStatusIndicator;
  visitName?: string;
  userId?: string | null;
  firstName?: string;
  lastName?: string;
  signAt?: string;
}

describe('Change study', () => {
  const toggleValue = ['Pending', 'Signed'];
  const getPatient: any = GetPatientListDocument;
  const getVisit: any = GetVisitListDocument;
  const getPatientVisitDetail: any = PatientVisitDetailsDocument;
  const postSignFfgr: any = SignDocument;
  const lockPatient: any = LockPatientDocument;
  let envString = '';
  const titleNotAvailable = 'Visits are not ready to be signed yet';
  const descNotAvailable =
    'There are still questions or visits in the workflow that have not been completed by other users yet. You can check the status of these questions and visits in the All State tab on the workflow bar.';
  const titleNotAvailable2 =
    'Oops! You need to view all visits and questions to sign this patient.';
  const descNotAvailable2 =
    'There are records that still need to be reviewed before you can sign off this visit';
  if (!Cypress.env('TESTRUNNER_ENV')) {
    envString = '.csv';
  }
  const password = LOCAL_PASSWORD;

  const aliasing = {
    getPatient: getPatient.definitions[0].name.value,
    getVisit: getVisit.definitions[0].name.value,
    getPatientVisitDetail: getPatientVisitDetail.definitions[0].name.value,
    postSignFfgr: postSignFfgr.definitions[0].name.value,
    lockPatient: lockPatient.definitions[0].name.value,
  };

  const countToggle = {
    pending: 0,
    signed: 0,
  };

  const totalData = {
    visit: 0,
    question: 0,
  };

  let firstSite: any = [];
  let queryPatientVisitDetail: any = {};
  let visitList: any = {};
  let listVisitUnseen: any = {};

  const filteredCountPatientSigned = (patient: any) => {
    const filteredSigned = patient?.sitePatientList.reduce((prev: any, current: any) => {
      return prev + current.patients.filter((patient: any) => patient.isSigned).length;
    }, 0);
    const filteredPending = patient?.sitePatientList.reduce((prev: any, current: any) => {
      return prev + current.patients.filter((patient: any) => !patient.isSigned).length;
    }, 0);
    return {
      filteredSigned: filteredSigned ? filteredSigned : 0,
      filteredPending: filteredPending ? filteredPending : 0,
    };
  };

  function waitRecuceData(response: any) {
    return new Cypress.Promise((resolve, reject) => {
      setTimeout(() => {
        const { unseenVisits } = response.sign;
        const filteredQueryPatientVisitDetail =
          queryPatientVisitDetail.patientVisitDetails.withAndNoSourceForm.filter(
            ({ visitId: id1 }: any) => {
              return unseenVisits.some(({ id: id2 }: any) => {
                return id2 === id1;
              });
            },
          );
        const visitUnseen: IUnseenVisit[] = filteredQueryPatientVisitDetail
          .map((visit: any) => {
            return {
              visitId: visit.visitId,
              visitName: visit.visitName,
              visitStatus: visit.visitStatus as IVisitStatus,
              questionCount: visit.fieldGroups.filter((ffg: any) => {
                return !ffg.formFieldGroupResponse.investigatorViewedBy;
              }).length as number,
            };
          })
          .filter(
            (visit: any) => visit.visitStatus !== IVisitStatus.Unset && visit.questionCount,
          ) as IUnseenVisit[];
        resolve(visitUnseen);
      }, 5000);
    });
  }

  const selectPatient = (index: any) => {
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasing.getVisit) {
        req.alias = req.body.operationName;
      }
      if (req.body.operationName === aliasing.lockPatient) {
        req.alias = req.body.operationName;
      }
      if (req.body.operationName === aliasing.getPatientVisitDetail) {
        req.alias = req.body.operationName;
      }
    });
    cy.get('[data-cy=selectable-patient]').eq(index).click();
    cy.wait(`@${aliasing.lockPatient}`);
    if (index !== 0) {
      cy.wait(`@${aliasing.getVisit}`).then((response) => {
        visitList = response.response?.body.data.visitList;
        cy.wait(`@${aliasing.getPatientVisitDetail}`, { timeout: 100000 }).then((response) => {
          cy.customRequest(getPatientVisitDetail, { patientId: 'multiSitePatient1' }).then(
            (res) => {
              queryPatientVisitDetail = res;
            },
          );
        });
      });
    }
  };

  const getData = (patient: any) => {
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasing.getPatient) {
        req.alias = req.body.operationName;
      }
      if (req.body.operationName === aliasing.getVisit) {
        req.alias = req.body.operationName;
      }
      if (req.body.operationName === aliasing.getPatientVisitDetail) {
        req.alias = req.body.operationName;
      }
    });
    cy.visit('/visit/testRevisionId2');
    cy.wait(`@${aliasing.getPatient}`).then((response) => {
      countToggle.signed = filteredCountPatientSigned(response.response?.body.data).filteredSigned;
      countToggle.pending = filteredCountPatientSigned(
        response.response?.body.data,
      ).filteredPending;
      firstSite = response.response?.body.data.sitePatientList[0];
    });
    cy.wait(`@${aliasing.getVisit}`).then((response) => {
      totalData.visit = response.response?.body.data.visitList.length;
      visitList = response.response?.body.data.visitList;
    });
    cy.wait(`@${aliasing.getPatientVisitDetail}`, { timeout: 100000 }).then((response) => {
      cy.customRequest(getPatientVisitDetail, { patientId: patient }).then((res) => {
        queryPatientVisitDetail = res;
      });
    });
  };

  before(() => {
    cy.reseedDB();
    cy.fillInloginAsFormV2(
      mockUserDataInvestigator,
      mockUserDataInvestigator.studyId,
      mockUserDataInvestigator.studyRevisionId,
    );
    getData('toDaiPatient3');
    cy.waitForReact();
  });

  beforeEach(() => {
    cy.restoreLocalStorageCache();
    cy.wait(1000);
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
    cy.wait(1000);
  });

  describe('Read Question another patient', () => {
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

    it('Check count & select patient', () => {
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
    });

    it('Input & sign then select first visit', () => {
      cy.get('[data-cy=input-password]').should('have.value', '');
      cy.get('[data-cy=btn-sign]').should('be.disabled');
      cy.get('[data-cy=input-password]').type(password);
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasing.postSignFfgr) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=btn-sign]').should('be.enabled').click();
      cy.wait(`@${aliasing.postSignFfgr}`, { timeout: 10000 }).then((response) => {
        cy.customRequest(SignDocument, { patientId: 'toDaiPatient3', password: password }).then(
          (result) => {
            cy.wrap(
              waitRecuceData(result).then((res) => {
                listVisitUnseen = res;
              }),
            );
          },
        );
        cy.log(listVisitUnseen);
      });

      cy.get('[data-cy=unseen-modal]').should('be.visible');
    });

    it('Check count unseen', () => {
      cy.wrap(() => {
        cy.wait(2000);
        cy.get('[data-cy=unseen-wrapper]').each((element: any, index: number) => {
          cy.get('[data-cy=visit-name-unseen]')
            .eq(index)
            .should('have.text', listVisitUnseen[index].visitName);
          cy.get('[data-cy=visit-count-unseen]')
            .eq(index)
            .should('have.text', `${listVisitUnseen[index].questionCount} Questions`);
        });
      });
      cy.get('[data-cy=visit-name-unseen]').eq(0).click();
      cy.get('[data-cy=visit-name-investigator]').eq(0).should('exist');
    });

    it('select visit & sign', () => {
      cy.get('[data-cy=visit-screeningVisitStudy2_1]').click();
      cy.get('[data-cy=input-password]').should('have.value', '');
      cy.get('[data-cy=btn-sign]').should('be.disabled');
      cy.get('[data-cy=input-password]').type(password);
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasing.postSignFfgr) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=btn-sign]').should('be.enabled').click();
      cy.wait(`@${aliasing.postSignFfgr}`, { timeout: 10000 }).then((response) => {
        cy.wrap(response).then(() => {
          if (response.response?.body.data) {
            cy.get('[data-cy=confimation-modal-investigator]');
            cy.get('[data-cy=confirmation-modal-title]').should('have.text', titleNotAvailable2);
            cy.get('[data-cy=confirmation-modal-desc]').should('have.text', descNotAvailable2);
            cy.get('[data-cy=confirmModal-confirmButton]').click();
          }
        });
      });
    });

    it('select study', () => {
      cy.get('[data-cy=sidebar-toggle-arrow]').click();
      cy.get('[data-cy=header-nurse-select]').click();
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasing.getPatient) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=studyTestId1-testRevisionId1]').click();
      cy.wait(`@${aliasing.getPatient}`).then((response) => {
        firstSite = response.response?.body.data.sitePatientList[0];
      });
    });

    it('select patient', () => {
      selectPatient(2);
    });

    it('Scroll to', () => {
      cy.get('[data-cy=read-status]').each((element: any, index: any) => {
        if (index % 2 === 0) {
          cy.get('[data-cy=read-status]').eq(index).scrollIntoView({ duration: 2000 });
          cy.get('[data-cy=read-status]').should(
            'have.css',
            'background-color',
            'rgba(0, 0, 0, 0)',
          );
        }
      });
    });

    it('All visit should not be signable except the not occurred one', () => {
      cy.get('[data-cy=sign-level]').should('not.exist');
    });

    it('Check step indicator', () => {
      cy.get('[data-cy=step-indicator-list]').each((element: any, index: number) => {
        cy.wrap(element).click({ force: true });
        cy.get('[data-cy=visit-name-investigator]').eq(index).should('exist');
      });
    });

    it('Sign Visit not occured', () => {
      cy.wrap(visitList).each((element: any, index) => {
        if (visitList[index].status === IVisitStatusIndicator.NotOccurred) {
          cy.get(`[data-cy=visit-${visitList[index].id}]`).click();
          cy.get('[data-cy=input-password]').clear().type(password);
          cy.intercept('POST', '/graphql', (req) => {
            if (req.body.operationName === aliasing.postSignFfgr) {
              req.alias = req.body.operationName;
            }
          });
          cy.get('[data-cy=sign-level]').should('have.text', `Sign ${visitList[index].visitName}`);
          cy.get('[data-cy=btn-sign]').should('be.enabled').click();
          cy.wait(`@${aliasing.postSignFfgr}`, { timeout: 10000 }).then(() => {
            cy.get('.alert-success').should('exist');
            cy.get(`[data-cy=visit-${visitList[index].id}]`)
              .invoke('show')
              .trigger('mouseover')
              .then(() => {
                cy.get(`[data-cy=${IVisitStatusIndicator.Submitted}]`).should('exist');
              });
          });
        }
      });
    });
  });
});
