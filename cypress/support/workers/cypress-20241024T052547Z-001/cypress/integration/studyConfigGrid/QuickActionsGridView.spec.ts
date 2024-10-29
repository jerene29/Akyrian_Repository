import { getRelativeDayOffsetWording } from './helpers';

import {
  GetPatientListDocument,
  GetVisitTemplateListDocument,
  GetFormListDocument,
  CreateStudyDocument,
  CreateBulkVisitTemplateAndFormDocument,
  IVisitTemplateCreateInput,
  DeleteVisitTemplateDocument,
  UpdateVisitTemplateDocument,
  UpdateFormDocument,
  DeleteFormGridDocument,
} from '../../../src/graphQL/generated/graphql';
import { VisitInputType } from '../../support/command/studyConfigGrid';

// TODO: make new GRIDVIEW TEST
xdescribe('Quick Actions', () => {
  let secondInput = 0;
  const aliasing = {
    getPatient: GetPatientListDocument as any,
    visitTemplateList: GetVisitTemplateListDocument,
    formList: GetFormListDocument,
    createStudy: CreateStudyDocument as any,
    createBulkVisitTemplateAndForm: CreateBulkVisitTemplateAndFormDocument,
    UpdateVisitTemplate: UpdateVisitTemplateDocument,
    removeVisitTemplate: DeleteVisitTemplateDocument,
    UpdateForm: UpdateFormDocument,
    deleteForm: DeleteFormGridDocument,
  };
  let inputComponent: any = [];
  let previewRegex: any = [];
  let studyInstruction: any = [];
  let createStudyDataFixture: any;
  let studyRevId: string = '';

  before(() => {
    cy.reseedDB();
    Login();
  });

  const makeid = (length = 0, type: any, fixedValue = '-') => {
    const result = [];
    const alphabeth = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    for (let i = 0; i < length; i++) {
      result.push(
        type === 'alphabet'
          ? alphabeth.charAt(Math.floor(Math.random() * alphabeth.length))
          : type === 'fixed'
          ? fixedValue
          : numbers.charAt(Math.floor(Math.random() * numbers.length)),
      );
    }
    return result.join('');
  };

  const pushInput = (addData: any, combine: any, fixed: any, numeric: any, specialChar = '') => {
    for (let i = 0; i < addData; i++) {
      inputComponent.push({
        firstInput: fixed && i === 1 ? (specialChar === '' ? '-' : specialChar) : '3',
        secondInput: combine && i === 1 ? undefined : secondInput !== 0 ? secondInput : '3',
      });
      if (fixed && i === 1) {
        studyInstruction.push(makeid(1, 'fixed', specialChar === '' ? '-' : specialChar));
      } else if (numeric && i === 1) {
        studyInstruction.push(makeid(addData, 'number'));
      } else {
        studyInstruction.push(makeid(addData, 'alphabet'));
      }
      previewRegex.push(
        fixed && i === 1
          ? '-'
          : Array(addData)
              .fill(combine && i === 1 ? '(A-Z0-9)\t' : numeric && i === 2 ? '(0-9)\t' : '(A-Z)\t')
              .join(''),
      );
    }
  };

  const handleComponent = (addData: any, combine: any, numeric: any) => {
    for (let i = 0; i < addData - 1; i++) {
      cy.get('#add-component').click();
      if (combine && i === 1) {
        cy.get(`.select-component-${i}`).type('{downarrow}{downarrow}{downarrow}${enter}');
      }
    }
    if (numeric) {
      cy.get(`.select-component-${addData - 1}`).type('{downarrow}{downarrow}${enter}');
    }
  };

  const handleAdd = async (
    addData: any,
    combine = false,
    fixed = false,
    numeric = false,
    specialChar = '',
  ) => {
    await Cypress.Promise.all([
      handleComponent(addData, combine, numeric),
      pushInput(addData, combine, fixed, numeric, specialChar),
    ]).catch((err) => {
      throw err;
    });
  };

  const getRandomInt = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const createNewStudy = (): void => {
    const alias = aliasing.createStudy.definitions[0].name.value;
    const addData = 3;
    cy.visit('/study');
    cy.waitForReact();
    cy.defaultCreateStudy();
    handleAdd(addData);
    const createStudyData = {
      studyName: createStudyDataFixture.studyName,
      studyProtocol: createStudyDataFixture.studyProtocol,
      studyDescription: createStudyDataFixture.studyDescription,
      studyIdExample: 'MKR'.repeat(3),
      components: inputComponent,
    };
    cy.fillCreateStudy(createStudyData);
    cy.get('.preview-regex').should('have.text', previewRegex.map((data: any) => data).join(''));
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === alias) {
        req.alias = req.body.operationName;
      }
    });
    cy.get('#btn-submit').click();
    cy.wait(`@${alias}`).then((res) => {
      if (res) {
        studyRevId = res.response?.body?.data?.createStudy?.studyRevision?.id ?? '';
        cy.get('#modal-create-study').should('not.exist');
      }
    });
  };

  const Login = () => {
    const alias = aliasing.getPatient.definitions[0].name.value;
    const loginAlias = 'loginAlias';
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === alias) {
        req.alias = req.body.operationName;
      }
    });
    cy.intercept('POST', '/api/auth/token?grantType=password', (req) => {
      req.alias = loginAlias;
    });
    cy.clearLocalStorage();
    cy.fillInloginAsFormV2({
      email: 'admin@example.com',
    });
    cy.waitForReact();
    cy.fixture('studyConfig.json').then((value) => {
      createStudyDataFixture = value.createStudy;
    });
  };

  const createVisitAndForm = () => {
    cy.get('button.add-btn').should('exist').click();
    cy.get('[data-cy=add_visit_form]').should('exist').click();
    cy.get('.pos-col-5.pos-row-4').realHover({ scrollBehavior: 'center', position: 'center' });
    cy.waitForReact();
    cy.get('.pos-col-5.pos-row-4').should('be.visible').click();
    cy.wait(3000).get('.modal-config-visit').should('exist');
    const addVisitConfigurationRandomInput: IVisitTemplateCreateInput = {
      dayOffsetFromPreviousVisit: getRandomInt(1, 10),
      visitAfterWindow: getRandomInt(1, 10),
      visitBeforeWindow: getRandomInt(1, 10),
    };
    cy.fillAddVisitConfiguration(addVisitConfigurationRandomInput);
    cy.get('[data-cy=submit-visit-config]').click();
    cy.waitForReact();
    cy.wait(3000).get('.modal-configure').should('not.exist');
  };

  const testChangedVisitsHeader = (num: number, params: VisitInputType) => {
    if (params.visitName) {
      cy.wait(3000)
        .get('[data-cy=header-visit-cell].active')
        .eq(num)
        .find('.cell')
        .find('p')
        .eq(0)
        .should('have.text', params.visitName);
    }

    if (params.dayOffsetFromPreviousVisit) {
      cy.wait(3000)
        .get('[data-cy=header-visit-cell].active')
        .eq(num)
        .find('.cell')
        .find('p')
        .eq(1)
        .should(
          'have.text',
          `(+${params.dayOffsetFromPreviousVisit} ${getRelativeDayOffsetWording(
            +params.dayOffsetFromPreviousVisit,
          )})`,
        );
    }
  };

  const testChangedFormHeader = (num: number, params: { name: string }) => {
    if (params.name) {
      cy.wait(3000).get('[data-cy=header-form-cell].active').contains(params.name);
    }
  };

  describe('Create New Study and create visit + form in grid view', () => {
    it('Create New Study', () => {
      createNewStudy();

      cy.waitForReact();
      cy.get('[data-cy=grid-view]').click();
      cy.waitForReact();
    });

    it('Create visit and form', { scrollBehavior: false }, () => {
      cy.get('button.add-btn').should('exist').click();
      cy.get('[data-cy=add_visit_form]').should('exist').click();
      cy.wait(5000);
      cy.get('.pos-col-5.pos-row-4').should('be.visible').trigger('click');

      cy.wait(5000).get('.modal-config-visit').should('exist');
      const addVisitConfigurationRandomInput: IVisitTemplateCreateInput = {
        dayOffsetFromPreviousVisit: getRandomInt(1, 10),
        visitAfterWindow: getRandomInt(1, 10),
        visitBeforeWindow: getRandomInt(1, 10),
      };
      cy.fillAddVisitConfiguration(addVisitConfigurationRandomInput);
      cy.get('[data-cy=submit-visit-config]').click();
      cy.waitForReact();
      cy.wait(3000).get('.modal-configure').should('not.exist');
    });
  });

  describe('Edit Visit Detail', () => {
    it('Edit visit detail', () => {
      const aliasUpdate = aliasing.UpdateVisitTemplate.definitions[0].name.value;

      const selectVisitNum = 1;
      cy.get('[data-cy=header-visit-cell]')
        .eq(selectVisitNum - 1)
        .realHover({ scrollBehavior: 'center', position: 'left' })
        .get('[data-cy=header-visit-cell]')
        .eq(selectVisitNum)
        .find('.cell')
        .trigger('click')
        .wait(3000)
        .get('.quick-actions-container.show')
        .should('exist')
        .get('.quickactions_edit_visit')
        .realClick({ position: 'center' });

      let addVisitConfigurationRandomInput: VisitInputType = {
        visitName: '',
        dayOffsetFromPreviousVisit: '',
        visitAfterWindow: '',
        visitBeforeWindow: '',
      };
      cy.fillEditVisitConfiguration(addVisitConfigurationRandomInput);
      cy.get('[data-cy=submit-visit-config]').should('be.disabled');

      addVisitConfigurationRandomInput = {
        visitName: `Edit ${getRandomInt(0, 100)}`,
        dayOffsetFromPreviousVisit: getRandomInt(1, 10),
        visitAfterWindow: getRandomInt(1, 10),
        visitBeforeWindow: getRandomInt(1, 10),
      };
      cy.fillEditVisitConfiguration(addVisitConfigurationRandomInput);
      cy.get('[data-cy=submit-visit-config]').should('not.be.disabled');
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasUpdate) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=submit-visit-config]').click();

      cy.wait([`@${aliasUpdate}`]).then((res) => {
        if (res) {
          cy.reload();
          cy.wait(5000);
          cy.get('[data-cy=grid-view]').click();
          testChangedVisitsHeader(selectVisitNum, addVisitConfigurationRandomInput);
        }
      });
    });
  });

  describe('Rename Visit', () => {
    it('Rename visit title', () => {
      const aliasUpdate = aliasing.UpdateVisitTemplate.definitions[0].name.value;

      const selectVisitNum = 1;
      cy.get('[data-cy=header-visit-cell]')
        .eq(selectVisitNum - 1)
        .realHover({ scrollBehavior: 'center', position: 'left' })
        .get('[data-cy=header-visit-cell]')
        .eq(selectVisitNum)
        .find('.cell')
        .trigger('click')
        .wait(3000)
        .get('.quick-actions-container.show')
        .should('exist')
        .get('.quickactions_rename')
        .realClick({ position: 'center' });

      let addVisitConfigurationRandomInput: VisitInputType = {
        visitName: '',
      };
      cy.fillEditVisitConfiguration(addVisitConfigurationRandomInput);
      cy.get('[data-cy=submit-visit-config]').should('be.disabled');

      addVisitConfigurationRandomInput = {
        visitName: `Edit ${getRandomInt(0, 100)}`,
      };
      cy.fillEditVisitConfiguration(addVisitConfigurationRandomInput);
      cy.get('[data-cy=submit-visit-config]').should('not.be.disabled');
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasUpdate) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=submit-visit-config]').click();

      cy.wait([`@${aliasUpdate}`]).then((res) => {
        if (res) {
          cy.reload();
          cy.wait(5000);
          cy.get('[data-cy=grid-view]').click();
          testChangedVisitsHeader(selectVisitNum, addVisitConfigurationRandomInput);
        }
      });
    });
  });

  describe('Remove Visit', () => {
    it('Delete visit', () => {
      const aliasDelete = aliasing.removeVisitTemplate.definitions[0].name.value;
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasDelete) {
          req.alias = req.body.operationName;
        }
      });

      const selectVisitNum = 1;
      const visitTitleText = cy
        .get('[data-cy=header-visit-cell]')
        .eq(selectVisitNum)
        .find('.cell p')
        .eq(0)
        .invoke('text');

      cy.get('[data-cy=header-visit-cell]')
        .eq(selectVisitNum - 1)
        .realHover({ scrollBehavior: 'center', position: 'left' })
        .get('[data-cy=header-visit-cell]')
        .eq(selectVisitNum)
        .find('.cell')
        .trigger('click')
        .wait(3000)
        .get('.quick-actions-container.show')
        .should('exist')
        .get('.quickactions_delete')
        .realClick({ position: 'center' });

      cy.waitForReact();
      cy.get('.gridview-confirm')
        .should('exist')
        .get('[data-cy=confirmModal-confirmButton]')
        .click();

      cy.wait([`@${aliasDelete}`]).then((res) => {
        if (res) {
          cy.get('[data-cy=header-visit-cell].active')
            .eq(selectVisitNum)
            .find('.cell p')
            .eq(0)
            .should('not.have.text', visitTitleText);
        }
      });
    });
  });

  describe('Edit Form', () => {
    it('Edit form detail', () => {
      const editName = `Edit ${getRandomInt(0, 100)}`;

      cy.get('.gridview')
        .find('.gridview-row')
        .each(($el, idx) => {
          if (idx > 0) {
            const random_checkbox = $el.find('.checkbox-cells.selected').length - 1;
            if (random_checkbox > 0) {
              cy.get('.gridview')
                .find('.head')
                .eq(0)
                .realHover({ scrollBehavior: 'center', position: 'left' });
              console.log('random_checkbox', random_checkbox, idx);
              cy.wait(5000).wrap($el).find('.checkbox-cells.selected').eq(0).click();
            }
          }
        });

      const selectFormNum = 1;
      cy.get('.gridview')
        .find('.head')
        .eq(0)
        .realHover({ scrollBehavior: 'center', position: 'left' });

      cy.wait(5000)
        .get('[data-cy=header-form-cell]')
        .eq(selectFormNum)
        .find('.cell')
        .find('p')
        .click();

      cy.wait(3000).get('.quick-actions-container.show').should('exist');

      cy.get('.quickactions_edit_visit').realClick({ position: 'center' });

      cy.wait(1000).get('[data-cy=form-name-input]').clear().type(editName);

      cy.get('[data-cy=right-menu-save-button]').click();
      cy.wait(3000).get('[data-cy=grid-view]').click();

      testChangedFormHeader(selectFormNum, { name: editName });
    });
  });

  describe('Rename Form', () => {
    it('Rename form title', () => {
      const aliasUpdate = aliasing.UpdateForm.definitions[0].name.value;

      const selectVisitNum = 1;
      cy.get('[data-cy=header-form-cell]')
        .eq(selectVisitNum - 1)
        .realHover({ scrollBehavior: 'center', position: 'left' });

      cy.get('[data-cy=header-form-cell]')
        .eq(selectVisitNum)
        .find('.cell')
        .find('p')
        .eq(0)
        .click()
        .wait(3000);
      cy.get('.quick-actions-container.show').should('exist');
      cy.get('.quickactions_rename').realClick({ position: 'center' });

      cy.get('[data-cy=visit-name]').clear();
      cy.get('[data-cy=submit-visit-config]').should('be.disabled');

      const formName = `Edit ${getRandomInt(0, 100)}`;
      cy.get('[data-cy=visit-name]').type(formName);
      cy.get('[data-cy=submit-visit-config]').should('not.be.disabled');
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasUpdate) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=submit-visit-config]').click();

      cy.wait([`@${aliasUpdate}`]).then((res) => {
        if (res) {
          // cy.reload();
          // cy.get('[data-cy=grid-view]').click();
          testChangedFormHeader(selectVisitNum, { name: formName });
        }
      });
    });
  });

  // Untested, waiting for BE
  describe('Remove Form', () => {
    it('Remove Form', () => {
      const aliasDelete = aliasing.deleteForm.definitions[0].name.value;
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasDelete) {
          req.alias = req.body.operationName;
        }
      });

      const selectVisitNum = 1;
      cy.get('[data-cy=header-form-cell]')
        .eq(selectVisitNum - 1)
        .realHover({ scrollBehavior: 'center', position: 'left' });

      const formTitleText = cy
        .get('[data-cy=header-form-cell]')
        .eq(selectVisitNum)
        .find('.cell p')
        .eq(0)
        .invoke('text');

      cy.get('[data-cy=header-form-cell]')
        .eq(selectVisitNum)
        .realClick({ position: 'center' })
        .wait(3000);
      cy.get('.quick-actions-container.show').should('exist');
      cy.get('.quickactions_delete').realClick({ position: 'center' });

      cy.waitForReact();
      cy.get('.gridview-confirm')
        .should('exist')
        .get('[data-cy=confirmModal-confirmButton]')
        .click();

      cy.wait([`@${aliasDelete}`]).then((res) => {
        if (res) {
          cy.get('[data-cy=header-form-cell].active')
            .find('.cell p')
            .should('not.have.text', formTitleText);
        }
      });
    });
  });

  describe('Rename Visit by Double Clicking', () => {
    it('Rename visit title', () => {
      const aliasUpdate = aliasing.UpdateVisitTemplate.definitions[0].name.value;
      let addVisitConfigurationRandomInput: VisitInputType = {
        visitName: '',
      };

      const selectVisitNum = 1;
      cy.wrap([selectVisitNum, addVisitConfigurationRandomInput]).then(() => {
        cy.get('[data-cy=header-visit-cell]')
          .eq(selectVisitNum)
          .realHover({ scrollBehavior: 'center', position: 'left' })
          .get('[data-cy=header-visit-cell]')
          .eq(selectVisitNum)
          .find('.cell')
          .wait(2000)
          .dblclick()
          .wait(2000)
          .fillEditVisitConfiguration(addVisitConfigurationRandomInput);

        cy.wait(2000).get('[data-cy=submit-visit-config]').should('be.disabled');

        addVisitConfigurationRandomInput = {
          visitName: `Edit ${getRandomInt(0, 100)}`,
        };
        cy.fillEditVisitConfiguration(addVisitConfigurationRandomInput);
        cy.get('[data-cy=submit-visit-config]').should('not.be.disabled');
        cy.intercept('POST', '/graphql', (req) => {
          if (req.body.operationName === aliasUpdate) {
            req.alias = req.body.operationName;
          }
        });
        cy.get('[data-cy=submit-visit-config]').click();

        cy.wait([`@${aliasUpdate}`]).then((res) => {
          if (res) {
            // cy.reload();
            // cy.get('[data-cy=grid-view]').click();
            testChangedVisitsHeader(selectVisitNum, addVisitConfigurationRandomInput);
          }
        });
      });
    });
  });

  describe('Rename Form by Double Clicking', () => {
    it('Rename form title', () => {
      const aliasUpdate = aliasing.UpdateForm.definitions[0].name.value;

      const selectVisitNum = 1;
      cy.get('[data-cy=header-form-cell]')
        .eq(selectVisitNum - 1)
        .realHover({ scrollBehavior: 'center', position: 'left' });

      cy.get('[data-cy=header-form-cell]')
        .eq(selectVisitNum)
        .find('.cell')
        .find('p')
        .eq(0)
        .dblclick()
        .wait(3000);

      cy.get('[data-cy=visit-name]').clear();
      cy.get('[data-cy=submit-visit-config]').should('be.disabled');

      const formName = `Edit ${getRandomInt(0, 100)}`;
      cy.get('[data-cy=visit-name]').type(formName);
      cy.get('[data-cy=submit-visit-config]').should('not.be.disabled');
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasUpdate) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=submit-visit-config]').click();

      cy.wait([`@${aliasUpdate}`]).then((res) => {
        if (res) {
          // cy.reload();
          // cy.get('[data-cy=grid-view]').click();
          testChangedFormHeader(selectVisitNum, { name: formName });
        }
      });
    });
  });
});
