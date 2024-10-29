import {
  GetStudyRevisionListDocument,
  StudyCollectionDocument,
  CloneStudyRevisionDocument,
  IStudyEnvironment,
  CreateStudyDocument,
} from '../../../src/graphQL/generated/graphql';
import 'cypress-localstorage-commands';

const nextChar = (c) => {
  return String.fromCharCode(c.charCodeAt(0) + 1);
};

describe('Clone study test', () => {
  const aliasStudyRevisionList = GetStudyRevisionListDocument.definitions[0].name.value;
  const aliasStudyCollection = StudyCollectionDocument.definitions[0].name.value;
  const aliasCloneStudy = CloneStudyRevisionDocument.definitions[0].name.value;
  const aliasCreateaStudy = CreateStudyDocument.definitions[0].name.value;
  let studyRevisionList: any;
  let newStudy: any;
  let studyCardDev: any;
  let studyCardProd: any;
  let newVersion: any;
  let newCloneStudy: any;
  const buttonList = ['DEVELOPMENT', 'STAGING', 'UAT', 'PRODUCTION'];

  before(() => {
    cy.reseedDB();
    cy.clearLocalStorageSnapshot();
    cy.fillInloginAsForm({
      email: 'admin@example.com',
    });
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasStudyRevisionList) {
        req.alias = req.body.operationName;
      }
      if (req.body.operationName === aliasStudyCollection) {
        req.alias = req.body.operationName;
      }
    });
    cy.visit('/study');
    cy.wait(`@${aliasStudyCollection}`);
    cy.wait(`@${aliasStudyRevisionList}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        studyRevisionList = result.response.body.data.studyRevisionList.studyRevisions;
        studyCardProd = studyRevisionList.filter(
          (study) => study.environment === IStudyEnvironment.Production,
        )[0];
        studyCardDev = studyRevisionList.filter(
          (study) => study.environment === IStudyEnvironment.Development,
        )[0];
        console.log('studyrevlist >> ', studyRevisionList);
      }
    });
    cy.waitForReact();
  });

  beforeEach(() => {
    cy.waitForReact();
    cy.restoreLocalStorageCache();
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  describe('Check create version quick action in all env for each study card', () => {
    it('Check in each environment', () => {
      cy.wrap(buttonList).each((env) => {
        const studyLists = studyRevisionList.filter(
          (study) => study.environment === env && study.status === 'ACTIVE',
        );
        cy.get(`#env-selector-${env}`).click();
        cy.wrap(studyLists).each((study) => {
          const groupStudies = studyRevisionList
            .filter(
              (el) =>
                el.majorVersion === study.majorVersion && el.environment === study.environment,
            )
            .sort((a, b) => a.minorVersion.localeCompare(b.minorVersion));
          const str = groupStudies && groupStudies[groupStudies.length - 1].minorVersion;
          const majorVersion = study?.majorVersion;
          const minorVersion = nextChar(str);
          console.log(study.study?.studyRevisions, '<<<');
          const isReadOnly = study.isReadOnly;

          cy.wait(1000);
          if (!isReadOnly) {
            cy.get(`#active-${study.id}`).click();
            if (
              (study.majorVersion === studyCardProd.majorVersion &&
                study.minorVersion === studyCardProd.minorVersion) ||
              study.environment !== IStudyEnvironment.Development
            ) {
              console.log('in');
            } else {
              cy.get('[data-cy=icon-version]').should('exist');
              cy.get('[data-cy=icon-version]').should(
                'have.text',
                `+ Create v.${majorVersion}.${minorVersion}`,
              );
            }
          }
          cy.wait(1000);
        });
      });
    });
  });

  describe('Create new version', () => {
    it('Select a card in dev environment', () => {
      cy.get(`#env-selector-${IStudyEnvironment.Development}`).click();
      cy.get('#active-study1revisionDev2e').click();
    });
    it('Click create icon create version', () => {
      const study = studyCardDev;
      const groupStudies = studyRevisionList
        .filter(
          (el) => el.majorVersion === study.majorVersion && el.environment === study.environment,
        )
        .sort((a, b) => a.minorVersion.localeCompare(b.minorVersion));
      const str = groupStudies && groupStudies[groupStudies.length - 1].minorVersion;
      const majorVersion = study?.majorVersion;
      const minorVersion = nextChar(str);
      newVersion = {
        majorVersion,
        minorVersion,
      };
      cy.get('[data-cy=icon-version]').should('exist');
      cy.get('[data-cy=icon-version]').should(
        'have.text',
        `+ Create v.${majorVersion}.${minorVersion}`,
      );
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasCloneStudy) {
          req.alias = req.body.operationName;
        }
        if (req.body.operationName === aliasStudyRevisionList) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=icon-version]').click();
      cy.wait(`@${aliasCloneStudy}`);
      cy.wait(`@${aliasStudyRevisionList}`).then((result) => {
        if (result?.response?.statusCode === 200) {
          studyRevisionList = result.response.body.data.studyRevisionList.studyRevisions;
          console.log(studyRevisionList, '<< studyrevlist');
          newCloneStudy = studyRevisionList.filter(
            (study) =>
              study.majorVersion === newVersion.majorVersion &&
              study.minorVersion === newVersion.minorVersion,
          )[0];
          console.log(newCloneStudy, '<< studyrevlist');
        }
      });
    });
    it('Recheck new study that already created', () => {
      cy.get(`#active-${newCloneStudy.id}`).should('exist');
      cy.get(`#active-${newCloneStudy.id}`).click();
    });
  });

  describe('Create new version after create new study', () => {
    it('Click add study', () => {
      cy.get('#create-study').click();
    });
    it('Fill create study form ', () => {
      cy.get('[data-cy=textfield-container-study-organization]').type('{downarrow}{enter}');
      cy.wait(1000);

      cy.get('[data-cy=textfield-container-study-operatingOrganization]').type(
        '{downarrow}{enter}',
      );
      cy.wait(1000);

      cy.get('#studyName').clear();
      cy.get('#studyName').type('testing');

      cy.get('[data-cy=textfield-container-study-subject]').type('{downarrow}{enter}');

      cy.get('#studyProtocol').clear();
      cy.get('#studyProtocol').type('testing-subject');

      cy.get('#studyDescription').click();
      cy.get('#studyDescription').type('testing description');

      cy.get('#automaticRegex .ant-checkbox-input').check();
    });
    it('Submit form and check quick action create new version in new study card', () => {
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasCreateaStudy) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('#btn-submit').click();
      cy.wait(`@${aliasCreateaStudy}`).then((result) => {
        if (result?.response?.statusCode === 200) {
          newStudy = result.response.body.data.createStudy.studyRevision;

          cy.get('[data-cy=alert-success]')
            .should('exist')
            .contains('This Study has been added successfully');
          cy.wait(3000);
          cy.intercept('POST', '/graphql', (req) => {
            if (req.body.operationName === aliasStudyRevisionList) {
              req.alias = req.body.operationName;
            }
            if (req.body.operationName === aliasStudyCollection) {
              req.alias = req.body.operationName;
            }
          });
          cy.visit('/study');
          cy.wait(`@${aliasStudyCollection}`);
          cy.wait(`@${aliasStudyRevisionList}`);
          cy.waitForReact();
          cy.wait(1000)
            .get(`#active-${newStudy.id}`)
            .scrollIntoView({ duration: 1000 })
            .should('exist')
            .click();
          cy.get('[data-cy=icon-version]').should('have.text', `+ Create v.1.b`);
        }
      });
    });
  });
});
