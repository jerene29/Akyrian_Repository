import {
  GetStudyRevisionListDocument,
  StudyCollectionDocument,
  IStudyRevisionStatus,
  IStudyRevisionWithCount,
  IStudyEnvironment,
} from '../../src/graphQL/generated/graphql';
import 'cypress-localstorage-commands';

const listEnvStudy = [
  IStudyEnvironment.Production,
  IStudyEnvironment.Uat,
  IStudyEnvironment.Staging,
  IStudyEnvironment.Development,
];

const aliasStudyRevisionList = GetStudyRevisionListDocument.definitions[0].name.value;
const aliasStudyCollection = StudyCollectionDocument.definitions[0].name.value;

const getStudyFilter = (studyFilter: IStudyRevisionWithCount[], search?: string) => {
  const newStudyFilters: any = listEnvStudy.map((list) => {
    const newStudy: any = {};

    let filteredBySearch = studyFilter;
    if (search) {
      filteredBySearch = filteredBySearch.filter((study) => {
        return study.study.name.toLowerCase().includes(search.toLowerCase());
      });
    }

    filteredBySearch = filteredBySearch.filter((study) => {
      return study.environment === list;
    });

    newStudy.list = filteredBySearch;
    newStudy.count = filteredBySearch.length;
    newStudy.env = list;
    return newStudy;
  });

  return newStudyFilters.reverse();
};

let filterStudy: any = [];
let filterNotFoundStudy: any = [];
let dataStudyRevision: any;
const searchFound = 'cvd';
const searchNotFound = 'hello';

describe('Study Config test', () => {
  let allStudyRevisionList: any = [];
  let studyConfigList = [];
  let studyCollection: any = [];
  let pausedStudies: any;
  let archivedStudies: any;
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
    cy.wait(`@${aliasStudyCollection}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        studyCollection = result.response.body.data.studyCollection[0].studyRevisions;
      }
    });
    cy.wait(`@${aliasStudyRevisionList}`).then((result) => {
      if (result?.response?.statusCode === 200) {
        allStudyRevisionList = result.response.body.data.studyRevisionList.studyRevisions;
        dataStudyRevision = result.response.body.data.studyRevisionList.studyRevisions;
        pausedStudies = allStudyRevisionList.filter(
          (study) => study.status === IStudyRevisionStatus.Paused,
        );
        archivedStudies = allStudyRevisionList.filter(
          (study) => study.status === IStudyRevisionStatus.Archived,
        );
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

  describe('Check All studies', () => {
    it('Rendered study revision list in study config page', () => {
      cy.get('[data-cy=hi-user]').should('exist');
      cy.get('[data-cy=hi-user]').contains('Hi Akyrian Admin');
      cy.get('[data-cy=user-instruction]').should('exist');
      cy.get('[data-cy=user-instruction]').contains(
        'please select your study from the list below or add a new study',
      );
      cy.get('#create-study').should('exist');
      cy.get('#logo-study-config').should('exist');
      cy.wrap(buttonList).each((button) => {
        studyConfigList = allStudyRevisionList.filter(
          (study) => study.environment === button && study.status === IStudyRevisionStatus.Active,
        );
        cy.get(`#env-selector-${button}`).click();
        cy.wait(3000);
        cy.wrap(studyConfigList).each((study) => {
          cy.get(`#active-${study.id}`).should('exist');
          cy.get(`#active-${study.id}`).contains(`v.${study.majorVersion}.${study.minorVersion}`);
          cy.get(`#active-${study.id}`).contains(`Protocol : ${study.protocol}`);
          if (study.description) {
            cy.get(`#active-${study.id}`).contains(`${study.description}`);
          }
          // cy.get(`#active-${ study.id }`).contains(`${ study.countVisit }`);
          // cy.get(`#active-${ study.id }`).contains(`${ study.countFFG }`);
        });
      });
    });
  });

  describe('Recently viewed', () => {
    it('Rendered study collection in recently viewed', () => {
      cy.get('[data-cy=text-recently-viewed]').should('exist');
      cy.get('[data-cy=text-recently-viewed]').should('have.text', 'Recently Viewed');
      if (studyCollection.length > 0) {
        cy.wrap(studyCollection).each((study) => {
          cy.get(`#recently-viewed-${study.id}`).should('exist');
          cy.get(`#recently-viewed-${study.id}`).contains(
            `v.${study.majorVersion}.${study.minorVersion}`,
          );
          cy.get(`#recently-viewed-${study.id}`).contains(`Protocol : ${study.protocol}`);
          if (study.description) {
            cy.get(`#recently-viewed-${study.id}`).contains(`${study.description}`);
          }
        });
      }
      cy.get(`#env-selector-DEVELOPMENT`).click();
      cy.wait(3000);
    });
  });
  describe('Paused studies and Archived studies', () => {
    it('Rendered Pauseed studies', () => {
      if (pausedStudies) {
        cy.wrap(pausedStudies).each((study) => {
          cy.get(`#archived-pause-${study.id}`).should('exist');
          cy.get(`#archived-pause-${study.id}`).contains(
            `v.${study.majorVersion}.${study.minorVersion}`,
          );
          cy.get(`#archived-pause-${study.id}`).contains(`Protocol : ${study.protocol}`);
          if (study.description) {
            cy.get(`#archived-pause-${study.id}`).contains(`${study.description}`);
          }
          // cy.get(`#archived-pause-${ study.id }`).contains(`${ study.countVisit }`);
          // cy.get(`#archived-pause-${ study.id }`).contains(`${ study.countFFG }`);
        });
      }
    });

    it('Rendered Archived studies', () => {
      if (archivedStudies) {
        cy.wrap(archivedStudies).each((study) => {
          cy.get(`#archived-pause-${study.id}`).should('exist');
          cy.get(`#archived-pause-${study.id}`).contains(
            `v.${study.majorVersion}.${study.minorVersion}`,
          );
          cy.get(`#archived-pause-${study.id}`).contains(`Protocol : ${study.protocol}`);
          if (study.description) {
            cy.get(`#archived-pause-${study.id}`).contains(`${study.description}`);
          }
          // cy.get(`#archived-pause-${ study.id }`).contains(`${ study.countVisit }`);
          // cy.get(`#archived-pause-${ study.id }`).contains(`${ study.countFFG }`);
        });
      }
    });
  });

  describe('Search Study', () => {
    before(() => {
      filterNotFoundStudy = getStudyFilter(dataStudyRevision, searchFound);
      filterStudy = getStudyFilter(dataStudyRevision, searchFound);
      filterStudy = filterStudy.filter((study: any) => study.count !== 0);
    });

    it('Checking found study', () => {
      cy.get('[data-cy=study-config-search-study]').click();
      cy.get('#search')
        .type(searchFound)
        .then(() => {
          cy.get('[data-cy=btn-list-env]')
            .each((element, index) => {
              cy.wrap(element)
                .click()
                .then(() => {
                  expect(element).to.have.text(
                    `${getStudyFilter(dataStudyRevision, searchFound)[index].env}${
                      getStudyFilter(dataStudyRevision, searchFound)[index].count
                    }`,
                  );
                });
            })
            .then(() => {
              cy.get('#search').type('{selectall}{backspace}');
            });
        });
    });

    it('Checking not found study', () => {
      cy.get('#search')
        .type(searchNotFound)
        .then(() => {
          cy.get('#env-selector-DEVELOPMENT').contains('0');
          cy.get('#env-selector-STAGING').contains('0');
          cy.get('#env-selector-UAT').contains('0');
          cy.get('#env-selector-PRODUCTION').contains('0');
          cy.get('[data-cy=card-study]').should('not.exist');
        });
    });
  });
});
