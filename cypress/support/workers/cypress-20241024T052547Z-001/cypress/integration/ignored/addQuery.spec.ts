describe('Render notif', () => {
  const notificationList = [];
  before(() => {
    cy.visit('/');
    cy.waitForReact();
    // cy.fixture('notifications.json').then(value => {
    //   notificationList = value.notificationList;
    // });
  });
  
  it('Render notif count', () => {
    cy.get('[data-cy=header-bell-icon-badge]');
  });
  
  it('Render notif list', () => {
    cy.get('[data-cy=header-bell-icon]').click();
    notificationList.map(notif => {
      cy.get(`[data-cy=notif-${notif.id}]`);
      cy.get('.notif-content-subtitle').contains(notif.notificationItemName);
      cy.react('div', {
        props: {
          id: `notif-unread-status-${notif.id}`,
          status: notif.isRead
        }
      });
    });
  });
  
});
