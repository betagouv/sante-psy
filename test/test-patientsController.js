/* eslint-disable func-names */
const app = require('../index')
const chai = require('chai')
const dbPatients = require('../db/patients')
const sinon = require('sinon')

describe('patientsController', function() {
  describe('create patient', function() {
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
          sinon.assert.calledWith(insertPatientStub, prenoms, nom, INE);

          done();
        })
    })

    const shouldFailCreatePatientInputValidation = (done, postData) => {
      chai.request(app)
        .post('/creer-nouveau-patient')
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send(postData)
        .end((err, res) => {
          sinon.assert.notCalled(insertPatientStub)
          res.should.redirectTo('/nouveau-patient');

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
})
