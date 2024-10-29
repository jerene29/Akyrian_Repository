import { d } from '../../../helper';

type CreateScheduledVisitInput = {
  visitName: string;
  anchorDirection?: 'after' | 'before';
  dayOffsetValue: Number;
  dayOffsetRange?: 'days' | 'weeks' | 'months';
  doBeforeWindow: Number;
  doAfterWindow: Number;
};

export function createScheduledVisit({
  visitName = '',
  anchorDirection = 'after',
  dayOffsetValue = 0,
  dayOffsetRange = 'days',
  doBeforeWindow = 0,
  doAfterWindow = 0,
}: CreateScheduledVisitInput) {
  cy.get(d`stickyAddButton-visit`).click();
  cy.get(d`visitName`)
    .click()
    .type(visitName);
  cy.get(d`visit-dayOffset`)
    .click()
    .type(String(dayOffsetValue));

  if (dayOffsetRange !== 'days') {
    cy.get('#select-visit-dayOffset-range')
      .click({ force: true })
      .type(dayOffsetRange === 'weeks' ? '{downarrow}{enter}' : '{downarrow}{downarrow}{enter}', {
        force: true,
      });
  }
  if (anchorDirection === 'before') {
    cy.get('#select-visit-day-direction').click({ force: true }).type('{downarrow}{enter}', {
      force: true,
    });
  }
  cy.get(d`visit-days-before`)
    .click()
    .type(String(doBeforeWindow));
  cy.get(d`visit-days-after`)
    .click()
    .type(String(doAfterWindow));

  cy.get('#button-add-visit').click();
  cy.shouldBeVisible(d`alert-success`);
}
