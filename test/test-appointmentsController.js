/* eslint-disable func-names */
const app = require('../index')
const chai = require('chai')
const clean = require('./helper/clean')
const dbAppointments = require('../db/appointments')
const dbPatients = require('../db/patients')
const sinon = require('sinon')
const { expect } = require('chai')

describe('appointmentsController', function() {
  describe('create appointment', function() {
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

    it('should create appointment', function(done) {
      chai.request(app)
        .post('/creer-nouvelle-seance')
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send({
          'patientId': 1,
          date: '09/02/2021',
          'iso-date': '2021-02-09',
        })
        .end((err, res) => {
          res.should.redirectTo('/mes-seances')
          sinon.assert.called(insertAppointmentStub)
          done()
        })
    })

    it('should refuse invalid date', function(done) {
      chai.request(app)
        .post('/creer-nouvelle-seance')
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
      chai.request(app)
        .post('/creer-nouvelle-seance')
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
      // Insert an appointment and a patient
      const patient = await dbPatients.insertPatient('Ada', 'Lovelace', '12345678901')
      const allpatient = await dbPatients.getPatients()
      console.log(`PATIENT: ${allpatient[0].lastName}, ${allpatient[0].id}`)
      const appointment = await dbAppointments.insertAppointment(new Date(), patient.id)
      // Check appointment is inserted
      console.log(`APPT: ${appointment.patientId}`)
      const appointmentArray = await dbAppointments.getAppointments()
      console.log("GET APPOINTMENT DONE")
      expect(appointmentArray).to.have.length(1)

      return chai.request(app)
        .post('/supprimer-seance')
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send({
          'appointmentId': appointment.id,
        })
        .then(async (res) => {
          res.should.redirectTo('/mes-seances')

          const appointmentArray = await dbAppointments.getAppointments()
          expect(appointmentArray).to.have.length(0)

          return Promise.resolve()
        })
    })
  })
})
