import sinon from 'sinon';
import faker from 'faker';
import graphql from '../../utils/sendGraphQLRequest';
import buildRequest from '../../services/demarchesSimplifiees/buildRequest';
import config from '../../utils/config';

describe('Build Request', () => {
  const INSTRUCTOR_ID = config.demarchesSimplifieesInstructor;
  let executeMutationStub;

  beforeEach(() => {
    executeMutationStub = sinon.stub(graphql, 'executeMutation');
  });

  afterEach((done) => {
    executeMutationStub.restore();
    done();
  });

  it('addVerificationMessage', async () => {
    const id = faker.datatype.string();
    const message = faker.lorem.sentence();

    await buildRequest.addVerificationMessage(id, message);

    sinon.assert.calledWith(executeMutationStub,
      sinon.match((query) => query.includes('mutation dossierModifierAnnotationText')),
      sinon.match({
        input: {
          dossierId: id,
          instructeurId: INSTRUCTOR_ID,
          annotationId: 'Q2hhbXAtMTY1NzQwNQ==',
          value: message,
        },
      }));
  });

  it('verifyDossier', async () => {
    const id = faker.datatype.string();

    await buildRequest.verifyDossier(id);

    sinon.assert.calledWith(executeMutationStub,
      sinon.match((query) => query.includes('mutation dossierModifierAnnotationCheckbox')),
      sinon.match({
        input: {
          dossierId: id,
          instructeurId: INSTRUCTOR_ID,
          annotationId: 'Q2hhbXAtMTY1NzQwMw==',
          value: true,
        },
      }));
  });

  it('putDossierInInstruction', async () => {
    const id = faker.datatype.string();

    await buildRequest.putDossierInInstruction(id);

    sinon.assert.calledWith(executeMutationStub,
      sinon.match((query) => query.includes('mutation dossierPasserEnInstruction')),
      sinon.match({
        input: {
          dossierId: id,
          instructeurId: INSTRUCTOR_ID,
        },
      }));
  });

  it('acceptPsychologist', async () => {
    const id = faker.datatype.string();

    await buildRequest.acceptPsychologist(id);

    sinon.assert.calledWith(executeMutationStub,
      sinon.match((query) => query.includes('mutation dossierAccepter')),
      sinon.match({
        input: {
          dossierId: id,
          instructeurId: config.demarchesSimplifieesInstructor,
        },
      }));
  });

  it('sendMessageWithAttachment', async () => {
    const id = faker.datatype.string();
    const message = faker.lorem.sentence();
    const attachment = faker.datatype.string();

    await buildRequest.sendMessageWithAttachment(message, attachment, id);

    sinon.assert.calledWith(executeMutationStub,
      sinon.match((query) => query.includes('mutation dossierEnvoyerMessage')),
      sinon.match({
        dossierId: id,
        instructeurId: config.demarchesSimplifieesInstructor,
        body: message,
        attachment,
      }));
  });
});
