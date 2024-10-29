/**
 * This test runner check every UI on Source Capture Question (SDE) section.
 */

import {
  GetVisitDetailsDocument,
  IWithSourceForm,
  IFfgrStatusEnum,
} from '../../src/graphQL/generated/graphql';

describe('No Source and Source Question', () => {
  let withSourceResponse: IWithSourceForm = {} as IWithSourceForm;

  const aliasSource = GetVisitDetailsDocument.definitions[0].name.value;

  before(() => {
    cy.reseedDB();
    cy.clearLocalStorageSnapshot();
    cy.fillInloginAsFormV2({
      email: 'admin@example.com',
    });
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasSource) {
        req.alias = req.body.operationName;
      }
    });
    cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit1Visit1');
    cy.waitForReact();
    cy.wait(`@${aliasSource}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        cy.get('[data-cy=sourceQuestionTab').click();
        withSourceResponse = result.response.body.data.visitDetails.withSourceForm;
      }
    });
  });

  describe('No Source and Source Question Tab', () => {
    it('Shows No Source and Source Question Tab', () => {
      cy.get('[data-cy=noSourceQuestionTab').should('exist').should('be.visible');
      cy.get('[data-cy=sourceQuestionTab').should('exist').should('be.visible');
    });
  });

  describe('Source question', () => {
    // TODO: Refactor this to handle data-cy with combination status now xit
    xit('Shows filters source questions based on data from BE', () => {
      cy.checkFilterExceptAllFilter(withSourceResponse);
      cy.get('[data-cy=all-filter]')
        .should('exist')
        .click()
        .then(() => {
          cy.checkFilterAllFilter(withSourceResponse);
        });
    });

    it('Checks total of question card based on filters (except ALL filter state)', () => {
      cy.checkTotalQuestionCardExceptOnAllFilter(withSourceResponse);
    });

    it('Checks total of question card on ALL filter', () => {
      cy.checkTotalQuestionCardExceptOnAllFilter(withSourceResponse);
    });

    // TODO: Refactor this to handle data-cy with combination status now xit
    xit('Checks question card question value', () => {
      cy.checkQuestionValue(withSourceResponse, 'source');
    });

    // it('Checks question card quick actions', () => {
    //   cy.checkQuickActions(withSourceResponse);
    // });

    // TODO: Refactor this to handle data-cy with combination status now xit
    xit('Checks query tag on question card', () => {
      cy.checkQueryButton(withSourceResponse);
    });

    // it('Checks no answer', () => {
    //   withSourceResponse.userVisitData.map(visitData => {
    //     const filterButtonEl = cy.get(`[data-cy=${visitData.status.join('')}]`);
    //     filterButtonEl.click()
    //       .then(() => {
    //         withSourceResponse.fieldGroups.map(FG => {
    //           if (visitData.status.includes(String(FG.formFieldGroupResponse?.status))) {
    //             if (FG.formFieldGroupResponse?.status !== IFfgrStatusEnum.Unattached) {
    //               const noAnswerSign = cy.get(`[data-cy=no-answer-sign-${FG.formFieldGroupResponse?.id}]`);
    //               if (FG.formFieldGroupResponse?.isNotAvailable) {
    //                 noAnswerSign.should('exist');
    //               }
    //             }
    //           }
    //         });
    //       });
    //   });
    // });

    xit('Checks isVerified on image stack', () => {
      withSourceResponse.userVisitData.map((visitData) => {
        cy.get(`[data-cy=${visitData.status[0]}]`)
          .click()
          .then(() => {
            cy.getFirstFGandSCandSCImgs(withSourceResponse, visitData).then(
              ({ firstFG, firstSc }) => {
                // CHECK FRONT IMAGE
                if (firstFG !== null) {
                  cy.log(JSON.stringify(withSourceResponse));
                  // CHECK ISVERIFIED
                  const isVerified = firstSc.isVerified;
                  if (isVerified === false) {
                    cy.get('[data-cy=unverified-tag]').should('be.visible');
                  }
                }
              },
            );
          });
      });
    });

    xit('Checks isVerified on carousel', () => {
      withSourceResponse.userVisitData.map((visitData) => {
        cy.get(`[data-cy=${visitData.status[0]}]`)
          .click()
          .then(() => {
            cy.getFirstFGandSCandSCImgs(withSourceResponse, visitData).then(({ firstSc }) => {
              if (firstSc && !visitData.status.includes(IFfgrStatusEnum.Unattached)) {
                cy.get(`[data-cy=img-front-${firstSc.id}]`)
                  .click()
                  .then(() => {
                    // CHECK VERIFIED
                    if (firstSc.isVerified === false) {
                      cy.get('[data-cy=unverified-tag-carousel]').should('be.visible');
                    }

                    cy.get('[data-cy=carousel-close]').click();
                  });
              }
            });
          });
      });
    });

    // TO BE CONTINUED NO UI YET
    // it('Checks isVerified on card', () => {
    //   withSourceResponse.userVisitData.map(visitData => {
    //     const filterButtonEl = cy.get(`[data-cy=${visitData.status.join('')}]`);
    //     filterButtonEl.click()
    //       .then(() => {
    //         visitDetailsNoSource.fieldGroups.map(FG => {
    //           if (visitData.status.includes(FG.formFieldGroupResponse.status)) {
    //             if (FG.formFieldGroupResponse.status !== IFfgrStatusEnum.Unattached) {
    //               if (FG.formFieldGroupResponse.sourceCapture) {
    //                 const isVerified = FG.formFieldGroupResponse.sourceCapture.isVerified;
    //                 if (isVerified) {

    //                 } else {

    //                 }
    //               }
    //             }
    //           }
    //         });
    //       });
    //   });
    // });
  });
});
