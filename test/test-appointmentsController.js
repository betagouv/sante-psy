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
      const psy = {
        id: '9a42d12f-8328-4545-8da3-11250f876146',
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
          'iso-date': '2021-02-09',
        })
        .end((err, res) => {
          res.should.redirectTo('/mes-seances')
          sinon.assert.called(insertAppointmentStub)
          done()
        })
    })

    it('should refuse invalid date', function(done) {
      const psy = {
        id: '9a42d12f-8328-4545-8da3-11250f876146',
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
        id: '9a42d12f-8328-4545-8da3-11250f876146',
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
        id: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'valid@valid.org',
      }

      // Insert an appointment and a patient
      const patient = await dbPatients.insertPatient('Ada', 'Lovelace', '12345678901')
      const appointment = await dbAppointments.insertAppointment(new Date(), patient.id, psy.id)
      // Check appointment is inserted
      const appointmentArray = await dbAppointments.getAppointments(psy.id)
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

          const appointmentArray = await dbAppointments.getAppointments(psy.id)
          expect(appointmentArray).to.have.length(0)

          return Promise.resolve()
        })
    })
  })
})
