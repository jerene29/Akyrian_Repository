import {
  AcceptMarkUpFfgrDocument,
  RejectMarkUpFfgrDocument,
  IFormFieldGroupResponseStatus,
  IFieldGroupVisitDetailFragment,
  AddResponseQueryDocument,
  ResolveQueryDocument,
  IFieldGroupVisitDetail,
} from '../../../src/graphQL/generated/graphql';
import { mockUserDataAdmin } from '../../../src/constant/testFixtures';

describe('Accept Reject Mark-Up', () => {
  let ffgs: Array<IFieldGroupVisitDetail>;

  const aliasVisitDetails = 'GetVisitDetails';
  const aliasAcceptMarkUp = AcceptMarkUpFfgrDocument.definitions[0].name.value;
  const aliasRejectMarkUp = RejectMarkUpFfgrDocument.definitions[0].name.value;
  const aliasAddQuery = AddResponseQueryDocument.definitions[0].name.value;
  const aliasResolveQuery = ResolveQueryDocument.definitions[0].name.value;
  const anyPOSTRequest = 'anyPOSTRequest';

  before(() => {
    cy.beforeSetup(mockUserDataAdmin);
    cy.intercept('POST', '/graphql', (req) => {
      req.alias = req.body.operationName === aliasVisitDetails && req.body.operationName;
    });
    cy.waitForReact();
    cy.visit('/visit/testRevisionId1/toDaiHospital1/toDaiPatient1/visit1Visit2');
    cy.wait(`@${aliasVisitDetails}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        ffgs = result.response.body.data.visitDetails.withSourceForm.fieldGroups;
      }
    });
    cy.get('[data-cy=sourceQuestionTab]').click();
  });

  beforeEach(() => {
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasAddQuery) {
        req.alias = req.body.operationName;
      }
      if (req.body.operationName === aliasResolveQuery) {
        req.alias = req.body.operationName;
      }
    });
  });

  describe('Accept Reject Mark-Up', () => {
    let acceptData: IFieldGroupVisitDetailFragment;
    let rejectData: IFieldGroupVisitDetailFragment;

    beforeEach(() => {
      acceptData = ffgs.filter(
        (data) => data.formFieldGroupResponse?.status === IFormFieldGroupResponseStatus.MarkedUp,
      )[0];
      rejectData = ffgs.filter(
        (data) => data.formFieldGroupResponse?.status === IFormFieldGroupResponseStatus.MarkedUp,
      )[1];
      cy.intercept('POST', '/graphql', (req) => {
        req.alias = anyPOSTRequest;
      });
    });

    describe('Accept Mark-Up', () => {
      it('Select MARKED_UP Status', () => {
        cy.get('[data-cy=MARKED_UP]').click().trigger('mouseout');
      });

      it('Open Review SC QuickAction from question card', () => {
        cy.clickQuickAction(
          `[data-cy=question-card-${acceptData.id}]`,
          `[data-cy=review-sc-snippet-action-${acceptData.id}]`,
          undefined,
          undefined,
          'PARENT_RELATION',
        );
        cy.get('canvas', { timeout: 20000 }).should('be.visible');
      });

      // TODO: use this test if the design had unverified tag on canvas
      // it('Show and hover unverified tag if the question is unverified', () => {
      //   if (acceptData && !acceptData.formFieldGroupResponse?.sourceCapture?.isVerified) {
      //     cy.get('.slick-active [data-cy=unverified-tooltip]').should('exist')
      //       .realHover();
      //   }
      // });

      // NOTE START: old test before combining acceptReject SC + Snippet (might be reused later)
      // it('Add query, approve and reject snippet button should not showed', () => {
      //   cy.get('.ant-row-center > .ant-col > :nth-child(1) > .ant-row > :nth-child(1)').click();
      //   cy.get('[data-cy=approve-mark-up]').should('not.exist');
      //   cy.get('[data-cy=reject-mark-up]').should('not.exist');
      //   cy.get('[data-cy=mention-text-field-initiator]').click()
      //     .type('Some query to be typed');
      //   cy.get('[data-cy="SourceCapture&Mark-UpUser"]').click();
      //   cy.get('[data-cy=inititator-submit-btn]').click();
      //   cy.wait(`@${ aliasAddQuery }`);
      // });

      // it('Approve button should disabled if query status is not RESOLVED', () => {
      //   cy.get('.slick-active [data-cy=approve-mark-up]').should('be.disabled');
      //   cy.get('.slick-active [data-cy=approve-mark-up]').realHover();
      //   cy.get('.slick-active [data-cy=tooltip-unresolved-query]').should('be.visible');
      //   cy.wait(`@${ anyPOSTRequest }`);
      // });

      // it('Resolving open query, the submit button should be enabled', () => {
      //   cy.get('.slick-active [data-cy=resolve-query-btn]').click();
      //   cy.get('[data-cy=confirmModal-confirmButton]').click();
      //   cy.wait(`@${ aliasResolveQuery }`);
      //   cy.wait(`@${ anyPOSTRequest }`);
      // });
      // NOTE END: old test before combining acceptReject SC + Snippet (might be reused later)

      it('Submit Accept Mark-Up', () => {
        cy.intercept('POST', '/graphql', (req) => {
          if (req.body.operationName === aliasAcceptMarkUp) {
            req.alias = req.body.operationName;
          }
        });

        cy.get('[data-cy=button-approve-sa]').click();
        cy.wait(`@${aliasAcceptMarkUp}`).then((result) => {
          if (result?.response?.statusCode === 200) {
            cy.get('[data-cy=alert-success]').should('have.text', 'Approved');
          }
        });
        cy.wait(`@${anyPOSTRequest}`);
      });
    });

    describe('Reject snippet another question', () => {
      it('Show Submit and Back button, and the submit button should disabled', () => {
        cy.get('[data-cy=carousel-close]').click({ force: true });
        cy.clickQuickAction(
          `[data-cy=question-card-${rejectData.id}]`,
          `[data-cy=review-sc-snippet-action-${rejectData.id}]`,
        );
        cy.get('canvas', { timeout: 20000 }).should('be.visible');
        cy.get('[data-cy=overlapping-button-reject-snippet]').should('exist').click();
        cy.get('[data-cy=reject-reason]').should('exist');
        cy.get('[data-cy=submit-reject-reason]').should('be.disabled');
        cy.get('[data-cy=close-reject]').should('exist');
      });

      it('Select first reason', () => {
        cy.get('[data-cy=reject-reason]').should('exist').click().type('${enter}');
      });

      it('Button submit should enabled if user select reason', () => {
        cy.get('[data-cy=submit-reject-reason]').should('be.enabled');
      });

      it('Change selected reason and chose other. Submit should be disabled', () => {
        cy.get('[data-cy=reject-reason]').click();
        cy.get('.ant-select-item-option-content').last().click();
        cy.get('[data-cy=description-rightEye1]').click();
        cy.get('[data-cy=submit-reject-reason]').should('be.disabled');
      });

      it('Change other reason. Submit should be enabled', () => {
        cy.get('[data-cy=reject-reason]').click().type('hello other reason');
        cy.get('[data-cy=description-rightEye1]').click();
        cy.get('[data-cy=submit-reject-reason]').should('be.enabled');
      });

      it('Submit reject Mark-Up', () => {
        cy.intercept('POST', '/graphql', (req) => {
          if (req.body.operationName === aliasRejectMarkUp) {
            req.alias = req.body.operationName;
          }
        });

        // NOTE: need {force: true} to make it pass on sorry cypress. The search result pane opened when typing on "Other :" and making the submit button not visible (not reproducible on local).
        cy.get('[data-cy=submit-reject-reason]').click();
        cy.wait(`@${aliasRejectMarkUp}`).then((result) => {
          if (result?.response?.statusCode === 200) {
            cy.get('[data-cy=alert-success]', { timeout: 5000 });
          }
        });
        // cy.wait(`@${anyPOSTRequest}`);
      });
      it('Rejected question should move to MARK_UP_REJECTED status', () => {
        // NOTE: todo handle this without cy.wait(), already create command below but only passed intermittently
        // cy.checkStateLabelCount('[data-cy=MARK_UP_REJECTED]', 2, 5);
        cy.wait(5000);
        cy.get('[data-cy=carousel-close]').click({ force: true });
        // NOTE: every MARK_UP_REJECTED state navigated to NOT_AVAILABLE_REJECTED (will be refactored later to navigate via state name)
        cy.get('[data-cy=NOT_AVAILABLE_REJECTED]').scrollIntoView().click();
        cy.get('[data-cy=question-rightEye1').should('exist');
      });

      it('Accepted question should move to MARK_UP_ACCEPTED status', () => {
        cy.get('[data-cy=MARK_UP_ACCEPTED]', { timeout: 5000 }).scrollIntoView().click();
        cy.get(`[data-cy=question-${acceptData.id}]`).should('exist');
      });

      it('Rejected status Selected', () => {
        cy.intercept('POST', '/graphql', (req) => {
          req.alias = anyPOSTRequest;
        });
        cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit1Visit1');
        cy.wait(`@${anyPOSTRequest}`);
        cy.get('[data-cy=sourceQuestionTab]').click();
        cy.get('[data-cy=NOT_AVAILABLE_REJECTED]').click().trigger('mouseout');
      });

      it('Should have Attached', () => {
        cy.wait(4000);
        cy.clickQuickAction('[data-cy=question-stress1]', '[data-cy=revert-action-stress1]');
        cy.get('[data-cy=description-stress1]').contains('Attached');
        cy.get('[data-cy=close-reject]').eq(0).click({ force: true });
        cy.waitForReact();
      });

      it('UNATTACHED status Selected & Mark as no asnwer and reject question', () => {
        cy.get('[data-cy=UNATTACHED]').click().trigger('mouseout');
        cy.clickQuickAction('[data-cy=question-muscle1]', '[data-cy=noanswer-action-muscle1]');
        cy.get('[data-cy=mark-no-answer-reason-select]').click().type('{enter}');
        cy.get('[data-cy=button-submit-noanswer]').click();
        cy.typeSearch('musc');
        cy.clickQuickAction(
          '[data-cy=question-muscle1]',
          '[data-cy=verify-action-muscle1]',
          undefined,
        );
        cy.get('[data-cy=reject-data-entry]').click();
        cy.get('[data-cy=reject-reason]').click().type('{enter}');
        cy.get('[data-cy=submit-reject-reason]').click();

        cy.wait(`@${anyPOSTRequest}`);
        cy.get('.clear-text', { timeout: 10000 }).should('be.visible').click({ force: true });
      });
      it('Back to Rejected', () => {
        cy.get('[data-cy=NOT_AVAILABLE_REJECTED]', { timeout: 10000 })
          .should('be.visible')
          .click()
          .trigger('mouseout');
      });
      it('Should have unattached', () => {
        cy.clickQuickAction('[data-cy=question-muscle1]', '[data-cy=revert-action-muscle1]');
        cy.get('[data-cy=description-muscle1]').contains('Unattached');
      });
    });
  });
});
