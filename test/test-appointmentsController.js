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
        email: 'prenom.nom@beta.gouv.fr',
      }
      const patient = await dbPatients.insertPatient(
        'Ada',
        'Lovelace',
        '12345678901',
        '42',
        false,
        false,
        psy.dossierNumber,
        'Dr Docteur',
        'adresse du docteur',
        '05 00 00 00 00',
      )

      return chai.request(app)
        .post('/psychologue/creer-nouvelle-seance')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy.dossierNumber)}`)
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send({
          'patientId': patient.id,
          date: '09/02/2021',
          'iso-date': '2021-02-09',
        })
        .then(async (res) => {
          res.should.redirectTo('/psychologue/mes-seances')

          const appointmentArray = await dbAppointments.getAppointments(psy.dossierNumber)
          expect(appointmentArray).to.have.length(1)
          expect(appointmentArray[0].psychologistId).to.equal(psy.dossierNumber)

          return Promise.resolve()
        })
    })

    it('should not create appointment if patient id is not linked to psy id', async function() {
      const dossierNumber = '9a42d12f-8328-4545-8da3-11250f876146'
      const anotherDossierNumber = '8a42d12f-8328-4545-8da3-11250f876146'
      const psy = {
        dossierNumber: dossierNumber,
        email: 'prenom.nom@beta.gouv.fr',
      }

      const patient = await dbPatients.insertPatient(
        'Ada',
        'Lovelace',
        '12345678901',
        '42',
        false,
        false,
        anotherDossierNumber,
        'Dr Docteur',
        'adresse du docteur',
        '05 00 00 00 00',
      )

      return chai.request(app)
        .post('/psychologue/creer-nouvelle-seance')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy.dossierNumber)}`)
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send({
          'patientId': patient.id,
          date: '09/02/2021',
          'iso-date': '2021-02-09',
        })
        .then(async (res) => {
          res.should.redirectTo('/psychologue/mes-seances')

          // was not created because patient id is not linked to psy id
          const appointmentArray = await dbAppointments.getAppointments(psy.dossierNumber)
          expect(appointmentArray).to.have.length(0)

          return Promise.resolve()
        })
    })

    it('should not create appointment if user not logged in', async function() {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      }
      const patient = await dbPatients.insertPatient(
        'Ada',
        'Lovelace',
        '12345678901',
        '42',
        false,
        false,
        psy.dossierNumber,
        'Dr Docteur',
        'adresse du docteur',
        '05 00 00 00 00',
      )

      return chai.request(app)
        .post('/psychologue/creer-nouvelle-seance')
        // no auth cookie
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send({
          'patientId': patient.id,
          date: '09/02/2021',
          'iso-date': '2021-02-09',
        })
        .then(async (res) => {
          res.should.redirectTo('/psychologue/login')

          // Appointment not created
          const appointmentArray = await dbAppointments.getAppointments(psy.dossierNumber)
          expect(appointmentArray).to.have.length(0)

          return Promise.resolve()
        })
    })

    it('should only display my patients in dropdown when creating appointment', async function() {
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
        '05 00 00 00 00',
      )
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
        '05 00 00 00 00',
      )

      return chai.request(app)
        .get('/psychologue/nouvelle-seance')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy.dossierNumber)}`)
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

    it('should refuse invalid patientId', function(done) {
      chai.request(app)
        .post('/psychologue/creer-nouvelle-seance')
        .set('Cookie', `token=${cookie.getJwtTokenForUser('prenom.nom@beta.gouv.fr')}`)
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send({
          'patientId': 'not-a-uuid',
          date: '09/02/2021',
          'iso-date': '2021-02-09',
        })
        .end((err, res) => {
          res.should.redirectTo('/psychologue/nouvelle-seance')
          sinon.assert.notCalled(insertAppointmentStub)
          done()
        })
    })

    it('should refuse empty patientId', function(done) {
      chai.request(app)
        .post('/psychologue/creer-nouvelle-seance')
        .set('Cookie', `token=${cookie.getJwtTokenForUser('prenom.nom@beta.gouv.fr')}`)
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send({
          // no patientId
          date: '09/02/2021',
          'iso-date': '2021-02-09',
        })
        .end((err, res) => {
          res.should.redirectTo('/psychologue/nouvelle-seance')
          sinon.assert.notCalled(insertAppointmentStub)
          done()
        })
    })

    it('should refuse invalid date', function(done) {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      }
      chai.request(app)
        .post('/psychologue/creer-nouvelle-seance')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy.dossierNumber)}`)
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send({
          'patientId': '052d3a16-7042-4f93-9fc0-2049e5fdae79',
          date: '09/02/2021',
          'iso-date': '2021-02-09kk',
        })
        .end((err, res) => {
          res.should.redirectTo('/psychologue/nouvelle-seance')
          sinon.assert.notCalled(insertAppointmentStub)
          done()
        })
    })

    it('should refuse empty date', function(done) {
      chai.request(app)
        .post('/psychologue/creer-nouvelle-seance')
        .set('Cookie', `token=${cookie.getJwtTokenForUser('prenom.nom@beta.gouv.fr')}`)
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send({
          'patientId': '052d3a16-7042-4f93-9fc0-2049e5fdae79',
          date: '09/02/2021',
          // not iso-date
        })
        .end((err, res) => {
          res.should.redirectTo('/psychologue/nouvelle-seance')
          sinon.assert.notCalled(insertAppointmentStub)
          done()
        })
    })

    it('should ignore the date input and use the iso-date', function(done) {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      }
      chai.request(app)
        .post('/psychologue/creer-nouvelle-seance')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy.dossierNumber)}`)
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send({
          'patientId': '052d3a16-7042-4f93-9fc0-2049e5fdae79',
          date: '12/02/2021 kfjhksdhf',
          'iso-date': '2021-02-09',
        })
        .end((err, res) => {
          res.should.redirectTo('/psychologue/mes-seances')
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

    const makeAppointment = async (psychologistId) => {
      // Insert an appointment and a patient
      const patient = await dbPatients.insertPatient(
        'Ada',
        'Lovelace',
        '12345678901',
        '42',
        false,
        false,
        psychologistId,
        'Dr Docteur',
        'adresse du docteur',
        '05 00 00 00 00',
      )
      const appointment = await dbAppointments.insertAppointment(new Date(), patient.id, psychologistId)
      // Check appointment is inserted
      const appointmentArray = await dbAppointments.getAppointments(psychologistId)
      expect(appointmentArray).to.have.length(1)
      return appointment
    }

    it('should delete appointment', async function() {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      }

      const appointment = await makeAppointment(psy.dossierNumber)

      return chai.request(app)
        .post('/psychologue/api/supprimer-seance')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy.dossierNumber)}`)
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send({
          'appointmentId': appointment.id,
        })
        .then(async (res) => {
          res.should.redirectTo('/psychologue/mes-seances')

          const appointmentArray = await dbAppointments.getAppointments(psy.dossierNumber)
          expect(appointmentArray).to.have.length(0)

          return Promise.resolve()
        })
    })

    it('should not delete appointment if it is not mine', async function() {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      }
      const anotherPsyId = 'ccb6f32b-8c55-4322-8ecc-556e6900b4ea'
      const appointment = await makeAppointment(anotherPsyId)

      return chai.request(app)
        .post('/psychologue/api/supprimer-seance')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy.dossierNumber)}`)
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send({
          'appointmentId': appointment.id,
        })
        .then(async (res) => {
          res.should.redirectTo('/psychologue/mes-seances')
          // Appointment is not deleted
          const appointmentArray = await dbAppointments.getAppointments(anotherPsyId)
          expect(appointmentArray).to.have.length(1)

          return Promise.resolve()
        })
    })

    it('should refuse invalid appointmentId', async function() {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      }
      const appointment = await makeAppointment(psy.dossierNumber)

      return chai.request(app)
        .post('/psychologue/api/supprimer-seance')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy.dossierNumber)}`)
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send({
          'appointmentId': appointment.id + '4',
        })
        .then(async (res) => {
          res.should.redirectTo('/psychologue/mes-seances')

          // Appointment is not deleted
          const appointmentArray = await dbAppointments.getAppointments(psy.dossierNumber)
          expect(appointmentArray).to.have.length(1)

          return Promise.resolve()
        })
    })

    it('should not delete appointment if user not logged in', async function() {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      }
      const appointment = await makeAppointment(psy.dossierNumber)

      return chai.request(app)
        .post('/psychologue/api/supprimer-seance')
        // no auth cookie
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send({
          'appointmentId': appointment.id,
        })
        .then(async (res) => {
          res.should.redirectTo('/psychologue/login')

          // Appointment is not deleted
          const appointmentArray = await dbAppointments.getAppointments(psy.dossierNumber)
          expect(appointmentArray).to.have.length(1)

          return Promise.resolve()
        })
    })

    it('should refuse empty appointmentId', async function() {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      }
      await makeAppointment(psy.dossierNumber)

      return chai.request(app)
        .post('/psychologue/api/supprimer-seance')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy.dossierNumber)}`)
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send({
          // no appointmentId
        })
        .then(async (res) => {
          res.should.redirectTo('/psychologue/mes-seances')

          const appointmentArray = await dbAppointments.getAppointments(psy.dossierNumber)
          expect(appointmentArray).to.have.length(1)

          return Promise.resolve()
        })
    })
  })
})
