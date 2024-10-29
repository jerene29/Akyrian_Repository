import { createAdHocVisit } from './createAdHocVisit';
import { createChildVisit } from './createChildVisit';
import { createScheduledVisit } from './createScheduledVisit';

export type StudyConfigGridViewCommands = ReturnType<typeof studyConfigGridView>;

// NOTE: use Cypress.Promise to resolve because .add second params expect a function that returns type CanReturnChainable = void | Chainable | Promise<unknown>, and Cypress knows to resolve this promise that it won't ended up bugging the test
const studyConfigGridView = () => {
  return Cypress.Promise.resolve({
    createAdHocVisit,
    createChildVisit,
    createScheduledVisit,
  });
};

// NOTE: I'm trying new pattern to access specific page command that won't bloat the suggestion with createVisit from other page for example. studyConfigGridView().then((gv) => gv.createChildVisit()); and doesn't bloat the type defintion on support/command/index.ts
Cypress.Commands.add('studyConfigGridView', studyConfigGridView);
