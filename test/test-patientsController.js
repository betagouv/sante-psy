/* eslint-disable func-names */
const app = require('../index')
const chai = require('chai')
const clean = require('./helper/clean')
const cookie = require('../utils/cookie')
const dbPatients = require('../db/patients')
const { expect } = require('chai')
const sinon = require('sinon')

describe('patientsController', function() {
  describe('create patient', function() {
    beforeEach(async function(done) {
      done()
    })

    afterEach(async function() {
      await clean.cleanAllPatients()
      return Promise.resolve()
    })

    it('should create patient', async function() {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'valid@valid.org',
      }

      return chai.request(app)
        .post('/psychologue/creer-nouveau-patient')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy)}`)
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send({
          lastname: 'Lovelace',
          firstnames: 'Ada',
          ine: '12345678901',
        })
        .then(async (res) => {
          res.should.redirectTo('/psychologue/mes-seances')

          const patientsArray = await dbPatients.getPatients(psy.dossierNumber)
          expect(patientsArray).to.have.length(1)
          expect(patientsArray[0].psychologistId).to.equal(psy.dossierNumber)

          return Promise.resolve()
        })
    })

    it('should not create patient if user is not logged in', async function() {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'valid@valid.org',
      }

      return chai.request(app)
        .post('/psychologue/creer-nouveau-patient')
        // no auth cookie
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send({
          lastname: 'Lovelace',
          firstnames: 'Ada',
          ine: '12345678901',
        })
        .then(async (res) => {
          expect(res.status).to.equal(401)

          // Patient not created
          const patientsArray = await dbPatients.getPatients(psy.dossierNumber)
          expect(patientsArray).to.have.length(0)

          return Promise.resolve()
        })
    })
  })

  describe('create patient input validation', function() {
    let insertPatientStub;

    beforeEach(async function() {
      insertPatientStub = sinon.stub(dbPatients, 'insertPatient')
        .returns(Promise.resolve([ {
          'firstnames': 'prenom',
          'lastname': 'nom',
          'ine': 'studentNumber'}
        ]))
      return Promise.resolve()
    })

    afterEach(async function() {
      insertPatientStub.restore()
      return Promise.resolve()
    })

    const shouldFailCreatePatientInputValidation = (done, postData) => {
      chai.request(app)
        .post('/psychologue/creer-nouveau-patient')
        .set('Cookie', `token=${cookie.getJwtTokenForUser('valid@valid.org')}`)
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send(postData)
        .end((err, res) => {
          sinon.assert.notCalled(insertPatientStub)
          res.should.redirectTo('/psychologue/nouveau-patient');

          done();
        })
    }

    it('should refuse empty firstnames', function(done) {
      shouldFailCreatePatientInputValidation(done, {
        // no firstnames
        'lastname': 'Nom',
        'ine': '1234567',
      })
    })

    it('should refuse empty lastname', function(done) {
      shouldFailCreatePatientInputValidation(done, {
        'firstnames': 'Blou Blou',
        // no lastname
        'ine': '1234567',
      })
    })

    it('should refuse whitespace firstnames', function(done) {
      shouldFailCreatePatientInputValidation(done, {
        'firstnames': '   ',
        'lastname': 'Nom',
        'ine': '1234567',
      })
    })

    it('should refuse whitespace lastname', function(done) {
      shouldFailCreatePatientInputValidation(done, {
        'firstnames': 'Blou Blou',
        'lastname': '   ',
        'ine': '1234567',
      })
    })
  })

  describe('update patient', function() {
    beforeEach(async function(done) {
      done()
    })

    afterEach(async function() {
      await clean.cleanAllPatients()
      return Promise.resolve()
    })

    const makePatient = async (psychologistId) => {
      // Insert an appointment and a patient
      const patient = await dbPatients.insertPatient('Ada', 'Lovelace', '12345678901', psychologistId)
      // Check patient is inserted
      const createdPatient = await dbPatients.getPatientById(patient.id, psychologistId)
      chai.assert(!!createdPatient)
      return patient
    }

    it('should update patient', async function() {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'valid@valid.org',
      }
      const patient = await makePatient(psy.dossierNumber)

      return chai.request(app)
        .post('/psychologue/api/modifier-patient')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy)}`)
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send({
          patientid: patient.id,
          lastname: 'Lovelacekkk',
          firstnames: 'Adakkk',
          ine: '111',
        })
        .then(async (res) => {
          res.should.redirectTo('/psychologue/mes-seances')

          const patientsArray = await dbPatients.getPatients(psy.dossierNumber)
          expect(patientsArray).to.have.length(1)
          expect(patientsArray[0].psychologistId).to.equal(psy.dossierNumber)
          expect(patientsArray[0].lastName).to.equal('Lovelacekkk')
          expect(patientsArray[0].firstNames).to.equal('Adakkk')
          expect(patientsArray[0].INE).to.equal('111')

          return Promise.resolve()
        })
    })

    it('should not update patient if it is not mine', async function() {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'valid@valid.org',
      }
      const anotherPsyId = '495614e8-89af-4406-ba02-9fc038b991f9'
      const patient = await makePatient(anotherPsyId)

      return chai.request(app)
        .post('/psychologue/api/modifier-patient')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy)}`)
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send({
          patientid: patient.id,
          lastname: 'Lovelacekkk',
          firstnames: 'Adakkk',
          ine: '111',
        })
        .then(async (res) => {
          res.should.redirectTo('/psychologue/mes-seances')

          // Patient was not updated
          const patientsArray = await dbPatients.getPatients(anotherPsyId)
          expect(patientsArray).to.have.length(1)
          expect(patientsArray[0].psychologistId).to.equal(anotherPsyId)
          expect(patientsArray[0].lastName).to.equal(patient.lastName)
          expect(patientsArray[0].firstNames).to.equal(patient.firstNames)
          expect(patientsArray[0].INE).to.equal(patient.INE)

          return Promise.resolve()
        })
    })

    it('should not update patient if user is not logged in', async function() {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'valid@valid.org',
      }
      const patient = await makePatient(psy.dossierNumber)

      return chai.request(app)
        .post('/psychologue/api/modifier-patient')
        // no auth cookie
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send({
          patientid: patient.id,
          lastname: 'Lovelacekkk',
          firstnames: 'Adakkk',
          ine: '111',
        })
        .then(async (res) => {
          expect(res.status).to.equal(401)

          // Patient was not updated
          const patientsArray = await dbPatients.getPatients(psy.dossierNumber)
          expect(patientsArray).to.have.length(1)
          expect(patientsArray[0].psychologistId).to.equal(psy.dossierNumber)
          expect(patientsArray[0].lastName).to.equal(patient.lastName)
          expect(patientsArray[0].firstNames).to.equal(patient.firstNames)
          expect(patientsArray[0].INE).to.equal(patient.INE)

          return Promise.resolve()
        })
    })

  })
})
