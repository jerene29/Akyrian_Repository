import { mockUserDataAdmin } from '../../../src/constant/testFixtures';
import {
  GetVisitTemplateListDocument,
  IVisitTemplate,
  CreateFormDocument,
  IForm,
  CreateFormFieldGroupDocument,
  IFormField,
  IFormFieldGroup,
  IFormFieldType,
  UpdateFormFieldGroupDocument,
  UpdateFfgFormConnectionOrderDocument,
  GetFormFieldGroupDocument,
} from '../../../src/graphQL/generated/graphql';
import { d } from '../../helper';

describe.skip(
  'Study Config Question',
  {
    viewportHeight: 1200,
    viewportWidth: 1440,
  },
  () => {
    let lastId = 6;
    const aliasVisitTemplateList = GetVisitTemplateListDocument.definitions[0].name.value;
    const aliasCreateFormFieldGroupDocument =
      CreateFormFieldGroupDocument.definitions[0].name.value;
    const aliasUpdateFormFieldGroupDocument =
      UpdateFormFieldGroupDocument.definitions[0].name.value;
    const aliasUpdateFfgFormConnectionOrderDocument =
      UpdateFfgFormConnectionOrderDocument.definitions[0].name.value;
    const aliasGetFormFieldGroupDocument = GetFormFieldGroupDocument.definitions[0].name.value;
    const aliasCreateForm = CreateFormDocument.definitions[0].name.value;

    let visitTemplateList: IVisitTemplate[] = [];
    const newCreatedQuestion1: IFormFieldGroup = {} as IFormFieldGroup;
    const newCreatedQuestion2: IFormFieldGroup = {} as IFormFieldGroup;
    const newCreatedQuestion3: IFormFieldGroup = {} as IFormFieldGroup;
    let addedForm1: IForm = {} as IForm;

    const isMac = Cypress.platform === 'darwin';

    const questionGroups = [
      {
        shortQuestion: 'Q 1',
        question: 'Q 1',
        oid: 'Q_ONE',
        keyword: 'Q 1',
      },
      {
        shortQuestion: 'Q 2',
        question: 'Q 2',
        oid: 'Q_TWO',
        keyword: 'Q 2',
      },
    ];

    const questionFieldGroupA = [
      {
        shortQuestion: 'Q 3',
        question: 'Q 3',
        oid: 'Q_THREE',
        keyword: 'Q 3',
      },
      {
        shortQuestion: 'Q 4',
        question: 'Q 4',
        oid: 'Q_FOUR',
        keyword: 'Q 4',
      },
    ];

    const questionFieldGroupB = [
      {
        shortQuestion: 'Q 5',
        question: 'Q 5',
        oid: 'Q_FIVE',
        keyword: 'Q 5',
      },
      {
        shortQuestion: 'Q 6',
        question: 'Q 6',
        oid: 'Q_SIX',
        keyword: 'Q 6',
      },
    ];

    before(() => {
      cy.clearLocalStorage();
      cy.reseedDB();
      cy.fillInloginAsFormV2(mockUserDataAdmin, 'studyTestId1', 'study1revisionDev2e');
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasVisitTemplateList) {
          req.alias = req.body.operationName;
        }
      });
      cy.visit('/study/study1revisionDev2e');

      cy.wait(`@${aliasVisitTemplateList}`).then((result) => {
        if (result?.response?.statusCode === 200) {
          visitTemplateList = result.response.body.data.visitTemplateList;
          cy.waitForReact();
          cy.wait(3000);

          cy.get(`[data-cy=visit-template-${visitTemplateList[0].id}]`).click();
          cy.get(`[data-cy=add-form-button]`).click();
          cy.get('input[name="formName"]').type('form 1');
          cy.intercept('POST', '/graphql', (req) => {
            if (req.body.operationName === aliasCreateForm) {
              req.alias = req.body.operationName;
            }
          });

          cy.get('[data-cy=submit-create-form]').click();
          cy.wait(`@${aliasCreateForm}`).then((result) => {
            if (result?.response?.statusCode === 200) {
              addedForm1 = result?.response?.body.data.createForm;
              cy.get(`[data-cy=form-${addedForm1.id}]`).should('be.visible');
              questionGroups.map((q, index) => {
                const { shortQuestion, question, oid, keyword } = q;
                cy.get('[data-cy=right-menu-library-tab]').click();
                cy.dragAndDrop(
                  '[data-cy=stock-drag-0]',
                  '[data-cy=add-new-question-page]',
                  index * 200,
                );
                lastId += 2;
                cy.fillInQuestionDetails(
                  lastId,
                  { shortQuestion, question, oid, keyword },
                  IFormFieldType.FreeText,
                  'group',
                  true,
                );
                cy.saveCreateQuestion();
                cy.wait(2000);
              });

              questionFieldGroupA.map((q) => {
                const { shortQuestion, question, oid, keyword } = q;
                cy.get('[data-cy=right-menu-library-tab]').click();
                cy.dragAndDrop('[data-cy=stock-drag-0]', `[data-cy=field-question-canvas-8]`);
                lastId += 1;
                cy.fillInQuestionDetails(
                  lastId,
                  { shortQuestion, question, oid, keyword },
                  IFormFieldType.FreeText,
                  'field',
                  true,
                );
                cy.saveUpdateQuestion();
                cy.wait(2000);
              });

              questionFieldGroupB.map((q) => {
                const { shortQuestion, question, oid, keyword } = q;
                cy.get('[data-cy=right-menu-library-tab]').click();
                cy.dragAndDrop('[data-cy=stock-drag-0]', `[data-cy=field-question-canvas-12]`);
                lastId += 1;
                cy.fillInQuestionDetails(
                  lastId,
                  { shortQuestion, question, oid, keyword },
                  IFormFieldType.FreeText,
                  'field',
                  true,
                );
                cy.saveUpdateQuestion();
                cy.wait(2000);
              });
            }
          });
        }
      });
    });

    describe('CREATE NEW QUESTION WITH PARENT CHILD', () => {
      it('Drag single choice question to Question group should show editable question properties on right menu with parent and children for the questions list of answers', () => {
        cy.get('[data-cy=right-menu-library-tab]').click();

        cy.dragAndDrop('[data-cy=stock-drag-1]', '[data-cy=group-question-canvas-7]');
        lastId += 1;
        cy.get(`[data-cy=field-question-canvas-${lastId}]`).should('be.visible');
        cy.checkActiveQuestionFieldUI(`field-card-container-${lastId}`);
        cy.get('[data-cy=editable-children-prop]').should('be.visible');
      });

      it('Parent panel should not be displayed and on list of answers should show children that consist of Field, ﻿Question, Form and Visit', () => {
        cy.get('[data-cy=children-fields-1]').scrollIntoView().should('be.visible');
        cy.get('[data-cy=children-questions-1]').scrollIntoView().should('be.visible');
        cy.get('[data-cy=children-forms-1]').scrollIntoView().should('be.visible');
        cy.get('[data-cy=children-visits-1]').scrollIntoView().should('be.visible');

        cy.get('[data-cy=children-fields-2]').scrollIntoView().should('be.visible');
        cy.get('[data-cy=children-questions-2]').scrollIntoView().should('be.visible');
        cy.get('[data-cy=children-forms-2]').scrollIntoView().should('be.visible');
        cy.get('[data-cy=children-visits-2]').scrollIntoView().should('be.visible');
      });

      it('Clicking on Field children should show select menu, and field list should only consist of field inside the current group', () => {
        cy.get('[data-cy=question-attributes-children-fields-1]').check();
        cy.get('[data-cy=children-list-fields-1]').scrollIntoView().click();
        cy.get('.ant-select-item-option').should('have.length', 3);

        cy.get('.ant-select-item-option').then((res) => {
          expect(res[0]).text('Q 4');
          expect(res[1]).text('Q 3');
          expect(res[2]).text('Q 1');
        });
      });

      it('Choosing a field in a choice will make the chosen field will still be available on another choice', () => {
        cy.get('[data-cy=question-attributes-children-fields-1]').check();
        cy.get('[data-cy=children-list-fields-1]').scrollIntoView().click();
        cy.get('.ant-select-item-option').then((res) => {
          res[0].click();
        });

        cy.get('[data-cy=question-attributes-children-fields-2]').check();
        cy.get('[data-cy=children-list-fields-2]').scrollIntoView().click();
        cy.get('.children-list-fields-2 .ant-select-item-option').should('have.length', 3);
        cy.get('.children-list-fields-2 .ant-select-item-option').then((res) => {
          expect(res[0]).text('Q 4');
          expect(res[1]).text('Q 3');
          expect(res[2]).text('Q 1');
        });
      });

      it('Clicking on Question children checkmark should show select menu, check question list data and choose a question', () => {
        cy.get('[data-cy=question-attributes-children-questions-2]').check();
        cy.get('[data-cy=children-list-questions-2]').scrollIntoView().click();
        cy.get('.children-list-questions-2 .ant-select-item-option').should('have.length', 1);
        cy.get('.children-list-questions-2 .ant-select-item-option').then((res) => {
          expect(res[0]).text('[Group Name]');
          res[0].click();
        });
      });

      it('Clicking on Form checkmark should show select menu, check the form list data and select', () => {
        cy.get('[data-cy=right-menu-cancel-button]').click();

        cy.get(`[data-cy=add-form-button]`).click();
        cy.get('input[name="formName"]').type('Form 2');

        cy.intercept('POST', '/graphql', (req) => {
          if (req.body.operationName === aliasCreateForm) {
            req.alias = req.body.operationName;
          }
        });

        cy.get('[data-cy=submit-create-form]').click();
        cy.wait(`@${aliasCreateForm}`);
        cy.wait(5000);
        cy.get(`[data-cy=form-${addedForm1.id}]`).click();
        cy.wait(2000);
        cy.get(`[data-cy=arrow-collapse-question-7]`).click();
        cy.get('[data-cy=right-menu-library-tab]').click();
        cy.dragAndDrop('[data-cy=stock-drag-1]', '[data-cy=group-question-canvas-7]');

        cy.get('[data-cy=question-attributes-children-forms-1]').check();
        cy.get('[data-cy=children-list-forms-1]').scrollIntoView().click();
        cy.get('.children-list-forms-1 .ant-select-item-option').should('have.length', 2);
        cy.get('.children-list-forms-1 .ant-select-item-option').then((res) => {
          expect(res[0]).text('Consent Of Subject');
          expect(res[1]).text('Form 2');

          res[1].click();
        });

        cy.get('[data-cy=question-attributes-children-forms-2]').check();
        cy.get('[data-cy=children-list-forms-2]').scrollIntoView().click();
        cy.get('.children-list-forms-2 .ant-select-item-option').should('have.length', 2);
      });

      it('Clicking in Visit checkmark should show select menu, check the visit list data and choose a visit', () => {
        cy.get('[data-cy=question-attributes-children-visits-2]').check();
        cy.get('[data-cy=children-list-visits-2]').scrollIntoView().click();
        cy.get('.children-list-visits-2 .ant-select-item-option').should('have.length', 1);
        cy.get('.children-list-visits-2 .ant-select-item-option').then((res) => {
          expect(res[0]).text('Adhoc Visit');
          res[0].click();
        });

        cy.get('[data-cy=question-attributes-children-visits-1]').check();
        cy.get('[data-cy=children-list-visits-1]').scrollIntoView().click();
        cy.get('.children-list-visits-1 .ant-select-item-option').should('have.length', 1);
        cy.get('.children-list-visits-1 .ant-select-item-option').then((res) => {
          expect(res[0]).text('Adhoc Visit');
        });
      });

      it('Clicking save should send mutation to BE and show uneditable question properties', () => {
        cy.fillInQuestionDetails(
          lastId,
          { shortQuestion: 'Q 7', question: 'Q 7', oid: 'Q_SEVEN', keyword: 'Q 7' },
          IFormFieldType.SingleChoice,
          'field',
          true,
        );

        cy.get('[data-cy=question-attributes-children-fields-2]')
          .scrollIntoView()
          .check({ force: true });
        cy.get('[data-cy=children-list-fields-2]').scrollIntoView().click();
        cy.get('.children-list-fields-2 .ant-select-item-option').then((res) => {
          res[0].click();
        });

        cy.get('[data-cy=question-attributes-children-questions-2]')
          .scrollIntoView()
          .check({ force: true });
        cy.get('[data-cy=children-list-questions-2]').scrollIntoView().click();
        cy.get('.children-list-questions-2 .ant-select-item-option').then((res) => {
          res[0].click();
        });
        cy.saveUpdateQuestion();
      });

      it('On uneditable question properties should not show parent row and show children that was selected before', () => {
        cy.get(`[data-cy=child-Form2]`).should('be.visible');
        cy.get(`[data-cy=child-Q4]`).should('be.visible');
        cy.get(`[data-cy=child-AdhocVisit]`).should('be.visible');
        cy.get(`[data-cy=child-GroupName]`).should('be.visible');
      });

      it('Clicking on Question children should redirect (scroll into view) the children question', () => {
        cy.get(`[data-cy=child-GroupName]`).click();
        cy.wait(500);
        cy.get('[data-cy=field-question-canvas-13]').scrollIntoView().should('be.visible');
      });

      it('Clicking on Form children should redirect to the form', () => {
        cy.get(`[data-cy=child-Form2]`).click();
        cy.get('[data-cy=empty-question]').should('be.visible');
      });

      it('Clicking on Visit children should redirect to the visit', () => {
        cy.get(`[data-cy=form-${addedForm1.id}]`).click();
        cy.get('[data-cy=field-question-canvas-8]').click();
        cy.get(`[data-cy=child-AdhocVisit]`).should('be.visible').click();
        cy.get('[data-cy=visit-name]').should('have.text', 'Adhoc Visit');
      });
    });

    describe('PARENT ON QUESTION', () => {
      it('Find a question that has parent and on uneditable question properties should show the parent question', () => {
        cy.get('[data-cy=sidebar-toggle]').click();
        cy.get(`[data-cy=visit-template-${visitTemplateList[0].id}]`).click();
        cy.get(`[data-cy=form-${addedForm1.id}]`).click();
        cy.wait(2000);
        cy.get('[data-cy=short-question-top-12]').click();
        cy.get('[data-cy=parent-info-Q7]').should('be.visible');
      });

      it('Clicking on the parent question should redirect to the question', () => {
        cy.get('[data-cy=parent-info-Q7]').click();
        cy.wait(1000);
        cy.get('[data-cy=field-question-canvas-8]').should('be.visible');
        cy.checkActiveQuestionFieldUI(`field-card-container-8`);
      });
    });

    describe('PARENT ON STUDY SETTINGS MODAL - VISIT', () => {
      it('Visit list should show parent question if exist', () => {
        cy.get('[data-cy=study-settings-icon]').click();
        cy.get('[data-cy=menu-item-visit]').click();
        cy.get(`#parent-Q7`).should('be.visible');
      });

      it('Clicking on parent question should redirect to the question', () => {
        cy.get(`#parent-Q7`).then((res) => {
          res[0].click();
          cy.wait(3000);
          cy.get('[data-cy=field-question-canvas-8]').should('be.visible');
          cy.checkActiveQuestionFieldUI(`field-card-container-8`);
        });
      });
    });

    describe('PARENT ON STUDY SETTINGS MODAL - FORM', () => {
      it('Form list should show parent question if exist', () => {
        cy.get('[data-cy=study-settings-icon]').click();
        cy.get('[data-cy=menu-item-form]').click();
        cy.get(`#parent-Q7`).scrollIntoView().should('be.visible');
      });

      it('Clicking on parent question should redirect to the question', () => {
        cy.get(`#parent-Q7`).then((res) => {
          res[0].click();
          cy.wait(5000);

          cy.get('[data-cy=field-question-canvas-8]').should('be.visible');
          cy.checkActiveQuestionFieldUI(`field-card-container-8`);
        });
      });
    });

    describe('REORDERING FIELD WITH PARENT CHILD', () => {
      it('Move field with parent/child should also move the related parent or child to destination', () => {
        cy.dragAndDrop(
          '[data-cy=field-question-canvas-8]',
          `[data-cy=field-question-canvas-10]`,
          100,
        );
        cy.wait(3000);
        cy.get('[data-cy=short-question-top-9]').should('have.text', 'Q 7');
        cy.get('[data-cy=short-question-top-10]').should('have.text', 'Q 4');
      });
    });

    describe('TRANSFERRING FIELD WITH PARENT CHILD', () => {
      it('Dragging a field with parent/child to another group should show error notif and the dragged field should stay on the same group', () => {
        cy.get('[data-cy=arrow-collapse-question-12]').click();
        cy.dragAndDrop('[data-cy=field-question-canvas-10]', '[data-cy=group-question-canvas-12]');
        cy.get('[data-cy=error-alert]').should('be.visible');
      });
    });

    describe('MERGING A QUESTION THAT HAS PARENT', () => {
      it('Dragging a question group that has a parent should show error notif and the dragged question group should stay', () => {
        cy.dragAndDrop('[data-cy=group-question-canvas-12]', '[data-cy=field-question-canvas-10]');
        cy.get('[data-cy=error-alert]').should('be.visible');
      });
    });
  },
);
describe.skip(
  // Reference for this test runner: https://ikeguchiholdings.monday.com/boards/1959201049/pulses/3440382623
  'Question children pill text validation',
  {
    viewportHeight: 1200,
    viewportWidth: 1440,
  },
  () => {
    let lastId = 6;
    const aliasVisitTemplateList = GetVisitTemplateListDocument.definitions[0].name.value;
    const aliasCreateForm = CreateFormDocument.definitions[0].name.value;
    let visitTemplateList: IVisitTemplate[] = [];
    let addedForm1: IForm = {} as IForm;
    let parentQuestion = {} as IFormFieldGroup;
    let choiceAId = '';
    let choiceBId = '';
    const questionGroups = [
      {
        shortQuestion: 'Parent Q',
        question: 'Parent Q',
        oid: 'PARENT_Q',
        keyword: 'Parent Q',
      },
      { shortQuestion: 'Q-1', question: 'Q-1', oid: 'Q_ONE', keyword: 'Q-1' },
      { shortQuestion: 'Q-2', question: 'Q-2', oid: 'Q_TWO', keyword: 'Q-2' },
      { shortQuestion: 'Q-3', question: 'Q-3', oid: 'Q_THREE', keyword: 'Q-3' },
    ];

    before(() => {
      cy.clearLocalStorage();
      cy.reseedDB();
      cy.fillInloginAsFormV2(mockUserDataAdmin, 'studyTestId1', 'study1revisionDev2e');
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasVisitTemplateList) {
          req.alias = req.body.operationName;
        }
      });
      cy.visit('/study/study1revisionDev2e');

      cy.wait(`@${aliasVisitTemplateList}`).then((result) => {
        if (result?.response?.statusCode === 200) {
          visitTemplateList = result.response.body.data.visitTemplateList;
          cy.waitForReact();
          cy.wait(3000);

          cy.get(`[data-cy=visit-template-${visitTemplateList[0].id}]`).click();
          cy.get(`[data-cy=add-form-button]`).click();
          cy.get('input[name="formName"]').type('form 1');
          cy.intercept('POST', '/graphql', (req) => {
            if (req.body.operationName === aliasCreateForm) {
              req.alias = req.body.operationName;
            }
          });

          cy.get('[data-cy=submit-create-form]').click();
          cy.wait(`@${aliasCreateForm}`).then((result) => {
            if (result?.response?.statusCode === 200) {
              addedForm1 = result?.response?.body.data.createForm;
              cy.get(`[data-cy=form-${addedForm1.id}]`).should('be.visible');
              questionGroups.map((q, index) => {
                const { shortQuestion, question, oid, keyword } = q;
                cy.get('[data-cy=right-menu-library-tab]').click();
                cy.dragAndDrop(
                  index === 0 ? '[data-cy=stock-drag-1]' : '[data-cy=stock-drag-0]',
                  '[data-cy=add-new-question-page]',
                  index * 200,
                );
                lastId += 2;
                cy.fillInQuestionDetails(
                  lastId,
                  { shortQuestion, question, oid, keyword },
                  index === 0 ? IFormFieldType.SingleChoice : IFormFieldType.FreeText,
                  'group',
                  true,
                );
                cy.saveCreateQuestion().then((result) => {
                  parentQuestion = result?.response?.body.data.createFormFieldGroup[0];
                  choiceAId = parentQuestion.fields[0]?.choices[0].id;
                  choiceBId = parentQuestion.fields[0]?.choices[1].id;
                });
                cy.wait(2000);
              });
            }
          });
        }
      });
    });

    describe('Assign Parent-Child relation from Parent Q to Q-1, Q-2 & Q-3 & validate the question children pill text', () => {
      it('Assign Q-1 & Q-2 as Parent Q - Choice A children', () => {
        cy.get(d`field-card-container-8`).click();
        cy.get(d`right-menu-cancel-button`).click();
        cy.get(`[data-cy=question-attributes-children-questions-${choiceAId}]`).check();
        cy.get(`[data-cy=children-list-questions-${choiceAId}]`).scrollIntoView().click();
        cy.get(`.children-list-questions-${choiceAId} .ant-select-item-option`).then((res) => {
          expect(res[0]).text('Q-1');
          expect(res[1]).text('Q-2');
          expect(res[2]).text('Q-3');
          res[0].click();
          res[1].click();
        });
        cy.get(d`right-menu-save-button`).click();
        cy.isGone(d`right-menu-save-button`);
      });
      it('Assign Q-2 & Q-3 as Parent Q - Choice B children', () => {
        cy.get(d`right-menu-cancel-button`).click();
        cy.get(`[data-cy=question-attributes-children-questions-${choiceBId}]`).check();
        cy.get(`[data-cy=children-list-questions-${choiceBId}]`).scrollIntoView().click();
        cy.get(`.children-list-questions-${choiceBId} .ant-select-item-option`).then((res) => {
          expect(res[0]).text('Q-1');
          expect(res[1]).text('Q-2');
          expect(res[2]).text('Q-3');
          res[1].click();
          res[2].click();
        });
        cy.get(d`right-menu-save-button`).click();
        cy.isGone(d`right-menu-save-button`);
      });
      it('Refresh and check the question children pill wording is the short question and not the question ID for 3 times', () => {
        for (let i = 0; i < 3; i++) {
          cy.reload();
          cy.get(d`field-card-container-8`).click();
          cy.get(d`right-menu-cancel-button`).click();
          cy.get(
            `[data-cy=children-list-questions-${choiceAId}] > .ant-select-selector > .ant-select-selection-overflow > :nth-child(1) > .ant-select-selection-item > .ant-select-selection-item-content`,
          ).contains('Q-1');
          cy.get(
            `[data-cy=children-list-questions-${choiceAId}] > .ant-select-selector > .ant-select-selection-overflow > :nth-child(2) > .ant-select-selection-item > .ant-select-selection-item-content`,
          ).contains('Q-2');

          cy.get(
            `[data-cy=children-list-questions-${choiceBId}] > .ant-select-selector > .ant-select-selection-overflow > :nth-child(1) > .ant-select-selection-item > .ant-select-selection-item-content`,
          ).contains('Q-2');
          cy.get(
            `[data-cy=children-list-questions-${choiceBId}] > .ant-select-selector > .ant-select-selection-overflow > :nth-child(2) > .ant-select-selection-item > .ant-select-selection-item-content`,
          ).contains('Q-3');
        }
      });
    });
  },
);
