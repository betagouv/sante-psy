/* eslint-disable func-names */
const app = require('../index')
const chai = require('chai')
const clean = require('./helper/clean')
const dbPatients = require('../db/patients')
const { expect } = require('chai')

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
      const prenoms = 'Prénom'
      const nom = 'Nom'
      const studentNumber = '1234567'
      console.log('TATATATAT')
      return chai.request(app)
        .post('/creer-nouveau-patient')
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send({
          'firstNames': prenoms,
          'lastName': nom,
          'INE': studentNumber,
        })
        .then(async (res) => {
          console.log("ICICICI")
          res.should.redirectTo('/mes-seances')

          const patientArray = await dbPatients.getPatients()
          expect(patientArray).to.have.length(0)

          return Promise.resolve()
        })
    })
  })
})
