const app = require('../index')
const chai = require('chai')
const rewire = require('rewire')
const clean = require('./helper/clean')
const cookie = require('../utils/cookie')
const dbPsychologists = require('../db/psychologists')
const dbUniversities = require('../db/universities')
const reimbursementController = rewire('../controllers/reimbursementController')

describe('reimbursementController', () => {
  describe('mergeTotalPatientAppointments', () => {
    const mergeTotalPatientAppointments = reimbursementController.__get__('mergeTotalPatientAppointments');

    const totalAppointments = [
      { countAppointments: 12, year: 2021, month: 4 },
      { countAppointments: 4, year: 2021, month: 5 },
      { countAppointments: 4, year: 2021, month: 6 },
      { countAppointments: 4, year: 2021, month: 7 },
      { countAppointments: 8, year: 2021, month: 11 }
    ]
    const totalPatients = [
      { countPatients: 4, year: 2021, month: 4 },
      { countPatients: 4, year: 2021, month: 5 },
      { countPatients: 2, year: 2021, month: 6 },
      { countPatients: 4, year: 2021, month: 7 },
      { countPatients: 4, year: 2021, month: 11 }
    ]

    const total = [
      {year: 2021,month: 'avril',countPatients: 4,countAppointments: 12},
      {year: 2021, month: 'mai', countPatients: 4, countAppointments: 4 },
      {year: 2021, month: 'juin', countPatients: 2, countAppointments: 4 },
      {year: 2021,month: 'juillet',countPatients: 4,countAppointments: 4},
      {year: 2021,month: 'novembre',countPatients: 4,countAppointments: 8}
    ];

    it('should merge appointments and patients total together and transform month number to french name', () => {
      const output = mergeTotalPatientAppointments(totalAppointments, totalPatients);
      chai.expect(output).to.eql(total)
    })
  })

  describe('updateConventionInfo', () => {
    let university

    beforeEach( async () => {
      university = await dbUniversities.insertUniversity('Cool U dude')
      return
    })

    afterEach(async () => {
      await clean.cleanAllPsychologists()
      await clean.cleanAllUniversities()
      return
    })

    it('should updateConventionInfo', async () => {
      const psyEmail = 'login@beta.gouv.fr'
      await dbPsychologists.savePsychologistInPG([clean.getOnePsy(psyEmail, 'accepte', false)])
      const psy = await dbPsychologists.getAcceptedPsychologistByEmail(psyEmail)
      // Check that the fields we are testing are unset before test
      chai.expect(psy.isConventionSigned).not.to.exist
      chai.expect(psy.payingUniversityId).not.to.exist

      return chai.request(app)
        .post('/psychologue/api/renseigner-convention')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy.dossierNumber)}`)
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send({
          signed: 'yes',
          university: university.id,
        })
        .then(async () => {
          const updatedPsy = await dbPsychologists.getAcceptedPsychologistByEmail(psyEmail)
          chai.expect(updatedPsy.isConventionSigned).to.equal(true) // broken here - null
          chai.expect(updatedPsy.payingUniversityId).to.equal(university.id)
        })
    })

    const failValidation = async (payload) => {
      const psyEmail = 'login@beta.gouv.fr'
      await dbPsychologists.savePsychologistInPG([clean.getOnePsy(psyEmail, 'accepte', false)])
      const psy = await dbPsychologists.getAcceptedPsychologistByEmail(psyEmail)
      // Check that the fields we are testing are unset before test
      chai.expect(psy.isConventionSigned).not.to.exist
      chai.expect(psy.payingUniversityId).not.to.exist

      return chai.request(app)
        .post('/psychologue/api/renseigner-convention')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy.dossierNumber)}`)
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send(payload)
        .then(async () => {
          const updatedPsy = await dbPsychologists.getAcceptedPsychologistByEmail(psyEmail)
          console.log(updatedPsy)
          chai.expect(updatedPsy.isConventionSigned).not.to.exist
          chai.expect(updatedPsy.payingUniversityId).not.to.exist
        })
    }

    it('should not update if signed is missing', async () => {
      await failValidation({
        // signed: missing
        university: university.id,
      })
    })

    it('should not update if universityId is missing', async () => {
      await failValidation({
        signed: 'yes',
        // university: missing
      })
    })

    it('should not update if signed is not "yes" or "no"', async () => {
      await failValidation({
        signed: 'yes maybe',
        university: university.id,
      })
    })

    it('should not update if universityId is not a uuid', async () => {
      await failValidation({
        signed: 'yes',
        university: 'not a uuid',
      })
    })
  })
})