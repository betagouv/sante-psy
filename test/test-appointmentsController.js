/* eslint-disable func-names */
const app = require('../index')
const chai = require('chai')
const db = require('../utils/db')
const sinon = require('sinon')

describe('appointmentsController', function() {
  let insertAppointmentStub

  beforeEach(function(done) {
    insertAppointmentStub = sinon.stub(db, 'insertAppointment')
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
