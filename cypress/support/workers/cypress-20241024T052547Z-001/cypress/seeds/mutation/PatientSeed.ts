import { AddPatientDocument, IAddPatientMutationVariables, ISexType } from "graphQL/generated/graphql"
import { randomAlphabet, randomAlphaNumeric, randomDate } from "../../helper/randomGenerator"
import client from "../../utils/client"

const createNewPatient = () => {
  let patientId: string
  const randomId = `TES-${randomAlphaNumeric(6)}`;
  const patientData: IAddPatientMutationVariables = {
    firstNameInitial: randomAlphabet(1),
    middleNameInitial: randomAlphabet(1),
    lastNameInitial: randomAlphabet(1),
    sex: ISexType.Male,
    dob: randomDate(),
    patientStudyId: randomId,
    studyRevisionId: 'testRevisionId1',
    siteId: 'bellevueHospital1'
  }
  client.mutate({
    mutation: AddPatientDocument,
    variables: patientData
  })
  cy.intercept('POST', '/graphql', request => {
    if (request.body.operationName === "AddPatient") {
      request.alias = 'addPatient'
    }
  })
  return cy.wait('@addPatient').then(res => {
    patientId = res.response?.body.data.addPatient.patient.id
    return patientId
  })
}