import {
  AddReasonToNoAnswerDocument,
  IFieldGroupVisitDetail,
} from '../../src/graphQL/generated/graphql';
import 'cypress-localstorage-commands';
import i18next from 'i18next';
describe('Reason Required', () => {
  let visitDetailsSource: IFieldGroupVisitDetail[];
  const aliasVisitDetails = 'GetVisitDetails';
  const aliasAddReason = AddReasonToNoAnswerDocument.definitions[0].name.value;

  before(() => {
    cy.clearLocalStorageSnapshot();
    cy.reseedDB();
    cy.fillInloginAsFormV2({
      email: 'admin@example.com',
    });
    cy.waitForReact();
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasVisitDetails) {
        req.alias = req.body.operationName;
      }
    });
    cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit1Visit1');
    cy.wait(1000);
    cy.get('[data-cy=sourceQuestionTab]').click();
    cy.wait(`@${aliasVisitDetails}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        visitDetailsSource = result.response.body.data.visitDetails.withSourceForm.fieldGroups;
      }
    });
  });

  beforeEach(() => {
    cy.restoreLocalStorageCache();
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  it('Select Reason Requried status and open add reason modal', () => {
    cy.get('[data-cy=NEED_REASON_NOT_AVAILABLE]').click();
    cy.get('[data-cy=question-sanity1]').realHover();
    cy.get('[data-cy=addReason-action]').should('be.visible').realHover().first().click();
    cy.get('[data-cy=submit-add-reason]').first().should('be.disabled');
  });

  it('Should not show data entry if the current user dont perform data entry', () => {
    const userId = localStorage.getItem('userId');
    const questionId = 'sanity1';
    const question = visitDetailsSource.filter((data) => data.id === questionId)[0];
    if (
      question.formFieldGroupResponse?.dataEntryBy === userId ||
      question.formFieldGroupResponse?.dataEntry2By === userId
    ) {
      cy.get('[data-entry=question-answers]').should('not.exist');
    }
  });

  it('Select reason and submit button should enabled', () => {
    cy.get('[data-cy=mark-no-answer-reason] > .ant-select > .ant-select-selector')
      .should('be.visible')
      .click()
      .type('{downarrow}{enter}');
    cy.get('[data-cy=submit-add-reason]').first().should('be.enabled');
  });

  it('Select other reason but not type anything, submit button should enabled', () => {
    cy.get('[data-cy=mark-no-answer-reason] > .ant-select > .ant-select-selector')
      .click()
      .type('{downarrow}{downarrow}{downarrow}{enter}');
    cy.get('[data-cy=submit-add-reason]').first().should('be.disabled');
  });

  it('Select other reason and type more than 5 char, submit button should enabled', () => {
    cy.get('[data-cy=mark-no-answer-reason] > .ant-select > .ant-select-selector')
      .click()
      .type('Plase input answer');
    cy.get('[data-cy=submit-add-reason]').first().should('be.enabled');
  });

  it('Submit add reason and show toast', () => {
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasAddReason) {
        req.alias = req.body.operationName;
      }
    });

    cy.get('[data-cy=submit-add-reason]').first().click();

    cy.wait(`@${aliasAddReason}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        cy.get('[data-cy=alert-success]').should('have.text', '"Reason provided"');
      }
    });
  });
});
