import chai from 'chai';
import sinon from 'sinon';
import app from '../../index';
import dbStudents from '../../db/students';
import { v4 as uuidv4 } from 'uuid';

describe('studentController', () => {
  describe('saveAnswer', () => {
    let updateStudentStub;
    beforeEach(() => {
      updateStudentStub = sinon.stub(dbStudents, 'updateById');
    });

    afterEach(() => {
      updateStudentStub.restore();
    });

    const successValidation = async (payload) => chai.request(app)
      .post('/api/student/saveAnswer')
      .send(payload)
      .then(async (res) => {
        res.status.should.equal(200);
        res.body.message.should.equal('Réponse enregistrée');

        sinon.assert.called(updateStudentStub);
      });

    const failValidation = async (payload, errorMessage) => chai.request(app)
      .post('/api/student/saveAnswer')
      .send(payload)
      .then(async (res) => {
        res.status.should.equal(400);
        res.body.message.should.equal(errorMessage);

        sinon.assert.notCalled(updateStudentStub);
      });

    it('should succeed with valid letter answer', async () => successValidation({
      id: uuidv4(),
      letter: true,
      appointment: null,
      referral: null,
    }));

    it('should succeed with valid appointment answer', async () => successValidation({
      id: uuidv4(),
      letter: null,
      appointment: false,
      referral: null,
    }));

    it('should succeed with valid referral answer', async () => successValidation({
      id: uuidv4(),
      letter: null,
      appointment: null,
      referral: 4,
    }));

    it('should fail if id is not sent', async () => {
      await failValidation({
        letter: true,
      }, 'Votre identifiant est invalide.');
    });

    it('should fail if id is null', async () => {
      await failValidation({
        id: null,
        letter: true,
      }, 'Votre identifiant est invalide.');
    });

    it('should fail if id is invalid', async () => {
      await failValidation({
        id: '123',
        letter: true,
      }, 'Votre identifiant est invalide.');
    });

    it('should fail if none of letter, appointment or referral is sent', async () => {
      await failValidation({
        id: uuidv4(),
      }, 'Une et une seule réponse doit être envoyée');
    });

    it('should fail if letter is sent as a string', async () => {
      await failValidation({
        id: uuidv4(),
        letter: 'oui',
      }, 'Vous devez spécifier un booléen');
    });

    it('should fail if appointment is sent as a string', async () => {
      await failValidation({
        id: uuidv4(),
        appointment: 'non',
      }, 'Vous devez spécifier un booléen');
    });

    it('should fail if referral is sent as a boolean', async () => {
      await failValidation({
        id: uuidv4(),
        referral: true,
      }, 'Vous devez spécifier un nombre entre 1 et 5');
    });

    it('should fail if referral is sent as a negative number', async () => {
      await failValidation({
        id: uuidv4(),
        referral: -2,
      }, 'Vous devez spécifier un nombre entre 1 et 5');
    });

    it('should fail if referral is sent as a big number', async () => {
      await failValidation({
        id: uuidv4(),
        referral: 100,
      }, 'Vous devez spécifier un nombre entre 1 et 5');
    });
  });
});
