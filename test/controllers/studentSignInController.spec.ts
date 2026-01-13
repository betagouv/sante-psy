import sinon from 'sinon';
import chai from 'chai';
import app from '../../index';

import dbStudents from '../../db/students';
import dbLoginToken from '../../db/loginToken';
import * as studentMailController from '../../services/sendStudentMailTemplate';
import loginController from '../../controllers/loginController';
import loginInformations from '../../services/loginInformations';

chai.should();

describe('signIn', () => {
  let generateTokenStub;
  let studentSignInStub;
  let sendStudentMailStub;
  let getStudentByMailStub;
  let upsertStudentTokenStub;
  let sendLoginMailStub;

  const routeSignIn = '/api/student/signIn';
  const routeSecondStep = '/api/student/signInSecondStepMail';
  const fakeEmail = 'test@test.fr';
  const fakeIne = '1234567890A';
  const fakeFirstNames = 'Anna';

  beforeEach(() => {
    generateTokenStub = sinon
      .stub(loginInformations, 'generateToken')
      .returns('FAKE_TOKEN');
    studentSignInStub = sinon.stub(dbStudents, 'signIn');
    sendStudentMailStub = sinon.stub(studentMailController, 'default').resolves();
    sendLoginMailStub = sinon.stub(loginController, 'sendStudentLoginEmail').resolves();

    getStudentByMailStub = sinon.stub(dbLoginToken, 'getByEmail');
    upsertStudentTokenStub = sinon.stub(dbLoginToken, 'upsert').resolves();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('Sign in step 1', () => {
    it('should send second step mail for new student', (done) => {
      getStudentByMailStub.resolves(null);

      chai
        .request(app)
        .post(routeSecondStep)
        .send({ email: fakeEmail })
        .end(() => {
          sinon.assert.calledOnce(sendStudentMailStub);

          sinon.assert.calledWith(
            sendStudentMailStub,
            fakeEmail,
            sinon.match.string,
            'FAKE_TOKEN',
            'studentSignInValidation',
            'Étape 2 de votre inscription',
          );

          done();
        });
    });

    it('should delete old token and create a new one', (done) => {
      getStudentByMailStub.resolves({ token: 'OLD_TOKEN' });

      generateTokenStub.returns('NEW_TOKEN');

      chai
        .request(app)
        .post(routeSecondStep)
        .send({ email: fakeEmail })
        .end(() => {
          sinon.assert.calledOnce(upsertStudentTokenStub);

          sinon.assert.calledWith(
            upsertStudentTokenStub,
            'NEW_TOKEN',
            fakeEmail,
            sinon.match.date,
          );

          done();
        });
    });
  });

  describe('Sign in step 2', () => {
    it('should return 200 when new student is created', (done) => {
      studentSignInStub.resolves({ status: 'created' });
      getStudentByMailStub.resolves({ token: 'ABC' });

      chai
        .request(app)
        .post(routeSignIn)
        .send({ firstNames: fakeFirstNames, ine: fakeIne, email: fakeEmail })
        .end((err, res) => {
          res.status.should.equal(200);
          done();
        });
    });

    it('should send welcome mail when student is created', (done) => {
      studentSignInStub.resolves({ status: 'created' });
      getStudentByMailStub.resolves(null);

      chai
      .request(app)
      .post(routeSignIn)
      .send({ firstNames: fakeFirstNames, ine: fakeIne, email: fakeEmail })
      .end(() => {
        sinon.assert.calledOnce(sendStudentMailStub);
        sinon.assert.calledWith(
          sendStudentMailStub,
          fakeEmail,
          sinon.match.string,
          'FAKE_TOKEN',
          'studentWelcome',
          'Bienvenue !',
        );
        done();
      });
    });

    it('should upsert token when new student is created', (done) => {
      studentSignInStub.resolves({ status: 'created' });
      getStudentByMailStub.resolves({ token: 'ABC' });

      chai
        .request(app)
        .post(routeSignIn)
        .send({ firstNames: fakeFirstNames, ine: fakeIne, email: fakeEmail })
        .end(() => {
          sinon.assert.called(upsertStudentTokenStub);
          done();
        });
    });

    it('should return 200 when student already registered', (done) => {
      studentSignInStub.resolves({ status: 'alreadyRegistered' });
      getStudentByMailStub.resolves({ token: 'ABC' });

      chai
        .request(app)
        .post(routeSignIn)
        .send({ firstNames: fakeFirstNames, ine: fakeIne, email: fakeEmail })
        .end((err, res) => {
          sinon.assert.called(studentSignInStub);
          res.status.should.equal(200);
          done();
        });
    });

    it('should send login mail when student already registered', (done) => {
      studentSignInStub.resolves({ status: 'alreadyRegistered' });
      getStudentByMailStub.resolves({ token: 'ABC' });

      chai
      .request(app)
      .post(routeSignIn)
      .send({ firstNames: fakeFirstNames, ine: fakeIne, email: fakeEmail })
      .end(() => {
        sinon.assert.calledOnce(sendLoginMailStub);
        sinon.assert.notCalled(sendStudentMailStub);
        done();
      });
    });

    it('should return 200 on any other cases and send no mail', (done) => {
      studentSignInStub.resolves({ status: 'conflict' });
      chai
        .request(app)
        .post(routeSignIn)
        .send({ firstNames: fakeFirstNames, ine: fakeIne, email: fakeEmail })
        .end((err, res) => {
          sinon.assert.notCalled(sendStudentMailStub);
          sinon.assert.notCalled(sendLoginMailStub);
          res.status.should.equal(200);
          done();
        });
    });
  });
});
