import { GetVisitListDocument  } from '../../src/graphQL/generated/graphql';
import 'cypress-localstorage-commands';

describe('Add Visit in visit list', () => {
  before(() => {
    cy.clearLocalStorageSnapshot();
    cy.visit('/login');
    cy.fillInloginAsFormV2({
      email: 'admin@example.com',
      password: 'Password123'
    });
    cy.saveLocalStorage();
  });

  beforeEach(() => {
    // cy.restoreLocalStorage();
    cy.waitForReact();
  });

  it('Success add visit single site', () => {
    let visitLists = [];
    const alias = GetVisitListDocument.definitions[0].name.value;
    cy.intercept('POST', '/graphql', req => {
      if (req.body.operationName === alias) {
        req.alias = req.body.operationName;
      }
    });

    cy.visit('/visit/testRevisionId1/bellevueHospital1/bellevuePatient1');
    cy.wait(`@${alias}`).then(result => {
      if (result.response.statusCode === 200) {
        visitLists = result.response.body.data.visitList;
      }
    });
    cy.get('.sidebar-toggle-arrow > path').click({ force: true })
      .then(() => {
        cy.get('#sidebar-visits-container').find('div#sider-visit-list')
          .should('have.length', visitLists.length);
      });
    cy.get('#patientId').should('exist');
    cy.wait(3000);
    cy.get('#add-visit-modal-button').click({ force: true });
    cy.get('[name="visitDate-input"]').clear();
    cy.wait(2000);
    cy.get('[name="visitDate-input"]').type('Mar 20, 2021');
    cy.get('#add-visit-select').click({ force: true });
    cy.get('.ant-select-item-option-content').click({ force: true });
    cy.get('[data-cy=multi-site').should('not.exist');
    cy.get('#btn-submit-add-visit').click({ force: true })
      .then(() => {
        Cypress.on('uncaught:exception', (err, runnable) => {
          return false;
        });
        cy.wait(2000);
        let newVisitLists = [];
        cy.intercept('POST', '/graphql', req => {
          if (req.body.operationName === alias) {
            req.alias = req.body.operationName;
          }
        });
        cy.wait(`@${alias}`).then(result => {
          if (result.response.statusCode === 200) {
            newVisitLists = result.response.body.data.visitList;
            if (newVisitLists.some(visit => visit.status === 'INCOMPLETE' && visit.visitName === 'Adhoc Visit' && (newVisitLists.length > visitLists.length)
            )) {
              cy.get('#sidebar-visits-container').find('div#sider-visit-list')
                .should('have.length', newVisitLists.length);
            }
          }
        });
      });
  });

  it('Success add visit multiple site', () => {
    let visitLists = [];
    const alias = GetVisitListDocument.definitions[0].name.value;
    cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1');
    cy.intercept('POST', '/graphql', req => {
      if (req.body.operationName === alias) {
        req.alias = req.body.operationName;
      }
    });
    cy.wait(2000);
    cy.wait(`@${alias}`).then(result => {
      if (result.response.statusCode === 200) {
        visitLists = result.response.body.data.visitList;
      }
    });
    cy.get('.sidebar-toggle-arrow > path').click({ force: true })
      .then(() => {
        cy.get('#sidebar-visits-container').find('div#sider-visit-list')
          .should('have.length', visitLists.length);
      });
    cy.get('#patientId').should('exist');
    cy.get('#add-visit-modal-button').click();
    cy.get('[name="visitDate-input"]').clear();
    cy.get('[name="visitDate-input"]').type('Mar 21, 2021');
    cy.get('#add-visit-select').click({ force: true });
    cy.get('.ant-select-item-option-content').click();
    cy.get('[data-cy=multi-site]').should('exist');
    cy.get('#add-visit-select-site').click({ force: true })
      .type('{downarrow}{downarrow}{enter}', { force: true });
    cy.get('#btn-submit-add-visit').click()
      .then(() => {
        Cypress.on('uncaught:exception', (err, runnable) => {
          return false;
        });
        cy.wait(2000);
        let newVisitLists = [];
        cy.intercept('POST', '/graphql', req => {
          if (req.body.operationName === alias) {
            req.alias = req.body.operationName;
          }
        });
        cy.wait(`@${alias}`).then(result => {
          if (result.response.statusCode === 200) {
            newVisitLists = result.response.body.data.visitList;
            if (newVisitLists.some(visit => visit.status === 'INCOMPLETE' && visit.visitName === 'Adhoc Visit' && (newVisitLists.length > visitLists.length)
            )) {
              cy.get('#sidebar-visits-container').find('div#sider-visit-list')
                .should('have.length', newVisitLists.length);
            }
          }
        });
      });
  });
});