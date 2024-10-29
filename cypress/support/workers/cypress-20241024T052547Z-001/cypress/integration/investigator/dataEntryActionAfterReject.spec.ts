import {
  PatientVisitDetailsDocument,
  GetVisitListDocument,
  GetPatientListDocument,
  LockPatientDocument,
  RejectInvestigatorDocument,
  GetVisitDetailsDocument,
} from '../../../src/graphQL/generated/graphql';
import 'cypress-localstorage-commands';

const mockUserData = {
  email: 'signcrf@example.com',

  studyId: 'studyTestId1',
  studyRevisionId: 'testRevisionId1',
};

describe('Rejected By Investigator', () => {
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

  const findRejectQuestion = async () => {
    interception([aliasing.postPatientLock, aliasing.getVisit, aliasing.getVisitDetail]);
    cy.get('#multiSitePatient1-selectable-patient').click();
    cy.wait(`@${aliasing.postPatientLock}`);
    cy.wait(`@${aliasing.getVisit}`);
    cy.wait(`@${aliasing.getVisitDetail}`);
    cy.get('[data-cy=visit-visit1Visit1]').click();
    cy.get('[data-cy=sourceQuestionTab]').click();
    cy.get('[data-cy=NOT_AVAILABLE_REJECTED]').click();
    cy.get('[data-cy=question-card-receptor1] > [data-cy=question-card]').should('be.visible');
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
    cy.fillInloginAsFormV2(mockUserData, mockUserData.studyId, mockUserData.studyRevisionId);
    interception([aliasing.getPatient, aliasing.getVisit, aliasing.getVisitDetail]);
    cy.visit('/visit/testRevisionId1');
    cy.wait(`@${aliasing.getPatient}`);
    cy.wait(`@${aliasing.getVisit}`);
    cy.waitForReact();
  });

  describe('On Reject', () => {
    it('Reject Question', () => {
      interception([aliasing.postPatientLock, aliasing.getVisit]);
      cy.get('#multiSitePatient1-selectable-patient').click();
      cy.wait(`@${aliasing.postPatientLock}`);
      cy.wait(`@${aliasing.getVisit}`);
      cy.get('[data-cy=visit-visit1Visit1]').click();
      cy.get('[data-cy=ACCEPTED]').click();
      cy.get('[data-cy=card-investigator]').eq(0).click();
      cy.get('.question-card-action-menu').should('be.visible');
      cy.get('[data-cy=modal-expand-investigator]').should('exist');
      cy.get(
        `[data-index="0"] [tabindex="-1"] > [data-cy=card-investigator] [data-cy=editing-tools] > [data-cy=reject-answer-action]`,
      )
        .should('be.visible')
        .click();
      cy.get('[data-cy=reject-question-modal]').should('be.visible');
      cy.get('[data-cy=reject-reason] > .ant-select > .ant-select-selector')
        .click()
        .type('{downarrow}{enter}');
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasing.rejectInvestigator) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=submit-reject-reason]').click();
      cy.wait(`@${aliasing.rejectInvestigator}`).then(() => {
        cy.get('.alert-success').should('exist');
        cy.get('.text-back').click();
      });
      cy.logout();
    });
  });

  describe('Login another data entry', () => {
    const mockUserDataEntry = {
      email: 'joy@example.com',
    };

    before(() => {
      cy.fillInloginAsFormV2(mockUserDataEntry, mockUserData.studyId, mockUserData.studyRevisionId);
      interception([aliasing.getPatient, aliasing.getVisit]);
      cy.visit('/visit/testRevisionId1');
      cy.wait(`@${aliasing.getPatient}`);
      cy.wait(`@${aliasing.getVisit}`);
      cy.waitForReact();
    });

    it('Find Reject Question', () => {
      cy.wrap(findRejectQuestion).then(() => {
        findRejectQuestion();
      });
      cy.logout();
    });
  });

  describe('Login another data entry', () => {
    const mockUserDataEntry = {
      email: 'admin@example.com',
    };

    before(() => {
      cy.fillInloginAsFormV2(mockUserDataEntry, mockUserData.studyId, mockUserData.studyRevisionId);
      interception([aliasing.getPatient, aliasing.getVisit]);
      cy.visit('/visit/testRevisionId1');
      cy.wait(`@${aliasing.getPatient}`);
      cy.wait(`@${aliasing.getVisit}`);
      cy.waitForReact();
    });

    it('Find Reject Question', () => {
      cy.wrap(findRejectQuestion).then(() => {
        findRejectQuestion();
      });
    });
  });
});
