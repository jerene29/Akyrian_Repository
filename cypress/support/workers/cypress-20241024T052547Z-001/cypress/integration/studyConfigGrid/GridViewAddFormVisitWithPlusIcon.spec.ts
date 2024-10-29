import {
  GetPatientListDocument,
  GetVisitTemplateListDocument,
  IGetVisitTemplateListQuery,
  GetFormListDocument,
  IGetFormListQuery,
  CreateStudyDocument,
  IVisitTemplateCreateInput,
  CreateBulkVisitTemplateAndFormDocument,
} from '../../../src/graphQL/generated/graphql';

// TODO: make new GRIDVIEW TEST
xdescribe('Create New Study', () => {
  let secondInput = 0;
  const aliasing = {
    getPatient: GetPatientListDocument as any,
    visitTemplateList: GetVisitTemplateListDocument,
    formList: GetFormListDocument,
    createStudy: CreateStudyDocument as any,
    createBulkVisitTemplateAndForm: CreateBulkVisitTemplateAndFormDocument,
  };
  let inputComponent: any = [];
  let previewRegex: any = [];
  let studyInstruction: any = [];
  let createStudyDataFixture: any;

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
        cy.get('#modal-create-study').should('not.exist');
      }
    });
  };

  const getRandomInt = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const testFormsHeader = (newTotalForm: number) => {
    cy.log('--- Check if forms has increased by one ---');
    cy.get('[data-cy=header-form-cell].active').should('have.length', newTotalForm + 1);
  };

  const testVisitsHeader = (newTotalVisit: number, selectHoverNum: number, dayOffset: number) => {
    cy.log('--- Check if visits has increased by one ---');
    cy.get('[data-cy=header-visit-cell].active').should('have.length', newTotalVisit + 1);
    cy.log('--- Check if visit added right next to the hovered/selected visit ---');
    cy.get('[data-cy=header-visit-cell]')
      .eq(selectHoverNum + 1)
      .contains(`(+${dayOffset} ${dayOffset <= 1 ? 'day' : 'days'})`);
  };

  const Login = () => {
    const alias = aliasing.getPatient.definitions[0].name.value;
    const loginAlias = 'login';
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === loginAlias) {
        req.alias = req.body.operationName;
      }
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

  const Logout = () => {
    cy.get('[data-cy=header-user-avatar]').eq(0).click().get('[data-cy=logout-text]').click();
  };

  before(() => {
    cy.reseedDB();
    Login();
  });

  beforeEach(() => {
    cy.restoreLocalStorageCache();
    inputComponent = [];
    previewRegex = [];
    studyInstruction = [];
  });

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

  describe('', () => {
    before(() => {
      Logout();
      Login();
    });

    afterEach(() => {
      // cy.saveLocalStorageCache();
      Logout();
      Login();
    });

    it('Add Form By Clicking The "+" Icon', () => {
      const aliasCreateBulk = aliasing.createBulkVisitTemplateAndForm.definitions[0].name.value;
      let lastTotalForm = 0;
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasCreateBulk) {
          req.alias = req.body.operationName;
        }
      });

      cy.get('.btn-lists-search ~ div .study-config-card')
        .last()
        .click()
        .wait(2000)
        .get('[data-cy=btn-edit-study]')
        .click()
        .wait(2000)
        .get('[data-cy=grid-view]')
        .click();

      // Hover and click on the (+) icon
      cy.log('Hover and click on the (+) icon');
      const selectHoverNum = 1;
      cy.wait(2000)
        .get('[data-cy=header-form-cell]')
        .eq(selectHoverNum - 1)
        .realHover({ scrollBehavior: 'center', position: 'left' });

      cy.get('[data-cy=header-form-cell].active').then(($el) => (lastTotalForm = $el.length));

      cy.wait(2000)
        .get('[data-cy=header-form-cell].active')
        .eq(selectHoverNum)
        .realHover()
        .find('.add-after')
        .should('be.visible')
        .click({ force: true });

      cy.wait(`@${aliasCreateBulk}`).then((res) => {
        if (res) {
          cy.wait(2000);
          testFormsHeader(lastTotalForm);
        }
      });
    });

    it('Add Visit By Clicking The "+" Icon', () => {
      let lastTotalVisit = 0;

      cy.get('.btn-lists-search ~ div .study-config-card')
        .last()
        .click()
        .wait(2000)
        .get('[data-cy=btn-edit-study]')
        .click()
        .wait(2000)
        .get('[data-cy=grid-view]')
        .click();

      // Hover and click on the (+) icon
      cy.log('Hover and click on the (+) icon');
      const selectHoverNum = 1;
      cy.get('[data-cy=header-visit-cell]')
        .eq(selectHoverNum - 1)
        .realHover({ scrollBehavior: 'center', position: 'left' });

      cy.get('[data-cy=header-visit-cell].active').then(($el) => (lastTotalVisit = $el.length));

      cy.wait(2000)
        .get('[data-cy=header-visit-cell].active')
        .eq(selectHoverNum)
        .realHover()
        .find('.add-after')
        .should('be.visible')
        .click({ force: true })
        .then(() => {
          // cy.waitForReact();
          // inputVisitTemplate();
        });

      const addVisitConfigurationRandomInput: IVisitTemplateCreateInput = {
        dayOffsetFromPreviousVisit: getRandomInt(1, 10),
        visitAfterWindow: getRandomInt(1, 10),
        visitBeforeWindow: getRandomInt(1, 10),
      };
      cy.get('[data-cy=dayOffsetFromPreviousVisit]')
        .should('not.be.disabled')
        .type(`${addVisitConfigurationRandomInput.dayOffsetFromPreviousVisit}`, { force: true });
      cy.get('[data-cy=dayOffsetFromPreviousVisit]')
        .should('not.be.disabled')
        .type(`${addVisitConfigurationRandomInput.dayOffsetFromPreviousVisit}`);
      cy.get('[data-cy=visitBeforeWindow]')
        .should('not.be.disabled')
        .type(`${addVisitConfigurationRandomInput.visitBeforeWindow}`);
      cy.get('[data-cy=visitAfterWindow]')
        .should('not.be.disabled')
        .type(`${addVisitConfigurationRandomInput.visitAfterWindow}`);

      cy.get('[data-cy=submit-visit-config]').click();
      cy.waitForReact();
      cy.get('.modal-configure').should('not.exist');

      cy.wait(2000)
        .reload()
        .get('[data-cy=grid-view]')
        .click()
        .then(() => {
          // TODO: figure out how to properly test header after adjustment made.
          // testVisitsHeader(lastTotalVisit, selectHoverNum, addVisitConfigurationRandomInput.dayOffsetFromPreviousVisit)
        });
    });
  });
});
