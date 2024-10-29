import { RealHoverOptions } from 'cypress-real-events/commands/realHover';

export type OCRName =
  | 'Respirationrate'
  | 'BloodType'
  | 'RightEye'
  | 'Lungs'
  | 'Brain'
  | 'BloodPressure'
  | 'Abdomen'
  | 'Muscle'
  | 'Weight'
  | 'Height'
  | 'Hearing'
  | 'VaccineSideEffects'
  | 'VaccineName'
  | 'SpinalCord'
  | 'Heartbeatpatient'
  | 'TemporalLobe'
  | 'Extermities'
  | 'Temperature';

export type OCRLabel =
  | 'Respiration rate'
  | 'Blood Type'
  | 'Blood Pressure'
  | 'Muscle'
  | 'Weight'
  | 'Hearing'
  | 'Vaccine Side Effects'
  | 'Abdomen'
  | 'Heartbeat patient'
  | 'Brain';

export type SnippetTool = 'Snippet' | 'Redaction' | 'Opacity' | 'ZoomIn' | 'ZoomOut';

Cypress.Commands.add(
  'drawSingleRect',
  (
    point: { x: number; y: number; x2: number; y2: number },
    drawFrom?: 'bottom-right',
    force = false,
  ) => {
    const { x, y, x2, y2 } = point;

    const xStart = drawFrom === 'bottom-right' ? x2 : x;
    const xEnd = drawFrom === 'bottom-right' ? x : x2;

    const yStart = drawFrom === 'bottom-right' ? y2 : y;
    const yEnd = drawFrom === 'bottom-right' ? y : y2;
    cy.get('[data-cy=canvas-container] canvas', { timeout: 40000 })
      .trigger('mousedown', {
        x: xStart,
        y: yStart,
        isPrimary: true,
        force,
      })
      .wait(100)
      .trigger('mousemove', {
        x: xEnd,
        y: yEnd,
        force,
      })
      .wait(100)
      .trigger('mouseup', {
        x: xEnd,
        y: yEnd,
        force,
      });
  },
);

Cypress.Commands.add(
  'drawMultiRect',
  (points: { x: number; y: number; x2: number; y2: number }[]) => {
    points.map((point) => {
      const { x, y, x2, y2 } = point;
      cy.get('[data-cy=canvas-container] canvas')
        .trigger('mousedown', {
          x: x,
          y: y,
          isPrimary: true,
          force: true,
        })
        .wait(100)
        .trigger('mousemove', {
          x: x2,
          y: y2,
          force: true,
        })
        .wait(100)
        .trigger('mouseup', {
          x: x2,
          y: y2,
          force: true,
        });
      cy.wait(500);
    });
  },
);

Cypress.Commands.add(
  'selectMarkup',
  (
    OCRName,
    point: { x: number; y: number; x2: number; y2: number },
    markupIndex?: number,
    position?: 'top' | 'bottom' | 'left',
    clickBottomChip?: true,
  ) => {
    const { x, y, x2, y2 } = point;

    const tagPos = {
      x:
        position === 'left'
          ? x - 30
          : position === 'top' || position === 'bottom'
          ? x + 5
          : x2 + 30,
      y: position === 'top' ? y - 30 : position === 'bottom' ? y2 + 30 : y + 5,
    };

    if (clickBottomChip) {
      cy.clickBottomChip(OCRName);
    }

    cy.get('[data-cy=canvas-container]')
      .trigger('mousedown', {
        x: tagPos.x,
        y: !markupIndex ? tagPos.y : tagPos.y + markupIndex * 20,
        isPrimary: true,
        force: true,
      })
      .trigger('mouseup', {
        x: tagPos.x,
        y: !markupIndex ? tagPos.y : tagPos.y + markupIndex * 20,
        force: true,
      });
  },
);

Cypress.Commands.add(
  'hoverMarkup',
  (point: { x: number; y: number; x2: number; y2: number }, markupIndex?: number) => {
    const { y, x2 } = point;
    const tagPos = {
      x: x2 + 30,
      y: y + 5,
    };

    cy.get('[data-cy=canvas-container] canvas').trigger('mousemove', {
      x: tagPos.x,
      y: !markupIndex ? tagPos.y : tagPos.y + markupIndex * 20,
    });
  },
);

Cypress.Commands.add('setSnippetToolsTooltipToBeHidden', () => {
  cy.get('.ant-tooltip').invoke('attr', 'style', 'display: none;');
});

Cypress.Commands.add('clickRect', (point: { x: number; y: number; x2: number; y2: number }) => {
  const { x, y, x2, y2 } = point;
  cy.get('[data-cy=canvas-container] canvas')
    .trigger('mousedown', {
      x: x + (x2 - x) / 2,
      y: y + (y2 - y) / 2,
      isPrimary: true,
    })
    .trigger('mouseup', {
      x: x + (x2 - x) / 2,
      y: y + (y2 - y) / 2,
    });
});

Cypress.Commands.add(
  'clickXIcon',
  (
    point: { x: number; y: number; x2: number; y2: number },
    type?: 'redaction' | 'snippet',
    force = false,
  ) => {
    const { x, y, x2 } = point;
    cy.get('[data-cy=canvas-container] canvas')
      .trigger('mousedown', {
        x: type === 'redaction' ? x2 : x,
        y,
        isPrimary: true,
        force,
      })
      .trigger('mouseup', {
        x: type === 'redaction' ? x2 : x,
        y,
        force,
      });
  },
);

Cypress.Commands.add(
  'clickEditOrConfirmIconBelowSnippet',
  (point: { x?: number; y?: number; x2: number; y2: number }) => {
    const { x2, y2 } = point;
    cy.get('[data-cy=canvas-container] canvas')
      .trigger('mousedown', {
        x: x2 - 5,
        y: y2 + 10,
        isPrimary: true,
        force: true,
      })
      .trigger('mouseup', {
        x: x2 - 5,
        y: y2 + 10,
        force: true,
      });
  },
);

Cypress.Commands.add('onHoverTo', (point: { x: number; y: number; x2: number; y2: number }) => {
  const { x, y, x2, y2 } = point;
  cy.get('[data-cy=canvas-container] canvas').trigger('mousemove', {
    x: x + (x2 - x) / 2,
    y: y + (y2 - y) / 2,
  });
});

Cypress.Commands.add(
  'draggingRect',
  (
    rect: { x: number; y: number; x2: number; y2: number },
    targetPoint: { x: number; y: number },
    OCRName?: OCRName,
    withBottomChipClick = false,
    force = false,
    dragWithNoLoop = false,
  ) => {
    const { x, y, x2, y2 } = rect;

    const xDif = targetPoint.x - x2; // 200 - 100
    const yDif = targetPoint.y - y2; // 50 - 100

    const xArr: number[] = [];
    const yArr: number[] = [];

    for (let i = 1; i <= xDif; i++) {
      if (i % 10 === 0) {
        xArr.push(i);
      }
    }

    for (let i = 1; i <= yDif; i++) {
      if (i % 10 === 0) {
        yArr.push(i);
      }
    }

    if (OCRName) {
      if (withBottomChipClick) cy.clickBottomChip(OCRName);
      cy.editSnippetFromBottomSection(OCRName);
      cy.wait(1000);
      cy.zoomReset();
      cy.getDEModalContainer().should('be.visible');
    }

    if (dragWithNoLoop) {
      cy.get('[data-cy=canvas-container] canvas')
        .trigger('mousedown', {
          x: x + (x2 - x) / 2,
          y: y + (y2 - y) / 2,
          isPrimary: true,
          force,
        })
        .trigger('mousemove', {
          x: x + (x2 - x) / 2 + 100,
          y: y + (y2 - y) / 2 + 100,
          force,
        })
        .trigger('mouseup', {
          x: x + (x2 - x) / 2 + 100,
          y: y + (y2 - y) / 2 + 100,
          force: !!force,
        });
    } else {
      cy.get('[data-cy=canvas-container] canvas').trigger('mousedown', {
        x: x + (x2 - x) / 2,
        y: y + (y2 - y) / 2,
        isPrimary: true,
        force,
      });

      const longestArr =
        xArr.length >= yArr.length
          ? {
              type: 'x',
              arr: xArr,
            }
          : {
              type: 'y',
              arr: yArr,
            };
      longestArr.arr.map((arr, index) => {
        const point = {
          x: x2,
          y: yArr.length === 0 ? y : y2,
        };

        if (longestArr.type === 'x') {
          point.x += arr;
          if (yArr[index]) {
            point.y += yArr[index];
          }
        } else {
          point.y += arr;
          if (xArr[index]) {
            point.x += xArr[index];
          }
        }

        cy.get('[data-cy=canvas-container] canvas').trigger('mousemove', {
          x: point.x,
          y: point.y,
          force,
        });

        if (index === longestArr.arr.length - 1) {
          cy.get('[data-cy=canvas-container] canvas').trigger('mouseup', {
            x: point.x,
            y: point.y,
            force: !!force,
          });
        }
      });
    }
  },
);

Cypress.Commands.add(
  'transformingRect',
  (
    rect: { x: number; y: number },
    targetPoint: { x: number; y: number },
    OCRName?: OCRName,
    withBottomChipClick = false,
  ) => {
    const { x, y } = rect;

    const xDif = targetPoint.x - x;
    const yDif = targetPoint.y - y;

    const xArr: number[] = [];
    const yArr: number[] = [];

    for (let i = 1; i <= xDif; i++) {
      if (i % 10 === 0) {
        xArr.push(i);
      }
    }

    for (let i = 1; i <= yDif; i++) {
      if (i % 10 === 0) {
        yArr.push(i);
      }
    }

    if (OCRName) {
      if (withBottomChipClick) cy.clickBottomChip(OCRName);
      cy.editSnippetFromBottomSection(OCRName);
      cy.zoomReset();
      cy.getDEModalContainer().should('be.visible');
    }

    cy.get('[data-cy=canvas-container] canvas').trigger('mousedown', {
      x: x,
      y: y,
      isPrimary: true,
      force: true,
    });

    const longestArr =
      xArr.length >= yArr.length
        ? {
            type: 'x',
            arr: xArr,
          }
        : {
            type: 'y',
            arr: yArr,
          };

    longestArr.arr.map((arr, index) => {
      const point = {
        x: x,
        y: y,
      };

      if (longestArr.type === 'x') {
        point.x += arr;
        if (yArr[index]) {
          point.y += yArr[index];
        }
      } else {
        point.y += arr;
        if (xArr[index]) {
          point.x += xArr[index];
        }
      }
      cy.get('[data-cy=canvas-container] canvas').trigger('mousemove', {
        x: point.x,
        y: point.y,
        force: true,
      });

      if (index === longestArr.arr.length - 1) {
        cy.get('[data-cy=canvas-container] canvas').trigger('mouseup', {
          x: point.x,
          y: point.y,
        });
      }
    });
  },
);

Cypress.Commands.add('setSliderValue', { prevSubject: 'element' }, (subject, value) => {
  const element = subject[0];

  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value',
  )?.set;

  nativeInputValueSetter?.call(element, value);
  element.dispatchEvent(new Event('input', { bubbles: true }));
});

Cypress.Commands.add('dragFloatingBarTo', (to) => {
  cy.get('[data-cy=floating-bar-drag-icon]').trigger('mousedown');
  cy.get('[data-cy=canvas-container] canvas').trigger('mousemove', to).trigger('mouseup');
});

Cypress.Commands.add('exitCanvasModal', () => {
  cy.get('[data-cy=cancel-bottom-chips-menu]').click();
  cy.get('[data-cy=confirmModal-confirmButton]').click();
});

Cypress.Commands.add('exitStreamlineCanvasModal', () => {
  cy.get('.capture-processing-close-icon').click({ force: true });
  cy.get('[data-cy=confirmModal-confirmButton]').click();
});

Cypress.Commands.add('waitForCanvasToLoad', () => {
  cy.get('canvas', { timeout: 60000 }).should('be.visible');
});

Cypress.Commands.add('checkChipAfterRemoveSnippet', (OCRName) => {
  cy.get(`[data-cy=right-chip-${OCRName}]`).should('exist');
  cy.get(`[data-cy=bottom-chip-${OCRName}]`).should('not.exist');
});

Cypress.Commands.add('checkChipAfterCreateSnippet', (OCRName) => {
  cy.get(`[data-cy=right-chip-${OCRName}]`).should('not.exist');
  cy.get(`[data-cy=bottom-chip-${OCRName}]`).should('exist');
});

Cypress.Commands.add('chipShouldHaveNoColorHighlight', (OCRName) => {
  cy.get(`[data-cy=right-chip-${OCRName}]`).should(
    'have.css',
    'border-color',
    /** Colors.secondary.pebbleGrey10 */
    'rgb(134, 137, 168)',
  );
});

Cypress.Commands.add('zoomReset', () => {
  cy.get('[data-cy=hidden-reset-zoom]').trigger('click', { force: true });
});

Cypress.Commands.add(
  'removeChipFromBottomSection',
  (OCRName, type = 'all', showReasonModal = false, isHoveringChip = true) => {
    if (type === 'all' || type === 'delete') {
      if (isHoveringChip) {
        cy.hoverBottomChip(OCRName, {
          scrollBehavior: 'center',
          position: 'center',
          pointer: 'mouse',
        });
        cy.get(`[data-cy=bottom-chip-delete-${OCRName}]`).should('exist').click();
      } else {
        cy.clickBottomChip(OCRName);
        cy.get(`[data-cy=bottom-chip-delete-${OCRName}]`).should('exist').click();
      }
    }

    if (showReasonModal) {
      cy.get('[data-cy=detach-snippet-reason-select]')
        .should('be.visible')
        .click()
        .type('${enter}');
      cy.get('[data-cy=submit-detach-snippet-reason]').click();
    } else {
      cy.get('[data-cy=detach-snippet-reason-select]').should('not.be.exist');
    }

    if (type === 'all' || type === 'assert') {
      cy.checkChipAfterRemoveSnippet(OCRName);
    }
  },
);

Cypress.Commands.add('openSnippetReasonModal', (OCRName) => {
  cy.hoverBottomChip(OCRName, { scrollBehavior: 'center', position: 'center', pointer: 'mouse' });
  cy.get(`[data-cy=bottom-chip-delete-${OCRName}]`).should('exist').click();
  cy.get('[data-cy=detach-snippet-reason-select]').should('be.visible');
});

Cypress.Commands.add('editSnippetReasonModal', (isSubmitting = true) => {
  cy.get('[data-cy=edit-snippet-reason-modal]').should('exist');

  if (isSubmitting) {
    cy.get('[data-cy=edit-snippet-reason-select]').should('exist').click().type('${enter}');
    cy.get('[data-cy=submit-edit-snippet-reason]').should('not.be.disabled').click();
  } else {
    cy.get('[data-cy=cancel-edit-snippet-reason]').click();
  }
  cy.get('[data-cy=edit-snippet-reason-modal]').should('not.exist');
});

Cypress.Commands.add('submitSnippetButtonIsDisabled', () => {
  cy.get('[data-cy=submit-bottom-chips-menu]').should(
    'have.css',
    'background-color',
    /** Colors.secondary.pebbleGrey10 */
    'rgb(134, 137, 168)',
  );
});

Cypress.Commands.add('clickSubmitToFormViewDisplayButton', () => {
  cy.get('[data-cy=submit-bottom-chips-menu]').click();
});

Cypress.Commands.add('clickChipInFloatingBar', (OCRName: OCRName, waitZoomedInToSnippetFor = 0) => {
  cy.get(`[data-cy="right-chip-${OCRName}"]`).click();
  if (waitZoomedInToSnippetFor) {
    // NOTE: still have to wait for the auto zoom to snippet finishes
    cy.wait(waitZoomedInToSnippetFor);
  }
});

Cypress.Commands.add('clickBackToMarkupDisplayButton', () => {
  cy.get('[data-cy=back-to-snippet-button]').click();
});

Cypress.Commands.add(
  'drawSnippetAndSelect',
  (snippet, label, isMultiSnippet = false, force = false) => {
    if (isMultiSnippet) {
      cy.drawMultiRect(snippet);
    } else {
      cy.drawSingleRect(snippet, force);
    }
    cy.get('[data-cy=streamline-dropdown-data-entry-question]').should('exist').click();
    cy.selectLabelFromCanvasDropdown(label);
  },
);

Cypress.Commands.add('selectLabelFromCanvasDropdown', (label) => {
  cy.get(`div[class="rc-virtual-list-holder"]`).scrollTo('bottom', {
    ensureScrollable: false,
    duration: 2000,
  });
  cy.get(`div[title="${label}"]`).click({ force: true });
});

Cypress.Commands.add('clickBottomChip', (OCRName, withZoomReset = false) => {
  cy.get(`[data-cy=bottom-chip-${OCRName}]`).click();
  if (withZoomReset) {
    cy.zoomReset();
    cy.getDEModalContainer().should('be.visible');
  }
});

Cypress.Commands.add('hoverBottomChip', (OCRName, options?: RealHoverOptions) => {
  cy.get(`[data-cy=bottom-chip-${OCRName}]`)
    .should('exist')
    .realHover({ ...options });
});

Cypress.Commands.add('clickSaveSnippetButton', () => {
  cy.get(`[data-cy=non-streamline-save-snippet]`).should('exist').click();
});

Cypress.Commands.add('checkBottomChipActiveOrInactive', (OCRName, checkActive = true) => {
  cy.get(`[data-cy=bottom-chip-${OCRName}]`).should(
    `${checkActive ? 'not.have.css' : 'have.css'}`,
    'background-color',
    'rgba(0, 0, 0, 0)',
  );
});

Cypress.Commands.add('checkBottomChipClickableHoverable', (OCRName, ableToClickOrHover = true) => {
  cy.get(`[data-cy=bottom-chip-${OCRName}]`).should(
    `${ableToClickOrHover ? 'not.have.css' : 'have.css'}`,
    'pointer-events',
    'none',
  );
});
Cypress.Commands.add(
  'editSnippetFromBottomSection',
  (OCRName, withBottomChipClick = false, useShouldExist = false) => {
    // Better use should exist
    const shouldVar = useShouldExist ? 'exist' : 'be.visible';
    if (withBottomChipClick) {
      cy.get(`[data-cy=bottom-chip-${OCRName}]`)
        .scrollIntoView({ duration: 500 })
        .should(shouldVar)
        .realHover({ scrollBehavior: 'center', position: 'center', pointer: 'mouse' })
        .get(`[data-cy=bottom-chip-edit-${OCRName}]`)
        .should(shouldVar)
        .click();
    } else {
      cy.get(`[data-cy=bottom-chip-edit-${OCRName}]`).should(shouldVar).click({ force: true });
    }
  },
);

Cypress.Commands.add('removeTooltipIfVisible', () => {
  // Tooltip is disabled by IS_CYPRESS_RUNNING variable
  // if (cy.get('.ant-tooltip')) {
  //   cy.get('.ant-tooltip').invoke('attr', 'style', 'display: none');
  // }
});

Cypress.Commands.add('removeStreamlineBackdropIfVisible', () => {
  if (cy.get('[data-cy=streamline-backdrop-DE-confirmation]')) {
    cy.get('[data-cy=streamline-backdrop-DE-confirmation]').invoke(
      'attr',
      'style',
      'display: none; position: absolute',
    );
  }
});

Cypress.Commands.add('clickSnippetTool', (snippetToolName) => {
  cy.get(`[data-cy=${snippetToolName}]`).click();
});

Cypress.Commands.add('isViewModeSnippetOCR', (OCRLabel: OCRLabel) => {
  cy.get('[data-cy=modal-title-streamline]').contains(OCRLabel);
});

Cypress.Commands.add('clickCancelNonStreamline', () => {
  cy.get('[data-cy=non-streamline-button-cancel]').should('exist').click();
  cy.get('[data-cy=non-streamline-button-cancel]').should('not.exist');
});

Cypress.Commands.add('checkIfModalIsEditMode', (isStreamline = false) => {
  cy.get('[data-cy=streamline-dropdown-data-entry-question]').should('be.visible');
  if (!isStreamline) {
    cy.get('[data-cy=non-streamline-save-snippet]').should('be.visible');
    cy.get('[data-cy=non-streamline-button-cancel]').should('be.visible');
  }
});

Cypress.Commands.add('flotingBarChipIsHiglighted', (OCRName, isHighlighted = true) => {
  cy.get(`[data-cy=right-chip-${OCRName}]`).should(
    `${isHighlighted ? 'not.have.css' : 'have.css'}`,
    'background-color',
    'rgba(0, 0, 0, 0)',
  );
});

Cypress.Commands.add('clickFloatingBarChip', (OCRName, force = false) => {
  cy.get(`[data-cy=right-chip-text-${OCRName}]`).should('exist').scrollIntoView().click({ force });
});

Cypress.Commands.add('monitorFlowModaIsVisible', () => {
  cy.get('[data-cy=monitor-flow-body]', { timeout: 20000 }).should('be.visible');
  cy.wait(3000);
});

Cypress.Commands.add('detachSCWithOtherReason', (OCRName, action: 'submit' | 'cancel') => {
  cy.openSnippetReasonModal(OCRName);
  cy.get('[data-cy=detach-snippet-reason-select]').click();
  cy.get('div[title="Other"]').click();
  cy.get('[data-cy=detach-snippet-reason-select]')
    .realHover({
      scrollBehavior: 'center',
      position: 'center',
    })
    .click()
    .type('Custom Reason For Testing');
  if (action === 'cancel') {
    cy.get('[data-cy=cancel-detach-snippet-reason]').should('be.visible').click();
  } else if (action === 'submit') {
    cy.get('[data-cy=submit-detach-snippet-reason]')
      .should('be.visible')
      .should('not.be.disabled')
      .realHover({ scrollBehavior: 'center', position: 'center', pointer: 'mouse' })
      .click();
  }
});
