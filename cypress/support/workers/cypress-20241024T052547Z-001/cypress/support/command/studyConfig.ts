import {
  ICreateStudyMutationVariables,
  IForm,
  IFormFieldGroup,
  IFormFieldType,
  CreateFormFieldGroupDocument,
  UpdateFormFieldGroupDocument,
  IFormDetailsFragment,
} from '../../../src/graphQL/generated/graphql';
import Colors from '../../../src/constant/Colors';

// CREATE NEW STUDY

const optionStudySubject = [
  {
    value: 'Subject',
    label: 'Subject',
  },
  {
    value: 'Study Subject',
    label: 'Study Subject',
  },
];

Cypress.Commands.add('defaultCreateStudy', () => {
  cy.get('#create-study').click();
  cy.react('Modal', {
    props: {
      id: 'modal-create-study',
      visible: true,
    },
  });
  cy.checkInputIfEmpty();
});

Cypress.Commands.add('fillCreateStudy', (createStudyData: ICreateStudyMutationVariables | any) => {
  const createStudyForm = cy.get('#create-study-form');
  createStudyForm.within(() => {
    cy.get('.study-organization').click().type('{downarrow}{downarrow}{enter}');
    cy.get('.study-operating-organization').click().type('{downarrow}{downarrow}{enter}');
    cy.get('input[name="studyName"]').type(createStudyData.studyName);
    cy.get('.study-subject').click().type('{downarrow}{downarrow}{enter}');
    cy.get('input[name="studyProtocol"]').type(createStudyData.studyProtocol);
    cy.get('textarea[name="studyDescription"]').type(createStudyData.studyDescription);
    createStudyData.components.map((comp: any, index: number) => {
      cy.get(`[data-cy=firstInput-${index}]`).type(comp.firstInput);
      if (comp.secondInput !== undefined) {
        cy.get(`[data-cy=secondInput-${index}]`).type(comp.secondInput);
      }
    });
    cy.get('input[name="patientStudyIdDescription"]')
      .type('{selectall}{backspace}')
      .type(String(createStudyData.studyIdExample));
  });

  cy.get('.study-organization').contains('Pfizer');
  cy.get('.study-operating-organization').contains('Pfizer');
  cy.get('input[name="studyName"]').should('have.value', createStudyData.studyName);
  cy.get('.study-subject').contains('Subject');
  cy.get('input[name="studyProtocol"]').should('have.value', createStudyData.studyProtocol);
  cy.get('textarea[name="studyDescription"]').should(
    'have.value',
    createStudyData.studyDescription,
  );
  createStudyData.components.map((comp: any, index: number) => {
    cy.get(`[data-cy=firstInput-${index}]`).should('have.value', comp.firstInput);
    if (comp.secondInput !== undefined) {
      cy.get(`[data-cy=secondInput-${index}]`).should('have.value', comp.secondInput);
    }
  });
  cy.get('input[name="patientStudyIdDescription"]').should(
    'have.value',
    createStudyData.studyIdExample,
  );
});

Cypress.Commands.add('checkInputIfEmpty', () => {
  cy.get('input[name="studyName"]').should('have.value', '');
  cy.get('.study-subject').click();
  cy.get('.ant-select-item-option-content')
    .each((element, index) => {
      cy.wrap(element).should('have.text', optionStudySubject[index].label);
    })
    .should('have.value', '');
  cy.get('input[name="studyProtocol"]').should('have.value', '');
  cy.get('textarea[name="studyDescription"]').should('have.value', '');
  cy.get('input[name="firstInput"]').should('have.value', '');
  cy.get('input[name="secondInput"]').should('have.value', '');
  cy.get('input[name="patientStudyIdDescription"]').should('have.value', '');
});

// FORM
Cypress.Commands.add('openEditFormRightMenu', (form: IForm) => {
  cy.get(`[data-cy=form-${form.id}]`).realHover();
  cy.get(`[data-cy=form-${form.id}-edit]`).should('be.visible');
  cy.get(`[data-cy=form-${form.id}-edit]`).click();
  cy.get('[data-cy=right-side-bar]').should('be.visible');
  cy.get('[data-cy=create-edit-form]').should('be.visible');
});

Cypress.Commands.add('checkFormDefaultPreFilled', (form: IFormDetailsFragment) => {
  cy.get('input[name=formName]').should('have.value', form.name);
  cy.get('input[name=formName]').click();
  cy.get(`[data-cy=input-instruction-form-name-input]`).should('contain', `${form.name.length}/35`);
});

Cypress.Commands.add('checkEditFormStudySettingsDefault', (form: IForm) => {
  cy.get(`[data-cy=edit-card-${form.id}]`).click({ force: true });
  cy.checkFormDefaultPreFilled(form);
  cy.checkSubmitButtonActive('study-setting-save-button');
});

Cypress.Commands.add('checkEditFormStudySettingsAndSubmit', (form: IForm) => {
  cy.get('input[name=formName]').clear();
  cy.get('input[name=formName]').type('Form edit setting');
  cy.get('[data-cy=study-setting-save-button]').click();
  cy.get(`[data-cy=study-setting-card-list-name-${form.id}]`).should(
    'contain',
    'Form edit setting',
  );
});

Cypress.Commands.add('checkEditFormStudySettingsAndCancel', (form: IForm) => {
  cy.get(`[data-cy=edit-card-${form.id}]`).click({ force: true });
  cy.get('input[name=formName]').clear();
  cy.get('[data-cy=study-setting-cancel-button]').click();
  cy.get(`[data-cy=study-setting-card-list-name-${form.id}]`).should('contain', form.name);
});

Cypress.Commands.add('dragAndDrop', (subject, target, yPos?) => {
  Cypress.log({
    name: 'DRAGNDROP',
    message: `Dragging element ${subject} to ${target}`,
    consoleProps: () => {
      return {
        subject: subject,
        target: target,
      };
    },
  });
  const BUTTON_INDEX = 0;
  const SLOPPY_CLICK_THRESHOLD = 10;
  cy.wrap([BUTTON_INDEX, SLOPPY_CLICK_THRESHOLD]).then(() => {
    cy.get(target)
      .first()
      .then(($target) => {
        const coordsDrop = $target[0].getBoundingClientRect();
        cy.get(subject)
          .first()
          .then((subject) => {
            const coordsDrag = subject[0].getBoundingClientRect();
            cy.wrap(subject)
              .trigger('mousedown', {
                button: BUTTON_INDEX,
                clientX: coordsDrag.x,
                clientY: coordsDrag.y,
                force: true,
              })
              .trigger('mousemove', {
                button: BUTTON_INDEX,
                clientX: coordsDrag.x + SLOPPY_CLICK_THRESHOLD,
                clientY: coordsDrag.y,
                force: true,
              });
            cy.get('body')
              .trigger('mousemove', {
                button: BUTTON_INDEX,
                clientX: coordsDrop.x,
                clientY: coordsDrop.y + (yPos ? yPos : 0),
                force: true,
              })
              .trigger('mouseup');
          });
      });
  });
});

Cypress.Commands.add('checkActiveQuestionFieldUI', (dataCy, source?: 'stock') => {
  let colorSplitBackground = Colors.secondary.pebbleGrey50.split(',');
  colorSplitBackground = colorSplitBackground.splice(0, colorSplitBackground.length - 1);

  let colorSplitBorder = Colors.secondary.tealGreen75.split(',');

  if (source === 'stock') {
    colorSplitBorder = Colors.primary.violetBlue100.split(',');
  }

  colorSplitBorder = colorSplitBorder.splice(0, colorSplitBorder.length - 1);

  cy.wrap(colorSplitBackground).then(() => {
    cy.get(`[data-cy=${dataCy}]`)
      .scrollIntoView()
      .realHover()
      .should('have.css', 'background-color', `${colorSplitBackground.join(', ')})`)
      .should(
        'have.css',
        'border',
        source === 'stock'
          ? `1px solid ${`${colorSplitBorder.join(', ')})`}`
          : `3px solid ${`${colorSplitBorder.join(', ')})`}`,
      );
  });
});

Cypress.Commands.add(
  'openCollapseQuestionDetails',
  (type: 'group' | 'field', withAnswer?: boolean) => {
    cy.get('[data-cy=collapse-question-details]').click();
    if (type === 'group') {
      cy.get('[data-cy=collapse-question-data-entry]').click();
    }
    cy.get('[data-cy=collapse-question-type]').click();
    if (withAnswer) {
      cy.get('[data-cy=collapse-question-answers-0]').click();
      cy.get('[data-cy=collapse-question-answers-1]').click();
    } else {
      cy.get('[data-cy=collapse-question-answers]').should('not.exist');
    }
  },
);

Cypress.Commands.add(
  'checkQuestionAttributes',
  (
    type: 'editable' | 'uneditable',
    questionType: 'group' | 'field' | 'both',
    FFG: IFormFieldGroup,
    FFIndex: number,
  ) => {
    if (type === 'editable') {
      if (FFG.requiresSecondDataEntry && questionType !== 'field') {
        cy.get('[data-cy=question-attributes-attr-secondDataEntry]').should('be.checked');
      } else {
        cy.get('[data-cy=question-attributes-attr-secondDataEntry]').should('not.be.checked');
      }
      if (FFG.requiresVerification && questionType !== 'field') {
        cy.get('[data-cy=question-attributes-attr-verificationReq]').should('be.checked');
      } else {
        cy.get('[data-cy=question-attributes-attr-verificationReq]').should('not.be.checked');
      }
      if (FFG.requiresSourceCapture === false && questionType !== 'field') {
        cy.get('[data-cy=question-attributes-attr-noSCNeeded]').should('be.checked');
      } else {
        cy.get('[data-cy=question-attributes-attr-noSCNeeded]').should('not.be.checked');
      }
      if (FFG.isMultiEntry && questionType !== 'field') {
        cy.get('[data-cy=question-attributes-attr-allowMultiEntry]').should('be.checked');
      } else {
        cy.get('[data-cy=question-attributes-attr-allowMultiEntry]').should('not.be.checked');
      }

      if (FFG.fields[FFIndex].prepopulateFromPreviousVisit && questionType !== 'group') {
        cy.get('[data-cy=question-attributes-attr-usePrevEntry]').should('be.checked');
      } else {
        cy.get('[data-cy=question-attributes-attr-usePrevEntry]').should('not.be.checked');
      }
      if (FFG.fields[FFIndex].allowNotAvailable && questionType !== 'group') {
        cy.get('[data-cy=question-attributes-attr-markAsNoAnswer]').should('be.checked');
      } else {
        cy.get('[data-cy=question-attributes-attr-markAsNoAnswer]').should('not.be.checked');
      }
      if (FFG.fields[FFIndex].requireUniqueEntry && questionType !== 'group') {
        cy.get('[data-cy=question-attributes-attr-reqUnique]').should('be.checked');
      } else {
        if (FFG.fields[FFIndex].type === IFormFieldType.SingleChoice) {
          cy.get('[data-cy=question-attributes-attr-reqUnique]').should('not.be.checked');
        }
      }
    } else {
      if (FFG.fields[FFIndex].allowNotAvailable && questionType !== 'group') {
        cy.get(`[data-cy=question-attributes-markAsNoAnswer]`).should('be.checked');
      } else {
        cy.get(`[data-cy=question-attributes-markAsNoAnswer]`).should('not.exist');
      }

      if (
        FFG.fields[FFIndex].requireUniqueEntry &&
        FFG.fields[FFIndex].type === IFormFieldType.SingleChoice &&
        questionType !== 'group'
      ) {
        cy.get(`[data-cy=question-attributes-reqUnique]`).should('be.checked');
      } else {
        cy.get(`[data-cy=question-attributes-reqUnique]`).should('not.exist');
      }

      if (FFG.fields[FFIndex].prepopulateFromPreviousVisit && questionType !== 'group') {
        cy.get(`[data-cy=question-attributes-usePrevEntry]`).should('be.checked');
      } else {
        cy.get(`[data-cy=question-attributes-usePrevEntry]`).should('not.exist');
      }

      if (FFG.isMultiEntry && questionType !== 'field') {
        cy.get(`[data-cy=question-attributes-allowMultiEntry]`).should('be.checked');
      } else {
        cy.get(`[data-cy=question-attributes-allowMultiEntry]`).should('not.exist');
      }

      if (FFG.requiresSourceCapture === false && questionType !== 'field') {
        cy.get('[data-cy=question-attributes-attr-noSCNeeded]').should('be.checked');
      } else {
        cy.get('[data-cy=question-attributes-attr-noSCNeeded]').should('not.exist');
      }

      if (FFG.requiresSecondDataEntry && questionType !== 'field') {
        cy.get(`[data-cy=question-attributes-secondDataEntry]`).should('be.checked');
      } else {
        cy.get(`[data-cy=question-attributes-secondDataEntry]`).should('not.exist');
      }

      if (FFG.requiresVerification && questionType !== 'field') {
        cy.get(`[data-cy=question-attributes-verificationReq]`).should('be.checked');
      } else {
        cy.get(`[data-cy=question-attributes-verificationReq]`).should('not.exist');
      }
    }
  },
);

Cypress.Commands.add(
  'fillInQuestionDetails',
  (
    lastId: number,
    data: {
      shortQuestion: string;
      question: string;
      oid: string;
      keyword: string;
    },
    FFType: IFormFieldType,
    type: 'field' | 'group',
    noSCNeeded?,
  ) => {
    if (type === 'group' && noSCNeeded) {
      cy.get('[data-cy=question-attributes-attr-noSCNeeded]').check({ force: true });
    }
    cy.get(`[data-cy=long-question-input-${lastId}]`)
      .clear({ force: true })
      .type(data.question, { force: true });
    cy.get(`[data-cy=short-question-input-${lastId}]`)
      .clear({ force: true })
      .type(data.shortQuestion, { force: true });
    cy.get(`[data-cy=oid-input-${lastId}]`).clear({ force: true }).type(data.oid, { force: true });
    cy.get(`[data-cy=short-question-top-${lastId}]`).should('have.text', data.shortQuestion);
    if (FFType === IFormFieldType.FreeText) {
      cy.get(`[data-cy=textfield-container-stock-input-${lastId}] label`).should(
        'contain',
        data.shortQuestion,
      );
    }
    if (!noSCNeeded) {
      cy.get(`[data-cy=keyword-question-input-${lastId}]`)
        .clear({ force: true })
        .type(data.keyword);
    }
  },
);

Cypress.Commands.add('clearQuestionDetails', (lastId: number) => {
  cy.wrap(lastId).then(() => {
    cy.get(`[data-cy=long-question-input-${lastId}]`).clear({ force: true });
    cy.get(`[data-cy=short-question-input-${lastId}]`).clear({ force: true });
    cy.get(`[data-cy=keyword-question-input-${lastId}]`).clear();
  });
});

Cypress.Commands.add('fillInQuestionAnswers', (ids?: string[]) => {
  cy.wrap(ids).then(() => {
    if (ids) {
      ids.map((id) => {
        cy.get(`textarea[name="answer-${id}"]`).type('answer', { force: true });
      });
    } else {
      cy.get('textarea[name="answer-1"]').type('answer', { force: true });
      cy.get('textarea[name="answer-2"]').type('answer', { force: true });
    }
  });
});

Cypress.Commands.add('saveCreateQuestion', () => {
  const aliasCreateFormFieldGroupDocument = CreateFormFieldGroupDocument.definitions[0].name.value;

  cy.intercept('POST', '/graphql', (req) => {
    if (req.body.operationName === aliasCreateFormFieldGroupDocument) {
      req.alias = req.body.operationName;
    }
  });
  cy.get('[data-cy=right-menu-save-button]').click();
  cy.wait(`@${aliasCreateFormFieldGroupDocument}`).then((result) => {
    return result;
  });
});

Cypress.Commands.add('saveUpdateQuestion', () => {
  const aliasUpdateFormFieldGroupDocument = UpdateFormFieldGroupDocument.definitions[0].name.value;
  cy.intercept('POST', '/graphql', (req) => {
    if (req.body.operationName === aliasUpdateFormFieldGroupDocument) {
      req.alias = req.body.operationName;
    }
  });
  cy.get('[data-cy=right-menu-save-button]').click();
  cy.wait(`@${aliasUpdateFormFieldGroupDocument}`).then((result) => {
    return result;
  });
});

// copy of cy.fillCreateStudy with a tweak don't disturb the original function.
function _fillCreateStudy(
  createStudyData: Pick<ICreateStudyMutationVariables, 'studyName' | 'studyProtocol'> & {
    studyDescription: string;
    components: Array<unknown>;
    studyIdExample: string;
  },
) {
  cy.get('#create-study-form').within(() => {
    // NOTE: we clicked twice because we want to add the input box provided
    cy.get('#add-component').children().click();
    cy.get('#add-component').children().click();

    cy.get('[data-cy=firstInput-0]').type('1');
    cy.get('[data-cy=firstInput-1]').type('1');
    cy.get('[data-cy=firstInput-2]').type('1');

    cy.get('.study-organization').click().type('{downarrow}{downarrow}{enter}');
    cy.get('.study-operating-organization').click().type('{downarrow}{downarrow}{enter}');
    cy.get('input[name="studyName"]').type(createStudyData.studyName);
    cy.get('.study-subject').click().type('{downarrow}{downarrow}{enter}');
    cy.get('input[name="studyProtocol"]').type(createStudyData.studyProtocol);
    cy.get('textarea[name="studyDescription"]').type(createStudyData.studyDescription);
    createStudyData.components.map((comp: any, index: number) => {
      cy.get(`[data-cy=firstInput-${index}]`).type(comp.firstInput);
      if (comp.secondInput !== undefined) {
        cy.get(`[data-cy=secondInput-${index}]`).type(comp.secondInput);
      }
    });
    cy.get('input[name="patientStudyIdDescription"]')
      .type('{selectall}{backspace}')
      .type(String(createStudyData.studyIdExample));
  });

  cy.get('.study-organization').contains('Pfizer');
  cy.get('.study-operating-organization').contains('Pfizer');
  cy.get('input[name="studyName"]').should('have.value', createStudyData.studyName);
  cy.get('.study-subject').contains('Subject');
  cy.get('input[name="studyProtocol"]').should('have.value', createStudyData.studyProtocol);
  cy.get('textarea[name="studyDescription"]').should(
    'have.value',
    createStudyData.studyDescription,
  );
  createStudyData.components.map((comp: any, index: number) => {
    cy.get(`[data-cy=firstInput-${index}]`).should('have.value', comp.firstInput);
    if (comp.secondInput !== undefined) {
      cy.get(`[data-cy=secondInput-${index}]`).should('have.value', comp.secondInput);
    }
  });
  cy.get('input[name="patientStudyIdDescription"]').should(
    'have.value',
    createStudyData.studyIdExample,
  );
}

Cypress.Commands.add(
  'createStudy',
  ({
    name = 'default',
    visitCount = 0,
    formCount = 0,
  }: {
    name: string;
    visitCount: number;
    formCount: number;
  }) => {
    cy.waitForReact();
    cy.defaultCreateStudy();
    _fillCreateStudy({
      studyName: name,
      studyProtocol: name,
      studyDescription: 'MKR',
      studyIdExample: 'MKR',
      components: [],
    });
    cy.get('#automaticRegex > label > span ').click();
    cy.get('#btn-submit').click();
    if (visitCount > 0 && formCount > 0) {
      cy.get(`[data-cy=cell-${formCount}-${visitCount}]`).click();
    }
  },
);
