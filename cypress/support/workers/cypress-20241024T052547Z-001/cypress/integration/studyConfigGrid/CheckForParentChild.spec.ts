import {
  DeleteFormGridDocument,
  DeleteVisitTemplateDocument,
} from '../../../src/graphQL/generated/graphql';

// TODO: make new GRIDVIEW TEST
xdescribe('Check for parent child', () => {
  const textForExsitingParentChildForm =
    'You are deleting a form that has dependencies. Deleting this form will disconnect them. Are you sure?';
  const textForExsitingParentChildVisit =
    'You are deleting a visit that has dependencies. Deleting this visit will disconnect them. Are you sure?';

  const aliasing = {
    deleteForm: DeleteFormGridDocument,
    removeVisitTemplate: DeleteVisitTemplateDocument,
  };

  let lastId = 6;

  let questionGroups = [
    {
      shortQuestion: 'Q 1',
      question: 'Q 1',
      keyword: 'Q 1',
    },
    {
      shortQuestion: 'Q 2',
      question: 'Q 2',
      keyword: 'Q 2',
    },
  ];

  const goToStudyConfigGrid = (): void => {
    cy.get('[data-cy=grid-view]').click();
  };

  before(() => {
    cy.clearLocalStorage();
    cy.reseedDB();
    cy.fillInloginAsFormV2(
      {
        email: 'admin@example.com',
      },
      'studyTestId2',
      'study1revisionDev1a',
    );
    cy.visit('/study/study1revisionDev1a');
  });

  describe('Create new question with parent child', () => {
    it('Drag single choice question to Question', () => {
      cy.wait(5000);
      cy.get('[data-cy=right-menu-library-tab]').click();

      cy.dragAndDrop('[data-cy=field-card-1]', '[data-cy=add-new-question-page]');
      lastId += 2;
    });

    it('Fill the question properties', () => {
      const { shortQuestion, question, keyword } = questionGroups[0];
      cy.get(`[data-cy=question-attributes-attr-noSCNeeded]`).check({ force: true });
      cy.get(`[data-cy=long-question-input-${lastId}]`)
        .clear({ force: true })
        .type(question, { force: true });
      cy.get(`[data-cy=short-question-input-${lastId}]`)
        .clear({ force: true })
        .type(shortQuestion, { force: true });
      cy.get(`[data-cy=short-question-top-${lastId}]`).should('have.text', shortQuestion);
      cy.get(`[data-cy=question-attributes-children-visits-1]`).click();
      cy.get('[data-cy=select-container]').should('be.visible').type('{downarrow}{enter}');
      cy.saveCreateQuestion().then(() => {
        cy.wait(1000).get('[data-cy=alert-success]').should('be.visible');
      });
    });
  });

  describe('Check parent child in the grid view', () => {
    before(() => goToStudyConfigGrid());

    it('Check delete popup description if form has parents or childs', () => {
      const aliasDelete = aliasing.deleteForm.definitions[0].name.value;
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasDelete) {
          req.alias = req.body.operationName;
        }
      });

      const selectFormNum = 0;
      const formTitleText = cy
        .get('[data-cy=header-form-cell]')
        .eq(selectFormNum)
        .find('.cell p')
        .eq(0)
        .invoke('text');

      cy.get('[data-cy=header-form-cell]')
        .eq(selectFormNum)
        .realHover({ scrollBehavior: 'center', position: 'left' })
        .get('[data-cy=header-form-cell]')
        .eq(selectFormNum)
        .find('.cell')
        .wait(3000)
        .trigger('click')
        .wait(3000)
        .get('.quick-actions-container.show')
        .should('exist')
        .get('.quickactions_delete')
        .realClick({ position: 'center' });

      cy.get('[data-cy=confirmation-modal-desc]').should(
        'contain.text',
        textForExsitingParentChildForm,
      );

      cy.get('.gridview-confirm')
        .should('exist')
        .get('[data-cy=confirmModal-cancelButton]')
        .click();
    });

    it("Check popup description if form doesn't have parents or childs", () => {
      const aliasDelete = aliasing.deleteForm.definitions[0].name.value;
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasDelete) {
          req.alias = req.body.operationName;
        }
      });

      const selectFormNum = 0;
      const formTitleText = cy
        .get('[data-cy=header-form-cell]')
        .eq(selectFormNum)
        .find('.cell p')
        .eq(0)
        .invoke('text');

      cy.get('[data-cy=header-form-cell]')
        .eq(selectFormNum - 1)
        .realHover({ scrollBehavior: 'center', position: 'left' })
        .get('[data-cy=header-form-cell]')
        .eq(selectFormNum)
        .find('.cell')
        .wait(3000)
        .trigger('click')
        .wait(3000)
        .get('.quick-actions-container.show')
        .should('exist')
        .get('.quickactions_delete')
        .realClick({ position: 'center' });

      cy.get('[data-cy=confirmation-modal-desc]').should(
        'contain.text',
        textForExsitingParentChildForm,
      );

      cy.get('.gridview-confirm')
        .should('exist')
        .get('[data-cy=confirmModal-cancelButton]')
        .click();
    });

    it('Should delete the visit connected to form with dependencies', () => {
      const aliasDelete = aliasing.removeVisitTemplate.definitions[0].name.value;
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasDelete) {
          req.alias = req.body.operationName;
        }
      });

      const selectVisitNum = 0;
      const visitTitleText = cy
        .get('[data-cy=header-visit-cell]')
        .eq(selectVisitNum)
        .find('.cell p')
        .eq(0)
        .invoke('text');

      cy.get('[data-cy=header-visit-cell]')
        .eq(selectVisitNum)
        .realHover({ scrollBehavior: 'center', position: 'left' })
        .get('[data-cy=header-visit-cell]')
        .eq(selectVisitNum)
        .find('.cell')
        .wait(3000)
        .trigger('click')
        .wait(3000)
        .get('.quick-actions-container.show')
        .should('exist')
        .get('.quickactions_delete')
        .realClick({ position: 'center' });

      cy.get('[data-cy=confirmation-modal-desc]').should(
        'contain.text',
        textForExsitingParentChildVisit,
      );

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

    it('Should check the delete popup description of first visit that has parents or childs', () => {
      const aliasDelete = aliasing.removeVisitTemplate.definitions[0].name.value;
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasDelete) {
          req.alias = req.body.operationName;
        }
      });

      const selectVisitNum = 0;
      const visitTitleText = cy
        .get('[data-cy=header-visit-cell]')
        .eq(selectVisitNum)
        .find('.cell p')
        .eq(0)
        .invoke('text');

      cy.get('[data-cy=header-visit-cell]')
        .eq(selectVisitNum)
        .realHover({ scrollBehavior: 'center', position: 'left' })
        .get('[data-cy=header-visit-cell]')
        .eq(selectVisitNum)
        .find('.cell')
        .wait(3000)
        .trigger('click')
        .wait(3000)
        .get('.quick-actions-container.show')
        .should('exist')
        .get('.quickactions_delete')
        .realClick({ position: 'center' });

      cy.get('[data-cy=confirmation-modal-desc]').should(
        'not.contain.text',
        textForExsitingParentChildVisit,
      );

      cy.get('.gridview-confirm')
        .should('exist')
        .get('[data-cy=confirmModal-cancelButton]')
        .click();
    });

    it("Check popup description if visit doesn't have parents or childs", () => {
      const aliasDelete = aliasing.removeVisitTemplate.definitions[0].name.value;
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasDelete) {
          req.alias = req.body.operationName;
        }
      });

      const selectVisitNum = 0;
      const visitTitleText = cy
        .get('[data-cy=header-visit-cell]')
        .eq(selectVisitNum)
        .find('.cell p')
        .eq(0)
        .invoke('text');

      cy.wait(3000)
        .get('[data-cy=header-visit-cell]')
        .eq(selectVisitNum)
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

      cy.get('[data-cy=confirmation-modal-desc]').should(
        'not.contain.text',
        textForExsitingParentChildVisit,
      );

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

  describe('Checking parent & child of form & visit cell check', () => {
    it('Should check all related parent & child when checking on 1 visit with a form that has Childrens/Parents', () => {
      cy.visit('/study/study1revisionDev2e/templateScreeningRev2eDev/consentRev2eDevId1');
      cy.wait(5000);
      goToStudyConfigGrid();
      cy.wait(3000).get('[data-cy=cell-3x3] > .cell > .ant-btn').click();
      cy.wait(500).get('[data-cy=cell-4x3] > .cell > .ant-btn > .undefined > path').should('exist');
      cy.wait(500).get('[data-cy=cell-5x3] > .cell > .ant-btn > .undefined > path').should('exist');
    });
  });
});
