import {
  ViewFfgrDocument,
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
const moment = require('moment');

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

describe('Read and unread Patient', () => {
  const toggleValue = ['Pending', 'Signed'];
  const getPatient: any = GetPatientListDocument;
  const getVisit: any = GetVisitListDocument;
  const getPatientVisitDetail: any = PatientVisitDetailsDocument;
  const postSignFfgr: any = SignDocument;
  const lockPatient: any = LockPatientDocument;
  const viewFFG: any = ViewFfgrDocument;

  const downloadsFolder = Cypress.config('downloadsFolder');
  const envString = '.zip';
  const currentEnv = Cypress.env('TESTRUNNER_ENV');

  const aliasing = {
    getPatient: getPatient.definitions[0].name.value,
    getVisit: getVisit.definitions[0].name.value,
    getPatientVisitDetail: getPatientVisitDetail.definitions[0].name.value,
    postSignFfgr: postSignFfgr.definitions[0].name.value,
    lockPatient: lockPatient.definitions[0].name.value,
    viewFFG: viewFFG.definitions[0].name.value,
  };

  const countToggle = {
    pending: 0,
    signed: 0,
  };

  const totalData = {
    visit: 0,
    question: 0,
  };

  let queryPatientVisitDetail: any = {};
  let visitList: any = {};
  const listVisitUnseen: any = {};

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

  const getAllFFGFiltered = (data: PatientVisitDetailWithVisitName[]) => {
    const tempFFG = data.reduce((next, prev) => [...next, prev.fieldGroups] as any, []);
    const resultFFG = tempFFG.reduce(
      (next: any, prev: any) => [...next, ...prev],
      [],
    ) as IFieldGroupPatientVisitDetail[];
    return resultFFG;
  };

  const getSignedBy = (visit: any) => {
    const filterSignedVisit = visit?.visitList.filter((visit: any) => visit.signedBy);
    const getSignedUser = filterSignedVisit
      ?.reduce((next: IVisitSignedBy[], prev: any) => {
        const newData = {
          visitId: prev.id,
          visitStatus: prev.status,
          visitName: prev.visitName,
          userId: prev?.signedBy?.id,
          firstName: prev.signedBy?.firstName,
          lastName: prev.signedBy?.lastName,
          signAt: prev.signedAt,
        };
        return [...next, newData] as IVisitSignedBy[];
      }, [])
      .filter(
        (item: any, i: any, current: any) =>
          current.findIndex((data: any) => data.userId === item.userId) === i,
      );

    return getSignedUser;
  };
  before(() => {
    cy.task('deleteFolder', downloadsFolder);
    cy.reseedDB();
    cy.fillInloginAsFormV2(
      mockUserDataInvestigator,
      mockUserDataInvestigator.studyId,
      mockUserDataInvestigator.studyRevisionId,
    );
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
    });
    cy.wait(`@${aliasing.getVisit}`).then((response) => {
      totalData.visit = response.response?.body.data.visitList.length;
      visitList = response.response?.body.data.visitList;
    });
    cy.wait(`@${aliasing.getPatientVisitDetail}`).then((response) => {
      queryPatientVisitDetail = response.response?.body.data;
    });
    cy.waitForReact();
  });

  describe('Read Question', () => {
    before(() => {
      cy.wait(5000);
    });

    it('Scroll to', () => {
      cy.get('[data-cy=card-investigator]').each((element: any, index: any) => {
        cy.wrap(index).then(() => {
          if (index % 2 === 0) {
            cy.get('[data-cy=scroll-investigator]').scrollTo(0, 250 * index, { duration: 2000 });
          }
          cy.get('[data-cy=read-status]')
            .eq(index)
            .should('have.css', 'background-color', 'rgba(0, 0, 0, 0)');
          cy.get(`[data-cy="text-indicator"]`).eq(index).should('have.text', 'viewed');
          cy.get(`[data-cy="icon-check"]`).eq(index).should('exist');
        });
      });
    });

    it('Input, sign, and download patient', () => {
      cy.get('[data-cy=input-password]').should('have.value', '');
      cy.get('[data-cy=btn-sign]').should('be.disabled');
      cy.get('[data-cy=input-password]').type(LOCAL_PASSWORD);
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasing.postSignFfgr) {
          req.alias = req.body.operationName;
        }
        if (req.body.operationName === aliasing.getPatient) {
          req.alias = req.body.operationName;
        }
        if (req.body.operationName === aliasing.getVisit) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=btn-sign]').should('be.enabled').click();
      cy.wait(`@${aliasing.postSignFfgr}`, { timeout: 10000 }).then(() => {
        cy.wait(`@${aliasing.getPatient}`);
        cy.wait(`@${aliasing.getVisit}`).then((responseVisit) => {
          const signedBy = getSignedBy(responseVisit.response?.body.data);
          cy.wrap([responseVisit, signedBy]).then(() => {
            cy.get('.alert-success').should('exist');
            cy.get('[data-cy=toggler]')
              .should('exist')
              .each((element, index) => {
                cy.wrap(element).should('have.value', toggleValue[index]);
                cy.get('[data-cy=count-toggle]')
                  .eq(index)
                  .should(
                    'have.text',
                    index === 0 ? countToggle.pending - 1 : countToggle.signed + 1,
                  );
                cy.get('[data-cy=total-visit-question]').should(
                  'have.text',
                  `${responseVisit.response?.body.data.visitList.length} Visits & ${
                    getAllFFGFiltered(
                      queryPatientVisitDetail.patientVisitDetails.withAndNoSourceForm,
                    ).length
                  } Questions`,
                );
                cy.get('[data-cy=signed-by]').contains(
                  `Electronically signed by ${signedBy[0].firstName} ${
                    signedBy[0].lastName
                  } on ${moment(signedBy[0].signAt).format('DD MMM YYYY')} at ${moment(
                    signedBy[0].signAt,
                  ).format('LT')}`,
                );
              });
            cy.get('[data-cy=btn-download-patient]')
              .click()
              .then(() => {
                cy.wait(3000);
                cy.get('[data-cy=input-password-lock-file]').should('have.value', '');
                cy.get('[data-cy=input-password-lock-file]').type('123');
                cy.get('#btn-submit-lock-file')
                  .click()
                  .then(() => {
                    const filename = path.join(downloadsFolder, 'patient' + envString);
                    cy.wrap(filename).then(() => {
                      cy.readFile(filename, { timeout: 15000 }).should('exist');
                    });
                  });
              });
            cy.get('[data-cy=icons-download-site]')
              .eq(0)
              .click()
              .then(() => {
                cy.wait(3000);
                cy.get('[data-cy=input-password-lock-file]').type('123');
                cy.get('#btn-submit-lock-file')
                  .click()
                  .then(() => {
                    const filename = path.join(downloadsFolder, 'site' + envString);
                    cy.wrap(filename).then(() => {
                      cy.readFile(filename, { timeout: 15000 }).should('exist');
                    });
                  });
              });
            cy.get('[data-cy=icons-download-all]')
              .eq(0)
              .click()
              .then(() => {
                cy.wait(3000);
                cy.get('[data-cy=input-password-lock-file]').type('123');
                cy.get('#btn-submit-lock-file')
                  .click()
                  .then(() => {
                    const filename = path.join(downloadsFolder, 'all' + envString);
                    cy.wrap(filename).then(() => {
                      cy.readFile(filename, { timeout: 15000 }).should('exist');
                    });
                  });
              });
          });
        });
      });
    });
  });
});
