
import { SetUserTrainingCompletionDocument, LoginDocument } from '../../../src/graphQL/generated/graphql';
import 'cypress-localstorage-commands';

describe.skip('Study training not received', () => {
  before(() => {
    cy.clearLocalStorageSnapshot();
    cy.reseedDB();
    cy.customRequest(LoginDocument, { email: 'globaluseradmin@example.com' })
      .then((response: any) => {
        const { loginAs: res } = response;
        cy.setCookie('token', res?.token);
        cy.setLocalStorage('token', res?.token);
        cy.setLocalStorage('userId', res?.user.id);

        cy.customRequest(SetUserTrainingCompletionDocument, {
          isAppTrainingCompleted: false,
          userId: 'noSourceReviewInvestigator1',
          studyTrainingCompletion: [
            {
              isTrainingCompleted: false,
              studyId: 'studyTestId1'
            },
            {
              isTrainingCompleted: false,
              studyId: 'sampleDemoStudy'
            },
          ]
        })
          .then(() => {
            cy.customRequest(SetUserTrainingCompletionDocument, {
              isAppTrainingCompleted: true,
              userId: 'noSourceReviewInvestigator1',
              studyTrainingCompletion: [
                {
                  isTrainingCompleted: false,
                  studyId: 'sampleDemoStudy'
                },
                {
                  isTrainingCompleted: false,
                  studyId: 'studyTestId1'
                }
              ]
            });
          });
      });
  });

  it('Should show modal confirmation that prevent user to access the study', () => {
    cy.loginAndAcceptPlatformPrivacy('nosourcereview-signcrf@example.com');
    cy.get('#studyTestId1').click();
    cy.get('[data-cy=user-training-modal]').should('exist');

  });

  it('Should redirect back to dashboard if user access visit page throught url directly', () => {
    cy.visit('/visit');
    cy.url().should('contain', '/dashboard');
    cy.get('[data-cy=user-training-modal]').should('exist');
  });
});