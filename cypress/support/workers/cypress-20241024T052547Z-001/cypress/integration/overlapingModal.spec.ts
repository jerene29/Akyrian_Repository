import {
  IFieldGroupVisitDetailFragment,
  IFormFieldGroupResponseStatus,
} from '../../src/graphQL/generated/graphql';
import 'cypress-localstorage-commands';

describe.skip('Overlaping Modal', () => {
  let visitDetailsSource: IFieldGroupVisitDetailFragment[];
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
    cy.waitForReact();
    cy.visit('/visit/testRevisionId1/toDaiHospital1/toDaiPatient1/visit1Visit2');
    cy.wait(`@${aliasVisitDetails}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        visitDetailsSource = result.response.body.data.visitDetails.withSourceForm.fieldGroups;
      }
    });
    cy.get('[data-cy=sourceQuestionTab]').click();
  });

  beforeEach(() => {
    cy.restoreLocalStorageCache();
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  it('Select Status', () => {
    cy.waitForReact();
    cy.get('[data-cy=MARK_UP_ACCEPTED]').click();
  });

  it('Open monitor flow modal from question card', () => {
    const data = visitDetailsSource?.filter(
      (data) =>
        data.formFieldGroupResponse?.status === IFormFieldGroupResponseStatus.MarkUpAccepted,
    )[0];
    cy.get(`[data-cy=data-entry-action-${data.id}] svg`).click({ force: true });
  });

  it('Open expanded view', () => {
    cy.get('[data-cy=expand-image]').first().click({ force: true });
    cy.get('[data-cy=carousel-image-container]').should('exist');
    cy.get('[data-cy=carousel-container]').should('not.be.visible');
  });

  it('Close expanded view and monitor flow modal should still visible', () => {
    cy.get('[data-cy=carousel-close]').click();
    cy.get('[data-cy=carousel-container]').should('be.visible');
    cy.get('[data-cy=close-data-entry]').first().click({ force: true });
  });

  it('Open expanded image and click detach, it should overlap expanded view modal', () => {
    cy.get('[data-cy=ATTACHED]').click();
    cy.get('[data-cy=image-stack-button]').click();
    cy.get('[data-cy=carousel-image-container]').should('exist');
    cy.get('[data-cy=editing-tools] > [data-cy=reattach-action]').click();
    cy.get('[data-cy=attach-reattach-container]').should('exist').should('be.visible');
    cy.get('[data-cy=carousel-image-container]').should('exist');
    cy.get('[data-cy=cancel-attach-reattach]').click();
    cy.get('[data-cy=cancel-attach-reattach]').should('not.exist');
    cy.get('[data-cy=carousel-image-container]').should('be.visible');
  });
});
