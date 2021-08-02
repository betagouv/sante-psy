import sinon from 'sinon';
import verifyPsychologist from '../services/demarchesSimplifiees/verifyPsychologist';
import autoVerifyPsychologists from '../services/demarchesSimplifiees/autoVerify';

describe('autoVerifyPsychologist', () => {
  let verifyPsychologistStub;

  beforeEach(() => {
    verifyPsychologistStub = sinon.stub(verifyPsychologist, 'verifyPsychologist');
  });

  afterEach((done) => {
    verifyPsychologistStub.restore();
    done();
  });

  // FIXME!
  it.skip('Should call verifyPsychologist twice with correct args', async () => {
    await autoVerifyPsychologists();

    sinon.assert.callCount(verifyPsychologistStub, 2);

    sinon.assert.calledWith(verifyPsychologistStub.getCall(0),
      sinon.match(),
      sinon.match());

    sinon.assert.calledWith(verifyPsychologistStub.getCall(1),
      sinon.match(),
      sinon.match());
  }).timeout(30000);
});
