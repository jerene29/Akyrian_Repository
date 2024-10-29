import {
  GetVisitTemplateListDocument,
  IVisitTemplate,
  CreateFormFieldGroupDocument,
  IFormField,
  IFormFieldGroup,
  IFormFieldType,
  IForm,
  CreateFormDocument,
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
    const aliasCreateFormFieldGroupDocument =
      'name' in CreateFormFieldGroupDocument.definitions[0]
        ? CreateFormFieldGroupDocument.definitions[0].name?.value
        : 'CreateFormFieldGroup';
    const aliasCreateForm =
      'name' in CreateFormDocument.definitions[0]
        ? CreateFormDocument.definitions[0].name?.value
        : 'CreateForm';
    const aliasGetFormFieldGroupDocument =
      'name' in GetFormFieldGroupDocument.definitions[0]
        ? GetFormFieldGroupDocument.definitions[0].name?.value
        : 'GetFormFieldGroup';

    let visitTemplateList: IVisitTemplate[] = [];
    let newCreatedQuestion1: IFormFieldGroup = {} as IFormFieldGroup;
    let newCreatedQuestion2: IFormFieldGroup = {} as IFormFieldGroup;
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

    describe('CREATE QUESTION AND CANCEL', () => {
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
        cy.dragAndDrop('[data-cy=stock-drag-0]', '[data-cy=add-new-question-page]').then(() => {
          cy.wait(2000);
          lastId += 2;
        });
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

        cy.get('[data-cy=question-attributes-attr-verificationReq]').check();
        cy.get('[data-cy=question-attributes-attr-markAsNoAnswer]').check();
        cy.get('[data-cy=question-attributes-attr-allowMultiEntry]').check();
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
            cy.checkQuestionAttributes('uneditable', 'both', newCreatedQuestion1, 0);
          }
        });
      });
      it('Drag a stock (Single Choice) to question canvas, on the properties should show Question Details, Answer, Data Entry Type and Question Type', () => {
        cy.get('[data-cy=right-menu-library-tab]').click();
        cy.dragAndDrop('[data-cy=stock-drag-1]', '[data-cy=add-new-question-page]', 200).then(
          () => {
            lastId += 2;
          },
        );
      });

      it('Input question details should update details question on the canvas', () => {
        cy.wrap(lastId).then(() => {
          cy.fillInQuestionDetails(
            lastId,
            {
              shortQuestion: 'Study consent',
              question: 'Did the subject consent for the study?',
              oid: 'SC_ONE',
              keyword: 'consent',
            },
            IFormFieldType.SingleChoice,
            'group',
          );
          cy.fillInQuestionAnswers();
        });
      });

      it('Click cancel should remove question from the question canvas and right menu should show only library tab', () => {
        cy.wrap(lastId).then(() => {
          cy.get('[data-cy=right-menu-cancel-button]').click();
          cy.get(`[data-cy=field-question-canvas-${lastId - 1}]`).should('not.exist');
          lastId -= 2;
        });
      });
    });

    describe('CREATE QUESTION ï»¿(SINGLE FIELD - NEED ANSWER)', () => {
      it('Drag a stock (Single Choice) to question canvas, on the properties should show Question Details, Answer, Data Entry Type and Question Type', () => {
        cy.get('[data-cy=right-menu-library-tab]').click();
        cy.wait(1000);
        cy.dragAndDrop('[data-cy=stock-drag-1]', '[data-cy=add-new-question-page]', 200).then(
          () => {
            lastId += 2;
          },
        );
      });

      it('Input question details should update details question on the canvas', () => {
        cy.wrap(lastId).then(() => {
          cy.fillInQuestionDetails(
            lastId,
            {
              shortQuestion: 'Study consent',
              question: 'Did the subject consent for the study?',
              oid: 'SC_TWO',
              keyword: 'consent',
            },
            IFormFieldType.SingleChoice,
            'group',
          );
          cy.fillInQuestionAnswers();
        });
      });

      it('Answer more than 2: Input 3 answers should show Select input on selected field', () => {
        cy.wrap(lastId).then(() => {
          cy.get('[data-cy=question-add-answer-text]').click();
          cy.get(`[data-cy=stock-input-${lastId}] .ant-select`).should('be.visible');
        });
      });

      it('Answer less than 2: Input 2 answers should show Radio input', () => {
        cy.wrap(lastId).then(() => {
          cy.get('[data-cy=delete-answer-new2]').click();
          cy.get(`[data-cy=stock-input-${lastId}] .ant-radio`).should('be.visible');
        });
      });

      it('Click Save should save the question ï»¿to the BE and property should show the uneditable question detail (with answer)', () => {
        cy.saveCreateQuestion().then((result) => {
          if (result?.response?.statusCode === 200) {
            cy.wait(1000);
            const FF: IFormField = result?.response?.body.data.createFormFieldGroup[1].fields[0];
            newCreatedQuestion2 = result?.response?.body.data.createFormFieldGroup[1];
            cy.wrap([FF, newCreatedQuestion2]).then(() => {
              cy.get(`[data-cy=uneditable-question-details-${FF.id}]`).should('be.visible');
              cy.get(`[data-cy=uneditable-long-question-${FF.id}]`).should(
                'have.text',
                FF.question,
              );
              cy.get(`[data-cy=uneditable-short-question-${FF.id}]`).should(
                'have.text',
                FF.shortQuestion,
              );
              cy.checkQuestionAttributes('uneditable', 'both', newCreatedQuestion2, 0);
            });
          }
        });
      });
    });

    describe('MERGE QUESTION - TIE FIELD COUNT', () => {
      it('Cmd + Click on 2 question on the canvas should show bottom buttons (Merge, cancel, delete all)', () => {
        cy.wrap(lastId).then(() => {
          cy.get('body').type(isMac ? '{meta}' : '{ctrl}', { release: true });
          cy.wait(3000);
          cy.get('body')
            .type(isMac ? '{meta}' : '{ctrl}', { release: false })
            .get(`[data-cy=field-question-canvas-${lastId - 2}]`)
            .click();
          cy.get('body').type(isMac ? '{meta}' : '{ctrl}');
          cy.get('[data-cy=bottom-question-canvas-quick-action]').should('be.visible');
          cy.get('[data-cy=total-question-selected]').should('contain', '2 Questions Selected');
          cy.get('[data-cy=merge-unmerge-button]').should('contain', 'Merge Questions');
        });
      });

      it('Click merge button should combine 2 question into 1 group with group attributes of 1st question, and ï»¿should show the uneditable question detail (have dropdown because the group has more than 1 field now)', () => {
        cy.get('[data-cy=merge-unmerge-button]').click();
        lastId -= 1;
        cy.wrap([lastId, newCreatedQuestion1]).then(() => {
          cy.wait(2000);
          cy.checkQuestionAttributes('uneditable', 'group', newCreatedQuestion1, 0);
        });
      });
    });

    describe('MERGE QUESTION - DIFFERENT TOTAL OF FIELD', () => {
      it('Drag and drop another question stock to the canvas, On the right side menu should show properties, fill in question details and save it', () => {
        cy.get(`[data-cy=short-question-top-7]`).click();
        cy.dragAndDrop('[data-cy=stock-drag-1]', '[data-cy=add-new-question-page]', 200).then(
          () => {
            lastId += 2;
            cy.wrap(lastId).then(() => {
              cy.fillInQuestionDetails(
                lastId,
                {
                  shortQuestion: 'Short Question 1',
                  question: 'Long question',
                  oid: 'SQ_ONE',
                  keyword: 'question',
                },
                IFormFieldType.SingleChoice,
                'group',
              );
              cy.fillInQuestionAnswers().then(() => {
                cy.saveCreateQuestion().then((result) => {
                  if (result?.response?.statusCode === 200) {
                    cy.wait(1000);
                    const FF: IFormField =
                      result?.response?.body.data.createFormFieldGroup[1].fields[0];
                    newCreatedQuestion2 = result?.response?.body.data.createFormFieldGroup[1];
                    cy.wrap(newCreatedQuestion2).then(() => {
                      cy.get(`[data-cy=uneditable-question-details-${FF.id}]`).should('be.visible');
                      cy.get(`[data-cy=uneditable-long-question-${FF.id}]`).should(
                        'have.text',
                        FF.question,
                      );
                      cy.get(`[data-cy=uneditable-short-question-${FF.id}]`).should(
                        'have.text',
                        FF.shortQuestion,
                      );
                      cy.checkQuestionAttributes('uneditable', 'both', newCreatedQuestion2, 0);
                    });
                  }
                });
              });
            });
          },
        );
      });

      it('Click a group question (has 2 fields now) and click on newly dragged question stock ï»¿ should show bottom buttons (Merge, cancel, delete all)', () => {
        cy.get('body')
          .type(isMac ? '{meta}' : '{ctrl}', { release: false })
          .get(`[data-cy=group-question-canvas-7]`)
          .click();
        cy.get('body').type(isMac ? '{meta}' : '{ctrl}');
        cy.get('[data-cy=bottom-question-canvas-quick-action]').should('be.visible');
        cy.get('[data-cy=total-question-selected]').should('contain', '2 Questions Selected');
        cy.get('[data-cy=merge-unmerge-button]').should('contain', 'Merge Questions');
      });

      it('Click merge button should combine then with group attributes of question that has more fields', () => {
        cy.get('[data-cy=merge-unmerge-button]').click();
        cy.wait(1000);
        lastId -= 1;
        cy.wrap([lastId, newCreatedQuestion1]).then(() => {
          cy.checkQuestionAttributes('uneditable', 'group', newCreatedQuestion1, 0);
        });
      });
    });

    describe('MERGE QUESTION - SELECT A FIELD INSIDE A GROUP AND A GROUP', () => {
      it('Drag and drop another question stock to the canvas, On the right side menu should show properties, fill in question details and save it', () => {
        cy.wait(2000);
        cy.get('[data-cy=right-menu-library-tab]').click();
        cy.wait(1000);
        cy.get('[data-cy=right-menu-library-tab]').click();

        cy.dragAndDrop('[data-cy=stock-drag-1]', '[data-cy=add-new-question-page]', 200).then(
          () => {
            lastId += 2;
            cy.wrap(lastId).then(() => {
              cy.fillInQuestionDetails(
                lastId,
                {
                  shortQuestion: 'Short Question 1',
                  question: 'Long question',
                  oid: 'SQ_TWO',
                  keyword: 'question',
                },
                IFormFieldType.SingleChoice,
                'group',
              );
              cy.fillInQuestionAnswers().then(() => {
                cy.saveCreateQuestion().then((result) => {
                  if (result?.response?.statusCode === 200) {
                    cy.wait(1000);
                    const FF: IFormField =
                      result?.response?.body.data.createFormFieldGroup[1].fields[0];
                    newCreatedQuestion2 = result?.response?.body.data.createFormFieldGroup[1];
                    cy.wrap([FF, newCreatedQuestion2]).then(() => {
                      cy.get(`[data-cy=uneditable-question-details-${FF.id}]`).should('be.visible');
                      cy.get(`[data-cy=uneditable-long-question-${FF.id}]`).should(
                        'have.text',
                        FF.question,
                      );
                      cy.get(`[data-cy=uneditable-short-question-${FF.id}]`).should(
                        'have.text',
                        FF.shortQuestion,
                      );
                      cy.checkQuestionAttributes('uneditable', 'both', newCreatedQuestion2, 0);
                    });
                  }
                });
              });
            });
          },
        );
      });

      it('Click a group question (has 2 fields now) and click on newly dragged question stock ï»¿ should show bottom buttons (Merge, cancel, delete all)', () => {
        cy.get('[data-cy=arrow-collapse-question-7]').click();
        cy.wait(1000);
        cy.get(`[data-cy=short-question-top-7]`).click();
        cy.get('body')
          .type(isMac ? '{meta}' : '{ctrl}', { release: false })
          .get(`[data-cy=field-card-container-9]`)
          .click()
          .get(`[data-cy=field-card-container-12]`)
          .click();
        cy.get('body').type(isMac ? '{meta}' : '{ctrl}');
        cy.get('[data-cy=bottom-question-canvas-quick-action]').should('be.visible');
        cy.get('[data-cy=total-question-selected]').should('contain', '2 Questions Selected');
        cy.get('[data-cy=merge-unmerge-button]').should('contain', 'Merge Questions');
      });

      it('Click merge button should combine then with group attributes of question that has more fields', () => {
        cy.get('[data-cy=merge-unmerge-button]').click();
        lastId -= 1;
        cy.wrap([lastId, newCreatedQuestion1]).then(() => {
          cy.wait(1000);
          cy.checkQuestionAttributes('uneditable', 'group', newCreatedQuestion1, 0);
          cy.get('[data-cy=arrow-collapse-question-7]').click();
        });
      });
    });

    describe('DRAGGING TO MAKE A GROUP (STOCK TO CANVAS)', () => {
      it('ï»¿Drag and drop another question stock to the canvas, on the right side menu should show properties, fill in question details and save it', () => {
        cy.get('[data-cy=arrow-collapse-question-7]').click();
        cy.wait(1000);
        cy.get('[data-cy=right-menu-library-tab]').click();
        cy.wait(1000);
        cy.dragAndDrop('[data-cy=stock-drag-1]', '[data-cy=field-question-canvas-11]', 80).then(
          () => {
            lastId += 1;
          },
        );
        cy.wait(2000);
      });

      it('Question title on the top should not be clickable', () => {
        cy.get('[data-cy=question-title-select-dropdown]').should('have.css', 'cursor', 'no-drop');
      });

      it('Fill in question details and save it should be redirected to uneditable field details', () => {
        cy.fillInQuestionDetails(
          lastId,
          {
            shortQuestion: 'Short Question 1',
            question: 'Long question',
            oid: 'SQ_THREE',
            keyword: 'question',
          },
          IFormFieldType.SingleChoice,
          'field',
        );
        cy.fillInQuestionAnswers().then(() => {
          cy.saveUpdateQuestion().then((result) => {
            if (result?.response?.statusCode === 200) {
              cy.wait(1000);
              newCreatedQuestion1 =
                result?.response?.body.data.updateFormFieldGroup.formFieldGroups[0];
              const FF: IFormField =
                newCreatedQuestion1.fields[newCreatedQuestion1.fields.length - 1];
              cy.get(`[data-cy=uneditable-question-details-${FF.id}]`).should('be.visible');
              cy.get(`[data-cy=uneditable-long-question-${FF.id}]`).should(
                'have.text',
                FF.question,
              );
              cy.get(`[data-cy=uneditable-short-question-${FF.id}]`).should(
                'have.text',
                FF.shortQuestion,
              );
              cy.checkQuestionAttributes(
                'uneditable',
                'field',
                newCreatedQuestion1,
                newCreatedQuestion1.fields.length - 1,
              );
            }
          });
        });
      });
    });

    describe('DRAGGING TO MAKE A GROUP (MULTI FIELD GROUP TO SINGLE FIELD GROUP)ï»¿ï»¿', () => {
      it('Drag and drop another question stock to the canvas, and drag multi fields group to a single field group', () => {
        cy.get('[data-cy=arrow-collapse-question-7]').click();
        cy.wait(2000);
        cy.get('[data-cy=right-menu-library-tab]').click();
        cy.dragAndDrop('[data-cy=stock-drag-1]', '[data-cy=add-new-question-page]', 150).then(
          () => {
            cy.wait(1000);
            lastId += 2;
            cy.wrap(lastId).then(() => {
              cy.fillInQuestionDetails(
                lastId,
                {
                  shortQuestion: 'Short Question 1',
                  question: 'Long question',
                  oid: 'SQ_FOUR',
                  keyword: 'question',
                },
                IFormFieldType.SingleChoice,
                'group',
              );
              cy.fillInQuestionAnswers().then(() => {
                cy.get('[data-cy=question-attributes-attr-secondDataEntry]').check();
                cy.saveCreateQuestion().then((result) => {
                  if (result?.response?.statusCode === 200) {
                    cy.wait(1000);
                    const FF: IFormField =
                      result?.response?.body.data.createFormFieldGroup[1].fields[0];
                    newCreatedQuestion2 = result?.response?.body.data.createFormFieldGroup[1];
                    cy.wrap([FF, newCreatedQuestion2]).then(() => {
                      cy.get(`[data-cy=uneditable-question-details-${FF.id}]`).should('be.visible');
                      cy.get(`[data-cy=uneditable-long-question-${FF.id}]`).should(
                        'have.text',
                        FF.question,
                      );
                      cy.get(`[data-cy=uneditable-short-question-${FF.id}]`).should(
                        'have.text',
                        FF.shortQuestion,
                      );
                      cy.checkQuestionAttributes('uneditable', 'both', newCreatedQuestion2, 0);
                      newCreatedQuestion1 = newCreatedQuestion2;
                    });
                  }
                });
                cy.dragAndDrop(
                  '[data-cy=group-question-canvas-7]',
                  `[data-cy=group-question-canvas-${lastId - 1}]`,
                );
                cy.wait(5000);
              });
            });
          },
        );
      });

      it('On the right side menu should show properties, and group properties should follow the destination group attribute', () => {
        cy.wrap(newCreatedQuestion1).then(() => {
          cy.get('[data-cy=short-question-top-7]').click();
          cy.wait(1000);
          cy.get('[data-cy=short-question-top-7]').click();
          cy.wait(1000);

          cy.checkQuestionAttributes('uneditable', 'group', newCreatedQuestion1, 0);
        });
      });
    });

    describe('DRAGGING TO MAKE A GROUP (MULTI SELECT GROUP TO SINGLE FIELD GROUP)', () => {
      it('Select 2 groups should show bottom quick actions', () => {
        cy.wait(1000);
        cy.get('[data-cy=right-menu-library-tab]').click();
        cy.dragAndDrop('[data-cy=stock-drag-1]', '[data-cy=add-new-question-page]', 200).then(
          () => {
            lastId += 2;

            cy.wrap(lastId).then(() => {
              cy.fillInQuestionDetails(
                lastId - 1,
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
                cy.get('[data-cy=question-attributes-attr-secondDataEntry]').check();
                cy.intercept('POST', '/graphql', (req) => {
                  if (req.body.operationName === aliasCreateFormFieldGroupDocument) {
                    req.alias = req.body.operationName;
                  }
                });
                cy.get('[data-cy=right-menu-save-button]').click();
                cy.wait(`@${aliasCreateFormFieldGroupDocument}`).then((result) => {
                  if (result?.response?.statusCode === 200) {
                    cy.wait(2000);
                    cy.get('[data-cy=right-menu-library-tab]').click();
                    cy.dragAndDrop(
                      '[data-cy=stock-drag-1]',
                      '[data-cy=add-new-question-page]',
                      400,
                    );
                    lastId += 2;
                    cy.wrap(lastId).then(() => {
                      cy.fillInQuestionDetails(
                        lastId - 1,
                        {
                          shortQuestion: 'Short Question 1',
                          question: 'Long question',
                          oid: 'SQ',
                          keyword: 'question',
                        },
                        IFormFieldType.SingleChoice,
                        'group',
                      );
                      cy.fillInQuestionAnswers();
                      cy.get('[data-cy=right-menu-save-button]').click();
                      cy.wait(3000);
                      cy.get('body')
                        .type(isMac ? '{meta}' : '{ctrl}', { release: false })
                        .get(`[data-cy=field-question-canvas-${lastId - 3}]`)
                        .click();
                      cy.get('body').type(isMac ? '{meta}' : '{ctrl}');
                    });
                  }
                });
              });
            });
          },
        );
      });

      it('Dragging the groups to existing unselected group should show properties on right side menuï»¿, and group properties should follow the destination group attribute', () => {
        cy.wrap([lastId, newCreatedQuestion1]).then(() => {
          cy.dragAndDrop(
            `[data-cy=field-question-canvas-${lastId - 3}]`,
            '[data-cy=group-question-canvas-7]',
          ).then(() => {
            cy.wait(5000);
            cy.checkQuestionAttributes('uneditable', 'group', newCreatedQuestion1, 0);
          });
        });
      });
    });
  },
);
