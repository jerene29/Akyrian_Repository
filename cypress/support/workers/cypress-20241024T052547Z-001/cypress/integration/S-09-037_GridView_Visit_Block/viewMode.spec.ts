import { d, designSpec } from '../../helper';

const options = {
  loginAs: 'admin@example.com',
};

designSpec(
  'S-09-037',
  () => {
    before(() => {
      cy.createStudy({
        name: 'GRIDVIEW_TEST',
        formCount: 5,
        visitCount: 5,
      });
    });

    context('inactive edit mode', () => {
      it('checks if fields have a light blue border', () => {
        cy.hover(d`headerCell-0-2`);
        cy.getStyleSnapshot('borderColor', d`visitNameBox`);
        cy.shouldBeVisible(d`visitNameInactiveInput`);
      });

      it('checks if mouse pointer is a cursor icon over editable fields, clicking triggers active edit mode', () => {
        cy.get(d`visitNameBox`).click();
        cy.shouldBeVisible(d`visitNameInput`);
      });

      it('shows the drag handler', () => {
        cy.hover(d`headerCell-0-2`);
        cy.shouldBeVisible(d`moveHandler`);
      });

      it('reveals anchor checkbox', () => {
        cy.hover(d`headerCell-0-5`);
        cy.get(d`anchorCheckbox`).should('exist');
      });

      it('reveals delete button, and successfully delete visit', () => {
        cy.hover(d`headerCell-0-5`);
        cy.shouldBeVisible(d`deleteVisit`).click();
        cy.shouldBeVisible(d`confirmModal-confirmButton`).click();
        cy.isGone(d`headerCell-0-5`);
      });

      it('reveals + icons to the right and left of the block - clickable and can add a singular visit to the right', () => {
        cy.hover(d`headerCell-0-4`);
        cy.shouldBeVisible(d`copyVisitRightButton-0-4`).click();
        cy.shouldBeVisible(d`headerCell-0-5`);
        cy.shouldBeVisible(d`copyVisitLeftButton-0-4`).click();
        cy.get(d`headerCell-0-6`).should('exist');
      });

      // TODO: rework on this intermittently fail on cloud.
      xit('can drag visit', () => {
        cy.get(d`headerCell-0-2`).realHover();
        cy.dragAndDrop(d`headerCell-0-2`, d`headerCell-0-4`);

        cy.shouldBeVisible(d`confirmModal-confirmButton`).click();
        cy.reload();
        // one click is not enough!
        cy.get(d`grid-view`).click();
        cy.get(d`grid-view`).click();
        cy.get(d`grid-view`).click();

        cy.getTextSnapshot(d`headerCell-0-2`);
        cy.getTextSnapshot(d`headerCell-0-4`);
      });
    });
  },
  options,
);
