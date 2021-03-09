/* eslint-disable func-names */
const app = require('../index')
const chai = require('chai')
const clean = require('./helper/clean')
const cookie = require('../utils/cookie')
const dbDoctors = require('../db/doctors')
const { expect } = require('chai')
const sinon = require('sinon')

const psychologistId = "34e6352f-bdd0-48ce-83de-8de71cad295b";
const firstNames = "Sigmund"
const lastName = "Freud"
const address = "7 Rue Rose"
const city = "Bordeaux"
const postalCode = "33300"
const phone = "0600000000"

const makeDoctor = async (psychologistId) => {
  const doctor = await dbDoctors.insertDoctor(psychologistId, firstNames, lastName,address,city, postalCode, phone)
  // Check doctor is inserted
  const createdDoctor = await dbDoctors.getDoctorById(doctor.id, psychologistId)
  chai.assert(!!createdDoctor)
  return doctor
}

describe('doctorsController', function() {
  describe('create doctor', function() {
    beforeEach(async function(done) {
      done()
    })

    afterEach(async function() {
      await clean.cleanDataDoctors()
      return Promise.resolve()
    })

    it('should create doctor', async function() {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      }

      return chai.request(app)
        .post('/psychologue/api/creer-nouveau-medecin')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy)}`)
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send({
          lastname: lastName,
          firstnames: firstNames,
          phone: phone,
          address: '6 rue du four',
          city: 'Amiens',
          postalcode: '80000',
        })
        .then(async (res) => {
          res.should.redirectTo('/psychologue/mes-seances')

          const doctorsArray = await dbDoctors.getDoctorsByPsychologist(psy.dossierNumber)
          doctorsArray.length.should.equal(1)
          expect(doctorsArray[0].psychologistId).to.equal(psy.dossierNumber)
          return Promise.resolve()
        })
    })

    it('should not create doctor if user is not logged in', async function() {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      }

      return chai.request(app)
        .post('/psychologue/api/creer-nouveau-medecin')
        // no auth cookie
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send({
          lastname: lastName,
          firstnames: firstNames,
          phone: phone,
          address: '6 rue du four',
          city: 'Amiens',
          postalcode: '80000',
        })
        .then(async (res) => {
          res.should.redirectTo('/psychologue/login')

          // Doctor not created
          const doctorsArray = await dbDoctors.getDoctorsByPsychologist(psy.dossierNumber)
          expect(doctorsArray).to.have.length(0)

          return Promise.resolve()
        })
    })
  })

  describe('create doctor input validation', function() {
    let insertDoctorStub;

    beforeEach(async function() {
      insertDoctorStub = sinon.stub(dbDoctors, 'insertDoctor')
        .returns(Promise.resolve([ {
          'firstnames': 'prenom',
          'lastname': 'nom',
          'address': '6 rue du four',
          'city': 'Amiens',
          'postalcode': '80000'
        }
        ]))
      return Promise.resolve()
    })

    afterEach(async function() {
      insertDoctorStub.restore()
      return Promise.resolve()
    })

    const shouldFailCreateDoctorInputValidation = (done, postData) => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      }

      chai.request(app)
        .post('/psychologue/api/creer-nouveau-medecin')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy)}`)
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send(postData)
        .end((err, res) => {
          sinon.assert.notCalled(insertDoctorStub)
          res.should.redirectTo('/psychologue/nouveau-medecin');

          done();
        })
    }

    it('should refuse empty firstnames', function(done) {
      shouldFailCreateDoctorInputValidation(done, {
        // no firstnames
        'lastname': 'Nom',
        'phone': '0600000000',
        'address': '6 rue du four',
        'city': 'Amiens',
        'postalcode': '80000'
      })
    })

    it('should refuse empty lastname', function(done) {
      shouldFailCreateDoctorInputValidation(done, {
        // no lastname
        'firstnames': 'prénom',
        'address': '6 rue du four',
        'city': 'Amiens',
        'postalcode': '80000'
      })
    })

    it('should refuse whitespace firstnames', function(done) {
      shouldFailCreateDoctorInputValidation(done, {
        'firstnames': '   ',
        'lastname': 'Nom',
        'phone': '0600000000',
        'address': '6 rue du four',
        'city': 'Amiens',
        'postalcode': '80000'
      })
    })

    it('should refuse whitespace lastname', function(done) {
      shouldFailCreateDoctorInputValidation(done, {
        'firstnames': 'Blou Blou',
        'lastname': '   ',
        'address': '6 rue du four',
        'city': 'Amiens',
        'postalcode': '80000'
      })
    })

    it('should refuse postalCode with length not 5 chars', function(done) {
      shouldFailCreateDoctorInputValidation(done, {
        'firstnames': 'Blou Blou',
        'lastname': 'Nom',
        'phone': '0600000000',
        'address': '6 rue du four',
        'city': 'Amiens',
        'postalCode': '800009'
      })
    })

    it('should refuse ine with non-aphanumeric chars', function(done) {
      shouldFailCreateDoctorInputValidation(done, {
        'firstnames': 'Blou Blou',
        'lastname': 'Nom',
        'phone': '0600000000',
        'address': '6 rue du four',
        'city': 'Amiens',
        'postalCode': 'ààààà',
      })
    })

    const shouldPassCreateDoctorInputValidation = (done, postData) => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'valid@valid.org',
      }

      chai.request(app)
        .post('/psychologue/api/creer-nouveau-medecin')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy)}`)
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send(postData)
        .end((err, res) => {
          sinon.assert.called(insertDoctorStub)
          res.should.redirectTo('/psychologue/mes-seances');
          done();
        })
    }

    it('should pass validation when all fields are correct', function(done) {
      shouldPassCreateDoctorInputValidation(done, {
        'firstnames': 'Blou Blou',
        'lastname': 'Nom',
        'phone': '0600000000',
        'address': '6 rue du four',
        'city': 'Amiens',
        'postalcode': '80000'
      })
    })

    it('should pass validation when address is missing', function(done) {
      shouldPassCreateDoctorInputValidation(done, {
        'firstnames': 'Blou Blou',
        'lastname': 'Nom',
        'phone': '0600000000',
        'address': '',
        'city': 'Amiens',
        'postalcode': '80000',
      })
    })
  })

  describe('display update doctor form', function() {
    beforeEach(async function(done) {
      done()
    })

    afterEach(async function() {
      await clean.cleanDataDoctors()
      return Promise.resolve()
    })

    it('should display form for my doctor', async function() {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'valid@valid.org',
      }
      const myDoctor = await makeDoctor(psy.dossierNumber)

      return chai.request(app)
        .get('/psychologue/modifier-medecin?doctorid=' + myDoctor.id)
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy)}`)
        .redirects(0) // block redirects, we don't want to test them
        .then(async (res) => {
          expect(res.status).to.equal(200)

          // The page displays myDoctor
          chai.assert.include(res.text, myDoctor.firstNames)
          chai.assert.include(res.text, myDoctor.lastName)
          chai.assert.include(res.text, myDoctor.id)

          return Promise.resolve()
        })
    })

    it('should not display form if it is not my doctor', async function() {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'valid@valid.org',
      }
      const anotherPsyId = 'e43b8668-621d-40a7-86e0-c563b6b05509'
      const notMyDoctor = await makeDoctor(anotherPsyId)

      return chai.request(app)
        .get('/psychologue/modifier-medecin?doctorid=' + notMyDoctor.id)
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy)}`)
        .redirects(0) // block redirects, we don't want to test them
        .then(async (res) => {
          res.should.redirectTo('/psychologue/mes-seances')

          // The page does not display doctor
          chai.assert.notInclude(res.text, notMyDoctor.firstNames)
          chai.assert.notInclude(res.text, notMyDoctor.lastName)
          chai.assert.notInclude(res.text, notMyDoctor.id)

          return Promise.resolve()
        })
    })

    it('should not display form if uuid is not valid', async function() {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'valid@valid.org',
      }

      return chai.request(app)
        .get('/psychologue/modifier-medecin?doctorid=' + 'not-a-valid-uuid')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy)}`)
        .redirects(0) // block redirects, we don't want to test them
        .then(async (res) => {
          res.should.redirectTo('/psychologue/mes-seances')

          return Promise.resolve()
        })
    })
  })

  describe('update doctor', function() {
    beforeEach(async function(done) {
      done()
    })

    afterEach(async function() {
      await clean.cleanDataDoctors()
      return Promise.resolve()
    })

    it('should update doctor', async function() {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      }
      const doctor = await makeDoctor(psy.dossierNumber)
      const updatedPostalCode = '30000'
      return chai.request(app)
        .post('/psychologue/api/modifier-medecin')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy)}`)
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send({
          doctorid: doctor.id,
          lastname: 'Lovelacekkk',
          firstnames: 'Adakkk',
          address: '6 rue du four',
          city: 'Amiens',
          postalcode: updatedPostalCode,
        })
        .then(async (res) => {
          res.should.redirectTo('/psychologue/mes-seances')

          const doctorsArray = await dbDoctors.getDoctorsByPsychologist(psy.dossierNumber)
          expect(doctorsArray).to.have.length(1)
          expect(doctorsArray[0].psychologistId).to.equal(psy.dossierNumber)
          expect(doctorsArray[0].lastName).to.equal('Lovelacekkk')
          expect(doctorsArray[0].firstNames).to.equal('Adakkk')
          expect(doctorsArray[0].postalCode).to.equal(updatedPostalCode)

          return Promise.resolve()
        })
    })

    it('should not update doctor if it is not mine', async function() {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      }
      const anotherPsyId = '495614e8-89af-4406-ba02-9fc038b991f9'
      const doctor = await makeDoctor(anotherPsyId)
      const updatedPostalCode = '30000'
      return chai.request(app)
        .post('/psychologue/api/modifier-medecin')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy)}`)
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send({
          doctorid: doctor.id,
          lastname: 'Lovelacekkk',
          firstnames: 'Adakkk',
          address: '6 rue du four',
          city: 'Amiens',
          postalcode: updatedPostalCode,
        })
        .then(async (res) => {
          res.should.redirectTo('/psychologue/mes-seances')

          // Doctor was not updated
          const doctorsArray = await dbDoctors.getDoctorsByPsychologist(anotherPsyId)
          expect(doctorsArray).to.have.length(1)
          expect(doctorsArray[0].psychologistId).to.equal(anotherPsyId)
          expect(doctorsArray[0].lastName).to.equal(doctor.lastName)
          expect(doctorsArray[0].firstNames).to.equal(doctor.firstNames)
          expect(doctorsArray[0].postalCode).to.equal(doctor.postalCode)

          return Promise.resolve()
        })
    })

    it('should not update doctor if user is not logged in', async function() {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      }
      const doctor = await makeDoctor(psy.dossierNumber)

      return chai.request(app)
        .post('/psychologue/api/modifier-medecin')
        // no auth cookie
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send({
          doctorid: doctor.id,
          lastname: 'Lovelacekkk',
          firstnames: 'Adakkk',
          address: '6 rue du four 80000 Amiens',
          city: 'Amiens',
          postalCode: '80000'
        })
        .then(async (res) => {
          res.should.redirectTo('/psychologue/login')

          // Doctor was not updated
          const doctorsArray = await dbDoctors.getDoctorsByPsychologist(psy.dossierNumber)
          expect(doctorsArray).to.have.length(1)
          expect(doctorsArray[0].psychologistId).to.equal(psy.dossierNumber)
          expect(doctorsArray[0].lastName).to.equal(doctor.lastName)
          expect(doctorsArray[0].firstNames).to.equal(doctor.firstNames)
          expect(doctorsArray[0].postalCode).to.equal(doctor.postalCode)

          return Promise.resolve()
        })
    })

  })

  describe('update doctor input validation', function() {
    let updateDoctorStub;

    beforeEach(async function() {
      updateDoctorStub = sinon.stub(dbDoctors, 'updateDoctor')
      return Promise.resolve()
    })

    afterEach(async function() {
      updateDoctorStub.restore()
      return Promise.resolve()
    })

    const shouldFailUpdateDoctorInputValidation = (done, postData, expectedRedirectUrl) => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'valid@valid.org',
      }

      chai.request(app)
        .post('/psychologue/api/modifier-medecin')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy)}`)
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send(postData)
        .end((err, res) => {
          sinon.assert.notCalled(updateDoctorStub)
          res.should.redirectTo(expectedRedirectUrl);

          done();
        })
    }

    it('should refuse empty firstnames', function(done) {
      const doctorId = '67687f5a-b9cf-4023-9258-fa72d8f1b4b3'
      shouldFailUpdateDoctorInputValidation(done, {
        'doctorid': doctorId,
        // no firstnames
        'lastname': 'Nom',
        'phone': '0600000000',
        'address': '6 rue du four',
        'city': 'Amiens',
        'postalcode': '80000'
      },
      '/psychologue/modifier-medecin?doctorid=' + doctorId)
    })

    it('should refuse empty lastname', function(done) {
      const doctorId = '67687f5a-b9cf-4023-9258-fa72d8f1b4b3'
      shouldFailUpdateDoctorInputValidation(done, {
        'doctorid': doctorId,
        'firstnames': 'Blou Blou',
        // no lastname
        'address': '6 rue du four',
        'city': 'Amiens',
        'postalcode': '80000'
      },
      '/psychologue/modifier-medecin?doctorid=' + doctorId)
    })

    it('should refuse whitespace firstnames', function(done) {
      const doctorId = '67687f5a-b9cf-4023-9258-fa72d8f1b4b3'
      shouldFailUpdateDoctorInputValidation(done, {
        'doctorid': doctorId,
        'firstnames': '   ',
        'lastname': 'Nom',
        'phone': '0600000000',
        'address': '6 rue du four',
        'city': 'Amiens',
        'postalcode': '80000'
      },
      '/psychologue/modifier-medecin?doctorid=' + doctorId)
    })

    it('should refuse whitespace lastname', function(done) {
      const doctorId = '67687f5a-b9cf-4023-9258-fa72d8f1b4b3'
      shouldFailUpdateDoctorInputValidation(done, {
        'doctorid': doctorId,
        'firstnames': 'Blou Blou',
        'lastname': '   ',
        'address': '6 rue du four',
        'city': 'Amiens',
        'postalcode': '80000'
      },
      '/psychologue/modifier-medecin?doctorid=' + doctorId)
    })

    it('should refuse ine with length not 11 chars', function(done) {
      const doctorId = '67687f5a-b9cf-4023-9258-fa72d8f1b4b3'
      shouldFailUpdateDoctorInputValidation(done, {
        'doctorid': doctorId,
        'firstnames': 'Blou Blou',
        'lastname': 'Nom',
        'phone': '0600000000',
        'ine': '1234567890AA',
      },
      '/psychologue/modifier-medecin?doctorid=' + doctorId)
    })

    it('should refuse ine with non-aphanumeric chars', function(done) {
      const doctorId = '67687f5a-b9cf-4023-9258-fa72d8f1b4b3'
      shouldFailUpdateDoctorInputValidation(done, {
        'doctorid': doctorId,
        'firstnames': 'Blou Blou',
        'lastname': 'Nom',
        'phone': '0600000000',
        'ine': '1234567890à',
      },
      '/psychologue/modifier-medecin?doctorid=' + doctorId)
    })

    it('should refuse if no doctorid', function(done) {
      shouldFailUpdateDoctorInputValidation(done, {
        'doctorid': '',
        'firstnames': 'Blou Blou',
        'lastname': 'Nom',
        'phone': '0600000000',
        'ine': '1234567890à',
      },
      '/psychologue/mes-seances')
    })

    it('should refuse if doctorid is not valid postal code', function(done) {
      shouldFailUpdateDoctorInputValidation(done, {
        'doctorid': 'not-a-valid-uuid',
        'firstnames': 'Blou Blou',
        'lastname': 'Nom',
        'phone': '0600000000',
        'address': '6 rue du four',
        'city': 'Amiens',
        'postalcode': 'xxxxxx'
      },
      '/psychologue/mes-seances')
    })

    const shouldPassUpdateDoctorInputValidation = (done, postData) => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'valid@valid.org',
      }

      chai.request(app)
        .post('/psychologue/api/modifier-medecin')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy)}`)
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send(postData)
        .end((err, res) => {
          sinon.assert.called(updateDoctorStub)
          res.should.redirectTo('/psychologue/mes-seances');
          done();
        })
    }

    it('should pass validation when all fields are correct', function(done) {
      shouldPassUpdateDoctorInputValidation(done, {
        'doctorid': '67687f5a-b9cf-4023-9258-fa72d8f1b4b3',
        'firstnames': 'Blou Blou',
        'lastname': 'Nom',
        'phone': '0600000000',
        'address': '6 rue du four',
        'city': 'Amiens',
        'postalcode': '80000'
      })
    })
  })

})
