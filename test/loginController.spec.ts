import sinon from 'sinon';
import chai from 'chai';
import { v4 as uuidv4 } from 'uuid';
import app from '../index';

import loginController from '../controllers/loginController';
import dbLoginToken from '../db/loginToken';
import dbLastConnection from '../db/lastConnections';
import dbPsychologists from '../db/psychologists';
import dbUniversities from '../db/universities';
import cookie from '../utils/cookie';
import clean from './helper/clean';
import { DossierState } from '../types/DossierState';

const sendEmail = require('../utils/email');

describe('loginController', async () => {
  describe('generateLoginUrl', () => {
    it('should create a login url to send in a email', () => {
      loginController.generateLoginUrl().should.equal('http://localhost:8080/psychologue/login');
    });
  });

  describe('generateToken', () => {
    it('should generate a token', () => {
      loginController.generateToken().length.should.equal(128);
    });

    it('should generate a different token everytime the function is called', () => {
      const output1 = loginController.generateToken();
      const output2 = loginController.generateToken();

      output1.length.should.not.equal(output2);
    });
  });

  describe('login page', () => {
    const token = cookie.getJwtTokenForUser('dossierNumber', 'randomXSRFToken');
    const email = 'prenom.nom@beta.gouv.fr';

    describe('getLogin', () => {
      let getByTokenStub;
      let deleteTokenStub;
      let lastConnectionStub;
      let getAcceptedPsychologistByEmailStub;
      beforeEach(async () => {
        deleteTokenStub = sinon.stub(dbLoginToken, 'delete');
        lastConnectionStub = sinon.stub(dbLastConnection, 'upsert');
        getAcceptedPsychologistByEmailStub = sinon
          .stub(dbPsychologists, 'getAcceptedByEmail')
          .returns(
            Promise.resolve({
              email,
              state: DossierState.accepte,
            }),
          );
      });

      afterEach((done) => {
        getByTokenStub.restore();
        lastConnectionStub.restore();
        deleteTokenStub.restore();
        getAcceptedPsychologistByEmailStub.restore();
        done();
      });

      it('should log someone in', (done) => {
        getByTokenStub = sinon.stub(dbLoginToken, 'getByToken').returns(
          Promise.resolve({
            token,
            email,
          }),
        );

        chai
          .request(app)
          .post('/api/psychologist/login')
          .send({ token })
          .end((err, res) => {
            sinon.assert.called(getByTokenStub);
            sinon.assert.called(deleteTokenStub);
            sinon.assert.called(lastConnectionStub);
            sinon.assert.called(getAcceptedPsychologistByEmailStub);

            res.status.should.equal(200);
            res.header['set-cookie'][0].should.have.string('token=');
            res.header['set-cookie'][0].should.have.string('; Path=/; HttpOnly; Secure; SameSite=Lax');
            done();
          });
      });

      it('should NOT log someone in', (done) => {
        getByTokenStub = sinon
          .stub(dbLoginToken, 'getByToken')
          .returns(Promise.resolve());

        chai
          .request(app)
          .post('/api/psychologist/login')
          .send({ token: 'pizzaForToken' })
          .end((err, res) => {
            sinon.assert.called(getByTokenStub);
            sinon.assert.notCalled(deleteTokenStub);
            sinon.assert.notCalled(lastConnectionStub);
            sinon.assert.notCalled(getAcceptedPsychologistByEmailStub);
            chai.assert.isUndefined(res.body.token);
            res.status.should.equal(401);
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
        insertTokenStub = sinon
          .stub(dbLoginToken, 'insert')
          .returns(Promise.resolve());

        sendMailStub = sinon
          .stub(sendEmail, 'default')
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
        getAcceptedPsychologistByEmailStub = sinon
          .stub(dbPsychologists, 'getAcceptedByEmail')
          .returns(
            Promise.resolve({
              email,
              state: DossierState.accepte,
            }),
          );

        chai
          .request(app)
          .post('/api/psychologist/sendMail')
          .send({
            email: 'prenom.nom@beta.gouv.fr',
          })
          .end((err, res) => {
            sinon.assert.called(getAcceptedPsychologistByEmailStub);
            sinon.assert.called(sendMailStub);
            sinon.assert.called(insertTokenStub);

            res.status.should.equal(200);
            res.body.message.should.equal(
              "Un lien de connexion a été envoyé à l'adresse prenom.nom@beta.gouv.fr. Le lien est valable 2 heures.",
            );
            done();
          });
      });

      it('send a not accepted yet email', (done) => {
        getAcceptedPsychologistByEmailStub = sinon
          .stub(dbPsychologists, 'getAcceptedByEmail')
          .returns(Promise.resolve(undefined));

        getNotYetAcceptedPsychologistStub = sinon
          .stub(dbPsychologists, 'getNotYetAcceptedByEmail')
          .returns(
            Promise.resolve({
              email,
              state: DossierState.enConstruction,
            }),
          );

        chai
          .request(app)
          .post('/api/psychologist/sendMail')
          .send({
            email: 'prenom.nom@beta.gouv.fr',
          })
          .end((err, res) => {
            sinon.assert.called(getAcceptedPsychologistByEmailStub);
            sinon.assert.called(getNotYetAcceptedPsychologistStub);
            sinon.assert.called(sendMailStub);
            sinon.assert.notCalled(insertTokenStub);

            res.status.should.equal(401);
            res.body.message.should.equal(
              "Votre compte n'est pas encore validé par nos services, veuillez rééssayer plus tard.",
            );
            done();
          });
      });

      it('send no email if unknown email or refuse or sans suite', (done) => {
        getAcceptedPsychologistByEmailStub = sinon
          .stub(dbPsychologists, 'getAcceptedByEmail')
          .returns(Promise.resolve(undefined));

        getNotYetAcceptedPsychologistStub = sinon
          .stub(dbPsychologists, 'getNotYetAcceptedByEmail')
          .returns(Promise.resolve());

        chai
          .request(app)
          .post('/api/psychologist/sendMail')
          .send({
            email: 'prenom.nom@beta.gouv.fr',
          })
          .end((err, res) => {
            sinon.assert.called(getAcceptedPsychologistByEmailStub);
            sinon.assert.called(getNotYetAcceptedPsychologistStub);
            sinon.assert.notCalled(sendMailStub);
            sinon.assert.notCalled(insertTokenStub);

            res.status.should.equal(401);
            res.body.message.should.equal(
              "L'email prenom.nom@beta.gouv.fr est inconnu, ou est lié à un dossier classé sans suite ou refusé.",
            );
            done();
          });
      });

      it('should say that email is invalid', (done) => {
        getAcceptedPsychologistByEmailStub = sinon
          .stub(dbPsychologists, 'getAcceptedByEmail')
          .returns(
            Promise.resolve({
              email,
              state: DossierState.accepte,
            }),
          );

        chai
          .request(app)
          .post('/api/psychologist/sendMail')
          .send({
            email: 'fake_it',
          })
          .end((err, res) => {
            sinon.assert.notCalled(getAcceptedPsychologistByEmailStub);
            sinon.assert.notCalled(sendMailStub);
            sinon.assert.notCalled(insertTokenStub);

            res.status.should.equal(400);
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
      const universityId = uuidv4();
      await dbUniversities.upsertMany([
        {
          id: universityId,
          name: 'Monster university',
          emailSSU: 'monster@ssu.fr',
          emailUniversity: 'monster@university.fr',
        },
      ]);
      const psy = clean.getOnePsy(
        'loginemail@beta.gouv.fr',
        DossierState.accepte,
        false,
        universityId,
      );
      psy.isConventionSigned = true;
      await dbPsychologists.upsertMany([psy]);

      return chai
        .request(app)
        .get('/api/connecteduser')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
        .set('xsrf-token', 'randomXSRFToken')
        .then(async (res) => {
          res.body.should.have.all.keys(
            'dossierNumber',
            'firstNames',
            'lastName',
            'email',
            'adeli',
            'address',
            'convention',
            'active',
          );
          res.body.dossierNumber.should.equal(psy.dossierNumber);
          res.body.firstNames.should.equal(psy.firstNames);
          res.body.lastName.should.equal(psy.lastName);
          res.body.email.should.equal(psy.email);
          res.body.adeli.should.equal(psy.adeli);
          res.body.address.should.equal(psy.address);
          res.body.active.should.equal(psy.active);
          res.body.convention.should.eql({
            isConventionSigned: true,
            universityName: 'Monster university',
            universityId,
          });
        });
    });

    it('should return empty info when psy does not exist', async () => chai
        .request(app)
        .get('/api/connecteduser')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(uuidv4(), 'randomXSRFToken')}`)
        .then(async (res) => res.body.should.be.empty));

    it('should return empty info if user is not connected', async () => chai
        .request(app)
        .get('/api/connecteduser')
        .then(async (res) => { console.log(res.body); res.body.should.be.empty; }));

    it('should return empty info if user does not have csrf', async () => {
      const psy = clean.insertOnePsy();
      return chai
        .request(app)
        .get('/api/connecteduser')
        .set('Cookie', `token=${cookie.getJwtTokenForUser((await psy).dossierNumber, 'randomXSRFToken')}`)
        .then(async (res) => res.body.should.be.empty);
    });
  });
});
