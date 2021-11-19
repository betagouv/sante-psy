import sinon from 'sinon';
import config from '../../utils/config';
import autoAcceptPsychologists from '../../services/demarchesSimplifiees/autoAccept';
import graphql from '../../services/demarchesSimplifiees/buildRequest';

const uploadDocument = require('../../services/demarchesSimplifiees/uploadDocument');

describe('autoAcceptPsychologist', () => {
  let uploadDocumentStub;
  let sendMessageWithAttachmentStub;
  let acceptPsychologistStub;

  const FILE_ID = 'un super id';

  beforeEach(() => {
    uploadDocumentStub = sinon.stub(uploadDocument, 'default').returns(FILE_ID);
    sendMessageWithAttachmentStub = sinon.stub(graphql, 'sendMessageWithAttachment');
    acceptPsychologistStub = sinon.stub(graphql, 'acceptPsychologist');
  });

  afterEach((done) => {
    uploadDocumentStub.restore();
    sendMessageWithAttachmentStub.restore();
    acceptPsychologistStub.restore();
    done();
  });

  it('Should accept 1 dossier on DS', async () => {
    const dossierId = 'RG9zc2llci00NzU2Mzc4';

    await autoAcceptPsychologists();

    sinon.assert.calledWith(
      uploadDocumentStub,
      sinon.match.string,
      dossierId,
    );

    sinon.assert.calledWith(
      sendMessageWithAttachmentStub,
      config.demarchesSimplifiees.autoAcceptMessage,
      FILE_ID,
      dossierId,
    );

    sinon.assert.calledWith(
      acceptPsychologistStub,
      dossierId,
    );
  });
});
