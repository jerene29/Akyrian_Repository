import { mockUserDataAdmin } from '../../src/constant/testFixtures';
import 'cypress-localstorage-commands';
import { GetPatientListDocument, GetVisitListDocument } from '../../src/graphQL/generated/graphql';

describe('Todo List', () => {
  const aliasPatientList = GetPatientListDocument.definitions[0].name.value;
  const aliasVisitList = GetVisitListDocument.definitions[0].name.value;

  before(() => {
    cy.reseedDB();
    cy.clearLocalStorageSnapshot();
    cy.fillInloginAsFormV2(mockUserDataAdmin);
    cy.saveLocalStorage();
  });

  beforeEach(() => {
    cy.restoreLocalStorageCache();
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  it('Get and Display All Todolist in no source', () => {
    let noSourceTodolist;
    const alias = 'GetVisitDetails';
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === alias) {
        req.alias = req.body.operationName;
      }
      if (req.body.operationName === aliasPatientList) {
        req.alias = req.body.operationName;
      }

      if (req.body.operationName === aliasVisitList) {
        req.alias = req.body.operationName;
      }
    });
    cy.visit('visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit1Visit1');
    cy.wait(5000);
    cy.wait(`@${aliasPatientList}`);
    cy.wait(`@${aliasVisitList}`);
    cy.wait(`@${alias}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        noSourceTodolist = result.response.body.data.visitDetails.noSourceForm;
        cy.checkTodolistNoSource(noSourceTodolist);
      }
    });
  });

  it('Get and Display Todolist in source', () => {
    let sourceTodolist;
    const alias = 'GetVisitDetails';
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === alias) {
        req.alias = req.body.operationName;
      }
      if (req.body.operationName === aliasPatientList) {
        req.alias = req.body.operationName;
      }

      if (req.body.operationName === aliasVisitList) {
        req.alias = req.body.operationName;
      }
    });
    cy.visit('visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit1Visit1');
    cy.wait(`@${aliasPatientList}`);
    cy.wait(`@${aliasVisitList}`);
    cy.get('#cy-tabsource').click({ force: true });
    cy.wait(3000);
    cy.wait(`@${alias}`).then((result) => {
      if (result.response.statusCode === 200) {
        sourceTodolist = result.response.body.data.visitDetails.withSourceForm;
        cy.checkTodolistSource(sourceTodolist);
      }
    });
  });

  it('No todolist in source', () => {
    const greatJobs = 'Great Job!';
    const greatJobsDesc = 'You have completed all outstanding tasks';
    const alias = 'GetVisitDetails';
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === alias) {
        req.alias = req.body.operationName;
      }
      if (req.body.operationName === aliasPatientList) {
        req.alias = req.body.operationName;
      }

      if (req.body.operationName === aliasVisitList) {
        req.alias = req.body.operationName;
      }
    });
    cy.visit('visit/testRevisionId1/bellevueHospital1/multiSitePatient1/screeningVisit1');
    cy.wait(`@${aliasPatientList}`);
    cy.wait(`@${aliasVisitList}`);
    cy.get('#cy-tabsource').click({ force: true });
    cy.wait(3000);
    cy.get('#cy-todolist').should('not.exist');
    cy.get('[data-cy=great-jobs]').contains(greatJobs);
    cy.get('[data-cy=great-jobs-desc]').contains(greatJobsDesc);
  });
});
