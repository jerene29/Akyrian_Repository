import {
  GetVisitDetailSourceDocument,
  GetPatientListDocument,
  GetVisitListDocument,
  StudyCollectionDocument,
  GetStudyRevisionListDocument,
  CreateVisitDocument,
  LockPatientDocument,
} from '../../src/graphQL/generated/graphql';
const addAdHocData: any = {};
const aliasPatientList = GetPatientListDocument.definitions[0] as any;
const aliasVisitList = GetVisitListDocument.definitions[0] as any;
const aliasStudyRevList = GetStudyRevisionListDocument.definitions[0] as any;
const alias = GetVisitDetailSourceDocument.definitions[0] as any;

const aliasing = {
  aliasPatientList: aliasPatientList.name.value,
  aliasVisitList: aliasVisitList.name.value,
  aliasStudyRevList: aliasStudyRevList.name.value,
  alias: alias.name.value,
};

describe.skip('Test to able click card in all state No Source', () => {
  before(() => {
    cy.reseedDB();
    cy.clearLocalStorageSnapshot();
    cy.fillInloginAsFormV2({
      email: 'nosourcereview@example.com',
    });
    cy.saveLocalStorage();
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasing.aliasPatientList) {
        req.alias = req.body.operationName;
      }

      if (req.body.operationName === aliasing.aliasVisitList) {
        req.alias = req.body.operationName;
      }
    });
    cy.visit('/visit/testRevisionId1/bellevueHospital1/bellevuePatient1');
    cy.wait(`@${aliasing.aliasPatientList}`);
    cy.wait(`@${aliasing.aliasVisitList}`);
    cy.waitForReact();
  });

  describe('Test 1', () => {
    it('Select SLO', () => {
      cy.get('#multiSitePatient1-selectable-patient').click();
      cy.wait(1000);
    });
    it('Select visit 1', () => {
      cy.get('[data-cy=visit-visit1Visit1]').click({ force: true });
      cy.wait(1000);
      cy.get('[data-cy=confirmModal-confirmButton]').click();
      cy.wait(1000);
    });
    it('Select all filter and click a card', () => {
      cy.get('[data-cy=all-filter]').click();
      cy.wait(1000);
      cy.get('[data-cy=question-card-vitaminApplied1]').click();
      cy.wait(1000);
      cy.get('.ant-modal-body').should('exist');
      cy.wait(1000);
      cy.wait(1000);
    });
    it('logout', () => {
      cy.wait(2000);
      cy.logout();
    });
  });
});

describe.skip('Test to able click card in all state Source Capture', () => {
  before(() => {
    cy.reseedDB();
    cy.clearLocalStorageSnapshot();
    cy.fillInloginAsFormV2({
      email: 'verification@example.com',
    });
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasing.aliasPatientList) {
        req.alias = req.body.operationName;
      }

      if (req.body.operationName === aliasing.aliasVisitList) {
        req.alias = req.body.operationName;
      }
    });
    cy.visit('/visit/testRevisionId1/bellevueHospital1/bellevuePatient1');
    cy.wait(`@${aliasing.aliasPatientList}`);
    cy.wait(`@${aliasing.aliasVisitList}`);
    cy.waitForReact();
  });

  describe('Test 2', () => {
    it('Select SLO', () => {
      cy.get('#multiSitePatient1-selectable-patient').click();
      cy.wait(1000);
    });
    it('Select visit 1', () => {
      cy.get('[data-cy=visit-visit1Visit1]').click({ force: true });
      cy.wait(1000);
      cy.get('[data-cy=confirmModal-confirmButton]').click();
      cy.wait(1000);
    });
    it('Select all filter and click a card', () => {
      cy.get('[data-cy=all-filter]').click();
      cy.wait(1000);
      cy.get('[data-cy=question-card-sanity1]').click();
      cy.wait(1000);
      cy.get('.ant-modal-body').should('exist');
      cy.wait(1000);
    });
  });
});
