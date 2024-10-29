import {
  GetVisitTemplateListDocument,
  UpdateVisitTemplateDocument,
  IVisitTemplateType,
} from '../../../src/graphQL/generated/graphql';
import 'cypress-localstorage-commands';

describe('Update Study Config test', () => {
  let visitTemplateList: any;
  let filterScheduled: any;
  let filterAdhoc: any;

  before(() => {
    cy.clearLocalStorageSnapshot();
    cy.visit('/login');
    cy.fillInloginAsFormV2({
      email: 'admin@example.com',
    });
    cy.saveLocalStorage();
  });

  beforeEach(() => {
    cy.waitForReact();
    cy.restoreLocalStorageCache();
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  describe('Check all cards visit in visit settings', () => {
    it('checks visit in all study in modal study settings', () => {
      const alias = GetVisitTemplateListDocument.definitions[0].name.value;
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === alias) {
          req.alias = req.body.operationName;
        }
      });
      cy.visit('study/testRevisionId1');
      cy.wait(`@${alias}`).then((result) => {
        if (result.response.statusCode === 200) {
          visitTemplateList = result.response.body.data.visitTemplateList;
          filterScheduled = result.response.body.data.visitTemplateList.filter(
            (el) => el.type === IVisitTemplateType.Scheduled,
          );
          filterAdhoc = result.response.body.data.visitTemplateList.filter(
            (el) => el.type === IVisitTemplateType.AdHoc,
          );
          const firstVisitData = visitTemplateList[3];
          cy.wrap(visitTemplateList).each((visit) => {
            // cy.get(`#${visit.id}`).click({ force: true })
            cy.get(`[data-cy=visit-name]`).should('exist').contains(`${visit.name}`);
            cy.get(`[data-cy=visit-dayOffset]`).should('exist');
            if (visit.dayOffset === 0) {
              cy.get(`[data-cy=visit-dayOffset]`).contains('First Visit');
            } else {
              cy.get(`[data-cy=visit-dayOffset]`).contains(
                `+${visit.dayOffset} Days from first visit`,
              );
            }
          });
          cy.get('.study-settings-icon').should('exist').click({ force: true });
          cy.get('[data-cy=menu-item-visit]').should('exist').click({ force: true });
          cy.wrap(visitTemplateList).each((visit) => {
            cy.get(`[data-cy=visit-name-modal]`).should('exist').contains(`${visit.name}`);
            cy.get('[data-cy=visit-type]')
              .should('exist')
              .contains(`${visit.type.toLowerCase()} Visit`);
            if (visit.type !== IVisitTemplateType.AdHoc) {
              cy.get('[data-cy=visit-before-window]')
                .should('exist')
                .contains(`D-${visit.visitBeforeWindow} Days`);
              cy.get('[data-cy=visit-after-window]')
                .should('exist')
                .contains(`D-${visit.visitAfterWindow} Days`);
              cy.get('[data-cy=day-offset]')
                .should('exist')
                .contains(
                  visit.dayOffset === 0 ? 'First Visit' : `${visit.dayOffset} Days Between Visit`,
                );
            }
            cy.get(`[data-cy=total-forms]`).should('exist').contains(`${visit.countForm} Forms`);
            cy.get(`[data-cy=total-visits`).should('exist').contains(`${visit.countFFG} Visits`);
            cy.get(`[data-cy=edit-visit-template-${visit.id}]`).should('exist');
          });
        }
      });
    });

    it('Check filter scheduled', () => {
      cy.get('#drop-down-visit').click({ force: true }).type('{enter}', { force: true });
      cy.wrap(filterScheduled).each((visit) => {
        cy.get(`[data-cy=visit-name-modal]`).should('exist').contains(`${visit.name}`);
        // cy.get('[data-cy=visit-type]').should('exist').contains(`${visit.type.toLowerCase()} Visit`)
        // if (visit.type !== IVisitTemplateType.AdHoc) {
        //     cy.get('[data-cy=visit-before-window]').should('exist').contains(`D-${visit.visitBeforeWindow} Days`)
        //     cy.get('[data-cy=visit-after-window]').should('exist').contains(`D-${visit.visitAfterWindow} Days`)
        //     cy.get('[data-cy=day-offset]').should('exist').contains(visit.dayOffset === 0 ? 'First Visit' : `${visit.dayOffset} Days Between Visit`)
        // }
        // cy.get(`[data-cy=total-forms]`).should('exist').contains(`${visit.countForm} Forms`)
        // cy.get(`[data-cy=total-visits`).should('exist').contains(`${visit.countFFG} Visits`)
        // cy.get(`[data-cy=edit-visit-template-${visit.id}]`).should('exist')
      });
    });

    it('Check filter adhoc', () => {
      cy.get('#drop-down-visit').click({ force: true }).type('{downarrow}{enter}', { force: true });
      cy.wrap(filterAdhoc).each((visit) => {
        cy.get(`[data-cy=visit-name-modal]`).should('exist').contains(`${visit.name}`);
        // cy.get('[data-cy=visit-type]').should('exist').contains(`${visit.type.toLowerCase()} Visit`)
        // if (visit.type !== IVisitTemplateType.AdHoc) {
        //     cy.get('[data-cy=visit-before-window]').should('exist').contains(`D-${visit.visitBeforeWindow} Days`)
        //     cy.get('[data-cy=visit-after-window]').should('exist').contains(`D-${visit.visitAfterWindow} Days`)
        //     cy.get('[data-cy=day-offset]').should('exist').contains(visit.dayOffset === 0 ? 'First Visit' : `${visit.dayOffset} Days Between Visit`)
        // }
        // cy.get(`[data-cy=total-forms]`).should('exist').contains(`${visit.countForm} Forms`)
        // cy.get(`[data-cy=total-visits`).should('exist').contains(`${visit.countFFG} Visits`)
        // cy.get(`[data-cy=edit-visit-template-${visit.id}]`).should('exist')
      });
    });
  });

  describe('Edit visit in modal', () => {
    it('Edit visit first visit to not first visit', () => {
      // let visitTemplateList = [];
      const alias = GetVisitTemplateListDocument.definitions[0].name.value;
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === alias) {
          req.alias = req.body.operationName;
        }
      });
      cy.visit('study/testRevisionId1');
      cy.wait(`@${alias}`).then((result) => {
        if (result?.response?.statusCode === 200) {
          visitTemplateList = result.response.body.data.visitTemplateList;
          const firstVisitData = visitTemplateList[1];
          // cy.wrap(visitTemplateList).each(visit => {
          //     // cy.get(`#${visit.id}`).click({ force: true })
          //     cy.get(`[data-cy=visit-name]`).should('exist').contains(`${visit.name}`);
          //     cy.get(`[data-cy=visit-dayOffset]`).should('exist');
          //     if (visit.dayOffset === 0) {
          //         cy.get(`[data-cy=visit-dayOffset]`).contains('First Visit');
          //     } else {
          //         cy.get(`[data-cy=visit-dayOffset]`).contains(`+${visit.dayOffset} Days from prior visit`);
          //     }
          // });
          cy.get('.study-settings-icon').should('exist').click({ force: true });
          cy.get('[data-cy=menu-item-visit]').should('exist').click({ force: true });
          // cy.wrap(visitTemplateList).each(visit => {
          //     cy.get(`[data-cy=visit-name-modal]`).should('exist').contains(`${visit.name}`);
          //     cy.get('[data-cy=visit-type]').should('exist').contains(`${visit.type.toLowerCase()} Visit`)
          //     if (visit.type !== IVisitTemplateType.AdHoc) {
          //         cy.get('[data-cy=visit-before-window]').should('exist').contains(`D-${visit.visitBeforeWindow} Days`)
          //         cy.get('[data-cy=visit-after-window]').should('exist').contains(`D-${visit.visitAfterWindow} Days`)
          //         cy.get('[data-cy=day-offset]').should('exist').contains(visit.dayOffset === 0 ? 'First Visit' : `${visit.dayOffset} Days Between Visit`)
          //     }
          //     cy.get(`[data-cy=total-forms]`).should('exist').contains(`${visit.countForm} Forms`)
          //     cy.get(`[data-cy=total-visits`).should('exist').contains(`${visit.countFFG} Visits`)
          //     cy.get(`[data-cy=edit-visit-template-${visit.id}]`).should('exist')
          // });
          cy.get(`[data-cy=edit-visit-template-${firstVisitData.id}]`)
            .should('exist')
            .click({ force: true });
          cy.get('[data-cy=visit-name]').contains('Screening');
          cy.get('[data-cy=textfield-container-visit-name] > [data-cy=visit-name]').clear();
          cy.get('[data-cy=textfield-container-visit-name] > [data-cy=visit-name]').type(
            'Screening',
          );
          cy.get('#select-is-first-visit')
            .click({ force: true })
            .type('{downarrow}{enter}', { force: true });
          cy.get('[data-cy=visitBeforeWindow]').clear();
          cy.get('[data-cy=visitBeforeWindow]').type('1');
          cy.get('[data-cy=visitAfterWindow]').clear();
          cy.get('[data-cy=visitAfterWindow]').type('5');
          cy.get('[data-cy=dayOffsetFromPreviousVisit]').clear();
          cy.get('[data-cy=dayOffsetFromPreviousVisit]').type('10');
          cy.get('#button-save-edit-visit').should('have.enabled');
          // cy.get('#button-save-edit-visit').click();
        }
      });
    });

    it('Edit visit first visit to adhoc visit', () => {
      // let visitTemplateList = [];
      const alias = GetVisitTemplateListDocument.definitions[0].name.value;
      // cy.intercept('POST', '/graphql', req => {
      //     if (req.body.operationName === alias) {
      //         req.alias = req.body.operationName;
      //     }
      // });
      cy.visit('study/testRevisionId1');
      cy.wait(3000);
      // cy.wait(`@${alias}`).then(result => {
      // if (result.response.statusCode === 200) {
      // visitTemplateList = result.response.body.data.visitTemplateList
      const firstVisitData = visitTemplateList[3];
      // cy.wrap(visitTemplateList).each(visit => {
      //     cy.get(`#${visit.id}`).click({ force: true })
      //     cy.get(`[data-cy=visit-name]`).should('exist').contains(`${visit.name}`);
      //     cy.get(`[data-cy=visit-dayOffset]`).should('exist');
      //     if (visit.dayOffset === 0) {
      //         cy.get(`[data-cy=visit-dayOffset]`).contains('First Visit');
      //     } else {
      //         cy.get(`[data-cy=visit-dayOffset]`).contains(`+${visit.dayOffset} Days from prior visit`);
      //     }
      // });
      cy.get('.study-settings-icon').should('exist').click({ force: true });
      cy.get('[data-cy=menu-item-visit]').should('exist').click({ force: true });
      // cy.wrap(visitTemplateList).each(visit => {
      //     cy.get(`[data-cy=visit-name]`).should('exist').contains(`${visit.name}`);
      //     cy.get(`[data-cy=edit-visit-template-${visit.id}]`).should('exist')
      // });
      cy.get(`[data-cy=edit-visit-template-${firstVisitData.id}]`)
        .should('exist')
        .click({ force: true });
      cy.get('[data-cy=visit-name]').contains('Screening');
      cy.get('[data-cy=textfield-container-visit-name] > [data-cy=visit-name]').clear();
      cy.get('[data-cy=textfield-container-visit-name] > [data-cy=visit-name]').type('Screening');
      cy.get('#select-visit-type')
        .click({ force: true })
        .type('{downarrow}{enter}', { force: true });
      cy.get('#button-save-edit-visit').should('have.enabled');
      // cy.get('#button-save-edit-visit').click();
      // }
      // });
    });

    it('Edit visit not first visit to first visit', () => {
      // let visitTemplateList = [];
      const alias = GetVisitTemplateListDocument.definitions[0].name.value;
      // cy.intercept('POST', '/graphql', req => {
      //     if (req.body.operationName === alias) {
      //         req.alias = req.body.operationName;
      //     }
      // });
      cy.visit('study/testRevisionId1');
      // cy.wait(`@${alias}`).then(result => {
      // if (result.response.statusCode === 200) {
      // visitTemplateList = result.response.body.data.visitTemplateList
      const aliasUpdateVisit = UpdateVisitTemplateDocument.definitions[0].name.value;
      // const notFirstVisit = visitTemplateList.filter(item => item.id === 'ckrkdf9kd7620772pmvmwfqj9vn')[0]
      const notFirstVisit = visitTemplateList[3]; // new add
      // cy.wrap(visitTemplateList).each(visit => {
      //     cy.get(`#${visit.id}`).click({ force: true })
      //     cy.get(`[data-cy=visit-name]`).should('exist').contains(`${visit.name}`);
      //     cy.get(`[data-cy=visit-dayOffset]`).should('exist');
      //     if (visit.dayOffset === 0) {
      //         cy.get(`[data-cy=visit-dayOffset]`).contains('First Visit');
      //     } else {
      //         cy.get(`[data-cy=visit-dayOffset]`).contains(`+${visit.dayOffset} Days from prior visit`);
      //     }
      // });
      cy.get('.study-settings-icon').should('exist').click({ force: true });
      cy.get('[data-cy=menu-item-visit]').should('exist').click({ force: true });
      // cy.wrap(visitTemplateList).each(visit => {
      //     cy.get(`[data-cy=visit-name]`).should('exist').contains(`${visit.name}`);
      //     cy.get(`[data-cy=edit-visit-template-${visit.id}]`).should('exist')
      // });
      cy.get(`[data-cy=edit-visit-template-${notFirstVisit.id}]`)
        .should('exist')
        .click({ force: true });
      cy.get('[data-cy=visit-name]').contains(`${notFirstVisit.name}`);
      cy.get('[data-cy=textfield-container-visit-name] > [data-cy=visit-name]').clear();
      cy.get('[data-cy=textfield-container-visit-name] > [data-cy=visit-name]').type(
        `${notFirstVisit.name}`,
      );
      cy.get('#select-is-first-visit')
        .click({ force: true })
        .type('{downarrow}{enter}', { force: true });
      cy.get('[data-cy=alert-success]')
        .should('exist')
        .contains(
          "This study already has a first visit. Selecting 'Yes' will replace that first visit with this one",
        );
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasUpdateVisit) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('#button-save-edit-visit').should('have.enabled');
      // cy.get('#button-save-edit-visit').click();
      // cy.wait(`@${aliasUpdateVisit}`).then(result => {
      //     if (result.response.statusCode === 200) {
      //     }
      // });
      // }
      // });
    });

    it('Edit visit not first visit to adhoc visit', () => {
      // let visitTemplateList = [];
      const alias = GetVisitTemplateListDocument.definitions[0].name.value;
      // cy.intercept('POST', '/graphql', req => {
      //     if (req.body.operationName === alias) {
      //         req.alias = req.body.operationName;
      //     }
      // });
      cy.visit('study/testRevisionId1');
      cy.wait(3000);
      // cy.wait(`@${alias}`).then(result => {
      // if (result.response.statusCode === 200) {
      // visitTemplateList = result.response.body.data.visitTemplateList
      const aliasUpdateVisit = UpdateVisitTemplateDocument.definitions[0].name.value;
      const notFirstVisit = visitTemplateList.filter((item) => item.id === 'templateExit1')[0];
      // cy.wrap(visitTemplateList).each(visit => {
      //     cy.get(`#${visit.id}`).click({ force: true })
      //     cy.get(`[data-cy=visit-name]`).should('exist').contains(`${visit.name}`);
      //     cy.get(`[data-cy=visit-dayOffset]`).should('exist');
      //     if (visit.dayOffset === 0) {
      //         cy.get(`[data-cy=visit-dayOffset]`).contains('First Visit');
      //     } else {
      //         cy.get(`[data-cy=visit-dayOffset]`).contains(`+${visit.dayOffset} Days from prior visit`);
      //     }
      // });
      cy.get('.study-settings-icon').should('exist').click({ force: true });
      cy.get('[data-cy=menu-item-visit]').should('exist').click({ force: true });
      // cy.wrap(visitTemplateList).each(visit => {
      //     cy.get(`[data-cy=visit-name]`).should('exist').contains(`${visit.name}`);
      //     cy.get(`[data-cy=edit-visit-template-${visit.id}]`).should('exist')
      // });
      cy.get(`[data-cy=edit-visit-template-${notFirstVisit.id}]`)
        .should('exist')
        .click({ force: true });
      cy.get('[data-cy=visit-name]').contains(`${notFirstVisit.name}`);
      cy.get('[data-cy=textfield-container-visit-name] > [data-cy=visit-name]').clear();
      cy.get('[data-cy=textfield-container-visit-name] > [data-cy=visit-name]').type(
        `${notFirstVisit.name}`,
      );
      cy.get('#select-visit-type')
        .click({ force: true }) //will change downarrow above later
        .type('{downarrow}{enter}', { force: true });
      cy.intercept('POST', '/graphql', (req) => {
        // if (req.body.operationName === aliasUpdateVisit) {
        //     req.alias = req.body.operationName;
        // } else
        if (req.body.operationName === alias) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('#button-save-edit-visit').should('have.enabled');
      // cy.get('#button-save-edit-visit').click();
      // cy.wait(`@${alias}`).then(result => {
      //     if (result.response.statusCode === 200) {
      //     }
      // });
      // }
      // });
    });

    it('Edit visit scheduled form check', () => {
      // let visitTemplateList = [];
      const alias = GetVisitTemplateListDocument.definitions[0].name.value;
      // cy.intercept('POST', '/graphql', req => {
      //     if (req.body.operationName === alias) {
      //         req.alias = req.body.operationName;
      //     }
      // });
      cy.visit('study/testRevisionId1');
      cy.wait(3000);
      // cy.wait(`@${alias}`).then(result => {
      // if (result.response.statusCode === 200) {
      // visitTemplateList = result.response.body.data.visitTemplateList
      const notFirstVisit = visitTemplateList.filter((item) => item.id === 'templateVisit2')[0];
      // cy.wrap(visitTemplateList).each(visit => {
      //     cy.get(`#${visit.id}`).click({ force: true })
      //     cy.get(`[data-cy=visit-name]`).should('exist').contains(`${visit.name}`);
      //     cy.get(`[data-cy=visit-dayOffset]`).should('exist');
      //     if (visit.dayOffset === 0) {
      //         cy.get(`[data-cy=visit-dayOffset]`).contains('First Visit');
      //     } else {
      //         cy.get(`[data-cy=visit-dayOffset]`).contains(`+${visit.dayOffset} Days from prior visit`);
      //     }
      // });
      cy.get('.study-settings-icon').should('exist').click({ force: true });
      cy.get('[data-cy=menu-item-visit]').should('exist').click({ force: true });
      // cy.wrap(visitTemplateList).each(visit => {
      //     cy.get(`[data-cy=visit-name]`).should('exist').contains(`${visit.name}`);
      //     cy.get(`[data-cy=edit-visit-template-${visit.id}]`).should('exist')
      // });
      cy.get(`[data-cy=edit-visit-template-${notFirstVisit.id}]`)
        .should('exist')
        .click({ force: true });
      cy.get('[data-cy=visit-name]').contains(`${notFirstVisit.name}`);
      cy.get('[data-cy=textfield-container-visit-name] > [data-cy=visit-name]').clear();
      cy.get('[data-cy=textfield-container-visit-name] > [data-cy=visit-name]').type(
        `${notFirstVisit.name}`,
      );
      cy.get('[data-cy=visitBeforeWindow]').clear();
      cy.get('[data-cy=visitAfterWindow]').clear();
      cy.get('[data-cy=dayOffsetFromPreviousVisit]').clear();
      cy.get('[data-cy=visitBeforeWindow]').type('1');
      cy.get('#button-save-edit-visit').should('have.disabled');
      cy.get('[data-cy=visitAfterWindow]').clear();
      cy.get('[data-cy=visitAfterWindow]').type('5');
      cy.get('#button-save-edit-visit').should('have.disabled');
      cy.get('[data-cy=dayOffsetFromPreviousVisit]').clear();
      cy.get('[data-cy=dayOffsetFromPreviousVisit]').type('10');
      cy.get('#button-save-edit-visit').should('have.enabled');
      cy.get('[data-cy=visitBeforeWindow]').clear();
      cy.get('#button-save-edit-visit').should('have.disabled');
      cy.get('[data-cy=visitBeforeWindow]').type('-1');
      cy.get('#button-save-edit-visit').should('have.disabled');
      cy.get('[data-cy=visitBeforeWindow]').clear();
      cy.get('[data-cy=visitBeforeWindow]').type('1');
      cy.get('#button-save-edit-visit').should('have.enabled');
      cy.get('[data-cy=visitAfterWindow]').clear();
      cy.get('#button-save-edit-visit').should('have.disabled');
      cy.get('[data-cy=visitAfterWindow]').type('-1');
      cy.get('#button-save-edit-visit').should('have.disabled');
      cy.get('[data-cy=visitAfterWindow]').clear();
      cy.get('[data-cy=visitAfterWindow]').type('7');
      cy.get('#button-save-edit-visit').should('have.enabled');
      cy.get('[data-cy=dayOffsetFromPreviousVisit]').clear();
      cy.get('#button-save-edit-visit').should('have.disabled');
      cy.get('[data-cy=dayOffsetFromPreviousVisit]').type('-4');
      cy.get('#button-save-edit-visit').should('have.disabled');
      cy.get('[data-cy=dayOffsetFromPreviousVisit]').clear();
      cy.get('[data-cy=dayOffsetFromPreviousVisit]').type('10');
      // }
      // });
    });
  });

  describe('Edit visit in right sidebar', () => {
    it('Edit visit first visit to not first visit', () => {
      const alias = GetVisitTemplateListDocument.definitions[0].name.value;
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === alias) {
          req.alias = req.body.operationName;
        }
      });
      cy.visit('study/testRevisionId1');
      cy.wait(`@${alias}`).then((result) => {
        if (result?.response?.statusCode === 200) {
          visitTemplateList = result.response.body.data.visitTemplateList;
          const firstVisitData = visitTemplateList[1];
          cy.get(`#${firstVisitData.id}`).should('exist');
          cy.get(`#${firstVisitData.id}`).realHover();
          cy.get(
            `[data-cy=visit-template-${firstVisitData.id}-edit] > [data-cy=visit-template-${firstVisitData.id}-icon]`,
          ).click();
          cy.get('[data-cy=right-side-bar]').should('exist');
          cy.get('[data-cy=visit-name]').contains('Screening');
          cy.get('[data-cy=textfield-container-visit-name] > [data-cy=visit-name]').clear();
          cy.get('[data-cy=textfield-container-visit-name] > [data-cy=visit-name]').type(
            'Screening',
          );
          cy.get('#select-is-first-visit')
            .click({ force: true })
            .type('{downarrow}{enter}', { force: true });
          cy.get('[data-cy=visitBeforeWindow]').clear();
          cy.get('[data-cy=visitBeforeWindow]').type('1');
          cy.get('[data-cy=visitAfterWindow]').clear();
          cy.get('[data-cy=visitAfterWindow]').type('5');
          cy.get('[data-cy=dayOffsetFromPreviousVisit]').clear();
          cy.get('[data-cy=dayOffsetFromPreviousVisit]').type('10');
          cy.get('[data-cy=right-menu-save-button]').should('have.enabled');
        }
      });
    });

    // it('Edit visit first visit to adhoc visit', () => {
    //     cy.visit('study/testRevisionId1')
    //     cy.wait(3000)
    //     const firstVisitData = visitTemplateList[1]
    //     cy.get(`#${firstVisitData.id}`).should('exist')
    //     cy.get(`#${firstVisitData.id}`).realHover()
    //     cy.get(`[data-cy=visit-template-${firstVisitData.id}-edit] > [data-cy=visit-template-${firstVisitData.id}-icon]`).click();
    //     cy.get('[data-cy=right-side-bar]').should('exist')
    //     cy.get(`[data-cy=edit-visit-template-${firstVisitData.id}]`).should('exist').click({ force: true })
    //     cy.get('[data-cy=visit-name]').contains('Screening');
    //     cy.get('[data-cy=textfield-container-visit-name] > [data-cy=visit-name]').clear();
    //     cy.get('[data-cy=textfield-container-visit-name] > [data-cy=visit-name]').type('Screening');
    //     cy.get('#select-visit-type').click({ force: true })
    //         .type('{downarrow}{enter}', { force: true });
    //     cy.get('[data-cy=right-menu-save-button]').should('have.enabled');
    //     // cy.get('#button-save-edit-visit').click();
    //     // }
    //     // });

    // });

    // it('Edit visit not first visit to first visit', () => {
    //     const notFirstVisit = visitTemplateList[3] // new add
    //     cy.visit('study/testRevisionId1')
    //     cy.wait(3000)
    //     cy.get(`#${notFirstVisit.id}`).should('exist')
    //     cy.get(`#${notFirstVisit.id}`).realHover()
    //     cy.get(`[data-cy=visit-template-${notFirstVisit.id}-edit] > [data-cy=visit-template-${notFirstVisit.id}-icon]`).click();
    //     cy.get('[data-cy=right-side-bar]').should('exist')
    //     cy.get('[data-cy=visit-name]').contains(`${notFirstVisit.name}`);
    //     cy.get('[data-cy=textfield-container-visit-name] > [data-cy=visit-name]').clear();
    //     cy.get('[data-cy=textfield-container-visit-name] > [data-cy=visit-name]').type(`${notFirstVisit.name}`);
    //     cy.get('#select-is-first-visit').click({ force: true })
    //         .type('{downarrow}{enter}', { force: true });
    //     cy.get('[data-cy=alert-success]').should('exist').contains('This study already has a first visit. Selecting \'Yes\' will replace that first visit with this one')
    //     cy.intercept('POST', '/graphql', req => {
    //         if (req.body.operationName === aliasUpdateVisit) {
    //             req.alias = req.body.operationName;
    //         }
    //     })
    //     cy.get('[data-cy=right-menu-save-button]').should('have.enabled');
    //     // cy.get('#button-save-edit-visit').click();
    //     // cy.wait(`@${aliasUpdateVisit}`).then(result => {
    //     //     if (result.response.statusCode === 200) {
    //     //     }
    //     // });
    //     // }
    //     // });

    // });

    // it('Edit visit not first visit to adhoc visit', () => {
    //     const notFirstVisit = visitTemplateList.filter(item => item.id === 'templateExit1')[0]
    //     cy.visit('study/testRevisionId1')
    //     cy.wait(3000)
    //     cy.get(`#${notFirstVisit.id}`).should('exist')
    //     cy.get(`#${notFirstVisit.id}`).realHover()
    //     cy.get(`[data-cy=visit-template-${notFirstVisit.id}-edit] > [data-cy=visit-template-${notFirstVisit.id}-icon]`).click();
    //     cy.get('[data-cy=right-side-bar]').should('exist')
    //     // cy.get(`[data-cy=edit-visit-template-${notFirstVisit.id}]`).should('exist').click({ force: true })
    //     cy.get('[data-cy=visit-name]').contains(`${notFirstVisit.name}`);
    //     cy.get('[data-cy=textfield-container-visit-name] > [data-cy=visit-name]').clear();
    //     cy.get('[data-cy=textfield-container-visit-name] > [data-cy=visit-name]').type(`${notFirstVisit.name}`);
    //     cy.get('#select-visit-type').click({ force: true }) //will change downarrow above later
    //         .type('{downarrow}{enter}', { force: true });
    //     cy.intercept('POST', '/graphql', req => {
    //         // if (req.body.operationName === aliasUpdateVisit) {
    //         //     req.alias = req.body.operationName;
    //         // } else
    //         if (req.body.operationName === alias) {
    //             req.alias = req.body.operationName;
    //         }
    //     })
    //     cy.get('[data-cy=right-menu-save-button]').should('have.enabled');
    //     // cy.get('#button-save-edit-visit').click();
    //     // cy.wait(`@${alias}`).then(result => {
    //     //     if (result.response.statusCode === 200) {
    //     //     }
    //     // });
    //     // }
    //     // });

    // });

    // it('Edit visit scheduled form check', () => {
    //     const notFirstVisit = visitTemplateList.filter(item => item.id === 'templateVisit2')[0]
    //     cy.visit('study/testRevisionId1')
    //     cy.wait(3000)
    //     cy.get(`#${notFirstVisit.id}`).should('exist')
    //     cy.get(`#${notFirstVisit.id}`).realHover()
    //     cy.get(`[data-cy=visit-template-${notFirstVisit.id}-edit] > [data-cy=visit-template-${notFirstVisit.id}-icon]`).click();
    //     cy.get('[data-cy=right-side-bar]').should('exist')
    //     cy.get(`[data-cy=edit-visit-template-${notFirstVisit.id}]`).should('exist').click({ force: true })
    //     cy.get('[data-cy=visit-name]').contains(`${notFirstVisit.name}`);
    //     cy.get('[data-cy=textfield-container-visit-name] > [data-cy=visit-name]').clear();
    //     cy.get('[data-cy=textfield-container-visit-name] > [data-cy=visit-name]').type(`${notFirstVisit.name}`);
    //     cy.get('[data-cy=visitBeforeWindow]').clear();
    //     cy.get('[data-cy=visitAfterWindow]').clear();
    //     cy.get('[data-cy=dayOffsetFromPreviousVisit]').clear();
    //     cy.get('[data-cy=visitBeforeWindow]').type('1');
    //     cy.get('[data-cy=right-menu-save-button]').should('have.disabled');
    //     cy.get('[data-cy=visitAfterWindow]').clear();
    //     cy.get('[data-cy=visitAfterWindow]').type('5');
    //     cy.get('[data-cy=right-menu-save-button]').should('have.disabled');
    //     cy.get('[data-cy=dayOffsetFromPreviousVisit]').clear();
    //     cy.get('[data-cy=dayOffsetFromPreviousVisit]').type('10');
    //     cy.get('[data-cy=right-menu-save-button]').should('have.enabled');
    //     cy.get('[data-cy=visitBeforeWindow]').clear();
    //     cy.get('[data-cy=right-menu-save-button]').should('have.disabled');
    //     cy.get('[data-cy=visitBeforeWindow]').type('-1');
    //     cy.get('[data-cy=right-menu-save-button]').should('have.disabled');
    //     cy.get('[data-cy=visitBeforeWindow]').clear();
    //     cy.get('[data-cy=visitBeforeWindow]').type('1');
    //     cy.get('[data-cy=right-menu-save-button]').should('have.enabled');
    //     cy.get('[data-cy=visitAfterWindow]').clear();
    //     cy.get('[data-cy=right-menu-save-button]').should('have.disabled');
    //     cy.get('[data-cy=visitAfterWindow]').type('-1');
    //     cy.get('[data-cy=right-menu-save-button]').should('have.disabled');
    //     cy.get('[data-cy=visitAfterWindow]').clear();
    //     cy.get('[data-cy=visitAfterWindow]').type('7');
    //     cy.get('[data-cy=right-menu-save-button]').should('have.enabled');
    //     cy.get('[data-cy=dayOffsetFromPreviousVisit]').clear();
    //     cy.get('[data-cy=right-menu-save-button]').should('have.disabled');
    //     cy.get('[data-cy=dayOffsetFromPreviousVisit]').type('-4');
    //     cy.get('[data-cy=right-menu-save-button]').should('have.disabled');
    //     cy.get('[data-cy=dayOffsetFromPreviousVisit]').clear();
    //     cy.get('[data-cy=dayOffsetFromPreviousVisit]').type('10');
    //     // }
    //     // });

    // });
  });
});
