
import React from 'react';
import { mount } from '@cypress/react';
import { Header } from '../../src/components';

describe('Header component', () => {
  it('renders successfully', () => {
    mount(<Header />);
    cy.get('[data-cy=header-container]').should('exist');
  });

  it('renders all the key elements', () => {
    cy.get('[data-cy=header-logo]').should('exist');
    cy.get('[data-cy=header-nurse-select]').should('exist');
    cy.get('[data-cy=header-search-icon]').should('exist');
    cy.get('[data-cy=header-bell-icon]').should('exist');
    cy.get('[data-cy=header-help-icon]').should('exist');
    cy.get('[data-cy=header-user-avatar]').should('exist');
    cy.get('[data-cy=header-user-chevron-icon]').should('exist');
    cy.get('[data-cy=header-user-popover-trigger]').should('exist');
  });

  it('toggles user popover when the user area is clicked', () => {
    cy.get('[data-cy=header-user-popover]').should('not.exist');
    cy.get('[data-cy=header-user-popover-trigger]').click();
    cy.get('[data-cy=header-user-popover]').should('exist');
  });
});