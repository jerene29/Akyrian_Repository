import { d, designSpec } from '../../helper';

const options = {
  loginAs: 'admin@example.com',
};

designSpec(
  'S-09-030',
  () => {
    before(() => {
      cy.createStudy({
        name: 'GRIDVIEW_TEST',
        formCount: 22,
        visitCount: 5,
      });
    });

    it('checks if duplicate dayOffset input reveals an error', () => {
      cy.shouldBeVisible(d`stickyAddButton-visit`).click();
      cy.shouldBeVisible(d`visit-dayOffset`)
        .click()
        .type('1');
      cy.shouldBeVisible(d`invalid-input`);
    });
  },
  options,
);
