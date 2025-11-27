import sinon from 'sinon';
import chai from 'chai';
import app from '../../index';

import dbStudents from '../../db/students';
import dbStudentLoginToken from '../../db/studentLoginToken';
import * as studentMailController from '../../controllers/studentMailController';

// todo undo previous commit when coming back to this branch

chai.should();

describe('signIn', () => {
  let signInStub;
  let sendMailStub;

  const route = '/api/student/signIn';
  const fakeEmail = 'test@test.fr';
  const fakeIne = '1234567890A';
  const fakeFirstNames = 'Anna';

  beforeEach(() => {
    signInStub = sinon.stub(dbStudents, 'signIn');

    sendMailStub = sinon.stub(studentMailController, 'default').resolves();

    sinon.stub(dbStudentLoginToken, 'getStudentByEmail').returns(Promise.resolve(null));
    sinon.stub(dbStudentLoginToken, 'insert').returns(Promise.resolve());
    sinon.stub(dbStudentLoginToken, 'update').returns(Promise.resolve());
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should create a student and return 201', (done) => {
    signInStub.returns(Promise.resolve({ status: 'created' }));

    chai
      .request(app)
      .post(route)
      .send({ firstNames: fakeFirstNames, ine: fakeIne, email: fakeEmail })
      .end((err, res) => {
        sinon.assert.called(signInStub);
        sinon.assert.called(sendMailStub);

        res.status.should.equal(201);
        done();
      });
  });

  it('should return 200 when student is already registered', (done) => {
    signInStub.returns(Promise.resolve({ status: 'alreadyRegistered' }));

    chai
      .request(app)
      .post(route)
      .send({ firstNames: fakeFirstNames, ine: fakeIne, email: fakeEmail })
      .end((err, res) => {
        sinon.assert.called(signInStub);
        sinon.assert.called(sendMailStub);

        res.status.should.equal(200);
        done();
      });
  });

  it('should return 409 when conflict happens', (done) => {
    signInStub.returns(Promise.resolve({ status: 'conflict' }));

    chai
      .request(app)
      .post(route)
      .send({ firstNames: fakeFirstNames, ine: fakeIne, email: fakeEmail })
      .end((err, res) => {
        sinon.assert.called(signInStub);
        sinon.assert.notCalled(sendMailStub);

        res.status.should.equal(409);
        res.body.status.should.equal('conflict');
        done();
      });
  });

  it('should return 500 on unexpected db result', (done) => {
    signInStub.returns(Promise.resolve({ status: 'something_weird' }));

    chai
      .request(app)
      .post(route)
      .send({ firstNames: fakeFirstNames, ine: fakeIne, email: fakeEmail })
      .end((err, res) => {
        res.status.should.equal(500);
        res.body.error.should.equal('Erreur interne');
        done();
      });
  });

  it('should return 500 on thrown internal error', (done) => {
    signInStub.throws(new Error('DB crash'));

    chai
      .request(app)
      .post(route)
      .send({ firstNames: fakeFirstNames, ine: fakeIne, email: fakeEmail })
      .end((err, res) => {
        res.status.should.equal(500);
        res.body.error.should.equal('Erreur serveur');
        done();
      });
  });
});
