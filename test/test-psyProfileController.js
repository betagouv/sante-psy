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

    it('should not return psy profile if user logged in is not the same as the param', async () => {
      const loggedPsyList = clean.psyList();
      const targetPsyList = clean.psyList();
      await dbPsychologists.savePsychologistInPG(loggedPsyList, targetPsyList);

      const loggedPsy = loggedPsyList[0];
      const targetPsy = targetPsyList[0];

      return chai.request(app)
        .get(`/api/psychologue/${targetPsy.dossierNumber}`)
        .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(loggedPsy.email, loggedPsy.dossierNumber)}`)
        .then(async (res) => {
          res.body.success.should.equal(false);
          res.body.message.should.equal('Erreur lors de la récupération du profil.');
        });
    });

    it('should return psy profile', async () => {
      const psyList = clean.psyList();
      await dbPsychologists.savePsychologistInPG(psyList);
      const psy = psyList[0];

      return chai.request(app)
        .get(`/api/psychologue/${psy.dossierNumber}`)
        .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(psy.email, psy.dossierNumber)}`)
        .then(async (res) => {
          res.body.success.should.equal(true);

          const returnedPsy = res.body.psychologist;
          expect(returnedPsy).to.be.an('object').that.has.all.keys(
            'firstNames',
            'lastName',
            'email',
            'address',
            'departement',
            'region',
            'phone',
            'website',
            'teleconsultation',
            'description',
            'languages',
            'training',
            'diploma',
            'personalEmail',
          );
          expect(returnedPsy.email).to.eql(psy.email);
          expect(returnedPsy.firstNames).to.eql(psy.firstNames);
          // TODO: complete
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

    const shouldFailUpdatePsyInputValidation = (done, postData, message) => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      };

      chai.request(app)
      .put(`/api/psychologue/${psy.dossierNumber}`)
      .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(psy.email, psy.dossierNumber)}`)
      .send(postData)
      .then(async (res) => {
        sinon.assert.notCalled(updatePsyStub);

        res.body.success.should.equal(false);
        res.body.message.should.equal(message);

        done();
      });
    };

    it('should refuse empty firstNames', (done) => {
      shouldFailUpdatePsyInputValidation(done, {
        // no firstNames
        lastName: 'Nom',
        email: 'public@email.com',
        address: '1 rue du Pôle Nord',
        departement: '59 - Nord',
        region: 'Hauts-de-France',
        phone: '01 02 03 04 05',
        website: 'https://monwebsite.fr',
        description: 'Consultez un psychologue gratuitement',
        teleconsultation: true,
        languages: 'Français, Anglais',
        training: '["Psychologie Clinique","Psychopathologie et/ou Psychologie de la santé"]',
        diploma: 'Psychologue clinicien',
        personalEmail: 'perso@email.com',
      }, 'Vous devez spécifier votre prénom.');
    });

    it('should refuse whitespace firstNames', (done) => {
      shouldFailUpdatePsyInputValidation(done, {
        firstNames: '   ',
        lastName: 'Nom',
        email: 'public@email.com',
        address: '1 rue du Pôle Nord',
        departement: '59 - Nord',
        region: 'Hauts-de-France',
        phone: '01 02 03 04 05',
        website: 'https://monwebsite.fr',
        description: 'Consultez un psychologue gratuitement',
        teleconsultation: true,
        languages: 'Français, Anglais',
        training: '["Psychologie Clinique","Psychopathologie et/ou Psychologie de la santé"]',
        diploma: 'Psychologue clinicien',
        personalEmail: 'perso@email.com',
      }, 'Vous devez spécifier votre prénom.');
    });

    it('should refuse empty lastname', (done) => {
      shouldFailUpdatePsyInputValidation(done, {
        firstNames: 'Prénom',
        // no lastName
        email: 'public@email.com',
        address: '1 rue du Pôle Nord',
        departement: '59 - Nord',
        region: 'Hauts-de-France',
        phone: '01 02 03 04 05',
        website: 'https://monwebsite.fr',
        description: 'Consultez un psychologue gratuitement',
        teleconsultation: true,
        languages: 'Français, Anglais',
        training: '["Psychologie Clinique","Psychopathologie et/ou Psychologie de la santé"]',
        diploma: 'Psychologue clinicien',
        personalEmail: 'perso@email.com',
      }, 'Vous devez spécifier votre nom.');
    });

    it('should refuse whitespace lastname', (done) => {
      shouldFailUpdatePsyInputValidation(done, {
        firstNames: 'Prénom',
        lastName: '   ',
        email: 'public@email.com',
        address: '1 rue du Pôle Nord',
        departement: '59 - Nord',
        region: 'Hauts-de-France',
        phone: '01 02 03 04 05',
        website: 'https://monwebsite.fr',
        description: 'Consultez un psychologue gratuitement',
        teleconsultation: true,
        languages: 'Français, Anglais',
        training: '["Psychologie Clinique","Psychopathologie et/ou Psychologie de la santé"]',
        diploma: 'Psychologue clinicien',
        personalEmail: 'perso@email.com',
      }, 'Vous devez spécifier votre nom.');
    });

    it('should sanitize string fields', (done) => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      };

      const postData = {
        firstNames: 'Prénom<div>',
        lastName: 'Nom</',
        email: 'public@email.com',
        address: '1 rue du Pôle Nord',
        departement: '59 - Nord',
        region: 'Hauts-de-France',
        phone: '01 02 03 04 05',
        website: 'https://monwebsite.fr',
        description: 'Consultez un psychologue gratuitement<script>evil</script>',
        teleconsultation: true,
        languages: 'Français, Anglais',
        training: '["Psychologie Clinique","Psychopathologie et/ou Psychologie de la santé"]',
        diploma: 'Psychologue clinicien',
        personalEmail: 'perso@email.com',
      };

      chai.request(app)
      .put(`/api/psychologue/${psy.dossierNumber}`)
      .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(psy.email, psy.dossierNumber)}`)
        .send(postData)
        .end((err, res) => {
          res.body.success.should.equal(true);
          sinon.assert.called(updatePsyStub);

          const expected = [
            psy.dossierNumber,
            'Prénom<div></div>', // sanitized
            'Nom&lt;/', // sanitized
            sinon.match.string,
            sinon.match.string,
            sinon.match.string,
            sinon.match.string,
            sinon.match.string,
            sinon.match.string,
            'Consultez un psychologue gratuitement', // sanitized
            true,
            sinon.match.string,
            sinon.match.string,
            sinon.match.string,
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

    it('should not update psy profile if user logged in is not the same as the param', async () => {
      const loggedPsyList = clean.psyList();
      const targetPsyList = clean.psyList();
      await dbPsychologists.savePsychologistInPG(loggedPsyList, targetPsyList);

      const loggedPsy = loggedPsyList[0];
      const targetPsy = targetPsyList[0];

      return chai.request(app)
        .put(`/api/psychologue/${targetPsy.dossierNumber}`)
        .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(loggedPsy.email, loggedPsy.dossierNumber)}`)
        .send({
          firstNames: 'Prénom',
          lastName: 'Nom',
          email: 'public@email.com',
          address: '1 rue du Pôle Nord',
          departement: '59 - Nord',
          region: 'Hauts-de-France',
          phone: '01 02 03 04 05',
          website: 'https://monwebsite.fr',
          description: 'Consultez un psychologue gratuitement',
          teleconsultation: true,
          languages: 'Français, Anglais',
          training: '["Psychologie Clinique","Psychopathologie et/ou Psychologie de la santé"]',
          diploma: 'Psychologue clinicien',
          personalEmail: 'perso@email.com',
        })
        .then(async (res) => {
          res.body.success.should.equal(false);
          res.body.message
          .should.equal('Erreur. Les informations n\'ont pas été mises à jour. Pourriez-vous réessayer ?');
        });
    });

    it('should not update psy profile if it does not exists', async () => {
      const psyList = clean.psyList();
      const psy = psyList[0];

      return chai.request(app)
        .put(`/api/psychologue/${psy.dossierNumber}`)
        .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(psy.email, psy.dossierNumber)}`)
        .send({
          firstNames: 'Prénom',
          lastName: 'Nom',
          email: 'public@email.com',
          address: '1 rue du Pôle Nord',
          departement: '59 - Nord',
          region: 'Hauts-de-France',
          phone: '01 02 03 04 05',
          website: 'https://monwebsite.fr',
          description: 'Consultez un psychologue gratuitement',
          teleconsultation: true,
          languages: 'Français, Anglais',
          training: '["Psychologie Clinique","Psychopathologie et/ou Psychologie de la santé"]',
          diploma: 'Psychologue clinicien',
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
        .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(psy.email, psy.dossierNumber)}`)
        .send({
          firstNames: 'Prénom',
          lastName: 'Nom',
          email: 'public@email.com',
          address: '1 rue du Pôle Nord',
          departement: '59 - Nord',
          region: 'Hauts-de-France',
          phone: '01 02 03 04 05',
          website: 'https://monwebsite.fr',
          description: 'Consultez un psychologue gratuitement',
          teleconsultation: true,
          languages: 'Français, Anglais',
          training: '["Psychologie Clinique","Psychopathologie et/ou Psychologie de la santé"]',
          diploma: 'Psychologue clinicien',
          personalEmail: 'perso@email.com',
        })
        .then(async (res) => {
          res.body.success.should.equal(true);
          res.body.message.should.equal('Les informations ont bien été mises à jour.');

          const updatedPsy = await dbPsychologists.getPsychologistById(psy.dossierNumber);
          expect(updatedPsy.firstNames).to.eql('Prénom');
          expect(updatedPsy.lastName).to.eql('Nom');
          expect(updatedPsy.email).to.eql('public@email.com');
          expect(updatedPsy.address).to.eql('1 rue du Pôle Nord');
          expect(updatedPsy.departement).to.eql('59 - Nord');
          expect(updatedPsy.region).to.eql('Hauts-de-France');
          expect(updatedPsy.phone).to.eql('01 02 03 04 05');
          expect(updatedPsy.website).to.eql('https://monwebsite.fr');
          expect(updatedPsy.description).to.eql('Consultez un psychologue gratuitement');
          expect(updatedPsy.teleconsultation).to.be.true;
          expect(updatedPsy.languages).to.eql('Français, Anglais');
          expect(updatedPsy.training)
          .to.deep.eql(['Psychologie Clinique', 'Psychopathologie et/ou Psychologie de la santé']);
          expect(updatedPsy.diploma).to.eql('Psychologue clinicien');
          expect(updatedPsy.personalEmail).to.eql('perso@email.com');
        });
    });
  });
});
