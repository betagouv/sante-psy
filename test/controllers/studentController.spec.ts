import chai from 'chai';
import sinon from 'sinon';
import app from '../../index';
import dbStudents from '../../db/students';
import * as studentMails from '../../services/studentMails';
import { v4 as uuidv4 } from 'uuid';

describe('studentController', () => {
  let insertStudentStub;
  let updateStudentStub;
  let sendMailStub;

  beforeEach(() => {
    insertStudentStub = sinon.stub(dbStudents, 'insert');
    updateStudentStub = sinon.stub(dbStudents, 'updateById');
    sendMailStub = sinon.stub(studentMails, 'sendMail1');
  });

  afterEach(() => {
    insertStudentStub.restore();
    updateStudentStub.restore();
    sendMailStub.restore();
  });

  describe('sendMail', () => {
    const successValidation = async (payload) => chai.request(app)
      .post('/api/student/sendMail')
      .send(payload)
      .then(async (res) => {
        res.status.should.equal(200);

        sinon.assert.called(insertStudentStub);
        sinon.assert.called(sendMailStub);
      });

    const failValidation = async (payload, errorMessage) => chai.request(app)
      .post('/api/student/sendMail')
      .send(payload)
      .then(async (res) => {
        res.status.should.equal(400);
        res.body.message.should.equal(errorMessage);

        sinon.assert.notCalled(insertStudentStub);
        sinon.assert.notCalled(sendMailStub);
      });

    it.only('should succeed with valid email and source', async () => successValidation({
      email: 'test@test.fr',
      source: 123,
    }));

    it('should succeed with valid email and undefined source', async () => successValidation({
      email: 'test@test.fr',
    }));

    it('should succeed with valid email and null source', async () => successValidation({
      email: 'test@test.fr',
      source: null,
    }));

    it('should fail with empty body', async () => failValidation({}, 'Vous devez spécifier un email valide.'));

    it('should fail without email', async () => failValidation({
      source: 'instagram',
    }, 'Vous devez spécifier un email valide.'));

    it('should fail with invalid email', async () => failValidation({
      email: 'test',
      source: 'instagram',
    }, 'Vous devez spécifier un email valide.'));

    it('should sanitize source', async () => {
      await successValidation({
        email: 'test@test.fr',
        source: 'source<script>evil</script>',
      });

      // source is sanitized
      sinon.assert.calledWith(insertStudentStub, 'test@test.fr', 'source');
    });
  });

  describe('saveAnswer', () => {
    const successValidation = async (payload) => chai.request(app)
      .post('/api/student/saveAnswer')
      .send(payload)
      .then(async (res) => {
        res.status.should.equal(200);
        res.body.message.should.equal('Ta réponse a bien été prise en compte.');

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
      referral: 2,
    }));

    it('should fail if id is not sent', async () => failValidation({
      letter: true,
    }, 'Votre identifiant est invalide.'));

    it('should fail if id is null', async () => failValidation({
      id: null,
      letter: true,
    }, 'Votre identifiant est invalide.'));

    it('should fail if id is invalid', async () => failValidation({
      id: '123',
      letter: true,
    }, 'Votre identifiant est invalide.'));

    it('should fail if none of letter, appointment or referral is sent', async () => failValidation({
      id: uuidv4(),
    }, 'Une et une seule réponse doit être envoyée'));

    it('should fail if letter is sent as a string', async () => failValidation({
      id: uuidv4(),
      letter: 'oui',
    }, 'Vous devez spécifier un booléen'));

    it('should fail if appointment is sent as a string', async () => failValidation({
      id: uuidv4(),
      appointment: 'non',
    }, 'Vous devez spécifier un booléen'));

    it('should fail if referral is sent as a boolean', async () => failValidation({
      id: uuidv4(),
      referral: true,
    }, 'Vous devez spécifier un nombre entre 1 et 3'));

    it('should fail if referral is sent as a negative number', async () => failValidation({
      id: uuidv4(),
      referral: -2,
    }, 'Vous devez spécifier un nombre entre 1 et 3'));

    it('should fail if referral is sent as a big number', async () => failValidation({
      id: uuidv4(),
      referral: 5,
    }, 'Vous devez spécifier un nombre entre 1 et 3'));
  });

  describe('unregister', () => {
    it('Should set email to null', async () => {
      chai.request(app)
        .delete('/api/student/123')
        .then(async (res) => {
          res.status.should.equal(200);
          res.body.should.equal('Ok');

          sinon.assert.calledWith(updateStudentStub, '123', { email: null });
        });
    });
  });
});
