import { d, designSpec } from '../../helper';

const options = {
  loginAs: 'admin@example.com',
};

designSpec(
  {
    spec: 'S-09-037',
    title: 'Control Buttons on Visit Block',
  },
  () => {
    before(() => {
      cy.createStudy({
        name: 'GRIDVIEW_TEST',
        formCount: 5,
        visitCount: 5,
      });
    });

    context('button done', () => {
      it('clickable on valid entry', () => {
        cy.get('body').type('{esc}');

        cy.hover(d`headerCell-0-3`);
        cy.get(d`visitNameBox`).click();
        cy.get(d`visitNameInput`)
          .focus()
          .clear()
          .type('Hello World');

        cy.get(d`editConfirm`).click();

        cy.hover(d`headerCell-0-2`);
        cy.hover(d`headerCell-0-3`);
      });

      it("invalid entry won't confirm the edit", () => {
        cy.get('body').type('{esc}');

        cy.hover(d`headerCell-0-4`);
        cy.get(d`visitNameBox`).click();
        cy.get(d`visitNameInput`)
          .focus()
          .clear()
          .type('...()***');

        cy.get(d`editConfirm`).click();

        cy.getTextSnapshot(d`cellErrorPopover`);
      });
    });

    context('button cancel', () => {
      it('checks if system behavior is the same as [ESC] key', () => {
        cy.get('body').type('{esc}');

        cy.hover(d`headerCell-0-3`);
        cy.get(d`visitNameBox`).click();
        cy.get(d`visitNameInput`)
          .focus()
          .clear()
          .type('Should Cancel');

        cy.get(d`editCancel`).click();

        cy.hover(d`headerCell-0-2`);
        cy.hover(d`headerCell-0-3`);

        // now we test ending the input with type {esc}
        cy.get('body').type('{esc}');

        cy.hover(d`headerCell-0-3`);
        cy.get(d`visitNameBox`).click();
        cy.get(d`visitNameInput`)
          .focus()
          .clear()
          .type('Should Cancel{esc}');

        cy.hover(d`headerCell-0-2`);
        cy.hover(d`headerCell-0-3`);
      });
    });

    context('tab sequence', () => {
      it('navigates through editable visit input while confirming the valid edit', () => {
        const EDITED_NAME = 'Edited Visit';
        cy.get('body').type('{esc}');

        cy.hover(d`headerCell-0-4`);

        cy.get('body').tab().tab();
        cy.shouldBeVisible(d`editableVisitWindowBefore-0-4`);
        cy.get('body').tab();
        cy.shouldBeVisible(d`editableVisitWindowAfter-0-4`);
        cy.get('body').tab();
        cy.shouldBeVisible(d`visitNameInput`)
          .focus()
          .clear()
          .type(EDITED_NAME);
        cy.get('body').tab();
        cy.shouldBeVisible(d`dayOffsetInput`);
        cy.get('body').tab();

        // the visit name should be `Edited Name`
        cy.get(d`headerCell-0-4`).contains(EDITED_NAME);
        cy.hover(d`headerCell-0-4`);
      });

      it('navigates backward to previous visit', () => {
        cy.get('body').type('{esc}');

        cy.get('body').type('{esc}');

        cy.hover(d`headerCell-0-4`);

        cy.get('body').tab({ shift: true });
        cy.shouldBeVisible(d`dayOffsetInput`)
          .clear()
          .type('9');

        cy.get('body').tab({ shift: true });
        cy.shouldBeVisible(d`visitNameInput`);
        cy.get('body').tab({ shift: true });
        cy.shouldBeVisible(d`editableVisitWindowAfter-0-3`);
        cy.get('body').tab({ shift: true });
        cy.shouldBeVisible(d`editableVisitWindowBefore-0-3`);
        cy.get('body').tab({ shift: true });
        cy.shouldBeVisible(d`relativeDayOffsetInput-0-3`);
        cy.get('body').tab({ shift: true });
        cy.get(d`relativeDayOffsetInput-0-3`).should('not.exist');
      });
    });

    context('snapshots text changes', () => {
      it('snapshot headerCells', () => {
        cy.reload();

        cy.intercept('POST', '/graphql', (req) => {
          req.alias = req.body.operationName;
        });

        cy.wait('@GetVisitTemplateList').then(() => {
          cy.get(d`grid-view`).click();
          cy.get(d`grid-view`).click();
          cy.get(d`grid-view`).click();

          cy.get('body').type('{esc}{esc}');
          cy.getTextSnapshot(d`headerCell-0-1`);
          cy.getTextSnapshot(d`headerCell-0-2`);
          cy.getTextSnapshot(d`headerCell-0-3`);
          cy.getTextSnapshot(d`headerCell-0-4`);
        });
      });
    });
  },
  options,
);
