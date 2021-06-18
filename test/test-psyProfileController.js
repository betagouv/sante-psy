const chai = require('chai');
const { expect } = require('chai');
const sinon = require('sinon');
const { v4: uuidv4 } = require('uuid');
const jwt = require('../utils/jwt');
const app = require('../index');
const { default: clean } = require('./helper/clean');
const dbPsychologists = require('../db/psychologists');

describe('psyProfileController', () => {
  describe('getPsyProfile', () => {
    afterEach(async () => {
      await clean.cleanAllPsychologists();
    });

    it('should return 401 if user is not logged in', async () => {
      const psy = await clean.insertOnePsy();

      return chai.request(app)
        .get(`/api/psychologue/${psy.dossierNumber}`)
        .then(async (res) => {
          res.status.should.equal(401);
        });
    });

    it('should return 403 if user token does not match the param', async () => {
      const loggedPsy = await clean.insertOnePsy();
      const targetPsy = await clean.insertOnePsy();

      return chai.request(app)
        .get(`/api/psychologue/${targetPsy.dossierNumber}`)
        .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(loggedPsy.dossierNumber)}`)
        .then(async (res) => {
          res.status.should.equal(403);
        });
    });

    it('should return psy profile', async () => {
      const psy = await clean.insertOnePsy();

      return chai.request(app)
        .get(`/api/psychologue/${psy.dossierNumber}`)
        .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(psy.dossierNumber)}`)
        .then(async (res) => {
          res.body.success.should.equal(true);

          const returnedPsy = res.body.psychologist;
          expect(returnedPsy).to.be.an('object').that.has.all.keys(
            'email',
            'address',
            'departement',
            'region',
            'phone',
            'website',
            'teleconsultation',
            'description',
            'languages',
            'personalEmail',
            'active',
          );
          expect(returnedPsy.email).to.eql(psy.email);
          expect(returnedPsy.address).to.eql(psy.address);
          expect(returnedPsy.departement).to.eql(psy.departement);
          expect(returnedPsy.region).to.eql(psy.region);
          expect(returnedPsy.phone).to.eql(psy.phone);
          expect(returnedPsy.website).to.eql(psy.website);
          expect(returnedPsy.teleconsultation).to.eql(psy.teleconsultation);
          expect(returnedPsy.description).to.eql(psy.description);
          expect(returnedPsy.languages).to.eql(psy.languages);
          expect(returnedPsy.personalEmail).to.eql(psy.personalEmail);
          expect(returnedPsy.active).to.eql(psy.active);
        });
    });
  });

  describe('editPsyProfilValidators', () => {
    let updatePsyStub;

    beforeEach(async () => {
      updatePsyStub = sinon.stub(dbPsychologists, 'updatePsychologist');
      return Promise.resolve();
    });

    afterEach(async () => {
      updatePsyStub.restore();
      return Promise.resolve();
    });

    const shouldFailUpdatePsyInputValidation = async (postData, message) => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      };

      const res = await chai.request(app)
      .put(`/api/psychologue/${psy.dossierNumber}`)
      .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(psy.dossierNumber)}`)
      .send(postData);

      sinon.assert.notCalled(updatePsyStub);

      res.body.success.should.equal(false);
      res.body.message.should.equal(message);
    };

    it('should refuse empty personalEmail', async () => {
      await shouldFailUpdatePsyInputValidation({
        email: 'public@email.com',
        address: '1 rue du Pôle Nord',
        departement: '59 - Nord',
        phone: '01 02 03 04 05',
        website: 'https://monwebsite.fr',
        description: 'Consultez un psychologue gratuitement',
        teleconsultation: true,
        languages: 'Français, Anglais',
        // no personalEmail
      }, 'Vous devez spécifier un email valide.');
    });

    it('should refuse whitespace personalEmail', async () => {
      await shouldFailUpdatePsyInputValidation({
        email: 'public@email.com',
        address: '1 rue du Pôle Nord',
        departement: '59 - Nord',
        phone: '01 02 03 04 05',
        website: 'https://monwebsite.fr',
        description: 'Consultez un psychologue gratuitement',
        teleconsultation: true,
        languages: 'Français, Anglais',
        personalEmail: '  ',
      }, 'Vous devez spécifier un email valide.');
    });

    it('should refuse empty address', async () => {
      await shouldFailUpdatePsyInputValidation({
        email: 'public@email.com',
        // no address
        departement: '59 - Nord',
        phone: '01 02 03 04 05',
        website: 'https://monwebsite.fr',
        description: 'Consultez un psychologue gratuitement',
        teleconsultation: true,
        languages: 'Français, Anglais',
        personalEmail: 'perso@email.com',
      }, "Vous devez spécifier l'adresse de votre cabinet.");
    });

    it('should refuse whitespace address', async () => {
      await shouldFailUpdatePsyInputValidation({
        email: 'public@email.com',
        address: '  ',
        departement: '59 - Nord',
        phone: '01 02 03 04 05',
        website: 'https://monwebsite.fr',
        description: 'Consultez un psychologue gratuitement',
        teleconsultation: true,
        languages: 'Français, Anglais',
        personalEmail: 'perso@email.com',
      }, "Vous devez spécifier l'adresse de votre cabinet.");
    });

    it('should refuse empty departement', async () => {
      await shouldFailUpdatePsyInputValidation({
        email: 'public@email.com',
        address: '1 rue du Pôle Nord',
        // no departement
        phone: '01 02 03 04 05',
        website: 'https://monwebsite.fr',
        description: 'Consultez un psychologue gratuitement',
        teleconsultation: true,
        languages: 'Français, Anglais',
        personalEmail: 'perso@email.com',
      }, 'Vous devez spécifier votre département.');
    });

    it('should refuse whitespace departement', async () => {
      await shouldFailUpdatePsyInputValidation({
        email: 'public@email.com',
        address: '1 rue du Pôle Nord',
        departement: '   ',
        phone: '01 02 03 04 05',
        website: 'https://monwebsite.fr',
        description: 'Consultez un psychologue gratuitement',
        teleconsultation: true,
        languages: 'Français, Anglais',
        personalEmail: 'perso@email.com',
      }, 'Vous devez spécifier votre département.');
    });

    it('should refuse non existing departement', async () => {
      await shouldFailUpdatePsyInputValidation({
        email: 'public@email.com',
        address: '1 rue du Pôle Nord',
        departement: '9cube - Seine St Denis Style',
        phone: '01 02 03 04 05',
        website: 'https://monwebsite.fr',
        description: 'Consultez un psychologue gratuitement',
        teleconsultation: true,
        languages: 'Français, Anglais',
        personalEmail: 'perso@email.com',
      }, 'Departement invalide');
    });

    it('should refuse empty phone', async () => {
      await shouldFailUpdatePsyInputValidation({
        email: 'public@email.com',
        address: '1 rue du Pôle Nord',
        departement: '59 - Nord',
        // no phone
        website: 'https://monwebsite.fr',
        description: 'Consultez un psychologue gratuitement',
        teleconsultation: true,
        languages: 'Français, Anglais',
        personalEmail: 'perso@email.com',
      }, 'Vous devez spécifier le téléphone du secrétariat.');
    });

    it('should refuse whitespace phone', async () => {
      await shouldFailUpdatePsyInputValidation({
        email: 'public@email.com',
        address: '1 rue du Pôle Nord',
        departement: '59 - Nord',
        phone: '  ',
        website: 'https://monwebsite.fr',
        description: 'Consultez un psychologue gratuitement',
        teleconsultation: true,
        languages: 'Français, Anglais',
        personalEmail: 'perso@email.com',
      }, 'Vous devez spécifier le téléphone du secrétariat.');
    });

    it('should refuse empty languages', async () => {
      await shouldFailUpdatePsyInputValidation({
        email: 'public@email.com',
        address: '1 rue du Pôle Nord',
        departement: '59 - Nord',
        phone: '01 02 03 04 05',
        website: 'https://monwebsite.fr',
        description: 'Consultez un psychologue gratuitement',
        teleconsultation: true,
        // no languages
        personalEmail: 'perso@email.com',
      }, 'Vous devez spécifier les langues parlées.');
    });

    it('should refuse whitespace languages', async () => {
      await shouldFailUpdatePsyInputValidation({
        email: 'public@email.com',
        address: '1 rue du Pôle Nord',
        departement: '59 - Nord',
        phone: '01 02 03 04 05',
        website: 'https://monwebsite.fr',
        description: 'Consultez un psychologue gratuitement',
        teleconsultation: true,
        languages: '   ',
        personalEmail: 'perso@email.com',
      }, 'Vous devez spécifier les langues parlées.');
    });

    it('should refuse when teleconsultation is missing', async () => {
      await shouldFailUpdatePsyInputValidation({
        email: 'public@email.com',
        address: '1 rue du Pôle Nord',
        departement: '59 - Nord',
        phone: '01 02 03 04 05',
        website: 'https://monwebsite.fr',
        description: 'Consultez un psychologue gratuitement',
        // teleconsultation: true,
        languages: 'Français, Anglais',
        personalEmail: 'perso@email.com',
      }, 'Vous devez spécifier si vous proposez la téléconsultation.');
    });

    it('should refuse when teleconsultation is invalid', async () => {
      await shouldFailUpdatePsyInputValidation({
        email: 'public@email.com',
        address: '1 rue du Pôle Nord',
        departement: '59 - Nord',
        phone: '01 02 03 04 05',
        website: 'https://monwebsite.fr',
        description: 'Consultez un psychologue gratuitement',
        teleconsultation: 'yes',
        languages: 'Français, Anglais',
        personalEmail: 'perso@email.com',
      }, 'Vous devez spécifier si vous proposez la téléconsultation.');
    });

    it('should refuse invalid email', async () => {
      await shouldFailUpdatePsyInputValidation({
        email: 'public',
        address: '1 rue du Pôle Nord',
        departement: '59 - Nord',
        phone: '01 02 03 04 05',
        website: 'https://monwebsite.fr',
        description: 'Consultez un psychologue gratuitement',
        teleconsultation: true,
        languages: 'Français, Anglais',
        personalEmail: 'perso@email.com',
      }, 'Vous devez spécifier un email valide.');
    });

    it('should refuse invalid personalEmail', async () => {
      await shouldFailUpdatePsyInputValidation({
        email: 'public@email.com',
        address: '1 rue du Pôle Nord',
        departement: '59 - Nord',
        phone: '01 02 03 04 05',
        website: 'https://monwebsite.fr',
        description: 'Consultez un psychologue gratuitement',
        teleconsultation: true,
        languages: 'Français, Anglais',
        personalEmail: 'perso',
      }, 'Vous devez spécifier un email valide.');
    });

    it('should refuse invalid website', async () => {
      await shouldFailUpdatePsyInputValidation({
        email: 'public@email.com',
        address: '1 rue du Pôle Nord',
        departement: '59 - Nord',
        phone: '01 02 03 04 05',
        website: 'monwebsite',
        description: 'Consultez un psychologue gratuitement',
        teleconsultation: true,
        languages: 'Français, Anglais',
        personalEmail: 'perso@email.com',
      }, 'Vous devez spécifier une URL valide.');
    });

    it('should refuse multiple invalid fields', async () => {
      await shouldFailUpdatePsyInputValidation({
        email: 'public@email.com',
        address: '1 rue du Pôle Nord',
        departement: '59 - Nord',
        phone: '',
        website: 'http://monwebsite.fr',
        description: 'Consultez un psychologue gratuitement',
        teleconsultation: true,
        languages: 'Français, Anglais',
        personalEmail: 'perso',
      }, 'Vous devez spécifier le téléphone du secrétariat.'); // first error is returned
    });

    const shouldPassUpdatePsyInputValidation = async (postData) => {
      const psy = await clean.insertOnePsy();

      const res = await chai.request(app)
      .put(`/api/psychologue/${psy.dossierNumber}`)
      .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(psy.dossierNumber)}`)
      .send(postData);

      sinon.assert.called(updatePsyStub);

      res.body.success.should.equal(true);
      res.body.message.should.equal('Vos informations ont bien été mises à jour.');
    };

    it('should pass validation when email is missing', async () => {
      await shouldPassUpdatePsyInputValidation({
        email: '',
        address: '1 rue du Pôle Nord',
        departement: '59 - Nord',
        phone: '01 02 03 04 05',
        website: 'https://monwebsite.fr',
        description: 'Consultez un psychologue gratuitement',
        teleconsultation: true,
        languages: 'Français, Anglais',
        personalEmail: 'perso@email.com',
      });
    });

    it('should pass validation when website is missing', async () => {
      await shouldPassUpdatePsyInputValidation({
        email: 'public@email.com',
        address: '1 rue du Pôle Nord',
        departement: '59 - Nord',
        phone: '01 02 03 04 05',
        website: '',
        description: 'Consultez un psychologue gratuitement',
        teleconsultation: true,
        languages: 'Français, Anglais',
        personalEmail: 'perso@email.com',
      });
    });

    it('should pass validation when description is missing', async () => {
      await shouldPassUpdatePsyInputValidation({
        email: 'public@email.com',
        address: '1 rue du Pôle Nord',
        departement: '59 - Nord',
        phone: '01 02 03 04 05',
        website: 'https://monwebsite.fr',
        description: '',
        teleconsultation: true,
        languages: 'Français, Anglais',
        personalEmail: 'perso@email.com',
      });
    });

    it('should pass validation when optional fields are missing', async () => {
      await shouldPassUpdatePsyInputValidation({
        email: 'public@email.com',
        address: '1 rue du Pôle Nord',
        departement: '59 - Nord',
        phone: '01 02 03 04 05',
        website: 'https://monwebsite.fr',
        description: '',
        teleconsultation: true,
        languages: 'Français',
        personalEmail: 'perso@email.com',
      });
    });

    it('should sanitize string fields', (done) => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      };

      const postData = {
        email: 'public@email.com',
        address: '1 rue du Pôle Nord<div>',
        departement: '59 - Nord',
        phone: '01 02 03 04 05',
        website: 'https://monwebsite.fr',
        description: 'Consultez un psychologue gratuitement<script>evil</script>',
        teleconsultation: true,
        languages: 'Français, Anglais</',
        personalEmail: 'perso@email.com',
      };

      chai.request(app)
      .put(`/api/psychologue/${psy.dossierNumber}`)
      .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(psy.dossierNumber)}`)
        .send(postData)
        .end((err, res) => {
          res.body.success.should.equal(true);
          sinon.assert.called(updatePsyStub);
          sinon.assert.calledWith(updatePsyStub, sinon.match({
            address: '1 rue du Pôle Nord<div></div>',
            description: 'Consultez un psychologue gratuitement',
            languages: 'Français, Anglais&lt;/',
          }));

          done();
        });
    });
  });

  describe('editPsyProfile', () => {
    it('should return 401 if user is not logged in', async () => {
      const psy = await clean.insertOnePsy();

      return chai.request(app)
        .put(`/api/psychologue/${psy.dossierNumber}`)
        .then(async (res) => {
          res.status.should.equal(401);
        });
    });

    it('should return 403 if user token does not match the param', async () => {
      const loggedPsy = await clean.insertOnePsy();
      const targetPsy = await clean.insertOnePsy();

      return chai.request(app)
        .put(`/api/psychologue/${targetPsy.dossierNumber}`)
        .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(loggedPsy.dossierNumber)}`)
        .send({
          email: 'public@email.com',
          address: '1 rue du Pôle Nord',
          departement: '59 - Nord',
          phone: '01 02 03 04 05',
          website: 'https://monwebsite.fr',
          description: 'Consultez un psychologue gratuitement',
          teleconsultation: true,
          languages: 'Français, Anglais',
          personalEmail: 'perso@email.com',
        })
        .then(async (res) => {
          res.status.should.equal(403);
        });
    });

    it('should do nothing if it does not exists', async () => {
      const psy = clean.getOnePsy();

      return chai.request(app)
        .put(`/api/psychologue/${psy.dossierNumber}`)
        .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(psy.dossierNumber)}`)
        .send({
          email: 'public@email.com',
          address: '1 rue du Pôle Nord',
          departement: '59 - Nord',
          phone: '01 02 03 04 05',
          website: 'https://monwebsite.fr',
          description: 'Consultez un psychologue gratuitement',
          teleconsultation: true,
          languages: 'Français, Anglais',
          personalEmail: 'perso@email.com',
        })
        .then(async (res) => {
          res.body.success.should.equal(true);
          res.body.message.should.equal('Vos informations ont bien été mises à jour.');
        });
    });

    it('should update psy profile', async () => {
      const psy = await clean.insertOnePsy();

      return chai.request(app)
        .put(`/api/psychologue/${psy.dossierNumber}`)
        .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(psy.dossierNumber)}`)
        .send({
          email: 'public@email.com',
          address: '1 rue du Pôle Nord',
          departement: '59 - Nord',
          phone: '01 02 03 04 05',
          website: 'https://monwebsite.fr',
          description: 'Consultez un psychologue gratuitement',
          teleconsultation: true,
          languages: 'Français, Anglais',
          personalEmail: 'perso@email.com',
        })
        .then(async (res) => {
          res.body.success.should.equal(true);
          res.body.message.should.equal('Vos informations ont bien été mises à jour.');

          const updatedPsy = await dbPsychologists.getPsychologistById(psy.dossierNumber);
          expect(updatedPsy.email).to.eql('public@email.com');
          expect(updatedPsy.address).to.eql('1 rue du Pôle Nord');
          expect(updatedPsy.departement).to.eql('59 - Nord');
          expect(updatedPsy.region).to.eql('Hauts-de-France');
          expect(updatedPsy.phone).to.eql('01 02 03 04 05');
          expect(updatedPsy.website).to.eql('https://monwebsite.fr');
          expect(updatedPsy.description).to.eql('Consultez un psychologue gratuitement');
          expect(updatedPsy.teleconsultation).to.be.true;
          expect(updatedPsy.languages).to.eql('Français, Anglais');
          expect(updatedPsy.personalEmail).to.eql('perso@email.com');
        });
    });

    it('should ignore extra info on psy profile', async () => {
      const psy = await clean.insertOnePsy();

      return chai.request(app)
        .put(`/api/psychologue/${psy.dossierNumber}`)
        .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(psy.dossierNumber)}`)
        .send({
          email: 'public@email.com',
          address: '1 rue du Pôle Nord',
          departement: '59 - Nord',
          phone: '01 02 03 04 05',
          website: 'https://monwebsite.fr',
          description: 'Consultez un psychologue gratuitement',
          teleconsultation: true,
          languages: 'Français, Anglais',
          personalEmail: 'perso@email.com',
          // To Ignore:
          region: 'La bas',
          dossierNumber: uuidv4(),
        })
        .then(async (res) => {
          res.body.success.should.equal(true);
          res.body.message.should.equal('Vos informations ont bien été mises à jour.');

          const updatedPsy = await dbPsychologists.getPsychologistById(psy.dossierNumber);
          expect(updatedPsy.email).to.eql('public@email.com');
          expect(updatedPsy.address).to.eql('1 rue du Pôle Nord');
          expect(updatedPsy.departement).to.eql('59 - Nord');
          expect(updatedPsy.region).to.eql('Hauts-de-France');
          expect(updatedPsy.phone).to.eql('01 02 03 04 05');
          expect(updatedPsy.website).to.eql('https://monwebsite.fr');
          expect(updatedPsy.description).to.eql('Consultez un psychologue gratuitement');
          expect(updatedPsy.teleconsultation).to.be.true;
          expect(updatedPsy.languages).to.eql('Français, Anglais');
          expect(updatedPsy.personalEmail).to.eql('perso@email.com');
        });
    });
  });

  describe('activate', () => {
    let activatePsyStub;
    beforeEach(() => {
      activatePsyStub = sinon.stub(dbPsychologists, 'activate');
    });

    afterEach(() => {
      activatePsyStub.restore();
    });

    it('should return 401 if user is not logged in', async () => {
      const psy = await clean.insertOnePsy();

      return chai.request(app)
        .post(`/api/psychologue/${psy.dossierNumber}/activate`)
        .then(async (res) => {
          res.status.should.equal(401);
          sinon.assert.notCalled(activatePsyStub);
        });
    });

    it('should return 403 if user token does not match the param', async () => {
      const loggedPsy = await clean.insertOnePsy();
      const targetPsy = await clean.insertOnePsy();

      return chai.request(app)
        .post(`/api/psychologue/${targetPsy.dossierNumber}/activate`)
        .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(loggedPsy.dossierNumber)}`)
        .then(async (res) => {
          res.status.should.equal(403);
          sinon.assert.notCalled(activatePsyStub);
        });
    });

    it('should activate psy', async () => {
      const psy = clean.getOneInactivePsy();
      await dbPsychologists.savePsychologistInPG([psy]);

      return chai.request(app)
        .post(`/api/psychologue/${psy.dossierNumber}/activate`)
        .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(psy.dossierNumber)}`)
        .then(async (res) => {
          res.body.success.should.equal(true);
          res.body.message.should.equal('Vos informations sont de nouveau visibles sur l\'annuaire.');

          sinon.assert.calledWith(activatePsyStub, psy.dossierNumber);
        });
    });
  });

  describe('suspend', () => {
    let suspendPsyStub;
    beforeEach(() => {
      suspendPsyStub = sinon.stub(dbPsychologists, 'suspend');
    });

    afterEach(() => {
      suspendPsyStub.restore();
    });

    const shouldFailSuspendPsyInputValidation = async (postData, message) => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      };

      const res = await chai.request(app)
      .post(`/api/psychologue/${psy.dossierNumber}/suspend`)
      .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(psy.dossierNumber)}`)
      .send(postData);

      sinon.assert.notCalled(suspendPsyStub);

      res.body.success.should.equal(false);
      res.body.message.should.equal(message);
    };

    it('should return 401 if user is not logged in', async () => {
      const psy = await clean.insertOnePsy();

      return chai.request(app)
        .post(`/api/psychologue/${psy.dossierNumber}/suspend`)
        .then(async (res) => {
          res.status.should.equal(401);
          sinon.assert.notCalled(suspendPsyStub);
        });
    });

    it('should return 403 if user token does not match the param', async () => {
      const loggedPsy = await clean.insertOnePsy();
      const targetPsy = await clean.insertOnePsy();

      return chai.request(app)
        .post(`/api/psychologue/${targetPsy.dossierNumber}/suspend`)
        .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(loggedPsy.dossierNumber)}`)
        .then(async (res) => {
          res.status.should.equal(403);
          sinon.assert.notCalled(suspendPsyStub);
        });
    });

    it('should suspend psy', async () => {
      const psy = clean.getOneInactivePsy();
      await dbPsychologists.savePsychologistInPG([psy]);

      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + 2);
      return chai.request(app)
        .post(`/api/psychologue/${psy.dossierNumber}/suspend`)
        .send({
          date: nextDate,
          reason: 'Why are you asking ? are you the police ?',
        })
        .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(psy.dossierNumber)}`)
        .then(async (res) => {
          res.body.success.should.equal(true);
          res.body.message.should.equal('Vos informations ne sont plus visibles sur l\'annuaire.');

          sinon.assert.calledWith(
            suspendPsyStub,
            psy.dossierNumber,
            sinon.match((date) => (new Date(date)).getTime() === nextDate.getTime()),
            'Why are you asking ? are you the police ?',
          );
        });
    });

    it('should not suspend psy if no reason', async () => {
      await shouldFailSuspendPsyInputValidation({
        date: new Date(),
      }, 'Vous devez spécifier une raison.');
    });

    it('should not suspend psy if empty reason', async () => {
      await shouldFailSuspendPsyInputValidation({
        date: new Date(),
        reason: '    ',
      }, 'Vous devez spécifier une raison.');
    });

    it('should not suspend psy if no date', async () => {
      await shouldFailSuspendPsyInputValidation({
        reason: 'yeah',
      }, 'Vous devez spécifier une date de fin de suspension dans le futur.');
    });

    it('should not suspend psy if date is in the past', async () => {
      const previousDate = new Date();
      previousDate.setDate(previousDate.getDate() - 2);
      await shouldFailSuspendPsyInputValidation({
        date: previousDate,
        reason: 'yeah',
      }, 'Vous devez spécifier une date de fin de suspension dans le futur.');
    });
  });
});
