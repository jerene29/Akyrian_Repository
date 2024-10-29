import {
  PatientVisitDetailsDocument,
  GetVisitListDocument,
  GetPatientListDocument,
  LockPatientDocument,
  RejectInvestigatorDocument,
  GetVisitDetailsDocument,
} from '../../../src/graphQL/generated/graphql';
import 'cypress-localstorage-commands';
import { mockUserDataInvestigator } from '../../../src/constant/testFixtures';
import { d } from '../../helper';
describe('Redact By Investigator', () => {
  const redactionArea = [
    {
      x: 200,
      y: 50,
      x2: 250,
      y2: 100,
    },
    {
      x: 220,
      y: 130,
      x2: 270,
      y2: 180,
    },
    {
      x: 200,
      y: 200,
      x2: 250,
      y2: 250,
    },
    {
      x: 180,
      y: 270,
      x2: 230,
      y2: 320,
    },
  ];

  const getPatient: any = GetPatientListDocument;
  const getVisit: any = GetVisitListDocument;
  const getPatientVisitDetail: any = PatientVisitDetailsDocument;
  const postPatientLock: any = LockPatientDocument;
  const rejectInvestigator: any = RejectInvestigatorDocument;
  const getVisitDetail: any = GetVisitDetailsDocument;

  const aliasing = {
    getPatient: getPatient.definitions[0].name.value,
    getVisit: getVisit.definitions[0].name.value,
    getPatientVisitDetail: getPatientVisitDetail.definitions[0].name.value,
    postPatientLock: postPatientLock.definitions[0].name.value,
    rejectInvestigator: rejectInvestigator.definitions[0].name.value,
    getVisitDetail: getVisitDetail.definitions[0].name.value,
  };

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
    cy.fillInloginAsFormV2(
      mockUserDataInvestigator,
      mockUserDataInvestigator.studyId,
      mockUserDataInvestigator.studyRevisionId,
    );
    interception([aliasing.getPatient, aliasing.getVisit, aliasing.getVisitDetail]);
    cy.visit('/visit/testRevisionId1');
    cy.wait(`@${aliasing.getPatient}`);
    cy.wait(`@${aliasing.getVisit}`);
    cy.waitForReact();
  });

  describe('Check sc and no sc', () => {
    it('Check no SC question', () => {
      interception([aliasing.postPatientLock, aliasing.getVisit]);
      cy.get('#multiSitePatient1-selectable-patient').click();
      cy.wait(`@${aliasing.postPatientLock}`);
      cy.wait(`@${aliasing.getVisit}`);
      cy.get(d`visit-screeningVisit1`).click({ force: true });
      cy.get(d`"Subject consent"`).realHover();
      cy.get(d`redact-action-consentQuestion1`).should('not.exist');
    });

    it('Check SC question', () => {
      cy.wait(3000);
      cy.get(d`visit-visit1Visit1`).click();
      cy.get(d`Receptor`).realHover();
      cy.get(d`redact-action-receptor1`)
        .should('exist')
        .click();
    });
  });

  describe('On Redact', () => {
    it('Redact image should enable submit button', () => {
      cy.wrap(redactionArea).then(() => {
        cy.drawSingleRect(redactionArea[0]);
        cy.get(d`canvas-content`).matchImageSnapshot({
          failureThreshold: 100,
          failureThresholdType: 'percent',
        });
        cy.checkSubmitButtonActive('done-snippet-button');
        cy.get(d`done-snippet-button`).click();
      });
    });
  });
});
