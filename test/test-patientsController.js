/* eslint-disable func-names */
const app = require('../index')
const chai = require('chai')
const clean = require('./helper/clean')
const cookie = require('../utils/cookie')
const dbPatients = require('../db/patients')
const { expect } = require('chai')
const sinon = require('sinon')

const makePatient = async (psychologistId) => {
  // Insert an appointment and a patient
  const patient = await dbPatients.insertPatient('Ada', 'Lovelace', '12345678901', psychologistId)
  // Check patient is inserted
  const createdPatient = await dbPatients.getPatientById(patient.id, psychologistId)
  chai.assert(!!createdPatient)
  return patient
}

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
        email: 'prenom.nom@beta.gouv.fr',
      }

      return chai.request(app)
        .post('/psychologue/api/creer-nouveau-patient')
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
        email: 'prenom.nom@beta.gouv.fr',
      }

      return chai.request(app)
        .post('/psychologue/api/creer-nouveau-patient')
        // no auth cookie
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send({
          lastname: 'Lovelace',
          firstnames: 'Ada',
          ine: '12345678901',
        })
        .then(async (res) => {
          res.should.redirectTo('/psychologue/login')

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
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      }

      chai.request(app)
        .post('/psychologue/api/creer-nouveau-patient')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy)}`)
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
        'ine': '1234567890A',
      })
    })

    it('should refuse empty lastname', function(done) {
      shouldFailCreatePatientInputValidation(done, {
        'firstnames': 'Blou Blou',
        // no lastname
        'ine': '1234567890A',
      })
    })

    it('should refuse whitespace firstnames', function(done) {
      shouldFailCreatePatientInputValidation(done, {
        'firstnames': '   ',
        'lastname': 'Nom',
        'ine': '1234567890A',
      })
    })

    it('should refuse whitespace lastname', function(done) {
      shouldFailCreatePatientInputValidation(done, {
        'firstnames': 'Blou Blou',
        'lastname': '   ',
        'ine': '1234567890A',
      })
    })

    it('should refuse ine with length not 11 chars', function(done) {
      shouldFailCreatePatientInputValidation(done, {
        'firstnames': 'Blou Blou',
        'lastname': 'Nom',
        'ine': '1234567890AA',
      })
    })

    it('should refuse ine with non-aphanumeric chars', function(done) {
      shouldFailCreatePatientInputValidation(done, {
        'firstnames': 'Blou Blou',
        'lastname': 'Nom',
        'ine': '1234567890à',
      })
    })

    const shouldPassCreatePatientInputValidation = (done, postData) => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'valid@valid.org',
      }

      chai.request(app)
        .post('/psychologue/api/creer-nouveau-patient')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy)}`)
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send(postData)
        .end((err, res) => {
          sinon.assert.called(insertPatientStub)
          res.should.redirectTo('/psychologue/mes-seances');
          done();
        })
    }

    it('should pass validation when all fields are correct', function(done) {
      shouldPassCreatePatientInputValidation(done, {
        'firstnames': 'Blou Blou',
        'lastname': 'Nom',
        'ine': '1234567890A',
      })
    })

    it('should pass validation when INE is missing', function(done) {
      shouldPassCreatePatientInputValidation(done, {
        'firstnames': 'Blou Blou',
        'lastname': 'Nom',
        'ine': '',
      })
    })
  })

  describe('display update patient form', function() {
    beforeEach(async function(done) {
      done()
    })

    afterEach(async function() {
      await clean.cleanAllPatients()
      return Promise.resolve()
    })

    it('should display form for my patient', async function() {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'valid@valid.org',
      }
      const myPatient = await makePatient(psy.dossierNumber)

      return chai.request(app)
        .get('/psychologue/modifier-patient?patientid=' + myPatient.id)
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy)}`)
        .redirects(0) // block redirects, we don't want to test them
        .then(async (res) => {
          expect(res.status).to.equal(200)

          // The page displays myPatient
          chai.assert.include(res.text, myPatient.firstNames)
          chai.assert.include(res.text, myPatient.lastName)
          chai.assert.include(res.text, myPatient.id)

          return Promise.resolve()
        })
    })

    it('should not display form if it is not my patient', async function() {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'valid@valid.org',
      }
      const anotherPsyId = 'e43b8668-621d-40a7-86e0-c563b6b05509'
      const notMyPatient = await makePatient(anotherPsyId)

      return chai.request(app)
        .get('/psychologue/modifier-patient?patientid=' + notMyPatient.id)
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy)}`)
        .redirects(0) // block redirects, we don't want to test them
        .then(async (res) => {
          res.should.redirectTo('/psychologue/mes-seances')

          // The page does not display patient
          chai.assert.notInclude(res.text, notMyPatient.firstNames)
          chai.assert.notInclude(res.text, notMyPatient.lastName)
          chai.assert.notInclude(res.text, notMyPatient.id)

          return Promise.resolve()
        })
    })

    it('should not display form if uuid is not valid', async function() {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'valid@valid.org',
      }

      return chai.request(app)
        .get('/psychologue/modifier-patient?patientid=' + 'not-a-valid-uuid')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy)}`)
        .redirects(0) // block redirects, we don't want to test them
        .then(async (res) => {
          res.should.redirectTo('/psychologue/mes-seances')

          return Promise.resolve()
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

    it('should update patient', async function() {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
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
          ine: '111222333rr',
        })
        .then(async (res) => {
          res.should.redirectTo('/psychologue/mes-seances')

          const patientsArray = await dbPatients.getPatients(psy.dossierNumber)
          expect(patientsArray).to.have.length(1)
          expect(patientsArray[0].psychologistId).to.equal(psy.dossierNumber)
          expect(patientsArray[0].lastName).to.equal('Lovelacekkk')
          expect(patientsArray[0].firstNames).to.equal('Adakkk')
          expect(patientsArray[0].INE).to.equal('111222333rr')

          return Promise.resolve()
        })
    })

    it('should not update patient if it is not mine', async function() {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
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
          ine: '111222333SS',
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
        email: 'prenom.nom@beta.gouv.fr',
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
          res.should.redirectTo('/psychologue/login')

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

  describe('update patient input validation', function() {
    let updatePatientStub;

    beforeEach(async function() {
      updatePatientStub = sinon.stub(dbPatients, 'updatePatient')
      return Promise.resolve()
    })

    afterEach(async function() {
      updatePatientStub.restore()
      return Promise.resolve()
    })

    const shouldFailUpdatePatientInputValidation = (done, postData, expectedRedirectUrl) => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'valid@valid.org',
      }

      chai.request(app)
        .post('/psychologue/api/modifier-patient')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy)}`)
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send(postData)
        .end((err, res) => {
          sinon.assert.notCalled(updatePatientStub)
          res.should.redirectTo(expectedRedirectUrl);

          done();
        })
    }

    it('should refuse empty firstnames', function(done) {
      const patientId = '67687f5a-b9cf-4023-9258-fa72d8f1b4b3'
      shouldFailUpdatePatientInputValidation(done, {
        'patientid': patientId,
        // no firstnames
        'lastname': 'Nom',
        'ine': '1234567890A',
      },
      '/psychologue/modifier-patient?patientid=' + patientId)
    })

    it('should refuse empty lastname', function(done) {
      const patientId = '67687f5a-b9cf-4023-9258-fa72d8f1b4b3'
      shouldFailUpdatePatientInputValidation(done, {
        'patientid': patientId,
        'firstnames': 'Blou Blou',
        // no lastname
        'ine': '1234567890A',
      },
      '/psychologue/modifier-patient?patientid=' + patientId)
    })

    it('should refuse whitespace firstnames', function(done) {
      const patientId = '67687f5a-b9cf-4023-9258-fa72d8f1b4b3'
      shouldFailUpdatePatientInputValidation(done, {
        'patientid': patientId,
        'firstnames': '   ',
        'lastname': 'Nom',
        'ine': '1234567890A',
      },
      '/psychologue/modifier-patient?patientid=' + patientId)
    })

    it('should refuse whitespace lastname', function(done) {
      const patientId = '67687f5a-b9cf-4023-9258-fa72d8f1b4b3'
      shouldFailUpdatePatientInputValidation(done, {
        'patientid': patientId,
        'firstnames': 'Blou Blou',
        'lastname': '   ',
        'ine': '1234567890A',
      },
      '/psychologue/modifier-patient?patientid=' + patientId)
    })

    it('should refuse ine with length not 11 chars', function(done) {
      const patientId = '67687f5a-b9cf-4023-9258-fa72d8f1b4b3'
      shouldFailUpdatePatientInputValidation(done, {
        'patientid': patientId,
        'firstnames': 'Blou Blou',
        'lastname': 'Nom',
        'ine': '1234567890AA',
      },
      '/psychologue/modifier-patient?patientid=' + patientId)
    })

    it('should refuse ine with non-aphanumeric chars', function(done) {
      const patientId = '67687f5a-b9cf-4023-9258-fa72d8f1b4b3'
      shouldFailUpdatePatientInputValidation(done, {
        'patientid': patientId,
        'firstnames': 'Blou Blou',
        'lastname': 'Nom',
        'ine': '1234567890à',
      },
      '/psychologue/modifier-patient?patientid=' + patientId)
    })

    it('should refuse if no patientid', function(done) {
      shouldFailUpdatePatientInputValidation(done, {
        'patientid': '',
        'firstnames': 'Blou Blou',
        'lastname': 'Nom',
        'ine': '1234567890à',
      },
      '/psychologue/mes-seances')
    })

    it('should refuse if patientid is not valid uuid', function(done) {
      shouldFailUpdatePatientInputValidation(done, {
        'patientid': 'not-a-valid-uuid',
        'firstnames': 'Blou Blou',
        'lastname': 'Nom',
        'ine': '1234567890à',
      },
      '/psychologue/mes-seances')
    })

    const shouldPassUpdatePatientInputValidation = (done, postData) => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'valid@valid.org',
      }

      chai.request(app)
        .post('/psychologue/api/modifier-patient')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy)}`)
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send(postData)
        .end((err, res) => {
          sinon.assert.called(updatePatientStub)
          res.should.redirectTo('/psychologue/mes-seances');
          done();
        })
    }

    it('should pass validation when all fields are correct', function(done) {
      shouldPassUpdatePatientInputValidation(done, {
        'patientid': '67687f5a-b9cf-4023-9258-fa72d8f1b4b3',
        'firstnames': 'Blou Blou',
        'lastname': 'Nom',
        'ine': '1234567890A',
      })
    })

    it('should pass validation when INE is missing', function(done) {
      shouldPassUpdatePatientInputValidation(done, {
        'patientid': '67687f5a-b9cf-4023-9258-fa72d8f1b4b3',
        'firstnames': 'Blou Blou',
        'lastname': 'Nom',
        'ine': '',
      })
    })
  })

})
