import { GetStudyRevisionListDocument } from '../../src/graphQL/generated/graphql';
import { mockUserDataAdmin } from '../../src/constant/testFixtures';

type SpecNumber = `S-${number}-${number}`;

type SpecInfo = {
  // e.g S-09-010
  spec: SpecNumber;
  // title e.g headerSection, combined description becomes S-09-010 headerSection, but optional
  title?: string;
};

type Options = {
  loginAs?: string;
  skipTest?: boolean;
};

function resolveDescription(description: SpecNumber | SpecInfo) {
  return typeof description === 'string' ? description : `${description.spec} ${description.title}`;
}

const aliasGetStudyRevisionListDocument =
  'name' in GetStudyRevisionListDocument.definitions[0]
    ? GetStudyRevisionListDocument.definitions[0].name?.value
    : 'GetStudyRevisionListDocument';
/*
example usage
designSpec('S-19-2', () => {

  describe('...', ...)

  it('checks something...', () => {...})
});
*/
export function designSpec(
  description: SpecNumber | SpecInfo,
  callback: () => void,
  options?: Options,
) {
  before(() => {
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === aliasGetStudyRevisionListDocument) {
        req.alias = req.body.operationName;
      }
    });
    cy.beforeSetup(mockUserDataAdmin);
    cy.clearLocalStorageSnapshot();
    cy.saveLocalStorage();
    cy.wait(`@${aliasGetStudyRevisionListDocument}`);
  });
  if (options?.skipTest) {
    describe.skip(resolveDescription(description), callback);
  } else if (typeof description !== 'string' && description.title) {
    describe(description.spec, () => {
      describe(String(description.title), callback);
    });
  } else {
    describe(resolveDescription(description), callback);
  }
}
