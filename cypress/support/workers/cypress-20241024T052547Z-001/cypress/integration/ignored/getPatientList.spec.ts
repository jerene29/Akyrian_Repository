import { GetPatientListDocument, ISortFilter } from '../../src/graphQL/generated/graphql';

describe('Get Patient List', () => {
  let dataResult;
  beforeEach(() => {
    const alias = GetPatientListDocument.definitions[0].name.value;
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === alias) {
        req.alias = req.body.operationName;
      }
    });
    cy.visit('/');
    cy.fillInloginAsForm({
      email: 'admin@example.com',
    });
    cy.wait(`@${alias}`).then((result) => {
      dataResult = result;
    });
    cy.waitForReact();
  });
  it('Show patient list', () => {
    const { response } = dataResult;
    if (response) {
      if (response.statusCode === 200) {
        cy.get('[data-cy=pop-over]')
          .trigger('click')
          .then(() => {
            cy.get('[data-cy=0-option]')
              .click()
              .then(() => {
                const patientList = response.body.data.sitePatientList;
                cy.get('.sidebar-patients-container .ant-collapse').should(
                  'have.length',
                  patientList.length,
                );
                patientList.map((site) => {
                  cy.get(`#${site.id} [data-cy=selectable-patient]`).should(
                    'have.length',
                    site.patients.length,
                  );
                  if (site.patients && site.patients.length > 0) {
                    site.patients.map((patient) => {
                      cy.get(
                        `#${site.id} [data-cy=selectable-patient] .sider-patient-name`,
                      ).contains(`${patient.patientStudyId}`);
                    });
                  }
                });
              });
          });
      }
    }
  });
  it('Show patient list of Study id', () => {
    cy.get('[data-cy=pop-over]')
      .click()
      .then(() => {
        cy.get('[data-cy=0-filter]')
          .click({ force: true })
          .then(() => {
            const { response } = dataResult;
            if (response.statusCode === 200) {
              const patientList = response.body.data.sitePatientList;
              cy.get('.sidebar-patients-container .ant-collapse').should(
                'have.length',
                patientList.length,
              );
              patientList.map((site) => {
                if (site.patients && site.patients.length > 0) {
                  cy.get(`#${site.id}`).contains(`${site.name.toString()}`);
                  site.patients.map((patient) => {
                    cy.get(`#${site.id} [data-cy=selectable-patient] .sider-patient-name`).contains(
                      `${patient.patientStudyId}`,
                    );
                  });
                }
              });
            }
          });
      });
  });
  it('Show patient list of Outstanding task', () => {
    cy.get('[data-cy=pop-over]')
      .click()
      .then(() => {
        cy.get('[data-cy=1-filter]')
          .click({ force: true })
          .then(() => {
            const { response } = dataResult;
            if (response.statusCode === 200) {
              const patientList = response.body.data.sitePatientList;
              cy.get('.sidebar-patients-container .ant-collapse').should(
                'have.length',
                patientList.length,
              );
              patientList.map((site) => {
                if (site.patients && site.patients.length > 0) {
                  cy.get(`#${site.id}`).contains(`${site.name.toString()}`);
                  site.patients.map((patient) => {
                    cy.get(`#${site.id} [data-cy=selectable-patient] .sider-patient-name`).contains(
                      `${patient.patientStudyId}`,
                    );
                  });
                }
              });
            }
          });
      });
  });
  it('Show patient list of Unverified Question', () => {
    cy.get('[data-cy=pop-over]')
      .click()
      .then(() => {
        cy.get('[data-cy=2-filter]')
          .click({ force: true })
          .then(() => {
            const { response } = dataResult;
            if (response.statusCode === 200) {
              const patientList = response.body.data.sitePatientList;
              cy.get('.sidebar-patients-container .ant-collapse').should(
                'have.length',
                patientList.length,
              );
              patientList.map((site) => {
                if (site.patients && site.patients.length > 0) {
                  cy.get(`#${site.id}`).contains(`${site.name.toString()}`);
                  site.patients.map((patient) => {
                    cy.get(`#${site.id} [data-cy=selectable-patient] .sider-patient-name`).contains(
                      `${patient.patientStudyId}`,
                    );
                  });
                }
              });
            }
          });
      });
  });
  it('Show patient list of Unresolved Query', () => {
    cy.get('[data-cy=pop-over]')
      .click()
      .then(() => {
        cy.get('[data-cy=3-filter]')
          .click({ force: true })
          .then(() => {
            const { response } = dataResult;
            if (response.statusCode === 200) {
              const patientList = response.body.data.sitePatientList;
              cy.get('.sidebar-patients-container .ant-collapse').should(
                'have.length',
                patientList.length,
              );
              patientList.map((site) => {
                if (site.patients && site.patients.length > 0) {
                  cy.get(`#${site.id}`).contains(`${site.name.toString()}`);
                  site.patients.map((patient) => {
                    cy.get(`#${site.id} [data-cy=selectable-patient] .sider-patient-name`).contains(
                      `${patient.patientStudyId}`,
                    );
                  });
                }
              });
            }
          });
      });
  });
  it('Show patient list of Answered Query', () => {
    cy.get('[data-cy=pop-over]')
      .click()
      .then(() => {
        cy.get('[data-cy=4-filter]')
          .click({ force: true })
          .then(() => {
            const { response } = dataResult;
            if (response.statusCode === 200) {
              const patientList = response.body.data.sitePatientList;
              cy.get('.sidebar-patients-container .ant-collapse').should(
                'have.length',
                patientList.length,
              );
              patientList.map((site) => {
                if (site.patients && site.patients.length > 0) {
                  cy.get(`#${site.id}`).contains(`${site.name.toString()}`);
                  site.patients.map((patient) => {
                    cy.get(`#${site.id} [data-cy=selectable-patient] .sider-patient-name`).contains(
                      `${patient.patientStudyId}`,
                    );
                  });
                }
              });
            }
          });
      });
  });
});
