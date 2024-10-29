type PatientType = 'SLO-OMN192' | 'TKK-TUH278';

Cypress.Commands.add('navigateToPatient', (patient: PatientType) => {
  switch (patient) {
    case 'SLO-OMN192':
      cy.visit('/visit/testRevisionId1/toDaiHospital1/multiSitePatient1/screeningVisit1');
      break;
    case 'TKK-TUH278':
      cy.visit('/visit/testRevisionId1/toDaiHospital1/toDaiPatient1/screeningVisit2');
      break;
  }
});
