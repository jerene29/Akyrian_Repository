import {
  GetSourceCaptureSuggestionsDocument,
  UpdateSourceCaptureDocument,
  GetRedactionSourceCaptureDocument,
  IFieldGroupVisitDetail,
  GetVisitDetailSourceCaptureDocument,
} from '../../../src/graphQL/generated/graphql';

const aliasGetSuggestion =
  'name' in GetSourceCaptureSuggestionsDocument.definitions[0]
    ? GetSourceCaptureSuggestionsDocument.definitions[0].name?.value
    : 'GetSourceCaptureSuggestions';
const aliasUpdateSC =
  'name' in UpdateSourceCaptureDocument.definitions[0]
    ? UpdateSourceCaptureDocument.definitions[0].name?.value
    : 'UpdateSourceCapture';
const aliasGetRedaction =
  'name' in GetRedactionSourceCaptureDocument.definitions[0]
    ? GetRedactionSourceCaptureDocument.definitions[0].name?.value
    : 'GetRedactionSourceCapture';

const aliasVisitDetailSourceCapture =
  'name' in GetVisitDetailSourceCaptureDocument.definitions[0]
    ? GetVisitDetailSourceCaptureDocument.definitions[0].name?.value
    : 'GetVisitDetailSourceCapture';

Cypress.Commands.add('openAndCheckAttachModal', (unattachedFGs: IFieldGroupVisitDetail[]) => {
  cy.get('[data-cy=UNATTACHED]').should('be.visible').click();
  cy.get(`[data-cy=question-card-${unattachedFGs[0].id}]`).should('exist');
  // cy.get(`[data-cy=question-card-${ unattachedFGs[0].id }]`).realHover();
  // cy.get(`[data-cy=question-card-${ unattachedFGs[0].id }] > .question-card-action-menu > .ant-row > [data-cy=capture-action]`).should('be.visible')
  //   .click();
  cy.clickQuickAction(
    `[data-cy=question-card-${unattachedFGs[0].id}]`,
    `[data-cy=capture-action-${unattachedFGs[0].id}]`,
  );
  cy.get('[data-cy=unattached-questions-list]').should(
    'contain',
    unattachedFGs.map((FG) => FG.shortQuestion).join(', '),
  );
  if (cy.get('.ant-tooltip')) {
    cy.get('.ant-tooltip').invoke('attr', 'style', 'display: none');
  }
  cy.get('[data-cy=screenshot-sc-button]').should('be.visible');
  cy.get('[data-cy=upload-sc-button]').should('be.visible');
});

Cypress.Commands.add('fillInFirstNameLastNameSCIntake', (name: { first: string; last: string }) => {
  cy.get('input[name="first-name-input-sc-intake"]').type(name.first);
  cy.get('input[name="last-name-input-sc-intake"]').type(name.last);
});

Cypress.Commands.add(
  'getUnverifiedData',
  (patientData: { patientsName: boolean; dateOfBirth: boolean; visitDate: boolean }) => {
    const patientDataKeys = Object.keys(patientData) as Array<keyof typeof patientData>;
    const unverifiedList = patientDataKeys.filter((data) => patientData[data] === false);
    let result = '';
    if (unverifiedList.length > 1) {
      unverifiedList.map((data, index) => {
        if (index === unverifiedList.length - 1) {
          result += `and ${data}`;
        } else {
          result += `${data}, `;
        }
      });
    } else {
      result = unverifiedList[0];
    }
    return cy.wrap(result);
  },
);

Cypress.Commands.add('waitForSuggestionResult', (retries: number) => {
  cy.wait(`@${aliasGetSuggestion}`).then((result) => {
    const status = result?.response?.body.data.sourceCaptureSuggestions.imageProcessingStatus;
    if (retries == 0 || !status) {
      throw `Error:${JSON.stringify(result.response?.body)}`;
    }
    if (result?.response?.body.data.sourceCaptureSuggestions.imageProcessingStatus === 'LOADING') {
      retries++;
      return cy.waitForSuggestionResult(retries - 1);
    }
    if (result?.response?.body.data.sourceCaptureSuggestions.imageProcessingStatus === 'FINISHED') {
      return true;
    }
  });
});

Cypress.Commands.add(
  'confirmRedactionRedirectToSuggestion',
  (type: 'continue' | 'confirm', useFixture = true, isStreamline = false) => {
    if (useFixture) {
      cy.fixture('detachReattachAndAttachSC.json').then((value) => {
        const dataSuggestion = isStreamline
          ? value.streamlineSuggestionSC.data
          : value.suggestionSC.data;
        const dataUpdateSC = value.updateSC.data;

        cy.intercept('POST', '/graphql', (req) => {
          if (req.body.operationName === aliasGetSuggestion) {
            req.alias = req.body.operationName;
            req.reply({ data: dataSuggestion });
          }
          if (req.body.operationName === aliasUpdateSC) {
            req.alias = req.body.operationName;
            req.reply({
              data: {
                ...dataUpdateSC,
                updateSourceCapture: {
                  ...dataUpdateSC.updateSourceCapture,
                },
              },
            });
          }
          if (req.body.operationName === aliasVisitDetailSourceCapture) {
            req.alias = req.body.operationName;
          }
        });

        if (type === 'confirm') {
          cy.get('[data-cy=confirm-or-redact-again-menu]').should('be.visible');
          cy.get('[data-cy=confirm-redact-button]').should('be.visible').click();
          if (isStreamline) {
            cy.wait(`@${aliasVisitDetailSourceCapture}`, { timeout: 65000 });
            cy.get('[data-cy=sc-okay-button]').should('be.visible').click();
          }
        } else {
          cy.get('[data-cy=continue-to-suggestion-button]').click();
          cy.get('[data-cy=confirm-redact-button]').click();
          cy.wait(`@${aliasVisitDetailSourceCapture}`, { timeout: 65000 });
        }
        // This suggestion will onlu requested after image from BE is loaded
        // its depend on the internet speed
        cy.wait(`@${aliasGetSuggestion}`, { timeout: 120000 }).then((result) => {
          if (result?.response?.statusCode === 200) {
            cy.get('[data-cy=right-chips-menu]').should('exist');
          }
        });
      });
    } else {
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasGetSuggestion) {
          req.alias = req.body.operationName;
        }
      });
      cy.waitForSuggestionResult(50);
    }
  },
);

Cypress.Commands.add(
  'confirmRedactionToSuggestionNoWait',
  (type: 'continue' | 'confirm', useFixture = true, isStreamline = false) => {
    if (useFixture) {
      cy.fixture('detachReattachAndAttachSC.json').then((value) => {
        const dataSuggestion = isStreamline
          ? value.streamlineSuggestionSC.data
          : value.suggestionSC.data;
        const dataUpdateSC = value.updateSC.data;

        cy.intercept('POST', '/graphql', (req) => {
          if (req.body.operationName === aliasGetSuggestion) {
            req.alias = req.body.operationName;
            req.reply({ data: dataSuggestion });
          }
          if (req.body.operationName === aliasUpdateSC) {
            req.alias = req.body.operationName;
            req.reply({
              data: {
                ...dataUpdateSC,
                updateSourceCapture: {
                  ...dataUpdateSC.updateSourceCapture,
                },
              },
            });
          }
          if (req.body.operationName === aliasVisitDetailSourceCapture) {
            req.alias = req.body.operationName;
          }
        });

        if (type === 'confirm') {
          cy.get('[data-cy=confirm-or-redact-again-menu]').should('be.visible');
          cy.get('[data-cy=confirm-redact-button]').should('be.visible').click();
          if (isStreamline) {
            cy.wait(`@${aliasVisitDetailSourceCapture}`, { timeout: 65000 });
            cy.get('[data-cy=sc-okay-button]').should('be.visible').click();
          }
        } else {
          cy.get('[data-cy=continue-to-suggestion-button]').click();
          cy.get('[data-cy=confirm-redact-button]').click();
          cy.wait(`@${aliasVisitDetailSourceCapture}`, { timeout: 65000 });
        }
      });
    } else {
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasGetSuggestion) {
          req.alias = req.body.operationName;
        }
      });
      cy.waitForSuggestionResult(50);
    }
  },
);

Cypress.Commands.add('waitForRedactionResult', (retries: number) => {
  cy.wait(`@${aliasGetRedaction}`).then((result) => {
    const status = result?.response?.body.data.redactionSourceCapture.imageProcessingStatus;
    if (retries == 0 || !status) {
      throw `Error:${JSON.stringify(result.response?.body)}`;
    }
    if (result?.response?.body.data.redactionSourceCapture.imageProcessingStatus === 'LOADING') {
      retries++;
      return cy.waitForRedactionResult(retries - 1);
    }
    if (result?.response?.body.data.redactionSourceCapture.imageProcessingStatus === 'FINISHED') {
      return true;
    }
  });
});

Cypress.Commands.add('uploadRedaction', (type: 'verified' | 'unverified', useFixture = true) => {
  if (useFixture) {
    cy.fixture('detachReattachAndAttachSC.json').then((value) => {
      const data =
        type === 'unverified' ? value.redactionUnverified.data : value.redactionVerified.data;

      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasGetRedaction) {
          req.alias = req.body.operationName;
          req.reply({ data });
        }
      });

      if (type === 'verified') {
        // CHECK REDACTION RESULT
        cy.wait(`@${aliasGetRedaction}`).then((result) => {
          if (result?.response?.statusCode === 200) {
            return result;
          }
        });
      }
    });
  } else {
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasGetRedaction) {
        req.alias = req.body.operationName;
      }
    });
    cy.waitForRedactionResult(50);
  }
});
