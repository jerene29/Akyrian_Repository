import {
  GetVisitListDocument,
  GetPatientListDocument,
} from '../../../src/graphQL/generated/graphql';
import 'cypress-localstorage-commands';

describe('Test runner visit read only', () => {
  describe('Set up Add patient multisite', () => {
    const aliasPatientList = GetPatientListDocument.definitions[0].name.value;
    const aliasVisitList = GetVisitListDocument.definitions[0].name.value;
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const dateObj = new Date();
    const month = monthNames[dateObj.getMonth()];
    const day = String(dateObj.getDate()).padStart(2, '0');
    const year = dateObj.getFullYear();
    const currentDate = `${month}, ${day} ${year}`;
    let newGGGPatientVisitList: any;

    before(() => {
      cy.reseedDB();
      cy.clearLocalStorageSnapshot();
      cy.visit('/login');
      cy.fillInloginAsFormV2({
        email: 'admin@example.com',
      });
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasPatientList) {
          req.alias = req.body.operationName;
        }

        if (req.body.operationName === aliasVisitList) {
          req.alias = req.body.operationName;
        }
      });
      cy.visit('/visit');
      // cy.visit('/visit/testRevisionId1/toDaiHospital1/cks5x2rcs13134e3n36ytg34gy')
      cy.waitForReact();
      cy.wait(`@${aliasPatientList}`);
      cy.wait(`@${aliasVisitList}`).then((res) => {
        if (res.response?.statusCode === 200) {
        }
      });
    });

    beforeEach(() => {
      cy.waitForReact();
      cy.restoreLocalStorageCache();
    });

    afterEach(() => {
      cy.saveLocalStorageCache();
    });

    describe('Add GGM-TES45M patient in bellevue', () => {
      it('Fill add patient form', () => {
        cy.get('#add-patient-icon').should('exist');
        cy.get('#add-patient-icon').click();
        cy.get('#firstNameInitial').clear();
        cy.get('#firstNameInitial').type('G');
        cy.get('#middleNameInitial').clear();
        cy.get('#middleNameInitial').type('G');
        cy.get('#lastNameInitial').clear();
        cy.get('#lastNameInitial').type('M');
        cy.get(
          ':nth-child(1) > .ant-row > :nth-child(1) > .ant-radio-wrapper > .ant-radio > .ant-radio-input',
        ).check();
        cy.get('#dob').click();
        cy.get('#dob').type(`aug, 01 2021`);
        cy.get('#patientStudyId').clear();
        cy.get('#patientStudyId').type('GGM-TES45M');
        cy.get('.addPatient-siteId').click();
        cy.get('#siteId').clear();
        cy.get('#siteId').type('Bellevue Hospital{enter}');
        cy.get('#button-submit-add-patient').click();
        cy.wait(6000);
      });
    });

    describe('Add GGM-TES45M patient in tokyo', () => {
      it('Fill add patient form', () => {
        cy.get('#add-patient-icon').should('exist');
        cy.get('#add-patient-icon').click();
        cy.get('#firstNameInitial').clear();
        cy.get('#firstNameInitial').type('G');
        cy.get('#middleNameInitial').clear();
        cy.get('#middleNameInitial').type('G');
        cy.get('#lastNameInitial').clear();
        cy.get('#lastNameInitial').type('M');
        cy.get(
          ':nth-child(1) > .ant-row > :nth-child(1) > .ant-radio-wrapper > .ant-radio > .ant-radio-input',
        ).check();
        cy.get('#dob').click();
        cy.get('#dob').type(`jun, 01 2021`);
        cy.get('#patientStudyId').clear();
        cy.get('#patientStudyId').type('GGM-TES45M');
        cy.get('.addPatient-siteId').click();
        cy.get('#siteId').clear();
        cy.get('#siteId').type('University of Tokyo Hospital{enter}');
        cy.get('#button-submit-add-patient').click();
        cy.intercept('POST', '/graphql', (req) => {
          if (req.body.operationName === aliasPatientList) {
            req.alias = req.body.operationName;
          }

          if (req.body.operationName === aliasVisitList) {
            req.alias = req.body.operationName;
          }
        });
        cy.get('[data-cy=confirmModal-confirmButton]').click();
        cy.waitForReact();
        cy.wait(`@${aliasPatientList}`);
        cy.wait(`@${aliasVisitList}`).then((result) => {
          if (result.response?.statusCode === 200) {
            newGGGPatientVisitList = result.response.body.data.visitList;
          }
        });
        cy.wait(6000);
      });
    });

    describe('start visit in all visit of GGM-TES45M', () => {
      it('start all visit in tokyo', () => {
        cy.wait(3000);
        cy.get('.sidebar-toggle-arrow').click();
        cy.wait(3000);
        cy.wrap(newGGGPatientVisitList).each((visit) => {
          cy.get(`[data-cy=visit-${visit?.id}]`).click({ force: true });
          cy.get('[data-cy=select-visit-status]').click();
          // cy.get('#rc_select_1').click();
          cy.get('[data-cy=select-visit-status]').type('{enter}');
          cy.get('#date').click();
          cy.get('#date').clear();
          cy.get('#date').type('jun 01, 2021{enter}');
          cy.wait(7000);
        });
      });
    });
  });

  describe('Visit Read Only Mode', () => {
    let patientList: any = [];
    let visitList: any = [];
    let selectedPatient: any = [];
    let selectedVisit: any = [];
    let visitId: string = '';
    let lockPatient: any;
    let GGGpatient: any;

    const aliasPatientList = GetPatientListDocument.definitions[0].name.value;
    const aliasVisitList = GetVisitListDocument.definitions[0].name.value;

    beforeEach(() => {
      // cy.clearLocalStorageSnapshot();
      cy.visit('/login');
      cy.fillInloginAsFormV2({
        email: 'dataentrya@example.com',
      });
      cy.saveLocalStorage();
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasPatientList) {
          req.alias = req.body.operationName;
        }
      });
      cy.visit('/');
      cy.waitForReact();
      cy.wait(`@${aliasPatientList}`).then((result) => {
        if (result?.response?.statusCode === 200) {
          patientList = result?.response?.body.data.sitePatientList[0].patients;
          lockPatient = patientList.filter((el) => el.patientStudyId === 'OSA-TUH029')[0];
          GGGpatient = patientList.filter((el) => el.patientStudyId === 'GGM-TES45M')[0];
        }
      });
    });

    it('Click patient that have all visit that user dont have access to its site from un patient lock', () => {
      const GGGpatient = patientList.filter((el) => el.patientStudyId === 'GGM-TES45M')[0];
      let currentUrl = '';
      let destinationUrl = '';
      if (GGGpatient) {
        cy.url().then((url) => {
          currentUrl = url;
        });
        cy.get(`#${GGGpatient.id}-selectable-patient`).click({ force: true });
        cy.get('[data-cy=confirmation-modal-title]').should('exist').contains('Heads Up!');
        cy.get('[data-cy=confirmation-modal-desc]')
          .should('exist')
          .contains(
            'This visit took place at a site that you do not have access to. You can only view this visit in a read only mode.',
          );
        cy.get('[data-cy=confirmModal-cancelButton]').click();
        cy.url().should('include', currentUrl);
        cy.get('.sidebar-toggle-arrow').click();
        cy.get(`#${GGGpatient.id}-selectable-patient`).click({ force: true });
        cy.get('[data-cy=confirmModal-confirmButton]').click();
        cy.get('.read-only-mode__bold').should('exist');
      }
    });

    it('Click patient that have all visit that user dont have access to its site from patient lock', () => {
      let currentUrl = '';
      let destinationUrl = '';
      if (lockPatient && GGGpatient) {
        lockPatient = patientList.filter((el) => el.patientStudyId === 'OSA-TUH029')[0];
        GGGpatient = patientList.filter((el) => el.patientStudyId === 'GGM-TES45M')[0];
        const { firstName, lastName } = lockPatient.patientLock.user;
        cy.get(`#${lockPatient.id}-selectable-patient`).click({ force: true });
        cy.get('.ant-modal-body').should('be.visible');
        cy.get('[data-cy=confirmation-modal-title]')
          .should('exist')
          .contains(`This patient is being worked on by ${firstName} ${lastName}`);
        cy.get('[data-cy=confirmation-modal-desc]')
          .should('exist')
          .contains('You can only access this patient on view only mode.');
        cy.get('[data-cy=confirmModal-confirmButton]').click({ force: true });
        cy.url().then((url) => {
          currentUrl = url;
        });
        cy.get('.ant-modal-body').should('not.visible');
        cy.get('.sidebar-toggle-arrow').click();
        cy.get(`#${GGGpatient.id}-selectable-patient`).click({ force: true });
        cy.get('[data-cy=confirmModal-confirmButton]')
          .should('be.visible')
          .then(() => {
            cy.get('[data-cy=confirmation-modal-title]').should('exist');
            cy.get('[data-cy=confirmation-modal-title]').should(
              'have.text',
              `This patient is being worked on by ${firstName} ${lastName}Heads Up!`,
            );
            cy.get('[data-cy=confirmModal-cancelButton]').each((el, i) => {
              if (i !== 0) {
                cy.wrap(el).click();
                cy.url().should('eq', currentUrl);
              }
            });
            cy.get('.sidebar-toggle-arrow').click();
          });
        cy.get(`#${GGGpatient.id}-selectable-patient`).click({ force: true });
        cy.get('[data-cy=confirmModal-confirmButton]')
          .should('be.visible')
          .then(() => {
            cy.get('[data-cy=confirmModal-confirmButton]').each((el, i) => {
              if (i !== 0) {
                cy.wrap(el).click();
              }
            });
          });
        cy.get('.read-only-mode__bold').should('exist');
        cy.get('.sidebar-toggle-arrow').click();
      }
    });

    it('Click slo patient and check selected visit that user has access to it', () => {
      const SLOpatient = patientList.filter((el) => el.patientStudyId === 'SLO-OMN192')[0];
      cy.get(`#${SLOpatient.id}-selectable-patient`).click();
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasVisitList) {
          req.alias = req.body.operationName;
        }
      });
      cy.waitForReact();
      cy.wait(`@${aliasVisitList}`).then((result) => {
        if (result?.response?.statusCode === 200) {
          visitList = result?.response?.body.data.visitList;
        }
      });
      cy.wait(1000);
      cy.url().then((url) => {
        const visitUrl = url.split('/');
        visitId = visitUrl[visitUrl.length - 1];
        const currentVisitData = visitList.filter((el) => el.id === visitId);
        const isMatchSite = SLOpatient.sitesAccess.filter((el) => el.id === currentVisitData.site);
        if (isMatchSite || currentVisitData === null) {
          cy.get('[data-cy=visit-visit1Visit1]').click();
          cy.get('[data-cy=confirmation-modal-title]').should('exist').contains('Heads Up!');
          cy.get('[data-cy=confirmation-modal-desc]')
            .should('exist')
            .contains(
              'This visit took place at a site that you do not have access to. You can only view this visit in a read only mode.',
            );
          cy.get('[data-cy=confirmModal-cancelButton]').click();
          cy.get('[data-cy=visit-visit1Visit1]').click();
          cy.get('[data-cy=confirmModal-confirmButton]').click();
          cy.get('.read-only-mode__bold').should('exist');
          cy.get('.sidebar-toggle-arrow').click();
        }
      });
    });
  });
});
