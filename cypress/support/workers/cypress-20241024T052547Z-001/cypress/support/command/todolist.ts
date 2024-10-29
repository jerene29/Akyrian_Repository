const getQuestionFilter = (questionFilters: any) => {
  const newQuestionFilters: any = questionFilters.userVisitData.map((questionFilter) => {
    const newQuestionFilter: any = { ...questionFilter } as unknown as any;
    const filtered = questionFilters.fieldGroups.filter(
      (fieldGroup) =>
        fieldGroup.formFieldGroupResponse?.status === String(questionFilter.status[0]) ||
        fieldGroup.formFieldGroupResponse?.status === String(questionFilter.status[1]),
    );
    newQuestionFilter.total = filtered?.length;
    return newQuestionFilter;
  });
  return newQuestionFilters;
};

Cypress.Commands.add('checkTodolistNoSource', (todolistData) => {
  const noSourceTodolist = getQuestionFilter(todolistData);
  cy.wrap(noSourceTodolist).each((todolist) => {
    if (!todolist.isComplete && todolist.total && todolist.todoPhrase) {
      cy.get('#cy-todolist').should('exist');
      cy.get(`[data-cy=todolist-${todolist.status[0]}]`).contains(
        `${todolist.total} ${todolist.todoPhrase}`,
      );
    }
  });
});

Cypress.Commands.add('checkTodolistSource', (todolistData) => {
  const sourceTodolist = getQuestionFilter(todolistData);
  cy.wrap(sourceTodolist).each((todolist) => {
    if (!todolist.isComplete && todolist.total && todolist.todoPhrase) {
      cy.get('#cy-todolist').should('exist');
      cy.get(`[data-cy=todolist-${todolist.status[0]}]`).contains(
        `${todolist.total} ${todolist.todoPhrase}`,
      );
    }
  });
});
