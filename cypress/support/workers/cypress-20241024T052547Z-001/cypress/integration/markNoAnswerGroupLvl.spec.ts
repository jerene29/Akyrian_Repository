import {
  GetVisitDetailSourceDocument,
  GetPatientListDocument,
  GetVisitListDocument,
  MarkAsNoAnswerDocument,
} from '../../src/graphQL/generated/graphql';

describe('Mark As No Answer in source cature group level', () => {
  const aliasPatientList = GetPatientListDocument.definitions[0].name.value;
  const aliasVisitList = GetVisitListDocument.definitions[0].name.value;
  const aliasSource = 'GetVisitDetails';

  const aliasNoAnswer = MarkAsNoAnswerDocument.definitions[0].name.value;
  let patientData: any;
  let questionFilters: any;
  let visitDetailsSource: any;
  let userVisitData: any;

  before(() => {
    cy.reseedDB();
    cy.clearLocalStorageSnapshot();
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
      if (req.body.operationName === aliasSource) {
        req.alias = req.body.operationName;
      }
    });
    cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit1Visit1');
    cy.wait(`@${aliasPatientList}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        patientData = result.response.body.data.sitePatientList[0].patients.filter(
          (el) => el.id === 'multiSitePatient1',
        )[0];
      }
    });
    cy.wait(`@${aliasVisitList}`);
    cy.get('[data-cy=sourceQuestionTab]').click();
    cy.wait(`@${aliasSource}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        visitDetailsSource = result.response.body.data.visitDetails.withSourceForm.fieldGroups;
        userVisitData = result.response.body.data.visitDetails.withSourceForm.userVisitData;
        questionFilters = result.response.body.data.visitDetails.withSourceForm;
      }
    });
    cy.waitForReact();
  });

  beforeEach(() => {
    cy.waitForReact();
    cy.restoreLocalStorageCache();
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  it('Unattached', () => {
    cy.get('#cy-tabsource').should('exist');
    // cy.get('[data-cy=UNATTACHED]').click({ force: true }); //unattached state
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasNoAnswer) {
        req.alias = req.body.operationName;
      }
    });
    cy.markAsNoAnswerStates(questionFilters, patientData, 'Unattached');
    cy.wait(`@${aliasNoAnswer}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        cy.get('[data-cy=alert-success]').should('exist');
      }
    });
  });
  it('Rejected', () => {
    cy.get('[data-cy=NOT_AVAILABLE_REJECTED]').click(); // rejected
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasNoAnswer) {
        req.alias = req.body.operationName;
      }
    });
    cy.markAsNoAnswerStates(questionFilters, patientData, 'Rejected');
    cy.wait(`@${aliasNoAnswer}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        cy.get('[data-cy=alert-success]').should('exist');
      }
    });
  });
  it('Attached', () => {
    cy.get('[data-cy=ATTACHED]').click(); // attached, pending snippet
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasNoAnswer) {
        req.alias = req.body.operationName;
      }
    });
    cy.markAsNoAnswerStates(questionFilters, patientData, 'Attached');
    cy.wait(`@${aliasNoAnswer}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        cy.get('[data-cy=alert-success]').should('exist');
      }
    });
  });
});
