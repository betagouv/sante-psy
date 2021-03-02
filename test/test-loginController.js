/* eslint-disable func-names */
const rewire = require('rewire');
const sinon = require('sinon');
const chai = require('chai');
const app = require('../index')
const loginController = rewire('../controllers/loginController');
const dbLoginToken = require('../db/loginToken');
const dbPsychologists = require('../db/psychologists');
const emailUtils = require('../utils/email');
const cookie = require('../utils/cookie');

describe('loginController', function() {
  describe('generateLoginUrl', () => {
    it('should create a login url to send in a email', function() {
      const generateLoginUrl = loginController.__get__('generateLoginUrl');
      const output = generateLoginUrl();

      output.should.equal("http://localhost:8080/psychologue/login");
    })
  })

  describe('generateToken', () => {
    it('should generate a token', function() {
      const generateToken = loginController.__get__('generateToken');
      const output = generateToken("localhost:8080");
      output.length.should.equal(344);
    })

    it('should generate a different token everytime the function is called', function() {
      const generateToken = loginController.__get__('generateToken');
      const output1 = generateToken("localhost:8080");
      const output2 = generateToken("localhost:8080");

      output1.length.should.not.equal(output2);
    })
  })

  describe('login page', () => {
    const token = cookie.getJwtTokenForUser("email");
    const email = "myemail@org.org";
    let getByTokenStub;
    let insertTokenStub;
    let getPsychologistByEmailStub;
    let sendMailStub;

    beforeEach(function(done) {
      insertTokenStub = sinon.stub(dbLoginToken, 'insert')
        .returns(Promise.resolve());

      getPsychologistByEmailStub = sinon.stub(dbPsychologists, 'getPsychologistByEmail')
        .returns(Promise.resolve({
          email: email
        }));

      sendMailStub = sinon.stub(emailUtils, 'sendMail')
        .returns(Promise.resolve());

      done()
    })

    afterEach(function(done) {
      getByTokenStub.restore();
      insertTokenStub.restore();
      getPsychologistByEmailStub.restore();
      sendMailStub.restore();
      done();
    })

    describe('getLogin', () => {
      it('should log someone in', function(done) {
        getByTokenStub = sinon.stub(dbLoginToken, 'getByToken')
        .returns(Promise.resolve(
          {
            token: token,
            email : email
          }
        ));

        chai.request(app)
        .get(`/psychologue/login?token=${encodeURIComponent(token)}`)
        .redirects(0)
        .end((err, res) => {
          sinon.assert.called(getByTokenStub)
          sinon.assert.called(getPsychologistByEmailStub)
          res.should.have.cookie('token');
          res.should.redirectTo('/psychologue/mes-seances')
          done();
        })
      });

      it('should NOT log someone in', function(done) {
        getByTokenStub = sinon.stub(dbLoginToken, 'getByToken')
        .returns(Promise.resolve());

        chai.request(app)
        .get(`/psychologue/login?token=${encodeURIComponent("pizza_for_token")}`)
        .redirects(0)
        .end((err, res) => {
          sinon.assert.called(getByTokenStub)
          sinon.assert.notCalled(getPsychologistByEmailStub)
          res.should.not.have.cookie('token');
          done();
        })
      });
    });

    describe('postLogin', () => {
      it('send a login email', function(done) {
        chai.request(app)
        .post('/psychologue/login')
        .type('form')
        .send({
          'email': 'prenom.nom@beta.gouv.fr',
        })
        .end((err, res) => {
          sinon.assert.called(getPsychologistByEmailStub);
          sinon.assert.called(sendMailStub);
          sinon.assert.called(insertTokenStub);
          done();
        })
      });

      it('should say that email is invalid', function(done) {
        chai.request(app)
        .post('/psychologue/login')
        .type('form')
        .send({
          'email': 'fake_it',
        })
        .redirects(0)
        .end((err, res) => {
          sinon.assert.notCalled(getPsychologistByEmailStub);
          sinon.assert.notCalled(sendMailStub);
          sinon.assert.notCalled(insertTokenStub);
          res.should.redirectTo('/psychologue/login');
          done();
        })
      });
    });
  });
})
