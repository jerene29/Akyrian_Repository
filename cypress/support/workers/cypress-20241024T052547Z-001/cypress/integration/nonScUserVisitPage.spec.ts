import 'cypress-localstorage-commands';
import { months } from 'moment';
import {
  GetPatientListDocument,
  GetVisitListDocument,
  AddPatientDocument,
} from '../../src/graphQL/generated/graphql';

import { d } from '../helper';

const aliasPatientList = GetPatientListDocument.definitions[0].name.value;
const aliasVisitList = GetVisitListDocument.definitions[0].name.value;

let visitListData: any;
let patientListData: any;

describe('Non sc user visit page', () => {
  describe('Test Hide Buttons and Pages', () => {
    before(() => {
      cy.reseedDB();
      cy.fillInloginAsFormV2({
        email: 'dataentrya@example.com',
      });
      cy.saveLocalStorage();
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasPatientList) {
          req.alias = req.body.operationName;
        }

        if (req.body.operationName === aliasVisitList) {
          req.alias = req.body.operationName;
        }
      });
      cy.waitForReact();
      cy.visit('/visit/testRevisionId1/bellevueHospital1/bellevuePatient1');
      cy.wait(`@${aliasPatientList}`);
      cy.wait(`@${aliasVisitList}`).then(({ error, response }) => {
        cy.log(JSON.stringify({ response, error }));
      });
    });

    it('Check hidden add patient, add visit , patient that all visit not started yet, and visit that not started yet', () => {
      cy.get('#add-patient-icon').should('not.exist');
      cy.get('.sidebar-toggle-arrow').click({ force: true });
      cy.get('#add-visit-modal-button').should('not.exist');
      cy.wait(5000);
      cy.get('#subtitle-notif-nonsc').should('exist');
      cy.get('#subtitle-notif-nonsc').should(
        'have.text',
        'This visit has not yet been started and you do not have permission to start visits.',
      );
      cy.get('#subtitle2-notif-nonsc').should(
        'have.text',
        'Please contact a site user to request that they start this visit.',
      );
      cy.wait(3000);
      cy.get('[data-cy=visit-screeningVisit4]').click();
      cy.get('#subtitle-notif-nonsc').should(
        'have.text',
        'This visit has not yet been started and you do not have permission to start visits.',
      );
      cy.get('#subtitle2-notif-nonsc').should(
        'have.text',
        'Please contact a site user to request that they start this visit.',
      );
      cy.get('[data-cy=sidebar-toggle-arrow]').click();
      cy.get('#multiSitePatient1-selectable-patient').click();
      cy.wait(3000);
      cy.logout();
      cy.clearLocalStorageSnapshot();
    });
  });

  describe('Setup visit reminder and not occured', () => {
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
    before(() => {
      cy.fillInloginAsFormV2({
        email: 'admin@example.com',
      });
      cy.saveLocalStorage();
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasPatientList) {
          req.alias = req.body.operationName;
        }

        if (req.body.operationName === aliasVisitList) {
          req.alias = req.body.operationName;
        }
      });
      cy.waitForReact();
      cy.visit('/visit/testRevisionId1/bellevueHospital1/bellevuePatient1');
      cy.wait(`@${aliasPatientList}`);
      cy.wait(`@${aliasVisitList}`);
    });
    it('checks if it assign visit did occur', () => {
      cy.get('#bellevuePatient1-selectable-patient').click();
      cy.get('[data-cy=visit-screeningVisit4]').click({ force: true });
      cy.get('#rc_select_1').click();
      cy.get('.ant-select-item-option-active > .ant-select-item-option-content').click();
      cy.wait(5000);

      cy.fillInTodayForDateDropdown();

      cy.get('.illustration-container').click();
      cy.get('[data-cy=button-submit-visit]').click();
      cy.wait(5000);
    });
    it('cretate visit reminder and not occured', () => {
      cy.get('[data-cy=visit-visit1Visit4]').click();
      cy.get('[data-cy=select-container]').click().type('{downarrow}{enter}');
      cy.get('#submit-reminder').click();
      cy.wait(5000);
      cy.get('[data-cy=visit-visit2Visit4]').click();
      cy.get('[data-cy=start-visit-text]').click();
      cy.get('[data-cy=select-visit-status]').click().type('{downarrow}{enter}');
      cy.get('#select-visit-not-occured').click().type('{downarrow}{enter}', { force: true });

      cy.get('[data-cy=button-submit-visit]').click();
      cy.wait(5000);
    });
  });

  describe('Test visit reminder and visit not occured', () => {
    before(() => {
      cy.clearLocalStorageSnapshot();
      cy.visit('/login');
      cy.fillInloginAsFormV2({
        email: 'dataentrya@example.com',
      });
      cy.saveLocalStorage();
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasPatientList) {
          req.alias = req.body.operationName;
        }

        if (req.body.operationName === aliasVisitList) {
          req.alias = req.body.operationName;
        }
      });
      cy.waitForReact();
      cy.visit('/visit/testRevisionId1/bellevueHospital1/bellevuePatient1');
      cy.wait(`@${aliasPatientList}`);
      cy.wait(`@${aliasVisitList}`);
    });
    it('check hidden add patient, add visit , patient that all visit not started yet, and visit that not started yet', () => {
      cy.get('.sidebar-toggle-arrow').click({ force: true });
      cy.get('[data-cy=visit-visit1Visit4]').click({ force: true });
      cy.get('#subtitle-notif-nonsc').should('exist');
      cy.get('#subtitle-notif-nonsc').should(
        'have.text',
        'This visit has not yet been started and you do not have permission to start visits.',
      );
      cy.get('[data-cy=visit-visit2Visit4]').click();
      cy.get('[data-cy=change-button]').should('not.exist');
    });
  });
});
