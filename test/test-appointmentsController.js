/* eslint-disable func-names */
const app = require('../index')
const chai = require('chai')
const clean = require('./helper/clean')
const dbAppointments = require('../db/appointments')
const dbPatients = require('../db/patients')
const sinon = require('sinon')
const cookie = require('../utils/cookie')
const { expect } = require('chai')

describe('appointmentsController', function() {
  describe('create appointment', function() {
    beforeEach(async function(done) {
      done()
    })

    afterEach(async function() {
      await clean.cleanAllPatients()
      await clean.cleanAllAppointments()
      return Promise.resolve()
    })

    it('should create appointment', async function() {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'valid@valid.org',
      }
      const patient = await dbPatients.insertPatient('Ada', 'Lovelace', '12345678901', psy.dossierNumber)

      return chai.request(app)
        .post('/creer-nouvelle-seance')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy)}`)
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send({
          'patientId': patient.id,
          date: '09/02/2021',
          'iso-date': '2021-02-09',
        })
        .then(async (res) => {
          res.should.redirectTo('/mes-seances')

          const appointmentArray = await dbAppointments.getAppointments(psy.dossierNumber)
          expect(appointmentArray).to.have.length(1)
          expect(appointmentArray[0].psychologistId).to.equal(psy.dossierNumber)

          return Promise.resolve()
        })
    })

    it('should not create appointment if user not logged in', async function() {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'valid@valid.org',
      }
      const patient = await dbPatients.insertPatient('Ada', 'Lovelace', '12345678901', psy.dossierNumber)

      return chai.request(app)
        .post('/creer-nouvelle-seance')
        // no auth cookie
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send({
          'patientId': patient.id,
          date: '09/02/2021',
          'iso-date': '2021-02-09',
        })
        .then(async (res) => {
          expect(res.status).to.equal(401)

          // Appointment not created
          const appointmentArray = await dbAppointments.getAppointments(psy.dossierNumber)
          expect(appointmentArray).to.have.length(0)

          return Promise.resolve()
        })
    })

    it('should only display my patients in dropdown when creating appointment', async function() {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'valid@valid.org',
      }
      const anotherPsyId = '60014566-d8bf-4f01-94bf-27b31ca9275d'
      const myPatient = await dbPatients.insertPatient('Ada', 'Lovelace', '12345678901', psy.dossierNumber)
      const patientForAnotherPsy = await dbPatients.insertPatient('Stevie', 'Wonder', '34567890123', anotherPsyId)

      return chai.request(app)
        .get('/nouvelle-seance')
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
  })

  describe('create appointment - input validation', function() {
    let insertAppointmentStub

    beforeEach(function(done) {
      insertAppointmentStub = sinon.stub(dbAppointments, 'insertAppointment')
        .returns(Promise.resolve())
      done()
    })

    afterEach(function(done) {
      insertAppointmentStub.restore()
      done()
    })

    it('should refuse invalid date', function(done) {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'valid@valid.org',
      }
      chai.request(app)
        .post('/creer-nouvelle-seance')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy)}`)
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send({
          'patientId': 1,
          date: '09/02/2021',
          'iso-date': '2021-02-09kk',
        })
        .end((err, res) => {
          res.should.redirectTo('/nouvelle-seance')
          sinon.assert.notCalled(insertAppointmentStub)
          done()
        })
    })

    it('should ignore the date input and use the iso-date', function(done) {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'valid@valid.org',
      }
      chai.request(app)
        .post('/creer-nouvelle-seance')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy)}`)
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send({
          'patientId': 1,
          date: '12/02/2021 kfjhksdhf',
          'iso-date': '2021-02-09',
        })
        .end((err, res) => {
          res.should.redirectTo('/mes-seances')
          sinon.assert.called(insertAppointmentStub)
          done()
        })
    })
  })

  describe('delete appointment', function() {
    beforeEach(async function(done) {
      done()
    })

    afterEach(async function() {
      await clean.cleanAllPatients()
      await clean.cleanAllAppointments()
      return Promise.resolve()
    })

    it('should delete appointment', async function() {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'valid@valid.org',
      }

      // Insert an appointment and a patient
      const patient = await dbPatients.insertPatient('Ada', 'Lovelace', '12345678901', psy.dossierNumber)
      const appointment = await dbAppointments.insertAppointment(new Date(), patient.id, psy.dossierNumber)
      // Check appointment is inserted
      const appointmentArray = await dbAppointments.getAppointments(psy.dossierNumber)
      expect(appointmentArray).to.have.length(1)

      return chai.request(app)
        .post('/supprimer-seance')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy)}`)
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send({
          'appointmentId': appointment.id,
        })
        .then(async (res) => {
          res.should.redirectTo('/mes-seances')

          const appointmentArray = await dbAppointments.getAppointments(psy.dossierNumber)
          expect(appointmentArray).to.have.length(0)

          return Promise.resolve()
        })
    })

    it('should not delete appointment if it is not mine', async function() {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'valid@valid.org',
      }
      const anotherPsyId = 'ccb6f32b-8c55-4322-8ecc-556e6900b4ea'

      // Insert an appointment and a patient
      const patient = await dbPatients.insertPatient('Ada', 'Lovelace', '12345678901', anotherPsyId)
      const appointment = await dbAppointments.insertAppointment(new Date(), patient.id, anotherPsyId)
      // Check appointment is inserted
      const appointmentArray = await dbAppointments.getAppointments(anotherPsyId)
      expect(appointmentArray).to.have.length(1)

      return chai.request(app)
        .post('/supprimer-seance')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy)}`)
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send({
          'appointmentId': appointment.id,
        })
        .then(async (res) => {
          res.should.redirectTo('/mes-seances')

          // Appointment is not deleted
          const appointmentArray = await dbAppointments.getAppointments(anotherPsyId)
          expect(appointmentArray).to.have.length(1)

          return Promise.resolve()
        })
    })

    it('should not delete appointment if user not logged in', async function() {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'valid@valid.org',
      }

      // Insert an appointment and a patient
      const patient = await dbPatients.insertPatient('Ada', 'Lovelace', '12345678901', psy.dossierNumber)
      const appointment = await dbAppointments.insertAppointment(new Date(), patient.id, psy.dossierNumber)
      // Check appointment is inserted
      const appointmentArray = await dbAppointments.getAppointments(psy.dossierNumber)
      expect(appointmentArray).to.have.length(1)

      return chai.request(app)
        .post('/supprimer-seance')
        // no auth cookie
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send({
          'appointmentId': appointment.id,
        })
        .then(async (res) => {
          expect(res.status).to.equal(401)

          // Appointment is not deleted
          const appointmentArray = await dbAppointments.getAppointments(psy.dossierNumber)
          expect(appointmentArray).to.have.length(1)

          return Promise.resolve()
        })
    })
  })
})
