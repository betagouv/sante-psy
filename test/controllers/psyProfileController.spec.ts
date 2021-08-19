import chai, { expect } from 'chai';
import sinon from 'sinon';
import { v4 as uuidv4 } from 'uuid';
import cookie from '../../utils/cookie';
import app from '../../index';
import clean from '../helper/clean';
import dbPsychologists from '../../db/psychologists';

const getAddrCoordinates = require('../../services/getAddrCoordinates');

describe('psyProfileController', () => {
  describe('get psy profile', () => {
    afterEach(async () => {
      await clean.cleanAllPsychologists();
    });

    const checkProfile = (actual, expected, shouldBeComplete) => {
      const expectedKeys = [
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
        'active',
      ];

      if (shouldBeComplete) {
        expectedKeys.push('personalEmail');
      }

      expect(actual).to.be.an('object').that.has.all.keys(expectedKeys);

      expect(actual.firstNames).to.eql(expected.firstNames);
      expect(actual.lastName).to.eql(expected.lastName);
      expect(actual.email).to.eql(expected.email);
      expect(actual.address).to.eql(expected.address);
      expect(actual.departement).to.eql(expected.departement);
      expect(actual.region).to.eql(expected.region);
      expect(actual.phone).to.eql(expected.phone);
      // website url are not generated with protocol
      expect(actual.website).to.eql(`http://${expected.website}`);
      expect(actual.teleconsultation).to.eql(expected.teleconsultation);
      expect(actual.description).to.eql(expected.description);
      expect(actual.languages).to.eql(expected.languages);
      expect(actual.active).to.eql(expected.active);

      if (shouldBeComplete) {
        expect(actual.personalEmail).to.eql(expected.personalEmail);
      }
    };

    it('should return basic info if user is not logged in', async () => {
      const psy = await clean.insertOnePsy();

      return chai.request(app)
        .get(`/api/psychologist/${psy.dossierNumber}`)
        .then(async (res) => {
          res.status.should.equal(200);
          checkProfile(res.body, psy, false);
        });
    });

    it('should return basic info if user is logged in but ask for someone else', async () => {
      const psy = await clean.insertOnePsy();

      return chai.request(app)
        .get(`/api/psychologist/${psy.dossierNumber}`)
        .set('Cookie', `token=${cookie.getJwtTokenForUser(uuidv4(), 'randomXSRFToken')}`)
        .set('xsrf-token', 'randomXSRFToken')
        .then(async (res) => {
          res.status.should.equal(200);
          checkProfile(res.body, psy, false);
        });
    });

    it('should return full psy profile if connected', async () => {
      const psy = await clean.insertOnePsy();

      return chai.request(app)
        .get(`/api/psychologist/${psy.dossierNumber}`)
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
        .set('xsrf-token', 'randomXSRFToken')
        .then(async (res) => {
          res.status.should.equal(200);
          checkProfile(res.body, psy, true);
        });
    });

    it('should fail if param is not a uuid', async () => {
      const invalidUuid = 'yakalelo.com';

      return chai.request(app)
        .get(`/api/psychologist/${invalidUuid}`)
        .then(async (res) => {
          res.status.should.equal(400);
          res.body.message.should.equal('Vous devez spécifier un identifiant valide.');
        });
    });
  });

  describe('update psy profile - input validation', () => {
    let updatePsyStub;

    beforeEach(async () => {
      updatePsyStub = sinon.stub(dbPsychologists, 'update');
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
      .put(`/api/psychologist/${psy.dossierNumber}`)
      .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
      .set('xsrf-token', 'randomXSRFToken')
      .send(postData);

      sinon.assert.notCalled(updatePsyStub);

      res.status.should.equal(400);
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
      },
      'Vous devez spécifier un email valide. Vous devez spécifier le téléphone du secrétariat.');
    });

    const shouldPassUpdatePsyInputValidation = async (postData) => {
      const psy = await clean.insertOnePsy();

      const res = await chai.request(app)
      .put(`/api/psychologist/${psy.dossierNumber}`)
      .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
      .set('xsrf-token', 'randomXSRFToken')
      .send(postData);

      sinon.assert.called(updatePsyStub);

      res.status.should.equal(200);
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
      .put(`/api/psychologist/${psy.dossierNumber}`)
      .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
      .set('xsrf-token', 'randomXSRFToken')
        .send(postData)
        .end((err, res) => {
          res.status.should.equal(200);
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

  describe('update psy profile', () => {
    let getAddrCoordinatesStub;

    beforeEach(async () => {
      getAddrCoordinatesStub = sinon.stub(getAddrCoordinates, 'default');
    });

    afterEach(async () => {
      await clean.cleanAllPsychologists();
      getAddrCoordinatesStub.restore();
    });

    it('should return 401 if user is not logged in', async () => {
      const psy = await clean.insertOnePsy();

      return chai.request(app)
        .put(`/api/psychologist/${psy.dossierNumber}`)
        .then(async (res) => {
          res.status.should.equal(401);
        });
    });

    it('should return 403 if user token does not match the param', async () => {
      const loggedPsy = await clean.insertOnePsy();
      const targetPsy = await clean.insertOnePsy('other@psy.fr');

      return chai.request(app)
        .put(`/api/psychologist/${targetPsy.dossierNumber}`)
        .set('Cookie', `token=${cookie.getJwtTokenForUser(loggedPsy.dossierNumber, 'randomXSRFToken')}`)
        .set('xsrf-token', 'randomXSRFToken')
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
        .put(`/api/psychologist/${psy.dossierNumber}`)
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
        .set('xsrf-token', 'randomXSRFToken')
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
          res.status.should.equal(200);
          res.body.message.should.equal('Vos informations ont bien été mises à jour.');
        });
    });

    it('should update psy profile', async () => {
      const psy = await clean.insertOnePsy();
      const LONGITUDE_PARIS = 2.3488;
      const LATITUDE_PARIS = 48.85341;
      getAddrCoordinatesStub.returns({ longitude: LONGITUDE_PARIS, latitude: LATITUDE_PARIS });

      return chai.request(app)
        .put(`/api/psychologist/${psy.dossierNumber}`)
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
        .set('xsrf-token', 'randomXSRFToken')
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
          res.status.should.equal(200);
          res.body.message.should.equal('Vos informations ont bien été mises à jour.');

          const updatedPsy = await dbPsychologists.getById(psy.dossierNumber);
          expect(updatedPsy.email).to.eql('public@email.com');
          expect(updatedPsy.address).to.eql('1 rue du Pôle Nord');
          expect(updatedPsy.departement).to.eql('59 - Nord');
          expect(updatedPsy.region).to.eql('Hauts-de-France');
          expect(updatedPsy.longitude).to.eql(LONGITUDE_PARIS);
          expect(updatedPsy.latitude).to.eql(LATITUDE_PARIS);
          expect(updatedPsy.phone).to.eql('01 02 03 04 05');
          expect(updatedPsy.website).to.eql('https://monwebsite.fr');
          expect(updatedPsy.description).to.eql('Consultez un psychologue gratuitement');
          expect(updatedPsy.teleconsultation).to.eql(true);
          expect(updatedPsy.languages).to.eql('Français, Anglais');
          expect(updatedPsy.personalEmail).to.eql('perso@email.com');
        });
    });

    it('should ignore extra info on psy profile', async () => {
      const psy = await clean.insertOnePsy();

      return chai.request(app)
        .put(`/api/psychologist/${psy.dossierNumber}`)
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
        .set('xsrf-token', 'randomXSRFToken')
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
          res.status.should.equal(200);
          res.body.message.should.equal('Vos informations ont bien été mises à jour.');

          const updatedPsy = await dbPsychologists.getById(psy.dossierNumber);
          expect(updatedPsy.email).to.eql('public@email.com');
          expect(updatedPsy.address).to.eql('1 rue du Pôle Nord');
          expect(updatedPsy.departement).to.eql('59 - Nord');
          expect(updatedPsy.region).to.eql('Hauts-de-France');
          expect(updatedPsy.phone).to.eql('01 02 03 04 05');
          expect(updatedPsy.website).to.eql('https://monwebsite.fr');
          expect(updatedPsy.description).to.eql('Consultez un psychologue gratuitement');
          expect(updatedPsy.teleconsultation).to.eql(true);
          expect(updatedPsy.languages).to.eql('Français, Anglais');
          expect(updatedPsy.personalEmail).to.eql('perso@email.com');
        });
    });
  });

  describe('activate psy', () => {
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
        .post(`/api/psychologist/${psy.dossierNumber}/activate`)
        .then(async (res) => {
          res.status.should.equal(401);
          sinon.assert.notCalled(activatePsyStub);
        });
    });

    it('should return 403 if user token does not match the param', async () => {
      const loggedPsy = await clean.insertOnePsy();
      const targetPsy = await clean.insertOnePsy('other@psy.fr');

      return chai.request(app)
        .post(`/api/psychologist/${targetPsy.dossierNumber}/activate`)
        .set('Cookie', `token=${cookie.getJwtTokenForUser(loggedPsy.dossierNumber, 'randomXSRFToken')}`)
        .set('xsrf-token', 'randomXSRFToken')
        .then(async (res) => {
          res.status.should.equal(403);
          sinon.assert.notCalled(activatePsyStub);
        });
    });

    it('should activate psy', async () => {
      const psy = clean.getOneInactivePsy();
      await dbPsychologists.upsertMany([psy]);

      return chai.request(app)
        .post(`/api/psychologist/${psy.dossierNumber}/activate`)
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
        .set('xsrf-token', 'randomXSRFToken')
        .then(async (res) => {
          res.status.should.equal(200);
          res.body.message.should.equal('Vos informations sont de nouveau visibles sur l\'annuaire.');

          sinon.assert.calledWith(activatePsyStub, psy.dossierNumber);
        });
    });
  });

  describe('suspend psy', () => {
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
      .post(`/api/psychologist/${psy.dossierNumber}/suspend`)
      .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
      .set('xsrf-token', 'randomXSRFToken')
      .send(postData);

      sinon.assert.notCalled(suspendPsyStub);

      res.status.should.equal(400);
      res.body.message.should.equal(message);
    };

    it('should return 401 if user is not logged in', async () => {
      const psy = await clean.insertOnePsy();

      return chai.request(app)
        .post(`/api/psychologist/${psy.dossierNumber}/suspend`)
        .then(async (res) => {
          res.status.should.equal(401);
          sinon.assert.notCalled(suspendPsyStub);
        });
    });

    it('should return 403 if user token does not match the param', async () => {
      const loggedPsy = await clean.insertOnePsy();
      const targetPsy = await clean.insertOnePsy('other@psy.fr');

      return chai.request(app)
        .post(`/api/psychologist/${targetPsy.dossierNumber}/suspend`)
        .set('Cookie', `token=${cookie.getJwtTokenForUser(loggedPsy.dossierNumber, 'randomXSRFToken')}`)
        .set('xsrf-token', 'randomXSRFToken')
        .then(async (res) => {
          res.status.should.equal(403);
          sinon.assert.notCalled(suspendPsyStub);
        });
    });

    it('should suspend psy', async () => {
      const psy = clean.getOneInactivePsy();
      await dbPsychologists.upsertMany([psy]);

      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + 2);
      return chai.request(app)
        .post(`/api/psychologist/${psy.dossierNumber}/suspend`)
        .send({
          date: nextDate,
          reason: 'Why are you asking ? are you the police ?',
        })
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
        .set('xsrf-token', 'randomXSRFToken')
        .then(async (res) => {
          res.status.should.equal(200);
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
