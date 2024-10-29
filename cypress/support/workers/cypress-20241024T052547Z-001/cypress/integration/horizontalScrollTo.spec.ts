import {
  GetPatientListDocument,
  GetVisitListDocument,
} from '../../src/graphQL/generated/graphql';
import { mockUserDataAdmin } from '../../src/constant/testFixtures';

describe('Horizontal ScrollTo Status', () => {
  let visitDetailsSource: any;
  const aliasPatientList = GetPatientListDocument.definitions[0].name.value;
  const aliasVisitList = GetVisitListDocument.definitions[0].name.value;
  const aliasVisitDetails = 'GetVisitDetails';

  before(() => {
    cy.clearLocalStorageSnapshot();
    cy.fillInloginAsFormV2(mockUserDataAdmin);
    cy.intercept('POST', '/graphql', req => {
      if (req.body.operationName === aliasPatientList) {
        req.alias = req.body.operationName;
      }

      if (req.body.operationName === aliasVisitList) {
        req.alias = req.body.operationName;
      }

      if (req.body.operationName === aliasVisitDetails) {
        req.alias = req.body.operationName;
      }
    });
    cy.waitForReact();
    cy.visit('/visit/testRevisionId1/toDaiHospital1/toDaiPatient1/visit1Visit2');
    cy.wait(`@${ aliasPatientList }`);
    cy.wait(`@${ aliasVisitList }`);
    cy.wait(`@${ aliasVisitDetails }`).then(result => {
      if (result?.response?.statusCode === 200) {
        visitDetailsSource = result.response.body.data.visitDetails.withSourceForm.fieldGroups;
      }
    });
    cy.get('[data-cy=sourceQuestionTab]').should('have.text', 'Source Capture Questions (SDE)')
      .click();
  });

  it('Click todo list and scroll to view', () => {
    cy.get('[data-cy=todolist-NEED_REASON_NOT_AVAILABLE]').click();
    cy.get('[data-cy=todolist-FILLED]').should('be.visible');
    cy.get('[data-cy=todolist-FILLED]').click();
    cy.get('[data-cy=FILLED]').should('be.visible');
  });

  it('It scoll back', () => {
    cy.get('[data-cy=todolist-NEED_REASON_NOT_AVAILABLE]').click();
    cy.get('[data-cy=UNATTACHED]').should('be.visible');
  });
});
