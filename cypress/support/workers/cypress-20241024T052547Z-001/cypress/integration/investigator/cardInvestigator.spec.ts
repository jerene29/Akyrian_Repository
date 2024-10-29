import {
  IWithAndNoSourceForm,
  GetPatientListDocument,
  GetVisitListDocument,
  PatientVisitDetailsDocument,
  SignDocument,
  LockPatientDocument,
  IFieldGroupPatientVisitDetail,
  RejectInvestigatorDocument,
  AddResponseQueryDocument,
} from '../../../src/graphQL/generated/graphql';
import { mockUserDataInvestigator } from '../../../src/constant/testFixtures';

import { FilterQuestion, getQuestionFilter } from '../../utils/filterQuestion';

type PatientVisitDetailWithVisitName = IWithAndNoSourceForm & {
  visitName?: string;
};

const getPatient: any = GetPatientListDocument;
const getVisit: any = GetVisitListDocument;
const getPatientVisitDetail: any = PatientVisitDetailsDocument;
const postSignFfgr: any = SignDocument;
const lockPatient: any = LockPatientDocument;
const rejectInvestigator: any = RejectInvestigatorDocument;
const addQuery: any = AddResponseQueryDocument;
const aliasing = {
  getPatient: getPatient.definitions[0].name.value,
  getVisit: getVisit.definitions[0].name.value,
  getPatientVisitDetail: getPatientVisitDetail.definitions[0].name.value,
  postSignFfgr: postSignFfgr.definitions[0].name.value,
  lockPatient: lockPatient.definitions[0].name.value,
  rejectInvestigator: rejectInvestigator.definitions[0].name.value,
  addQuery: addQuery.definitions[0].name.value,
};

let firstSite: any = [];
let queryPatientVisitDetail: any = {};
let visitList: any = {};
let selectedFilter: any = {};
const search = '';
const selectedSort: any = '';
let filteredVisit: any = [];
let questions: any[];
let questionFilter: any = [];

const totalAllquestion = {
  current: 0,
  total: 0,
};

const getInvestigatorQuestions = (
  tempFilteredQuestion: PatientVisitDetailWithVisitName[],
  userVisitData: any,
  search: any,
  sort?: string,
  selectedSort?: any,
) => {
  let filterInvestigatorQuestion;
  try {
    if (selectedFilter.key) {
      filterInvestigatorQuestion = tempFilteredQuestion.map((data) => {
        const filterFieldGroups = data.fieldGroups.filter((question) =>
          isSameStatusWithSelectedFilter(question?.formFieldGroupResponse?.status),
        );
        return {
          ...data,
          fieldGroups: FilterQuestion(filterFieldGroups, search, sort, userVisitData, false, true)
            .renderedQuestionsData,
        };
      });
    } else {
      filterInvestigatorQuestion = tempFilteredQuestion.map((filter) => {
        const filterFieldGroups = filter.fieldGroups.filter(
          (field) => field.formFieldGroupResponse,
        );
        return {
          ...filter,
          fieldGroups: selectedSort
            ? FilterQuestion(filterFieldGroups, search, sort, userVisitData, false, true)
                .renderedQuestionsData
            : FilterQuestion(filterFieldGroups, search).renderedQuestionsData,
        };
      });
    }
  } catch (error) {
    console.log('[getInvestigatorQuestions on test runner] Error', error);
  }

  return filterInvestigatorQuestion;
};

const isSameStatusWithSelectedFilter = (status: any) => {
  let flag = false;
  selectedFilter.status.forEach((x: any) => {
    if (x === status) {
      flag = true;
    }
  });

  return flag;
};

const getAllFFGFiltered = (data?: PatientVisitDetailWithVisitName[]) => {
  const tempFFG = data?.reduce((next, prev) => [...next, prev.fieldGroups] as any, []);
  const resultFFG = tempFFG?.reduce(
    (next, prev) => [...next, ...prev],
    [],
  ) as IFieldGroupPatientVisitDetail[];
  return resultFFG;
};
const getSearch = async (searchType?: any) => {
  questionFilter = await getQuestionFilter(
    queryPatientVisitDetail.patientVisitDetails.userVisitData,
    searchType,
    selectedSort,
    getAllFFGFiltered(queryPatientVisitDetail.patientVisitDetails.withAndNoSourceForm),
  ).filter((question) => String(question.status) === String(selectedFilter.status));
  totalAllquestion.current = await getAllFFGFiltered(
    queryPatientVisitDetail.patientVisitDetails.withAndNoSourceForm,
  ).length;
  selectedFilter = await false;
  filteredVisit = await getInvestigatorQuestions(
    queryPatientVisitDetail.patientVisitDetails.withAndNoSourceForm,
    queryPatientVisitDetail.patientVisitDetails.userVisitData,
    searchType,
    selectedSort,
  );
  totalAllquestion.current = await getAllFFGFiltered(filteredVisit).length;
  totalAllquestion.total = await getAllFFGFiltered(
    queryPatientVisitDetail.patientVisitDetails.withAndNoSourceForm,
  ).filter((data) => data.formFieldGroupResponse).length;
};

describe('Card Investigator', () => {
  before(() => {
    cy.reseedDB();
    cy.fillInloginAsFormV2(
      mockUserDataInvestigator,
      mockUserDataInvestigator.studyId,
      mockUserDataInvestigator.studyRevisionId,
    );
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasing.getPatient) {
        req.alias = req.body.operationName;
      }
      if (req.body.operationName === aliasing.getVisit) {
        req.alias = req.body.operationName;
      }
    });
    cy.visit('/visit/testRevisionId2');
    cy.waitForReact();
    cy.wait(`@${aliasing.getPatient}`);
    cy.wait(`@${aliasing.getVisit}`);
  });

  describe('Change study', () => {
    before(() => {
      cy.saveLocalStorage();
    });

    beforeEach(() => {
      cy.restoreLocalStorageCache();
      cy.wait(2000);
    });

    afterEach(() => {
      cy.saveLocalStorageCache();
      cy.wait(2000);
    });

    it('Check signed', () => {
      cy.get('[for="Signed"] ').click();
      cy.get('#consentQuestion2 > [data-cy="Subject consent"]').realHover();
      cy.get('[data-cy=reject-answer-icon]').should('not.exist');
      cy.get('.icon-query').should('not.exist');
    });
    it('Select study', () => {
      cy.get('[data-cy=header-nurse-select]').click();
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasing.getPatient) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=studyTestId1-testRevisionId1]').click();
      cy.wait(`@${aliasing.getPatient}`).then((result) => {
        if (result.response?.statusCode === 200) {
          firstSite = result.response.body.data.sitePatientList[0];
        }
      });
      cy.wait(2000);
    });

    it('Get question filtered', () => {
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasing.getVisit) {
          req.alias = req.body.operationName;
        }
        if (req.body.operationName === aliasing.lockPatient) {
          req.alias = req.body.operationName;
        }
        if (req.body.operationName === aliasing.getPatientVisitDetail) {
          req.alias = req.body.operationName;
        }
      });
      cy.wait(2000);
      cy.get('#multiSitePatient1-selectable-patient').click();
      cy.wait(`@${aliasing.lockPatient}`);
      cy.wait(`@${aliasing.getVisit}`).then((response) => {
        cy.wrap(response).then(() => {
          visitList = response.response?.body.data.visitList;
        });
      });
      cy.wait(`@${aliasing.getPatientVisitDetail}`, { timeout: 100000 }).then((response) => {
        cy.wrap(response).then(() => {
          queryPatientVisitDetail = response.response?.body.data;
          const getQuestionsFilter = getQuestionFilter(
            response.response?.body.data.patientVisitDetails.userVisitData,
            search,
            selectedSort,
            getAllFFGFiltered(response.response?.body.data.patientVisitDetails.withAndNoSourceForm),
          );
          const filterWithCount = getQuestionsFilter?.filter((data) => data.count > 0);
          cy.wrap(filterWithCount).then(() => {
            selectedFilter = filterWithCount[0];
            const filterInvestigatorQuestions = getInvestigatorQuestions(
              response.response?.body.data.patientVisitDetails.withAndNoSourceForm,
              response.response?.body.data.patientVisitDetails.userVisitData,
              search,
              selectedSort,
            );
            cy.wrap(filterInvestigatorQuestions).then(() => {
              filteredVisit = filterInvestigatorQuestions as IWithAndNoSourceForm[];
              questions = getAllFFGFiltered(
                filterInvestigatorQuestions as PatientVisitDetailWithVisitName[],
              );
            });
          });
        });
      });
      cy.wait(3000);
    });

    it('check list visit, card value and check mark no answer', () => {
      cy.get('[data-cy=visit-name-investigator]').each((element: any, index: number) => {
        cy.wrap(element).contains(visitList[index].visitName);
      });
      cy.get('[data-cy=card-investigator]').should('have.length', questions.length);
      cy.wrap([...questions]).each((element: any, index: number) => {
        cy.get('.card-title').eq(index).should('have.text', questions[index].shortQuestion);
        if (
          questions[index].formFieldGroupResponse.sourceCapture &&
          questions[index].formFieldGroupResponse.sourceCapture.image
        ) {
          cy.get('.img-container').should('exist');
          cy.get('.icon-max').should('exist');
          if (
            questions[index].formFieldGroupResponse.dataEntryBy ||
            questions[index].formFieldGroupResponse.dataEntry2By
          ) {
            cy.get(
              '.content-outer-container > .content-inner-container > .answer-container > [data-cy=question-input-container] > [data-cy=No-Answer-status] > .ml-2 > [style="row-gap: 0px;"] > [data-cy=role-No-Answer]',
            ).should('exist');
          }
        } else {
          cy.get('[data-cy=question-label-single-choice]')
            .eq(index)
            .should('have.text', `${questions[index].shortQuestion} `);
          cy.get('[data-cy=question-answer-single-choice]').should('exist');
          if (
            questions[index].formFieldGroupResponse.dataEntryBy ||
            questions[index].formFieldGroupResponse.dataEntry2By
          ) {
            cy.get(
              '.content-outer-container > .content-inner-container > .answer-container > [data-cy=question-input-container] > [data-cy=No-Answer-status] > .ml-2 > [style="row-gap: 0px;"] > [data-cy=role-No-Answer]',
            ).should('exist');
          }
        }
      });
    });

    it('Expand card', () => {
      cy.get('[data-cy=card-investigator]').eq(0).click();
      cy.get('[data-cy=modal-expand-investigator]').should('exist');
      cy.wrap(questions).each((element: any, index: number) => {
        if (index < questions.length - 1) {
          cy.get('.ant-modal-body > .right').click();
        }

        cy.get('.card-title').eq(index).should('have.text', questions[index].shortQuestion);
        if (
          questions[index].formFieldGroupResponse.sourceCapture &&
          questions[index].formFieldGroupResponse.sourceCapture.image
        ) {
          cy.get('.img-container').should('exist');
          cy.get('.icon-max').should('exist');
        } else {
          cy.get('[data-cy=question-label-single-choice]')
            .eq(index)
            .should('have.text', `${questions[index].shortQuestion} `);
          cy.get('[data-cy=question-answer-single-choice]').should('exist');
        }
        cy.wait(2000);
      });
      cy.get('.text-back').click();
      cy.get('[data-cy=modal-expand-investigator]').should('not.exist');
    });

    it('Submit Reject question', () => {
      cy.get('[data-cy=card-investigator]').eq(0).click();
      cy.get('.question-card-action-menu').should('be.visible');
      cy.get('[data-cy=modal-expand-investigator]').should('exist');
      cy.get(
        `[data-index="0"] [tabindex="-1"] > [data-cy=card-investigator] [data-cy=editing-tools] > [data-cy=reject-answer-action]`,
      )
        .should('be.visible')
        .click();
      cy.get('[data-cy=reject-question-modal]').should('be.visible');
      cy.get('[data-cy=reject-reason] > .ant-select > .ant-select-selector')
        .click()
        .type('{downarrow}{enter}');
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasing.rejectInvestigator) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=submit-reject-reason]').click();
      cy.wait(`@${aliasing.rejectInvestigator}`).then(() => {
        cy.get('.alert-success').should('exist');
        cy.get('.text-back').click();
      });

      cy.get('[data-cy=scroll-investigator]').scrollTo('top');
    });

    it('Check Reject question', () => {
      cy.wrap(questions).then(() => {
        cy.get('[data-cy=card-investigator]').should('have.length', questions.length - 1);
        cy.get('[data-cy=INVESTIGATOR_REJECTED]')
          .contains('1')
          .click({ multiple: true, force: true });
        cy.get('[data-cy=card-investigator]').should('have.length', 1);
      });
    });

    it('Submit and Check Add Query', () => {
      cy.get('[data-cy=card-investigator]').eq(0).click();
      cy.get('.question-card-action-menu').should('be.visible');
      cy.get('[data-cy=modal-expand-investigator]').should('exist');
      cy.get(
        `[data-index="0"] [tabindex="-1"] > [data-cy=card-investigator] [data-cy=editing-tools] > [data-cy=add-query-action]`,
      )
        .eq(0)
        .should('be.visible')
        .click();
      cy.get('[data-cy=query-modal]').should('be.visible');
      cy.get('.multiline-input__input').click().type('hello akyrian');
      cy.get('[data-cy=assignee-auto-complete] > .ant-select-selector')
        .click()
        .type('{downArrow}{enter}');
      cy.get('[data-cy=inititator-submit-btn]').should('be.enabled').click();
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasing.addQuery) {
          req.alias = req.body.operationName;
        }
        if (req.body.operationName === aliasing.getPatientVisitDetail) {
          req.alias = req.body.operationName;
        }
      });
      cy.wait(`@${aliasing.getPatientVisitDetail}`).then((response) => {
        cy.customRequest(PatientVisitDetailsDocument, {
          patientId: firstSite.patients[firstSite.patients.length - 1].id,
          visitId: '',
        }).then(() => {
          cy.get('.alert-success').should('exist');
          cy.get('.header-icon-container').click({ multiple: true, force: true });
          cy.get(`[data-cy=query-tag-${questions[0].id}]`).should('exist');
          cy.get('.text-back').click({ force: true });
          queryPatientVisitDetail = response.response?.body.data;
          const getQuestionsFilter = getQuestionFilter(
            response.response?.body.data.patientVisitDetails.userVisitData,
            search,
            selectedSort,
            getAllFFGFiltered(response.response?.body.data.patientVisitDetails.withAndNoSourceForm),
          );
          const filterWithCount = getQuestionsFilter?.filter((data) => data.count > 0);
          selectedFilter = filterWithCount[0];
          cy.wait(1000);
          const filterInvestigatorQuestions = getInvestigatorQuestions(
            response.response?.body.data.patientVisitDetails.withAndNoSourceForm,
            response.response?.body.data.patientVisitDetails.userVisitData,
            search,
            selectedSort,
          );
          filteredVisit = filterInvestigatorQuestions as IWithAndNoSourceForm[];
          questions = getAllFFGFiltered(
            filterInvestigatorQuestions as PatientVisitDetailWithVisitName[],
          );
          cy.wait(1000);
        });
      });
    });

    it('Search questions', () => {
      cy.typeSearch('does').then(() => {
        getSearch('does');
      });
    });

    it('Check search', () => {
      cy.get('[data-cy=ACCEPTED]').contains(questionFilter[0].count);
      cy.get('[data-cy=card-investigator]').should('have.length', questionFilter[0].count);
      cy.get('[data-cy=total-question]').should(
        'have.text',
        `Result: ${questionFilter[0].count} out of ${questionFilter[0].total} Questions`,
      );
      cy.get('[data-cy=all-filter]')
        .contains(totalAllquestion.current)
        .click({ multiple: true, force: true });
      cy.get('[data-cy=card-investigator]').should('have.length', totalAllquestion.current);
      cy.get('[data-cy=total-question]').should(
        'have.text',
        `Result: ${totalAllquestion.current} out of ${totalAllquestion.total} Questions`,
      );
    });
  });
});
