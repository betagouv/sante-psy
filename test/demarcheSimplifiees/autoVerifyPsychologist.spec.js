const rewire = require('rewire');
const sinon = require('sinon');

const demarchesSimplifiees = rewire('../../services/demarchesSimplifiees');
const graphql = rewire('../../utils/graphql');

describe('autoVerifyPsychologist', () => {
  let executeMutationStub;
  let unsets = [];

  beforeEach(() => {
    unsets = [];
    executeMutationStub = sinon.stub();
    unsets.push(graphql.__set__('executeMutation', executeMutationStub));
    unsets.push(demarchesSimplifiees.__set__('graphql', graphql));
  });

  afterEach((done) => {
    unsets.forEach((unset) => unset());
    done();
  });

  it('Should execute 4 mutations on DS', async () => {
    await demarchesSimplifiees.autoVerifyPsychologist();

    sinon.assert.callCount(executeMutationStub, 4);

    const DOSSIER_ID_VALID = 'RG9zc2llci00NzI5ODc3';
    const DOSSIER_ID_INVALID = 'RG9zc2llci00NzI5ODcw';
    const INSTRUCTOR_ID = 'SW5zdHJ1Y3RldXItNDg5OTM='; // TODO: update once DS test account created

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
  });
});
