import sinon from 'sinon';
import autoVerifyPsychologists from '../../services/demarchesSimplifiees/autoVerify';
import config from '../../utils/config';
import graphql from '../../utils/sendGraphQLRequest';

describe('autoVerifyPsychologist', () => {
  let executeMutationStub;

  beforeEach(() => {
    executeMutationStub = sinon.stub(graphql, 'executeMutation');
  });

  afterEach((done) => {
    executeMutationStub.restore();
    done();
  });

  it('Should call verifyPsychologist twice with correct args', async () => {
    await autoVerifyPsychologists();

    sinon.assert.callCount(executeMutationStub, 4);

    const DOSSIER_ID_VALID = 'RG9zc2llci00ODkwOTEw';
    const DOSSIER_ID_INVALID = 'RG9zc2llci03MTk1MDYx';
    const INSTRUCTOR_ID = config.demarchesSimplifiees.instructor;

    sinon.assert.calledWith(
      executeMutationStub.getCall(0),
      sinon.match((query) => query.includes('mutation dossierModifierAnnotationText')),
      sinon.match({
        input: {
          dossierId: DOSSIER_ID_VALID,
          instructeurId: INSTRUCTOR_ID,
          annotationId: 'Q2hhbXAtMTY1NzQwNQ==',
          value: sinon.match((value) => value.startsWith('Dossier vérifié automatiquement le ')),
        },
      }),
    );

    sinon.assert.calledWith(
      executeMutationStub.getCall(1),
      sinon.match((query) => query.includes('mutation dossierModifierAnnotationCheckbox')),
      sinon.match({
        input: {
          dossierId: DOSSIER_ID_VALID,
          instructeurId: INSTRUCTOR_ID,
          annotationId: 'Q2hhbXAtMTY1NzQwMw==',
          value: true,
        },
      }),
    );

    sinon.assert.calledWith(
      executeMutationStub.getCall(2),
      sinon.match((query) => query.includes('mutation dossierPasserEnInstruction')),
      sinon.match({
        input: {
          dossierId: DOSSIER_ID_VALID,
          instructeurId: INSTRUCTOR_ID,
        },
      }),
    );

    sinon.assert.calledWith(
      executeMutationStub.getCall(3),
      sinon.match((query) => query.includes('mutation dossierModifierAnnotationText')),
      sinon.match({
        input: {
          dossierId: DOSSIER_ID_INVALID,
          instructeurId: INSTRUCTOR_ID,
          annotationId: 'Q2hhbXAtMTY1NzQwNQ==',
          value: sinon.match((value) => value.startsWith("Le dossier n'a pas passé la vérification automatique le ")),
        },
      }),
    );
  }).timeout(30000);
});
