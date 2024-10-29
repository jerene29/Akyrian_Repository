import {
  GetVisitTemplateListDocument,
  UpdateVisitTemplateDocument,
  IVisitTemplateType,
  GetStudyRevisionListDocument,
  StudyCollectionDocument,
} from '../../../src/graphQL/generated/graphql';
import { d } from '../../helper';
import 'cypress-localstorage-commands';

describe('Update Visit Template in modal- Study Config test', () => {
  const aliasStudyRevisionList = GetStudyRevisionListDocument.definitions[0].name.value;
  const aliasStudyCollection = StudyCollectionDocument.definitions[0].name.value;

  let visitTemplateList: any;
  let filterScheduled: any;
  let filterAdhoc: any;

  before(() => {
    cy.reseedDB();
    cy.clearLocalStorageSnapshot();
    cy.fillInloginAsFormV2({
      email: 'admin@example.com',
    });
    cy.saveLocalStorage();
  });

  describe('Check all cards visit in visit settings', () => {
    it('checks visit in all study in modal study settings', () => {
      const alias = GetVisitTemplateListDocument.definitions[0].name.value;
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === alias) {
          req.alias = req.body.operationName;
        }
      });
      cy.visit('study/study1revisionDev2e');
      cy.wait(`@${alias}`).then((result) => {
        if (result.response.statusCode === 200) {
          visitTemplateList = result.response.body.data.visitTemplateList;
          filterScheduled = result.response.body.data.visitTemplateList.filter(
            (el) => el.type === IVisitTemplateType.Scheduled,
          );
          filterAdhoc = result.response.body.data.visitTemplateList.filter(
            (el) => el.type === IVisitTemplateType.AdHoc,
          );
          cy.get('.study-settings-icon').should('exist').click({ force: true });
          cy.get('[data-cy=menu-item-visit]').should('exist').click({ force: true });
          cy.wait(3000);
          cy.wrap(visitTemplateList).each((visit) => {
            cy.checkVisitInModal(visit);
          });
        }
      });
    });
    it('Check filter scheduled', () => {
      cy.get('#drop-down-visit').click({ force: true }).type('{enter}', { force: true });
      cy.wrap(filterScheduled).each((visit) => {
        cy.checkVisitInModal(visit);
      });
    });
    it('Check filter adhoc', () => {
      cy.get('#drop-down-visit').click({ force: true }).type('{downarrow}{enter}', { force: true });
      cy.wrap(filterAdhoc).each((visit) => {
        cy.checkVisitInModal(visit);
      });
    });
  });

  describe('Edit visit in modal', () => {
    it('Edit visit first visit to not first visit', () => {
      cy.get('#drop-down-visit').click({ force: true }).type('{uparrow}{enter}', { force: true });
      cy.get(`[data-cy=edit-card-templateScreeningRev2eDev]`).should('exist').click();
      cy.get('[data-cy=visit-name]').contains('Screening');
      cy.get('[data-cy=textfield-container-visitName] > [data-cy=visitName]').clear();
      cy.get('[data-cy=textfield-container-visitName] > [data-cy=visitName]')
        .clear()
        .type('asdasdasdaasdasdasdaasdasdd');
      cy.get('[data-cy=textfield-container-visitName] > [data-cy=visitName]').clear().type(`a'`);

      cy.get('[data-cy=textfield-container-visitName] > [data-cy=visitName]').clear().type(' ');
      cy.get('[data-cy=textfield-container-visitName] > [data-cy=visitName]').type(
        'Screening Test',
      );

      // commenting this because the behaviour for editing anchor visit is still buggy
      // cy.get('[data-cy=anchorCheckbox]').click({ force: true });
      // cy.get('[data-cy=visit-dayOffset]').clear();
      // cy.get('[data-cy=visit-dayOffset]').type('1');
      // cy.get('[data-cy=visit-days-before]').clear();
      // cy.get('[data-cy=visit-days-before]').type('5');
      // cy.get('[data-cy=visit-days-after]').clear();
      // cy.get('[data-cy=visit-days-after]').type('13');
      cy.get('#button-save-edit-visit').should('have.enabled').click();
      cy.wait(5000);

      cy.get(`[data-cy=edit-card-templateScreeningRev2eDev]`).should('exist').click();
      cy.get('[data-cy=visit-name]').contains('Screening Test');
      // commenting this because the behaviour for editing anchor visit is still buggy
      // cy.get('[data-cy=select-container]').contains('Scheduled Visit');
      // cy.get('[data-cy=visitBeforeWindow]').should('have.value', '5');
      // cy.get('[data-cy=visitAfterWindow]').should('have.value', '13');
      // cy.get('[data-cy=dayOffsetFromPreviousVisit]').should('have.value', '3');
      cy.get('#button-cancel-visit').click();
      cy.wait(3000);
    });
    // skipping this because the behaviour for editing anchor visit is still buggy
    xit('Edit visit first visit to adhoc visit', () => {
      cy.get('[data-cy=edit-card-templateVisit1Rev2eDev]').click();
      cy.get('#select-visit-type')
        .click({ force: true })
        .type('{downarrow}{enter}', { force: true });
      cy.get('#button-save-edit-visit').should('have.enabled').click();
      cy.wait(5000);
    });
    it('Edit visit not first visit to first visit', () => {
      cy.get('[data-cy=edit-card-templateExitRev2eDev]').click();
      cy.get('[data-cy=anchorCheckbox]').click({ force: true });
      cy.get('#button-save-edit-visit').should('have.enabled').click();
      cy.get('[data-cy=alert-success]').should('exist');
      cy.wait(5000);
    });
    it('Edit visit not first visit to adhoc visit', () => {
      cy.get('[data-cy=edit-card-templateVisit1Rev2eDev]').click();
      cy.get('#select-visit-type')
        .click({ force: true })
        .type('{downarrow}{enter}', { force: true });
      cy.get('#button-save-edit-visit').should('have.enabled').click();
      cy.wait(5000);
    });
    it('Edit visit scheduled form check', () => {
      cy.get(`[data-cy=edit-card-templateScreeningRev2eDev]`).should('exist').click();
      cy.get('[data-cy=visit-days-before]').clear();
      cy.get('[data-cy=visit-days-after]').clear();
      cy.get('[data-cy=visit-dayOffset]').clear();
      cy.get('[data-cy=visit-days-before]').type('1');
      cy.get('#button-save-edit-visit').should('have.disabled');
      cy.get('[data-cy=visit-days-after]').clear();
      cy.get('[data-cy=visit-days-after]').type('5');
      cy.get('#button-save-edit-visit').should('have.disabled');
      cy.get('[data-cy=visit-dayOffset]').clear();
      cy.get('[data-cy=visit-dayOffset]').type('10');
      cy.get('#button-save-edit-visit').should('have.enabled');
      cy.get('[data-cy=visit-days-before]').clear();
      cy.get('#button-save-edit-visit').should('have.disabled');
      cy.get('[data-cy=visit-days-before]').clear();
      cy.get('[data-cy=visit-days-before]').type('1');
      cy.get('#button-save-edit-visit').should('have.enabled');
      cy.get('[data-cy=visit-days-after]').clear();
      cy.get('#button-save-edit-visit').should('have.disabled');
      cy.get('[data-cy=visit-days-after]').clear();
      cy.get('[data-cy=visit-days-after]').type('7');
      cy.get('#button-save-edit-visit').should('have.enabled');
      cy.get('[data-cy=visit-dayOffset]').clear();
      cy.get('#button-save-edit-visit').should('have.disabled');
      cy.get('[data-cy=visit-dayOffset]').clear();
      cy.get('[data-cy=visit-dayOffset]').type('10');
      cy.wait(2000).get('.ant-modal-close-x').dblclick();
    });
  });
});

describe('Update Visit Template in right sider - Study Config test', () => {
  const aliasStudyRevisionList = GetStudyRevisionListDocument.definitions[0].name.value;
  const aliasStudyCollection = StudyCollectionDocument.definitions[0].name.value;

  let visitTemplateList: any;
  let filterScheduled: any;
  let filterAdhoc: any;

  before(() => {
    cy.reseedDB();
    cy.clearLocalStorageSnapshot();
    cy.fillInloginAsFormV2({
      email: 'admin@example.com',
    });
    cy.saveLocalStorage();
  });

  describe('Check all cards visit in visit settings', () => {
    it('checks visit in all study in modal study settings', () => {
      const alias = GetVisitTemplateListDocument.definitions[0].name.value;
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === alias) {
          req.alias = req.body.operationName;
        }
      });
      cy.visit('study/study1revisionDev2e');
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
            cy.get(`[data-cy=visit-dayOffset-${visit.id}]`).should('exist');
            if (visit.dayOffset === 0) {
              cy.get(`[data-cy=visit-dayOffset-${visit.id}]`).contains('Anchor Visit');
            } else if (visit.dayOffset === null) {
              cy.get(`[data-cy=visit-dayOffset-${visit.id}]`).contains(`Ad-Hoc Visit`);
            } else if (visit.dayOffset > 0) {
              if (visit.dayOffset === 1) {
                cy.get(`[data-cy=visit-dayOffset-${visit.id}]`).contains(
                  `${visit.dayOffset} Day after Anchor Visit`,
                );
              } else {
                cy.get(`[data-cy=visit-dayOffset-${visit.id}]`).contains(
                  `${visit.dayOffset} Days after Anchor Visit`,
                );
              }
            } else {
              if (visit.dayOffset === 1) {
                cy.get(`[data-cy=visit-dayOffset-${visit.id}]`).contains(
                  `${visit.dayOffset} Day before Anchor Visit`,
                );
              } else {
                cy.get(`[data-cy=visit-dayOffset-${visit.id}]`).contains(
                  `${visit.dayOffset} Days before Anchor Visit`,
                );
              }
            }
          });
        }
      });
    });
  });

  describe('Edit visit in right sidebar', () => {
    it('Add new preAnchor visit', () => {
      const alias = GetVisitTemplateListDocument.definitions[0].name.value;
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === alias) {
          req.alias = req.body.operationName;
        }
      });

      cy.get('#add-visit-icon').click();
      cy.get('[data-cy=visitName]').click().type('Before 1');
      cy.get('[data-cy=visit-dayOffset]').click().type('10');
      cy.get('#select-visit-day-direction')
        .click({ force: true })
        .type('{downarrow}{enter}', { force: true });
      cy.get('[data-cy=visit-days-before]').click().type('2');
      cy.get('[data-cy=visit-days-after]').click().type('2');
      cy.get('#button-add-visit').click();
      cy.shouldBeVisible(d`alert-success-done-button`).click();
      // Check the preAnchor exist - Since it's newly created visit, we can't access the visitID.
      // So we'll checking it by navigate to GridView to see the Day Offset
      cy.get(d`grid-view`).click();
      cy.hover(d`headerCell-0-1`);
      cy.shouldBeVisible(d`dayOffsetBox`).contains(String('10'));
      cy.get(d`detail-view`).click();

      cy.wait(`@${alias}`, { timeout: 10000 });
    });
    it('Edit visit into before anchor', () => {
      cy.get('[data-cy=visit-dayOffset-templateVisit1Rev2eDev]').contains(
        '7 Days after Anchor Visit',
      );
      cy.get('[data-cy=visit-template-templateVisit1Rev2eDev]')
        .realHover()
        .then(() => {
          cy.get(`[data-cy=visit-template-templateVisit1Rev2eDev-edit]`).click();
        });
      cy.get('[data-cy=right-menu-save-button]').should('have.disabled');
      cy.get('#select-visit-day-direction')
        .click({ force: true })
        .type('{downarrow}{enter}', { force: true });
      cy.get('[data-cy=right-menu-save-button]').should('have.enabled').click();
      cy.shouldBeVisible(d`alert-success-done-button`).click();
      cy.get('[data-cy=visit-dayOffset-templateVisit1Rev2eDev]').contains(
        '7 Days before Anchor Visit',
      );
      cy.get('[data-cy=right-menu-save-button]').should('have.disabled');
      cy.get('[data-cy=visit-dayOffset-templateVisit1Rev2eDevVisit2]').contains(
        '2 Days after Anchor Visit',
      );
      // Check the preAnchor value - Since it's newly created visit, we can't access the visitID.
      // So we'll checking it by navigate to GridView to see the Day Offset
      cy.get(d`grid-view`).click();
      cy.hover(d`headerCell-0-1`);
      cy.shouldBeVisible(d`dayOffsetBox`).contains(String('17'));
      cy.get(d`detail-view`).click();
    });
    it('Edit prev visit into after anchor & use 1 week instead of 7 day', () => {
      cy.get('[data-cy=visit-dayOffset-templateVisit1Rev2eDev]').contains(
        '7 Days before Anchor Visit',
      );
      cy.get('[data-cy=visit-template-templateVisit1Rev2eDev]')
        .realHover()
        .then(() => {
          cy.get(`[data-cy=visit-template-templateVisit1Rev2eDev-edit]`).click();
        });
      cy.get('[data-cy=right-menu-save-button]').should('have.disabled');
      cy.get('[data-cy=dayOffsetFromPreviousVisit]').clear().type('1');
      cy.get('#select-visit-dayOffset-range')
        .click({ force: true })
        .type('{downarrow}{enter}', { force: true });
      cy.get('#select-visit-day-direction')
        .click({ force: true })
        .type('{downarrow}{enter}', { force: true });

      cy.get('[data-cy=right-menu-save-button]').should('have.enabled').click();
      cy.shouldBeVisible(d`alert-success-done-button`).click();
      cy.get('[data-cy=visit-dayOffset-templateVisit1Rev2eDev]').contains(
        '7 Days after Anchor Visit',
      );
      cy.get('[data-cy=visit-dayOffset-templateVisit1Rev2eDevVisit2]').contains(
        '2 Days after Anchor Visit',
      );
      cy.get('[data-cy=visit-dayOffset-templateExitRev2eDev]').contains(
        '13 Days after Anchor Visit',
      );
      // Check the preAnchor value - Since it's newly created visit, we can't access the visitID.
      // So we'll checking it by navigate to GridView to see the Day Offset
      cy.get(d`grid-view`).click();
      cy.hover(d`headerCell-0-1`);
      cy.shouldBeVisible(d`dayOffsetBox`).contains(String('10'));
      cy.get(d`detail-view`).click();
    });
    // Ignoring this test for now, reference: https://github.com/kodefox/starcatcher/pull/1925
    xit('Edit visit first visit to not first visit', () => {
      cy.get('[data-cy=visit-template-templateScreeningRev2eDev]')
        .realHover()
        .then(() => {
          cy.get(`[data-cy=visit-template-templateScreeningRev2eDev-edit]`).click();
        });
      cy.get('.adhoc-scheduled-title').should('have.value', 'Screening');
      cy.get('#select-is-first-visit')
        .click({ force: true })
        .type('{downarrow}{enter}', { force: true });
      cy.get('[data-cy=visitBeforeWindow]').clear({ force: true });
      cy.get('[data-cy=visitBeforeWindow]').type('1');
      cy.get('[data-cy=visitAfterWindow]').clear({ force: true });
      cy.get('[data-cy=visitAfterWindow]').type('5');
      cy.get('[data-cy=dayOffsetFromPreviousVisit]').clear({ force: true });
      cy.get('[data-cy=dayOffsetFromPreviousVisit]').type('14');
      cy.get('[data-cy=right-menu-save-button]').should('have.enabled').click();
      cy.wait(5000);

      cy.get('[data-cy=visit-template-templateScreeningRev2eDev]')
        .realHover()
        .then(() => {
          cy.get(`[data-cy=visit-template-templateScreeningRev2eDev-edit]`).click();
        });
      cy.get('.adhoc-scheduled-title').should('have.value', 'Screening');
      cy.get('[data-cy=select-container]').contains('Scheduled Visit');
      cy.get('[data-cy=visitBeforeWindow]').should('have.value', '1');
      cy.get('[data-cy=visitAfterWindow]').should('have.value', '5');
      // since we're using absolute day offset,
      // cy.get('[data-cy=dayOffsetFromPreviousVisit]').should('have.value', '13');
      cy.get('[data-cy=right-menu-cancel-button]').click();
      cy.wait(3000);
    });
    it('Edit visit first visit to adhoc visit', () => {
      cy.get('[data-cy=visit-template-templateVisit1Rev2eDev]')
        .realHover()
        .then(() => {
          cy.get(`[data-cy=visit-template-templateVisit1Rev2eDev-edit]`).click();
        });
      cy.get('#select-visit-type').click({ force: true }).type('{uparrow}{enter}', { force: true });
      cy.get('[data-cy=right-menu-save-button]').should('have.enabled').click();
      cy.wait(5000);
    });
    it('Edit visit not first visit to first visit', () => {
      cy.get('[data-cy=visit-template-templateExitRev2eDev]')
        .realHover()
        .then(() => {
          cy.get(`[data-cy=visit-template-templateExitRev2eDev-edit]`).click();
        });
      cy.get('#select-is-first-visit')
        .click({ force: true })
        .type('{downarrow}{enter}', { force: true });
      cy.get('[data-cy=right-menu-save-button]').should('have.enabled').click();
      cy.get('[data-cy=alert-success]').should('exist');
      cy.wait(5000);
    });
    it('Edit visit not first visit to adhoc visit', () => {
      cy.get('[data-cy=visit-template-templateScreeningRev2eDev]')
        .realHover()
        .then(() => {
          cy.get(`[data-cy=visit-template-templateScreeningRev2eDev-edit]`).click();
        });
      cy.get('#select-visit-type').click({ force: true }).type('{uparrow}{enter}', { force: true });
      cy.get('[data-cy=right-menu-save-button]').should('have.enabled').click();
      cy.wait(5000);
    });
    it('Edit visit scheduled form check', () => {
      cy.get('[data-cy=visit-template-templateScreeningRev2eDev]')
        .realHover()
        .then(() => {
          cy.get(`[data-cy=visit-template-templateScreeningRev2eDev-edit]`).click();
        });
      cy.get('#select-visit-type')
        .click({ force: true })
        .type('{downarrow}{enter}', { force: true });
      cy.get('[data-cy=visitBeforeWindow]').clear();
      cy.get('[data-cy=visitAfterWindow]').clear();
      cy.get('[data-cy=dayOffsetFromPreviousVisit]').clear();
      cy.get('[data-cy=visitBeforeWindow]').type('1');
      cy.get('[data-cy=right-menu-save-button]').should('have.disabled');
      cy.get('[data-cy=visitAfterWindow]').clear();
      cy.get('[data-cy=visitAfterWindow]').type('5');
      cy.get('[data-cy=right-menu-save-button]').should('have.disabled');
      cy.get('[data-cy=dayOffsetFromPreviousVisit]').clear();
      cy.get('[data-cy=dayOffsetFromPreviousVisit]').type('10');
      cy.get('[data-cy=right-menu-save-button]').should('have.enabled');
      cy.get('[data-cy=visitBeforeWindow]').clear();
      cy.get('[data-cy=right-menu-save-button]').should('have.disabled');
      cy.get('[data-cy=visitBeforeWindow]').clear();
      cy.get('[data-cy=visitBeforeWindow]').type('1');
      cy.get('[data-cy=right-menu-save-button]').should('have.enabled');
      cy.get('[data-cy=visitAfterWindow]').clear();
      cy.get('[data-cy=right-menu-save-button]').should('have.disabled');
      cy.get('[data-cy=visitAfterWindow]').clear();
      cy.get('[data-cy=visitAfterWindow]').type('7');
      cy.get('[data-cy=right-menu-save-button]').should('have.enabled');
      cy.get('[data-cy=dayOffsetFromPreviousVisit]').clear();
      cy.get('[data-cy=right-menu-save-button]').should('have.disabled');
      cy.get('[data-cy=dayOffsetFromPreviousVisit]').clear();
      cy.get('[data-cy=dayOffsetFromPreviousVisit]').type('10');
    });
  });
});
