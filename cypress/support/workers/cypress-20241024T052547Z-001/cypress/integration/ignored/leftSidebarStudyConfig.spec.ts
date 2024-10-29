import { data } from 'cypress/types/jquery';
import { GetVisitTemplateListDocument } from '../../../src/graphQL/generated/graphql';
import 'cypress-localstorage-commands';

describe('Left sidebar study config test', () => {
  before(() => {
    cy.clearLocalStorageSnapshot();
    cy.visit('/login');
    cy.fillInloginAsFormV2({
      email: 'admin@example.com',
    });
    cy.saveLocalStorage();
  });

  beforeEach(() => {
    cy.waitForReact();
  });

  let visitTemplateList = [];
  it('Rendered all visit list in study config', () => {
    const alias = GetVisitTemplateListDocument.definitions[0].name.value;
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === alias) {
        req.alias = req.body.operationName;
      }
    });
    cy.visit('/study/testRevisionId1');
    cy.wait(`@${alias}`).then((result) => {
      if (result.response.statusCode === 200) {
        visitTemplateList = result.response.body.data.visitTemplateList;
        cy.wrap(visitTemplateList).each((visit) => {
          cy.get(`#${visit.id}`).should('exist');
          cy.get(`#${visit.id}`).contains(`${visit.name}`);
        });
      }
    });
  });

  it('Rendered all form by each visit list', () => {
    cy.wrap(visitTemplateList).each((visit) => {
      const visitForms = visit.forms;
      cy.get(`#${visit.id}`).should('exist');
      cy.get(`#${visit.id}`).click({ force: true });
      cy.get('.sidebar-toggle-arrow').click({ force: true });
      cy.wrap(visitForms).each((form) => {
        cy.get('.sidebar-toggle-arrow').click({ force: true });
        cy.get(`#${form.id}`).should('exist');
        cy.get(`#${form.id}`).contains(`${form.name}`);
        cy.get('.sidebar-toggle-arrow').click({ force: true });
      });
    });
  });
});
