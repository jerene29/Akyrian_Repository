import {
  GetPatientListDocument,
  GetStudyListDocument,
  GetVisitListDocument,
} from '../../src/graphQL/generated/graphql';

describe('Copy paste URL', () => {
  const aliasing = {
    getPatients: GetPatientListDocument as any,
    getVisits: GetVisitListDocument as any,
    getStudyList: GetStudyListDocument as any,
  };

  const getPatients = aliasing.getPatients.definitions[0].name.value;
  const getVisits = aliasing.getVisits.definitions[0].name.value;
  const getStudyList = aliasing.getStudyList.definitions[0].name.value;

  const interception = (operationName: any[]) => {
    cy.intercept('POST', '/graphql', (req) => {
      operationName.map((operation) => {
        if (req.body.operationName === operation) {
          req.alias = req.body.operationName;
        }
      });
    });
  };

  const login = (visit: string) => {
    cy.fillInloginAsFormV2({
      email: 'admin@example.com',
    });

    interception([getPatients, getVisits, getStudyList]);
    cy.visit(visit);
    if (visit !== '/dashboard') {
      cy.wait(`@${getStudyList}`);
      cy.wait(`@${getPatients}`);
      cy.wait(`@${getVisits}`);
    }
    cy.waitForReact();
  };

  const logout = () => {
    cy.logout().then(() => {
      cy.url().should('eq', `${Cypress.env('REACT_APP_BASE_URL')}/login`);
    });
  };

  before(() => {
    cy.reseedDB();
  });

  describe('Copy visit', () => {
    before(() => {
      login('/visit');
    });
    it('logout', () => {
      logout();
    });
  });

  describe('Back to login', () => {
    before(() => {
      login('/visit/testRevisionId2/toDaiHospital1/toDaiPatient3/screeningVisitStudy2_1');
    });
    it('Ebola should has been chosen', () => {
      cy.get('.label-study-list').contains('EBOLA');
      logout();
    });
  });

  describe('Login to dashboard and visit ebola', () => {
    before(() => {
      login('/dashboard');
    });
    it('Ebola should has been chosen', () => {
      cy.visit('/visit/testRevisionId2/toDaiHospital1/toDaiPatient3/screeningVisitStudy2_1');
      cy.get('.label-study-list').contains('EBOLA');
      logout();
    });
  });
});
