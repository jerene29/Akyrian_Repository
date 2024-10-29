// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
import 'cypress-plugin-tab';
import '@4tw/cypress-drag-drop';

// Import commands.js using ES2015 syntax:
import 'cypress-plugin-snapshots/commands';
import 'cypress-react-selector';
import 'cypress-real-events/support';
import 'cypress-grep';

import './command';
import './command/others';
import './command/patient';
import './command/visit';
import './command/visitDetails';
import './command/submitVisitStatus';
import './command/studyConfig';
import './command/userConfig';
import './command/canvas';
import './command/sourceCapture';
import './command/streamline';
import './command/todolist';
import './command/auth';
import './command/stateSource';
import './command/notification';
import './command/search';
import './command/navigator';
import './command/modals';
import './command/detailStudySettingQuestion';
import './command/studyConfigGrid';
import './command/streamline';

// new one (post legacy)
import './command/studyConfigGridView';

Cypress.Cookies.defaults({
  preserve: ['access_token', 'refresh_token', 'is_logged_in', 'has_access_token'],
});

// OVERIDING CYPRESS CLEAR LOCAL STORAGE BEHAVIOUR
// THIS WAS USED TO DISABLE THE CLEARING OF LOCAL STORAGE ON EACH TEST CASE
Cypress.LocalStorage.clear = function () {
  return;
};
