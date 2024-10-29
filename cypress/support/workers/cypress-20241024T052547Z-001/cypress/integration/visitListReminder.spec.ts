import moment = require('moment');
import {
  GetVisitListDocument,
  IVisitStatusIndicator,
  AddVisitReminderDocument,
  GetPatientListDocument,
  LockPatientDocument,
} from '../../src/graphQL/generated/graphql';
import client from '../utils/client';

const mockUserData = {
  email: 'admin@example.com',
};

const checkDay = (visit: any) => {
  const listBeforeTargetDate = [1, 2, 7];
  const resultDate = moment(moment(visit?.dueDate).format('l')).diff(moment().format('l'), 'days');
  if (resultDate > 0) {
    const reminderDate = moment(visit?.reminderDate);
    const now = moment();
    if (visit?.reminderDate && reminderDate < now) {
      return [];
    }
    return listBeforeTargetDate.filter((time) => {
      return time <= resultDate;
    });
  } else {
    return [];
  }
};

describe.skip('Visit Reminder', () => {
  const aliasing = {
    getPatients: GetPatientListDocument as any,
    getVisits: GetVisitListDocument as any,
    lockPatient: LockPatientDocument as any,
    addReminder: AddVisitReminderDocument as any,
  };

  const alias = aliasing.getPatients.definitions[0].name.value;
  const getVisit = aliasing.getVisits.definitions[0].name.value;
  const lockPatientDocument = aliasing.lockPatient.definitions[0].name.value;
  const aliasAddReminder = aliasing.addReminder.definitions[0].name.value;

  let submitVisitStatusData: any = {};
  const visitDate = `${moment().format('MMM')}${('0' + new Date().getDate()).slice(
    -2,
  )}${new Date().getFullYear()}`;

  let result = {} as any;

  before(() => {
    cy.reseedDB();
    cy.clearLocalStorage();
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false;
    });
    cy.fillInloginAsFormV2(mockUserData);

    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === alias) {
        req.alias = req.body.operationName;
      }
      if (req.body.operationName === getVisit) {
        req.alias = req.body.operationName;
      }
    });

    cy.visit('/visit/testRevisionId1');
    cy.wait(`@${alias}`);
    cy.wait(`@${getVisit}`).then((response) => {
      result = response;
    });
    cy.fixture('visit.json').then((value) => {
      submitVisitStatusData = value.submitVisitStatusData;
    });
    cy.waitForReact();
  });

  it('Show visit list', () => {
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === getVisit) {
        req.alias = req.body.operationName;
      }
    });
    cy.get('.sidebar-toggle-arrow')
      .trigger('click')
      .then(() => {
        cy.get('#sidebar-visits-container')
          .find('div#sider-visit-list')
          .should('have.length', result?.response?.body.data.visitList.length);
      });
  });
  it('Submit visit', () => {
    cy.wrap([submitVisitStatusData, visitDate]).then(() => {
      cy.get('[data-cy=button-start-visit]').click();
      cy.fillAndStartVisitForm({ ...submitVisitStatusData, visitDate: visitDate }, false).then(
        () => {
          cy.intercept('POST', '/graphql', (req) => {
            if (req.body.operationName === alias) {
              req.alias = req.body.operationName;
            }
          });
          cy.visit('/visit/testRevisionId1');
          cy.wait(`@${alias}`);
        },
      );
    });
  });

  it('check date', () => {
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === getVisit) {
        req.alias = req.body.operationName;
      }
    });
    cy.get('#bellevuePatient1-selectable-patient').click();
    cy.wait(`@${getVisit}`).then((response) => {
      cy.wrap(response?.response?.body.data.visitList).each((_: any, index) => {
        const visit = response.response?.body.data.visitList[index];
        cy.wrap(visit).then(() => {
          if (visit.status !== IVisitStatusIndicator.Incomplete) {
            cy.get(`[data-cy=visit-${visit.id}]`)
              .click()
              .then(() => {
                cy.wait(2000);
                cy.wrap(checkDay).then(() => {
                  if (checkDay(visit).length > 0) {
                    cy.get('.visit-reminder-content-container');
                    cy.get('.reminder-select').click();
                    cy.get('.reminder-select')
                      .type('{downArrow}{enter}')
                      .then(() => {
                        cy.intercept('POST', '/graphql', (req) => {
                          if (req.body.operationName === aliasAddReminder) {
                            req.alias = req.body.operationName;
                          }
                          if (req.body.operationName === getVisit) {
                            req.alias = req.body.operationName;
                          }
                        });
                        cy.get('#submit-reminder').should('be.enabled').click();
                        cy.wait(`@${aliasAddReminder}`).then((responseAddReminder) => {
                          if (responseAddReminder) {
                            cy.wait(2000);
                            cy.customRequest(GetVisitListDocument, {
                              patientId: 'bellevuePatient1',
                            }).then((results) => {
                              cy.wrap(results).then(() => {
                                const reminder = moment(
                                  results.visitList[index].reminderDate,
                                ).fromNow(true);
                                const reminderDate = moment(results.visitList[index].reminderDate);
                                const now = moment();
                                cy.wrap([reminder, reminderDate, now]).then(() => {
                                  const resultReminder = `in ${reminder}`;
                                  cy.wrap([resultReminder]).then(() => {
                                    cy.get(
                                      `[data-cy=visit-${results.visitList[index].id}]`,
                                    ).realHover();
                                    cy.get('[data-cy=text-indicator]').should(
                                      'have.text',
                                      resultReminder,
                                    );
                                  });
                                });
                              });
                            });
                            cy.wait(1000);
                          }
                        });
                      });
                  }
                });
              });
          }
        });
      });
    });
  });
});
