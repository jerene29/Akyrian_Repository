import 'cypress-localstorage-commands';
import {
  CreateVisitTemplateDocument,
  GetStudyRevisionListDocument,
  StudyCollectionDocument,
} from '../../../src/graphQL/generated/graphql';

describe('Add Adhoc visit and Scheduled visit in study config', () => {
  const aliasStudyRevisionList = GetStudyRevisionListDocument.definitions[0].name.value;
  const aliasStudyCollection = StudyCollectionDocument.definitions[0].name.value;
  describe('Add adhoc visit', () => {
    before(() => {
      cy.reseedDB();
      cy.clearLocalStorageSnapshot();
      cy.visit('/login');
      cy.fillInloginAsFormV2({
        email: 'admin@example.com',
      });
      cy.saveLocalStorage();
      cy.waitForReact();
    });

    beforeEach(() => {
      cy.restoreLocalStorageCache();
    });

    afterEach(() => {
      cy.saveLocalStorageCache();
    });

    it('Add study', () => {
      cy.get('#create-study').should('exist');
      cy.get('#create-study').click();
      // cy.get('#studyName').clear();
      // cy.get('#studyName').type('tes name');
      // cy.get('#studySubjectPharse').clear();
      // cy.get('#studySubjectPharse').type('tes subject');
      // cy.get('#studyProtocol').clear();
      // cy.get('#studyProtocol').type('tes protocol');
      // cy.get('#studyDecsription').click();
      // cy.get('#studyDecsription').type('test desc');
      // cy.get('[data-cy=firstInput-0]').clear();
      // cy.get('[data-cy=firstInput-0]').type('2');
      // cy.get('[data-cy=secondInput-0]').clear();
      // cy.get('[data-cy=secondInput-0]').type('2');
      // cy.get('#studyIdExample').clear();
      // cy.get('#studyIdExample').type('test inst');
      // cy.get('#btn-submit').click()
      cy.get('.icon-close').click();
      cy.wait(1000);
    });

    it('Add Adhoc Visit', () => {
      const alias = CreateVisitTemplateDocument.definitions[0].name.value;
      cy.intercept('POST', 'graphql', (req) => {
        if (req.body.operationName === alias) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=visit-name]').clear();
      cy.get('[data-cy=visit-name]').type('Screening');
      cy.get('#select-visit-type')
        .click({ force: true })
        .type('{downarrow}{downarrow}{enter}', { force: true });
      cy.get('#isAdverseEvent').check();
      cy.get('#closeFutureVisit').check();
      cy.get('#button-add-visit').click();
      cy.waitForReact();
      cy.wait(`@${alias}`).then((res) => {
        if (res) {
          cy.get('[data-cy=alert-success]').should('exist');
        }
      });
    });
  });

  // comment because cannot add scheduled first visit in seed that already have first visit
  // describe('Add Scheduled visit for first visit', () => {
  //   before(() => {
  //     cy.clearLocalStorageSnapshot();
  //     cy.visit('/login');
  //     cy.fillInloginAsFormV2({
  //       email: 'admin@example.com',
  //       password: 'Akyrian!1'
  //     });
  //     cy.saveLocalStorage();
  //     cy.waitForReact();

  //   });

  //   beforeEach(() => {
  //     cy.restoreLocalStorageCache();
  //   });

  //   afterEach(() => {
  //     cy.saveLocalStorageCache();
  //   });

  //   it('Add study', () => {
  //     cy.get('#create-study').should('exist')
  //     cy.get('#create-study').click()
  //     // cy.get('#studyName').clear();
  //     // cy.get('#studyName').type('tes name 2');
  //     // cy.get('#studySubjectPharse').clear();
  //     // cy.get('#studySubjectPharse').type('tes subject 2');
  //     // cy.get('#studyProtocol').clear();
  //     // cy.get('#studyProtocol').type('tes protocol 2');
  //     // cy.get('#studyDecsription').click();
  //     // cy.get('#studyDecsription').type('test desc 2');
  //     // cy.get('[data-cy=firstInput-0]').clear();
  //     // cy.get('[data-cy=firstInput-0]').type('2');
  //     // cy.get('[data-cy=secondInput-0]').clear();
  //     // cy.get('[data-cy=secondInput-0]').type('2');
  //     // cy.get('#studyIdExample').clear();
  //     // cy.get('#studyIdExample').type('test inst 2');
  //     // cy.get('#btn-submit').click()
  //     cy.get('.icon-close').click()
  //     cy.wait(1000)
  //   })

  //   it('Add Scheduled Visit for first visit', () => {
  //     const alias = CreateVisitTemplateDocument.definitions[0].name.value;
  //     cy.intercept('POST', 'graphql', req => {
  //       if (req.body.operationName === alias) {
  //         req.alias = req.body.operationName;
  //       }
  //     });
  //     cy.get('[data-cy=visit-name]').clear();
  //     cy.get('[data-cy=visit-name]').type('Screening');
  //     cy.get('#select-visit-type').click({ force: true })
  //       .type('{downarrow}{downarrow}{downarrow}{enter}', { force: true });
  //     cy.get('#select-is-first-visit').click({ force: true })
  //       .type('{downarrow}{enter}', { force: true });
  //     cy.get('#button-add-visit').click();
  //     cy.waitForReact();
  //     cy.react('Button', {
  //       props: {
  //         id: 'button-add-visit',
  //         loading: true
  //       }
  //     });
  //     cy.wait(`@${alias}`).then(res => {
  //       if (res) {
  //         cy.react('Button', {
  //           props: {
  //             id: 'button-add-visit',
  //             loading: false
  //           }
  //         });
  //         cy.get('[data-cy=alert-success]').should('exist');
  //       }
  //     });
  //   });
  // })

  describe('Add scheduled visit for not first visit', () => {
    before(() => {
      cy.clearLocalStorageSnapshot();
      cy.visit('/login');
      cy.fillInloginAsFormV2({
        email: 'admin@example.com',
      });
      cy.saveLocalStorage();
      cy.waitForReact();
    });

    beforeEach(() => {
      cy.restoreLocalStorageCache();
    });

    afterEach(() => {
      cy.saveLocalStorageCache();
    });

    it('Add study', () => {
      cy.get('#create-study').should('exist');
      cy.get('#create-study').click();
      // cy.get('#studyName').clear();
      // cy.get('#studyName').type('tes name 3');
      // cy.get('#studySubjectPharse').clear();
      // cy.get('#studySubjectPharse').type('tes subject 3');
      // cy.get('#studyProtocol').clear();
      // cy.get('#studyProtocol').type('tes protocol 3');
      // cy.get('#studyDecsription').click();
      // cy.get('#studyDecsription').type('test desc 3');
      // cy.get('[data-cy=firstInput-0]').clear();
      // cy.get('[data-cy=firstInput-0]').type('2');
      // cy.get('[data-cy=secondInput-0]').clear();
      // cy.get('[data-cy=secondInput-0]').type('2');
      // cy.get('#studyIdExample').clear();
      // cy.get('#studyIdExample').type('test inst 3');
      // cy.get('#btn-submit').click()
      cy.get('.icon-close').click();
      cy.wait(1000);
    });

    it('Add Scheduled Visit for not first visit', () => {
      const alias = CreateVisitTemplateDocument.definitions[0].name.value;
      cy.intercept('POST', 'graphql', (req) => {
        if (req.body.operationName === alias) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=visit-name]').clear();
      cy.get('[data-cy=visit-name]').type('Screening');
      cy.get('#select-visit-type')
        .click({ force: true })
        .type('{downarrow}{downarrow}{downarrow}{enter}', { force: true });
      cy.get('[data-cy=visitBeforeWindow]').clear();
      cy.get('[data-cy=visitBeforeWindow]').type('1');
      cy.get('#button-add-visit').should('have.disabled');
      cy.get('[data-cy=visitAfterWindow]').clear();
      cy.get('[data-cy=visitAfterWindow]').type('5');
      cy.get('#button-add-visit').should('have.disabled');
      cy.get('[data-cy=dayOffsetFromPreviousVisit]').clear();
      cy.get('[data-cy=dayOffsetFromPreviousVisit]').type('10');
      cy.get('#button-add-visit').should('have.enabled');
      cy.get('[data-cy=visitBeforeWindow]').clear();
      cy.get('#button-add-visit').should('have.disabled');
      cy.get('[data-cy=visitBeforeWindow]').type('-1');
      cy.get('#button-add-visit').should('have.disabled');
      cy.get('[data-cy=visitBeforeWindow]').clear();
      cy.get('[data-cy=visitBeforeWindow]').type('1');
      cy.get('#button-add-visit').should('have.enabled');
      cy.get('[data-cy=visitAfterWindow]').clear();
      cy.get('#button-add-visit').should('have.disabled');
      cy.get('[data-cy=visitAfterWindow]').type('-1');
      cy.get('#button-add-visit').should('have.disabled');
      cy.get('[data-cy=visitAfterWindow]').clear();
      cy.get('[data-cy=visitAfterWindow]').type('7');
      cy.get('#button-add-visit').should('have.enabled');
      cy.get('[data-cy=dayOffsetFromPreviousVisit]').clear();
      cy.get('#button-add-visit').should('have.disabled');
      cy.get('[data-cy=dayOffsetFromPreviousVisit]').type('-4');
      cy.get('#button-add-visit').should('have.disabled');
      cy.get('[data-cy=dayOffsetFromPreviousVisit]').clear();
      cy.get('[data-cy=dayOffsetFromPreviousVisit]').type('10');
      cy.get('#button-add-visit').should('have.enabled');
      cy.get('#button-add-visit').click();
      cy.waitForReact();
      cy.wait(`@${alias}`).then((res) => {
        if (res) {
          cy.get('[data-cy=alert-success]').should('exist');
        }
      });
    });
  });
});
