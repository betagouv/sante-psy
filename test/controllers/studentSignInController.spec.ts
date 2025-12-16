import sinon from 'sinon';
import chai from 'chai';
import app from '../../index';

import dbStudents from '../../db/students';
import dbStudentLoginToken from '../../db/studentLoginToken';
import * as studentMailController from '../../controllers/studentMailController';

chai.should();

describe('signIn', () => {
  let studentSignInStub;
  let studentSendMailStub;
  let getStudentByMailStub;
  let insertStudentTokenStub;
  let updateStudentTokenStub;

  const routeSignIn = '/api/student/signIn';
  const routeSecondStep = '/api/student/signInSecondStepMail';
  const fakeEmail = 'test@test.fr';
  const fakeIne = '1234567890A';
  const fakeFirstNames = 'Anna';

  beforeEach(() => {
    studentSignInStub = sinon.stub(dbStudents, 'signIn');
    studentSendMailStub = sinon.stub(studentMailController, 'default').resolves();

    getStudentByMailStub = sinon.stub(dbStudentLoginToken, 'getByEmail');
    insertStudentTokenStub = sinon.stub(dbStudentLoginToken, 'insert').resolves();
    updateStudentTokenStub = sinon.stub(dbStudentLoginToken, 'update').resolves();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should send second step mail and insert token if token does not exist', (done) => {
    getStudentByMailStub.resolves(null);

    chai
      .request(app)
      .post(routeSecondStep)
      .send({ email: fakeEmail })
      .end((err, res) => {
        sinon.assert.called(getStudentByMailStub);
        sinon.assert.called(insertStudentTokenStub);
        sinon.assert.notCalled(updateStudentTokenStub);
        sinon.assert.called(studentSendMailStub);
        res.status.should.equal(200);
        done();
      });
  });

  it('should update token if token already exists', (done) => {
    getStudentByMailStub.resolves({ token: 'ABC' });

    chai
      .request(app)
      .post(routeSecondStep)
      .send({ email: fakeEmail })
      .end((err, res) => {
        sinon.assert.called(getStudentByMailStub);
        sinon.assert.notCalled(insertStudentTokenStub);
        sinon.assert.called(updateStudentTokenStub);
        sinon.assert.called(studentSendMailStub);
        res.status.should.equal(200);
        done();
      });
  });

  it('should create student and update token if token exists', (done) => {
    studentSignInStub.resolves({ status: 'created' });
    getStudentByMailStub.resolves({ token: 'ABC' });

    chai
      .request(app)
      .post(routeSignIn)
      .send({ firstNames: fakeFirstNames, ine: fakeIne, email: fakeEmail })
      .end((err, res) => {
        sinon.assert.called(studentSignInStub);
        sinon.assert.called(getStudentByMailStub);
        sinon.assert.called(updateStudentTokenStub);
        sinon.assert.notCalled(insertStudentTokenStub);
        sinon.assert.called(studentSendMailStub);
        res.status.should.equal(201);
        done();
      });
  });

  it('should create student and insert token if no token exists', (done) => {
    studentSignInStub.resolves({ status: 'created' });
    getStudentByMailStub.resolves(null);

    chai
      .request(app)
      .post(routeSignIn)
      .send({ firstNames: fakeFirstNames, ine: fakeIne, email: fakeEmail })
      .end((err, res) => {
        sinon.assert.called(studentSignInStub);
        sinon.assert.called(getStudentByMailStub);
        sinon.assert.called(insertStudentTokenStub);
        sinon.assert.notCalled(updateStudentTokenStub);
        sinon.assert.called(studentSendMailStub);
        res.status.should.equal(201);
        done();
      });
  });

  it('should return 200 when student already registered', (done) => {
    studentSignInStub.resolves({ status: 'alreadyRegistered' });
    getStudentByMailStub.resolves(null);

    chai
      .request(app)
      .post(routeSignIn)
      .send({ firstNames: fakeFirstNames, ine: fakeIne, email: fakeEmail })
      .end((err, res) => {
        sinon.assert.called(studentSignInStub);
        sinon.assert.called(studentSendMailStub);
        res.status.should.equal(200);
        done();
      });
  });

  it('should return 409 on conflict', (done) => {
    studentSignInStub.resolves({ status: 'conflict' });

    chai
      .request(app)
      .post(routeSignIn)
      .send({ firstNames: fakeFirstNames, ine: fakeIne, email: fakeEmail })
      .end((err, res) => {
        sinon.assert.notCalled(studentSendMailStub);
        res.status.should.equal(409);
        res.body.status.should.equal('conflict');
        done();
      });
  });

  it('should return 500 on unexpected db result', (done) => {
    studentSignInStub.resolves({ status: 'weird' });

    chai
      .request(app)
      .post(routeSignIn)
      .send({ firstNames: fakeFirstNames, ine: fakeIne, email: fakeEmail })
      .end((err, res) => {
        res.status.should.equal(500);
        res.body.error.should.equal('Erreur interne');
        done();
      });
  });

  it('should return 500 on thrown internal error', (done) => {
    studentSignInStub.throws(new Error('DB crash'));

    chai
      .request(app)
      .post(routeSignIn)
      .send({ firstNames: fakeFirstNames, ine: fakeIne, email: fakeEmail })
      .end((err, res) => {
        res.status.should.equal(500);
        res.body.error.should.equal('Erreur serveur');
        done();
      });
  });
});
