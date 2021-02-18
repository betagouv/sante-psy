/* eslint-disable func-names */
const app = require('../index')
const chai = require('chai')
const db = require('../utils/db')
const sinon = require('sinon')

describe('patientsController', function() {
  let insertPatientStub

  beforeEach(function(done) {
    insertPatientStub = sinon.stub(db, 'insertPatient')
      .returns(Promise.resolve())
    done()
  })

  afterEach(function(done) {
    insertPatientStub.restore()
    done()
  })

  it('should create patient', function(done) {
    chai.request(app)
      .post('/creer-nouveau-patient')
      .redirects(0) // block redirects, we don't want to test them
      .type('form')
      .send({
        "firstNames": 'Prenoms',
        "lastName": 'Nom',
        "INE": '12345',
      })
      .end((err, res) => {
        console.log(err)
        res.should.redirectTo('/mes-seances')
        sinon.assert.called(insertPatientStub)
        done()
      }).catch(done)
  })

  it('should refuse invalid firstname', function(done) {
    chai.request(app)
      .post('/creer-nouveau-patient')
      .redirects(0) // block redirects, we don't want to test them
      .type('form')
      .send({
        'firstNames': undefined,
        'lastName': 'Nom',
        'INE': '12345',
      })
      .end((err, res) => {
        res.should.redirectTo('/nouveau-patient')
        sinon.assert.notCalled(insertPatientStub)
        done()
      })
  })

  it('should refuse number type not string', function(done) {
    chai.request(app)
      .post('/creer-nouveau-patient')
      .redirects(0) // block redirects, we don't want to test them
      .type('form')
      .send({
        'firstNames': 'Prenoms',
        'lastName': 'Nom',
        'INE': 12345,
      })
      .end((err, res) => {
        res.should.redirectTo('/mes-seances')
        sinon.assert.called(insertPatientStub)
        done()
      })
  })
})
