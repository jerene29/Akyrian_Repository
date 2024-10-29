import 'cypress-localstorage-commands';
import {
  GetPatientListDocument,
  GetVisitListDocument,
  GetVisitDetailsDocument,
  IPatient,
  IVisitWithIndicator,
  IFieldGroupVisitDetail,
  ISitePatient,
  IWithSourceForm,
} from '../../src/graphQL/generated/graphql';
import Colors from '../../src/constant/Colors';
describe('Redact Source Capture', () => {
  let selectedPatient: IPatient[] = [];
  let selectedVisit: IVisitWithIndicator[] = [];
  let visitDetails: IWithSourceForm = {} as IWithSourceForm;

  let unattachedFGs: IFieldGroupVisitDetail[] = [];
  let attachedFGs: IFieldGroupVisitDetail[] = [];

  const aliasGetPatient = GetPatientListDocument.definitions[0].name.value;
  const aliasGetVisit = GetVisitListDocument.definitions[0].name.value;
  const aliasGetVisitDetailSC = GetVisitDetailsDocument.definitions[0].name.value;

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

  before(() => {
    cy.reseedDB();
    cy.clearLocalStorageSnapshot();
    cy.fillInloginAsFormV2({
      email: 'admin@example.com',
    });
    cy.saveLocalStorage();
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasGetVisitDetailSC) {
        req.alias = req.body.operationName;
      }
      if (req.body.operationName === aliasGetPatient) {
        req.alias = req.body.operationName;
      }
      if (req.body.operationName === aliasGetVisit) {
        req.alias = req.body.operationName;
      }
    });
    cy.waitForReact();
    cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit1Visit1');
    cy.wait(`@${aliasGetPatient}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        const selectedSite = result.response.body.data.sitePatientList.filter(
          (sitePatient: ISitePatient) => sitePatient.id === 'bellevueHospital1',
        );
        selectedPatient = selectedSite[0].patients.filter(
          (patient: IPatient) => patient.id === 'multiSitePatient1',
        );
      }
    });
    cy.wait(`@${aliasGetVisit}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        selectedVisit = result.response.body.data.visitList.filter(
          (visit: IVisitWithIndicator) => visit.id === 'visit1Visit1',
        );
      }
    });
    cy.wait(`@${aliasGetVisitDetailSC}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        visitDetails = result.response.body.data.visitDetails.withSourceForm;
        unattachedFGs = visitDetails.fieldGroups
          ?.filter(
            (FG: IFieldGroupVisitDetail) => FG.formFieldGroupResponse?.status === 'UNATTACHED',
          )
          .sort((a, b) => {
            if (a.id > b.id) {
              return 1;
            }
            if (a.id < b.id) {
              return -1;
            }
            return 0;
          });
        attachedFGs = visitDetails.fieldGroups?.filter(
          (FG: IFieldGroupVisitDetail) => FG.formFieldGroupResponse?.status === 'ATTACHED',
        );
        cy.get('[data-cy=sourceQuestionTab').click();
      }
    });
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  it('Go to Attach and click redact on quickAction, and open snippet with default submit button disabled, without right menu, and snippet tool not exist', () => {
    cy.get('[data-cy=ATTACHED]').click({ force: true });
    cy.get(`[data-cy=question-card-${attachedFGs[0].id}]`).should('exist');
    cy.get(`[data-cy=question-card-${attachedFGs[0].id}]`).realHover();
    cy.clickQuickAction(
      `[data-cy=question-card-${attachedFGs[0].id}]`,
      `[data-cy=redact-action-${attachedFGs[0].id}]`,
      undefined,
      undefined,
      'SVG',
    );
    cy.wait(3000);
    if (cy.get('.ant-tooltip')) {
      cy.get('.ant-tooltip').invoke('attr', 'style', 'display: none');
    }
    cy.get('[data-cy=right-chips-menu]').should('not.exist');
    cy.get('[data-cy=done-snippet-button]').should(
      'have.css',
      'background-color',
      Colors.secondary.pebbleGrey10,
    );
    cy.get('[data-cy=Snippet]').should('not.exist');
  });

  it.skip('Redact image should enable submit button', () => {
    cy.drawSingleRect(redactionArea[0]);
    cy.get('[data-cy=canvas-content]').matchImageSnapshot({
      failureThreshold: 100,
      failureThresholdType: 'percent',
    });
    cy.checkSubmitButtonActive('done-snippet-button');
  });
});
