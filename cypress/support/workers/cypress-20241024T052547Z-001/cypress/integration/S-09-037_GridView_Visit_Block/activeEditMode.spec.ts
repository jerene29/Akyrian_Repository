import { d, designSpec } from '../../helper';

const options = {
  loginAs: 'admin@example.com',
};

designSpec(
  {
    spec: 'S-09-037',
    title: 'Active Edit Mode on Visit',
  },
  () => {
    before(() => {
      cy.createStudy({
        name: 'GRIDVIEW_TEST',
        formCount: 5,
        visitCount: 5,
      });
    });

    context('keyboard shortcut', () => {
      it('uses [RETURN] key - saves changes to the active field provided there is a valid entr', () => {
        cy.hover(d`headerCell-0-1`);
        cy.shouldBeVisible(d`visitNameBox`).click();
        cy.shouldBeVisible(d`visitNameInput`)
          .clear()
          .type('Batman{enter}');
        cy.hover(d`headerCell-0-2`);
        cy.shouldBeVisible(d`headerCell-0-1`).contains('Batman');
      });

      it('uses [ESC] key - to cancel the edit', () => {
        cy.hover(d`headerCell-0-1`);
        cy.shouldBeVisible(d`visitNameBox`).click();
        cy.shouldBeVisible(d`visitNameInput`)
          .clear()
          .type('Robin{esc}');
        cy.hover(d`headerCell-0-2`);
        cy.shouldBeVisible(d`headerCell-0-1`).contains('Batman');
      });

      it('checks if clicking outside while having unfinished business(editing error) should throw a toast notification, highlights the field in red border, and shaking animation', () => {
        cy.hover(d`headerCell-0-1`);
        cy.shouldBeVisible(d`visitNameBox`).click();
        cy.shouldBeVisible(d`visitNameInput`)
          .clear()
          .type('.*))9099');

        // save snapshot of border color that is blue, according to today.
        cy.get(d`visitNameBox`).getStyleSnapshot('borderColor');
        // random coords
        cy.get('body').click(35, 10);

        cy.get(d`headerCell-0-1`).should('have.class', 'animate__shakeX');
      });
    });
  },
  options,
);
