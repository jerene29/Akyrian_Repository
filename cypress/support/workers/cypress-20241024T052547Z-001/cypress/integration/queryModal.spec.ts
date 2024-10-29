import { randomAlphabet } from '../helper/randomGenerator';

const mockUserData = {
  email: 'birch@example.com',
};

describe('Query Modal tests', () => {
  before(() => {
    cy.reseedDB();
  });

  describe('Site Flow - Query UI test', () => {
    before(() => {
      cy.fillInloginAsFormV2(mockUserData);
      cy.navigateToPatient('SLO-OMN192');
    });
    beforeEach(() => {
      cy.restoreLocalStorageCache();
    });

    afterEach(() => {
      cy.saveLocalStorageCache();
    });

    it('Opening query modal', () => {
      cy.get('[data-cy=question-card-dateConsent1] > [data-cy=question-card]').realHover();
      cy.get('[data-cy=add-query-dateConsent1]').click();
    });

    it('Should have the correct title', () => {
      cy.checkModalHeader('Query - When subject consent?');
    });

    it('Should display query modal mode selector', () => {
      cy.get('[data-cy=query-mode-selector-dropdown] > .ant-select > .ant-select-selector').should(
        'exist',
      );
    });

    it('Should display Queries as default mode when opened', () => {
      cy.get(
        '[data-cy=query-mode-selector-dropdown] > .ant-select > .ant-select-selector > .ant-select-selection-item',
      ).should('have.text', 'Queries');
    });
    it('Should have the correct option list', () => {
      cy.get(
        '[data-cy=query-mode-selector-dropdown] > .ant-select > .ant-select-selector > .ant-select-selection-item',
      ).click();
      cy.get('.query-select-dropdown [title="Queries & Audit Trail"]').should('exist');
      cy.get('.query-select-dropdown [title="Queries"]').should('exist');
      cy.get('.query-select-dropdown [title="Audit Trail"]').should('exist');
    });
  });

  describe('Site Flow - Initiate query functionality', () => {
    beforeEach(() => {
      cy.restoreLocalStorageCache();
    });

    afterEach(() => {
      cy.saveLocalStorageCache();
    });

    it('Should render initiate query container and have the correct background color', () => {
      cy.get('[data-cy=initiate-query-container]').should('exist');
      cy.get('[data-cy=initiate-query-container]')
        .should('have.css', 'background-color')
        .and('eq', 'rgb(53, 55, 74)');
    });

    it('Should render the correct title for initiate query container', () => {
      cy.get('[data-cy=add-new-query-title]').should('have.text', 'Add new Query');
    });

    describe('Mention Feature tests', () => {
      beforeEach(() => {
        cy.restoreLocalStorageCache();
      });

      afterEach(() => {
        cy.saveLocalStorageCache();
        cy.get('[data-cy=mention-text-field-initiator]').clear();
      });

      it('Should show Dropdown selection of user that can be mentioned when user type "@" Character', () => {
        cy.get('[data-cy=mention-text-field-initiator]').type('testmention @');
        cy.get('.multiline-input__suggestions__list').should('be.visible');
      });
      it('Should close dropdown selection of user that can be mentioned when mention was not found from the list', () => {
        cy.get('[data-cy=mention-text-field-initiator]').type('testmention @testnotfounduser');
        cy.get('.multiline-input__suggestions__list').should('not.exist');
      });

      it('Should not display dropdown selection when user typing @ in email format (word@)', () => {
        cy.get('[data-cy=mention-text-field-initiator]').type('test email format word@');
        cy.get('.multiline-input__suggestions__list').should('not.exist');
      });

      it('Should remove mention entity when user already select user that will be mentioned and make any changes to the entity (remove entire mentioned user)', () => {
        cy.get('[data-cy=mention-text-field-initiator]').type(
          'test mention and modify the entity @{enter}{leftarrow}e',
        );
        cy.get('[data-cy=mention-text-field-initiator]').should(
          'have.text',
          'test mention and modify the entity e',
        );
      });

      describe('Mention List Formatiing', () => {
        beforeEach(() => {
          cy.restoreLocalStorageCache();
          cy.get('[data-cy=mention-text-field-initiator]').type('test mention list formatting @');
        });

        afterEach(() => {
          cy.saveLocalStorageCache();
          cy.get('[data-cy=mention-text-field-initiator]').clear();
        });

        it('Should have this format for displaying mention item [User full name (left side aligned) user role(right aligned)', () => {
          cy.get('[data-cy=mention-entry-role]:first')
            .should('have.css', 'justify-content')
            .and('eq', 'flex-end');
        });

        it('Should only show max 6 user from mention list', () => {
          cy.get('[data-cy=mention-entry-role]').should('have.length.at.most', 6);
        });

        it('Should changed based on the character that user entered after @ character (search function)', () => {
          cy.get('[data-cy=mention-text-field-initiator]').clear();
          cy.get('[data-cy=mention-text-field-initiator]').type('@nurs');
          cy.get('[data-cy=mention-entry-role]').should('have.length.at.most', 4);
          cy.get('[data-cy=mention-entry-user-scUser1]').should('exist');
        });

        it('Should move highlight of mention list when user press arrow keys', () => {
          cy.get('[data-cy=mention-text-field-initiator]').clear();
          cy.get('[data-cy=mention-text-field-initiator]').type('@n').type('{downarrow}');
          // cy.get('.multiline-input__suggestions__list > li:nth-child(1)').should('have.class', 'multiline-input__suggestions__item--focused');
        });

        it('Should add @[user full name] to textarea when user pressed enter or click or pressed (tab , tab keyboard input was not supported by cypress 13.oct.21) on highlighted mention list', () => {
          cy.get('[data-cy=mention-text-field-initiator]').clear();
          cy.get('[data-cy=mention-text-field-initiator]')
            .type('@nurs{enter}')
            .should('have.text', '@Nurse Joy');
        });
      });
    });

    describe('Textfield test', () => {
      beforeEach(() => {
        cy.restoreLocalStorageCache();
      });

      afterEach(() => {
        cy.saveLocalStorageCache();
      });

      it('Should render textfield', () => {
        cy.get('[data-cy=mention-text-field-initiator]').should('exist');
      });
      it('Should disable button when character length < 5 and query was NOT assigned to anyone', () => {
        cy.get('[data-cy=mention-text-field-initiator]').type('Test');
        cy.get('[data-cy=inititator-submit-btn]').should('be.disabled');
        cy.get('[data-cy=mention-text-field-initiator]').clear();
      });
      it('Should not accept any text input if character length more than 1024 characters', () => {
        cy.get('[data-cy=mention-text-field-initiator]').type(randomAlphabet(1026), { delay: 0 });
        cy.wait(200);
        cy.get('.ant-message-notice-content').should('exist');
      });
      it('Should render assign to label for user assignment ', () => {
        cy.get('[data-cy=assign-to-label]').should('have.text', 'Assign to');
      });
      it('Should render Type Name/Role Here as placeholder for assignee autocomplete', () => {
        cy.get('[data-cy=assignee-auto-complete] .ant-select-selection-placeholder').should(
          'have.text',
          'Type Name/Role Here',
        );
      });
      it('Should show drop down user list on focus', () => {
        cy.get('[data-cy=assignee-auto-complete] input').click();
        cy.get('.custom-auto-complete-dropdown').should('be.visible');
      });
    });

    describe('Initiate new query', () => {
      beforeEach(() => {
        cy.restoreLocalStorageCache();
      });
      afterEach(() => {
        cy.saveLocalStorageCache();
      });
      it('Initiate new query', () => {
        cy.get('[data-cy=modal-title]').click();
        cy.get('[data-cy=mention-text-field-initiator]')
          .clear()
          .type('Test initiate query from test runner @nu{enter}');
        cy.get('[data-cy=assignee-auto-complete] input').click().type('nur{downarrow}{enter}');
        cy.get('[data-cy=inititator-submit-btn]').should('be.enabled').click();
      });
    });

    describe('Initiated query header', () => {
      beforeEach(() => {
        cy.restoreLocalStorageCache();
      });
      afterEach(() => {
        cy.saveLocalStorageCache();
      });

      it('Unresolved query tag should have #93184b as bg color', () => {
        cy.get('[data-cy=query-status-tag]').should(
          'have.css',
          'background-color',
          'rgb(147, 24, 75)',
        );
      });
      it('Unresolved query tag should have text "Unresolved Query"', () => {
        cy.get('[data-cy=query-status-caption]').should('have.text', 'Unresolved Query');
      });
      it('Assignto label should have text "Assigned to" with muted color and have font size of 13px', () => {
        cy.get('[data-cy=assign-to-label]')
          .should('have.text', 'Assigned to')
          .should('have.css', 'color', 'rgb(146, 149, 174)')
          .should('have.css', 'font-size', '13px');
      });
      it('Assignee label should have text Nurse Joy, with white color and underlined and font size of 13px', () => {
        cy.get('[data-cy=assignee-label]')
          .should('have.text', 'Nurse Joy')
          .should('have.css', 'color', 'rgb(255, 255, 255)')
          .should('have.css', 'text-decoration-line', 'underline')
          .should('have.css', 'font-size', '13px');
      });
      it('Should have Resolve Query button with text "Resolve this Query" if the query have status "Unresolved" or "Answered"', () => {
        cy.get('[data-cy=resolve-query-btn-container]').should('exist');
        cy.get('[data-cy=resolve-query-btn]').should('exist');
        cy.get('[data-cy=resolve-query-btn-label]')
          .should('exist')
          .should('have.text', 'Resolve this Query')
          .should('have.css', 'color', 'rgb(146, 149, 174)')
          .should('have.css', 'font-size', '13px');
      });
    });

    describe('Initiated query body', () => {
      beforeEach(() => {
        cy.restoreLocalStorageCache();
      });

      afterEach(() => {
        cy.saveLocalStorageCache();
      });
      it('Should display user Profile image ', () => {
        cy.get('[data-cy=initiator-avatar-img]').should('exist');
      });
      it('Should render Super admin as user that initiated the query', () => {
        cy.get('[data-cy=initiator-name]').should('have.text', 'Professor Birch');
      });
      it('Should display user Role beside user full name, and should have muted color and this format "(Role)"', () => {
        cy.get('[data-cy=initiator-role]')
          .should('have.text', '(Snippet Assessment & No Source Review User)')
          .should('have.css', 'color', 'rgb(146, 149, 174)')
          .should('have.css', 'font-size', '16px');
      });
      it('Should display Datetime under user Title and have font-size of 13px and muted color', () => {
        cy.get('[data-cy=initiator-query-created-at]')
          .should('have.css', 'color', 'rgb(146, 149, 174)')
          .should('have.css', 'font-size', '13px');
      });
      it('Should render initiate query message', () => {
        cy.get('[data-cy=initiator-query-body]').should(
          'have.text',
          'Test initiate query from test runner @Nurse Joy ',
        );
      });
      it('Should have "Reply" button', () => {
        cy.get('[data-cy=query-reply-toggle-btn]').should('exist').should('be.enabled');
      });
    });
  });

  // ClickUp: DEV-2862
  describe('Site Flow - Reply query functionality', () => {
    beforeEach(() => {
      cy.restoreLocalStorageCache();
    });

    afterEach(() => {
      cy.saveLocalStorageCache();
    });

    it('Should hide "Reply" button when clicked', () => {
      cy.get('[data-cy=query-reply-toggle-btn]').click().should('not.exist');
    });

    it('Should show Textarea with mention on "Reply" button clicked', () => {
      cy.get('[data-cy=reply-text-input]').should('exist').should('be.visible');
    });
    it('Should show disabled "submit" button on "Reply" button clicked', () => {
      cy.get('[data-cy=query-reply-submit-btn]')
        .should('exist')
        .should('have.text', 'Submit')
        .should('be.disabled');
    });
    it('Should show outlined "Cancel" button on "Reply" button clicked', () => {
      cy.get('[data-cy=query-reply-cancel-btn]')
        .should('exist')
        .should('be.visible')
        .should('be.enabled')
        .should('have.text', 'Cancel')
        .should('have.css', 'background-color', 'rgba(0, 0, 0, 0)');
    });
    it('Should enable "Submit" button when textarea contain text character with length > 4', () => {
      cy.get('[data-cy=reply-text-input]').type(
        'Should enable "Submit" button when textarea contain text character with length > 4',
        { delay: 0 },
      );
      cy.get('[data-cy=query-reply-submit-btn]').should('be.enabled');
    });

    it('Should not accept any text input if textarea contain text character with length >= 1024', () => {
      cy.get('[data-cy=reply-text-input]')
        .clear()
        .type(randomAlphabet(1026), { delay: 0 })
        .invoke('val')
        .should('have.length', 1024);
    });
    it('Should show Alert message if the user type with more than 1024 text character on to text area', () => {
      cy.get('[data-cy=reply-text-input]').clear().type(randomAlphabet(1026), { delay: 0 });
      cy.get('.ant-message-notice-content').should('exist').should('be.visible');
      cy.get('[data-cy=reply-text-input]').clear();
    });
    it('Should hide textarea, submit button, cancel button, when cancel button clicked', () => {
      cy.get('[data-cy=query-reply-cancel-btn]').click().should('not.exist');
      cy.get('[data-cy=reply-text-input]').should('not.exist');
      cy.get('[data-cy=query-reply-submit-btn]').should('not.exist');
    });

    it('Should show Alert message with text "Reply submitted" when reply was successfully sent to backend', () => {
      cy.get('[data-cy=query-reply-toggle-btn]').click();
      cy.get('[data-cy=reply-text-input]').type('Test reply query written from test runner');
      cy.get('[data-cy=query-reply-submit-btn]').should('be.enabled').click();
      cy.get('.ant-message-notice-content')
        .should('exist')
        .should('be.visible')
        .should('contain.text', 'Reply Submitted');
    });
    it('Should exit query modal', () => {
      cy.get('[data-cy=modal-close] > path').click();
      cy.get('[data-cy=modal-title]').should('not.exist');
    });
  });

  describe('Sign CRF - Reply query functionality', () => {
    before(() => {
      cy.logout();
      cy.fillInloginAsFormV2({ ...mockUserData, email: 'signcrf@example.com' });
      cy.navigateToPatient('SLO-OMN192');
    });
    beforeEach(() => {
      cy.restoreLocalStorageCache();
    });

    afterEach(() => {
      cy.saveLocalStorageCache();
    });

    it('Opening query modal', () => {
      cy.clickQuickAction(
        '[data-cy=Subject consent]',
        '[data-cy=add-query-consentQuestion1]',
        undefined,
        undefined,
        'SVG',
      );
    });

    it('Initiate new query', () => {
      cy.get('[data-cy=modal-title]').click();
      cy.get('[data-cy=mention-text-field-initiator]')
        .clear()
        .type('Test initiate query from test runner @nu{enter}');
      cy.get('[data-cy=assignee-auto-complete] input').click().type('nur{downarrow}{enter}');
      cy.get('[data-cy=inititator-submit-btn]').should('be.enabled').click();
    });

    it('Should show correct UI on "Reply" button clicked', () => {
      cy.get('[data-cy=query-reply-toggle-btn]').click().should('not.exist');
      cy.get('[data-cy=reply-text-input]')
        .should('exist')
        .should('be.visible')
        .should('not.have.value');
      cy.get('[data-cy=query-reply-submit-btn]')
        .should('exist')
        .should('have.text', 'Submit')
        .should('be.disabled');
      cy.get('[data-cy=query-reply-cancel-btn]')
        .should('exist')
        .should('be.visible')
        .should('be.enabled')
        .should('have.text', 'Cancel')
        .should('have.css', 'background-color', 'rgba(0, 0, 0, 0)');
    });

    it('Should enable "Submit" button when textarea contain text character with length > 4', () => {
      cy.get('[data-cy=reply-text-input]').type(
        'Should enable "Submit" button when textarea contain text character with length > 4',
        { delay: 0 },
      );
      cy.get('[data-cy=query-reply-submit-btn]').should('be.enabled');
    });

    it('Should hide textarea, submit button, cancel button, when cancel button clicked', () => {
      cy.get('[data-cy=query-reply-cancel-btn]').click().should('not.exist');
      cy.get('[data-cy=reply-text-input]').should('not.exist');
      cy.get('[data-cy=query-reply-submit-btn]').should('not.exist');
    });

    it('Should show Alert message with text "Reply submitted" when reply was successfully sent to backend', () => {
      cy.get('[data-cy=query-reply-toggle-btn]').click();
      cy.get('[data-cy=reply-text-input]').type('Test reply query written from test runner');
      cy.get('[data-cy=query-reply-submit-btn]').should('be.enabled').click();
      cy.get('.ant-message-notice-content')
        .should('exist')
        .should('be.visible')
        .should('contain.text', 'Reply Submitted');
    });

    it('Should not retain previous input query', () => {
      cy.get('[data-cy=reply-text-input]').should('not.exist');
      cy.get('[data-cy=query-reply-toggle-btn]').click();
      cy.get('[data-cy=reply-text-input]').should('be.visible').should('not.have.value');
    });

    it('Should exit query modal', () => {
      cy.get('[data-cy=modal-close] > path').click();
      cy.get('[data-cy=modal-title]').should('not.exist');
    });
  });
});
