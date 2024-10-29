import Colors from '../../../src/constant/Colors';
import { MyProfileDocument, AcceptPolicyDocument } from '../../../src/graphQL/generated/graphql';
import client from '../../utils/client';
import { Options } from 'cypress-image-snapshot';
import { months } from 'moment';
import { d } from '../../helper';

const LOCAL_STORAGE_MEMORY: any = {};
export const LOCAL_PASSWORD = 'Password!1';
const aliasing = {
  myProfile: MyProfileDocument as any,
};

const aliasLogin = 'login';
const aliasMyProfile = aliasing.myProfile.definitions[0].name.value;
const aliasAcceptPolicy = (AcceptPolicyDocument.definitions[0] as { name: { value: string } }).name
  .value;

Cypress.Commands.add('fillInloginAsForm', (data: any, redirectToVisit = false) => {
  const password = data.password ? data.password : LOCAL_PASSWORD;
  cy.clearAuthCookies();
  localStorage.clear();
  cy.intercept('POST', '/graphql', (req) => {
    if (req.body.operationName === aliasMyProfile) {
      req.alias = aliasMyProfile;
    }
  });
  cy.intercept('POST', '/api/auth/token?grantType=password', (req) => {
    req.alias = aliasLogin;
  });
  cy.visit('/login');

  cy.get('input[name="email"]').type(data.email, { force: true });
  cy.get('input[name="password"]').type(password, { force: true });
  cy.get('#loginAs-btn').click();

  cy.wait(`@${aliasLogin}`).then((res) => {
    const data = res?.response?.body;
    const userStudies = data.user.userStudies;
    if (userStudies[0]) {
      cy.setLocalStorage('privilegesByStudy', JSON.stringify([userStudies[0]]));
    }
    cy.wait(`@${aliasMyProfile}`);
    cy.setLocalStorage('userStudies', JSON.stringify(userStudies));
    localStorage.setItem('privileges', JSON.stringify(userStudies));
    localStorage.setItem('userId', data.user.id);
    localStorage.setItem('studyId', 'studyTestId1');
    localStorage.setItem('studyRevisionId', 'testRevisionId1');
    localStorage.setItem('loginAs', JSON.stringify(data));
    cy.setLocalStorage('SessionFeature', 'true');
    if (redirectToVisit) {
      cy.visit('/visit');
    }
  });
});

Cypress.Commands.add(
  'fillInloginAsFormV2',
  (
    data: any,
    studyId = 'studyTestId1',
    studyRevisionId = 'testRevisionId1',
    pageType?: 'study-question',
    acceptPolicy?: boolean,
  ) => {
    const password = data.password ? data.password : LOCAL_PASSWORD;
    cy.clearAuthCookies();
    localStorage.clear();
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasMyProfile) {
        req.alias = aliasMyProfile;
      }

      if (req.body.operationName === aliasAcceptPolicy) {
        req.alias = aliasAcceptPolicy;
      }
    });
    cy.intercept('POST', '/api/auth/token?grantType=password', (req) => {
      req.alias = aliasLogin;
    });
    cy.visit('/login');
    cy.get('input[name="email"]').type(data.email, { force: true });
    cy.get('input[name="password"]').type(password, { force: true });

    cy.get('#loginAs-btn').click();
    cy.wait(`@${aliasLogin}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        if (result.response.body.success) {
          const body = result.response.body;
          const user = body.user;
          const userStudies = user.userStudies;
          const userInfo = {
            lastLoginAt: user.lastLoginAt ? user.lastLoginAt : new Date().toISOString(),
            photo: user.photo,
          };
          if (acceptPolicy) {
            cy.get('[data-cy=submit-accept-policy]').click();
            cy.wait(`@${aliasAcceptPolicy}`);
          }
          if (userStudies[0]) {
            cy.setLocalStorage('privilegesByStudy', JSON.stringify([userStudies[0]]));
          }
          cy.wait(`@${aliasMyProfile}`);
          cy.setLocalStorage('userStudies', JSON.stringify(userStudies));
          cy.setLocalStorage('studyOrganizations', JSON.stringify(user.studyOrganizations));
          cy.setLocalStorage('privileges', JSON.stringify(userStudies));
          cy.setLocalStorage('userId', user.id);
          cy.setLocalStorage('userName', `${user.firstName} ${user.lastName}`);
          cy.setLocalStorage('userInfo', JSON.stringify(userInfo));
          cy.setLocalStorage('studyId', studyId);
          cy.setLocalStorage('studyRevisionId', studyRevisionId);
          cy.setLocalStorage('organizationId', user.organizationId);
          cy.setLocalStorage('userFlowAccess', JSON.stringify(body.userFlowAccess));
          if (pageType === 'study-question') {
            cy.setLocalStorage('studyId', 'studyTestId2');
            cy.setLocalStorage('studyRevisionId', 'study1revisionDev1a');
          }
          cy.setLocalStorage('SessionFeature', 'true');
        }
      } else {
        throw new Error(
          `Login failed with status code ${result?.response?.statusCode} (${result?.response?.statusMessage})`,
        );
      }
    });
  },
);

Cypress.Commands.add('saveLocalStorageCache', () => {
  Object.keys(localStorage).forEach((key) => {
    LOCAL_STORAGE_MEMORY[key] = localStorage[key];
  });
});

Cypress.Commands.add('restoreLocalStorageCache', () => {
  Object.keys(LOCAL_STORAGE_MEMORY).forEach((key) => {
    localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key]);
  });
});

Cypress.Commands.add('clearLocalStorage', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('userName');
  localStorage.removeItem('privileges');
});

Cypress.Commands.add('graphQL', (method, query) => {
  return cy.request({
    method: method,
    url: 'http://localhost:4000/graphql',
    body: query,
    failOnStatusCode: false,
    headers: { 'Content-Type': 'application/json' },
  });
});

Cypress.Commands.add('hideSideBar', (method, query) => {
  cy.get(
    '[data-cy=sidebar] [data-cy=sidebar-container] [data-cy=sidebar-menu-container] .sidebar-option-icon-container [data-cy=sidebar-popover-menu-col] ',
  ).click();
  cy.get('#hideSideMenu').click();
});

// WHEN TESTING COLOR, CSS STYLE WILL RETURN RGB FORMAT WHILE THE DATA THAT WILL BE TESTED IS IN HEX
// THIS FUNCTION AND COMMAND HELPS TO MAKE TESTING WORKS
const compareColor =
  (color: string, property: keyof CSSStyleDeclaration) => (targetElement: JQuery) => {
    const tempElement = document.createElement('div');
    tempElement.style.color = color;
    tempElement.style.display = 'none'; // make sure it doesn't actually render
    document.body.appendChild(tempElement); // append so that `getComputedStyle` actually works

    const tempColor = getComputedStyle(tempElement).color;
    const targetColor = getComputedStyle(targetElement[0])[property];

    document.body.removeChild(tempElement); // remove it because we're done with it

    expect(tempColor).to.equal(targetColor);
  };

Cypress.Commands.overwrite(
  'should',
  (originalFn: Function, subject: any, expectation: any, ...args: any[]) => {
    const customMatchers = {
      'have.backgroundColor': compareColor(args[0], 'backgroundColor'),
      'have.color': compareColor(args[0], 'color'),
    } as any;
    // See if the expectation is a string and if it is a member of Jest's expect
    if (typeof expectation === 'string' && customMatchers[expectation]) {
      return originalFn(subject, customMatchers[expectation]);
    }

    return originalFn(subject, expectation, ...args);
  },
);

Cypress.on('uncaught:exception', (err, runnable) => {
  // we expect a 3rd party library error with message 'list not defined'
  // and don't want to fail the test so we return false
  if (err.message.includes('tesseract')) {
    return false;
  }
  // we still want to ensure there are no other unexpected
  // errors, so we let them fail the test
});

Cypress.Commands.add('uploadFile', (fileName: string, selector = 'input[type="file"]') => {
  const options: Cypress.FixtureData = { filePath: fileName };
  const fileType = fileName.split('.').pop();
  if (String(fileType).toLowerCase() === 'pdf') {
    options.mimeType = 'application/pdf';
    options.encoding = 'binary';
  }
  cy.get(selector).attachFile(options);
});

Cypress.Commands.add('checkSubmitButtonActive', (submitButtonCy: string) => {
  let colorSplit = Colors.primary.violetBlue100.split(',');
  colorSplit = colorSplit.splice(0, colorSplit.length - 1);
  cy.get(`[data-cy=${submitButtonCy}]`).should(
    'have.css',
    'background-color',
    `${colorSplit.join(', ')})`,
  );
});

Cypress.Commands.add('clearAuthCookies', () => {
  // cy.clearCookies() does not work for some reason,
  // so we clear them one by one
  cy.clearCookie('access_token');
  cy.clearCookie('refresh_token');
  cy.clearCookie('is_logged_in');
  cy.clearCookie('has_access_token');
});

Cypress.Commands.add('reseedDB', () => {
  cy.clearAuthCookies();
  localStorage.clear();
  if (Cypress.env('TESTRUNNER_ENV')) {
    cy.exec('yarn sql:cloud:restore');
  } else {
    cy.exec('yarn sql:restore');
  }
});

Cypress.Commands.add('customRequest', (document, variables) => {
  return cy.getCookies().then((cookies) => {
    // move cookie from browser profile to cypress
    for (const cookie of cookies) {
      document.cookie = `${cookie.name}=${cookie.value}; path=/`;
    }
    return new Cypress.Promise((resolve) => {
      client
        .mutate({
          mutation: document,
          variables: variables,
        })
        .then((response) => {
          const data = response.data;
          resolve(data);
        });
    });
  });
});

Cypress.Commands.add('logout', () => {
  cy.get('[data-cy=header-user-popover-trigger]', { timeout: 10000 })
    .should('be.visible')
    .click();
  cy.get('[data-cy=logout-text]').eq(0).click();
  cy.get('.login-form').should('exist');
});

Cypress.Commands.add('scrollToElement', (selector, duration = 1000) => {
  return cy.get(selector).scrollIntoView({ duration });
});

Cypress.Commands.add(
  'checkHiddenInput',
  (getParam: string, expectedId: string, retries: number) => {
    cy.get(getParam).then((elem) => {
      if (retries === 0) {
        throw `Error:${JSON.stringify(
          `Incorrect value. Value was ${elem.val()} it should be ${expectedId}`,
        )}`;
      }
      if (elem.val() !== expectedId) {
        cy.wait(1000);
        return cy.checkHiddenInput(getParam, expectedId, retries - 1);
      }
      return true;
    });
  },
);

// TODO: adjust this to make it works so we don't have to cy.wait(5000) after each mutations that moving FFGR status to the next status
Cypress.Commands.add(
  'checkStateLabelCount',
  (getParam: string, expectedCount: number, retries: number) => {
    cy.get(getParam).then((elem) => {
      if (retries === 0) {
        throw `Error:${JSON.stringify(
          `Incorrect value. Value was ${elem.val()} it should be ${expectedCount}`,
        )}`;
      }
      if (elem.text() !== expectedCount.toString()) {
        cy.wait(1000);
        return cy.checkStateLabelCount(getParam, expectedCount, retries - 1);
      }
      return true;
    });
  },
);

Cypress.Commands.add('cssDisableMotion', (selector = 'head') => {
  cy.get('html').then(() => {
    document.querySelector(selector).insertAdjacentHTML(
      'beforeend',
      `
      <style>
        /* Disable CSS transitions. */
        * { -webkit-transition: none !important; -moz-transition: none !important; -o-transition: none !important; transition: none !important; }
        /* Disable CSS animations. */
        * { -webkit-animation: none !important; -moz-animation: none !important; -o-animation: none !important; animation: none !important; }
        /* Reset values on non-opaque/offscreen framer-motion components. */
        *[style*="opacity"] { opacity: 1 !important; }
        *[style*="transform"] { transform: none !important; }
      </style>
    `,
    );
  });
});

Cypress.Commands.add(
  'getSnapshot',
  { prevSubject: 'optional' },
  (subject: unknown, selector?: string, options?: Options) => {
    const item = subject ? cy.wrap(subject) : cy.get(String(selector));
    return item.matchImageSnapshot({ ...options });
  },
);

Cypress.Commands.add('shouldBeVisible', (selector) => {
  return cy.get(selector).should('be.visible');
});

Cypress.Commands.add('shouldNotBeVisible', (selector) => {
  return cy.get(selector).should('not.be.visible');
});

Cypress.Commands.add('hover', (selector) => {
  return cy.get(selector).trigger('mouseover');
});

Cypress.Commands.add('isGone', (selector, timeout) => {
  return timeout
    ? cy.get(selector, { timeout: timeout }).should('not.exist')
    : cy.get(selector).should('not.exist');
});

Cypress.Commands.add(
  'getStyleSnapshot',
  { prevSubject: 'optional' },
  (subject: unknown, property: keyof CSSStyleDeclaration, selector?: string) => {
    const item = subject ? cy.wrap(subject) : cy.get(String(selector));
    return item.invoke('css', property).then((value) => {
      cy.wrap({
        [String(property)]: value,
      }).toMatchSnapshot();
    });
  },
);

Cypress.Commands.add(
  'getElementSnapshot',
  { prevSubject: 'optional' },
  (subject: unknown, selector?: string) => {
    const item = subject ? cy.wrap(subject) : cy.get(String(selector));
    return item.then((value) => {
      cy.wrap(value).toMatchSnapshot();
    });
  },
);

Cypress.Commands.add(
  'getTextSnapshot',
  { prevSubject: 'optional' },
  (subject: unknown, selector?: string) => {
    type Item = Cypress.Chainable<JQuery<HTMLElement>>;
    const item = subject
      ? (cy.wrap(subject) as unknown as Item)
      : (cy.get(String(selector)) as Item);
    return item.then(($el) => {
      const $nodes = $el.contents();
      [...Array.from($nodes)].map((node) => {
        const snapshot = String(node.textContent).trim();
        cy.wrap({
          snapshot,
        }).toMatchSnapshot();
      });
    });
  },
);

Cypress.Commands.add('getCSSClassSnapshot', (selector: string) => {
  return cy
    .get(selector)
    .invoke('attr', 'class') // returns "class1 class2 class3"
    .then((classList) => {
      cy.wrap({
        classList: classList?.split(' ') || [],
      }).toMatchSnapshot();
    });
});

Cypress.Commands.add('dropdownSelect', ({ name = '', downAmount = 0, upAmount = 0 }) => {
  const downArrows = [...Array(downAmount)].map(() => '{downarrow}').join('');

  const upArrows = [...Array(upAmount)].map(() => '{uparrow}').join('');

  const selector = `[data-cy=${name}] > .ant-select > .ant-select-selector > .ant-select-selection-item`;

  cy.get(selector).type(`${downArrows}{enter}`).type(`${upArrows}{enter}`);
});
Cypress.Commands.add('checkSelectedBottomChipOnLeftSection', (selector) => {
  cy.get('[data-cy=snippetted-left-section]').within(() => {
    // Expect the selector selected, and backgroundColor of NOT becomes Colors.secondary.redFuchsia125 (can't import constant here, need to investigate further)
    cy.get(`${selector}`)
      .should('exist')
      .should('not.have.css', 'background-color', 'rgb(160, 4, 69)');
  });
});

Cypress.Commands.add('checkSelectedBottomChipOnRightSection', (selector) => {
  cy.get('[data-cy=rejected-right-section]').within(() => {
    // Expect the selector selected, and backgroundColor of it becomes Colors.secondary.redFuchsia125 (can't import constant here, need to investigate further)
    cy.get(`${selector}`).should('exist').should('have.css', 'background-color', 'rgb(160, 4, 69)');
    // Note: Rejected color will always be the same
  });
});

Cypress.Commands.add('fillInTodayForDateDropdown', () => {
  const today = new Date();
  const monthString = months()[today.getMonth()];
  cy.get(d`select-year`).type(today.getFullYear() + '{enter}');
  cy.get(d`select-month`).type(`${monthString}{enter}`);
  cy.get(d`select-date`).type(`${today.getDate()}{enter}`);
});
