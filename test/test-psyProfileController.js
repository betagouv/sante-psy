const chai = require('chai');
const { expect } = require('chai');
const sinon = require('sinon');
const jwt = require('../utils/jwt');
const app = require('../index.ts');
const clean = require('./helper/clean');
const dbPsychologists = require('../db/psychologists');

describe('psyProfileController', () => {
  describe('getPsyProfile', () => {
    afterEach(async () => {
      await clean.cleanAllPsychologists();
    });

    it('should return 401 if user is not logged in', async () => {
      const psyList = clean.psyList();
      await dbPsychologists.savePsychologistInPG(psyList);
      const psy = psyList[0];

      return chai.request(app)
        .get(`/api/psychologue/${psy.dossierNumber}`)
        .then(async (res) => {
          res.status.should.equal(401);
        });
    });

    it('should return 403 if user token does not match the param', async () => {
      const loggedPsyList = clean.psyList();
      const targetPsyList = clean.psyList();
      await dbPsychologists.savePsychologistInPG(loggedPsyList, targetPsyList);

      const loggedPsy = loggedPsyList[0];
      const targetPsy = targetPsyList[0];

      return chai.request(app)
        .get(`/api/psychologue/${targetPsy.dossierNumber}`)
        .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(loggedPsy.dossierNumber)}`)
        .then(async (res) => {
          res.status.should.equal(403);
        });
    });

    it('should return psy profile', async () => {
      const psyList = clean.psyList();
      await dbPsychologists.savePsychologistInPG(psyList);
      const psy = psyList[0];

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

      chai.request(app)
      .put(`/api/psychologue/${psy.dossierNumber}`)
      .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(psy.dossierNumber)}`)
      .send(postData)
      .then(async (res) => {
        sinon.assert.notCalled(updatePsyStub);

        res.body.success.should.equal(false);
        res.body.message.should.equal(message);
      });
    };

    it('should refuse empty personalEmail', async () => {
      await shouldFailUpdatePsyInputValidation({
        email: 'public@email.com',
        address: '1 rue du Pôle Nord',
        departement: '59 - Nord',
        region: 'Hauts-de-France',
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
        region: 'Hauts-de-France',
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
        region: 'Hauts-de-France',
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
        region: 'Hauts-de-France',
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
        region: 'Hauts-de-France',
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
        region: 'Hauts-de-France',
        phone: '01 02 03 04 05',
        website: 'https://monwebsite.fr',
        description: 'Consultez un psychologue gratuitement',
        teleconsultation: true,
        languages: 'Français, Anglais',
        personalEmail: 'perso@email.com',
      }, 'Vous devez spécifier votre département.');
    });

    it('should refuse empty region', async () => {
      await shouldFailUpdatePsyInputValidation({
        email: 'public@email.com',
        address: '1 rue du Pôle Nord',
        departement: '59 - Nord',
        // no region
        phone: '01 02 03 04 05',
        website: 'https://monwebsite.fr',
        description: 'Consultez un psychologue gratuitement',
        teleconsultation: true,
        languages: 'Français, Anglais',
        personalEmail: 'perso@email.com',
      }, 'Vous devez spécifier votre région.');
    });

    it('should refuse whitespace region', async () => {
      await shouldFailUpdatePsyInputValidation({
        email: 'public@email.com',
        address: '1 rue du Pôle Nord',
        departement: '59 - Nord',
        region: '  ',
        phone: '01 02 03 04 05',
        website: 'https://monwebsite.fr',
        description: 'Consultez un psychologue gratuitement',
        teleconsultation: true,
        languages: 'Français, Anglais',
        personalEmail: 'perso@email.com',
      }, 'Vous devez spécifier votre région.');
    });

    it('should refuse empty phone', async () => {
      await shouldFailUpdatePsyInputValidation({
        email: 'public@email.com',
        address: '1 rue du Pôle Nord',
        departement: '59 - Nord',
        region: 'Hauts-de-France',
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
        region: 'Hauts-de-France',
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
        region: 'Hauts-de-France',
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
        region: 'Hauts-de-France',
        phone: '01 02 03 04 05',
        website: 'https://monwebsite.fr',
        description: 'Consultez un psychologue gratuitement',
        teleconsultation: true,
        languages: '   ',
        personalEmail: 'perso@email.com',
      }, 'Vous devez spécifier les langues parlées.');
    });

    it('should refuse invalid email', async () => {
      await shouldFailUpdatePsyInputValidation({
        email: 'public',
        address: '1 rue du Pôle Nord',
        departement: '59 - Nord',
        region: 'Hauts-de-France',
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
        region: 'Hauts-de-France',
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
        region: 'Hauts-de-France',
        phone: '01 02 03 04 05',
        website: 'monwebsite.fr',
        description: 'Consultez un psychologue gratuitement',
        teleconsultation: true,
        languages: 'Français, Anglais',
        personalEmail: 'perso@email.com',
      }, 'Vous devez spécifier une URL valide.');
    });

    const shouldPassUpdatePsyInputValidation = async (postData) => {
      const psyList = clean.psyList();
      await dbPsychologists.savePsychologistInPG(psyList);
      const psy = psyList[0];

      chai.request(app)
      .put(`/api/psychologue/${psy.dossierNumber}`)
      .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(psy.dossierNumber)}`)
      .send(postData)
      .then(async (res) => {
        sinon.assert.notCalled(updatePsyStub);

        res.body.success.should.equal(true);
        res.body.message.should.equal('Vos informations ont bien été mises à jour.');
      });
    };

    it('should pass validation when teleconsultation is missing', async () => {
      await shouldPassUpdatePsyInputValidation({
        email: 'public@email.com',
        address: '1 rue du Pôle Nord',
        departement: '59 - Nord',
        region: 'Hauts-de-France',
        phone: '01 02 03 04 05',
        website: 'https://monwebsite.fr',
        description: 'Consultez un psychologue gratuitement',
        // teleconsultation: true,
        languages: 'Français, Anglais',
        personalEmail: 'perso@email.com',
      });
    });

    it('should pass validation when email is missing', async () => {
      await shouldPassUpdatePsyInputValidation({
        email: '',
        address: '1 rue du Pôle Nord',
        departement: '59 - Nord',
        region: 'Hauts-de-France',
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
        region: 'Hauts-de-France',
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
        region: 'Hauts-de-France',
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
        email: '',
        address: '1 rue du Pôle Nord',
        departement: '59 - Nord',
        region: 'Hauts-de-France',
        phone: '01 02 03 04 05',
        website: '',
        description: '',
        teleconsultation: true,
        languages: '',
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
        region: 'Hauts-de-France',
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

          const expected = [
            psy.dossierNumber,
            sinon.match.string,
            '1 rue du Pôle Nord<div></div>', // sanitized
            sinon.match.string,
            sinon.match.string,
            sinon.match.string,
            sinon.match.string,
            'Consultez un psychologue gratuitement', // sanitized
            true,
            'Français, Anglais&lt;/', // sanitized
            sinon.match.string,
          ];
          sinon.assert.calledWith(updatePsyStub, ...expected);
          done();
        });
    });
  });

  describe('editPsyProfile', () => {
    it('should return 401 if user is not logged in', async () => {
      const psyList = clean.psyList();
      await dbPsychologists.savePsychologistInPG(psyList);
      const psy = psyList[0];

      return chai.request(app)
        .put(`/api/psychologue/${psy.dossierNumber}`)
        .then(async (res) => {
          res.status.should.equal(401);
        });
    });

    it('should return 403 if user token does not match the param', async () => {
      const loggedPsyList = clean.psyList();
      const targetPsyList = clean.psyList();
      await dbPsychologists.savePsychologistInPG(loggedPsyList, targetPsyList);

      const loggedPsy = loggedPsyList[0];
      const targetPsy = targetPsyList[0];

      return chai.request(app)
        .put(`/api/psychologue/${targetPsy.dossierNumber}`)
        .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(loggedPsy.dossierNumber)}`)
        .send({
          email: 'public@email.com',
          address: '1 rue du Pôle Nord',
          departement: '59 - Nord',
          region: 'Hauts-de-France',
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

    it('should not update psy profile if it does not exists', async () => {
      const psyList = clean.psyList();
      const psy = psyList[0];

      return chai.request(app)
        .put(`/api/psychologue/${psy.dossierNumber}`)
        .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(psy.dossierNumber)}`)
        .send({
          email: 'public@email.com',
          address: '1 rue du Pôle Nord',
          departement: '59 - Nord',
          region: 'Hauts-de-France',
          phone: '01 02 03 04 05',
          website: 'https://monwebsite.fr',
          description: 'Consultez un psychologue gratuitement',
          teleconsultation: true,
          languages: 'Français, Anglais',
          personalEmail: 'perso@email.com',
        })
        .then(async (res) => {
          res.body.success.should.equal(false);
          res.body.message
          .should.equal('Erreur. Les informations n\'ont pas été mises à jour. Pourriez-vous réessayer ?');
        });
    });

    it('should update psy profile', async () => {
      const psyList = clean.psyList();
      await dbPsychologists.savePsychologistInPG(psyList);
      const psy = psyList[0];

      return chai.request(app)
        .put(`/api/psychologue/${psy.dossierNumber}`)
        .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(psy.dossierNumber)}`)
        .send({
          email: 'public@email.com',
          address: '1 rue du Pôle Nord',
          departement: '59 - Nord',
          region: 'Hauts-de-France',
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
  });
});
