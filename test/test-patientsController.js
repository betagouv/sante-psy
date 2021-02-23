/* eslint-disable func-names */
const app = require('../index')
const chai = require('chai')
const sinon = require('sinon')
const dbPatients = require('../db/patients')

describe('patientsController', function() {
  describe('create patient', function() {
    let insertPatientStub;

    beforeEach(async function() {
      insertPatientStub = sinon.stub(dbPatients, 'insertPatient')
        .returns(Promise.resolve([ {
          'firstNames': 'prenom',
          'lastName': 'nom',
          'INE': 'studentNumber'}
        ]))
      return Promise.resolve()
    })

    afterEach(async function() {
      insertPatientStub.restore()
      return Promise.resolve()
    })

    it('should create patient', function(done) {
      const prenoms = 'Prénom'
      const nom = 'Nom'
      const INE = '1234567'

      chai.request(app)
        .post('/creer-nouveau-patient')
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send({
          'firstnames': prenoms,
          'lastname': nom,
          'ine': INE,
        })
        .end((err, res) => {
          sinon.assert.called(insertPatientStub)
          res.should.redirectTo('/mes-seances');

          done();
        })
    })

    it('should refuse empty firstnames', function(done) {
      const nom = 'Nom'
      const INE = '1234567'

      chai.request(app)
        .post('/creer-nouveau-patient')
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send({
          // no firstnames
          'lastname': nom,
          'ine': INE,
        })
        .end((err, res) => {
          sinon.assert.notCalled(insertPatientStub)
          res.should.redirectTo('/nouveau-patient');

          done();
        })
    })
  })
})
