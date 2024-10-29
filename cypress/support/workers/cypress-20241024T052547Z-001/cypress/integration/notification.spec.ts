import 'cypress-localstorage-commands';

import {
  GetAllNotificationDocument,
  GetUnreadNotifAndUnresolveQueryCountDocument,
  INotificationWithData,
  INotificationObjectType,
} from '../../src/graphQL/generated/graphql';
describe('Notification', () => {
  let notifications: INotificationWithData[] = [];

  let unreadNotifications = 0;

  const aliasGetNotification = GetAllNotificationDocument.definitions[0].name.value;
  const aliasGetUnreadNotifcation =
    GetUnreadNotifAndUnresolveQueryCountDocument.definitions[0].name.value;
  before(() => {
    cy.clearLocalStorageSnapshot();
    cy.reseedDB();
    cy.fillInloginAsFormV2({
      email: 'admin@example.com',
    });
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasGetNotification) {
        req.alias = req.body.operationName;
      }
      if (req.body.operationName === aliasGetUnreadNotifcation) {
        req.alias = req.body.operationName;
      }
    });
    cy.visit('/visit/testRevisionId1/bellevueHospital1/multiSitePatient1/visit1Visit1');
    cy.waitForReact();
    cy.wait(3000);
    cy.get('[data-cy=header-bell-icon]').click();
    cy.wait(`@${aliasGetUnreadNotifcation}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        unreadNotifications = result.response.body.data.unreadNotificationCount;
      }
    });

    cy.wait(`@${aliasGetNotification}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        notifications = result.response.body.data.getAllNotifications.sort((a, b) =>
          a.createdAt > b.createdAt ? -1 : a.createdAt < b.createdAt ? 1 : 0,
        );
      }
    });
  });

  describe('Check Notif On Nurse Details', () => {
    it('Check notification list UI on Nurse Page', () => {
      notifications.forEach((notif) => {
        cy.checkUINotifOnNurseDetails(notif, 'nurse-details');
      });
    });

    it('Check notification filter', () => {
      const menuNotif = [
        {
          label: 'screens.dashboardNurse.notification.titleUnread',
          key: 'unread',
        },
        {
          label: 'screens.dashboardNurse.notification.query',
          key: 'query',
        },
        {
          label: 'screens.dashboardNurse.notification.event',
          key: 'event',
        },
      ];
      menuNotif.forEach((menu) => {
        cy.get('[data-cy=notif-filter-title]').click({ force: true });
        cy.intercept('POST', '/graphql', (req) => {
          if (req.body.operationName === aliasGetNotification) {
            req.alias = req.body.operationName;
          }
        });
        cy.get(`[data-cy=notif-filter-item-${menu.key}]`).click({ force: true });
        cy.wait(`@${aliasGetNotification}`).then((result) => {
          if (result?.response?.statusCode === 200) {
            result.response.body.data.getAllNotifications
              .sort((a, b) => (a.createdAt > b.createdAt ? -1 : a.createdAt < b.createdAt ? 1 : 0))
              .forEach((notif: INotificationWithData) => {
                cy.checkUINotifOnNurseDetails(notif, 'nurse-details');
              });
          }
        });

        cy.wait(1000);
      });
      cy.get('[data-cy=notif-filter-title]').should('be.visible').click();
      cy.get(`[data-cy=notif-filter-item-all]`).should('be.visible').click();
    });

    it('Check notification redirection', () => {
      notifications.map((notif, index) => {
        if (index !== 0) {
          cy.get('[data-cy=header-bell-icon]').click();
          cy.wait(1000);
        }
        cy.get(`[data-cy=notif-${notifications[8].id}-content]`, { timeout: 5000 }).scrollIntoView();
        cy.wait(2000);
        cy.get(`[data-cy=notif-${notif.id}-content]`, { timeout: 5000 }).scrollIntoView();
        cy.wait(2000);
        cy.get(`[data-cy=notif-${notif.id}-content]`, { timeout: 5000 }).click({ force: true });
        cy.wait(5000);
        if (notif.objectType === INotificationObjectType.Patient) {
          cy.get(`#${notif.patientId}-selectable-patient`).should('be.visible');
        } else if (notif.objectType === INotificationObjectType.Visit) {
          cy.get(`[data-cy=visit-${notif.visitId}]`).should('be.visible');
        } else if (notif.objectType === INotificationObjectType.FormFieldGroupResponse) {
          cy.get(`[data-cy=question-card-${notif.formFieldGroupId}`).should('be.visible');
        } else if (
          notif.objectType === INotificationObjectType.ResponseQuery ||
          notif.objectType === INotificationObjectType.ResponseQueryReply
        ) {
          cy.get(`#${notif.formFieldGroupId}`).should('exist');
          cy.get('[data-cy=modal-close]').click();
        }
        cy.wait(2000);
      });
    });
    it('Check notification redirection from locked patient to unlocked patient should release read only view', () => {
      cy.visit('/visit/testRevisionId1/bellevueHospital1/lockedPatient1');
      cy.waitForReact();
      cy.wait(3000);
      cy.get('[data-cy=header-bell-icon]').click();
      const firstNotifRedirectToFFGR = notifications.filter(
        (notif) => notif.objectType === INotificationObjectType.FormFieldGroupResponse,
      );
      cy.get(`[data-cy=notif-${firstNotifRedirectToFFGR[0].id}-content]`)
        .scrollIntoView()
        .click({ force: true });
      cy.wait(5000);
      cy.get(`[data-cy=question-card-${firstNotifRedirectToFFGR[0].formFieldGroupId}]`).should(
        'be.visible',
      );
      cy.get(
        `[data-cy=question-card-${firstNotifRedirectToFFGR[0].formFieldGroupId}] .question-card-container`,
      ).should('have.css', 'cursor', 'auto');
    });
  });

  describe('Check Notif On Nurse Landing', () => {
    before(() => {
      cy.get('[data-cy=header-user-popover-trigger]').click();
      cy.get('.logout-profile').click();
      cy.clearLocalStorageSnapshot();
      cy.fillInloginAsFormV2({
        email: 'admin@example.com',
      });
      cy.get('[data-cy=header-user-popover-trigger]').click();
      cy.get('[data-cy=toggle-button-site]').click();
      cy.wait(1000);
      cy.reload();
      cy.waitForReact();
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasGetNotification) {
          req.alias = req.body.operationName;
        }
        if (req.body.operationName === aliasGetUnreadNotifcation) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=header-bell-icon]').click();
      cy.wait(`@${aliasGetNotification}`).then((result) => {
        if (result?.response?.statusCode === 200) {
          notifications = result.response.body.data.getAllNotifications.sort((a, b) =>
            a.createdAt > b.createdAt ? -1 : a.createdAt < b.createdAt ? 1 : 0,
          );
        }
      });
    });

    it('Check notification list UI on Nurse Landing Page', () => {
      notifications.forEach((notif) => {
        cy.checkUINotifOnNurseDetails(notif, 'nurse-landing');
      });
    });

    it('Check notification redirection', () => {
      cy.get('[data-cy=notif-filter-title]').click();
      cy.get(`[data-cy=notif-filter-item-all]`).click();
      notifications.map((notif, index) => {
        if (index !== 0) {
          cy.get('[data-cy=header-bell-icon]').click();
          cy.wait(1000);
        }
        cy.get(`[data-cy=notif-${notifications[8].id}-content]`, { timeout: 5000 }).scrollIntoView();
        cy.wait(3000);
        cy.get(`[data-cy=notif-${notif.id}-content]`, { timeout: 5000 }).scrollIntoView();
        cy.wait(2000);
        cy.get(`[data-cy=notif-${notif.id}-content]`, { timeout: 5000 }).click({ force: true });
        cy.wait(5000);
        if (notif.objectType === INotificationObjectType.Patient) {
          cy.get(`#${notif.patientId}-selectable-patient`).should('be.visible');
        } else if (notif.objectType === INotificationObjectType.Visit) {
          cy.get(`[data-cy=visit-${notif.visitId}]`).should('be.visible');
        } else if (notif.objectType === INotificationObjectType.FormFieldGroupResponse) {
          cy.get(`[data-cy=question-card-${notif.formFieldGroupId}`).should('be.visible');
        } else if (
          notif.objectType === INotificationObjectType.ResponseQuery ||
          notif.objectType === INotificationObjectType.ResponseQueryReply
        ) {
          cy.get(`#${notif.formFieldGroupId}`).should('exist');
          cy.get('[data-cy=modal-close]').click();
        }
        cy.visit('/dashboard');
        cy.waitForReact();
        cy.wait(1000);
      });
    });
  });
});
