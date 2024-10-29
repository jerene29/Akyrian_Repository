import { d, designSpec } from '../../helper';

const options = {
  loginAs: 'admin@example.com',
};

designSpec(
  {
    spec: 'S-09-037',
    title: 'Configurable Parameters on Visit Edit mode',
  },
  () => {
    before(() => {
      // rely on seed data
      cy.visit('/study/study1revisionDev2e/templateScreeningRev2eDev/consentRev2eDevId1');
      cy.shouldBeVisible(d`visit-name`);
      cy.get(d`grid-view`).click();
    });

    const EDIT_TARGET = d`editableIntervisitInterval-0-3`;
    const INPUT_TARGET = d`relativeDayOffsetInput-0-3`;

    context('Intervisit Spatial Map', () => {
      it('should be visible', () => {
        cy.get(d`grid-view`).click();
        cy.hover(d`headerCell-0-3`);
        cy.shouldBeVisible(d`intervisitInterval-0-2`);
        cy.shouldBeVisible(EDIT_TARGET);
      });

      it('cannot be left blank', () => {
        cy.hover(d`headerCell-0-3`);
        cy.shouldBeVisible(EDIT_TARGET).click();
        cy.get(INPUT_TARGET).click().clear();
        cy.getTextSnapshot(d`cellErrorPopover`);
      });

      it('must be an integer', () => {
        cy.hover(d`headerCell-0-3`);
        cy.shouldBeVisible(EDIT_TARGET).click();
        cy.get(INPUT_TARGET).click().clear().type('YOLO');
        cy.getTextSnapshot(d`cellErrorPopover`);
        // Remove this when 5000 validation is re-activated
        cy.get(INPUT_TARGET).click().clear().type('{esc}{esc}');
      });

      // TODO: Revert this once max value is decided.
      // Changing this from 500 to 5000, since it was the max value. But ignoring this for now based on task below
      // Reference: https://ikeguchiholdings.monday.com/boards/1959201049/pulses/3406468584
      xit('min is 1 max is 5000', () => {
        cy.hover(d`headerCell-0-3`);
        cy.shouldBeVisible(EDIT_TARGET).click();
        cy.get(INPUT_TARGET).click().clear().type('9999');
        cy.getTextSnapshot(d`cellErrorPopover`);
        cy.get(INPUT_TARGET).click().clear().type('{esc}{esc}');
      });
    });

    context('visit window', () => {
      it('should be visible', () => {
        cy.hover(d`headerCell-0-3`);
        cy.shouldBeVisible(d`visitWindowBefore-0-3`);
        cy.shouldBeVisible(d`visitWindowAfter-0-3`);
      });

      it('cannot be left blank', () => {
        cy.hover(d`headerCell-0-3`);
        cy.shouldBeVisible(d`visitWindowBefore-0-3`).click();
        // impossible since value is default to 0.
        cy.shouldBeVisible(d`editableVisitWindowBefore-0-3`)
          .focus()
          .clear()
          // also impossible since input filters non numerical characters
          .type('hello');
      });

      it('max to 100', () => {
        cy.shouldBeVisible(d`editableVisitWindowBefore-0-3`)
          .focus()
          .clear()
          .type('999');
        cy.getTextSnapshot(d`cellErrorPopover`);
      });

      it('checks if the system always places negative (-)', () => {
        cy.shouldBeVisible(d`visitWindowBefore-0-4`).contains('-');
      });
    });

    context('visit name', () => {
      it('should be visible', () => {
        cy.get('body').type('{esc}');
        cy.hover(d`headerCell-0-3`);
        cy.shouldBeVisible(d`visitNameBox`);
      });

      it('cannot be left blank', () => {
        cy.hover(d`headerCell-0-3`);
        cy.shouldBeVisible(d`visitNameBox`).click();

        cy.shouldBeVisible(d`visitNameInput`)
          .focus()
          .clear();
        cy.getTextSnapshot(d`cellErrorPopover`);
      });

      it('validate special characters', () => {
        cy.hover(d`headerCell-0-3`);
        cy.shouldBeVisible(d`visitNameBox`).click();

        cy.shouldBeVisible(d`visitNameInput`)
          .focus()
          .clear()
          .type('...(*');
        cy.getTextSnapshot(d`cellErrorPopover`);
      });

      it('max is 25', () => {
        // TODO: make utils cos they're basically the same sequence of action.
        cy.hover(d`headerCell-0-3`);
        cy.shouldBeVisible(d`visitNameBox`).click();

        cy.shouldBeVisible(d`visitNameInput`)
          .focus()
          .clear()
          .type(
            'akwkwkwkakwakwakwkawkakwakwakwkawkakwakwkakwaowakokaokwoakwoakwoakowkaowkaoakwowakoakwowakoawkowkwkwaokwoakwoakowkoakoawkwoakaokwoakwo',
          );
        cy.getTextSnapshot(d`cellErrorPopover`);
      });
    });

    context('visit target (dayOffset)', () => {
      const typeDayOffset = (input?: string) => {
        cy.get('body').type('{esc}');
        cy.hover(d`headerCell-0-3`);
        cy.shouldBeVisible(d`dayOffsetBox`).click();
        if (!input) {
          cy.shouldBeVisible(d`dayOffsetInput`)
            .focus()
            .clear();
        } else {
          cy.shouldBeVisible(d`dayOffsetInput`)
            .focus()
            .clear()
            .type(input);
        }
      };
      it('cannot be left blank', () => {
        typeDayOffset();
        cy.getTextSnapshot(d`cellErrorPopover`);
      });
      // TODO: Revert this once max value is decided, ignoring this for now based on task below
      // Reference: https://ikeguchiholdings.monday.com/boards/1959201049/pulses/3406468584
      xit('max to 5000', () => {
        typeDayOffset('9999');
        cy.getTextSnapshot(d`cellErrorPopover`);
      });

      it('cannot have duplicate dayOffset', () => {
        typeDayOffset('7');
        cy.getTextSnapshot(d`cellErrorPopover`);
      });

      it('editing visit target will automatically update the visit interval', () => {
        // before
        cy.get('body').type('{esc}');
        cy.hover(d`headerCell-0-3`);
        typeDayOffset('10');
        // after
        cy.getTextSnapshot(d`editableIntervisitInterval-0-3`);
      });

      it('editing interval value will automatically update the visit target', () => {
        // before
        cy.get('body').type('{esc}');
        cy.hover(d`headerCell-0-3`);
        cy.get(d`editableIntervisitInterval-0-3`).click();
        cy.get(d`relativeDayOffsetInput-0-3`)
          .focus()
          .clear()
          .type('3');
        // after
        cy.getTextSnapshot(d`dayOffsetInactiveInput`);
      });
    });
  },
  options,
);
