const rewire = require('rewire');
const sinon = require('sinon');
const config = require('../../utils/config');
const autoVerifyPsychologists = require('../../services/demarchesSimplifiees/autoVerify');

const graphql = rewire('../../utils/graphql');

describe('autoVerifyPsychologist', () => {
  let executeMutationStub;
  let unsets = [];

  beforeEach(() => {
    unsets = [];
    executeMutationStub = sinon.stub();
    unsets.push(graphql.__set__('executeMutation', executeMutationStub));
    autoVerifyPsychologists.__Rewire__('graphql', graphql);
  });

  afterEach((done) => {
    autoVerifyPsychologists.__ResetDependency__('graphql');
    unsets.forEach((unset) => unset());
    done();
  });

  it('Should execute 4 mutations on DS', async () => {
    await autoVerifyPsychologists.default();

    sinon.assert.callCount(executeMutationStub, 4);

    const DOSSIER_ID_VALID = 'RG9zc2llci00ODkwOTEw';
    const DOSSIER_ID_INVALID = 'RG9zc2llci00Nzg5MzM2';
    const INSTRUCTOR_ID = config.demarchesSimplifieesInstructor;

    sinon.assert.calledWith(executeMutationStub.getCall(0),
      sinon.match((query) => query.includes('mutation dossierModifierAnnotationText')),
      sinon.match({
        input: {
          dossierId: DOSSIER_ID_INVALID,
          instructeurId: INSTRUCTOR_ID,
          annotationId: 'Q2hhbXAtMTY1NzQwNQ==',
          value: sinon.match((value) => value.startsWith("Le dossier n'a pas passé la vérification automatique le ")),
        },
      }));

    sinon.assert.calledWith(executeMutationStub.getCall(1),
      sinon.match((query) => query.includes('mutation dossierModifierAnnotationText')),
      sinon.match({
        input: {
          dossierId: DOSSIER_ID_VALID,
          instructeurId: INSTRUCTOR_ID,
          annotationId: 'Q2hhbXAtMTY1NzQwNQ==',
          value: sinon.match((value) => value.startsWith('Dossier vérifié automatiquement le ')),
        },
      }));

    sinon.assert.calledWith(executeMutationStub.getCall(2),
      sinon.match((query) => query.includes('mutation dossierModifierAnnotationCheckbox')),
      sinon.match({
        input: {
          dossierId: DOSSIER_ID_VALID,
          instructeurId: INSTRUCTOR_ID,
          annotationId: 'Q2hhbXAtMTY1NzQwMw==',
          value: true,
        },
      }));

    sinon.assert.calledWith(executeMutationStub.getCall(3),
      sinon.match((query) => query.includes('mutation dossierPasserEnInstruction')),
      sinon.match({
        input: {
          dossierId: DOSSIER_ID_VALID,
          instructeurId: INSTRUCTOR_ID,
        },
      }));
  }).timeout(30000);
});
