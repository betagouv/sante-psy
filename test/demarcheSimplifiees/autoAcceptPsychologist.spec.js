const rewire = require('rewire');
const sinon = require('sinon');
const config = require('../../utils/config');

const autoAcceptPsychologists = rewire('../../services/demarchesSimplifiees/autoAccept');
const graphql = rewire('../../utils/graphql');

describe('autoAcceptPsychologist', () => {
  let executeMutationStub;
  let uploadDocumentStub;
  let unsets = [];

  beforeEach(() => {
    unsets = [];
    executeMutationStub = sinon.stub();
    uploadDocumentStub = sinon.stub();
    uploadDocumentStub.returns('un super id');
    unsets.push(graphql.__set__('executeMutation', executeMutationStub));
    unsets.push(autoAcceptPsychologists.__set__('graphql', graphql));
    unsets.push(autoAcceptPsychologists.__set__('uploadDocument', uploadDocumentStub));
  });

  afterEach((done) => {
    unsets.forEach((unset) => unset());
    done();
  });

  it('Should accept 1 dossier on DS', async () => {
    const dossierId = 'RG9zc2llci00NzU2Mzc4';
    await autoAcceptPsychologists();

    sinon.assert.calledWith(uploadDocumentStub, sinon.match.string, dossierId);
    sinon.assert.called(executeMutationStub);
    sinon.assert.calledWith(executeMutationStub.getCall(0),
      sinon.match((query) => query.includes('mutation dossierAccepter')),
      sinon.match({
        input: {
          dossierId,
          instructeurId: config.demarchesSimplifieesInstructor,
        },
      }));
    sinon.assert.calledWith(executeMutationStub.getCall(1),
      sinon.match((query) => query.includes('mutation dossierEnvoyerMessage')),
      sinon.match({
        dossierId,
        instructeurId: config.demarchesSimplifieesInstructor,
        body: config.demarchesSimplifieesAutoAcceptMessage,
        attachment: 'un super id',
      }));
  });
});
