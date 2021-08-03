import sinon from 'sinon';
import clean from '../helper/clean';
import graphql from '../../services/demarchesSimplifiees/buildRequest';
import verifyPsychologist from '../../services/demarchesSimplifiees/verifyPsychologist';

const getDiplomaErrors = require('../../services/getDiplomaErrors');
const getAdeliErrors = require('../../services/getAdeliErrors');

describe('verifyPsychologist', () => {
  let getAdeliErrorsStub;
  let getDiplomaErrorsStub;
  let addVerificationMessageStub;
  let verifyDossierStub;
  let putDossierInInstructionStub;

  beforeEach(() => {
    getAdeliErrorsStub = sinon.stub(getAdeliErrors, 'default');
    getDiplomaErrorsStub = sinon.stub(getDiplomaErrors, 'default');
    addVerificationMessageStub = sinon.stub(graphql, 'addVerificationMessage');
    verifyDossierStub = sinon.stub(graphql, 'verifyDossier');
    putDossierInInstructionStub = sinon.stub(graphql, 'putDossierInInstruction');
  });

  afterEach((done) => {
    getAdeliErrorsStub.restore();
    getDiplomaErrorsStub.restore();
    addVerificationMessageStub.restore();
    verifyDossierStub.restore();
    putDossierInInstructionStub.restore();
    done();
  });

  it('Should call addVerificationMessage, verifyDossier and putDossierInInstruction if no errors', async () => {
    getAdeliErrorsStub.returns([]);
    getDiplomaErrorsStub.returns([]);

    const psyDS = clean.getOnePsyDS();
    const result = await verifyPsychologist(psyDS, {});

    result.should.equals(true);
    sinon.assert.calledOnce(addVerificationMessageStub);
    sinon.assert.calledWith(addVerificationMessageStub,
      psyDS.id,
      sinon.match((message) => message.startsWith('Dossier vérifié automatiquement le ')));
    sinon.assert.calledWith(verifyDossierStub, psyDS.id);
    sinon.assert.calledWith(putDossierInInstructionStub, psyDS.id);
  });

  it('Should call addVerificationMessage if errors', async () => {
    getAdeliErrorsStub.returns(['error 1', 'error 2']);
    getDiplomaErrorsStub.returns(['error 3', 'error 4']);

    const psyDS = clean.getOnePsyDS();
    const result = await verifyPsychologist(psyDS, {});

    result.should.equals(false);
    sinon.assert.calledOnce(addVerificationMessageStub);
    sinon.assert.calledWith(addVerificationMessageStub,
      psyDS.id,
      sinon.match((message) => message.startsWith('Le dossier n\'a pas passé la vérification automatique le ')
      && message.endsWith('car error 3,error 4,error 1,error 2')));
    sinon.assert.notCalled(verifyDossierStub);
    sinon.assert.notCalled(putDossierInInstructionStub);
  });
});
