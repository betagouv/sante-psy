const rewire = require('rewire');
const sinon = require('sinon');
const config = require('../../utils/config');

const demarchesSimplifiees = rewire('../../services/demarchesSimplifiees');
const graphql = rewire('../../utils/graphql');

describe('autoAcceptPsychologist', () => {
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

  it('Should accept 1 dossier on DS', async () => {
    await demarchesSimplifiees.autoAcceptPsychologist();

    sinon.assert.calledOnce(executeMutationStub);
    sinon.assert.calledWith(executeMutationStub.getCall(0),
      sinon.match((query) => query.includes('mutation dossierAccepter')),
      sinon.match({
        input: {
          dossierId: 'RG9zc2llci00NzU2Mzc4',
          instructeurId: config.demarchesSimplifieesInstructor,
          motivation: config.demarchesSimplifieesAutoAcceptMessage,
        },
      }));
  });
});
