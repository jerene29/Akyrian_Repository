import {
  AddPatientDocument,
  GetStudyListDocument,
  IAddPatientFailureReason,
  GetPatientListDocument,
  ICustomPatientObject,
  AddSitePatientDocument,
  GetVisitListDocument,
  ISitePatient,
} from '../../src/graphQL/generated/graphql';
import { mockUserDataAdmin } from '../../src/constant/testFixtures';
import moment = require('moment');

export type AutoFilledPatientObject = {
  firstNameInitial: string;
  middleNameInitial: string;
  lastNameInitial: string;
  patientStudyId: string;
  // TODO: refactor this site to be ISitePatient
  site: string;
  dob: Date;
  sex: string;
};

describe('Add Patient', () => {
  const aliasAddPatient = AddPatientDocument.definitions[0].name.value;
  const aliasPatientToSite = AddSitePatientDocument.definitions[0].name.value;
  const alias = GetPatientListDocument.definitions[0].name.value;
  const aliasGetVisit = GetVisitListDocument.definitions[0].name.value;
  const aliasGetStudy = GetStudyListDocument.definitions[0].name.value;
  let addPatientData: AutoFilledPatientObject;
  // TODO: refactor by removing this any
  let patientExist: ICustomPatientObject | any = {};
  let sites: Array<ISitePatient> = [];
  const autoFilled = () => {
    const makeid = (length = 0, type: 'alphabet' | 'sex' | 'month' | 'years' | 'number') => {
      const result: Array<string> = [];
      const alphabeth = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const month = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'June',
        'July',
        'Aug',
        'Sept',
        'Oct',
        'Nov',
        'Dec',
      ];
      const numbers = '0123456789';
      const sex = ['MALE', 'INTERSEX', 'FEMALE'];
      for (let i = 0; i < length; i++) {
        result.push(
          type === 'alphabet'
            ? alphabeth.charAt(Math.floor(Math.random() * alphabeth.length))
            : type === 'sex'
            ? sex[Math.floor(Math.random() * sex.length)]
            : type === 'month'
            ? month[Math.floor(Math.random() * month.length)]
            : type === 'years'
            ? numbers.charAt(Math.floor(Math.random() * 2))
            : numbers.charAt(Math.floor(Math.random() * numbers.length)),
        );
      }
      return result.join('');
    };

    const generate = {
      firstNameInitial: makeid(1, 'alphabet'),
      middleNameInitial: makeid(1, 'alphabet'),
      lastNameInitial: makeid(1, 'alphabet'),
      patientStudyId: `${makeid(3, 'alphabet')}-${makeid(3, 'number')}${makeid(3, 'alphabet')}`,
      site: sites[0].name,
      dob: addPatientData.dob,
      sex: `${makeid(1, 'sex')}`,
    };

    return generate;
  };

  describe('Add Patient on existing patient list', () => {
    before(() => {
      cy.reseedDB();
    });

    beforeEach(() => {
      cy.fillInloginAsFormV2(mockUserDataAdmin);
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasGetStudy) {
          req.alias = req.body.operationName;
        }
        if (req.body.operationName === alias) {
          req.alias = req.body.operationName;
        }
        if (req.body.operationName === aliasGetVisit) {
          req.alias = req.body.operationName;
        }
      });
      cy.visit('/visit/testRevisionId1');
      cy.wait(`@${aliasGetStudy}`);
      cy.wait(`@${alias}`).then((result) => {
        cy.wrap(result).then(() => {
          sites = result.response?.body.data.sitePatientList;
        });
      });
      cy.wait(`@${aliasGetVisit}`);
      cy.fixture('patient.json').then((value) => {
        addPatientData = value.addPatientData;
      });
      cy.waitForReact();
    });

    it('patient form default', () => {
      cy.defaultAddPatientForm();
    });

    it('validate field dob', () => {
      cy.fillInAddPatientFormValidation();
    });

    it('validate field site', () => {
      cy.fillInAddPatientFormValidationSite();
    });

    it('fill and submit patient form success', () => {
      cy.defaultAddPatientForm();
      const generate = autoFilled();
      addPatientData = generate;
      cy.fillInAddPatientForm(generate, true, false);
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasAddPatient) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('#button-submit-add-patient').click();
      cy.react('Button', {
        props: {
          id: 'button-submit-add-patient',
          loading: true,
        },
      });
      cy.wait(`@${alias}`).then((res) => {
        if (res) {
          cy.react('Button', {
            props: {
              id: 'button-submit-add-patient',
              loading: false,
            },
          });
          cy.react('Modal', {
            props: {
              id: 'modal-add-patient',
              visible: false,
            },
          });
        }
      });
    });

    it('fill and submit patient form fail exist in the same site', () => {
      cy.defaultAddPatientForm().then(() => {
        cy.wrap(patientExist).then(() => {
          cy.wait(2000);
          patientExist = sites[0].patients[sites[0].patients.length - 1];
          cy.fillInAddPatientForm(
            {
              ...patientExist,
              patientStudyId: patientExist?.patientStudyId,
              site:
                patientExist && patientExist.sitesAccess
                  ? patientExist.sitesAccess[0].name[0]
                  : 'Bellevue Hospital',
              dob: autoFilled().dob,
            },
            true,
            false,
          );
          cy.intercept('POST', '/graphql', (req) => {
            if (req.body.operationName === aliasAddPatient) {
              req.alias = req.body.operationName;
            }
          });
          cy.get('#button-submit-add-patient').click();
          cy.react('Button', {
            props: {
              id: 'button-submit-add-patient',
              loading: true,
            },
          });
          cy.wait(`@${aliasAddPatient}`).then((res) => {
            cy.wrap(() => {
              if (res.response) {
                if (
                  !res.response.body.data.addPatient.success &&
                  res.response &&
                  res.response.statusCode === 200
                ) {
                  if (
                    res.response.body.data.addPatient.reason ===
                    IAddPatientFailureReason.PossiblePatientDuplicationSameSite
                  ) {
                    cy.get('[data-cy=confirmModal-confirmButton]').should('be.visible');
                    cy.get('[data-cy=confirmModal-confirmButton]').click();
                    cy.get('[data-cy=confirmModal-confirmButton]').should('not.be.visible');
                    cy.get(
                      `#${res.response.body.data.addPatient.patient.id}-selectable-patient`,
                    ).contains(`${res.response.body.data.addPatient.patient.patientStudyId}`);
                  }
                }
              } else {
                cy.get('[data-cy=confirmModal-confirmButton]').should('be.visible');
                cy.get('[data-cy=confirmModal-confirmButton]').click();
                cy.get('[data-cy=confirmModal-confirmButton]').should('not.be.visible');
              }
            });
          });
        });
      });
    });

    it('fill and submit patient form fail exist in different site', () => {
      let patientData: AutoFilledPatientObject;
      cy.defaultAddPatientForm().then(() => {
        cy.wrap(sites).then(() => {
          patientExist =
            sites[0].patients[Math.floor(Math.random() * sites[0].patients.length - 1 + 0)];
          cy.wrap([patientExist, sites]).then(() => {
            cy.wait(3000);
            const findDiffSite = sites.filter(
              (site: any) =>
                patientExist &&
                patientExist.sitesAccess &&
                site.id !== patientExist.sitesAccess[0].id,
            );

            cy.wrap(findDiffSite).then(() => {
              const firstInitialSiteName =
                findDiffSite[0] && findDiffSite[0].name[0]
                  ? findDiffSite[0].name[0]
                  : 'Bellevue Hospital';
              cy.intercept('POST', '/graphql', (req) => {
                if (req.body.operationName === aliasAddPatient) {
                  req.alias = req.body.operationName;
                }
                if (req.body.operationName === aliasPatientToSite) {
                  req.alias = req.body.operationName;
                }
              });
              cy.wrap([firstInitialSiteName, patientExist]).then(() => {
                if (patientExist) {
                  patientData = patientExist;
                } else {
                  patientData = addPatientData;
                }
                cy.wrap(patientData).then(() => {
                  cy.fillInAddPatientForm(
                    {
                      ...patientData,
                      patientStudyId: 'BUA-CPT118', // Hardcoded from user fixtures
                      site: firstInitialSiteName,
                      dob: autoFilled().dob,
                    },
                    true,
                    false,
                  );

                  cy.get('#button-submit-add-patient').click();
                  cy.react('Button', {
                    props: {
                      id: 'button-submit-add-patient',
                      loading: true,
                    },
                  });
                  cy.wait(`@${aliasAddPatient}`).then((res) => {
                    cy.wrap(res).then(() => {
                      if (res.response && res.response.statusCode === 200) {
                        // const buttonText = res.response.body.data.addPatient.reason === IAddPatientFailureReason.ExistOnSameSite ? 'button.viewPatient' :  'button.addPatientToSite';
                        if (
                          res.response.body.data &&
                          res.response.body.data.addPatient.reason ===
                            IAddPatientFailureReason.PossiblePatientDuplicationDifferentSite
                        ) {
                          cy.get('[data-cy=confirmModal-confirmButton]').should('be.visible');
                          cy.get('[data-cy=confirmModal-confirmButton]').click();
                          cy.wait(`@${aliasPatientToSite}`).then((res) => {
                            if (res.response?.statusCode === 200) {
                              cy.get('[data-cy=confirmModal-confirmButton]').should(
                                'not.be.visible',
                              );
                              const siteId = findDiffSite[0].id;
                              cy.get(
                                `#${siteId} [data-cy=selectable-patient] .sider-patient-name`,
                              ).contains(`${res.response.body.data.addSitePatient.patientStudyId}`);
                            }
                          });
                        }
                      } else {
                        cy.get('[data-cy=confirmModal-confirmButton]').should('be.visible');
                        cy.get('[data-cy=confirmModal-confirmButton]').click();
                        cy.wait(`@${aliasPatientToSite}`).then((res) => {
                          if (res.response && res.response.statusCode === 200) {
                            cy.get('[data-cy=confirmModal-confirmButton]').should('not.be.visible');
                            const siteId = findDiffSite[0].id;
                            cy.get(
                              `#${siteId} [data-cy=selectable-patient] .sider-patient-name`,
                            ).contains(`${res.response.body.data.addSitePatient.patientStudyId}`);
                          } else {
                            cy.get('[data-cy=confirmModal-confirmButton]').should('not.be.visible');
                            const siteId = findDiffSite[0].id;
                            cy.get(
                              `#${siteId} [data-cy=selectable-patient] .sider-patient-name`,
                            ).contains(`${patientExist.patientStudyId}`);
                          }
                        });
                      }
                    });
                  });
                });
              });
            });
          });
        });
      });
    });

    it('fill and submit patient form fail possible duplicate', () => {
      cy.defaultAddPatientForm().then(() => {
        cy.wrap(patientExist).then(() => {
          patientExist = sites[0].patients[sites[0].patients.length - 1];
          cy.wait(2000);
          const dob = `${moment(patientExist.dob).format('MMM')}
          ${moment(patientExist.dob).format('DD')}
          ${moment(patientExist.dob).year()}`;
          cy.fillInAddPatientForm(
            {
              ...patientExist,
              site:
                patientExist && patientExist.sitesAccess
                  ? patientExist.sitesAccess[0].name[0]
                  : 'Bellevue Hospital',
              dob: dob,
              sex: patientExist.sex,
              firstNameInitial: patientExist.firstNameInitial,
              middleNameInitial: patientExist.middleNameInitial,
              lastNameInitial: patientExist.lastNameInitial,
              patientStudyId: autoFilled().patientStudyId,
            },
            true,
            false,
          );
          cy.intercept('POST', '/graphql', (req) => {
            if (req.body.operationName === aliasAddPatient) {
              req.alias = req.body.operationName;
            }
          });
          cy.get('#button-submit-add-patient').click();
          cy.react('Button', {
            props: {
              id: 'button-submit-add-patient',
              loading: true,
            },
          });
          cy.fixture('patient.json').then((value) => {
            cy.get('.description').should('have.text', `${value.possibleDuplicateMessage}`);
          });
          cy.get('[data-cy=confirmModal-confirmButton]').should('be.visible');
          cy.get('[data-cy=confirmModal-confirmButton]').click();
          cy.get('[data-cy=confirmModal-confirmButton]').should('not.be.visible');
        });
      });
    });

    it('Checking Inline error', () => {
      cy.defaultAddPatientForm().then(() => {
        cy.wrap(patientExist).then(() => {
          patientExist = sites[0].patients[sites[0].patients.length - 1];
          cy.wait(2000);
          const wrongPatientStudyId = 'SLM-';
          const dob = `${moment(patientExist.dob).format('MMM')}
          ${moment(patientExist.dob).daysInMonth()}
          ${moment(patientExist.dob).year()}`;
          cy.fillInAddPatientForm(
            {
              ...patientExist,
              site:
                patientExist && patientExist.sitesAccess[0]
                  ? patientExist.sitesAccess[0].name[0]
                  : 'Bellevue Hospital',
              dob: dob,
              patientStudyId: wrongPatientStudyId,
            },
            false,
            false,
          );

          cy.get('.custom-tooltip').should('exist');
        });
      });
    });

    it('Cache site list', () => {
      cy.defaultAddPatientForm();
      const patientData = autoFilled();

      cy.wrap(patientData).then(() => {
        cy.fillInAddPatientForm(patientData, true, false);

        cy.get('[data-cy=button-submit-add-patient]').click({ force: true });

        cy.get('[data-cy=pop-over]').click({ force: true });
        cy.get('[data-cy="1-filter"]').click({ force: true });

        cy.intercept('POST', '/graphql', (req) => {
          if (req.body.operationName === alias) {
            req.alias = req.body.operationName;
          }
        });
        cy.get('[data-cy="1-filter"]').click({ force: true });
        cy.wait(`@${alias}`);
        cy.wait(2000);
        cy.defaultAddPatientForm();
        cy.get('[data-cy=patient-site]')
          .click()
          .each((element, index) => {
            cy.wrap(sites).each((el, i) => {
              cy.wrap(element).type('{downarrow}');
              cy.get('.ant-select-item-option-content').contains(sites[i].name);
            });
          });
      });
    });

    it('Hide patient study id', () => {
      cy.get('[data-cy=header-nurse-select]').click();
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === alias) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('[data-cy=studyTestId2-testRevisionId2').scrollIntoView().click();
      cy.wait(`@${alias}`).then((res) => {
        if (res.response?.body) {
          cy.get('.ant-collapse-header').click({ multiple: true, force: true });
          const generates = { ...autoFilled(), site: 'Tokyo' };
          cy.wait(2000);
          cy.defaultAddPatientForm(true);
          cy.fillInAddPatientForm(generates, true, true);
        }
      });
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === aliasAddPatient) {
          req.alias = req.body.operationName;
        }
      });
      cy.get('#button-submit-add-patient').click();
      cy.react('Button', {
        props: {
          id: 'button-submit-add-patient',
          loading: true,
        },
      });
      cy.wait(`@${aliasAddPatient}`).then((res) => {
        if (res) {
          cy.react('Button', {
            props: {
              id: 'button-submit-add-patient',
              loading: false,
            },
          });
          cy.react('Modal', {
            props: {
              id: 'modal-add-patient',
              visible: false,
            },
          });
          cy.get(`#${res.response?.body?.data?.addPatient.patient.id}-selectable-patient`).should(
            'exist',
          );
          cy.logout();
        }
      });
    });

    it('Add Patient on expand visit list', () => {
      cy.get('#multiSitePatient1-selectable-patient').click();
      cy.wait(3000);
      cy.defaultAddPatientForm();
      const generate = autoFilled();
      addPatientData = generate;
      cy.wrap([generate, addPatientData]).then(() => {
        cy.fillInAddPatientForm(generate, true, false);
        cy.intercept('POST', '/graphql', (req) => {
          if (req.body.operationName === aliasAddPatient) {
            req.alias = req.body.operationName;
          }
        });
        cy.get('#button-submit-add-patient').click();
        cy.react('Button', {
          props: {
            id: 'button-submit-add-patient',
            loading: true,
          },
        });
        cy.wait(`@${alias}`).then((res) => {
          if (res) {
            cy.react('Button', {
              props: {
                id: 'button-submit-add-patient',
                loading: false,
              },
            });
            cy.react('Modal', {
              props: {
                id: 'modal-add-patient',
                visible: false,
              },
            });
          }
        });
        cy.wait(3000);
        cy.get('#patientId').contains(generate.patientStudyId);
        cy.get('[data-cy=button-start-visit]').should('exist');
      });
    });
  });

  describe('More patient', () => {
    let patient: AutoFilledPatientObject;

    const interception = (operationName: any[]) => {
      cy.intercept('POST', '/graphql', (req) => {
        operationName.map((operation) => {
          if (req.body.operationName === operation) {
            req.alias = req.body.operationName;
          }
        });
      });
    };

    before(() => {
      cy.beforeSetup(mockUserDataAdmin);
      interception([alias, aliasGetVisit, aliasGetStudy]);
      cy.visit('/visit/testRevisionId1');
      cy.wait(`@${aliasGetStudy}`);
      cy.wait(`@${alias}`);
      cy.wait(`@${aliasGetVisit}`);
      cy.waitForReact();
    });

    describe('dashboard', () => {
      before(() => {
        cy.visit('/dashboard');
      });

      it('Select study & add patient', () => {
        cy.wrap(autoFilled).then(() => {
          patient = autoFilled();
          cy.wrap(patient).then(() => {
            cy.get('#env-selector-PRODUCTION').click();
            cy.get('#sampleDemoStudy').click();
            cy.waitForReact();
            cy.defaultAddPatientForm();
            cy.fillInAddPatientForm(patient, true, false);
            interception([aliasAddPatient]);
            cy.get('#button-submit-add-patient').click();
            cy.wait(`@${aliasAddPatient}`);
          });
        });
      });

      it('Possible same site', () => {
        cy.wrap([patient, autoFilled()]).then(() => {
          patient.patientStudyId = autoFilled().patientStudyId;
          cy.defaultAddPatientForm();
          cy.fillInAddPatientForm(patient, true, false);
          interception([aliasAddPatient]);
          cy.get('#button-submit-add-patient').click();
          cy.react('Button', {
            props: {
              id: 'button-submit-add-patient',
              loading: true,
            },
          });
          cy.wait(`@${aliasAddPatient}`).then((res) => {
            if (res) {
              cy.get('.description').should(
                'have.text',
                `${res.response?.body.data.addPatient.message}`,
              );
              interception([aliasAddPatient]);
              cy.get('[data-cy=confirmModal-confirmButton]').click();
              cy.wait(`@${aliasAddPatient}`).then((response) => {
                cy.wrap(response).then(() => {
                  cy.get(
                    `#${response.response?.body.data.addPatient.patient.id}-selectable-patient`,
                  ).should('exist');
                });
              });
            }
          });
        });
      });

      it('New patient', () => {
        cy.wrap(autoFilled).then(() => {
          patient = autoFilled();
          cy.wrap(patient).then(() => {
            cy.defaultAddPatientForm();
            cy.fillInAddPatientForm(patient, true, false);
            interception([aliasAddPatient]);
            cy.get('#button-submit-add-patient').click();
            cy.wait(`@${aliasAddPatient}`);
          });
        });
      });

      it('Possible different site', () => {
        cy.wrap([patient, autoFilled()]).then(() => {
          patient.patientStudyId = autoFilled().patientStudyId;
          patient.site = 'Tokyo';
          cy.defaultAddPatientForm();
          cy.fillInAddPatientForm(patient, true, false);
          interception([aliasAddPatient]);
          cy.get('#button-submit-add-patient').click();
          cy.wait(`@${aliasAddPatient}`).then(() => {
            cy.fixture('patient.json').then(() => {
              cy.get('.description').contains('same first and last name');
            });
            interception([aliasAddPatient]);
            cy.get('[data-cy=confirmModal-confirmButton]').click();
            cy.wait(`@${aliasAddPatient}`).then((response) => {
              cy.wrap(response).then(() => {
                cy.get(
                  `#${response.response?.body.data.addPatient.patient.id}-selectable-patient`,
                ).should('exist');
              });
            });
          });
        });
      });

      it('Possible Duplicate', () => {
        cy.wrap([patient, autoFilled()]).then(() => {
          patient.patientStudyId = autoFilled().patientStudyId;
          cy.defaultAddPatientForm();
          cy.fillInAddPatientForm(patient, true, false);
          interception([aliasAddPatient]);
          cy.get('#button-submit-add-patient').click();
          cy.react('Button', {
            props: {
              id: 'button-submit-add-patient',
              loading: true,
            },
          });
          cy.wait(`@${aliasAddPatient}`).then((res) => {
            if (res) {
              cy.get('.description').should(
                'have.text',
                `${res.response?.body.data.addPatient.message}`,
              );
              interception([aliasAddPatient]);
              cy.get('[data-cy=confirmModal-confirmButton]').click();
              cy.wait(`@${aliasAddPatient}`).then((response) => {
                cy.wrap(response).then(() => {
                  cy.get(
                    `#${response.response?.body.data.addPatient.patient.id}-selectable-patient`,
                  ).should('exist');
                });
              });
            }
          });
        });
      });

      it('Notify Monitor', () => {
        cy.wrap([patient, autoFilled()]).then(() => {
          patient.patientStudyId = autoFilled().patientStudyId;
          cy.defaultAddPatientForm();
          cy.fillInAddPatientForm(patient, true, false);
          interception([aliasAddPatient]);
          cy.get('#button-submit-add-patient').click();
          cy.react('Button', {
            props: {
              id: 'button-submit-add-patient',
              loading: true,
            },
          });
          cy.wait(`@${aliasAddPatient}`).then((res) => {
            if (res) {
              cy.get('.description').should(
                'have.text',
                `${res.response?.body.data.addPatient.message}`,
              );
              interception([aliasAddPatient]);
              cy.get('[data-cy=second-confirmModal-confirmButton]')
                .should('have.text', 'Notify Monitor to Transfer Subject')
                .click();
            }
          });
        });
      });
    });
  });
});
