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
const config = require('../utils/config');
const testUtils = require('./helper/utils');

describe('loginController', async function() {
  let _csrf;
  let cookies;

  describe('generateLoginUrl', () => {
    it('should create a login url to send in a email', function() {
      const generateLoginUrl = loginController.__get__('generateLoginUrl');
      const output = generateLoginUrl();

      output.should.equal("http://localhost:8080/psychologue/login");
    })
  })

  describe('getEmailContent', () => {
    it('should send not accepted yet email, if email is not yet accepted ', async function() {
      const isAcceptedEmail = false
      const loginUrl = "test"
      const token = "my_fabulous_token"
      const getEmailContent =  loginController.__get__('getEmailContent');
      const output = await getEmailContent(loginUrl, token, isAcceptedEmail);

      //not accepted email
      const test = output.indexOf(
        "Cependant votre compte n'a pas encore validé sur Demarches Simplifiées par notre équipe"
      )

      test.should.not.equal(-1);
      output.indexOf(token).should.equal(-1); // no token inside email
    })

    it('should send a login link, if email is accepted ', async function() {
      const isAcceptedEmail = true
      const loginUrl = "test"
      const token = "my_fabulous_token"
      const getEmailContent =  loginController.__get__('getEmailContent');
      const output = await getEmailContent(loginUrl, token, isAcceptedEmail);

      // accepted email
      const test = output.indexOf(
        "Me connecter"
      )
      test.should.not.equal(-1);

      output.indexOf(token).should.not.equal(-1); // token inside email
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
    const email = "prenom.nom@beta.gouv.fr";

    describe('getLogin', () => {
      let getByTokenStub;
      let deleteTokenStub;
      let getPsychologistByEmailStub;
      beforeEach(async function() {
        deleteTokenStub = sinon.stub(dbLoginToken, 'delete')
          .returns(Promise.resolve());

        getPsychologistByEmailStub = sinon.stub(dbPsychologists, 'getPsychologistByEmail')
          .returns(Promise.resolve({
            email: email
          }));
      })

      afterEach(function(done) {
        getByTokenStub.restore();
        deleteTokenStub.restore();
        getPsychologistByEmailStub.restore();
        done();
      })

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
          sinon.assert.called(deleteTokenStub)
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
          sinon.assert.notCalled(deleteTokenStub)
          sinon.assert.notCalled(getPsychologistByEmailStub)
          res.should.not.have.cookie('token');
          done();
        })
      });
    });

    describe('postLogin', () => {
      let insertTokenStub;
      let getPsychologistByEmailStub;
      let sendMailStub;

      beforeEach(async function() {
        insertTokenStub = sinon.stub(dbLoginToken, 'insert')
          .returns(Promise.resolve());

        getPsychologistByEmailStub = sinon.stub(dbPsychologists, 'getPsychologistByEmail')
          .returns(Promise.resolve({
            email: email
          }));

        sendMailStub = sinon.stub(emailUtils, 'sendMail')
          .returns(Promise.resolve());
      })

      afterEach(function(done) {
        insertTokenStub.restore();
        getPsychologistByEmailStub.restore();
        sendMailStub.restore();
        done();
      })

      it('send a login email', function(done) {
        chai.request(app)
        .get(`/psychologue/login`)
        .end(function(err, res){
          _csrf = testUtils.getCsrfTokenHtml(res);
          cookies = testUtils.getCsrfTokenCookie(res);
          chai.request(app)
          .post('/psychologue/login')
          .type('form')
          .set('cookie',cookies)
          .send({
            'email': 'prenom.nom@beta.gouv.fr',
            '_csrf': _csrf,
          })
          .end((err, res) => {
            sinon.assert.called(getPsychologistByEmailStub);
            sinon.assert.called(sendMailStub);
            sinon.assert.called(insertTokenStub);
            done();
          })
        });
      });

      it('should refuse login if csrf token is invalid', function(done) {
        chai.request(app)
        .get(`/psychologue/login`)
        .end(function(err, res){
          _csrf = testUtils.getCsrfTokenHtml(res);
          cookies = testUtils.getCsrfTokenCookie(res);
          chai.request(app)
          .post('/psychologue/login')
          .type('form')
          .set('cookie',cookies)
          .send({
            'email': 'prenom.nom@beta.gouv.fr',
            '_csrf': 'fake_token__csrf',
          })
          .end((err, res) => {
            if( config.useCSRF ) {
              sinon.assert.notCalled(getPsychologistByEmailStub);
              sinon.assert.notCalled(sendMailStub);
              sinon.assert.notCalled(insertTokenStub);
            } else {
              sinon.assert.called(getPsychologistByEmailStub);
              sinon.assert.called(sendMailStub);
              sinon.assert.called(insertTokenStub);
            }
            done();
          })
        });
      });

      it('should say that email is invalid', function(done) {
        chai.request(app)
        .get(`/psychologue/login`)
        .end(function(err, res){
          _csrf = testUtils.getCsrfTokenHtml(res);
          cookies = testUtils.getCsrfTokenCookie(res);

          chai.request(app)
          .post('/psychologue/login')
          .type('form')
          .set('cookie',cookies)
          .send({
            'email': 'fake_it',
            '_csrf': _csrf,
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
  });
})
