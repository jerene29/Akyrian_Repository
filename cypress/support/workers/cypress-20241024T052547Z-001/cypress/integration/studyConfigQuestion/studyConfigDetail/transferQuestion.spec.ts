import {
  GetVisitTemplateListDocument,
  IVisitTemplate,
  CreateFormDocument,
  IForm,
  IFormFieldGroup,
  IFormFieldType,
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
    const aliasCreateForm =
      'name' in CreateFormDocument.definitions[0]
        ? CreateFormDocument.definitions[0].name?.value
        : 'CreateForm';

    let visitTemplateList: IVisitTemplate[] = [];
    let newCreatedQuestion1: IFormFieldGroup = {} as IFormFieldGroup;
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

    describe('TRANSFER A FIELD INSIDE A GROUP TO ANOTHER GROUP', () => {
      before(() => {
        lastId = 6;
        cy.wrap([lastId, visitTemplateList]).then(() => {
          cy.get('[data-cy=sidebar-toggle]').click();
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
              cy.get(`[data-cy=form-${addedForm1.id}]`).should('be.visible').click();
              cy.wait(1000);
            }
          });
        });
      });
      it('Make sure there are two groups on the canvas', () => {
        cy.dragAndDrop('[data-cy=stock-drag-0]', '[data-cy=add-new-question-page]').then(() => {
          lastId += 2;
          cy.wrap(lastId).then(() => {
            cy.get(`[data-cy=field-question-canvas-${lastId}]`).should('be.visible');
            cy.fillInQuestionDetails(
              lastId,
              {
                shortQuestion: 'QUESTION 1',
                question: 'QUESTION 1',
                oid: 'Q_ONE',
                keyword: 'history',
              },
              IFormFieldType.FreeText,
              'group',
            );
            cy.saveCreateQuestion().then((result) => {
              if (result?.response?.statusCode === 200) {
                cy.wait(3000);
                cy.get('[data-cy=right-menu-library-tab]').click();
                cy.get('[data-cy=right-menu-library-tab]').click();
                cy.dragAndDrop('[data-cy=stock-drag-0]', '[data-cy=add-new-question-page]', 200);
                lastId += 2;

                cy.get(`[data-cy=field-question-canvas-${lastId}]`).should('be.visible');

                cy.fillInQuestionDetails(
                  lastId,
                  {
                    shortQuestion: 'QUESTION 2',
                    question: 'QUESTION 2',
                    oid: 'Q_TWO',
                    keyword: 'history',
                  },
                  IFormFieldType.FreeText,
                  'group',
                );
                // 17 dan 21
                cy.get('[data-cy=question-attributes-attr-markAsNoAnswer]').check();
                cy.get(`[data-cy=no-answer-sign-study-question-${lastId}]`).should('be.visible');
                cy.saveCreateQuestion().then((result) => {
                  cy.wait(3000);
                  newCreatedQuestion1 = result?.response?.body.data.createFormFieldGroup[1];
                  cy.get('[data-cy=right-menu-library-tab]').click();
                  cy.get('[data-cy=right-menu-library-tab]').click();
                  cy.dragAndDrop('[data-cy=stock-drag-0]', '[data-cy=add-new-question-page]', 400);
                  lastId += 2;

                  cy.get(`[data-cy=field-question-canvas-${lastId}]`).should('be.visible');

                  cy.fillInQuestionDetails(
                    lastId,
                    {
                      shortQuestion: 'QUESTION 3',
                      question: 'QUESTION 3',
                      oid: 'Q_THREE',
                      keyword: 'history',
                    },
                    IFormFieldType.FreeText,
                    'group',
                  );
                  cy.saveCreateQuestion().then((result) => {
                    cy.wait(3000);
                    cy.get('[data-cy=right-menu-library-tab]').click();
                    cy.get('[data-cy=right-menu-library-tab]').click();
                    cy.dragAndDrop(
                      '[data-cy=stock-drag-0]',
                      '[data-cy=add-new-question-page]',
                      580,
                    );
                    lastId += 2;
                    cy.get(`[data-cy=field-question-canvas-${lastId}]`).should('be.visible');
                    cy.fillInQuestionDetails(
                      lastId,
                      {
                        shortQuestion: 'QUESTION 4',
                        question: 'QUESTION 4',
                        oid: 'Q_FOUR',
                        keyword: 'history',
                      },
                      IFormFieldType.FreeText,
                      'group',
                    );
                    // 17 dan 21
                    cy.saveCreateQuestion().then((result) => {
                      cy.wait(3000);
                      cy.get('body')
                        .type(isMac ? '{meta}' : '{ctrl}', { release: false })
                        .get(`[data-cy=field-question-canvas-${lastId - 2}]`)
                        .click();
                      cy.get('body').type(isMac ? '{meta}' : '{ctrl}');
                      cy.get('[data-cy=merge-unmerge-button]').click();
                      cy.wait(3000);
                      lastId -= 1;
                      cy.get(`[data-cy=field-question-canvas-8]`).click();
                      cy.get('body')
                        .type(isMac ? '{meta}' : '{ctrl}', { release: false })
                        .get(`[data-cy=field-question-canvas-10]`)
                        .click();
                      cy.get('body').type(isMac ? '{meta}' : '{ctrl}');
                      cy.get('[data-cy=merge-unmerge-button]').click();
                      lastId -= 1;
                      cy.wait(2000);
                    });
                  });
                });
              }
            });
          });
        });
      });
      it('Drag a field from Group 1 to Group 2 should show the dragged field inside Group 2 and remove it from group 1', () => {
        cy.wrap([lastId, newCreatedQuestion1]).then(() => {
          cy.get(`[data-cy=arrow-collapse-question-${lastId - 2}]`).click();
          cy.wait(1000);
          cy.get(`[data-cy=arrow-collapse-question-${lastId - 5}]`).click();
          cy.wait(1000);
          cy.get(`[data-cy=field-question-canvas-${lastId - 3}]`).click();
          cy.dragAndDrop(
            `[data-cy=field-question-canvas-${lastId - 3}]`,
            `[data-cy=field-question-canvas-${lastId - 1}]`,
            100,
          ).then(() => {
            cy.get(`[data-cy=arrow-collapse-question-${lastId - 3}]`).click();
            cy.get(`[data-cy=field-question-canvas-${lastId - 2}]`).click();
            cy.checkQuestionAttributes('uneditable', 'field', newCreatedQuestion1, 0);
          });
        });
      });
    });

    describe('TRANSFER MULTI FIELD INSIDE A GROUP TO ANOTHER GROUP', () => {
      before(() => {
        cy.wait(5000);
      });
      it('Make sure there are two groups on the canvas with more than 3 fields', () => {
        cy.get('[data-cy=right-menu-library-tab]').click();
        cy.get('[data-cy=right-menu-library-tab]').click();

        cy.wrap(lastId).then(() => {
          cy.dragAndDrop(
            '[data-cy=stock-drag-0]',
            `[data-cy=field-question-canvas-${lastId - 2}]`,
            100,
          ).then(() => {
            lastId += 1;
            cy.wrap(lastId).then(() => {
              cy.checkActiveQuestionFieldUI(`field-card-container-${lastId}`);
              cy.fillInQuestionDetails(
                lastId,
                {
                  shortQuestion: 'QUESTION 5',
                  question: 'QUESTION 5',
                  oid: 'Q_FIVE',
                  keyword: 'history',
                },
                IFormFieldType.FreeText,
                'field',
              );
              cy.get('[data-cy=right-menu-save-button]').click();
              cy.wait(2000);
            });
          });
        });
      });
      it('Drag 2 fields to another group and the fields should show on destination group and removed from source group', () => {
        cy.wrap([lastId, newCreatedQuestion1]).then(() => {
          cy.get('body')
            .type(isMac ? '{meta}' : '{ctrl}', { release: false })
            .get(`[data-cy=field-question-canvas-${lastId - 3}]`)
            .click();
          cy.get('body').type(isMac ? '{meta}' : '{ctrl}');
          cy.get(`[data-cy=field-question-canvas-${lastId - 5}]`).scrollIntoView();
          cy.dragAndDrop(
            `[data-cy=field-question-canvas-${lastId - 3}]`,
            `[data-cy=field-question-canvas-${lastId - 5}]`,
          ).then(() => {
            cy.wait(2000);
            cy.get(`[data-cy=field-question-canvas-8]`).click();
            cy.checkQuestionAttributes('uneditable', 'field', newCreatedQuestion1, 0);
          });
        });
      });
    });

    describe('TRANSFER MULTI FIELD INSIDE FROM 2 DIFFERENT GROUPï»¿ TO ANOTHER GROUP', () => {
      it('Make sure there are three groups on the canvas with more than 3 fields', () => {
        cy.get(`[data-cy=arrow-collapse-question-7]`).click();
        cy.wait(1000);
        cy.get('[data-cy=right-menu-library-tab]').click();
        cy.dragAndDrop('[data-cy=stock-drag-0]', '[data-cy=add-new-question-page]', 300).then(
          () => {
            cy.wrap(lastId).then(() => {
              cy.get(`[data-cy=field-question-canvas-${lastId}]`).should('be.visible');
              cy.checkActiveQuestionFieldUI(`field-card-container-${lastId}`);
              cy.fillInQuestionDetails(
                lastId,
                {
                  shortQuestion: 'QUESTION 6',
                  question: 'QUESTION 6',
                  oid: 'Q_SIX',
                  keyword: 'QUESTION 6',
                },
                IFormFieldType.FreeText,
                'group',
              );
              // 17 dan 21
              cy.saveCreateQuestion().then((result) => {
                cy.wait(1000);
                cy.get('[data-cy=right-menu-library-tab]').click();
                cy.dragAndDrop(
                  '[data-cy=stock-drag-0]',
                  `[data-cy=field-question-canvas-${lastId}]`,
                ).then(() => {
                  lastId += 1;
                  cy.wrap(lastId).then(() => {
                    cy.get(`[data-cy=field-question-canvas-${lastId}]`).should('be.visible');
                    cy.checkActiveQuestionFieldUI(`field-card-container-${lastId}`);
                    cy.fillInQuestionDetails(
                      lastId,
                      {
                        shortQuestion: 'QUESTION 7',
                        question: 'QUESTION 7',
                        oid: 'Q_SEVEN',
                        keyword: 'history',
                      },
                      IFormFieldType.FreeText,
                      'field',
                    );
                    cy.get('[data-cy=question-attributes-attr-markAsNoAnswer]').check();
                    cy.get(`[data-cy=no-answer-sign-study-question-${lastId}]`).should(
                      'be.visible',
                    );
                    cy.saveUpdateQuestion().then((result) => {
                      cy.wait(1000);
                      newCreatedQuestion1 =
                        result?.response?.body.data.updateFormFieldGroup.formFieldGroups[0];
                    });
                  });
                });
              });
            });
          },
        );
        lastId += 2;
      });

      it('Drag 2 fields from each 2 group and drag to the 3rd group, should show the dragged group on destination group and remove it from source group', () => {
        cy.wrap(newCreatedQuestion1).then(() => {
          cy.get(`[data-cy=arrow-collapse-question-11]`).click();
          cy.wait(1000);
          cy.get(`[data-cy=arrow-collapse-question-7]`).click();
          cy.wait(1000);
          cy.get(`[data-cy=field-question-canvas-15]`).click();
          cy.get('body')
            .type(isMac ? '{meta}' : '{ctrl}', { release: false })
            .get(`[data-cy=field-question-canvas-10]`)
            .click();
          cy.get('body').type(isMac ? '{meta}' : '{ctrl}');
          cy.get(`[data-cy=field-question-canvas-12]`).scrollIntoView();
          cy.dragAndDrop(
            `[data-cy=field-question-canvas-10]`,
            `[data-cy=field-question-canvas-12]`,
            100,
          ).then(() => {
            cy.wait(3000);
            cy.get(`[data-cy=field-question-canvas-11]`).click();
            cy.checkQuestionAttributes('uneditable', 'field', newCreatedQuestion1, 0);
          });
        });
      });
    });

    describe('DELETE MULTI SELECT ï»¿ï»¿', () => {
      it('Select more than 1 questions (field & group) should show bottom quick action', () => {
        cy.get('body')
          .type(isMac ? '{meta}' : '{ctrl}', { release: false })
          .get(`[data-cy=field-question-canvas-9]`)
          .click();
        cy.get('body').type(isMac ? '{meta}' : '{ctrl}');
      });

      it('Click on delete all should show confirmation modal', () => {
        cy.get('[data-cy=delete-all]').click();
        cy.get('[data-cy=confirmation-delete-modal]').should('be.visible');
      });

      it('Click confirm should delete all selected question', () => {
        cy.get('[data-cy=confirmModal-confirmButton]').click();
        cy.get(`[data-cy=no-answer-sign-study-question-11]`).should('not.exist');
        lastId -= 2;
        cy.wrap(lastId);
      });
    });

    describe('DELETE SINGLE QUESTION - CANCELï»¿ï»¿', () => {
      before(() => {
        cy.wait(3000);
      });

      it('Click on trash icon on a question should show confirmation modal', () => {
        cy.get(`[data-cy=delete-question-8]`).click();
        cy.get('[data-cy=confirmation-delete-modal]').should('be.visible');
      });

      it('Cancel the modal should not delete the question', () => {
        cy.get('[data-cy=confirmModal-cancelButton]').click();
        cy.get(`[data-cy=no-answer-sign-study-question-8]`).should('be.visible');
      });
    });

    describe('DELETE SINGLE QUESTION - CONFIRM ï»¿ ï»¿', () => {
      it('Click on trash icon on a question should show confirmation modal', () => {
        cy.wrap(lastId).then(() => {
          cy.wait(2000);
          cy.get(`[data-cy=delete-question-${lastId}]`).click();
          cy.get('[data-cy=confirmation-delete-modal]').should('be.visible');
        });
      });

      it('Confirm the confirmation modal should delete the question from canvas', () => {
        cy.wrap(lastId).then(() => {
          cy.get('[data-cy=confirmModal-confirmButton]').click();
          cy.get(`[data-cy=field-question-canvas-${lastId}]`).should('not.exist');
        });
      });
    });

    describe('DELETE ANOTHER QUESTION ON EDIT MODE', () => {
      it('Select a question and edit it', () => {
        cy.wait(2000);
        cy.get(`[data-cy=field-question-canvas-8]`).click();
        cy.get('[data-cy=right-menu-cancel-button]').click();
      });

      it('Click trash icon on another question should show warning notif', () => {
        cy.wait(1000);
        cy.get(`[data-cy=delete-question-10]`).click();
        cy.get('[data-cy=error-alert]').should('be.visible');
      });
    });

    describe('DELETE CURENT QUESTION ON EDIT MODE', () => {
      before(() => {
        cy.wait(3000);
      });

      it('Click trash icon on the current question should show confirm modal', () => {
        cy.get(`[data-cy=delete-question-8]`).click();
        cy.get('[data-cy=confirmation-delete-modal]').should('be.visible');
      });

      it('Confirm delete the question and right menu should only show library tab', () => {
        cy.get('[data-cy=confirmModal-confirmButton]').click();
        cy.get('[data-cy=right-menu-properties-tab]').should('not.exist');
      });
    });
  },
);
