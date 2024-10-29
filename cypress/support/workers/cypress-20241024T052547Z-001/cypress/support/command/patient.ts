import {
  ILandingStatusIndicator,
  GetVisitListDocument,
  AddPatientDocument,
} from '../../../src/graphQL/generated/graphql';
import { randomAlphabet, randomAlphaNumeric, randomDate } from '../../helper/randomGenerator';
import { AutoFilledPatientObject } from '../../integration/addPatient.spec';
import client from '../../utils/client';

const aliasing: any = GetVisitListDocument;
const getVisit = aliasing.definitions[0].name.value;
const aliases = [];

// NOTE: to use Add Patient/Study Subject DropdownSelector (../../../src/components/DropdownSelect/index.tsx)
Cypress.Commands.add('multiSelect', ({ field = '', name = '', count = 3 }) => {
  let dataCy = `[data-cy=select-${field}`;
  if (name) {
    dataCy += `-${name}`;
  }
  dataCy += ']';

  const downArrows = [...Array(count)].map(() => '{downarrow}').join('');

  cy.get(`${dataCy} > .ant-select-selector > .ant-select-selection-item`).type(
    `${downArrows}{enter}`,
  );
});

Cypress.Commands.add('defaultAddPatientForm', (isAutoGenerate = false) => {
  cy.get('#add-patient-icon').click();
  cy.react('Modal', {
    props: {
      id: 'modal-add-patient',
      visible: true,
    },
  });
  cy.get('input[name="firstName"]').should('have.value', '');
  cy.get('input[name="middleName"]').should('have.value', '');
  cy.get('input[name="lastName"]').should('have.value', '');

  const name = 'addPatient';

  cy.multiSelect({ field: 'year', name });
  cy.multiSelect({ field: 'month', name });
  cy.multiSelect({ field: 'date', name });

  cy.get('input[name="MALE"]').should('not.have.checked');
  cy.get('input[name="FEMALE"]').should('not.have.checked');
  cy.get('input[name="INTERSEX"]').should('not.have.checked');
  if (isAutoGenerate) {
    cy.get('input[name="patientStudyId"]').should('not.exist');
  } else {
    cy.get('input[name="patientStudyId"]').should('have.value', '');
  }
  cy.get('input[id="siteId"]').should('have.value', '');
  cy.get('#button-submit-add-patient').should('have.disabled');
  cy.get('#button-cancel-add-patient').should('have.enabled');
});

Cypress.Commands.add(
  'fillInAddPatientForm',
  (addPatientData: AutoFilledPatientObject, withSuccess = true, isAutoGenerate = false) => {
    const addPatientForm = cy.get('#add-patient-form');
    addPatientForm.within(() => {
      cy.get('input[name="firstName"]').type(addPatientData.firstNameInitial, { force: true });
      if (addPatientData.middleNameInitial && addPatientData.middleNameInitial.length > 0) {
        cy.get('input[name="middleName"]').type(addPatientData.middleNameInitial, { force: true });
      }
      cy.get('input[name="lastName"]').type(addPatientData.lastNameInitial, { force: true });
      if (addPatientData.sex === 'FEMALE') {
        cy.get('input[name="FEMALE"]').click();
      } else if (addPatientData.sex === 'MALE') {
        cy.get('input[name="MALE"]').click();
      } else {
        cy.get('input[name="INTERSEX"]').click();
      }

      // dob input
      const name = 'addPatient';
      cy.multiSelect({ field: 'year', name });
      cy.multiSelect({ field: 'month', name });
      cy.multiSelect({ field: 'date', name });

      cy.fillInAddPatientForm;
      if (!isAutoGenerate) {
        cy.get('input[name="patientStudyId"]')
          .click()
          .type(addPatientData.patientStudyId, { force: true });
      }
      cy.get('[data-cy=patient-site]').click().type(addPatientData.site).wait(500).type('{enter}');
    });
  },
);

Cypress.Commands.add('fillInAddPatientFormValidation', () => {
  cy.get('#add-patient-icon').click();
  cy.react('Modal', {
    props: {
      id: 'modal-add-patient',
      visible: true,
    },
  });
  const addPatientForm = cy.get('#add-patient-form');
  addPatientForm.within(() => {
    cy.get('input[name="firstName"]').type('M', { force: true });
    cy.get('input[name="middleName"]').type('K', { force: true });
    cy.get('input[name="lastName"]').type('R', { force: true });
    cy.get('input[name="MALE"]').click();

    // dob
    const name = 'addPatient';
    cy.multiSelect({ field: 'year', name });
    cy.multiSelect({ field: 'month', name });
    cy.multiSelect({ field: 'date', name });

    cy.get('input[name="patientStudyId"]').click().type('MKR', { force: true });
    cy.get('[data-cy=patient-site]').click().type('Tokyo').wait(500).type('{enter}');
  });
  cy.get('#button-submit-add-patient').should('be.disabled');
});

Cypress.Commands.add('fillInAddPatientFormValidationSite', () => {
  cy.get('#add-patient-icon').click();
  cy.react('Modal', {
    props: {
      id: 'modal-add-patient',
      visible: true,
    },
  });
  const addPatientForm = cy.get('#add-patient-form');
  addPatientForm.within(() => {
    cy.get('input[name="firstName"]').type('M', { force: true });
    cy.get('input[name="middleName"]').type('K', { force: true });
    cy.get('input[name="lastName"]').type('R', { force: true });
    cy.get('input[name="MALE"]').click();
    cy.get('input[name="patientStudyId"]').click().type('MKR', { force: true });
    cy.get('[data-cy=patient-site]').click().type('Tokyo').wait(500).type('{enter}');

    // dob
    // cy.fillInTodayForDateDropdown();
    // cy.multiSelect({ field: 'year' });
    // cy.multiSelect({ field: 'month' });
    // cy.multiSelect({ field: 'date' });
  });
  cy.get('#button-submit-add-patient').should('be.disabled');
});

Cypress.Commands.add('handleVisitList', (index, visitCount) => {
  cy.wait(`@${getVisit}${index}`, { timeout: 15000 }).then((res) => {
    if (res.response?.statusCode === 200) {
      try {
        if (res.response.body.data.visitList) {
          res.response.body.data.visitList.map((visit: any, i: number) => {
            cy.get('[data-cy=total-visit]').should(
              'have.text',
              `Result: ${res.response?.body.data.visitList.length} out of ${visitCount} Visits`,
            );
            cy.get(`[data-cy=visit-${visit.id}]`)
              .trigger('mouseover')
              .then(() => {
                cy.get('.status-indicator-row').should('be.visible');
                cy.get('.status-indicator-row').should(
                  'have.text',
                  `${visit.outstandingCount} Incomplete Questions`,
                );
              });
          });
          cy.wait(3000).then(() => {
            cy.get('.sidebar-toggle-arrow').click();
          });
        } else {
          cy.get('.sidebar-toggle-arrow').click();
        }
      } catch (error) {
        throw error;
      }
    }
  });
});

Cypress.Commands.add('handlePatientList', (sitePatientList) => {
  if (sitePatientList) {
    cy.wrap(sitePatientList).each((data: any, i, array) => {
      return new Cypress.Promise((resolve) => {
        data.patients.map((patient: any, index: number) => {
          if (!patient.patientLock && patient.status !== ILandingStatusIndicator.Unset) {
            cy.intercept('POST', '/graphql', (req) => {
              if (req.body.operationName === getVisit) {
                aliases.push(`${getVisit}${index}`);
                req.alias = req.body.operationName;
              }
            }).as(`${getVisit}${index}`);
            cy.get(`#${patient.id}-name`)
              .should('have.text', `${patient.patientStudyId}`)
              .click()
              .then(() => {
                cy.handleVisitList(index, patient.visitCount);
              });
          }
        });
        resolve();
      });
    });
  }
});

Cypress.Commands.add('addRandomPatientScreening', () => {
  cy.intercept('POST', '/graphql', (req) => {
    if (req.body.operationName === 'AddPatient') {
      req.alias = req.body.operationName;
    }
  });
  let patientData: any;
  let screeningVisitId: any;
  const variables = {
    firstName: randomAlphabet(1),
    middleName: randomAlphabet(1),
    lastName: randomAlphabet(1),
    dob: randomDate(),
    patientStudyId: `${randomAlphabet(3)}-${randomAlphaNumeric(6)}`,
    siteId: 'bellevueHospital1',
    sex: 'INTERSEX',
    studyRevisionId: 'demoRevision1',
  };

  cy.wrap(
    client.mutate({
      mutation: AddPatientDocument,
      variables,
    }),
  ).then((res: any) => {
    if (res) {
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === 'GetVisitList') {
          req.alias = req.body.operationName;
        }
      });
      patientData = res?.data?.addPatient.patient;
      cy.visit(`/visit/demoRevision1/bellevueHospital1/${patientData.id}`);
      cy.wait(3000);
      cy.wait('@GetVisitList')
        .then((res) => {
          return res.response?.body.data.visitList.find(
            (visit: any) => visit.visitName === 'Screening',
          ).id;
        })
        .then((visitId) => {
          cy.get(`#${patientData.id}-selectable-patient`).click();
          cy.get('.sidebar-toggle-arrow').click();
          cy.wait(2000);
          cy.get(`[data-cy=visit-${visitId}]`).click();
          cy.get('[data-cy=select-visit-status] > .ant-select-selector').click().type('{enter}');
          // cy.get('#date').type('JAN101910');
          cy.fillInTodayForDateDropdown();

          cy.get('#start-visit-form').click();
          cy.get('[data-cy=button-submit-visit]').click();
          cy.wait(4000);
        });
    }
  });
});
