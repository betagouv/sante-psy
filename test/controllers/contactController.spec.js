const sinon = require('sinon');
const chai = require('chai');
const app = require('../../index');
const { default: contactController } = require('../../controllers/contactController');

describe('contactController', () => {
  let sendStub;

  beforeEach(() => {
    sendStub = sinon.stub(contactController, 'send');
  });

  afterEach(() => {
    sendStub.restore();
  });

  describe('send', () => {
    it('should send message', async () => chai.request(app)
      .post('/api/contact')
      .send({
        name: 'Neris',
        firstName: 'Iti',
        email: 'iti@ner.is',
        message: 'Pas content !',
        reason: 'éligibilité',
        user: 'étudiant',
      })
      .then(async (res) => {
        res.status.should.equal(200);
        res.body.message.should.equal('Votre message a bien été envoyé. Nous reviendrons vers vous rapidement.');
        sinon.assert.called(sendStub);
      }));

    const failValidation = async (payload, errorMessage) => chai.request(app)
      .post('/api/contact')
      .send(payload)
      .then(async (res) => {
        res.status.should.equal(400);
        res.body.message.should.equal(errorMessage);
      });

    it('should not send message if name is missing', async () => {
      await failValidation({
        firstName: 'Iti',
        email: 'iti@ner.is',
        message: 'Pas content !',
        reason: 'éligibilité',
        user: 'étudiant',
      }, 'Vous devez spécifier un nom.');
    });

    it('should not send message if firstname is missing', async () => {
      await failValidation({
        name: 'Neris',
        email: 'iti@ner.is',
        message: 'Pas content !',
        reason: 'éligibilité',
        user: 'étudiant',
      }, 'Vous devez spécifier un prénom.');
    });

    it('should not send message if email is missing', async () => {
      await failValidation({
        name: 'Neris',
        firstName: 'Iti',
        message: 'Pas content !',
        reason: 'éligibilité',
        user: 'étudiant',
      }, 'Vous devez spécifier un email valide.');
    });

    it('should not send message if email is invalid', async () => {
      await failValidation({
        name: 'Neris',
        firstName: 'Iti',
        email: 'nicetrydude',
        message: 'Pas content !',
        reason: 'éligibilité',
        user: 'étudiant',
      }, 'Vous devez spécifier un email valide.');
    });

    it('should not send message if reason is missing', async () => {
      await failValidation({
        name: 'Neris',
        firstName: 'Iti',
        email: 'iti@ner.is',
        message: 'Pas content !',
        user: 'étudiant',
      }, 'Vous devez spécifier une raison.');
    });

    it('should not send message if reason is invalid', async () => {
      await failValidation({
        name: 'Neris',
        firstName: 'Iti',
        email: 'iti@ner.is',
        message: 'Pas content !',
        reason: 'pas content...',
        user: 'étudiant',
      }, 'Vous devez spécifier une raison.');
    });

    it('should not send message if user is missing', async () => {
      await failValidation({
        name: 'Neris',
        firstName: 'Iti',
        email: 'iti@ner.is',
        message: 'Pas content !',
        reason: 'éligibilité',
      }, 'Vous devez préciser qui vous êtes.');
    });

    it('should not send message if user is invalid', async () => {
      await failValidation({
        name: 'Neris',
        firstName: 'Iti',
        email: 'iti@ner.is',
        message: 'Pas content !',
        reason: 'éligibilité',
        user: 'me',
      }, 'Vous devez préciser qui vous êtes.');
    });

    it('should not send message if message is missing', async () => {
      await failValidation({
        name: 'Neris',
        firstName: 'Iti',
        email: 'iti@ner.is',
        reason: 'éligibilité',
        user: 'étudiant',
      }, 'Vous devez spécifier un message.');
    });
  });
});
