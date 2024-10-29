import { d, designSpec } from '../../helper';

const options = {
  loginAs: 'admin@example.com',
};

designSpec(
  {
    spec: 'S-09-036',
    title: 'Intervisit Spatial Map',
  },
  () => {
    before(() => {
      cy.createStudy({
        name: 'GRIDVIEW_TEST',
        formCount: 3,
        visitCount: 5,
      });
    });

    context('Column Dots', () => {
      it('is yellow for anchor for non anchor', () => {
        cy.get(d`contentWindow`).scrollTo('top', { ensureScrollable: false });

        cy.shouldBeVisible(d`columnDot-0-1-anchor`).getStyleSnapshot('backgroundColor');
      });
      it('is blue for regular visit', () => {
        cy.shouldBeVisible(d`columnDot-0-2`).getStyleSnapshot('backgroundColor');
      });
    });

    context('Intervisit interval', () => {
      it('contains the Intervisit Spatial Map', () => {
        cy.shouldBeVisible(d`intervisitInterval-0-2`);
      });
    });

    context(
      'visit window toggle - a button that switches between two positions to show or hide the visit windows of all the visits',
      () => {
        it('hides visit window', () => {
          cy.get('.ant-switch').click();
          cy.get(d`visitWindowBefore-0-2`).should('not.exist');
          cy.get(d`visitWindowAfter-0-2`).should('not.exist');
        });

        it('shows visit window', () => {
          cy.get('.ant-switch').click();
          cy.shouldBeVisible(d`visitWindowBefore-0-2`);
          cy.shouldBeVisible(d`visitWindowAfter-0-2`);
        });
      },
    );
  },
  options,
);
