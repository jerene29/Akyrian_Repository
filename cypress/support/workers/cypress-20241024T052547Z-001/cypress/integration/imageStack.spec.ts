import 'cypress-localstorage-commands';

import {
  GetVisitDetailsDocument,
  IWithSourceForm,
  IFfgrStatusEnum,
} from '../../src/graphQL/generated/graphql';

describe('Image Stack', () => {
  let visitDetailsSource: IWithSourceForm;
  const aliasGetVisitDetailSC = GetVisitDetailsDocument.definitions[0].name.value;

  before(() => {
    cy.clearLocalStorageSnapshot();
    cy.reseedDB();
    cy.fillInloginAsFormV2({
      email: 'admin@example.com',
    });
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasGetVisitDetailSC) {
        req.alias = req.body.operationName;
      }
    });
    cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit1Visit1');
    cy.wait(`@${aliasGetVisitDetailSC}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        cy.get('[data-cy=sourceQuestionTab').click();
        visitDetailsSource = result.response.body.data.visitDetails.withSourceForm;
      }
    });
    cy.waitForReact();
  });

  it('Checks image stack, and associated', () => {
    visitDetailsSource.userVisitData.map((visitData) => {
      // NOTE: this is needed because of combining workflow state behave (subSection), we only have data-cy for the first array in that status combination
      let statusToBeClicked: IFfgrStatusEnum = visitData.status[0];
      if (
        statusToBeClicked === IFfgrStatusEnum.MarkUpRejected ||
        statusToBeClicked === IFfgrStatusEnum.Rejected
      ) {
        statusToBeClicked = IFfgrStatusEnum.NotAvailableRejected;
      }
      cy.get(`[data-cy=${statusToBeClicked}]`)
        .click({ force: true })
        .then(() => {
          cy.getFirstFGandSCandSCImgs(visitDetailsSource, visitData).then(
            ({ firstFG, firstSc, sourceCaptImages }) => {
              // CHECK FRONT IMAGE
              if (firstFG !== null) {
                // CHECK IF THE IMAGE IS VISIBLE
                cy.get(`[data-cy=img-front-${firstSc.id}]`).should('exist');
                // CHECK RESIZING
                cy.viewport(500, 256);
                cy.viewport(1440, 1090);

                // CHECK IMAGE HIGHLIGHT ON ATTACHED
                // CANNOT BE TESTED BECAUSE DATA SEED DO NOT HAVE parsedDetectedRegions DATA
                if (visitData.status.includes(IFfgrStatusEnum.Attached)) {
                  if (
                    firstFG.formFieldGroupResponse.parsedDetectedRegions &&
                    firstFG.formFieldGroupResponse.parsedDetectedRegions.length > 0
                  ) {
                    cy.checkHighlight(firstFG);
                  }
                }

                // CHECK ASSOCIATED
                const associates = visitDetailsSource.fieldGroups.filter(
                  (FG) => FG.formFieldGroupResponse?.sourceCaptureId === firstSc.id,
                );
                // hover to firstFG.id to handle subSection / combined state because there are multiple image stack in 1 tab
                cy.get(`[data-cy=question-card-${firstFG.id}]`).realHover().click();
                cy.checkAssociated(associates, firstFG.id);

                // CLICKING ON ASSOCIATE
                const firstAssociate = associates.filter((associatedFG) => {
                  if (associatedFG.id !== firstFG.id) {
                    return true;
                  } else {
                    return false;
                  }
                })[0];
                cy.get(`[data-cy=associated-${firstAssociate?.formFieldGroupResponse?.id}]`).should(
                  'exist',
                );
                cy.get(
                  `[data-cy=associated-${firstAssociate?.formFieldGroupResponse?.id}]`,
                ).click();
                cy.get(`[data-cy=question-card-${firstAssociate.id}`).should('exist');
              }

              // CHECK IMAGES BEHIND
              if (sourceCaptImages.length > 0) {
                sourceCaptImages.map((sc) => {
                  if (sc.id !== firstSc.id) {
                    cy.get(`[data-cy=img-behind-${sc.id}]`).should('exist');
                  }
                });
              }
            },
          );
        });
    });
  });
});
