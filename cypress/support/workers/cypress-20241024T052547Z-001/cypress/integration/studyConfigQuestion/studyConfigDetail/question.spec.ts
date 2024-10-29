import {
  GetVisitTemplateListDocument,
  IVisitTemplate,
  CreateFormDocument,
  IForm,
  IFormField,
  IFormFieldGroup,
  IFormFieldType,
  UpdateFfgFormConnectionOrderDocument,
  GetFormFieldGroupDocument,
} from '../../../../src/graphQL/generated/graphql';

describe.skip(
  'Study Config Question',
  {
    viewportHeight: 1200,
    viewportWidth: 1440,
  },
  () => {
    let lastId = 6;
    const aliasVisitTemplateList =
      'name' in GetVisitTemplateListDocument.definitions[0]
        ? GetVisitTemplateListDocument.definitions[0].name?.value
        : 'GetVisitTemplateList';
    const aliasUpdateFfgFormConnectionOrderDocument =
      'name' in UpdateFfgFormConnectionOrderDocument.definitions[0]
        ? UpdateFfgFormConnectionOrderDocument.definitions[0].name?.value
        : 'UpdateFfgFormConnectionOrder';
    const aliasGetFormFieldGroupDocument =
      'name' in GetFormFieldGroupDocument.definitions[0]
        ? GetFormFieldGroupDocument.definitions[0].name?.value
        : 'GetFormFieldGroup';
    const aliasCreateForm =
      'name' in CreateFormDocument.definitions[0]
        ? CreateFormDocument.definitions[0].name?.value
        : 'CreateForm';

    let visitTemplateList: IVisitTemplate[] = [];
    let newCreatedQuestion1: IFormFieldGroup = {} as IFormFieldGroup;
    let newCreatedQuestion2: IFormFieldGroup = {} as IFormFieldGroup;
    let newCreatedQuestion3: IFormFieldGroup = {} as IFormFieldGroup;
    let addedForm1: IForm = {} as IForm;

    const isMac = Cypress.platform === 'darwin';

    before(() => {
      cy.clearLocalStorage();
      cy.reseedDB();
      cy.fillInloginAsFormV2(
        {
          email: 'admin@example.com',
        },
        'studyTestId1',
        'study1revisionDev2e',
      );
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasVisitTemplateList) {
          req.alias = req.body.operationName;
        }
      });
      cy.visit('/study/study1revisionDev2e');
      cy.wait(`@${aliasVisitTemplateList}`).then((result) => {
        if (result?.response?.statusCode === 200) {
          visitTemplateList = result.response.body.data.visitTemplateList;
          cy.get(`[data-cy=visit-template-${visitTemplateList[0].id}]`).click({ force: true });
        }
      });
      cy.waitForReact();
    });

    describe('SEARCH STOCK', () => {
      before(() => {
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
          }
        });
      });

      it('Click on search icon should transform it to input, and typing "Choice" should show multiple choice and single choice stock and hide others', () => {
        cy.get('[data-cy=search-question-icon]').click({ force: true });
        cy.get('[data-cy=textfield-container-search-question-input]').scrollIntoView();
        cy.get('[data-cy=search-question-input').type('choice');
        cy.get('[data-cy=stock-drag-0]').should('not.exist');
        cy.get('[data-cy=stock-drag-1]').should('be.visible');
        cy.get('[data-cy=stock-drag-2]').should('be.visible');
      });

      it('Clear search should show all stocks again', () => {
        cy.get('[data-cy=clear-search-question]').scrollIntoView().click({ force: true });
        cy.get('[data-cy=stock-drag-0]').should('be.visible');
      });
    });

    describe('CREATE A NEW QUESTION ï»¿(SINGLE FIELD - NO NEED ANSWER) AND SAVE', () => {
      it('Default state should be empty canvas with Lets Add Some New Question UI, right side bar will only show library', () => {
        cy.get('[data-cy=add-new-question-page]').should('be.visible');
        cy.get('[data-cy=right-menu-properties-tab]').should('not.exist');
        cy.get('[data-cy=question-library]').should('be.visible');
      });

      it('Click Library and hovering on stock should show blue border on stock card and brighter card color', () => {
        cy.checkActiveQuestionFieldUI('field-card-0', 'stock');
      });

      it('Drag a question (Free text) stock to the canvas will hide "Lets Add Some New Question UI" and show the dragged stock on the canvas .', () => {
        cy.dragAndDrop('[data-cy=stock-drag-0]', '[data-cy=add-new-question-page]').then(() => {
          cy.wait(2000);
          lastId += 2;
          cy.wrap(lastId).then(() => {
            cy.get(`[data-cy=field-question-canvas-${lastId}]`).should('be.visible');
            cy.checkActiveQuestionFieldUI(`field-card-container-${lastId}`);
          });
        });
      });

      it('Right menu should show properties tab with default state empty input and unchecked attributes (should show all group and field attributes except require unique)', () => {
        cy.wrap(lastId).then(() => {
          // Open all collapsed question details
          cy.get('[data-cy=question-properties]').should('be.visible');
          cy.get('[data-cy=collapse-question-answers-1]').should('not.exist');

          // Check default input value
          cy.get(`[data-cy=long-question-input-${lastId}]`).should('have.value', '');
          cy.get(`[data-cy=short-question-input-${lastId}]`).should('have.value', '');
          cy.get(`[data-cy=keyword-question-input-${lastId}]`).should('have.value', '');
          cy.get('[data-cy=question-attributes-attr-secondDataEntry]').should('have.value', '');
          cy.get('[data-cy=question-attributes-attr-verificationReq]').should('have.value', '');
          cy.get('[data-cy=question-attributes-attr-noSCNeeded]').should('have.value', '');
          cy.get('[data-cy=question-attributes-attr-allowMultiEntry]').should('have.value', '');
          cy.get('[data-cy=question-attributes-attr-usePrevEntry]').should('have.value', '');
          cy.get('[data-cy=question-attributes-attr-markAsNoAnswer]').should('have.value', '');
          cy.get('[data-cy=question-attributes-attr-reqUnique]').should('not.exist');
        });
      });

      it('Input question details should update details question on the canvas ', () => {
        cy.wrap(lastId).then(() => {
          cy.fillInQuestionDetails(
            lastId,
            {
              shortQuestion: 'Medical history',
              question: 'Medical history patient:',
              oid: 'MH',
              keyword: 'history',
            },
            IFormFieldType.FreeText,
            'group',
          );
        });
      });

      it('Check 2nd Data Entry Required should automatically checked Verification Required and disable it', () => {
        cy.get('[data-cy=question-attributes-attr-secondDataEntry]').check();
        cy.get('[data-cy=question-attributes-attr-verificationReq]')
          .should('be.checked')
          .should('be.disabled');
      });

      it('Uncheck 2nd Data Entry Required, and should be able to check/unchecked Verification Required', () => {
        cy.get('[data-cy=question-attributes-attr-secondDataEntry]').uncheck();
        cy.get('[data-cy=question-attributes-attr-verificationReq]').should('be.enabled');
        cy.get('[data-cy=question-attributes-attr-verificationReq]').check();
      });

      it('Check Allow multi-instance entry should show + Add question on the selected question, and show Require Unique in checked condition', () => {
        cy.wrap(lastId).then(() => {
          cy.get('[data-cy=question-attributes-attr-allowMultiEntry]').check();
          cy.get(`[data-cy=multi-entry-button-${lastId}]`).should('be.visible');
          // We remove unique checkbox (unique should be shown only on single choice stock question)
          // cy.get('[data-cy=question-attributes-attr-reqUnique]').should('be.checked');
        });
      });

      it('Check mark as no answer should show Mark As No Answer on the selected question', () => {
        cy.wrap(lastId).then(() => {
          cy.get('[data-cy=question-attributes-attr-markAsNoAnswer]').check();
          cy.get(`[data-cy=no-answer-sign-study-question-${lastId}]`).should('be.visible');
        });
      });

      it('Click Save should update the question ï»¿to the BE and property should show the uneditable question detail', () => {
        cy.saveCreateQuestion().then((result) => {
          if (result?.response?.statusCode === 200) {
            cy.wait(1000);
            const FF: IFormField = result?.response?.body.data.createFormFieldGroup[0].fields[0];
            newCreatedQuestion1 = result?.response?.body.data.createFormFieldGroup[0];
            cy.get(`[data-cy=uneditable-question-details-${FF.id}]`).should('be.visible');
            cy.get(`[data-cy=uneditable-long-question-${FF.id}]`).should('have.text', FF.question);
            cy.get(`[data-cy=uneditable-short-question-${FF.id}]`).should(
              'have.text',
              FF.shortQuestion,
            );
            // cy.get(`[data-cy=uneditable-keyword-question-${FF.id}]`).should('have.text', FF.keywords)
            cy.checkQuestionAttributes('uneditable', 'both', newCreatedQuestion1, 0);
          }
        });
      });
    });

    describe('REORDERING SINGLE FIELD GROUP ï»¿ON CANVAS - SUCCESS', () => {
      before(() => {
        cy.get(`[data-cy=field-card-container-${lastId}]`).click();
      });
      it('Make sure there are more than 1 single field group on the canvas, drag the last field to the center should rearrange the sequence on the canvas', () => {
        cy.dragAndDrop('[data-cy=stock-drag-1]', '[data-cy=add-new-question-page]', 200).then(
          () => {
            cy.wait(2000);
            lastId += 2;
            cy.wrap(lastId).then(() => {
              cy.fillInQuestionDetails(
                lastId,
                {
                  shortQuestion: 'Short Question 1',
                  question: 'Long question',
                  oid: 'SQ',
                  keyword: 'question',
                },
                IFormFieldType.SingleChoice,
                'group',
              );
              cy.fillInQuestionAnswers().then(() => {
                cy.saveCreateQuestion().then((result) => {
                  if (result?.response?.statusCode === 200) {
                    cy.wait(2000);
                    cy.get(`[data-cy=field-card-container-${lastId}]`).click();
                    cy.dragAndDrop(
                      '[data-cy=stock-drag-1]',
                      '[data-cy=add-new-question-page]',
                      400,
                    );
                    lastId += 2;
                    cy.fillInQuestionDetails(
                      lastId,
                      {
                        shortQuestion: 'ORDERING',
                        question: 'ORDERING',
                        oid: 'ORD',
                        keyword: 'question',
                      },
                      IFormFieldType.SingleChoice,
                      'group',
                    );
                    cy.fillInQuestionAnswers();
                    cy.saveCreateQuestion().then((result) => {
                      cy.wait(2000);
                      newCreatedQuestion2 = result?.response?.body.data.createFormFieldGroup[1];
                      cy.dragAndDrop(
                        `[data-cy=field-question-canvas-${lastId}]`,
                        `[data-cy=field-question-canvas-${lastId - 4}]`,
                        100,
                      );
                    });
                  }
                });
              });
            });
          },
        );
      });

      it('ï»¿Wait 2 seconds make sure the order still correct', () => {
        cy.wait(2000);
        cy.checkQuestionAttributes('uneditable', 'both', newCreatedQuestion2, 0);
      });
    });

    describe('REORDERINGï»¿ SINGLE FIELD GROUP ï»¿ON CANVASï»¿ - FAILED', () => {
      it('Make sure there are more than 1 single field group on the canvas, drag the last field to the center should rearrange the sequence on the canvas, change api response to fail/error', () => {
        cy.fixture('studyConfig.json').then((value) => {
          cy.intercept('POST', '/graphql', (req) => {
            if (req.body.operationName === aliasUpdateFfgFormConnectionOrderDocument) {
              req.alias = req.body.operationName;
              req.reply({ data: value.updateFFGOrderError.data });
            }
            if (req.body.operationName === aliasGetFormFieldGroupDocument) {
              req.alias = req.body.operationName;
            }
          });
          cy.wrap(lastId).then(() => {
            cy.dragAndDrop(
              `[data-cy=field-question-canvas-${lastId}]`,
              `[data-cy=field-question-canvas-${lastId - 4}]`,
              100,
            ).then(() => {
              cy.wait(`@${aliasUpdateFfgFormConnectionOrderDocument}`).then((result) => {
                cy.wait(`@${aliasGetFormFieldGroupDocument}`).then((result) => {
                  cy.wait(1000);
                  cy.get(`[data-cy=field-card-container-${lastId - 2}]`).click();
                  cy.checkQuestionAttributes('uneditable', 'both', newCreatedQuestion2, 0);
                });
              });
            });
          });
        });
      });
    });

    describe('REORDERING MULTI GROUP', () => {
      before(() => {
        cy.get('[data-cy=right-menu-library-tab]').click();
      });
      it('Make sure there are more than 3 groups, then select 2 group should should show quick action on the bottom of the canvas', () => {
        cy.dragAndDrop('[data-cy=stock-drag-1]', '[data-cy=add-new-question-page]', 580).then(
          () => {
            lastId += 2;
            cy.wrap(lastId).then(() => {
              cy.fillInQuestionDetails(
                lastId,
                {
                  shortQuestion: 'ORDERING 2',
                  question: 'ORDERING 2',
                  oid: 'ORD',
                  keyword: 'question',
                },
                IFormFieldType.SingleChoice,
                'group',
              );
              cy.fillInQuestionAnswers().then(() => {
                cy.get('[data-cy=question-attributes-attr-secondDataEntry]').check();
                cy.saveCreateQuestion().then((result) => {
                  if (result?.response?.statusCode === 200) {
                    newCreatedQuestion3 = result?.response?.body.data.createFormFieldGroup[3];
                    cy.wrap([newCreatedQuestion3, lastId]).then(() => {
                      cy.wait(1000);
                      cy.get('body')
                        .type(isMac ? '{meta}' : '{ctrl}', { release: false })
                        .get(`[data-cy=field-question-canvas-${lastId - 2}]`)
                        .click();
                      cy.get('body').type(isMac ? '{meta}' : '{ctrl}');
                      cy.get('[data-cy=bottom-question-canvas-quick-action]').should('be.visible');
                      cy.get('[data-cy=total-question-selected]').should(
                        'contain',
                        '2 Questions Selected',
                      );
                      cy.get('[data-cy=merge-unmerge-button]').should('contain', 'Merge Questions');
                    });
                  }
                });
              });
            });
          },
        );
      });

      it('drag the groups in between group should rearrange the sequence on the canva', () => {
        cy.wrap([lastId, newCreatedQuestion3]).then(() => {
          cy.dragAndDrop(
            `[data-cy=field-question-canvas-${lastId}]`,
            `[data-cy=field-question-canvas-${lastId - 6}]`,
            100,
          ).then(() => {
            cy.wait(2000);
            cy.wait(1000);
            cy.get(`[data-cy=field-card-container-${lastId - 2}]`).click();
            cy.checkQuestionAttributes('uneditable', 'both', newCreatedQuestion3, 0);
          });
        });
      });
    });

    describe('REORDERING FIELD QUESTON GROUP', () => {
      before(() => {
        cy.wait(3000);
      });
      it('Make sure there is a group consists of more than 2 fields', () => {
        cy.get('[data-cy=right-menu-library-tab]').click();

        cy.dragAndDrop('[data-cy=stock-drag-1]', '[data-cy=add-new-question-page]', 780).then(
          () => {
            lastId += 2;
            cy.wrap(lastId).then(() => {
              cy.fillInQuestionDetails(
                lastId,
                {
                  shortQuestion: 'ORDERING 4',
                  question: 'ORDERING 4',
                  oid: 'ORD',
                  keyword: 'question',
                },
                IFormFieldType.SingleChoice,
                'group',
              );
              cy.fillInQuestionAnswers().then(() => {
                cy.get('[data-cy=question-attributes-attr-markAsNoAnswer]').check();
                cy.get('[data-cy=question-attributes-attr-secondDataEntry]').check();
                cy.saveCreateQuestion().then((result) => {
                  if (result?.response?.statusCode === 200) {
                    newCreatedQuestion3 = result?.response?.body.data.createFormFieldGroup[4];
                  }
                });
                cy.get('body')
                  .type(isMac ? '{meta}' : '{ctrl}', { release: false })
                  .get(`[data-cy=field-question-canvas-${lastId - 2}]`)
                  .click()
                  .get(`[data-cy=field-question-canvas-${lastId - 4}]`)
                  .click()
                  .get(`[data-cy=field-question-canvas-${lastId - 6}]`)
                  .click();
                cy.get('body').type(isMac ? '{meta}' : '{ctrl}');
                cy.get('[data-cy=merge-unmerge-button]').click();
                cy.wait(2000);
                lastId -= 6;
                cy.wrap(lastId).then(() => {
                  cy.get(`[data-cy=arrow-collapse-question-${lastId - 1}]`).click();
                  cy.wait(1000);
                });
              });
            });
          },
        );
      });

      it('Reordering a field should rearrange the sequence on the group', () => {
        cy.wrap([lastId, newCreatedQuestion3]).then(() => {
          cy.dragAndDrop(
            `[data-cy=field-card-container-${lastId + 3}]`,
            `[data-cy=field-card-container-${lastId}]`,
            100,
          ).then(() => {
            cy.wait(3000);
            cy.checkQuestionAttributes('uneditable', 'field', newCreatedQuestion3, 0);
          });
        });
      });
    });

    describe('REORDERINGï»¿ MULTI FIELD INSIDE GROUP', () => {
      it('Make sure there are more than 3 fields inside a group, then select 2 fields inside a group should show quick action on the bottom of the canvas', () => {
        cy.get(`[data-cy=field-question-canvas-${lastId + 1}]`)
          .click()
          .get('body')
          .type(isMac ? '{meta}' : '{ctrl}', { release: false })
          .get(`[data-cy=field-question-canvas-${lastId}]`)
          .click();
        cy.get('body').type(isMac ? '{meta}' : '{ctrl}');
        cy.get('[data-cy=bottom-question-canvas-quick-action]').should('be.visible');
        cy.get('[data-cy=total-question-selected]').should('contain', '2 Questions Selected');
        cy.get('[data-cy=merge-unmerge-button]').should('contain', 'Merge Questions');
      });

      it('Drag the fields should rearrange the sequence', () => {
        cy.wrap([lastId, newCreatedQuestion3]).then(() => {
          cy.dragAndDrop(
            `[data-cy=field-question-canvas-${lastId}]`,
            `[data-cy=field-card-container-${lastId + 3}]`,
            90,
          ).then(() => {
            cy.wait(5000);
            cy.get(`[data-cy=field-card-container-13]`).click();
            cy.checkQuestionAttributes('uneditable', 'field', newCreatedQuestion3, 0);
            cy.wait(1000);
          });
        });
      });
    });

    describe('EXIT QUESTION ON EDIT MODE - FILLED ALL REQUIRED - CONTINUE EDITING', () => {
      it('Select existing question and edit it, and make sure all required field are filled', () => {
        cy.get(`[data-cy=field-card-container-8]`).click();
        cy.get('[data-cy=right-menu-cancel-button]').click();
        cy.wait(1000);
      });

      it('Click on another visit should show pop up modal', () => {
        cy.wrap(visitTemplateList).then(() => {
          cy.get('[data-cy=sidebar-toggle]').click();
          cy.get(`[data-cy=visit-template-${visitTemplateList[1].id}]`).click();
          cy.get('[data-cy=exit-question-confirmation]').should('be.visible');
        });
      });

      it('Click continue editing should close the modal and on right menu should show editable question details with clickable save button', () => {
        cy.wrap(newCreatedQuestion1).then(() => {
          cy.get('[data-cy=confirmModal-confirmButton]').click();
          cy.get(`[data-cy=editable-question-details-${newCreatedQuestion1.fields[0].id}]`);
          cy.checkSubmitButtonActive('right-menu-save-button');
          cy.get('[data-cy=right-menu-cancel-button]').click();
        });
      });
    });

    describe('EXIT QUESTION ON EDIT MODE - FILLED ALL REQUIRED - DISCARD', () => {
      it('Select existing question and edit it, and make sure all required field are filled', () => {
        cy.get('[data-cy=right-menu-cancel-button]').click();
        cy.fillInQuestionDetails(
          8,
          {
            shortQuestion: 'edit',
            question: 'edit',
            oid: 'EDIT',
            keyword: 'edit',
          },
          IFormFieldType.SingleChoice,
          'field',
        );
      });

      it('Click on another visit should show pop up modal', () => {
        cy.wrap(visitTemplateList).then(() => {
          cy.get(`[data-cy=visit-template-${visitTemplateList[1].id}]`).click();
          cy.get('[data-cy=exit-question-confirmation]').should('be.visible');
        });
      });

      it('Click discard should directly go to selected visit', () => {
        cy.get('[data-cy=confirmModal-cancelButton]').click();
        cy.get('[data-cy=visit-name]').should('have.text', visitTemplateList[1].name);
      });

      it('Go back to previously selected visit and check the edited question should remain unchanged', () => {
        cy.wrap([visitTemplateList, addedForm1, newCreatedQuestion1]).then(() => {
          cy.get('[data-cy=sidebar-toggle]').click();
          cy.get(`[data-cy=visit-template-${visitTemplateList[0].id}]`).click();
          cy.get(`[data-cy=form-${addedForm1.id}]`).click();
          cy.get(`[data-cy=field-card-container-8]`).click();
          cy.checkQuestionAttributes('uneditable', 'both', newCreatedQuestion1, 0);
        });
      });
    });

    describe('EXIT QUESTION ON EDIT MODE -UNFILLED ALL REQUIRED - CONTINUE EDITING', () => {
      it('Select existing question and edit it, and make sure all required field are unfilled', () => {
        cy.get('[data-cy=right-menu-cancel-button]').click();
        cy.clearQuestionDetails(8);
      });

      it('Click on another visit should show pop up modal', () => {
        cy.get('[data-cy=sidebar-toggle]').click();
        cy.wrap(visitTemplateList).then(() => {
          cy.get(`[data-cy=visit-template-${visitTemplateList[1].id}]`).click();
          cy.get('[data-cy=exit-question-confirmation]').should('be.visible');
        });
      });

      it('Click continue editing should close the modal and on right menu should show editable question details and all unfilled required fields should be red', () => {
        cy.get('[data-cy=confirmModal-confirmButton]').click();
        cy.wrap(newCreatedQuestion1).then(() => {
          cy.get(`[data-cy=editable-question-details-${newCreatedQuestion1.fields[0].id}]`);
          cy.get('[data-cy=long-question-input-8]').should(
            'have.css',
            'border-bottom',
            '1px solid rgb(215, 20, 99)',
          );
          cy.get('[data-cy=short-question-input-8]').should(
            'have.css',
            'border-bottom',
            '1px solid rgb(215, 20, 99)',
          );
        });
      });
    });

    describe('ï»¿EXIT QUESTION ON CREATE MODE -UNFILLED ALL REQUIRED - DISCARD', () => {
      it('Select existing question and edit it, and make sure all required field are unfilled, then click on another visit should show pop up modal', () => {
        cy.wrap(visitTemplateList).then(() => {
          cy.get(`[data-cy=visit-template-${visitTemplateList[1].id}]`).click();
        });
      });

      it('Click discard should directly go to selected visit', () => {
        cy.get('[data-cy=confirmModal-cancelButton]').click();
        cy.wrap(visitTemplateList).then(() => {
          cy.get('[data-cy=visit-name]').should('have.text', visitTemplateList[1].name);
        });
      });

      it('Go back to previously selected visit and check the edited question should go back unedited', () => {
        cy.wrap([visitTemplateList, addedForm1, lastId, newCreatedQuestion1]).then(() => {
          cy.get('[data-cy=sidebar-toggle]').click();
          cy.get(`[data-cy=visit-template-${visitTemplateList[0].id}]`).click();
          cy.get(`[data-cy=form-${addedForm1.id}]`).click();
          cy.get(`[data-cy=field-card-container-8]`).click();
          cy.checkQuestionAttributes('uneditable', 'both', newCreatedQuestion1, 0);
          cy.get(`[data-cy=delete-question-${lastId - 1}]`).click();
          cy.get('[data-cy=confirmModal-confirmButton]').click();
          cy.wait(1000);
          lastId = 6 + 2;
        });
      });
    });

    describe('EDIT QUESTION (SINGLE FIELD - NO NEED ANSWER) AND CANCEL', () => {
      it('On right side bar with uneditable details and click edit should show editable question details', () => {
        cy.wrap([lastId, newCreatedQuestion1]).then(() => {
          cy.get(`[data-cy=field-card-container-${lastId}]`).click();
          cy.get('[data-cy=right-menu-cancel-button]').click();
          cy.get(`[data-cy=editable-question-details-${newCreatedQuestion1.fields[0].id}]`).should(
            'be.visible',
          );
          cy.get(`[data-cy=short-question-input-${lastId}]`).should(
            'have.value',
            newCreatedQuestion1.fields[0].shortQuestion,
          );
          cy.get(`[data-cy=long-question-input-${lastId}]`).should(
            'have.value',
            newCreatedQuestion1.fields[0].question,
          );
          cy.checkQuestionAttributes('editable', 'both', newCreatedQuestion1, 0);
        });
      });

      it('Input question details should update details question on the canvas', () => {
        cy.wrap(lastId).then(() => {
          cy.get(`[data-cy=short-question-input-${lastId}]`).type('Edit');
          cy.get(`[data-cy=short-question-top-${lastId}]`).should(
            'have.text',
            'Medical historyEdit',
          );
          cy.get(`[data-cy=textfield-container-stock-input-${lastId}] label`).should(
            'contain',
            'Medical historyEdit',
          );
        });
      });
      it('Click Cancel should reverting the question back to the state before updating the card and show uneditable question detail on properties', () => {
        cy.wrap([lastId, newCreatedQuestion1]).then(() => {
          cy.get('[data-cy=right-menu-cancel-button]').click();
          cy.get(
            `[data-cy=uneditable-question-details-${newCreatedQuestion1.fields[0].id}]`,
          ).should('be.visible');
          cy.get(`[data-cy=uneditable-long-question-${newCreatedQuestion1.fields[0].id}]`).should(
            'have.text',
            newCreatedQuestion1.fields[0].question,
          );
          cy.get(`[data-cy=uneditable-short-question-${newCreatedQuestion1.fields[0].id}]`).should(
            'have.text',
            newCreatedQuestion1.fields[0].shortQuestion,
          );
          cy.checkQuestionAttributes('uneditable', 'both', newCreatedQuestion1, 0);
        });
      });
    });
  },
);
