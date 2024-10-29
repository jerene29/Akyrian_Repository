import { d, designSpec } from '../../helper';

const options = {
  loginAs: 'admin@example.com',
};

designSpec(
  'S-09-010',
  () => {
    before(() => {
      cy.createStudy({
        name: 'GRIDVIEW_TEST',
        formCount: 0,
        visitCount: 0,
      });
    });

    context('if grid is empty', () => {
      it('checks if a grid template appears in the Grid section where user can drag and select an area encompassing a certain number of columns for allotted visits and a certain number of rows for allotted form', () => {
        cy.shouldBeVisible(d`cell-5-3`);
        cy.shouldBeVisible(d`visitHeader-0-3`).contains('Unnamed Visit');
        cy.shouldBeVisible(d`formHeader-3-0`).contains('Form');
      });
    });

    context('every newly added Form must be associated with at least one Visit', () => {
      it('checks if warning dialog appears if user tries to click away from empty grid view', () => {
        cy.get(d`cell-4-3`).click();
        cy.get(d`detail-view`).click();

        cy.get(d`buttonConfirm`).click();
      });
    });

    context(
      'checks types of visits appearances - grouped by vertical labeled lines in the following order',
      () => {
        it('can create 2 visits Ad-Hoc and Child', () => {
          cy.studyConfigGridView().then((gv) => {
            gv.createAdHocVisit({ visitName: 'AdHoc 1' });
            gv.createChildVisit({ visitName: 'Child 1' });
          });
        });

        it('checks vertical spacer is in order', () => {
          cy.shouldBeVisible(d`spacer-SCHEDULED`);
          cy.shouldBeVisible(d`spacer-AD_HOC`);
          cy.shouldBeVisible(d`spacer-HIDDEN`);

          cy.getSnapshot(d`contentWindow`);
        });
      },
    );
  },
  options,
);
