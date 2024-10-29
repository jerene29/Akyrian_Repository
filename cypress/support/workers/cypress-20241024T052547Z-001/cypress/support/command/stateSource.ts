import { IOtherReasonType } from '../../../src/graphQL/generated/graphql';

const getQuestionFilter = (questionFilters: any) => {
  const newQuestionFilters: any = questionFilters.userVisitData.map((questionFilter) => {
    const newQuestionFilter: any = { ...questionFilter } as unknown as any;
    const filtered = questionFilters.fieldGroups.filter(
      (fieldGroup) =>
        fieldGroup.formFieldGroupResponse?.status === String(questionFilter.status[0]) ||
        fieldGroup.formFieldGroupResponse?.status === String(questionFilter.status[1]),
    );
    newQuestionFilter.total = filtered?.length;
    newQuestionFilter.key = `${newQuestionFilter.status}/${newQuestionFilter.label}`;
    return newQuestionFilter;
  });
  return newQuestionFilters;
};

const renderRejected = (selectedQuestion: any, currentPatient: any) => {
  let firstName = '';
  let lastName = '';
  let siteName = '';
  let studyRole = '';
  let description = '';

  if (
    selectedQuestion.formFieldGroupResponse.noSourceReviewRejectedReasonId ||
    selectedQuestion.formFieldGroupResponse.verifierRejectedReasonId
  ) {
    firstName = selectedQuestion.formFieldGroupResponse.rejectedBy.firstName;
    lastName = selectedQuestion.formFieldGroupResponse.rejectedBy.lastName;
    siteName = selectedQuestion.formFieldGroupResponse.rejectedBy.siteName;
    studyRole = selectedQuestion.formFieldGroupResponse.rejectedBy.studyRole;

    if (selectedQuestion.formFieldGroupResponse.noSourceReviewRejectedReasonId) {
      currentPatient.studyRevision.noSourceReviewRejectedReasons.map((reason) => {
        if (reason.id === selectedQuestion.formFieldGroupResponse.noSourceReviewRejectedReasonId) {
          description = reason.title;
        }
      });
    } else {
      currentPatient.studyRevision.verifierRejectedReasons.map((reason) => {
        if (reason.id === selectedQuestion.formFieldGroupResponse.verifierRejectedReasonId) {
          description = reason.title;
        }
      });
    }
  } else if (selectedQuestion.formFieldGroupResponse.markUpRejectedReasonId) {
    firstName = selectedQuestion.formFieldGroupResponse.rejectedMarkUpBy.firstName;
    lastName = selectedQuestion.formFieldGroupResponse.rejectedMarkUpBy.lastName;
    siteName = selectedQuestion.formFieldGroupResponse.rejectedMarkUpBy.siteName;
    studyRole = selectedQuestion.formFieldGroupResponse.rejectedMarkUpBy.studyRole;

    currentPatient.studyRevision.markUpRejectedReasons.map((reason) => {
      if (reason.id === selectedQuestion.formFieldGroupResponse.markUpRejectedReasonId) {
        description = reason.title;
      }
    });
  } else if (
    selectedQuestion.formFieldGroupResponse.sourceCaptureInvestigatorRejectedId ||
    selectedQuestion.formFieldGroupResponse.investigatorRejectedOtherReason ||
    selectedQuestion.formFieldGroupResponse.investigatorRejectedReasonId
  ) {
    firstName = selectedQuestion.formFieldGroupResponse.rejectedBy.firstName;
    lastName = selectedQuestion.formFieldGroupResponse.rejectedBy.lastName;
    siteName = selectedQuestion.formFieldGroupResponse.rejectedBy.siteName;
    studyRole = selectedQuestion.formFieldGroupResponse.rejectedBy.studyRole;

    if (selectedQuestion.formFieldGroupResponse.investigatorRejectedOtherReason) {
      description = selectedQuestion.formFieldGroupResponse.investigatorRejectedOtherReason;
    } else if (selectedQuestion.formFieldGroupResponse.investigatorRejectedReasonId) {
      description =
        currentPatient.studyRevision.investigatorRejectedReasons.filter(
          (desc) =>
            desc.id === selectedQuestion.formFieldGroupResponse.investigatorRejectedReasonId,
        )[0].title || '';
    }
  } else if (
    (selectedQuestion.formFieldGroupResponse.otherReason &&
      selectedQuestion.formFieldGroupResponse.otherReasonType === IOtherReasonType.ScFieldReject) ||
    selectedQuestion.formFieldGroupResponse.otherReasonType === IOtherReasonType.RejectMarkUp
  ) {
    firstName = selectedQuestion.formFieldGroupResponse.rejectedBy.firstName;
    lastName = selectedQuestion.formFieldGroupResponse.rejectedBy.lastName;
    siteName = selectedQuestion.formFieldGroupResponse.rejectedBy.siteName;
    studyRole = selectedQuestion.formFieldGroupResponse.rejectedBy.studyRole;
    description = selectedQuestion.formFieldGroupResponse.otherReason;
  }

  return {
    firstName,
    lastName,
    siteName,
    studyRole,
    description,
  };
};

const renderNoAnswer = (questionGroup: any, currentPatient: any) => {
  let firstName: any = undefined;
  let lastName = '';
  let siteName = '';
  let studyRole = '';
  let description = '';
  let isNoAnswer = false;
  const fieldResponse = questionGroup?.formFieldGroupResponse?.formFieldResponses.find(
    (fieldResponse) =>
      fieldResponse?.formFieldGroupResponseId === questionGroup?.formFieldGroupResponse.id,
  );

  if (questionGroup.formFieldGroupResponse?.markNoAnswerBy) {
    firstName = questionGroup.formFieldGroupResponse?.markNoAnswerBy.firstName;
    lastName = questionGroup.formFieldGroupResponse?.markNoAnswerBy.lastName;
    siteName = questionGroup.formFieldGroupResponse?.markNoAnswerBy.siteName;
    studyRole = questionGroup.formFieldGroupResponse?.markNoAnswerBy.studyRole;
  } else if (questionGroup?.formFieldGroupResponse?.dataEntryBy) {
    firstName = questionGroup?.formFieldGroupResponse?.dataEntryBy.firstName;
    lastName = questionGroup.formFieldGroupResponse?.dataEntryBy.lastName;
    siteName = questionGroup.formFieldGroupResponse?.dataEntryBy.siteName;
    studyRole = questionGroup.formFieldGroupResponse?.dataEntryBy.studyRole;
  }

  if (questionGroup.formFieldGroupResponse?.formFieldNotAvailableOtherReason)
    description = questionGroup.formFieldGroupResponse?.formFieldNotAvailableOtherReason;
  if (fieldResponse.formFieldNotAvailableReasonId) {
    if (
      currentPatient?.studyRevision?.formFieldNotAvailableReasons?.find(
        (reason) => reason.id === fieldResponse.formFieldNotAvailableReasonId,
      )
    )
      description = currentPatient.studyRevision.formFieldNotAvailableReasons.find(
        (reason) => reason.id === fieldResponse.formFieldNotAvailableReasonId,
      ).title;
  }
  if (
    !fieldResponse.formFieldNotAvailableReasonId &&
    questionGroup.formFieldGroupResponse?.otherReason
  )
    description = questionGroup.formFieldGroupResponse.otherReason;
  isNoAnswer =
    questionGroup.formFieldGroupResponse?.formFieldNotAvailableOtherReason ||
    fieldResponse.formFieldNotAvailableReasonId ||
    (!fieldResponse.formFieldNotAvailableReasonId &&
      questionGroup.formFieldGroupResponse?.otherReason);

  return { firstName, lastName, siteName, studyRole, description, isNoAnswer };
};

Cypress.Commands.add('checkStateData', (questionFilters, patient, rejectedName) => {
  if (rejectedName === 'Rejected') {
    const rejectedState = questionFilters.fieldGroups.filter(
      (fieldGroup) =>
        fieldGroup.formFieldGroupResponse?.status === 'NOT_AVAILABLE_REJECTED' ||
        fieldGroup.formFieldGroupResponse?.status === 'SOURCE_CAPTURE_REJECTED',
    );
    cy.wrap(rejectedState).each((el) => {
      const { firstName, lastName, siteName, studyRole, description } =
        renderRejected(el, patient) || {};
      const image = el.formFieldGroupResponse.sourceCapture;
      cy.get(`[data-cy=question-${el.id}]`).click();
      cy.get('[data-cy=Rejected-status]').should('exist');
      cy.get('[data-cy=title-Rejected]').contains('Rejected');
      if (description) {
        cy.get('[data-cy=desc-Rejected]').contains(`${description}`);
      }
      if (firstName && lastName) {
        cy.get('[data-cy=name-Rejected]').contains(`${firstName} ${lastName}`);
      }
      if (siteName && studyRole) {
        cy.get('[data-cy=role-Rejected]').contains(`${studyRole}, ${siteName}`);
      }
      if (el.formFieldGroupResponse.isNotAvailable) {
        cy.get('[data-cy=No-Answer-status]').should('exist');
        cy.get('[data-cy=No-Answer-status]').contains('No Answer');
        const { firstName, lastName, siteName, studyRole } =
          el.formFieldGroupResponse.markNoAnswerBy || {};
        let noAnswerDescription = '';
        patient.studyRevision.formFieldNotAvailableReasons.map((reason) => {
          if (reason.id === el.formFieldGroupResponse.formFieldNotAvailableReasonId) {
            noAnswerDescription = reason.title;
          }
        });
        if (noAnswerDescription) {
          cy.get('[data-cy=desc-No-Answer]').contains(`${noAnswerDescription}`);
        }
        if (firstName && lastName) {
          cy.get('[data-cy=name-No-Answer]').contains(`${firstName} ${lastName}`);
        }
        if (siteName && studyRole) {
          cy.get('[data-cy=role-No-Answer]').contains(`${studyRole}, ${siteName}`);
        }
      }
      cy.wait(1000);
      cy.get(`[data-cy=img-front-${image.id}]`).click();
      cy.get('[data-cy=rejected-notif]')
        .realHover()
        .then(() => {
          cy.get('[data-cy=Rejected-status]').should('exist');
          cy.get('[data-cy=title-Rejected]').contains('Rejected');
          if (description) {
            cy.get('[data-cy=desc-Rejected]').contains(`${description}`);
          }
          if (firstName && lastName) {
            cy.get('[data-cy=name-Rejected]').contains(`${firstName} ${lastName}`);
          }
          if (siteName && studyRole) {
            cy.get('[data-cy=role-Rejected]').contains(`${studyRole}, ${siteName}`);
          }
        });
      cy.wait(4000);
      cy.get('[data-cy=carousel-close]').click();
      cy.wait(1000);
    });
  } else if (rejectedName === 'MarkUpRejected') {
    const rejectedMarkUp = questionFilters.fieldGroups.filter(
      (fieldGroup) => fieldGroup.formFieldGroupResponse?.status === 'MARK_UP_REJECTED',
    );
    cy.wrap(rejectedMarkUp).each((el) => {
      const { firstName, lastName, siteName, studyRole, description } =
        renderRejected(el, patient) || {};
      cy.get(`[data-cy=question-${el.id}]`).click();
      cy.get('[data-cy=Rejected-status]').should('exist');
      cy.get('[data-cy=title-Rejected]').contains('Rejected');
      if (description) {
        cy.get('[data-cy=desc-Rejected]').contains(`${description}`);
      }
      if (firstName && lastName) {
        cy.get('[data-cy=name-Rejected]').contains(`${firstName} ${lastName}`);
      }
      if (siteName && studyRole) {
        cy.get('[data-cy=role-Rejected]').contains(`${studyRole}, ${siteName}`);
      }
      if (el.formFieldGroupResponse.isNotAvailable) {
        cy.get('[data-cy=No-Answer-status]').should('exist');
        cy.get('[data-cy=No-Answer-status]').contains('No Answer');
        const { firstName, lastName, siteName, studyRole } =
          el.formFieldGroupResponse.markNoAnswerBy || {};
        let noAnswerDescription = '';
        patient.studyRevision.formFieldNotAvailableReasons.map((reason) => {
          if (reason.id === el.formFieldGroupResponse.formFieldNotAvailableReasonId) {
            noAnswerDescription = reason.title;
          }
        });
        if (noAnswerDescription) {
          cy.get('[data-cy=desc-No-Answer]').contains(`${noAnswerDescription}`);
        }
        if (firstName && lastName) {
          cy.get('[data-cy=name-No-Answer]').contains(`${firstName} ${lastName}`);
        }
        if (siteName && studyRole) {
          cy.get('[data-cy=role-No-Answer]').contains(`${studyRole}, ${siteName}`);
        }
      }
    });
  } else if (rejectedName === 'VerifierRejected') {
    const rejectedVerifier = questionFilters.fieldGroups.filter(
      (fieldGroup) => fieldGroup.formFieldGroupResponse?.status === 'REJECTED',
    );
    cy.wrap(rejectedVerifier).each((el) => {
      const { firstName, lastName, siteName, studyRole, description } =
        renderRejected(el, patient) || {};
      cy.get(`[data-cy=question-${el.id}]`).click();
      cy.get('[data-cy=Rejected-status]').should('exist');
      cy.get('[data-cy=title-Rejected]').contains('Rejected');
      if (description) {
        cy.get('[data-cy=desc-Rejected]').contains(`${description}`);
      }
      if (firstName && lastName) {
        cy.get('[data-cy=name-Rejected]').contains(`${firstName} ${lastName}`);
      }
      if (siteName && studyRole) {
        cy.get('[data-cy=role-Rejected]').contains(`${studyRole}, ${siteName}`);
      }
      if (el.formFieldGroupResponse.isNotAvailable) {
        cy.get('[data-cy=No-Answer-status]').should('exist');
        cy.get('[data-cy=No-Answer-status]').contains('No Answer');
        const { firstName, lastName, siteName, studyRole } =
          el.formFieldGroupResponse.markNoAnswerBy || {};
        let noAnswerDescription = '';
        patient.studyRevision.formFieldNotAvailableReasons.map((reason) => {
          if (reason.id === el.formFieldGroupResponse.formFieldNotAvailableReasonId) {
            noAnswerDescription = reason.title;
          }
        });
        if (noAnswerDescription) {
          cy.get('[data-cy=desc-No-Answer]').contains(`${noAnswerDescription}`);
        }
        if (firstName && lastName) {
          cy.get('[data-cy=name-No-Answer]').contains(`${firstName} ${lastName}`);
        }
        if (siteName && studyRole) {
          cy.get('[data-cy=role-No-Answer]').contains(`${studyRole}, ${siteName}`);
        }
      }
    });
  } else if (rejectedName === 'RejectedDataEntry') {
    const rejectedState = questionFilters.fieldGroups.filter(
      (fieldGroup) =>
        fieldGroup.formFieldGroupResponse?.status === 'REJECTED_DATA_ENTRY' ||
        fieldGroup.formFieldGroupResponse?.status === 'INVESTIGATOR_REJECTED',
    );
    cy.wrap(rejectedState).each((el) => {
      const { firstName, lastName, siteName, studyRole, description } =
        renderRejected(el, patient) || {};
      cy.get(`[data-cy=question-${el.id}]`).click();
      cy.get('[data-cy=Rejected-status]').should('exist');
      cy.get('[data-cy=title-Rejected]').contains('Rejected');
      if (description) {
        cy.get('[data-cy=desc-Rejected]').contains(`${description}`);
      }
      if (firstName && lastName) {
        cy.get('[data-cy=name-Rejected]').contains(`${firstName} ${lastName}`);
      }
      if (siteName && studyRole) {
        cy.get('[data-cy=role-Rejected]').contains(`${studyRole}, ${siteName}`);
      }
      if (el.formFieldGroupResponse.isNotAvailable) {
        cy.get('[data-cy=No-Answer-status]').should('exist');
        cy.get('[data-cy=No-Answer-status]').contains('No Answer');
        const { firstName, lastName, siteName, studyRole } =
          el.formFieldGroupResponse.markNoAnswerBy || {};
        let noAnswerDescription = '';
        patient.studyRevision.formFieldNotAvailableReasons.map((reason) => {
          if (reason.id === el.formFieldGroupResponse.formFieldNotAvailableReasonId) {
            noAnswerDescription = reason.title;
          }
        });
        if (noAnswerDescription) {
          cy.get('[data-cy=desc-No-Answer]').contains(`${noAnswerDescription}`);
        }
        if (firstName && lastName) {
          cy.get('[data-cy=name-No-Answer]').contains(`${firstName} ${lastName}`);
        }
        if (siteName && studyRole) {
          cy.get('[data-cy=role-No-Answer]').contains(`${studyRole}, ${siteName}`);
        }
      }
    });
  }
});

Cypress.Commands.add('checkStateDataNoSource', (questionFilters, patient, noAnswerName) => {
  // getQuestionFilter(questionFilters)
  if (noAnswerName === 'Rejected') {
    const cards = questionFilters.fieldGroups.filter(
      (fieldGroup) =>
        fieldGroup.formFieldGroupResponse?.status === 'REJECTED' ||
        fieldGroup.formFieldGroupResponse?.status === 'INVESTIGATOR_REJECTED',
    );

    cy.wrap(cards).each((el) => {
      const { firstName, lastName, siteName, studyRole, description, isNoAnswer } = renderNoAnswer(
        el,
        patient,
      );
      cy.get(`#${el.id}`).click();
      if (isNoAnswer) {
        cy.get('[data-cy=No-Answer-status]').should('exist');
        cy.get('[data-cy=title-No-Answer]').contains('No Answer');
        if (description) {
          cy.get('[data-cy=desc-No-Answer]').contains(`${description}`);
        }
        if (firstName && lastName) {
          cy.get('[data-cy=name-No-Answer]').contains(`${firstName} ${lastName}`);
        }
        if (siteName && studyRole) {
          cy.get('[data-cy=role-No-Answer]').contains(`${studyRole}, ${siteName}`);
        }
      }

      const {
        firstName: firstNameNS,
        lastName: lastNameNS,
        siteName: siteNameNS,
        studyRole: studyRoleNS,
        description: descriptionNS,
      } = renderRejected(el, patient) || {};
      if (firstNameNS || lastNameNS || siteNameNS || studyRoleNS || descriptionNS) {
        cy.get('[data-cy=Rejected-status]').should('exist');
        cy.get('[data-cy=title-Rejected]').contains('Rejected');
        if (descriptionNS) {
          cy.get('[data-cy=desc-Rejected]').contains(`${descriptionNS}`);
        }
        if (firstNameNS && lastNameNS) {
          cy.get('[data-cy=name-Rejected]').contains(`${firstNameNS} ${lastNameNS}`);
        }
        if (siteNameNS && studyRoleNS) {
          cy.get('[data-cy=role-Rejected]').contains(`${studyRoleNS}, ${siteNameNS}`);
        }
      }
    });
  } else if (noAnswerName === 'PendingAcceptance') {
    const cards = questionFilters.fieldGroups.filter(
      (fieldGroup) => fieldGroup.formFieldGroupResponse?.status === 'FILLED',
    );
    cy.wrap(cards).each((el) => {
      const { firstName, lastName, siteName, studyRole, description, isNoAnswer } = renderNoAnswer(
        el,
        patient,
      );
      cy.get(`#${el.id}`).click();
      if (isNoAnswer) {
        cy.get('[data-cy=No-Answer-status]').should('exist');
        cy.get('[data-cy=title-No-Answer]').contains('No Answer');
        if (description) {
          cy.get('[data-cy=desc-No-Answer]').contains(`${description}`);
        }
        if (firstName && lastName) {
          cy.get('[data-cy=name-No-Answer]').contains(`${firstName} ${lastName}`);
        }
        if (siteName && studyRole) {
          cy.get('[data-cy=role-No-Answer]').contains(`${studyRole}, ${siteName}`);
        }
      }
      const {
        firstName: firstNameNS,
        lastName: lastNameNS,
        siteName: siteNameNS,
        studyRole: studyRoleNS,
        description: descriptionNS,
      } = renderRejected(el, patient) || {};
      if (firstNameNS || lastNameNS || siteNameNS || studyRoleNS || descriptionNS) {
        cy.get('[data-cy=Rejected-status]').should('exist');
        cy.get('[data-cy=title-Rejected]').contains('Rejected');
        if (descriptionNS) {
          cy.get('[data-cy=desc-Rejected]').contains(`${descriptionNS}`);
        }
        if (firstNameNS && lastNameNS) {
          cy.get('[data-cy=name-Rejected]').contains(`${firstNameNS} ${lastNameNS}`);
        }
        if (siteNameNS && studyRoleNS) {
          cy.get('[data-cy=role-Rejected]').contains(`${studyRoleNS}, ${siteNameNS}`);
        }
      }
    });
  } else if (noAnswerName === 'PendingApproval') {
    const cards = questionFilters.fieldGroups.filter(
      (fieldGroup) => fieldGroup.formFieldGroupResponse?.status === 'ACCEPTED_FROM_SOURCE_CAPTURE',
    );
    cy.wrap(cards).each((el) => {
      const { firstName, lastName, siteName, studyRole, description, isNoAnswer } = renderNoAnswer(
        el,
        patient,
      );
      cy.get(`#${el.id}`).click();
      if (isNoAnswer) {
        cy.get('[data-cy=No-Answer-status]').should('exist');
        cy.get('[data-cy=title-No-Answer]').contains('No Answer');
        if (description) {
          cy.get('[data-cy=desc-No-Answer]').contains(`${description}`);
        }
        if (firstName && lastName) {
          cy.get('[data-cy=name-No-Answer]').contains(`${firstName} ${lastName}`);
        }
        if (siteName && studyRole) {
          cy.get('[data-cy=role-No-Answer]').contains(`${studyRole}, ${siteName}`);
        }
      }
      const {
        firstName: firstNameNS,
        lastName: lastNameNS,
        siteName: siteNameNS,
        studyRole: studyRoleNS,
        description: descriptionNS,
      } = renderRejected(el, patient) || {};
      if (firstNameNS || lastNameNS || siteNameNS || studyRoleNS || descriptionNS) {
        cy.get('[data-cy=Rejected-status]').should('exist');
        cy.get('[data-cy=title-Rejected]').contains('Rejected');
        if (descriptionNS) {
          cy.get('[data-cy=desc-Rejected]').contains(`${descriptionNS}`);
        }
        if (firstNameNS && lastNameNS) {
          cy.get('[data-cy=name-Rejected]').contains(`${firstNameNS} ${lastNameNS}`);
        }
        if (siteNameNS && studyRoleNS) {
          cy.get('[data-cy=role-Rejected]').contains(`${studyRoleNS}, ${siteNameNS}`);
        }
      }
    });
  } else if (noAnswerName === 'Accepted') {
    const cards = questionFilters.fieldGroups.filter(
      (fieldGroup) => fieldGroup.formFieldGroupResponse?.status === 'ACCEPTED',
    );
    cy.wrap(cards).each((el) => {
      const { firstName, lastName, siteName, studyRole, description, isNoAnswer } = renderNoAnswer(
        el,
        patient,
      );
      cy.get(`#${el.id}`).click();
      if (isNoAnswer) {
        cy.get('[data-cy=No-Answer-status]').should('exist');
        cy.get('[data-cy=title-No-Answer]').contains('No Answer');
        if (description) {
          cy.get('[data-cy=desc-No-Answer]').contains(`${description}`);
        }
        if (firstName && lastName) {
          cy.get('[data-cy=name-No-Answer]').contains(`${firstName} ${lastName}`);
        }
        if (siteName && studyRole) {
          cy.get('[data-cy=role-No-Answer]').contains(`${studyRole}, ${siteName}`);
        }
      }
      const {
        firstName: firstNameNS,
        lastName: lastNameNS,
        siteName: siteNameNS,
        studyRole: studyRoleNS,
        description: descriptionNS,
      } = renderRejected(el, patient) || {};
      if (firstNameNS || lastNameNS || siteNameNS || studyRoleNS || descriptionNS) {
        cy.get('[data-cy=Rejected-status]').should('exist');
        cy.get('[data-cy=title-Rejected]').contains('Rejected');
        if (descriptionNS) {
          cy.get('[data-cy=desc-Rejected]').contains(`${descriptionNS}`);
        }
        if (firstNameNS && lastNameNS) {
          cy.get('[data-cy=name-Rejected]').contains(`${firstNameNS} ${lastNameNS}`);
        }
        if (siteNameNS && studyRoleNS) {
          cy.get('[data-cy=role-Rejected]').contains(`${studyRoleNS}, ${siteNameNS}`);
        }
      }
    });
  }
});

Cypress.Commands.add('markAsNoAnswerStates', (questionFilters, patient, stateName) => {
  getQuestionFilter(questionFilters);
  if (stateName === 'Unattached') {
    const copyState = questionFilters.fieldGroups.filter(
      (fieldGroup) => fieldGroup.formFieldGroupResponse?.status === 'UNATTACHED',
    )[0];
    cy.wait(3000);
    cy.get(`#${copyState.id}`)
      .realHover()
      .then(() => {
        cy.get(`[data-cy=noanswer-action-${copyState.id}] > .icon-stop`).click({
          force: true,
          multiple: false,
        });
      });
    cy.wait(1000);
    cy.get('#mark-no-answer-reason-select-id').type('{downarrow}{downarrow}{enter}', {
      force: true,
    });
    cy.get('[data-cy=button-submit-noanswer]').click();
  } else if (stateName === 'Rejected') {
    const copyState = questionFilters.fieldGroups.filter(
      (fieldGroup) =>
        fieldGroup.formFieldGroupResponse?.status === 'NOT_AVAILABLE_REJECTED' ||
        fieldGroup.formFieldGroupResponse?.status === 'SOURCE_CAPTURE_REJECTED',
    )[0];
    const isAllowNotAvailable = copyState.fields.every(
      ({ allowNotAvailable }) => allowNotAvailable,
    );
    cy.wait(3000);
    cy.get(`#${copyState.id}`)
      .realHover()
      .then(() => {
        cy.get(`[data-cy=noanswer-action-${copyState.id}] > .icon-stop`).click({
          force: true,
          multiple: false,
        });
      });
    cy.wait(1000);
    // Note: modal only show when allowNotAvailable === false

    if (!isAllowNotAvailable) {
      cy.get('#mark-no-answer-change-reason-select-id').type('{enter}', { force: true });
      cy.get('[data-cy=button-submit-noanswer]').click();
    }
  } else if (stateName === 'Attached') {
    const copyState = questionFilters.fieldGroups.filter(
      (fieldGroup) => fieldGroup.formFieldGroupResponse?.status === 'ATTACHED',
    )[0];
    cy.wait(3000);
    cy.get(`#${copyState.id}`)
      .realHover()
      .then(() => {
        cy.get(`[data-cy=noanswer-action-${copyState.id}] > .icon-stop`).click({
          force: true,
          multiple: false,
        });
      });
    cy.wait(1000);
    cy.get('#mark-no-answer-reason-select-id').type('{enter}', { force: true });
    cy.get('[data-cy=button-submit-noanswer]').click();
  }
});
