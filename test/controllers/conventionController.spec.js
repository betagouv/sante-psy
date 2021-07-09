const chai = require('chai');
const app = require('../../index');
const { default: clean } = require('../helper/clean');
const cookie = require('../../utils/cookie');
const dbPsychologists = require('../../db/psychologists');
const dbUniversities = require('../../db/universities');

describe('conventionController', () => {
  describe('updateConventionInfo', () => {
    let university;

    beforeEach(async () => {
      university = await dbUniversities.insertUniversity('Cool U dude');
    });

    afterEach(async () => {
      await clean.cleanAllUniversities();
    });

    it('should updateConventionInfo', async () => {
      const psyEmail = 'login@beta.gouv.fr';
      const psy = await clean.insertOnePsy(psyEmail, 'accepte', false);
      // Check that the fields we are testing are unset before test
      chai.expect(psy.isConventionSigned).not.to.exist;

      return chai.request(app)
      .post(`/api/psychologist/${psy.dossierNumber}/convention`)
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
        .set('xsrf-token', 'randomXSRFToken')
        .send({
          isConventionSigned: true,
          universityId: university.id,
        })
        .then(async (res) => {
          res.status.should.equal(200);
          res.body.message.should.equal('Vos informations de conventionnement sont bien enregistrées.');

          const updatedPsy = await dbPsychologists.getAcceptedPsychologistByEmail(psyEmail);
          chai.expect(updatedPsy.isConventionSigned).to.equal(true);
          chai.expect(updatedPsy.assignedUniversityId).to.equal(university.id);
        });
    });

    const failValidation = async (payload, errorMessage) => {
      const psyEmail = 'login@beta.gouv.fr';
      const psy = await clean.insertOnePsy(psyEmail, 'accepte', false);
      // Check that the fields we are testing are unset before test
      chai.expect(psy.isConventionSigned).not.to.exist;

      return chai.request(app)
      .post(`/api/psychologist/${psy.dossierNumber}/convention`)
      .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
      .set('xsrf-token', 'randomXSRFToken')
        .send(payload)
        .then(async (res) => {
          res.status.should.equal(400);
          res.body.message.should.equal(errorMessage);

          const updatedPsy = await dbPsychologists.getAcceptedPsychologistByEmail(psyEmail);
          chai.expect(updatedPsy.isConventionSigned).not.to.exist;
        });
    };

    it('should not update if isConventionSigned is missing', async () => {
      await failValidation({
        // isConventionSigned: missing
        universityId: university.id,
      }, 'Vous devez spécifier si la convention est signée ou non.');
    });

    it('should not update if universityId is missing', async () => {
      await failValidation({
        isConventionSigned: false,
        // universityId: missing
      }, 'Vous devez choisir une université.');
    });

    it('should not update if isConventionSigned is not a boolean', async () => {
      await failValidation({
        isConventionSigned: 'yes maybe',
        universityId: university.id,
      }, 'Vous devez spécifier si la convention est signée ou non.');
    });

    it('should not update if universityId is not a uuid', async () => {
      await failValidation({
        isConventionSigned: true,
        universityId: 'not a uuid',
      }, 'Vous devez choisir une université.');
    });
  });
});
