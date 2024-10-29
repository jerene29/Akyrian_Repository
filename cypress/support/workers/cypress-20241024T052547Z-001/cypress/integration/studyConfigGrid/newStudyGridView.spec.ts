import { getRelativeDayOffsetWording } from './helpers';

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
  const secondInput = 0;
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
  const aliasCreateBulk = aliasing.createBulkVisitTemplateAndForm.definitions[0].name.value;

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

  const testVisitsHeader = (visitTemplateList: IGetVisitTemplateListQuery) => {
    const relativeDayOffsetArray: Array<string> = visitTemplateList?.visitTemplateList.map(
      (v, k) => {
        let relativeDayOffset = v.dayOffset ?? 0;
        if (k > 0) {
          const dayOffsetPrev = visitTemplateList?.visitTemplateList[k - 1]?.dayOffset ?? 0;
          relativeDayOffset = (v.dayOffset ?? 0) - dayOffsetPrev;
        }
        return `(+${relativeDayOffset} ${getRelativeDayOffsetWording(relativeDayOffset)})`;
      },
    );

    cy.wrap(relativeDayOffsetArray).then(() => {
      cy.wait(2000)
        .get('[data-cy=header-visit-cell].active')
        .should('have.length', visitTemplateList.visitTemplateList.length)
        .each(($el, i) => {
          cy.wrap($el)
            .find('.cell p')
            .eq(0)
            .should('have.text', visitTemplateList.visitTemplateList[i].name);
          cy.wrap($el).find('.cell p').eq(1).should('have.text', relativeDayOffsetArray[i]);
        });
    });
  };

  const testFormsHeader = (formList: IGetFormListQuery) => {
    cy.wrap(formList).then(() => {
      formList.formList.forEach((v, k) => {
        cy.get('[data-cy=header-form-cell].active').contains(v.name);
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
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasCreateBulk) {
          req.alias = req.body.operationName;
        }
      });
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
      cy.wrap(addVisitConfigurationRandomInput).then(() => {
        cy.fillAddVisitConfiguration(addVisitConfigurationRandomInput);
        cy.get('[data-cy=submit-visit-config]').click();
        cy.waitForReact();
        cy.wait(3000).get('.modal-configure').should('not.exist');
      });

      cy.wait(`@${aliasCreateBulk}`).then((res) => {
        cy.wrap(res).then(() => {
          if (res) {
            cy.wait(2000);
            testVisitsHeader({
              visitTemplateList:
                res.response?.body?.data?.createBulkVisitTemplateAndForm?.visitTemplates ?? [],
              __typename: 'Query',
            });
            testFormsHeader({
              formList: res.response?.body?.data?.createBulkVisitTemplateAndForm?.forms ?? [],
              __typename: 'Query',
            });
          }
        });
      });
    });
  });

  describe('', () => {
    afterEach(() => {
      // cy.saveLocalStorageCache();
      Logout();
      Login();
    });

    it('Create New Study and add visits only', () => {
      createNewStudy();
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasCreateBulk) {
          req.alias = req.body.operationName;
        }
      });

      cy.waitForReact();
      cy.get('[data-cy=grid-view]').click();
      cy.waitForReact();
      cy.get('button.add-btn').should('exist').click();
      cy.get('[data-cy=add_visit]').should('exist').click();

      // Modal amount of visit / form input should appear
      cy.get('.modal-config-AddVisit').should('exist');
      cy.fillAddVisitOrFormNumber(getRandomInt(1, 5));

      // Modal add visit configuration should appear
      cy.wait(5000).get('.modal-config-visit').should('exist');
      const addVisitConfigurationRandomInput: IVisitTemplateCreateInput = {
        dayOffsetFromPreviousVisit: getRandomInt(1, 10),
        visitAfterWindow: getRandomInt(1, 10),
        visitBeforeWindow: getRandomInt(1, 10),
      };
      cy.fillAddVisitConfiguration(addVisitConfigurationRandomInput);
      cy.get('[data-cy=submit-visit-config]').click();

      cy.waitForReact();

      cy.wait(`@${aliasCreateBulk}`).then((res) => {
        cy.wrap(res).then(() => {
          if (res) {
            cy.wait(2000);
            testVisitsHeader({
              visitTemplateList:
                res.response?.body?.data?.createBulkVisitTemplateAndForm?.visitTemplates ?? [],
              __typename: 'Query',
            });
            testFormsHeader({
              formList: res.response?.body?.data?.createBulkVisitTemplateAndForm?.forms ?? [],
              __typename: 'Query',
            });
          }
        });
      });
    });

    it('Create New Study and add forms only', () => {
      createNewStudy();
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasCreateBulk) {
          req.alias = req.body.operationName;
        }
      });

      cy.waitForReact();
      cy.get('[data-cy=grid-view]').click();
      cy.waitForReact();
      cy.get('button.add-btn').should('exist').click();
      cy.get('[data-cy=add_form]').should('exist').click();

      // Modal amount of visit / form input should appear
      cy.get('.modal-config-AddVisit').should('exist');
      cy.fillAddVisitOrFormNumber(getRandomInt(1, 5));

      cy.wait(`@${aliasCreateBulk}`).then((res) => {
        cy.wrap(res).then(() => {
          if (res) {
            cy.wait(2000);
            testVisitsHeader({
              visitTemplateList:
                res.response?.body?.data?.createBulkVisitTemplateAndForm?.visitTemplates ?? [],
              __typename: 'Query',
            });
            testFormsHeader({
              formList: res.response?.body?.data?.createBulkVisitTemplateAndForm?.forms ?? [],
              __typename: 'Query',
            });
          }
        });
      });
    });

    it('Create New Study and add visit and then add forms', () => {
      createNewStudy();
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasCreateBulk) {
          req.alias = req.body.operationName;
        }
      });

      /**
       * Add visit only
       */
      cy.waitForReact();
      cy.get('[data-cy=grid-view]').click();
      cy.waitForReact();
      cy.get('button.add-btn').should('exist').click();
      cy.get('[data-cy=add_visit]').should('exist').click();

      // Modal amount of visit / form input should appear
      cy.get('.modal-config-AddVisit').should('exist');
      cy.fillAddVisitOrFormNumber(getRandomInt(1, 5));

      // Modal add visit configuration should appear
      cy.wait(5000).get('.modal-config-visit').should('exist');
      const addVisitConfigurationRandomInput: IVisitTemplateCreateInput = {
        dayOffsetFromPreviousVisit: getRandomInt(1, 10),
        visitAfterWindow: getRandomInt(1, 10),
        visitBeforeWindow: getRandomInt(1, 10),
      };
      cy.wrap(addVisitConfigurationRandomInput).then(() => {
        cy.fillAddVisitConfiguration(addVisitConfigurationRandomInput);
        cy.get('[data-cy=submit-visit-config]').click();
        cy.wait(1000);
        cy.get('button.add-btn').should('exist').click();
        cy.get('[data-cy=add_form]').should('exist').trigger('click');
        cy.get('.modal-config-AddVisit').should('exist');
        cy.fillAddVisitOrFormNumber(getRandomInt(1, 5));
      });

      cy.wait([`@${aliasCreateBulk}`, `@${aliasCreateBulk}`]).then((res) => {
        cy.wrap(res).then(() => {
          if (res) {
            cy.wait(2000);
            testVisitsHeader({
              visitTemplateList:
                res[0].response?.body?.data?.createBulkVisitTemplateAndForm?.visitTemplates ?? [],
              __typename: 'Query',
            });
            testFormsHeader({
              formList: res[1].response?.body?.data?.createBulkVisitTemplateAndForm?.forms ?? [],
              __typename: 'Query',
            });
          }
        });
      });
    });
  });
});
