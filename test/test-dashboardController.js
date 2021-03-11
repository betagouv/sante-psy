/* eslint-disable func-names */
const app = require('../index')
const chai = require('chai')
const clean = require('./helper/clean')
const cookie = require('../utils/cookie')
const dbAppointments = require('../db/appointments')
const dbPatients = require('../db/patients')
const format = require('../utils/format')

describe('dashboardController', function() {
  describe('display dashaboard', function() {
    beforeEach(async function(done) {
      done()
    })

    afterEach(async function() {
      await clean.cleanAllPatients()
      await clean.cleanAllAppointments()
      return Promise.resolve()
    })

    it('should display only my patients in dashboard', async function() {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      }
      const anotherPsyId = '60014566-d8bf-4f01-94bf-27b31ca9275d'
      const myPatient = await dbPatients.insertPatient(
        'Ada',
        'Lovelace',
        '12345678901',
        '42',
        false,
        false,
        psy.dossierNumber,
        'Dr Docteur',
        'adresse du docteur',
        '05 00 00 00 00')
      const patientForAnotherPsy = await dbPatients.insertPatient(
        'Stevie',
        'Wonder',
        '34567890123',
        'Universal',
        false,
        true,
        anotherPsyId,
        'Dr Docteur',
        'adresse du docteur',
        '05 00 00 00 00'
      )

      return chai.request(app)
        .get('/psychologue/mes-seances')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy)}`)
        .redirects(0) // block redirects, we don't want to test them
        .then(async (res) => {
          // My patients are present
          chai.assert.include(res.text, myPatient.firstNames)
          chai.assert.include(res.text, myPatient.lastName)

          // Other psy's patients are not listed
          chai.assert.notInclude(res.text, patientForAnotherPsy.firstNames)
          chai.assert.notInclude(res.text, patientForAnotherPsy.lastName)
          return Promise.resolve()
        })
    })

    it('should display only my appointments in dashboard', async function() {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      }
      const anotherPsyId = '60014566-d8bf-4f01-94bf-27b31ca9275d'
      const myPatient = await dbPatients.insertPatient(
        'Ada',
        'Lovelace',
        '12345678901',
        '42',
        false,
        false,
        psy.dossierNumber,
        'Dr Docteur',
        'adresse du docteur',
        '05 00 00 00 00')
      const patientForAnotherPsy = await dbPatients.insertPatient(
        'Stevie',
        'Wonder',
        '34567890123',
        'Universal',
        false,
        true,
        anotherPsyId,
        'Dr Docteur',
        'adresse du docteur',
        '05 00 00 00 00')
      const myAppointment =
        await dbAppointments.insertAppointment(new Date('2021-03-01'), myPatient.id, psy.dossierNumber)
      const appointmentForAnotherPsy =
        await dbAppointments.insertAppointment(new Date('2021-12-12'), patientForAnotherPsy.id, anotherPsyId)

      return chai.request(app)
        .get('/psychologue/mes-seances')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy)}`)
        .redirects(0) // block redirects, we don't want to test them
        .then(async (res) => {
          // My appointments are present
          chai.assert.include(res.text, format.formatFrenchDate(myAppointment.appointmentDate))

          // Other psy's patients are not listed
          chai.assert.notInclude(res.text, format.formatFrenchDate(appointmentForAnotherPsy.appointmentDate))

          return Promise.resolve()
        })
    })

  })
})