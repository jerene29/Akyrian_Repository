import { TimeFormat } from '../../../src/constant/DateTimeFormat';
import moment = require('moment');

import { INotificationWithData } from '../../../src/graphQL/generated/graphql';

Cypress.Commands.add(
  'checkUINotifOnNurseDetails',
  (notif: INotificationWithData, type: 'nurse-landing' | 'nurse-details') => {
    cy.get(`[data-cy=notif-${notif.id}-icon-container]`, { timeout: 10000 }).should('exist');
    cy.get(`[data-cy=notif-${notif.id}-icon]`).should('exist');
    cy.get(`[data-cy=notif-${notif.id}-title]`)
      .should('exist')
      .should('have.text', notif.notificationTitle);
    cy.get(`[data-cy=notif-${notif.id}-subtitle]`)
      .should('exist')
      .should('have.text', notif.notificationItemName);

    cy.get(`[data-cy=notif-${notif.id}-created-at]`)
      .should('exist')
      .should(
        'have.text',
        `${moment(notif.createdAt).format('DD MMM YYYY')} at ${moment(notif.createdAt).format(
          TimeFormat,
        )}`,
      );
    if (type === 'nurse-details') {
      cy.get(`[data-cy=notif-${notif.id}-study]`).should('not.exist');
    } else if (type === 'nurse-landing') {
      const studyText = `${notif?.study?.name} - ${notif.studyRevision?.protocol} - v.${notif.studyRevision?.majorVersion}.${notif.studyRevision?.minorVersion} - ${notif.studyRevision?.environment}`;
      cy.get(`[data-cy=notif-${notif.id}-study]`).should('exist').should('have.text', studyText);
    }
    cy.get(`[data-cy=notif-${notif.id}-action]`).should('exist').should('not.be.visible');
  },
);
