import { d, designSpec } from '../../helper';

const options = {
  loginAs: 'admin@example.com',
};

designSpec(
  {
    spec: 'S-09-038',
    title: 'Active Edit Mode on Form',
  },
  () => {
    before(() => {
      cy.createStudy({
        name: 'GRIDVIEW_TEST',
        // remember the initial form was 5
        formCount: 5,
        visitCount: 5,
      });
    });

    context('validates form name', () => {
      before(() => {
        cy.hover('#formHeader-1-0');
      });

      const nameInput = d`activeEditableFormName-1-0`;

      it('checks for blank field', () => {
        cy.shouldBeVisible(d`editableFormName-1-0`).click();
        cy.shouldBeVisible(nameInput).clear();
        cy.shouldBeVisible(d`cellErrorPopover`).getTextSnapshot();
      });

      it('checks alphanumeric validation', () => {
        cy.shouldBeVisible(nameInput).type('..?');
        cy.shouldBeVisible(d`cellErrorPopover`).getTextSnapshot();
      });

      it('must contains non space', () => {
        cy.shouldBeVisible(nameInput).clear().type('       ');
        cy.shouldBeVisible(d`cellErrorPopover`).getTextSnapshot();
      });

      it('checks the limit of the characters, max is 35', () => {
        cy.shouldBeVisible(nameInput)
          .clear()
          .type('awkawkakwawkawkwaokwaooawkeoawkokaowaowkaokwoawkaowaowkaokwoao');
        cy.shouldBeVisible(d`cellErrorPopover`).getTextSnapshot();
      });

      it('can cancels the edit', () => {
        cy.shouldBeVisible(nameInput).clear().type('lets cancel');
        cy.shouldBeVisible(d`editCancel`).click();
      });
    });

    context(
      'tab sequence - the #.(configurable parameters of a visit block) have a distinct tab order, the [TAB] button advances downwards, the [SHIFT + TAB] advances upwards, the order is as follows:',
      () => {
        before(() => {
          cy.hover('#formHeader-1-0');
        });

        // TODO: rework on this intermittently fail on cloud.
        xit('checks if pressing [tab] will advance beyond the current GV Form Block and open the next #.(form name) of the next GV Form Block (below)', () => {
          const EDITED_NAME = 'Edited Form 2';

          cy.get('body').tab();
          cy.shouldBeVisible(d`activeEditableFormName-2-0`)
            .focus()
            .clear()
            .type(EDITED_NAME);
          cy.get('body').tab();

          cy.get('#formHeader-4-0').realHover();
          cy.get('#formHeader-2-0').realHover();
          cy.get('#formHeader-2-0').contains(EDITED_NAME);
        });

        it('pressing [shift-tab] will advance beyond the current GV Form Block and open the prior #.(form name) of the next GV Form Block (above)', () => {
          cy.get('body').tab({ shift: true });
          cy.shouldBeVisible(d`editableFormName-1-0`);
        });
      },
    );
  },
  options,
);
