import { IFormFieldGroup, IFormFieldType } from '../../../src/graphQL/generated/graphql';

const generateFieldTypeToName = (type: IFormFieldType) => {
  switch (type) {
    case IFormFieldType.FreeText:
      return 'Free Text';
    case IFormFieldType.SingleChoice:
      return 'Single Choice';
    case IFormFieldType.MultipleChoice:
      return 'Multiple Choice';
    case IFormFieldType.Datetime:
      return 'DateTime';
    case IFormFieldType.Date:
      return 'Date';
    case IFormFieldType.Time:
      return 'Time';
    case IFormFieldType.File:
      return 'Upload';
    case IFormFieldType.Numeric:
      return 'Numeric';
    default:
      return '';
  }
};
const filterQuestion = (dataFFG: IFormFieldGroup | any) => {
  const search = 'yes';
  let isInAnswer = false;
  const isInFFTitle = dataFFG.fields.some((field) =>
    field.shortQuestion.toLowerCase().includes(search.toLowerCase()),
  );
  dataFFG.fields.map((field) => {
    field.choices.map((answer) => {
      if (answer.value.toLowerCase().includes(search.toLowerCase())) {
        isInAnswer = true;
      }
    });
  });

  if (
    dataFFG.question.toLowerCase().includes(search.toLowerCase()) ||
    dataFFG.shortQuestion.toLowerCase().includes(search.toLowerCase()) ||
    isInAnswer ||
    isInFFTitle
  ) {
    return dataFFG;
  }
  // return;
};

Cypress.Commands.add('checkDetailQuestion', (dataFFG, string?) => {
  cy.wrap(dataFFG).each((el) => {
    if (el.fields.length === 1) {
      const visitTemplateList = Array.from(
        new Set(
          el.formConnections.flatMap(({ form }) =>
            form.visitTemplateFormConnections
              .flatMap(({ visitTemplate }) => visitTemplate)
              .sort(({ type: typeA }, { type: typeB }) => {
                let orderTypeA = 0;
                let orderTypeB = 0;
                switch (typeA) {
                  case IVisitTemplateType.Scheduled:
                    orderTypeA = 1;
                    break;
                  case IVisitTemplateType.Hidden:
                    orderTypeA = 2;
                    break;
                  case IVisitTemplateType.AdHoc:
                    orderTypeA = 3;
                    break;
                }
                switch (typeB) {
                  case IVisitTemplateType.Scheduled:
                    orderTypeB = 1;
                    break;
                  case IVisitTemplateType.Hidden:
                    orderTypeB = 2;
                    break;
                  case IVisitTemplateType.AdHoc:
                    orderTypeB = 3;
                    break;
                }
                return orderTypeA - orderTypeB;
              })
              .sort(({ dayOffset: offsetA, type: typeA }, { dayOffset: offsetB, type: typeB }) => {
                if (typeA === IVisitTemplateType.Scheduled && typeA === typeB) {
                  return (offsetA || 0) - (offsetB || 0);
                } else {
                  return 0;
                }
              }),
          ),
        ),
      );
      cy.wrap(el.fields).each((formField) => {
        const propertiesVal: boolean =
          formField.prepopulateFromPreviousVisit ||
          formField.allowNotAvailable ||
          formField.requireUniqueEntry;
        const ffId = formField.id;
        cy.get(`[data-cy=ff-${ffId}]`).should('exist');
        cy.wait(500);
        cy.get(`[data-cy=ff-${ffId}] [data-cy=ff-title-${ffId}]`)
          .should('exist')
          .contains(`${formField.shortQuestion}`);
        cy.wait(500);
        cy.get(`[data-cy=ff-${ffId}] [data-cy=ff-type-${ffId}]`)
          .should('exist')
          .contains(`${generateFieldTypeToName(formField.type)}`);
        cy.wait(500);
        cy.get(`[data-cy=ff-${ffId}] [data-cy=ff-answer-text-${ffId}]`)
          .should('exist')
          .contains('Answer:');
        cy.wrap(formField.choices).each((answer, idx) => {
          cy.get(`[data-cy=ff-${ffId}] [data-cy=ff-answer-value-${ffId}-${idx}]`)
            .should('exist')
            .contains(`${answer.value}`);
          cy.wait(500);
        });
        cy.get(`[data-cy=ff-${ffId}] [data-cy=ff-visit-text-${ffId}]`)
          .should('exist')
          .contains('Visit:');
        cy.wrap(visitTemplateList).each((visitTemplate, idx) => {
          cy.get(`[data-cy=ff-${ffId}] [data-cy=ff-visit-value-${ffId}-${idx}]`)
            .should('exist')
            .contains(`${visitTemplate.name}`);
          cy.wait(500);
        });
        cy.get(`[data-cy=ff-${ffId}] [data-cy=ff-form-text-${ffId}]`)
          .should('exist')
          .contains('Forms:');
        cy.wrap(el.formConnections).each((formConnection, idx) => {
          cy.get(`[data-cy=ff-${ffId}] [data-cy=ff-form-value-${ffId}-${idx}]`)
            .should('exist')
            .contains(`${formConnection.form.name}`);
          cy.wait(500);
        });
        if (propertiesVal) {
          formField.prepopulateFromPreviousVisit &&
            cy
              .get(`[data-cy=ff-${ffId}] [data-cy=ff-properties-usePrevEntry-${ffId}]`)
              .should('exist')
              .contains('Use Previous Entry');
          formField.allowNotAvailable &&
            cy
              .get(`[data-cy=ff-${ffId}] [data-cy=ff-properties-allowNoAnswer-${ffId}]`)
              .should('exist')
              .contains('Mark as No Answer');
          formField.requireUniqueEntry &&
            cy
              .get(`[data-cy=ff-${ffId}] [data-cy=ff-properties-reqUnique2-${ffId}]`)
              .should('exist')
              .contains('Require unique (appears only if multi instance entry is selected)');
        }
      });
    } else {
      const propertiesFFGVal: boolean =
        el.requiresSourceCapture ||
        el.requiresSecondDataEntry ||
        el.requiresVerification ||
        el.isMultiEntry;
      const ffgId = el.id;
      const visitTemplateList = Array.from(
        new Set(
          el.formConnections.flatMap(({ form }) =>
            form.visitTemplateFormConnections
              .flatMap(({ visitTemplate }) => visitTemplate)
              .sort(({ type: typeA }, { type: typeB }) => {
                let orderTypeA = 0;
                let orderTypeB = 0;
                switch (typeA) {
                  case IVisitTemplateType.Scheduled:
                    orderTypeA = 1;
                    break;
                  case IVisitTemplateType.Hidden:
                    orderTypeA = 2;
                    break;
                  case IVisitTemplateType.AdHoc:
                    orderTypeA = 3;
                    break;
                }
                switch (typeB) {
                  case IVisitTemplateType.Scheduled:
                    orderTypeB = 1;
                    break;
                  case IVisitTemplateType.Hidden:
                    orderTypeB = 2;
                    break;
                  case IVisitTemplateType.AdHoc:
                    orderTypeB = 3;
                    break;
                }
                return orderTypeA - orderTypeB;
              })
              .sort(({ dayOffset: offsetA, type: typeA }, { dayOffset: offsetB, type: typeB }) => {
                if (typeA === IVisitTemplateType.Scheduled && typeA === typeB) {
                  return (offsetA || 0) - (offsetB || 0);
                } else {
                  return 0;
                }
              }),
          ),
        ),
      );
      cy.get(`[data-cy=ffg-${ffgId}]`).should('exist');
      cy.wait(500);
      cy.get(`[data-cy=ffg-${ffgId}] [data-cy=ffg-title-${ffgId}]`)
        .should('exist')
        .contains(`${el.shortQuestion}`);
      cy.wait(500);
      cy.get(`[data-cy=ffg-${ffgId}] [data-cy=ffg-type-${ffgId}]`)
        .should('exist')
        .contains('Compound Question');
      cy.wait(500);
      cy.get(`[data-cy=ffg-${ffgId}] [data-cy=ffg-visit-text-${ffgId}]`)
        .should('exist')
        .contains('Visit:');
      cy.wrap(visitTemplateList).each((visitTemplate, idx) => {
        cy.get(`[data-cy=ffg-${ffgId}] [data-cy=ffg-visit-value-${ffgId}-${idx}]`)
          .should('exist')
          .contains(`${visitTemplate.name}`);
        cy.wait(500);
      });
      cy.get(`[data-cy=ffg-${ffgId}] [data-cy=ffg-form-text-${ffgId}]`)
        .should('exist')
        .contains('Forms:');
      cy.wrap(el.formConnections).each((formConnection, idx) => {
        cy.get(`[data-cy=ffg-${ffgId}] [data-cy=ffg-form-value-${ffgId}-${idx}]`)
          .should('exist')
          .contains(`${formConnection.form.name}`);
        cy.wait(500);
      });
      if (propertiesFFGVal) {
        !el.requiresSourceCapture &&
          cy
            .get(`[data-cy=ffg-${ffgId}] [data-cy=ffg-properties-noSCNeeded-${ffgId}]`)
            .should('exist')
            .contains('No Source Capture Needed');
        el.requiresSecondDataEntry &&
          cy
            .get(`[data-cy=ffg-${ffgId}] [data-cy=ffg-properties-reqSecondEntry-${ffgId}]`)
            .should('exist')
            .contains('2nd Data Entry Required');
        el.requiresVerification &&
          cy
            .get(`[data-cy=ffg-${ffgId}] [data-cy=ffg-properties-reqVerif-${ffgId}]`)
            .should('exist')
            .contains('Verification Required');
        el.isMultiEntry &&
          cy
            .get(`[data-cy=ffg-${ffgId}] [data-cy=ffg-properties-allowMultiEntry-${ffgId}]`)
            .should('exist')
            .contains('Allow Multi-Instance Entry');
      }
      cy.wait(500);
      cy.wrap(el.fields).each((formField) => {
        const ffId = formField.id;
        const propertiesVal: boolean =
          formField.prepopulateFromPreviousVisit ||
          formField.allowNotAvailable ||
          formField.requireUniqueEntry;

        cy.get(`[data-cy=ffg-${ffgId}] [data-cy=ff-${ffId}]`).should('exist');
        cy.wait(500);
        cy.get(`[data-cy=ffg-${ffgId}] [data-cy=ff-${ffId}] [data-cy=ff-title-${ffId}]`)
          .should('exist')
          .contains(`${formField.shortQuestion}`);
        cy.wait(500);
        cy.get(`[data-cy=ffg-${ffgId}] [data-cy=ff-${ffId}] [data-cy=ff-type-${ffId}]`)
          .should('exist')
          .contains(`${generateFieldTypeToName(formField.type)}`);
        cy.wait(500);
        cy.get(`[data-cy=ffg-${ffgId}] [data-cy=ff-${ffId}] [data-cy=ff-answer-text-${ffId}]`)
          .should('exist')
          .contains('Answer:');
        cy.wrap(formField.choices).each((answer, idx) => {
          cy.get(
            `[data-cy=ffg-${ffgId}] [data-cy=ff-${ffId}] [data-cy=ff-answer-value-${ffId}-${idx}]`,
          )
            .should('exist')
            .contains(`${answer.value}`);
          cy.wait(500);
        });
        if (propertiesVal) {
          formField.prepopulateFromPreviousVisit &&
            cy
              .get(
                `[data-cy=ffg-${ffgId}] [data-cy=ff-${ffId}] [data-cy=ff-properties-usePrevEntry-${ffId}]`,
              )
              .should('exist')
              .contains('Use Previous Entry');
          formField.allowNotAvailable &&
            cy
              .get(
                `[data-cy=ffg-${ffgId}] [data-cy=ff-${ffId}] [data-cy=ff-properties-allowNoAnswer-${ffId}]`,
              )
              .should('exist')
              .contains('Mark as No Answer');
          formField.requireUniqueEntry &&
            cy
              .get(
                `[data-cy=ffg-${ffgId}] [data-cy=ff-${ffId}] [data-cy=ff-properties-reqUnique2-${ffId}]`,
              )
              .should('exist')
              .contains('Require unique (appears only if multi instance entry is selected)');
        }
      });
    }
  });
});

Cypress.Commands.add('checkSearchQuestion', (dataFFG) => {
  const filterFFG = dataFFG.filter(filterQuestion);
  cy.get('.search-forms-modal-study-settings').type('yes');
  cy.wait(2000);
  cy.checkDetailQuestion(filterFFG);
});
