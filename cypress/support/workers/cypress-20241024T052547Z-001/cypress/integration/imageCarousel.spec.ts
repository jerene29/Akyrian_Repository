import { mockUserDataAdmin, userDataDataEntryA, userDataSnippetAssassment, userDataSourceCapture, userDataSourceMarkUp } from '../../src/constant/testFixtures';
import {
  GetVisitDetailsDocument,
  IWithSourceForm,
  IFieldGroupVisitDetail,
} from '../../src/graphQL/generated/graphql';

import 'cypress-localstorage-commands';

describe(
  'Image Carousel',
  {
    viewportHeight: 789,
    viewportWidth: 1440,
  },
  () => {
    let visitDetails: IWithSourceForm = {} as IWithSourceForm;

    let unattachedFGs: IFieldGroupVisitDetail[] = [];
    let rejectedFGs: IFieldGroupVisitDetail[] = [];
    let acceptedFGs: IFieldGroupVisitDetail[] = [];
    let markedUpFFGs: IFieldGroupVisitDetail[] = [];
    let rejectedSCFGs: IFieldGroupVisitDetail[] = [];

    const aliasGetVisitDetailSC = GetVisitDetailsDocument.definitions[0].name.value;

    const sorting = (FGs: IFieldGroupVisitDetail[]) => {
      return FGs.sort((a, b) => {
        if (a.id > b.id) {
          return 1;
        }
        if (a.id < b.id) {
          return -1;
        }
        return 0;
      });
    };

    before(() => {
      cy.reseedDB();
      cy.clearLocalStorageSnapshot();
      cy.fillInloginAsFormV2({
        email: mockUserDataAdmin.email,
      });
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasGetVisitDetailSC) {
          req.alias = req.body.operationName;
        }
      });
      cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit1Visit1');
      cy.waitForReact();
      cy.wait(`@${aliasGetVisitDetailSC}`).then((result) => {
        if (result?.response?.statusCode === 200) {
          visitDetails = result.response.body.data.visitDetails.withSourceForm;
          unattachedFGs = visitDetails.fieldGroups?.filter(
            (FG: IFieldGroupVisitDetail) => FG.formFieldGroupResponse?.status === 'UNATTACHED',
          );
          unattachedFGs = sorting(unattachedFGs);
          rejectedFGs = visitDetails.fieldGroups?.filter(
            (FG: IFieldGroupVisitDetail) =>
              FG.formFieldGroupResponse?.status === 'MARK_UP_REJECTED',
          );
          rejectedFGs = sorting(rejectedFGs);
          acceptedFGs = visitDetails.fieldGroups?.filter(
            (FG: IFieldGroupVisitDetail) =>
              FG.formFieldGroupResponse?.status === 'MARK_UP_ACCEPTED',
          );
          acceptedFGs = sorting(acceptedFGs);
          markedUpFFGs = visitDetails.fieldGroups?.filter(
            (FG: IFieldGroupVisitDetail) => FG.formFieldGroupResponse?.status === 'MARKED_UP',
          );
          markedUpFFGs = sorting(markedUpFFGs);
        }
      });
      cy.get('[data-cy=sourceQuestionTab').click();
    });

    describe('Login as admin', () => {
      it('check Carousel Functionality', () => {
        cy.get('[data-cy=FILLED]').click({ force: true });
        cy.get('[data-cy=question-card-multiEntrySC1]').click({ force: true });
        cy.get('[data-cy=img-front-mulSiteSourceCapture1Dup5]').click({ force: true });
        cy.get('[data-cy=canvas-content').should('be.visible');

        cy.get('.slick-prev.slick-disabled').should('be.visible');
        cy.get('.slick-next.slick-disabled').should('not.exist');
        cy.get('.slick-next').click();
        // NOTE: wait for slick.next animation to finish
        cy.wait(2000);
        cy.get('.slick-prev.slick-disabled').should('not.exist');
        cy.get('.slick-next.slick-disabled').should('be.visible');
        cy.get('.slick-prev').click();
        // NOTE: wait for slick.next animation to finish
        cy.wait(2000);
        cy.get('.slick-prev.slick-disabled').should('be.visible');
        cy.get('.slick-next.slick-disabled').should('not.exist');

        cy.get('[data-cy=carousel-image-selected-0]').should('be.visible');
        cy.get('[data-cy=carousel-image-not-selected-1]').should('be.visible');
        cy.get('[data-cy=carousel-image-not-selected-2]').should('be.visible');
        cy.get('[data-cy=carousel-image-not-selected-3]').should('be.visible');
        cy.get('[data-cy=carousel-image-not-selected-4]').should('be.visible');

        cy.get('[data-cy=carousel-image-selected-0]').type('{rightArrow}');
        cy.wait(5000);
        cy.get('[data-cy=carousel-image-not-selected-0]').should('be.visible');
        cy.get('[data-cy=carousel-image-selected-1]').should('be.visible');
//         NOTE: wait for image to load before going to right arrow (because we prevent the user to change image
//         if the image still loading, but for the next time the image won't be loading anymore because it's
//         already on browser cache)
        cy.get('[data-cy=carousel-image-selected-1]').type('{leftArrow}');
        cy.wait(5000);
        cy.get('[data-cy=carousel-image-selected-0]').should('be.visible');
        cy.get('[data-cy=carousel-image-not-selected-1]').should('be.visible');
//         NOTE: wait for image to load before going to right arrow (because we prevent the user to change image
//         if the image still loading, but for the next time the image won't be loading anymore because it's
//         already on browser cache)
        cy.get('[data-cy=carousel-image-not-selected-4]')
          .should('be.visible')
          .click();
        cy.wait(5000);
        cy.get('[data-cy=carousel-image-selected-4]').should('be.visible');
        cy.get('[data-cy=carousel-image-not-selected-0]').should('be.visible');
//         NOTE: wait for image to load before going to right arrow (because we prevent the user to change image
//         if the image still loading, but for the next time the image won't be loading anymore because it's
//         already on browser cache)
        cy.get('[data-cy=carousel-image-selected-4]').type('{rightArrow}');
        cy.get('[data-cy=carousel-image-not-selected-4]').should('be.visible');
        cy.get('[data-cy=carousel-image-selected-5]').should('be.visible');
        cy.get('.slick-prev.slick-disabled').should('not.exist');
        cy.get('.slick-next.slick-disabled').should('be.visible');
        cy.get('[data-cy=carousel-close]').click();
      });

      it('check highlight on carousel', () => {
        cy.get('[data-cy=NOT_AVAILABLE_REJECTED]').click({ force: true });
        cy.get(`[data-cy=question-card-${rejectedFGs[0].id}]`).click({ force: true });
        const firstAssociateId = rejectedFGs[0].formFieldGroupResponse?.sourceCapture?.id;
        cy.get(`[data-cy=img-front-${firstAssociateId}]`).click({ force: true });
        // cy.wait(2000);
        cy.get('[data-cy=canvas-content] .konvajs-content canvas').invoke('outerHeight').should('be.gt', 300);
        // cy.get('[data-cy=canvas-content] .konvajs-content canvas', {timeout: 10000}).should('be.visible');
        cy.get('[data-cy=canvas-content]', {timeout: 10000})
          .should('be.visible')
          .matchImageSnapshot('check highlight on carousel 1', {
            failureThreshold: 100,
            failureThresholdType: 'percent',
          });
        const associates = visitDetails.fieldGroups.filter(
          (FG) => FG.formFieldGroupResponse?.sourceCaptureId === firstAssociateId,
        );

        // CLICKING ON ASSOCIATE
        const associatesExceptFirst = associates.filter((associatedFG) => {
          if (associatedFG.id !== firstAssociateId) {
            return true;
          } else return false;
        })[0];
        cy.get(
          `[data-cy=associated-carousel-${associatesExceptFirst?.formFieldGroupResponse?.id}]`,
        ).should('exist');
        cy.get(
          `[data-cy=associated-carousel-${associatesExceptFirst?.formFieldGroupResponse?.id}]`,
        ).click();
        cy.get('[data-cy=canvas-content] .konvajs-content canvas', {timeout: 10000}).should('be.visible');
        cy.get('[data-cy=canvas-content]', {timeout: 10000})
          .should('be.visible')
          .matchImageSnapshot('check highlight on carousel 2', {
            failureThreshold: 100,
            failureThresholdType: 'percent',
          });
        cy.get('[data-cy=carousel-close]').click();
      });

      it('Click edit snippet from carousel should bring to canvas, and activate the selected snippet in edit mode', () => {
        const brainQuestion = rejectedFGs.find((x) => x.shortQuestion === 'Brain');
        const brainQuestionId = brainQuestion?.id;
        cy.get('[data-cy=NOT_AVAILABLE_REJECTED]').click({ force: true });
        cy.get(`[data-cy=image-stack-button]`).should('exist').click({ force: true });
        cy.get(`[data-cy=question-card-${brainQuestionId}]`)
          .scrollIntoView({ duration: 500 })
          .click({ force: true });
        cy.waitForCanvasToLoad();
        cy.get(`[data-cy="editing-tools"] > [data-cy=edit-snippet-action-${brainQuestionId}]`)
          .should('be.visible')
          .realHover()
          .click({ force: true });
        cy.wait(5000); // cannot use canvasToLoad because the canvas component already there, but image still loading
        cy.removeTooltipIfVisible();
        cy.get(`#monitor-flow-body-${brainQuestionId}`).should('be.visible');
        cy.checkIfModalIsEditMode();
        // cy.wait(2000);
        cy.get('[data-cy=canvas-content] .konvajs-content canvas').invoke('outerHeight').should('be.gt', 300);
        // cy.get('[data-cy=canvas-content] .konvajs-content canvas', {timeout: 10000}).should('be.visible');
        cy.getSnapshot('[data-cy=canvas-content]', {
          failureThreshold: 0.01,
          failureThresholdType: 'percent',
        });
      });
    });

    describe('Login as SC user', () => {
      before(() => {
        cy.clearLocalStorageSnapshot();
        cy.fillInloginAsFormV2({
          email: userDataSourceCapture.email,
        });

        cy.intercept('POST', '/graphql', (req) => {
          if (req.body.operationName === aliasGetVisitDetailSC) {
            req.alias = req.body.operationName;
          }
        });
        cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit1Visit1');
        cy.waitForReact();
        cy.wait(2000);
        cy.wait(`@${aliasGetVisitDetailSC}`).then((result) => {
          if (result?.response?.statusCode === 200) {
            cy.get('[data-cy=sourceQuestionTab]').click();
            visitDetails = result.response.body.data.visitDetails.withSourceForm;
            rejectedSCFGs = visitDetails.fieldGroups?.filter(
              (FG: IFieldGroupVisitDetail) =>
                FG.formFieldGroupResponse?.status === 'NOT_AVAILABLE_REJECTED',
            );
            rejectedSCFGs = sorting(rejectedSCFGs);
          }
        });
      });

      it('check highlight on carousel', () => {
        cy.get('[data-cy=NOT_AVAILABLE_REJECTED]').click({ force: true });
        cy.get(`[data-cy=question-card-${rejectedSCFGs[0].id}]`).click({ force: true });
        const firstAssocisateId = rejectedSCFGs[0].formFieldGroupResponse?.sourceCapture?.id;
        cy.wait(2000);
        cy.get(`[data-cy=img-front-${firstAssocisateId}]`).click({ force: true });
        // cy.wait(2000);
        cy.get('[data-cy=canvas-content] .konvajs-content canvas').invoke('outerHeight').should('be.gt', 300);
        // cy.get('[data-cy=canvas-content] .konvajs-content canvas', {timeout: 10000}).should('be.visible');
        cy.get('[data-cy=canvas-content]', {timeout: 10000})
          .should('be.visible')
          .matchImageSnapshot({
            failureThreshold: 100,
            failureThresholdType: 'percent',
          });
      });
    });

    describe('Login as Source Markup user', () => {
      before(() => {
        cy.clearLocalStorageSnapshot();
        cy.fillInloginAsFormV2({
          email: userDataSourceMarkUp.email,
        });

        cy.intercept('POST', '/graphql', (req) => {
          if (req.body.operationName === aliasGetVisitDetailSC) {
            req.alias = req.body.operationName;
          }
        });
        cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit1Visit1');
        cy.waitForReact();
        cy.wait(`@${aliasGetVisitDetailSC}`).then((result) => {
          if (result?.response?.statusCode === 200) {
            cy.get('[data-cy=sourceQuestionTab]').click();
            visitDetails = result.response.body.data.visitDetails.withSourceForm;
            rejectedFGs = visitDetails.fieldGroups?.filter(
              (FG: IFieldGroupVisitDetail) =>
                FG.formFieldGroupResponse?.status === 'MARK_UP_REJECTED',
            );
            rejectedFGs = sorting(rejectedFGs);
          }
        });
      });

      it('check highlight on carousel', () => {
        cy.get('[data-cy=MARK_UP_REJECTED]').click({ force: true });
        cy.get(`[data-cy=question-card-${rejectedFGs[0].id}]`).click({ force: true });
        const firstAssocisateId = rejectedFGs[0].formFieldGroupResponse?.sourceCapture?.id;
        cy.get(`[data-cy=img-front-${firstAssocisateId}]`).click({ force: true });
        // cy.wait(2000);
        cy.get('[data-cy=canvas-content] .konvajs-content canvas').invoke('outerHeight').should('be.gt', 300);
        // cy.get('[data-cy=canvas-content] .konvajs-content canvas', {timeout: 10000}).should('be.visible');
        cy.get('[data-cy=canvas-content]', {timeout: 10000})
          .should('be.visible')
          .matchImageSnapshot({
            failureThreshold: 100,
            failureThresholdType: 'percent',
          });
      });
    });

    describe('Login as Snippet Assesment user', () => {
      before(() => {
        cy.clearLocalStorageSnapshot();
        cy.fillInloginAsFormV2({
          email: userDataSnippetAssassment.email,
        });

        cy.intercept('POST', '/graphql', (req) => {
          if (req.body.operationName === aliasGetVisitDetailSC) {
            req.alias = req.body.operationName;
          }
        });
        cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit1Visit1');
        cy.waitForReact();
        cy.wait(`@${aliasGetVisitDetailSC}`).then((result) => {
          if (result?.response?.statusCode === 200) {
            cy.get('[data-cy=sourceQuestionTab]').click();
            visitDetails = result.response.body.data.visitDetails.withSourceForm;
            markedUpFFGs = visitDetails.fieldGroups?.filter(
              (FG: IFieldGroupVisitDetail) => FG.formFieldGroupResponse?.status === 'MARKED_UP',
            );
            markedUpFFGs = sorting(markedUpFFGs);
          }
        });
      });
      it('check highlight on carousel', () => {
        cy.get('[data-cy=MARKED_UP]').click({ force: true });
        cy.get(`[data-cy=question-card-${markedUpFFGs[0].id}]`).click({ force: true });
        const firstAssocisateId = markedUpFFGs[0].formFieldGroupResponse?.sourceCapture?.id;
        cy.get(`[data-cy=img-front-${firstAssocisateId}]`).click({ force: true });
        // cy.wait(2000);
        cy.get('[data-cy=canvas-content] .konvajs-content canvas').invoke('outerHeight').should('be.gt', 300);
        // cy.get('[data-cy=canvas-content] .konvajs-content canvas', {timeout: 10000}).should('be.visible');
        cy.get('[data-cy=canvas-content]', {timeout: 10000})
          .should('be.visible')
          .matchImageSnapshot({
            failureThreshold: 100,
            failureThresholdType: 'percent',
          });
      });
    });

    describe('Login as Verifier', () => {
      before(() => {
        cy.clearLocalStorageSnapshot();
        cy.fillInloginAsFormV2({
          email: userDataDataEntryA.email,
        });

        cy.intercept('POST', '/graphql', (req) => {
          if (req.body.operationName === aliasGetVisitDetailSC) {
            req.alias = req.body.operationName;
          }
        });
        cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit1Visit1');
        cy.waitForReact();
        cy.wait(`@${aliasGetVisitDetailSC}`).then((result) => {
          if (result?.response?.statusCode === 200) {
            cy.get('[data-cy=sourceQuestionTab').click();
            visitDetails = result.response.body.data.visitDetails.withSourceForm;
            unattachedFGs = visitDetails.fieldGroups?.filter(
              (FG: IFieldGroupVisitDetail) => FG.formFieldGroupResponse?.status === 'UNATTACHED',
            );
            rejectedFGs = visitDetails.fieldGroups?.filter(
              (FG: IFieldGroupVisitDetail) =>
                FG.formFieldGroupResponse?.status === 'MARK_UP_REJECTED',
            );
          }
        });
      });

      it('check formview on carousel', () => {
        cy.get('[data-cy=MARK_UP_ACCEPTED]').click({ force: true });
        cy.get(`[data-cy=question-card-${acceptedFGs[0].id}]`).click({ force: true });
        const firstAssocisateId = acceptedFGs[0].formFieldGroupResponse?.sourceCapture?.id;
        cy.get(`[data-cy=img-front-${firstAssocisateId}]`).click({ force: true });
        // cy.wait(2000);
        cy.get('[data-cy=canvas-content] .konvajs-content canvas').invoke('outerHeight').should('be.gt', 300);
        // cy.get('[data-cy=canvas-content] .konvajs-content canvas', {timeout: 10000}).should('be.visible');
        cy.get('[data-cy=canvas-content]', {timeout: 10000})
          .should('be.visible')
          .matchImageSnapshot({
            failureThreshold: 100,
            failureThresholdType: 'percent',
          });

        const associates = visitDetails.fieldGroups.filter(
          (FG) => FG.formFieldGroupResponse?.sourceCaptureId === firstAssocisateId,
        );

        // // CLICKING ON ASSOCIATE
        const associatesExceptFirst = associates.filter((associatedFG) => {
          if (associatedFG.id !== firstAssocisateId) {
            return true;
          } else return false;
        })[0];
        cy.get(
          `[data-cy=associated-carousel-${associatesExceptFirst?.formFieldGroupResponse?.id}]`,
        ).should('exist');
        cy.get(
          `[data-cy=associated-carousel-${associatesExceptFirst?.formFieldGroupResponse?.id}]`,
        ).click();
        // cy.wait(2000);
        cy.get('[data-cy=canvas-content] .konvajs-content canvas').invoke('outerHeight').should('be.gt', 300);
        // cy.get('[data-cy=canvas-content] .konvajs-content canvas', {timeout: 10000}).should('be.visible');
        cy.get('[data-cy=canvas-content]', {timeout: 10000})
          .should('be.visible')
          .matchImageSnapshot({
            failureThreshold: 100,
            failureThresholdType: 'percent',
          });
      });
    });

    describe('Login as Accept Reject - Birch', () => {
      before(() => {
        cy.clearLocalStorageSnapshot();
        cy.fillInloginAsFormV2({
          email: 'birch@example.com',
        });

        cy.intercept('POST', '/graphql', (req) => {
          if (req.body.operationName === aliasGetVisitDetailSC) {
            req.alias = req.body.operationName;
          }
        });
        cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit1Visit1');
        cy.waitForReact();
        cy.wait(`@${aliasGetVisitDetailSC}`).then((result) => {
          if (result?.response?.statusCode === 200) {
            cy.get('[data-cy=sourceQuestionTab').click();
            visitDetails = result.response.body.data.visitDetails.withSourceForm;
            unattachedFGs = visitDetails.fieldGroups?.filter(
              (FG: IFieldGroupVisitDetail) => FG.formFieldGroupResponse?.status === 'UNATTACHED',
            );
            rejectedFGs = visitDetails.fieldGroups?.filter(
              (FG: IFieldGroupVisitDetail) =>
                FG.formFieldGroupResponse?.status === 'MARK_UP_REJECTED',
            );
          }
        });
      });
      it('check formview on carousel', () => {
        cy.get('[data-cy=MARKED_UP]').click({ force: true });
        cy.get(`[data-cy=question-card-${markedUpFFGs[0].id}]`).click({ force: true });
        const firstAssocisateId = markedUpFFGs[0].formFieldGroupResponse?.sourceCapture?.id;
        cy.get(`[data-cy=img-front-${firstAssocisateId}]`).click({ force: true });
        // cy.wait(2000);
        cy.get('[data-cy=canvas-content] .konvajs-content canvas', {timeout: 10000}).should('be.visible');
        cy.get('[data-cy=canvas-content]', {timeout: 10000})
          .should('be.visible')
          .matchImageSnapshot({
            failureThreshold: 100,
            failureThresholdType: 'percent',
          });

        const associates = visitDetails.fieldGroups.filter(
          (FG) => FG.formFieldGroupResponse?.sourceCaptureId === firstAssocisateId,
        );

        // // CLICKING ON ASSOCIATE
        const associatesExceptFirst = associates.filter((associatedFG) => {
          if (associatedFG.id !== firstAssocisateId) {
            return true;
          } else return false;
        })[0];
        cy.get(
          `[data-cy=associated-carousel-${associatesExceptFirst?.formFieldGroupResponse?.id}]`,
        ).should('exist');
        cy.get(
          `[data-cy=associated-carousel-${associatesExceptFirst?.formFieldGroupResponse?.id}]`,
        ).click();
        // cy.wait(2000);
        cy.get('[data-cy=canvas-content] .konvajs-content canvas').invoke('outerHeight').should('be.gt', 300);
        // cy.get('[data-cy=canvas-content] .konvajs-content canvas', {timeout: 10000}).should('be.visible');
        cy.get('[data-cy=canvas-content]', {timeout: 10000})
          .should('be.visible')
          .matchImageSnapshot({
            failureThreshold: 100,
            failureThresholdType: 'percent',
          });
      });
    });
  },
);
