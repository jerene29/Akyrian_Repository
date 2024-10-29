import { d, designSpec } from '../../helper';

const options = {
  loginAs: 'admin@example.com',
  skipTest: true,
};

designSpec(
  {
    spec: 'S-09-037',
    title: 'Deleting Visits & testing bad state',
  },
  () => {
    before(() => {
      cy.createStudy({
        name: 'GRIDVIEW_TEST',
        formCount: 2,
        visitCount: 2,
      });
    });

    const goToGridView = () => {
      cy.reload();
      cy.shouldBeVisible(d`visit-name`);
      cy.get(d`grid-view`).click();
    };

    context('test if we can delete all visits in the grid view', () => {
      it('deletes first visit', () => {
        cy.get(d`headerCell-0-2`).realHover();
        cy.get(d`deleteVisit`).click();
        cy.shouldBeVisible(d`confirmModal-confirmButton`).click({
          waitForAnimations: false,
        });
      });

      it('(fake) deletes first visit', () => {
        goToGridView();

        cy.get('body').type('{esc}{esc}');
        cy.get(d`headerCell-0-1`).realHover();
        cy.get(d`deleteVisit`)
          .parent()
          .click();
        cy.shouldBeVisible(d`confirmModal-confirmButton`).click();
      });

      it('checks whether you can go outside gridview', () => {
        cy.get(d`detail-view`).click();
        cy.shouldBeVisible(d`buttonConfirm`).click();
      });

      it('checks if the last deleted visit, is available after reloads', () => {
        goToGridView();

        cy.shouldBeVisible(d`headerCell-0-1`).realHover();
      });

      it('checks if we can delete again and add new visit  ', () => {
        cy.shouldBeVisible(d`headerCell-0-1`).realHover();
        cy.get(d`deleteVisit`)
          .parent()
          .click();
        cy.shouldBeVisible(d`confirmModal-confirmButton`).click();

        cy.studyConfigGridView().then((gv) => {
          gv.createAdHocVisit({ visitName: 'new ad hoc' });
          cy.shouldBeVisible(d`headerCell-0-1`);
        });
      });

      it('should retains the fake deleted visit', () => {
        goToGridView();

        cy.shouldBeVisible(d`headerCell-0-1`);
        cy.shouldBeVisible(d`headerCell-0-2`);
      });
    });
  },
  options,
);
