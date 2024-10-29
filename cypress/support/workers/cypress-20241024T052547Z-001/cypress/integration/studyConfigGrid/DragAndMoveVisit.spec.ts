import {
  GetPatientListDocument,
  GetVisitTemplateListDocument,
  ReorderVisitTemplateDocument,
} from '../../../src/graphQL/generated/graphql';

// TODO: make new GRIDVIEW TEST
xdescribe('Quick Actions', () => {
  const aliasing = {
    getPatient: GetPatientListDocument as any,
    visitTemplateList: GetVisitTemplateListDocument,
    reorderVisit: ReorderVisitTemplateDocument,
  };

  before(() => {
    cy.reseedDB();
    Login();
  });

  const Login = () => {
    const alias = aliasing.getPatient.definitions[0].name.value;
    const loginAlias = 'login';
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === alias) {
        req.alias = req.body.operationName;
      }
    });
    cy.intercept('POST', '/api/auth/token?grantType=password', (req) => {
      req.alias = loginAlias;
    });
    cy.clearLocalStorageSnapshot();
    cy.fillInloginAsFormV2({
      email: 'admin@example.com',
    });
    cy.waitForReact();
  };

  const goToStudyConfigGrid = (): void => {
    // cy.get('[data-cy=btn-list-env]').eq(3).click()
    cy.get('.btn-lists-search ~ div .card-area')
      .eq(0)
      .click()
      .get('[data-cy=btn-edit-study]')
      .click()
      .get('[data-cy=grid-view]')
      .click();
  };

  const dragAndDrop = (subject: string, target: string) => {
    Cypress.log({
      name: 'DRAGNDROP',
      message: `Dragging element ${subject} to ${target}`,
      consoleProps: () => {
        return {
          subject: subject,
          target: target,
        };
      },
    });
    const BUTTON_INDEX = 0;
    cy.get(subject).trigger('mousehover').trigger('mousedown', {
      button: BUTTON_INDEX,
      pageX: 0,
      pageY: 0,
    });
    cy.wait(2000)
      .get(target)
      .trigger('mousemove', {
        clientX: 0,
        clientY: 0,
      })
      .wait(2000)
      .trigger('mouseup');
  };

  it('Go to existing study grid view', () => {
    goToStudyConfigGrid();
  });

  describe('Dragging scenario', () => {
    it('drag visit inside same section scenario:', () => {
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasUpdate) {
          req.alias = req.body.operationName;
        }
      });
      const aliasUpdate = aliasing.reorderVisit.definitions[0].name.value;
      const currentVisitHeaderState: string[] = [];

      cy.wait(5000).then(() => {
        dragAndDrop(
          '[data-cy=header-visit-cell-drag-2].active',
          '[data-cy=header-visit-cell-drag-3].active',
        );
      });

      cy.wait([`@${aliasUpdate}`]).then((res) => {
        if (res) {
          cy.wait(2000).then(() => {
            const lastHeaderState = ['Screening', 'Visit 2', 'Visit', 'Exit'];
            cy.get('[data-cy=header-visit-cell].active .cell').each(($el, k) => {
              if (k < 3) {
                cy.wrap($el).contains(lastHeaderState[k]);
              }
            });
          });
        }
      });
    });

    it("drag visit outside it's section scenario:", () => {
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasUpdate) {
          req.alias = req.body.operationName;
        }
      });
      const aliasUpdate = aliasing.reorderVisit.definitions[0].name.value;
      const currentVisitHeaderState: string[] = [];

      cy.wait(5000).then(() => {
        dragAndDrop(
          '[data-cy=header-visit-cell-drag-2].active',
          '[data-cy=header-visit-cell-drag-3].active',
        );
      });

      cy.get('[data-cy=header-visit-cell].active .cell').each(($el) => {
        cy.wrap($el)
          .find('p')
          .eq(0)
          .each(($p) => {
            currentVisitHeaderState.push($p.text());
          });
      });

      cy.wait([`@${aliasUpdate}`]).then((res) => {
        if (res) {
          cy.wait(2000).then(() => {
            cy.get('[data-cy=header-visit-cell-drag-4].active').should(
              'not.contain.text',
              currentVisitHeaderState[1],
            );
          });
        }
      });
    });
  });
});
