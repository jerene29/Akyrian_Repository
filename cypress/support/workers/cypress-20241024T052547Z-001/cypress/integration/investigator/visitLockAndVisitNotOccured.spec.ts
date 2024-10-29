import {
  PatientVisitDetailsDocument,
  GetVisitListDocument,
  IPatientVisitDetails,
  IVisitWithIndicator,
  GetPatientListDocument,
  LoginDocument
} from '../../../src/graphQL/generated/graphql';
import 'cypress-localstorage-commands';
import {mockUserDataInvestigator} from "../../../src/constant/testFixtures"

import Colors from '../../../src/constant/Colors';
import client from '../../utils/client';

describe('Visit Lock', () => {

  const getPatient: any = GetPatientListDocument;
  const getVisit: any = GetVisitListDocument;
  const getPatientVisitDetail: any = PatientVisitDetailsDocument;

  let investigatorData: IPatientVisitDetails[];
  let visitList: IVisitWithIndicator[] = [];
  let firstSite: any = [];
  const aliasing = {
    getPatient: getPatient.definitions[0].name.value,
    getVisit: getVisit.definitions[0].name.value,
    getPatientVisitDetail: getPatientVisitDetail.definitions[0].name.value,
  };

  before(() => {
    cy.reseedDB();
    cy.fillInloginAsFormV2(mockUserDataInvestigator, mockUserDataInvestigator.studyId, mockUserDataInvestigator.studyRevisionId);
    cy.intercept('POST', '/graphql', req => {
      if (req.body.operationName === aliasing.getPatient) {
        req.alias = req.body.operationName;
      }
      if (req.body.operationName === aliasing.getVisit) {
        req.alias = req.body.operationName;
      }
    });
    cy.visit('/visit/testRevisionId2');
    cy.wait(`@${ aliasing.getPatient }`);
    cy.wait(`@${ aliasing.getVisit }`);
    cy.waitForReact();
  });

  beforeEach(() => {
    cy.restoreLocalStorageCache();
    cy.wait(1000);
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
    cy.wait(1000);
  });

  describe(('Change study'), () => {

    beforeEach(() => {
      cy.restoreLocalStorageCache();
      cy.wait(3000);
    });

    afterEach(() => {
      cy.saveLocalStorageCache();
      cy.wait(3000);
    });

    it('select study', () => {
      cy.get('[data-cy=header-nurse-select]').click();
      cy.intercept('POST', '/graphql', req => {
        if (req.body.operationName === aliasing.getPatient) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=studyTestId1-testRevisionId1]').click();
      cy.wait(`@${ aliasing.getPatient }`).then(result => {
        cy.wrap(result).then(() => {
          if (result.response?.statusCode === 200) {
            firstSite = result.response.body.data.sitePatientList[0];
          }
        });
      });
    });

    it(('Check count & select patient'), () => {
      cy.intercept('POST', '/graphql', req => {
        if (req.body.operationName === aliasing.getVisit) {
          req.alias = req.body.operationName;
        }
        if (req.body.operationName === aliasing.getPatientVisitDetail) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('#multiSitePatient2-selectable-patient').click();
      cy.wait(`@${ aliasing.getVisit }`).then((response) => {
        cy.wrap(response).then(() => {
          visitList = response.response?.body.data.visitList;
        });
      });
      cy.wait(`@${ aliasing.getPatientVisitDetail }`, { timeout: 100000 }).then((response) => {
        cy.wrap(response).then(() => {
          investigatorData = response.response?.body?.data?.patientVisitDetails;
        });
      });
      cy.wait(2000);
    });

    it(('Select visit'), () => {
      cy.get('[data-cy=confirmModal-confirmButton]').click();
    });

    it('Hover question card not showing quick actions but show read indicator tooltip and cannot open expand image if got clicked', () => {
      cy.get('[data-cy="Subject consent"]').invoke('show').trigger('mouseover');
      cy.get('[data-cy=tooltip-indicator]').should('exist');
      cy.get('[data-cy=read-indicator').eq(0).should('have.css', 'background-color', 'rgb(14, 210, 203)');
      cy.get('[data-cy="Subject consent"]').click();
      cy.get('[data-cy=modal-expand-investigator]').should('not.exist');
    });

    it('Visit list indicator for locked visit should be green', () => {
      cy.get('[data-cy=INVESTIGATOR-LOCKED]').should('have.css', 'background-color', 'rgb(14, 210, 203)');
      cy.get('[data-cy=all-visit]').click();
    });

    it('Open all visit, scroll to not occured visit, it should not show any questions but show not occured reason', () => {
      cy.get('[data-cy=step-indicator-list]').eq(2).click({ force: true });
      cy.get('.ant-empty-description').first().should('exist').should('have.text', `This visit did not occur for the following reason: ${ visitList[2].visitDidNotOccurReason?.title }`);
    });

    it('Open not occured visit and show sign visit component', () => {
      cy.wrap(visitList).then(() => {
        cy.get(`[data-cy=visit-${ visitList[2].id }]`).click();
        cy.get('#status-not-occured').should('have.text', visitList[2].visitDidNotOccurReason?.title);
        cy.get('[data-cy=visit-name]').should('have.text', visitList[2].visitName);
        cy.get('[data-cy=sign-visit]').should('exist');
      });
    });

  });

});
