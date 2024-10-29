import {
  GetVisitTemplateListDocument,
  IVisitTemplate,
  CreateFormDocument,
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
    let newCreatedQuestion2: IFormFieldGroup = {} as IFormFieldGroup;

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

    describe('MOVING A FIELD INSIDE A GROUP TO CANVAS ï»¿(MAKE A NEW GROUP) ï»¿ï»¿', () => {
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
              cy.get(`[data-cy=form-${result?.response?.body.data.createForm.id}]`).should(
                'be.visible',
              );
            }
          });
        });
      });

      it('Make sure there is a multi fields group question on canvas', () => {
        cy.dragAndDrop('[data-cy=stock-drag-0]', '[data-cy=add-new-question-page]').then(() => {
          lastId += 2;
          cy.wrap(lastId).then(() => {
            cy.get(`[data-cy=field-question-canvas-${lastId}]`).should('be.visible');
            cy.checkActiveQuestionFieldUI(`field-card-container-${lastId}`);
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
                cy.wait(1000);
                cy.get('[data-cy=right-menu-library-tab]').click();
                cy.wait(1000);
                cy.dragAndDrop('[data-cy=stock-drag-0]', '[data-cy=add-new-question-page]', 200);
                lastId += 2;

                cy.get(`[data-cy=field-question-canvas-${lastId}]`).should('be.visible');
                cy.checkActiveQuestionFieldUI(`field-card-container-${lastId}`);

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
                  cy.wait(1000);
                  newCreatedQuestion1 = result?.response?.body.data.createFormFieldGroup[1];
                  cy.wrap(newCreatedQuestion1).then(() => {
                    cy.get('[data-cy=right-menu-library-tab]').click();
                    cy.wait(1000);
                    cy.dragAndDrop(
                      '[data-cy=stock-drag-0]',
                      '[data-cy=add-new-question-page]',
                      400,
                    );
                  });
                  lastId += 2;

                  cy.wrap(lastId).then(() => {
                    cy.get(`[data-cy=field-question-canvas-${lastId}]`).should('be.visible');
                    cy.checkActiveQuestionFieldUI(`field-card-container-${lastId}`);

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
                      cy.wait(2000);
                      cy.get('[data-cy=right-menu-library-tab]').click();
                      cy.wait(1000);
                      cy.dragAndDrop(
                        '[data-cy=stock-drag-0]',
                        '[data-cy=add-new-question-page]',
                        580,
                      );
                      lastId += 2;
                      cy.wrap(lastId).then(() => {
                        cy.get(`[data-cy=field-question-canvas-${lastId}]`).should('be.visible');
                        cy.checkActiveQuestionFieldUI(`field-card-container-${lastId}`);

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
                        cy.get('[data-cy=question-attributes-attr-markAsNoAnswer]').check();
                        // 17 dan 21
                        cy.saveCreateQuestion().then((res) => {
                          newCreatedQuestion2 = res?.response?.body.data.createFormFieldGroup[3];

                          cy.wait(2000);
                          cy.get(`[data-cy=field-question-canvas-8]`).click();
                          cy.get('body')
                            .type(isMac ? '{meta}' : '{ctrl}', { release: false })
                            .get(`[data-cy=field-question-canvas-10]`)
                            .click()
                            .get(`[data-cy=field-question-canvas-12]`)
                            .click()
                            .get(`[data-cy=field-question-canvas-14]`)
                            .click();
                          cy.get('body').type(isMac ? '{meta}' : '{ctrl}');
                          cy.get('[data-cy=merge-unmerge-button]').click();
                          cy.wait(1000);
                          lastId -= 3;
                          cy.wait(2000);
                        });
                      });
                    });
                  });
                });
              }
            });
          });
        });
      });

      it('Drag a field in the group to outside should show the question on the canvas as a group and remove the question from source group', () => {
        cy.wrap([lastId, newCreatedQuestion1]).then(() => {
          cy.get(`[data-cy=arrow-collapse-question-7]`).click();
          cy.wait(1000);
          cy.dragAndDrop(
            `[data-cy=field-question-canvas-${lastId - 2}]`,
            '[data-cy=group-question-canvas-7]',
            -90,
          ).then(() => {
            lastId += 1;
            cy.checkQuestionAttributes('uneditable', 'both', newCreatedQuestion1, 0);
            cy.get(`[data-cy=no-answer-sign-study-question-8]`).should('be.visible');
            cy.wrap(lastId);
          });
        });
      });
    });

    describe('MOVING MULTI FIELDS FROM A GROUP TO CANVAS', () => {
      before(() => {
        cy.wait(3000);
      });
      it('Make sure there is a multi fields group question on canvas', () => {
        cy.get(`[data-cy=arrow-collapse-question-9]`).click();
        cy.wait(1000);
        cy.get(`[data-cy=field-question-canvas-10]`).click();
        cy.get('body')
          .type(isMac ? '{meta}' : '{ctrl}', { release: false })
          .get(`[data-cy=field-question-canvas-12]`)
          .click();
        cy.get('body').type(isMac ? '{meta}' : '{ctrl}');
      });

      it('Drag multi fields from existing group to the canvas should show the dragged question on the canvas and should remove the question from the source group', () => {
        cy.dragAndDrop(
          `[data-cy=field-question-canvas-10]`,
          '[data-cy=field-question-canvas-8]',
          90,
        ).then(() => {
          lastId += 1;
        });
      });
    });

    describe('MOVING MULTI FIELDS FROM DIFFERENT GROUP TO CANVAS', () => {
      it('Make sure there are more than 1 multi fields group on canvas', () => {
        cy.wait(2000);
        cy.wrap(lastId).then(() => {
          cy.get(`[data-cy=field-question-canvas-${lastId}]`).click();
          cy.get('body')
            .type(isMac ? '{meta}' : '{ctrl}', { release: false })
            .get(`[data-cy=field-question-canvas-8]`)
            .click();
          cy.get('body').type(isMac ? '{meta}' : '{ctrl}');
          cy.get('[data-cy=merge-unmerge-button]').click();
          cy.wait(1000);
          lastId -= 1;
        });
      });

      it('Select fields from each group and drag it out to canvas should show the dragged fields having a new separate group on canvas ', () => {
        cy.get(`[data-cy=arrow-collapse-question-10]`).click();
        cy.wait(1000);
        cy.wrap(lastId).then(() => {
          cy.get(`[data-cy=field-question-canvas-8]`).click();
          cy.get('body')
            .type(isMac ? '{meta}' : '{ctrl}', { release: false })
            .get(`[data-cy=field-question-canvas-${lastId}]`)
            .click();
          cy.get('body').type(isMac ? '{meta}' : '{ctrl}');
          cy.dragAndDrop(
            `[data-cy=field-question-canvas-${lastId}]`,
            '[data-cy=group-question-canvas-10]',
            -80,
          ).then(() => {
            lastId += 1;
            cy.wrap(lastId).then(() => {
              cy.wait(2000);
              cy.get(`[data-cy=field-question-canvas-${lastId - 2}]`).click();
              cy.get(`[data-cy=no-answer-sign-study-question-${lastId - 2}]`).should('be.visible');
            });
          });
        });
      });
    });

    describe('ï»¿ï»¿UNMERGE QUESTION', () => {
      it('Click on a group of question fields should show bottom buttons (Unmerge, cancel, delete all)', () => {
        cy.get(`[data-cy=field-question-canvas-10]`).click();
        cy.get('body')
          .type(isMac ? '{meta}' : '{ctrl}', { release: false })
          .get(`[data-cy=field-question-canvas-8]`)
          .click()
          .get(`[data-cy=field-question-canvas-13]`)
          .click();
        cy.get('body').type(isMac ? '{meta}' : '{ctrl}');
        cy.get('[data-cy=bottom-question-canvas-quick-action]').should('be.visible');
        cy.get('[data-cy=merge-unmerge-button]').click();
        cy.wait(2000);
      });

      it('Click unmerge will separate field from the group into a separate group on the canvas', () => {
        cy.get('[data-cy=merge-unmerge-button]').click();
      });
    });
  },
);
