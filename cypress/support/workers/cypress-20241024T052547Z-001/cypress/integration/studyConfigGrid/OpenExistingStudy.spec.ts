import { getRelativeDayOffsetWording } from './helpers';

import {
  GetPatientListDocument,
  GetVisitTemplateListDocument,
  IGetVisitTemplateListQuery,
  GetFormListDocument,
  IGetFormListQuery,
  IVisitTemplateType,
} from '../../../src/graphQL/generated/graphql';

// TODO: make new GRIDVIEW TEST
xdescribe('Open Existing Study', () => {
  const aliasing = {
    getPatient: GetPatientListDocument as any,
    visitTemplateList: GetVisitTemplateListDocument,
    formList: GetFormListDocument,
  };
  let createStudyDataFixture: any;

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

  const getRandomInt = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const testVisitsHeader = (visitTemplateList: IGetVisitTemplateListQuery) => {
    const relativeDayOffsetArray: Array<string> = visitTemplateList?.visitTemplateList.map(
      (v, k) => {
        if (v.type !== IVisitTemplateType.Scheduled) {
          return '';
        }
        let relativeDayOffset = v.dayOffset ?? 0;
        if (k > 0) {
          const dayOffsetPrev = visitTemplateList?.visitTemplateList[k - 1]?.dayOffset ?? 0;
          relativeDayOffset = (v.dayOffset ?? 0) - dayOffsetPrev;
        }
        return `(+${relativeDayOffset} ${getRelativeDayOffsetWording(relativeDayOffset)})`;
      },
    );

    cy.get('[data-cy=header-visit-cell].active')
      .should('have.length', visitTemplateList.visitTemplateList.length)
      .each(($el, i) => {
        cy.wrap($el)
          .find('.cell p')
          .eq(0)
          .should('have.text', visitTemplateList.visitTemplateList[i].name);
        cy.wrap($el).find('.cell p').eq(1).should('have.text', relativeDayOffsetArray[i]);
      });
  };

  const testFormsHeader = (formList: IGetFormListQuery) => {
    formList.formList.forEach((v, k) => {
      cy.get('[data-cy=header-form-cell].active').contains(v.name);
    });
  };

  const testCheckedCells = (
    visitTemplateList: IGetVisitTemplateListQuery,
    formList: IGetFormListQuery,
  ) => {
    const formList2 = formList?.formList ?? [];

    const checkedCells: Array<{ col: string; row: string }> =
      visitTemplateList?.visitTemplateList
        .map((visit, kvisit) => {
          const checkedCellsPerVisit = visit.forms.map((form, kform) => ({
            col: `pos-col-${1 + kvisit}`,
            row: `pos-row-${1 + formList2.findIndex((v) => v.id === form.id)}`,
          }));
          return checkedCellsPerVisit;
        })
        .flat(1) ?? [];

    cy.get('.checkbox-cells.selected').each(($el, i) => {
      const shouldExists = checkedCells.filter(
        (checkedCell) => $el.hasClass(checkedCell.col) && $el.hasClass(checkedCell.row),
      );
      if (shouldExists.length > 0) {
        cy.wrap($el).find('svg').should('exist');
      } else {
        cy.wrap($el).find('svg').should('not.exist');
      }
    });
  };

  const removeAFormFromAnyVisit = (
    visitTemplateList: IGetVisitTemplateListQuery,
    formList: IGetFormListQuery,
  ) => {
    const numberOfVisit = visitTemplateList.visitTemplateList.length;
    const numberOfFormList = formList.formList.length + 1;
    cy.get(
      `.table-cont > div > div:nth-child(${getRandomInt(2, numberOfFormList)}) > div > div`,
    ).each(($el, i) => {
      if (i < 1 || i > numberOfVisit) return;
      cy.wait(1000);

      cy.wrap($el)
        .find('.cell button')
        .eq(0)
        .then(($btn) => {
          if ($btn.find('svg').length === 1) {
            $btn.trigger('click');
          }
        });
    });
  };

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
    cy.saveLocalStorage();
    cy.waitForReact();
    cy.fixture('studyConfig.json').then((value) => {
      createStudyDataFixture = value.createStudy;
    });
  };

  before(() => {
    cy.reseedDB();
    Login();
  });

  it('Test load data to grid view', () => {
    const aliasVisit = aliasing.visitTemplateList.definitions[0].name.value;
    const aliasForms = aliasing.formList.definitions[0].name.value;
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasVisit) {
        req.alias = req.body.operationName;
      }
    });
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasForms) {
        req.alias = req.body.operationName;
      }
    });
    goToStudyConfigGrid();

    cy.wait([`@${aliasVisit}`, `@${aliasForms}`]).then((res) => {
      if (res[0] && res[1]) {
        cy.waitForReact();
        testVisitsHeader(res[0].response?.body.data);
        testFormsHeader(res[1].response?.body.data);
        testCheckedCells(res[0].response?.body.data, res[1].response?.body.data);
      }
    });
  });

  it('Check "Add Visit + Form" option should gone', () => {
    cy.wait(3000).get('.add-btn').click();
    cy.wait(3000).get('button[data-cy=add_visit_form]').should('not.exist');
  });

  it('Test move to detail view validation if a form is not linked in any visit', () => {
    const aliasVisit = aliasing.visitTemplateList.definitions[0].name.value;
    const aliasForms = aliasing.formList.definitions[0].name.value;
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasVisit) {
        req.alias = req.body.operationName;
      }
    });
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasForms) {
        req.alias = req.body.operationName;
      }
    });

    cy.reload();
    cy.wait(5000);
    cy.get('[data-cy=grid-view]').click();
    cy.waitForReact();
    cy.wait([`@${aliasVisit}`, `@${aliasForms}`]).then((res) => {
      if (res[0] && res[1]) {
        cy.wait(2000);
        removeAFormFromAnyVisit(res[0].response?.body.data, res[1].response?.body.data);
      }
    });

    cy.waitForReact();
    cy.get('[data-cy=detail-view]').click();
    cy.wait(3000);
    cy.get('.modal-configure').should('exist').contains('Confirm').click();
  });
});
