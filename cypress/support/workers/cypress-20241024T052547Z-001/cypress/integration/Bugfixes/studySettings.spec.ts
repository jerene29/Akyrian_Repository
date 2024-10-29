import { d, designSpec } from '../../helper';
import { GetStudyRevisionDocument } from '../../../src/graphQL/generated/graphql';

const options = {
  loginAs: 'admin@example.com',
};

designSpec(
  'S-09-030',
  () => {
    before(() => {
      cy.createStudy({
        name: 'Study Settings Test',
        formCount: 10,
        visitCount: 5,
      });
    });

    it('checks if organization is changed, save button should then be enabled', () => {
      const aliasStudyRevision = (GetStudyRevisionDocument as any).definitions[0].name.value;
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasStudyRevision) {
          req.alias = req.body.operationName;
        }
      });
      cy.visit('/');
      cy.get('#active-study1revisionDev2e').click();
      cy.wait(`@${aliasStudyRevision}`);
      cy.get(d`icon-system-study-settings`).click();
      cy.get('[data-cy=study-organization] > .ant-select-selector > .ant-select-selection-item')
        .click()
        .type('{downarrow}{downarrow}');
      cy.get('body').type('{enter}');
      cy.get('#btn-submit').should('be.enabled');
    });

    it('checks if organization is reverted back, save button should then be disabled', () => {
      cy.get('[data-cy=study-organization] > .ant-select-selector > .ant-select-selection-item')
        .click()
        .type('{uparrow}{uparrow}');
      cy.get('body').type('{enter}');
      cy.get('#btn-submit').should('be.disabled');
    });
  },
  options,
);
