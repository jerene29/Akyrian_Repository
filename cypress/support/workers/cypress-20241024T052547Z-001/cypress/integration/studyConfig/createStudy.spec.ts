import {
  GetPatientListDocument,
  CreateStudyDocument,
} from '../../../src/graphQL/generated/graphql';

describe.skip('Test Create Study', () => {
  let secondInput = 0;
  const char101 =
    'KimiBHjeSpuzbqhnUggpCkQuofaNZpqglDIAhDGIyqzAKmEGJQXsdkoasdkaopsdksiuhvieurhJUIADHFCIVusdbvhjsbvuaisdg';
  const char20 = 'KimiBHjeSpuzbqhnUggp';
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

  let inputComponent: any = [];
  let previewRegex: any = [];
  let studyInstruction: any = [];
  let createStudyDataFixture: any;

  const aliasing = {
    getPatient: GetPatientListDocument as any,
    createStudy: CreateStudyDocument as any,
  };
  const alias = aliasing.getPatient.definitions[0].name.value;

  before(() => {
    cy.reseedDB();
    cy.fillInloginAsForm({
      email: 'admin@example.com',
    });
    cy.visit('/study');
    cy.fixture('studyConfig.json').then((value) => {
      createStudyDataFixture = value.createStudy;
    });
    cy.waitForReact();
  });

  beforeEach(() => {
    cy.restoreLocalStorageCache();
    inputComponent = [];
    previewRegex = [];
    studyInstruction = [];
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
    inputComponent = [];
    previewRegex = [];
    studyInstruction = [];
  });

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

  const handleDeleteComponent = async (length = 0) => {
    const actionDelete = () => {
      for (let i = 0; i < length - 1; i++) {
        cy.get('#icon-trash').click();
        previewRegex.pop();
      }
    };
    const emptyInput = () => {
      cy.get(`[data-cy=firstInput-${0}]`).type('{backspace}');
      cy.get(`[data-cy=secondInput-${0}]`).type('{backspace}');
      cy.get('input[name="patientStudyIdDescription"]').type(
        Array(length * length)
          .fill('{backspace}')
          .join(''),
        { force: true },
      );
      previewRegex.pop();
    };

    await Cypress.Promise.all([actionDelete(), emptyInput()]).catch((err) => {
      throw err;
    });
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

  it('Add New Study', () => {
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
        cy.react('Modal', {
          props: {
            id: 'modal-create-study',
            visible: false,
          },
        });
      }
    });
  });

  it('Delete Component', () => {
    const addData = 3;
    cy.visit('/study');
    cy.waitForReact();
    cy.defaultCreateStudy();
    handleAdd(addData);
    const createStudyData = {
      studyName: createStudyDataFixture.studyName,
      studyProtocol: createStudyDataFixture.studyProtocol,
      studyDescription: createStudyDataFixture.studyDescription,
      studyIdExample: 'MKR123',
      components: inputComponent,
    };
    cy.fillCreateStudy(createStudyData);
    cy.get('.preview-regex')
      .should('have.text', previewRegex.map((data: any) => data).join(''))
      .then(() => {
        handleDeleteComponent(addData);
      });
    cy.get('.preview-regex').should('have.text', '');
    cy.get('#btn-submit').should('be.disabled');
  });

  it('Combine Component', () => {
    const addData = 3;
    cy.visit('/study');
    cy.waitForReact();
    cy.defaultCreateStudy();
    handleAdd(addData, true, true);
    const createStudyData = {
      studyName: createStudyDataFixture.studyName,
      studyProtocol: createStudyDataFixture.studyProtocol,
      studyDescription: createStudyDataFixture.studyDescription,
      studyIdExample: 'MKR-MKR',
      components: inputComponent,
    };
    cy.fillCreateStudy(createStudyData);
    cy.get('.preview-regex').should('have.text', previewRegex.map((data: any) => data).join(''));
    cy.get('#btn-submit').should('be.enabled');
  });

  it('Value SecondInput Higher than FirstInput Component', () => {
    const addData = 3;
    secondInput = 2;
    cy.visit('/study');
    cy.waitForReact();
    cy.defaultCreateStudy();
    handleAdd(addData, true, true, true);
    const createStudyData = {
      studyName: createStudyDataFixture.studyName,
      studyProtocol: createStudyDataFixture.studyProtocol,
      studyDescription: createStudyDataFixture.studyDescription,
      studyIdExample: 'MKR-MKR',
      components: inputComponent,
    };
    cy.fillCreateStudy(createStudyData);
    cy.get('.custom-tooltip').each((ele, index) => {
      if (index !== 2) {
        cy.wrap(ele).should('have.text', 'Max range must be same or higher than min range');
      }
    });
    cy.get('#btn-submit').should('be.disabled');
  });

  it('Automatic regex', () => {
    const alias = aliasing.createStudy.definitions[0].name.value;
    const addData = 3;
    cy.visit('/study');
    cy.waitForReact();
    cy.defaultCreateStudy();
    handleAdd(addData, true, true, true);
    const createStudyData = {
      studyName: createStudyDataFixture.studyName,
      studyProtocol: createStudyDataFixture.studyProtocol,
      studyDescription: createStudyDataFixture.studyDescription,
      studyIdExample: 'MKR123',
      components: inputComponent,
    };
    cy.fillCreateStudy(createStudyData);
    cy.get('#automaticRegex > label > span ').should('be.visible').click();
    cy.get('#regex-component').should('not.exist');
    cy.get('#add-component').should('not.exist');
    cy.get('#output-preview').should('not.exist');
    cy.get('input[name="patientStudyIdDescription"]').should('not.exist');
    cy.get('#btn-submit').should('be.enabled');
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === alias) {
        req.alias = req.body.operationName;
      }
    });
    cy.get('#btn-submit').click();
    cy.wait(`@${alias}`).then((res) => {
      if (res) {
        cy.url().should(
          'include',
          `/study/${res.response?.body.data.createStudy.studyRevision.id}`,
        );
      }
    });
  });

  it('Validation max component regex', () => {
    const addData = 11;
    cy.visit('/study');
    cy.waitForReact();
    cy.defaultCreateStudy();
    cy.wrap(Array(addData).fill('example')).each((element, index) => {
      cy.get('#add-component').click();
    });
    cy.wait(2000);
    cy.get('[data-cy=regex-component]').should('have.length', addData - 1);
  });

  it('Max character 100 digit', () => {
    const descript = makeid(251, 'alphabet');
    const substrValue = char101.substring(0, char101.length - 1);
    const substrDesc = descript.substring(0, descript.length - 1);
    cy.visit('/study');
    cy.waitForReact();
    cy.defaultCreateStudy();
    cy.get('input[name="studyName"]').type(char101);
    cy.get('input[name="studyProtocol"]').type(char20);
    cy.get('textarea[name="studyDescription"]').type(descript);

    cy.get('input[name="studyName"]').should('have.value', substrValue);
    cy.get('input[name="studyProtocol"]').should('have.value', char20);
    cy.get('textarea[name="studyDescription"]').should('have.value', substrDesc);
  });

  it('Could we put a space or comma between the A-Z and 0-9', () => {
    cy.visit('/study');
    cy.waitForReact();
    cy.defaultCreateStudy();
    cy.wrap(Array(2).fill('example')).each((element, index) => {
      cy.get('#add-component')
        .click()
        .then(() => {
          cy.get(`.select-component-${index}`).type('{downarrow}${enter}');
          cy.get(`[data-cy=firstInput-${index}]`).type('3');
        });
    });
    cy.get('.preview-regex').contains(',');
  });

  it('Disable E character in number', () => {
    cy.visit('/study');
    cy.waitForReact();
    cy.defaultCreateStudy();
    cy.get(`.select-component-0`).type('${enter}');
    cy.get(`[data-cy=firstInput-0]`).type('eE').should('have.text', '');
  });

  it('Allow character \\ + [ | ?  ', () => {
    const addData = 3;
    secondInput = 3;
    cy.visit('/study');
    cy.waitForReact();
    cy.defaultCreateStudy();
    handleAdd(addData, true, true, false, '\\+[|?');
    const createStudyData = {
      studyName: createStudyDataFixture.studyName,
      studyProtocol: createStudyDataFixture.studyProtocol,
      studyDescription: createStudyDataFixture.studyDescription,
      studyIdExample: 'MKR\\+[|?MKR',
      components: inputComponent,
    };
    cy.fillCreateStudy(createStudyData);
    cy.get('#btn-submit').should('be.enabled');
  });

  it('Allow character / { } | ?  ', () => {
    const addData = 3;
    cy.visit('/study');
    cy.waitForReact();
    cy.defaultCreateStudy();
    handleAdd(addData, true, true, false, '/{}|=');
    const createStudyData = {
      studyName: createStudyDataFixture.studyName,
      studyProtocol: createStudyDataFixture.studyProtocol,
      studyDescription: createStudyDataFixture.studyDescription,
      studyIdExample: 'MKR/{}|=MKR',
      components: inputComponent,
    };
    cy.fillCreateStudy(createStudyData);
    cy.get('#btn-submit').should('be.enabled');
  });

  it('Allow character ( ) ]  ', () => {
    const addData = 3;
    cy.visit('/study');
    cy.waitForReact();
    cy.defaultCreateStudy();
    handleAdd(addData, true, true, false, '()]');
    const createStudyData = {
      studyName: createStudyDataFixture.studyName,
      studyProtocol: createStudyDataFixture.studyProtocol,
      studyDescription: createStudyDataFixture.studyDescription,
      studyIdExample: 'MKR()]MKR',
      components: inputComponent,
    };
    cy.fillCreateStudy(createStudyData);
    cy.get('#btn-submit').should('be.enabled');
  });

  it('Check confirmation modal exist', () => {
    cy.visit('/study');
    cy.waitForReact();
    cy.get('#create-study').click();
    cy.get('input[name="studyName"]').click().type(`MODERNA-21`);
    cy.get('.btn-cancel').click();
    cy.get(`[data-cy=confirmation-modal]`).should('be.visible');
    cy.get('[data-cy=confirmModal-cancelButton]').click();
    cy.get(`[data-cy=confirmation-modal]`).should('not.be.visible');
    cy.get('.btn-cancel').click();
    cy.get('[data-cy=confirmModal-confirmButton]').click();
    cy.get(`[data-cy=confirmation-modal]`).should('not.be.visible');
    cy.get('#modal-create-study').should('not.exist');
  });

  it('Check confirmation modal not exist', () => {
    cy.visit('/study');
    cy.waitForReact();
    cy.get('#create-study').click();
    cy.get('.btn-cancel').click();
    cy.get(`[data-cy=confirmation-modal]`).should('not.exist');
  });
});
