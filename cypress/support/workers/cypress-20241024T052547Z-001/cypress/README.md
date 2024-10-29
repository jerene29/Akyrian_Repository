# Testing convention


<!-- will update the docs more later, this is rough -->

### folder & test file structure

- use options loginAs, to login as specific user, won't automatically login if not supplied.
- feel free to add more nested describe, context, it, whatever necessary to tell the story of your test
 
example:
```ts
// [specnumber] [name/title/context]/testTitle.ts
import { d, designSpec } from '../../helper';

const options = {
  loginAs: 'admin@example.com',
};

designSpec(
  {
    spec: 'S-09-037',
    title: 'Active Edit Mode on Visit',
  },
  () => {
    before(() => {
      cy.createStudy({
        name: 'GRIDVIEW_TEST',
        formCount: 5,
        visitCount: 5,
      });
    });

    context('keyboard shortcut', () => {
      it('uses [RETURN] key - saves changes to the active field provided there is a valid entr', () => {
        cy.hover(d`headerCell-0-1`);
        // d is util function that replaces input with the data-cy format below
        cy.shouldBeVisible('[data-cy=headerCell-0-1]');
      });
    });
  },
  options,
);
```


2 main useful functions
```ts
// usage d`elementName`
d(args: TemplateStringsArray): strings

designSpec(spec: SpecDefinition, callback: () => void, options: Options): void
```

### creating page specific commands vs general commands.

for general commands (meaning commands that can be used on multiple page without any problem), you can create them freely either inside other.ts or specific [pageFile].ts that won't be a problem to be called anywhere. the reason being specific page commands need to be grouped so it won't bloat the  ./support/command/index.ts global Cypress type declaration.

__page specific command group example__


sample declaration:

- must return Cypress.promise

[example](./support/command/studyConfigGridView/index.ts)

```ts
import { createAdHocVisit } from './createAdHocVisit';
import { createChildVisit } from './createChildVisit';

export type StudyConfigGridViewCommands = ReturnType<typeof studyConfigGridView>;

const studyConfigGridView = () => {
  return Cypress.Promise.resolve({
    createAdHocVisit,
    createChildVisit,
  });
};

Cypress.Commands.add('studyConfigGridView', studyConfigGridView);
```

import them on [./support/index.ts](./support/index.ts)

```ts

import './command/studyConfigGridView';

```

add them inside [type declaration](./support/command/index.ts)

```ts
      // GridView Commands Collection
      studyConfigGridView: () => StudyConfigGridViewCommands;
```

And then you can use them inside an `it` callback, and chain the promise (do not wrap in async await, cause Cypress won't work well with that inside a test suite).

```ts
    context(
      'checks types of visits appearances - grouped by vertical labeled lines in the following order',
      () => {
        it('can create 2 visits Ad-Hoc and Child', () => {
          cy.studyConfigGridView().then((gv) => {
            gv.createAdHocVisit({ visitName: 'AdHoc 1' });
            gv.createChildVisit({ visitName: 'Child 1' });
          });
        });

        // top operation should be done by now
        it('checks vertical spacer is in order', () => {
          cy.shouldBeVisible(d`spacer-SCHEDULED`);
          cy.shouldBeVisible(d`spacer-AD_HOC`);
          cy.shouldBeVisible(d`spacer-HIDDEN`);
        });
      },
    );

```

__general command example__

[example](./support/command/others.ts)

```ts
Cypress.Commands.add('shouldBeVisible', (selector) => {
  return cy.get(selector).should('be.visible');
});

Cypress.Commands.add('shouldNotBeVisible', (selector) => {
  return cy.get(selector).should('not.be.visible');
});
```

add them inside [type declaration](./support/command/index.ts)

```ts
   shouldBeVisible(selector: string): Chainable<Subject>;
   shouldNotBeVisible(selector: string): Chainable<Subject>;
```



list of frequently useful general commands:

all starts with cy.

- getSnapshot (generate image snapshot) to fix same image but wrong diffing result snapshot, run cypress with yarn test:spec.
- shouldBeVisible
- shoudNotBeVisible
- hover
- isGone (checks if component no longer exist in the dom)
- getTextSnapshot, a little bit foolproof way to snapshot, since you only capture the text element of the selected dom.
- getStyleSnapshot
  - sample:
  ```ts
  cy.getStyleSnapShot('backgroundColor', '#header');
  cy.getStyleSnapShot('backgroundColor', d`visitNameInputBox`);
  ```
- getElementSnapshot (snapshoting the dom element, but avoid having unique generated id, since it will generates new id then it will be different on every test)

- getCSSClassSnapshot, simply provide the selector, classList will all be snapshot

etc on [other.ts](./support/command/others.ts)...

