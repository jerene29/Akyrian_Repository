import {
  SetUserTrainingCompletionDocument,
  AcceptStudyPolicyDocument,
  EditStudyDetailDocument,
  GetStudyListDocument,
  LoginDocument,
} from '../../../src/graphQL/generated/graphql';
import 'cypress-localstorage-commands';

describe.skip('User study privacy and policy not accepted', () => {
  const aliasAcceptPolicy = AcceptStudyPolicyDocument.definitions[0].name.value;
  const aliasStudyList = GetStudyListDocument.definitions[0].name.value;

  before(() => {
    cy.clearLocalStorageSnapshot();
    cy.reseedDB();
    cy.customRequest(LoginDocument, {
      email: 'globaluseradmin@example.com',
    }).then((response: any) => {
      const { loginAs: res } = response;
      cy.setCookie('token', res?.token);
      cy.setLocalStorage('token', res?.token);
      cy.setLocalStorage('userId', res?.user.id);

      cy.customRequest(EditStudyDetailDocument, {
        policyText: 'Lorem ipsum dolor si amet',
        studyId: 'studyTestId1',
      });

      cy.customRequest(SetUserTrainingCompletionDocument, {
        isAppTrainingCompleted: false,
        userId: 'noSourceReviewInvestigator1',
        studyTrainingCompletion: [
          {
            isTrainingCompleted: false,
            studyId: 'studyTestId1',
          },
          {
            isTrainingCompleted: false,
            studyId: 'sampleDemoStudy',
          },
        ],
      }).then(() => {
        cy.customRequest(SetUserTrainingCompletionDocument, {
          isAppTrainingCompleted: true,
          userId: 'noSourceReviewInvestigator1',
          studyTrainingCompletion: [
            {
              isTrainingCompleted: true,
              studyId: 'sampleDemoStudy',
            },
            {
              isTrainingCompleted: true,
              studyId: 'studyTestId1',
            },
          ],
        });
      });
    });
  });

  beforeEach(() => {
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasAcceptPolicy) {
        req.alias = req.body.operationName;
      }
      if (req.body.operationName === aliasStudyList) {
        req.alias = req.body.operationName;
      }
    });
  });

  it('User should accept study privacy policy before enter visit page', () => {
    cy.loginAndAcceptPlatformPrivacy('nosourcereview-signcrf@example.com');
    cy.get('#studyTestId1').click();
    cy.get('[data-cy=submit-accept-policy]').should('be.visible');
  });

  it('Should redirect back to dashboard if user access visit page through url directly', () => {
    cy.visit('/visit/testRevisionId1');
    cy.url().should('contain', '/dashboard');
  });

  it('User should accept study privacy policy before enter visit page', () => {
    cy.get('[data-cy=submit-accept-policy]').click();
    cy.wait(`@${aliasAcceptPolicy}`);
    cy.url().should('contain', '/visit');
    cy.wait(`@${aliasStudyList}`);
  });

  it('User should able to enter site flow after complete platform training, study training and accpet study privacy policy', () => {
    cy.get('[data-cy=header-logo]').click();
    cy.get('#studyTestId1').click();
    cy.get('[data-cy=submit-accept-policy]').should('not.exist');
    cy.url().should('contain', '/visit');
  });
});
