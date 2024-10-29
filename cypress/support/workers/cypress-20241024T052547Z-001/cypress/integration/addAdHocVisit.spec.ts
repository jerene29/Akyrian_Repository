import { GetPatientListDocument, GetVisitListDocument } from '../../src/graphQL/generated/graphql';
import { userDataSourceCapture } from '../../src/constant/testFixtures';

describe('Add Ad Hoc Visit', () => {
  const aliasPatientList = GetPatientListDocument.definitions[0].name.value;
  const aliasVisitList = GetVisitListDocument.definitions[0].name.value;

  before(() => {
    cy.beforeSetup(userDataSourceCapture);
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasPatientList) {
        req.alias = req.body.operationName;
      }

      if (req.body.operationName === aliasVisitList) {
        req.alias = req.body.operationName;
      }
    });
    cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/screeningVisit1');
    cy.wait(`@${aliasPatientList}`);
    cy.wait(`@${aliasVisitList}`);
    cy.waitForReact();
  });

  beforeEach(() => {
    cy.waitForReact();
    cy.restoreLocalStorageCache();
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  it('Check Add Visit Component', () => {
    cy.openSideBarShowVisit();
    cy.renderAdHocModal();
    cy.get('#btn-cancel-add-visit').click();
  });

  it('Add visit modal', () => {
    cy.renderAdHocModal();
  });

  it('Fill Add Visit Form', () => {
    cy.fillInAddAdHocForm();
  });

  it('Submit Add Visit Form', () => {
    cy.submitAddAdHocForm();
  });

  it('Cancel add Visit', () => {
    cy.renderAdHocModal();
    cy.fillInAddAdHocForm();
    cy.get('#btn-cancel-add-visit').click({ force: true });
    cy.react('Modal', {
      props: {
        id: 'modal-add-visit',
        visible: false,
      },
    });
  });
});
