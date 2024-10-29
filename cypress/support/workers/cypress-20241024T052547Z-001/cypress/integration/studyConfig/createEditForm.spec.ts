import {
  GetVisitTemplateListDocument,
  IVisitTemplate,
  CreateFormDocument,
  UpdateFormDocument,
  IForm,
  GetFormListDocument,
  GetStudyRevisionListDocument,
} from '../../../src/graphQL/generated/graphql';
import Colors from '../../../src/constant/Colors';
import { mockUserDataAdmin } from '../../../src/constant/testFixtures';

describe('Create Edit Form', () => {
  const aliasVisitTemplateList = GetVisitTemplateListDocument.definitions[0].name.value;
  const aliasCreateForm = CreateFormDocument.definitions[0].name.value;
  const aliasUpdateForm = UpdateFormDocument.definitions[0].name.value;
  const aliasGetFormList = GetFormListDocument.definitions[0].name.value;
  const aliasGetStudyRevList = GetStudyRevisionListDocument.definitions[0].name.value;

  let visitTemplateList: IVisitTemplate[] = [];
  let formList: IForm[] = [];

  before(() => {
    cy.beforeSetup(mockUserDataAdmin);
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasVisitTemplateList) {
        req.alias = req.body.operationName;
      }
    });
    cy.visit('/study/study1revisionDev2e');
    cy.wait(`@${aliasVisitTemplateList}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        visitTemplateList = result.response.body.data.visitTemplateList;
      }
    });
    cy.waitForReact();
  });

  describe('Create Form', () => {
    it('Click addform button on sidebar, initial state should be empty input and grey submit button', () => {
      cy.get(`[data-cy=visit-template-${visitTemplateList[0].id}]`).click({ force: true });
      cy.get(`[data-cy=add-form-button]`).click();
      cy.get('input[name="formName"]').should('have.value', '');
      cy.get('[data-cy=submit-create-form]').should(
        'have.css',
        'background-color',
        Colors.secondary.pebbleGrey10,
      );
    });

    it('Checking when typing will change the char counting on the bottom of form name input, and submit button become blue', () => {
      const inputFormName = 'form';
      inputFormName.split('').map((formName, index) => {
        cy.get('input[name="formName"]').type(formName);
        cy.get(`[data-cy=input-instruction-form-name-input]`).should('contain', `${index + 1}/35`);
      });
      let colorSplit = Colors.primary.violetBlue100.split(',');
      colorSplit = colorSplit.splice(0, colorSplit.length - 1);
      cy.get('[data-cy=submit-create-form]').should(
        'have.css',
        'background-color',
        `${colorSplit.join(', ')})`,
      );
    });

    it('0 char will disable the submit button', () => {
      cy.get('input[name="formName"]').clear();
      cy.get('[data-cy=submit-create-form]').should(
        'have.css',
        'background-color',
        Colors.secondary.pebbleGrey10,
      );
    });

    it('Fill in form more than 35 char should prevent user to type', () => {
      const inputFormName = 'formnamemorethanthirtyfive-loremipsum';
      cy.wrap(inputFormName).then(() => {
        inputFormName.split('').map((formName, index) => {
          cy.get('input[name="formName"]').type(formName);
          if (index + 1 > 35) {
            cy.get(`[data-cy=input-instruction-form-name-input]`).should('contain', `35/35`);
          } else {
            cy.get(`[data-cy=input-instruction-form-name-input]`).should(
              'contain',
              `${index + 1}/35`,
            );
          }
        });
      });
    });

    it('Click submit will show loading on the button and on succeed will add newly added form to the left sidebar and right content will show "Let`s Add Some Questions"', () => {
      let addedForm: IForm = {} as IForm;
      cy.get('input[name="formName"]').clear();
      const inputFormName = 'form 4';
      cy.wrap(inputFormName).then(() => {
        cy.get('input[name="formName"]').type(inputFormName);
      });
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasCreateForm) {
          req.alias = req.body.operationName;
        }
      });

      cy.get('[data-cy=submit-create-form]').click();
      cy.get('[data-cy=button-loading]').should('be.visible');
      cy.wait(`@${aliasCreateForm}`).then((result) => {
        if (result?.response?.statusCode === 200) {
          addedForm = result?.response?.body.data.createForm;
          cy.wrap(addedForm).then(() => {
            cy.get(`[data-cy=form-${addedForm.id}]`).should('be.visible');
            cy.get('[data-cy=add-new-question-page]').should('be.visible');
            cy.get('[data-cy=right-side-bar]').should('be.visible');
          });
        }
      });
    });
  });
  describe('Update Form from Right menu', () => {
    it('On left sidebar, hover on form and click edit icon will show edit form on right menu inspect', () => {
      cy.openEditFormRightMenu(visitTemplateList[0].forms[0]);
    });

    it('Default form input should be pre filled, and check char count is correct or not, and submit button color is blue', () => {
      cy.checkFormDefaultPreFilled(visitTemplateList[0].forms[0]);
      cy.checkSubmitButtonActive('submit-create-form');
    });

    it('When submitting should update left side bar data', () => {
      cy.get('input[name=formName]').type(' edit');
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasUpdateForm) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=right-menu-save-button]').click();
      cy.wait(`@${aliasUpdateForm}`).then((result) => {
        if (result?.response?.statusCode === 200) {
          const updatedForm = result?.response?.body.data.updateForm;
          cy.wrap(updatedForm).then(() => {
            cy.get(`[data-cy=form-${updatedForm.id}]`).should('be.visible');
            cy.get(`[data-cy=form-name-${updatedForm.id}]`).should('contain', updatedForm.name);
          });
        }
      });
    });

    it('Editing form and cancel should cancel editing mode', () => {
      if (cy.get('.ant-tooltip')) {
        cy.get('.ant-tooltip').invoke('attr', 'style', 'display: none');
      }
      cy.openEditFormRightMenu(visitTemplateList[0].forms[0]);
      cy.get('[data-cy=right-menu-cancel-button]').click();
      cy.get('[data-cy=create-edit-form]').should('not.exist');
    });
  });
  describe('Update Form from Study Settings - Study Detail', () => {
    before(() => {
      cy.get('[data-cy=study-settings-icon]').click();
      cy.get('[data-cy=modal-study-settings]').should('be.visible');
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasGetFormList) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=menu-item-form]').click();
      cy.wait(`@${aliasGetFormList}`).then((result) => {
        if (result?.response?.statusCode === 200) {
          formList = result.response.body.data.formList;
        }
      });
    });

    let editedForm: IForm = {} as IForm;
    it('Click edit icon on first form should open edit page and input should be pre-filled, ﻿and check char count is correct or not, and submit button color is blue', () => {
      editedForm = formList[0];
      cy.wrap(editedForm).then(() => {
        cy.checkEditFormStudySettingsDefault(editedForm);
      });
    });

    it('Edit form and submit should redirect back to form list page and data should be updated', () => {
      cy.wrap(editedForm).then(() => {
        cy.checkEditFormStudySettingsAndSubmit(editedForm);
      });
    });

    it.skip('Edit form and cancel should redirect back to form and form list page should remain the same', () => {
      const selectedForm = formList[1];
      cy.wrap(selectedForm).then(() => {
        cy.checkEditFormStudySettingsAndCancel(selectedForm);
      });
    });
  });
  describe('Update Form from Study Settings - Study Landing', () => {
    before(() => {
      cy.clearLocalStorage();
      cy.visit('/');
      cy.fillInloginAsFormV2(mockUserDataAdmin);
      cy.get(`#active-study1revisionDev2e`).scrollIntoView().click();
      cy.get('[data-cy=icon-system-study-settings]').click();
      cy.get('[data-cy=modal-study-settings]').should('be.visible');
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasGetFormList) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=menu-item-form]').click();

      cy.wait(`@${aliasGetFormList}`).then((result) => {
        if (result?.response?.statusCode === 200) {
          formList = result.response.body.data.formList;
        }
      });
    });

    beforeEach(() => {
      cy.setLocalStorage('studyRevisionId', `study1revisionDev1a`);
    });

    afterEach(() => {
      cy.setLocalStorage('studyRevisionId', `study1revisionDev1a`);
    });

    let editedForm: IForm = {} as IForm;
    it('Click edit icon on first form should open edit page and input should be pre-filled, ﻿and check char count is correct or not, and submit button color is blue', () => {
      editedForm = formList[0];
      cy.wrap(editedForm).then(() => {
        cy.checkEditFormStudySettingsDefault(editedForm);
      });
    });

    it('Edit form and submit should redirect back to form list page and data should be updated', () => {
      cy.wrap(editedForm).then(() => {
        cy.checkEditFormStudySettingsAndSubmit(editedForm);
      });
    });

    it.skip('Edit form and cancel should redirect back to form and form list page should remain the same', () => {
      const selectedForm = formList[1];
      cy.wrap(selectedForm).then(() => {
        cy.checkEditFormStudySettingsAndCancel(selectedForm);
      });
    });
  });
});
