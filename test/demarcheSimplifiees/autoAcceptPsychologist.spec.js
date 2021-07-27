const sinon = require('sinon');
const { default: config } = require('../../utils/config');
const autoAcceptPsychologists = require('../../services/demarchesSimplifiees/autoAccept');

const graphql = require('../../utils/graphql');

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
    autoAcceptPsychologists.__Rewire__('graphql_1', graphql);
    autoAcceptPsychologists.__Rewire__('uploadDocument_1', { default: uploadDocumentStub });
  });

  afterEach((done) => {
    autoAcceptPsychologists.__ResetDependency__('graphql_1');
    autoAcceptPsychologists.__ResetDependency__('uploadDocument_1');
    unsets.forEach((unset) => unset());
    done();
  });

  it('Should accept 1 dossier on DS', async () => {
    const dossierId = 'RG9zc2llci00NzU2Mzc4';
    await autoAcceptPsychologists.default();

    sinon.assert.calledWith(uploadDocumentStub, sinon.match.string, dossierId);
    sinon.assert.calledTwice(executeMutationStub);
    sinon.assert.calledWith(executeMutationStub.getCall(1),
      sinon.match((query) => query.includes('mutation dossierAccepter')),
      sinon.match({
        input: {
          dossierId,
          instructeurId: config.demarchesSimplifieesInstructor,
        },
      }));
    sinon.assert.calledWith(executeMutationStub.getCall(0),
      sinon.match((query) => query.includes('mutation dossierEnvoyerMessage')),
      sinon.match({
        dossierId,
        instructeurId: config.demarchesSimplifieesInstructor,
        body: config.demarchesSimplifieesAutoAcceptMessage,
        attachment: 'un super id',
      }));
  });
});
