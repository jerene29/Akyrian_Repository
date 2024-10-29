describe('Get Visit List', () => {
  let visitList = [];
  before(() => {
    cy.visit('/',);
    cy.waitForReact();
    cy.fixture('visit.json').then(value => {
      visitList = value.visitList;
    });
  });

  it('Show all visit', () => {
    cy.openSideBarShowVisit();

    visitList.forEach(visit => {
      cy.get(`[data-cy=visit-${visit.id}]`).scrollIntoView();
      cy.get(`[data-cy=visit-${visit.id}]`).within(() => {
        cy.get('p').contains(visit.visitName);
      });
    });
  });
 
});