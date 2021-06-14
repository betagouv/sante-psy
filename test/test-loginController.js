/* eslint-disable func-names */
const rewire = require('rewire');
const sinon = require('sinon');
const chai = require('chai');
const { v4: uuidv4 } = require('uuid');
const app = require('../index.ts');

const loginController = rewire('../controllers/loginController');
const dbLoginToken = require('../db/loginToken');
const dbPsychologists = require('../db/psychologists');
const emailUtils = require('../utils/email');
const jwt = require('../utils/jwt');
const clean = require('./helper/clean');

describe('loginController', async () => {
  describe('generateLoginUrl', () => {
    it('should create a login url to send in a email', () => {
      const generateLoginUrl = loginController.__get__('generateLoginUrl');
      const output = generateLoginUrl();

      output.should.equal('http://localhost:8080/psychologue/login');
    });
  });

  describe('generateToken', () => {
    it('should generate a token', () => {
      const generateToken = loginController.__get__('generateToken');
      const output = generateToken('localhost:8080');
      output.length.should.equal(128);
    });

    it('should generate a different token everytime the function is called', () => {
      const generateToken = loginController.__get__('generateToken');
      const output1 = generateToken('localhost:8080');
      const output2 = generateToken('localhost:8080');

      output1.length.should.not.equal(output2);
    });
  });

  describe('login page', () => {
    const token = jwt.getJwtTokenForUser('dossierNumber');
    const email = 'prenom.nom@beta.gouv.fr';

    describe('getLogin', () => {
      let getByTokenStub;
      let deleteTokenStub;
      let getAcceptedPsychologistByEmailStub;
      beforeEach(async () => {
        deleteTokenStub = sinon.stub(dbLoginToken, 'delete')
          .returns(Promise.resolve());

        getAcceptedPsychologistByEmailStub = sinon.stub(dbPsychologists, 'getAcceptedPsychologistByEmail')
          .returns(Promise.resolve({
            email,
            state: 'accepte',
          }));
      });

      afterEach((done) => {
        getByTokenStub.restore();
        deleteTokenStub.restore();
        getAcceptedPsychologistByEmailStub.restore();
        done();
      });

      it('should log someone in', (done) => {
        getByTokenStub = sinon.stub(dbLoginToken, 'getByToken')
        .returns(Promise.resolve(
          {
            token,
            email,
          },
        ));

        chai.request(app)
        .post('/api/psychologue/login')
        .send({ token })
        .end((err, res) => {
          sinon.assert.called(getByTokenStub);
          sinon.assert.called(deleteTokenStub);
          sinon.assert.called(getAcceptedPsychologistByEmailStub);

          res.body.success.should.equal(true);
          res.body.token.should.not.equal(null);
          done();
        });
      });

      it('should NOT log someone in', (done) => {
        getByTokenStub = sinon.stub(dbLoginToken, 'getByToken')
        .returns(Promise.resolve());

        chai.request(app)
        .post('/api/psychologue/login')
        .send({ token: 'pizzaForToken' })
        .end((err, res) => {
          sinon.assert.called(getByTokenStub);
          sinon.assert.notCalled(deleteTokenStub);
          sinon.assert.notCalled(getAcceptedPsychologistByEmailStub);
          chai.assert.isUndefined(res.body.token);
          res.body.success.should.equal(false);
          res.body.message.should.equal(
            'Ce lien est invalide ou expiré. Indiquez votre email ci dessous pour en avoir un nouveau.',
          );
          done();
        });
      });
    });

    describe('postLogin', () => {
      let insertTokenStub;
      let getAcceptedPsychologistByEmailStub;
      let getNotYetAcceptedPsychologistStub;
      let sendMailStub;

      beforeEach(async () => {
        insertTokenStub = sinon.stub(dbLoginToken, 'insert')
          .returns(Promise.resolve());

        sendMailStub = sinon.stub(emailUtils, 'sendMail')
          .returns(Promise.resolve());
      });

      afterEach((done) => {
        insertTokenStub.restore();
        getAcceptedPsychologistByEmailStub.restore();
        sendMailStub.restore();
        if (getNotYetAcceptedPsychologistStub) {
          getNotYetAcceptedPsychologistStub.restore();
        }
        done();
      });

      it('send a login email', (done) => {
        getAcceptedPsychologistByEmailStub = sinon.stub(dbPsychologists, 'getAcceptedPsychologistByEmail')
        .returns(Promise.resolve({
          email,
          state: 'accepte',
        }));

        chai.request(app)
          .post('/api/psychologue/sendMail')
          .send({
            email: 'prenom.nom@beta.gouv.fr',
          })
          .end((err, res) => {
            sinon.assert.called(getAcceptedPsychologistByEmailStub);
            sinon.assert.called(sendMailStub);
            sinon.assert.called(insertTokenStub);

            res.body.success.should.equal(true);
            res.body.message.should.equal(
              'Un lien de connexion a été envoyé à l\'adresse prenom.nom@beta.gouv.fr. Le lien est valable 2 heures.',
            );
            done();
          });
      });

      it('send a not accepted yet email', (done) => {
        getAcceptedPsychologistByEmailStub = sinon.stub(dbPsychologists, 'getAcceptedPsychologistByEmail')
        .returns(Promise.resolve(undefined));

        getNotYetAcceptedPsychologistStub = sinon.stub(dbPsychologists, 'getNotYetAcceptedPsychologistByEmail')
        .returns(Promise.resolve({
          email,
          state: 'en_construction',
        }));

        chai.request(app)
          .post('/api/psychologue/sendMail')
          .send({
            email: 'prenom.nom@beta.gouv.fr',
          })
          .end((err, res) => {
            sinon.assert.called(getAcceptedPsychologistByEmailStub);
            sinon.assert.called(getNotYetAcceptedPsychologistStub);
            sinon.assert.called(sendMailStub);
            sinon.assert.notCalled(insertTokenStub);

            res.body.success.should.equal(false);
            res.body.message.should.equal(
              'Votre compte n\'est pas encore validé par nos services, veuillez rééssayer plus tard.',
            );
            done();
          });
      });

      it('send no email if unknown email or refuse or sans suite', (done) => {
        getAcceptedPsychologistByEmailStub = sinon.stub(dbPsychologists, 'getAcceptedPsychologistByEmail')
        .returns(Promise.resolve(undefined));

        getNotYetAcceptedPsychologistStub = sinon.stub(dbPsychologists, 'getNotYetAcceptedPsychologistByEmail')
        .returns(Promise.resolve());

        chai.request(app)
          .post('/api/psychologue/sendMail')
          .send({
            email: 'prenom.nom@beta.gouv.fr',
          })
          .end((err, res) => {
            sinon.assert.called(getAcceptedPsychologistByEmailStub);
            sinon.assert.called(getNotYetAcceptedPsychologistStub);
            sinon.assert.notCalled(sendMailStub);
            sinon.assert.notCalled(insertTokenStub);

            res.body.success.should.equal(false);
            res.body.message.should.equal(
              'L\'email prenom.nom@beta.gouv.fr est inconnu, ou est lié à un dossier classé sans suite ou refusé.',
            );
            done();
          });
      });

      it('should say that email is invalid', (done) => {
        getAcceptedPsychologistByEmailStub = sinon.stub(dbPsychologists, 'getAcceptedPsychologistByEmail')
        .returns(Promise.resolve({
          email,
          state: 'accepte',
        }));

        chai.request(app)
          .post('/api/psychologue/sendMail')
          .send({
            email: 'fake_it',
          })
          .end((err, res) => {
            sinon.assert.notCalled(getAcceptedPsychologistByEmailStub);
            sinon.assert.notCalled(sendMailStub);
            sinon.assert.notCalled(insertTokenStub);

            res.body.success.should.equal(false);
            res.body.message.should.equal(
              'Vous devez spécifier un email valide.',
            );
            done();
          });
      });
    });
  });

  describe('connected user information', () => {
    it('should return only my basic information', async () => {
      const psyList = clean.psyList();
      await dbPsychologists.savePsychologistInPG(psyList);

      return chai.request(app)
      .get('/api/connecteduser')
      .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(psyList[0].dossierNumber)}`)
      .then(async (res) => {
        res.body.should.have.all.keys('firstNames', 'lastName', 'email');
        res.body.firstNames.should.equal(psyList[0].firstNames);
        res.body.lastName.should.equal(psyList[0].lastName);
        res.body.email.should.equal(psyList[0].email);
      });
    });

    it('should return empty info when psy does not exist', async () => chai.request(app)
      .get('/api/connecteduser')
      .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(uuidv4())}`)
      .then(async (res) => {
        res.body.should.be.empty;
      }));

    it('should return 401 if user is not connected', async () => chai.request(app)
      .get('/api/connecteduser')
      .then(async (res) => {
        res.status.should.equal(401);
      }));
  });
});
