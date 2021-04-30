/* eslint-disable func-names */
const app = require('../index')
const chai = require('chai')
const rewire = require('rewire')
const clean = require('./helper/clean')
const cookie = require('../utils/cookie')
const date = require('../utils/date')
const dashboardController = rewire('../controllers/dashboardController')
const dbAppointments = require('../db/appointments')
const dbPatients = require('../db/patients')
const format = require('../utils/format')

describe('dashboardController', function() {
  const dateOfBirth = date.parseDateForm('20/01/1980')
  describe('hasFolderCompleted', function() {
    let patient
    beforeEach( function() {
      patient =  {
        firstNames : "firstNames",
        lastName : "lastName",
        dateOfBirth : dateOfBirth,
        INE : "INE",
        institutionName : "institutionName",
        isStudentStatusVerified : true,
        hasPrescription : true,
        psychologistId : "psychologistId",
        doctorName : "doctorName",
        doctorAddress : "30000 Nîmes",
        createdAt : date.parseDateForm('20/01/2000'),
      }
    })

    const hasFolderCompleted = dashboardController.__get__('hasFolderCompleted');
    it('should return true if patient has all needed info', function() {
      hasFolderCompleted(patient).should.equal(true);
    });

    it('should return true if INE is missing', function() {
      patient.INE=null;
      hasFolderCompleted(patient).should.equal(true);
    });


    it('should return true if dateOfBirth is missing', function() {
      patient.dateOfBirth=null;
      hasFolderCompleted(patient).should.equal(true);
    });

    it('should return false if doctor name is missing', function() {
      patient.doctorName=null;
      hasFolderCompleted(patient).should.equal(false);
    });

    it('should return false if isStudentStatusVerified is false', function() {
      patient.isStudentStatusVerified=false;
      hasFolderCompleted(patient).should.equal(false);
    });

    it('should return false if hasPrescription is false', function() {
      patient.hasPrescription=false;
      hasFolderCompleted(patient).should.equal(false);
    });

    it('should return false if doctorName is a only white spaces', function() {
      patient.doctorName="    ", // trim should work
      hasFolderCompleted(patient).should.equal(false);
    });
    it('should return false if doctorName is an empty string', function() {
      patient.doctorName="";
      hasFolderCompleted(patient).should.equal(false);
    });

    it('should return false if institutionName is a only white spaces', function() {
      patient.institutionName='    ';
      hasFolderCompleted(patient).should.equal(false);
    });

    it('should return false if doctorAddress is an empty string', function() {
      patient.doctorAddress='';
      hasFolderCompleted(patient).should.equal(false);
    });
    it('should return false if doctor adress is a only white spaces', function() {
      patient.doctorAddress='    ';
      hasFolderCompleted(patient).should.equal(false);
    });

    it('should return true if missing date of birth before createdAt deployement feature date', function() {
      patient.dateOfBirth=null,
      hasFolderCompleted(patient).should.equal(true);
    });

    it('should return false if missing date of birth before createdAt deployement feature date', function() {
      patient.dateOfBirth= null
      patient.createdAt= date.parseDateForm('20/05/2021')
      hasFolderCompleted(patient).should.equal(false);
    });

  });
  
  describe('display dashaboard', function() {
    beforeEach(async function(done) {
      done()
    })

    afterEach(async function() {
      await clean.cleanAllPatients()
      await clean.cleanAllAppointments()
      return Promise.resolve()
    })

    it('should display only my patients in dashboard', async function() {
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
        dateOfBirth,
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
        dateOfBirth,
      )

      return chai.request(app)
        .get('/psychologue/mes-seances')
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

    it('should display only my appointments in dashboard', async function() {
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
        dateOfBirth,
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
        dateOfBirth,
      )
      const myAppointment =
        await dbAppointments.insertAppointment(new Date('2021-03-01'), myPatient.id, psy.dossierNumber)
      const appointmentForAnotherPsy =
        await dbAppointments.insertAppointment(new Date('2021-12-12'), patientForAnotherPsy.id, anotherPsyId)

      return chai.request(app)
        .get('/psychologue/mes-seances')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy.dossierNumber)}`)
        .redirects(0) // block redirects, we don't want to test them
        .then(async (res) => {
          // My appointments are present
          chai.assert.include(res.text, date.formatFrenchDate(myAppointment.appointmentDate))

          // Other psy's patients are not listed
          chai.assert.notInclude(res.text, date.formatFrenchDate(appointmentForAnotherPsy.appointmentDate))

          return Promise.resolve()
        })
    })

  })
})