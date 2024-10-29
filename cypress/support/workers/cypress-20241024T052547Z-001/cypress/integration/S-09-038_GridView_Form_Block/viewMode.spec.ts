import { d, designSpec } from '../../helper';

const options = {
  loginAs: 'admin@example.com',
  skipTest: true,
};

designSpec(
  'S-09-038',
  () => {
    before(() => {
      cy.createStudy({
        name: 'GRIDVIEW_TEST',
        // remember the initial form was 5
        formCount: 5,
        visitCount: 5,
      });
    });

    context('inactive edit form mode', () => {
      const THIRD_FORM = '3-0';

      it('is hoverable', () => {
        // NOTE: data-cy prop for formHeader gone missing on the next day!!! idk why, temporarily use id (#)
        cy.hover('#formHeader-1-0');
        cy.shouldBeVisible(d`editableFormName-1-0`);
      });

      it('reveals text edit details to redirect to edit view', () => {
        cy.hover('#formHeader-1-0');
        cy.shouldBeVisible(d`formEditDetails-1-0`).click();
        // snapshot detail view button on detail view, to make sure we're there (since it's based on state and not routing).
        cy.get(d`detail-view`).should('have.css', 'background-color', 'rgb(61, 97, 215)');
        cy.get(d`grid-view`).click();
      });

      it('reveals delete icon and can delete form', () => {
        cy.shouldBeVisible(d`formDelete-1-0`).click();
        cy.shouldBeVisible(d`confirmation-modal-desc`);

        cy.shouldBeVisible(d`confirmModal-confirmButton`).click();
        // check if form on row 5 still there.
        cy.isGone(d`formDelete-5-0`);
      });

      it('reveals + icons to the top and bottom of the block, can add form according to the order of add button position ', () => {
        // NOTE: special quirky operation here because cypress is too fast to get the item id, before the previous deletion is completed
        cy.get(d`detail-view`).click();
        cy.get(d`buttonConfirm`).click();

        cy.hover(`#formHeader-${THIRD_FORM}`);
        cy.shouldBeVisible(`[data-cy=copyFormUpButton-${THIRD_FORM}]`).click();

        // third form became fourth form
        cy.shouldBeVisible(`[data-cy=copyFormDownButton-4-0]`).click();

        cy.get(`#formHeader-3-0`).contains('unnamed form');
      });

      //  NOTE: put to bottommost because to do this we need to test it on seeded gridview data.
      it('checks if delete form remove parent child trigger', () => {
        cy.visit('/study');
        cy.get('#active-study1revisionDev2e').click();
        cy.get(d`btn-edit-study`).click();
        cy.get(d`grid-view`).click();
        cy.hover('#formHeader-3-0');
        cy.shouldBeVisible(d`formDelete-3-0`).click();
        cy.get('.ant-modal-body').contains(
          'You are deleting a form that has dependencies. Deleting this form will disconnect them. Are you sure?',
        );
        cy.shouldBeVisible(d`confirmModal-confirmButton`).click();
      });

      // TODO: rework on this intermittently fail on cloud.
      xit('is draggable', () => {
        cy.dragAndDrop('#formHeader-1-0', '#formHeader-3-0');
        cy.shouldBeVisible(d`confirmModal-confirmButton`).click();
        cy.get('body').tab();
        cy.reload();
        cy.get(d`grid-view`).click();
        cy.get(d`grid-view`).click();
        cy.get(d`grid-view`).click();

        cy.getTextSnapshot('#formHeader-3-0');
      });
    });
  },
  options,
);
