import { GetPatientListDocument, GetVisitListDocument, LockPatientDocument, LoginDocument, GetVisitDetailsDocument } from "../../src/graphQL/generated/graphql";
import client from "../utils/client";
import { FilterQuestion, exists, handleFieldsSearch, generateSort, getQuestionFilter } from '../utils/filterQuestion';
import { mockUserDataAdmin } from "../../src/constant/testFixtures";

const getPatient: any = GetPatientListDocument;
const getVisit: any = GetVisitListDocument;
const lockPatient: any = LockPatientDocument;
const getVisitDetail: any = GetVisitDetailsDocument;
const aliasing = {
  getPatient: getPatient.definitions[0].name.value,
  getVisit: getVisit.definitions[0].name.value,
  lockPatient: lockPatient.definitions[0].name.value,
  getVisitDetail: getVisitDetail.definitions[0].name.value,
};

let firstSite: any = [];
let selectedFilter: any = {};
let search = '';
let selectedSort: any = '';
let question: any = [];

let visitDetail = {
  noSource: {} as any,
  withSource: {} as any
};

let totalQuestionFiltered = {
  current: 0,
  total: 0
};

let totalAllQuestion = {
  current: 0,
  total: 0
};

const questionListFiltered = (questionList?: any, selectedStatus?: any) => {
  return questionList.filter((question: any) => {
    if (selectedStatus.status) {
      return question.formFieldGroupResponse?.status === String(selectedStatus.status[0]) || question.formFieldGroupResponse?.status === String(selectedStatus.status[1]);
    }
  });
};

const getSearch = (value?: any, detail?: any) => {
  const getQuestionsFilter =
    getQuestionFilter(detail.userVisitData,
      value, selectedSort, detail.fieldGroups);
  const filterWithCount = getQuestionsFilter?.filter(data => data.count > 0);
  selectedFilter = filterWithCount[0];
  cy.wait(1000);
  question = FilterQuestion(question, value, selectedSort, detail).renderedQuestionsData;
  totalQuestionFiltered.current = FilterQuestion(question, value, selectedSort, detail).totalCount;
};

const getDataQuestions = (ffg?: any, userVisit?: any) => {
  const getQuestionsFilter =
    getQuestionFilter(userVisit,
      search, selectedSort, ffg);
  const filterWithCount = getQuestionsFilter?.filter(data => data.count > 0);
  selectedFilter = filterWithCount[0];
  cy.wait(1000);
  totalAllQuestion.total = ffg.length;
  question = questionListFiltered(ffg, selectedFilter);
  totalQuestionFiltered.total = question.length;
};

describe(('Search Question'), () => {
  before(() => {
    cy.reseedDB()
    cy.fillInloginAsFormV2(mockUserDataAdmin);
    cy.intercept('POST', '/graphql', req => {
      if (req.body.operationName === aliasing.getPatient) {
        req.alias = req.body.operationName;
      }
      if (req.body.operationName === aliasing.getVisit) {
        req.alias = req.body.operationName;
      }
    });
    cy.visit('/visit');
    cy.wait(`@${ aliasing.getPatient }`);
    cy.wait(`@${ aliasing.getVisit }`);
    cy.waitForReact();
  });

  beforeEach(() => {
    cy.wait(1000);
    cy.restoreLocalStorageCache();
    cy.wait(1000);
  });

  afterEach(() => {
    cy.wait(1000);
    cy.saveLocalStorageCache();
    cy.wait(1000);
  });

  describe(('Select study, type search question'), () => {
    beforeEach(() => {
      cy.wait(1000);
      cy.restoreLocalStorageCache();
      cy.wait(1000);
    });

    afterEach(() => {
      cy.wait(1000);
      cy.saveLocalStorageCache();
      cy.wait(1000);
    });

    it(('Select patient'), () => {
      cy.intercept('POST', '/graphql', req => {
        if (req.body.operationName === aliasing.getVisit) {
          req.alias = req.body.operationName;
        }
        if (req.body.operationName === aliasing.lockPatient) {
          req.alias = req.body.operationName;
        }
        if (req.body.operationName === aliasing.getVisitDetail) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('#multiSitePatient1-selectable-patient').click();
      cy.wait(`@${ aliasing.lockPatient }`);
      cy.wait(`@${ aliasing.getVisit }`);
      cy.wait(`@${ aliasing.getVisitDetail }`);
    });

    it(('Select Visit & check no source'), () => {
      cy.intercept('POST', '/graphql', req => {
        if (req.body.operationName === aliasing.getVisitDetail) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=visit-visit1Visit1]').click({ force: true });
      cy.wait(`@${ aliasing.getVisitDetail }`).then(response => {
        visitDetail.noSource = response.response?.body.data.visitDetails.noSourceForm;
        visitDetail.withSource = response.response?.body.data.visitDetails.withSourceForm;
        getDataQuestions(response.response?.body.data.visitDetails.noSourceForm.fieldGroups, response.response?.body.data.visitDetails.noSourceForm.userVisitData);
      });
    });

    it(('Check card filtered no source'), () => {
      cy.get('[data-cy=UNFILLED]').contains(question.length);
      cy.getCurrentAndTotalQuestions(question.length, totalAllQuestion.total);
      cy.get('[data-cy=UNFILLED]').click();
    });

    it(('Get search no source'), () => {
      cy.typeSearch('write').then(() => {
        getSearch('write', visitDetail.noSource);
      });
    });
    it(('Check search no source'), () => {
      cy.get('[data-cy=UNFILLED]').contains(question.length);
      cy.getSearchResult(question.length, totalQuestionFiltered.current, totalQuestionFiltered.total, totalAllQuestion.total);
    });

    it(('Selected source capture'), () => {
      cy.get('[data-cy=sourceQuestionTab]').click();
      getDataQuestions(visitDetail.withSource.fieldGroups, visitDetail.withSource.userVisitData);
    });

    it(('Check card source capture'), () => {
      cy.get('[data-cy=UNATTACHED]').contains(question.length);
      cy.getCurrentAndTotalQuestions(question.length, totalAllQuestion.total);
      cy.get('[data-cy=UNATTACHED]').click();
    });

    it(('Get search source capture'), () => {
      cy.typeSearch('musc').then(() => {
        getSearch('musc', visitDetail.withSource);
      });
    });
    it(('Check search source capture'), () => {
      cy.get('[data-cy=UNATTACHED]').contains(question.length).click().then(() => {
        cy.getSearchResult(question.length, totalQuestionFiltered.current, totalQuestionFiltered.total, totalAllQuestion.total);
      });
    });
  });
});
