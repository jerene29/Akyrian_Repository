import { OperationDefinitionNode } from 'graphql';
import {
  OmniSearchQueryDocument,
  IFormFieldGroupResponse,
} from '../../src/graphQL/generated/graphql';

const TIMEOUT = 5000;

describe.skip('Omni Search', () => {
  const [definition] = OmniSearchQueryDocument.definitions;
  const aliasOmniSearch = (definition as OperationDefinitionNode).name?.value;
  const aliasVisitDetails = 'GetVisitDetails';

  before(() => {
    cy.clearLocalStorageSnapshot();
    cy.reseedDB();
    cy.fillInloginAsFormV2({
      email: 'admin@example.com',
    });
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasVisitDetails) {
        req.alias = req.body.operationName;
      }
    });
    cy.visit('/visit/testRevisionId1/toDaiHospital1/toDaiPatient1/visit1Visit2');
    cy.wait(`@${aliasVisitDetails}`);
    cy.waitForReact();
  });

  beforeEach(() => {
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasOmniSearch) {
        req.alias = req.body.operationName;
      }
    });
  });

  it('Open omnisearch component and show content', () => {
    cy.get('[data-cy=header-search-icon]').should('be.visible').click();
    cy.waitForReact();
    cy.get('[data-cy=omni-search]').should('exist');
    cy.get('[data-cy=clear-omni-search]').should('be.visible');
    cy.get('[data-cy=omni-search-input]').should('be.visible');
    cy.get('[data-cy=omni-search-filter]').should('be.visible');
    cy.wait(`@${aliasOmniSearch}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        result.response.body.data.omniSearchQuery.availableFilters.forEach((filter: any) => {
          cy.get(`[data-cy=${filter.label.split(' ').join('')}]`).should('be.visible');
        });
      }
    });
  });

  it('Start search by click filter, it should show list filter view dan results', () => {
    cy.get('[data-cy=SourceCapture]').click();
    cy.get('[data-cy=button-view-on-search-input]').should('exist');
    cy.wait(`@${aliasOmniSearch}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        cy.get('[data-cy=omni-search-results').should('exist');
        cy.get('[data-cy=list-filter-view').should('exist');
        result.response.body.data.omniSearchQuery.availableFilters.forEach((filter: any) => {
          cy.get(`[data-cy=${filter.label.split(' ').join('')}]`).should('be.visible');
        });
        cy.get(`[data-cy=omni-search-results] > :nth-child(5)`);
      }
    });
  });

  it('Click load more', () => {
    cy.get('[data-cy=omni-search-load-more]').should('exist').click();
    cy.wait(`@${aliasOmniSearch}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        cy.get(`[data-cy=omni-search-results] > :nth-child(10)`);
      }
    });
  });

  it('Narrow the search even more by clicking list filter button', () => {
    cy.get('[data-cy=SourceCaptureIncomplete]').click();
    cy.wait(`@${aliasOmniSearch}`).then(() => {
      cy.get('[data-cy=list-filter-view').should('not.exist');
      cy.get('[data-cy=omni-search-results').should('exist');
    });
  });

  it('Get omni search by tap enter on keyboard after tying on input', () => {
    cy.get('[data-cy=omni-search-input]').type('br{enter}');
    cy.get('[data-cy=shimmer-result]').should('exist');
    cy.wait(`@${aliasOmniSearch}`).then(() => {
      cy.get('[data-cy=shimmer-result]').should('not.exist');
      cy.get('[data-cy=omni-search-results').should('exist');
    });
  });

  it('Get omni search after end type on input for 2 seconds', () => {
    cy.get('[data-cy=omni-search-input]').clear().type('br');
    cy.get('[data-cy=shimmer-result]', { timeout: TIMEOUT }).should('exist');
    cy.wait(`@${aliasOmniSearch}`).then(() => {
      cy.get('[data-cy=shimmer-result]').should('not.exist');
      cy.get('[data-cy=omni-search-results').should('exist');
    });
  });

  it('Clear search', () => {
    cy.get('[data-cy=omni-search-input]').type('br');
    cy.wait(`@${aliasOmniSearch}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        cy.get('[data-cy=clear-omni-search]').should('exist').click();
        cy.get('[data-cy=omni-search-input]').should('not.have.value');
        cy.get('[data-cy=omni-search-filter]').should('exist');
        cy.get('[data-cy=omni-search-results]').should('not.exist');
      }
    });
    cy.get('.ant-modal-wrap').click();
  });

  it('Search Source Capture Question', () => {
    cy.get('[data-cy=header-search-icon]').should('be.visible').click();
    cy.wait(`@${aliasOmniSearch}`);
    cy.get('[data-cy=SourceCapture]').click();
    cy.wait(`@${aliasOmniSearch}`);
    cy.get('[data-cy=omni-search-input]').type('temporal');
    cy.wait(`@${aliasOmniSearch}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        const {
          visit: { site, patient, id: visitId },
        }: IFormFieldGroupResponse = result.response.body.data.omniSearchQuery.results[1].ffgr;
        cy.get('[data-cy=omni-search-results] > :nth-child(2)').click();
        cy.url().should('include', `visit/testRevisionId1/${site?.id}/${patient.id}/${visitId}`);
        cy.get('[data-cy=question-card-temporalLobe1]', { timeout: TIMEOUT })
          .should('exist')
          .should('be.visible');
      }
    });
  });

  it('Search No Source Capture Question', () => {
    cy.get('[data-cy=header-search-icon]').should('be.visible').click();
    cy.wait(`@${aliasOmniSearch}`);
    cy.get('[data-cy=omni-search-input]').type('allergies');
    cy.wait(`@${aliasOmniSearch}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        const {
          visit: { site, patient, id: visitId },
        }: IFormFieldGroupResponse = result.response.body.data.omniSearchQuery.results[1].ffgr;
        cy.get('[data-cy=omni-search-results] > :nth-child(2)').click();
        cy.url().should('include', `visit/testRevisionId1/${site?.id}/${patient.id}/${visitId}`);
        cy.get('[data-cy=question-card-timeMultiEntryId1]', { timeout: TIMEOUT })
          .should('exist')
          .should('be.visible');
      }
    });
    /* ==== Generated with Cypress Studio ==== */
    cy.get('#filtered-questions').click();
    /* ==== End Cypress Studio ==== */
  });

  it('Search Visit', () => {
    cy.get('[data-cy=header-search-icon]').should('be.visible').click();
    cy.wait(`@${aliasOmniSearch}`);
    cy.get('[data-cy=Visit]').click();
    cy.wait(`@${aliasOmniSearch}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        cy.get('[data-cy=omni-search-results] > :nth-child(1)').click();
        cy.url().should(
          'include',
          'visit/testRevisionId1/bellevueHospital1/multiSitePatient1/screeningVisit1',
        );
        cy.get('[data-cy=visit-screeningVisit1]', { timeout: TIMEOUT })
          .should('exist')
          .should('be.visible');
      }
    });
  });

  it('Search Patient', () => {
    cy.get('[data-cy=header-search-icon]').should('be.visible').click();
    cy.wait(`@${aliasOmniSearch}`);
    cy.get('[data-cy=Patient]').click();
    cy.wait(`@${aliasOmniSearch}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        const patient = result?.response?.body?.data?.omniSearchQuery?.results[3]?.patient;
        cy.get('[data-cy=omni-search-results] > :nth-child(4)').click();
        cy.url().should(
          'include',
          `visit/testRevisionId1/${patient?.sitesAccess[0]?.id}/${patient?.id}`,
        );
        cy.get(`#${patient?.id}-selectable-patient`).should('be.visible');
      }
    });
  });

  it('Search Site', () => {
    cy.get('[data-cy=header-search-icon]').should('be.visible').click();
    cy.wait(`@${aliasOmniSearch}`);
    cy.get('[data-cy=Site]').click();
    cy.wait(`@${aliasOmniSearch}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        const site = result?.response?.body?.data?.omniSearchQuery?.results[0]?.site;
        cy.get('[data-cy=omni-search-results] > :nth-child(1)').click();
        cy.url().should('include', `visit/testRevisionId1/${site?.id}`);
        cy.get('#toDaiPatient2-selectable-patient').should('be.visible');
      }
    });
  });

  it('Return empty search when there is no results', () => {
    cy.get('[data-cy=header-search-icon]').should('be.visible').click();
    cy.get('[data-cy=omni-search-input]').type('qweasd{enter}');
    cy.wait(`@${aliasOmniSearch}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        cy.get('[data-cy=omni-search-filter]').should('not.exist');
        cy.get('[data-cy=omni-search-no-results]').should('exist');
      }
    });
  });
});
