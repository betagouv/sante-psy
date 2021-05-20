const chai = require('chai');
const rewire = require('rewire');
const app = require('../index.ts');
const clean = require('./helper/clean');
const cookie = require('../utils/cookie');
const dbPsychologists = require('../db/psychologists');
const dbUniversities = require('../db/universities');

const reimbursementController = rewire('../controllers/reimbursementController');

describe('reimbursementController', () => {
  describe('mergeTotalPatientAppointments', () => {
    const mergeTotalPatientAppointments = reimbursementController.__get__('mergeTotalPatientAppointments');

    const totalAppointments = [
      { countAppointments: 12, year: 2021, month: 4 },
      { countAppointments: 4, year: 2021, month: 5 },
      { countAppointments: 4, year: 2021, month: 6 },
      { countAppointments: 4, year: 2021, month: 7 },
      { countAppointments: 8, year: 2021, month: 11 },
    ];
    const totalPatients = [
      { countPatients: 4, year: 2021, month: 4 },
      { countPatients: 4, year: 2021, month: 5 },
      { countPatients: 2, year: 2021, month: 6 },
      { countPatients: 4, year: 2021, month: 7 },
      { countPatients: 4, year: 2021, month: 11 },
      { countPatients: 1, year: 2021, month: 12 },
    ];

    const total = [
      {
        year: 2021, month: 'avril', countPatients: 4, countAppointments: 12,
      },
      {
        year: 2021, month: 'mai', countPatients: 4, countAppointments: 4,
      },
      {
        year: 2021, month: 'juin', countPatients: 2, countAppointments: 4,
      },
      {
        year: 2021, month: 'juillet', countPatients: 4, countAppointments: 4,
      },
      {
        year: 2021, month: 'novembre', countPatients: 4, countAppointments: 8,
      },
      {
        year: 2021, month: 'décembre', countPatients: 1, countAppointments: 0,
      },
    ];

    it('should merge appointments and patients total together and transform month number to french name', () => {
      const output = mergeTotalPatientAppointments(totalAppointments, totalPatients);
      chai.expect(output).to.eql(total);
    });
  });

  describe('updateConventionInfo', () => {
    let university;

    beforeEach(async () => {
      university = await dbUniversities.insertUniversity('Cool U dude');
    });

    afterEach(async () => {
      await clean.cleanAllPsychologists();
      await clean.cleanAllUniversities();
    });

    it('should updateConventionInfo', async () => {
      const psyEmail = 'login@beta.gouv.fr';
      await dbPsychologists.savePsychologistInPG([clean.getOnePsy(psyEmail, 'accepte', false)]);
      const psy = await dbPsychologists.getAcceptedPsychologistByEmail(psyEmail);
      // Check that the fields we are testing are unset before test
      chai.expect(psy.isConventionSigned).not.to.exist;
      chai.expect(psy.declaredUniversityId).not.to.exist;

      return chai.request(app)
        .post('/api/psychologue/renseigner-convention')
        .set('Authorization', `Bearer ${cookie.getJwtTokenForUser(psy.email, psy.dossierNumber)}`)
        .send({
          isConventionSigned: true,
          universityId: university.id,
        })
        .then(async (res) => {
          res.body.success.should.equal(true);
          res.body.message.should.equal('Vos informations de conventionnement sont bien enregistrées.');

          const updatedPsy = await dbPsychologists.getAcceptedPsychologistByEmail(psyEmail);
          chai.expect(updatedPsy.isConventionSigned).to.equal(true);
          chai.expect(updatedPsy.assignedUniversityId).to.equal(university.id);
        });
    });

    const failValidation = async (payload, errorMessage) => {
      const psyEmail = 'login@beta.gouv.fr';
      await dbPsychologists.savePsychologistInPG([clean.getOnePsy(psyEmail, 'accepte', false)]);
      const psy = await dbPsychologists.getAcceptedPsychologistByEmail(psyEmail);
      // Check that the fields we are testing are unset before test
      chai.expect(psy.isConventionSigned).not.to.exist;
      chai.expect(psy.declaredUniversityId).not.to.exist;

      return chai.request(app)
      .post('/api/psychologue/renseigner-convention')
      .set('Authorization', `Bearer ${cookie.getJwtTokenForUser(psy.email, psy.dossierNumber)}`)
        .send(payload)
        .then(async (res) => {
          res.body.success.should.equal(false);
          res.body.message.should.equal(errorMessage);

          const updatedPsy = await dbPsychologists.getAcceptedPsychologistByEmail(psyEmail);
          chai.expect(updatedPsy.isConventionSigned).not.to.exist;
          chai.expect(updatedPsy.declaredUniversityId).not.to.exist;
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
