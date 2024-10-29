import { d } from '../../helper';

describe('Check Pre Anchor Visit Edit Validation',
 {
   "retries": 1
 },
 () => {
  before(() => {
    cy.reseedDB();
    cy.fillInloginAsFormV2({
      email: 'admin@example.com',
    });
    // rely on seed data
    cy.visit('/study/study1revisionDev2e');
    // Waiting on the query on detailView to be done first, so we don't need to click the grid view multiple times
    // We wait until the visit on the sidebar showed up
    cy.shouldBeVisible(d`visit-template-templateScreeningRev2eDev`);
    cy.get(d`grid-view`).click();
  });

  it('Setup Pre Anchor Visit', () => {
    cy.get(d`grid-view`).click();
    cy.studyConfigGridView().then((gv) => {
      // Before 1 -> 5 days before Anchor
      gv.createScheduledVisit({
        visitName: 'Before 1',
        dayOffsetValue: 5,
        anchorDirection: 'before',
        doAfterWindow: 2,
        doBeforeWindow: 2,
      });
      // Before 2 -> 7 days before Anchor
      gv.createScheduledVisit({
        visitName: 'Before 2',
        dayOffsetValue: 1,
        dayOffsetRange: 'weeks',
        anchorDirection: 'before',
        doAfterWindow: 2,
        doBeforeWindow: 2,
      });
      // Before 3 -> 30 days before Anchor
      gv.createScheduledVisit({
        visitName: 'Before 3',
        dayOffsetValue: 1,
        dayOffsetRange: 'months',
        anchorDirection: 'before',
        doAfterWindow: 2,
        doBeforeWindow: 2,
      });
    });
  });
  describe('Normal Action (no tab or shift+tab action)', () => {
    it('Edit Visit Window', () => {
      cy.hover(d`headerCell-0-3`);
      cy.shouldBeVisible(d`visitWindowBefore-0-3`).click({ force: true });
      cy.shouldBeVisible(d`editableVisitWindowBefore-0-3`)
        .focus()
        .clear()
        .type('1');
      cy.shouldBeVisible(d`editConfirm`).click();
      cy.shouldBeVisible(d`alert-success-done-button`).click();

      cy.hover(d`headerCell-0-3`);
      cy.shouldBeVisible(d`visitWindowAfter-0-3`).click({ force: true });
      cy.shouldBeVisible(d`editableVisitWindowAfter-0-3`)
        .focus()
        .clear()
        .type('1');
      cy.shouldBeVisible(d`editConfirm`).click();
      cy.shouldBeVisible(d`alert-success-done-button`).click();

      cy.shouldBeVisible(d`visitWindowBefore-0-3`).should('contain.text', '-1');
      cy.shouldBeVisible(d`visitWindowAfter-0-3`).should('contain.text', '+1');
    });
    // In this case, Before 2 & Before 3 should be affected by changes from Before 1
    it('Edit relativeDO - Before 1', () => {
      // Check the initial state
      checkVisitDetail({
        cellOrder: '0-3',
        visitDetail: {
          dayOffset: 5,
          relativeDO: 5,
        },
      });
      checkVisitDetail({
        cellOrder: '0-2',
        visitDetail: {
          dayOffset: 7,
          relativeDO: 2,
        },
      });
      checkVisitDetail({
        cellOrder: '0-1',
        visitDetail: {
          dayOffset: 30,
          relativeDO: 23,
        },
      });

      // Edit Visit Before 1 relativeDO
      cy.hover(d`headerCell-0-3`);
      cy.shouldBeVisible(d`editableIntervisitInterval-0-3`).click();
      cy.get(d`relativeDayOffsetInput-0-3`)
        .click()
        .clear()
        .type('1');
      cy.shouldBeVisible(d`editConfirm`).click();
      cy.shouldBeVisible(d`alert-success`);

      // Check the after state: relativeDO persisted, only DO got adjusted
      checkVisitDetail({
        cellOrder: '0-3',
        visitDetail: {
          dayOffset: 1,
          relativeDO: 1,
        },
      });
      checkVisitDetail({
        cellOrder: '0-2',
        visitDetail: {
          dayOffset: 3,
          relativeDO: 2,
        },
      });
      checkVisitDetail({
        cellOrder: '0-1',
        visitDetail: {
          dayOffset: 26,
          relativeDO: 23,
        },
      });
    });
    // In this case, only Before 3 should affected by changes from Before 2
    it('Edit relativeDO - Before 2', () => {
      // Check the initial state
      checkVisitDetail({
        cellOrder: '0-3',
        visitDetail: {
          dayOffset: 1,
          relativeDO: 1,
        },
      });
      checkVisitDetail({
        cellOrder: '0-2',
        visitDetail: {
          dayOffset: 3,
          relativeDO: 2,
        },
      });
      checkVisitDetail({
        cellOrder: '0-1',
        visitDetail: {
          dayOffset: 26,
          relativeDO: 23,
        },
      });

      // Edit Visit Before 1 relativeDO
      cy.hover(d`headerCell-0-2`);
      cy.shouldBeVisible(d`editableIntervisitInterval-0-2`).click();
      cy.get(d`relativeDayOffsetInput-0-2`)
        .click()
        .clear()
        .type('5');
      cy.shouldBeVisible(d`editConfirm`).click();
      cy.shouldBeVisible(d`alert-success`);

      // Check the after state: relativeDO persisted, only DO got adjusted
      checkVisitDetail({
        cellOrder: '0-3',
        visitDetail: {
          dayOffset: 1,
          relativeDO: 1,
        },
      });
      checkVisitDetail({
        cellOrder: '0-2',
        visitDetail: {
          dayOffset: 6,
          relativeDO: 5,
        },
      });
      checkVisitDetail({
        cellOrder: '0-1',
        visitDetail: {
          dayOffset: 29,
          relativeDO: 23,
        },
      });
    });
    // In this case, Before 1 & Before 2 should not be affected by changes from Before 3
    it('Edit relativeDO - Before 3', () => {
      // Check the initial state
      checkVisitDetail({
        cellOrder: '0-3',
        visitDetail: {
          dayOffset: 1,
          relativeDO: 1,
        },
      });
      checkVisitDetail({
        cellOrder: '0-2',
        visitDetail: {
          dayOffset: 6,
          relativeDO: 5,
        },
      });
      checkVisitDetail({
        cellOrder: '0-1',
        visitDetail: {
          dayOffset: 29,
          relativeDO: 23,
        },
      });

      // Edit Visit Before 1 relativeDO
      cy.hover(d`headerCell-0-1`);
      cy.shouldBeVisible(d`editableIntervisitInterval-0-1`).click();
      cy.get(d`relativeDayOffsetInput-0-1`)
        .click()
        .clear()
        .type('5');
      cy.shouldBeVisible(d`editConfirm`).click();
      cy.shouldBeVisible(d`alert-success`);

      // Check the after state: relativeDO persisted, only DO got adjusted
      checkVisitDetail({
        cellOrder: '0-3',
        visitDetail: {
          dayOffset: 1,
          relativeDO: 1,
        },
      });
      checkVisitDetail({
        cellOrder: '0-2',
        visitDetail: {
          dayOffset: 6,
          relativeDO: 5,
        },
      });
      checkVisitDetail({
        cellOrder: '0-1',
        visitDetail: {
          dayOffset: 11,
          relativeDO: 5,
        },
      });
    });
  });
  describe('Tab / Shift+Tab Action', () => {
    it('Edit relativeDO, visitWindow & visitName from Visit Before 3 until Visit Before 1', () => {
      // Edit Visit Before 1 relativeDO

      cy.hover(d`headerCell-0-1`);
      cy.shouldBeVisible(d`editableIntervisitInterval-0-1`).click();

      editVisitUsingTabAction({
        cellOrder: '0-1',
        visitInput: {
          relativeDO: 15,
          visitWindowBefore: 3,
          visitWindowAfter: 3,
          visitName: 'Before 3 Rename',
        },
      });
      editVisitUsingTabAction({
        cellOrder: '0-2',
        visitInput: {
          relativeDO: 10,
          visitWindowBefore: 2,
          visitWindowAfter: 2,
          visitName: 'Before 2 Rename',
        },
      });
      editVisitUsingTabAction({
        cellOrder: '0-3',
        visitInput: {
          relativeDO: 5,
          visitWindowBefore: 1,
          visitWindowAfter: 1,
          visitName: 'Before 1 Rename',
        },
      });

      checkVisitDetail({
        cellOrder: '0-1',
        visitDetail: {
          dayOffset: 30,
          relativeDO: 15,
          visitWindowBefore: 3,
          visitWindowAfter: 3,
          visitName: 'Before 3 Rename',
        },
      });
      checkVisitDetail({
        cellOrder: '0-2',
        visitDetail: {
          dayOffset: 15,
          relativeDO: 10,
          visitWindowBefore: 2,
          visitWindowAfter: 2,
          visitName: 'Before 2 Rename',
        },
      });
      checkVisitDetail({
        cellOrder: '0-3',
        visitDetail: {
          dayOffset: 5,
          relativeDO: 5,
          visitWindowBefore: 1,
          visitWindowAfter: 1,
          visitName: 'Before 1 Rename',
        },
      });
    });
  });
});

// Helper Function to CheckVisitDetail content
const checkVisitDetail = ({
  cellOrder,
  visitDetail = {},
}: {
  cellOrder: string;
  visitDetail?: {
    relativeDO?: number;
    visitWindowBefore?: number;
    visitWindowAfter?: number;
    visitName?: string;
    dayOffset?: number;
  };
}) => {
  const { relativeDO, visitName, visitWindowAfter, visitWindowBefore, dayOffset } = visitDetail;
  const headerCellCy = `[data-cy=headerCell-${cellOrder}]`;
  const relativeDOCy = `[data-cy=editableIntervisitInterval-${cellOrder}]`;
  const visitWindowBeforeCy = `[data-cy=visitWindowBefore-${cellOrder}]`;
  const visitWindowAfterCy = `[data-cy=visitWindowAfter-${cellOrder}]`;
  cy.hover(headerCellCy);

  if (relativeDO) {
    cy.shouldBeVisible(relativeDOCy).contains(`${String(relativeDO)} day`);
  }
  if (visitWindowBefore) {
    cy.shouldBeVisible(visitWindowBeforeCy).contains(`-${String(visitWindowBefore)}`);
  }
  if (visitWindowAfter) {
    cy.shouldBeVisible(visitWindowAfterCy).contains(`+${String(visitWindowAfter)}`);
  }
  if (visitName) {
    cy.shouldBeVisible(d`visitNameBox`).contains(String(visitName));
  }
  if (dayOffset) {
    cy.shouldBeVisible(d`dayOffsetBox`).contains(String(dayOffset));
  }

  cy.get('body').type('{esc}');
};

// Helper Function to edit visit using tab action (Needs relativeDO input to be focused first)
// At the end, it will focused the next visit relativeDO input
const editVisitUsingTabAction = ({
  cellOrder,
  visitInput = {},
}: {
  cellOrder: string;
  visitInput?: {
    relativeDO?: number;
    visitWindowBefore?: number;
    visitWindowAfter?: number;
    visitName?: string;
    dayOffset?: number;
  };
}) => {
  const { relativeDO, visitName, visitWindowAfter, visitWindowBefore, dayOffset } = visitInput;
  const relativeDOCy = `[data-cy=relativeDayOffsetInput-${cellOrder}]`;
  const visitWindowBeforeCy = `[data-cy=editableVisitWindowBefore-${cellOrder}]`;
  const visitWindowAfterCy = `[data-cy=editableVisitWindowAfter-${cellOrder}]`;

  if (relativeDO) {
    cy.get(relativeDOCy).clear().type(String(relativeDO));
    cy.get('body').tab();
    cy.shouldBeVisible(d`alert-success`);
    cy.isGone(d`alert-success`, 10000);
  } else {
    cy.get('body').tab();
  }

  if (visitWindowBefore) {
    cy.shouldBeVisible(visitWindowBeforeCy).clear().type(String(visitWindowBefore));
    cy.get('body').tab();
    cy.shouldBeVisible(d`alert-success`);
    cy.isGone(d`alert-success`, 10000);
  } else {
    cy.get('body').tab();
  }

  if (visitWindowAfter) {
    cy.shouldBeVisible(visitWindowAfterCy).clear().type(String(visitWindowAfter));
    cy.get('body').tab();
    cy.shouldBeVisible(d`alert-success`);
    cy.isGone(d`alert-success`, 10000);
  } else {
    cy.get('body').tab();
  }

  if (visitName) {
    cy.shouldBeVisible(d`visitNameInput`)
      .focus()
      .clear()
      .type(visitName);
    cy.get('body').tab();
    cy.shouldBeVisible(d`alert-success`);
    cy.isGone(d`alert-success`, 10000);
  } else {
    cy.get('body').tab();
  }

  if (dayOffset) {
    cy.shouldBeVisible(d`dayOffsetInput`)
      .focus()
      .clear()
      .type(String(dayOffset));
    cy.get('body').tab();
    cy.shouldBeVisible(d`alert-success`);
    cy.isGone(d`alert-success`, 10000);
  } else {
    cy.get('body').tab();
  }
};
