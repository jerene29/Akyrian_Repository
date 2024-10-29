import { data } from 'cypress/types/jquery';
import {
  GetStudyRevisionListDocument,
  CloneVisitDocument,
  GetVisitTemplateListDocument,
  StudyCollectionDocument,
  EditStudyRevisionDetailDocument,
} from '../../../src/graphQL/generated/graphql';
import 'cypress-localstorage-commands';

describe('Test clone visit', () => {
  const aliasStudyRevisionList = GetStudyRevisionListDocument.definitions[0].name.value;
  const aliasStudyCollection = StudyCollectionDocument.definitions[0].name.value;
  const aliasRename = EditStudyRevisionDetailDocument.definitions[0].name.value;
  const aliasVisitList = GetStudyRevisionListDocument.definitions[0].name.value;
  const aliasCloneVisit = CloneVisitDocument.definitions[0].name.value;
  let newVisit: any;

  before(() => {
    // cy.reseedDB();
    cy.clearLocalStorageSnapshot();
    cy.fillInloginAsForm({
      email: 'admin@example.com',
    });

    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasStudyRevisionList) {
        req.alias = req.body.operationName;
      }
      if (req.body.operationName === aliasStudyCollection) {
        req.alias = req.body.operationName;
      }
    });
    cy.visit('/study');
    cy.wait(`@${aliasStudyCollection}`);
    cy.wait(`@${aliasStudyRevisionList}`);
    cy.waitForReact();
  });

  beforeEach(() => {
    cy.wait(500);
    cy.waitForReact();
    cy.restoreLocalStorageCache();
    cy.wait(500);
  });

  afterEach(() => {
    cy.wait(500);
    cy.saveLocalStorageCache();
    cy.wait(500);
  });

  describe('Clone visit 1', () => {
    it('Edit visit study v.2.e', () => {
      // cy.intercept('POST', '/graphql', req => {
      //     if (req.body.operationName === aliasVisitList) {
      //         req.alias = req.body.operationName;
      //     }
      // });
      cy.visit('/study/study1revisionDev2e');
      cy.wait(3000);
      // cy.wait(`@${ aliasVisitList }`);
    });
    it('Select visit 1', () => {
      cy.get('[data-cy=visit-template-templateVisit1Rev2eDev]').click();
      cy.get('.sidebar-toggle-arrow').click();
    });
    it('Click clone visit after hovering on visit 1', () => {
      cy.get('[data-cy=visit-template-templateVisit1Rev2eDev]')
        .realHover()
        .then(() => {
          cy.get('[data-cy=visit-template-templateVisit1Rev2eDev-clone]').click();
          cy.wait(1000);
        });
    });
    it('Check modal content and clone', () => {
      cy.get('.ant-modal-body [data-cy=clone-visit] [data-cy=confirmation-modal-title]').should(
        'have.text',
        'Are you sure you want to clone this visit?',
      );
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasCloneVisit) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=confirmModal-confirmButton]').click();
      cy.wait(`@${aliasCloneVisit}`).then((result) => {
        if (result?.response?.statusCode === 200) {
          newVisit = result.response.body.data.copyVisitTemplate.find(
            (visit) => visit.name === 'Visit - Copy',
          );
          cy.get(`[data-cy=visit-template-${newVisit.id}]`).click();
          cy.get('.sidebar-toggle-arrow').click();
        }
      });
    });
  });
});
