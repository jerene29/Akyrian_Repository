import moment = require('moment');
import {
  GetPatientListDocument,
  GetStudyListDocument,
  GetVisitListDocument,
  LockPatientDocument,
  GetUnreadNotifAndUnresolveQueryCountDocument,
  GetVisitDetailsDocument,
  IUserStudy,
} from '../../src/graphQL/generated/graphql';

describe('Query Assigned to me', () => {
  const aliasing = {
    getPatients: GetPatientListDocument as any,
    getVisits: GetVisitListDocument as any,
    lockPatient: LockPatientDocument as any,
    getQueryCount: GetUnreadNotifAndUnresolveQueryCountDocument as any,
    getStudyList: GetStudyListDocument as any,
    visitDetail: GetVisitDetailsDocument as any,
  };

  const getPatients = aliasing.getPatients.definitions[0].name.value;
  const getVisits = aliasing.getVisits.definitions[0].name.value;
  const lockPatient = aliasing.lockPatient.definitions[0].name.value;
  const getQueryCount = aliasing.getQueryCount.definitions[0].name.value;
  const getStudyList = aliasing.getStudyList.definitions[0].name.value;
  const getVisitDetail = aliasing.visitDetail.definitions[0].name.value;

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
    interception([getPatients, getVisits, getStudyList]);

    cy.fillInloginAsFormV2({
      email: 'oak@example.com',
    });

    cy.visit('/visit');
    cy.wait(`@${getStudyList}`);
    cy.wait(`@${getPatients}`);
    cy.wait(`@${getVisits}`);
    cy.waitForReact();
  });

  describe('dashboard', () => {
    let lastLogin = {} as any;
    let listSiteRole = [] as any;

    before(() => {
      lastLogin = JSON.parse(localStorage.getItem('userInfo') || '{}');
      listSiteRole = JSON.parse(localStorage.getItem('userStudies') || '[]');
      listSiteRole = listSiteRole.reduce((unique: any[], current: IUserStudy) => {
        if (
          !unique.some(
            (existData) =>
              existData?.siteName === current?.site?.name &&
              existData?.roleName === current?.userRole?.name,
          )
        ) {
          const data = {
            siteName: current?.site?.name || '',
            roleName: current?.userRole?.name || '',
          };
          unique.push(data);
        }
        return unique;
      }, []);
    });

    it('Select Patient', () => {
      cy.wait(4000);
      interception([getPatients, getVisits, lockPatient]);
      cy.get('#multiSitePatient1-selectable-patient').click();
      cy.wait(`@${lockPatient}`);
      cy.wait(`@${getVisits}`);
    });

    it('Select question', () => {
      cy.clickQuickAction(
        '[data-cy=question-card-dateConsent1]',
        '[data-cy=add-query-dateConsent1]',
      );
      cy.get('.multiline-input__input').click().type('hello akyrian');
      cy.get('[data-cy=assignee-auto-complete]').click().type('birch').type(`{downarrow}{enter}`);
      cy.get('[data-cy=inititator-submit-btn]').should('be.enabled').click();
      cy.get('[data-cy=modal-close]').click();
      cy.get('[data-cy=visit-visit1Visit1]').click();
    });

    it('Change another question', () => {
      cy.get('[data-cy=sourceQuestionTab]').click();
      cy.wait(3000);
      cy.get('[data-cy=question-card-datesVaccinate1]').scrollIntoView();
      cy.clickQuickAction(
        '[data-cy=question-card-datesVaccinate1]',
        '[data-cy=add-query-datesVaccinate1]',
        undefined,
        undefined,
        'SVG',
      );
      cy.get('[data-cy=mention-text-field-initiator]').click({ force: true }).type('hello akyrian');
      cy.get('[data-cy=assignee-auto-complete]')
        .click()
        .type('data entry')
        .type(`{downarrow}{enter}`);
      cy.get('[data-cy=inititator-submit-btn]').should('be.enabled').click();
      cy.get('[data-cy=modal-close]').click();
    });

    it('check popover profile, and logout', () => {
      cy.get('[data-cy=sidebar-toggle-arrow]').click();
      cy.get('#bellevuePatient1-selectable-patient').click();
      cy.wait(2000);
      cy.get('[data-cy=header-user-avatar]').first().click();
      cy.wrap([lastLogin, listSiteRole]).then(() => {
        cy.get('[data-cy=first-role]').should('have.text', `${listSiteRole[0]?.roleName}`);
        cy.get('[data-cy=first-site]').should('have.text', `${listSiteRole[0]?.siteName}`);
        cy.get('[data-cy=last-login-date]').contains(
          moment(lastLogin.lastLoginAt).format('DD MMM YYYY'),
        );
        cy.get('[data-cy=last-login-time]').should('exist');
      });
      cy.get('[data-cy=logout-text]')
        .eq(0)
        .click()
        .then(() => {
          cy.url().should('eq', `${Cypress.env('REACT_APP_BASE_URL')}/login`);
        });
    });
  });

  describe('Login another user', () => {
    before(() => {
      cy.fillInloginAsFormV2({
        email: 'birch@example.com',
      });

      cy.saveLocalStorage();
      interception([getPatients, getVisits, getStudyList, getQueryCount]);
      cy.visit('/visit');
      cy.wait(`@${getStudyList}`);
      cy.wait(`@${getPatients}`);
      cy.wait(`@${getVisits}`);
    });

    it('Click global query label', () => {
      cy.get('[data-cy=label-query-global]').click();
      cy.wait(`@${getQueryCount}`, { timeout: 100000 }).then((response) => {
        if (response.response?.body.data.unresolvedQueryForMeCount)
          cy.get('.sidebar-selected-filter-container')
            .should('exist')
            .contains('Query Newly Assigned To Me');
        else cy.get('.sidebar-selected-filter-container').should('not.exist');
      });
      cy.wait(`@${getPatients}`);
      cy.wait(`@${getVisits}`);
      cy.get('[data-cy=total-patient]').should('exist');
      cy.get('[data-cy=total-question]').should('exist');
      cy.get('[data-cy=query-tag-dateConsent1]').should('exist');
      cy.get('[data-cy=sidebar-toggle-arrow]').click();
    });

    it('Close modal and logout', () => {
      cy.get('[data-cy=sidebar-toggle-arrow]').click();
      cy.wait(2000);
      cy.get('[data-cy=header-user-avatar]').first().click();
      cy.get('[data-cy=logout-text]')
        .eq(0)
        .click()
        .then(() => {
          cy.url().should('eq', `${Cypress.env('REACT_APP_BASE_URL')}/login`);
        });
    });
  });

  describe('Login another user', () => {
    before(() => {
      cy.fillInloginAsFormV2({
        email: 'dataentrya@example.com',
      });

      cy.saveLocalStorage();
      interception([getPatients, getVisits, getStudyList, getQueryCount]);
      cy.visit('/visit');
      cy.wait(`@${getStudyList}`);
      cy.wait(`@${getPatients}`);
      cy.wait(`@${getVisits}`);
    });

    it('Click global query label', () => {
      cy.get('[data-cy=label-query-global]').click();
      cy.wait(`@${getQueryCount}`, { timeout: 100000 }).then((response) => {
        if (response.response?.body.data.unresolvedQueryForMeCount)
          cy.get('.sidebar-selected-filter-container')
            .should('exist')
            .contains('Query Newly Assigned To Me');
        else cy.get('.sidebar-selected-filter-container').should('not.exist');
      });
      cy.wait(`@${getPatients}`);
      cy.wait(`@${getVisits}`, { timeout: 60000 });
      cy.get('[data-cy=sourceQuestionTab]').click();
      cy.get('[data-cy=total-patient]').should('exist');
      cy.get('[data-cy=total-question]').should('exist');
      cy.get('[data-cy=query-tag-datesVaccinate1]').should('exist');
      cy.get('[data-cy=sidebar-toggle-arrow]').click();
    });
  });
});
