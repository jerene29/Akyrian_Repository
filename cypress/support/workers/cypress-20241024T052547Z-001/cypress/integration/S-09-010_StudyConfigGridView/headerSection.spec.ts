import { d, designSpec } from '../../helper';

const options = {
  loginAs: 'admin@example.com',
  skipTest: true,
};

designSpec(
  'S-09-010',
  () => {
    before(() => {
      cy.createStudy({
        name: 'GRIDVIEW_TEST',
        formCount: 22,
        visitCount: 5,
      });
    });

    it('checks if Header Section is fixed at top of screen (does not scroll)', () => {
      cy.get(d`contentWindow`).scrollTo('bottom');
      cy.shouldBeVisible(d`headerCell-0-1`);
    });

    it('contains the Intervisit Spatial Map', () => {
      cy.get(d`contentWindow`).scrollTo('top');
      cy.shouldBeVisible(d`columnDot-0-1-anchor`);
      cy.shouldBeVisible(d`columnDot-0-2`);
    });
  },
  options,
);
