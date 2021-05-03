/* eslint-disable func-names */
const app = require('../index');
const chai = require('chai');
const rewire = require('rewire');
const clean = require('./helper/clean');
const cookie = require('../utils/cookie');
const date = require('../utils/date');

const dashboardController = rewire('../controllers/dashboardController');
const dbAppointments = require('../db/appointments');
const dbPatients = require('../db/patients');

describe('dashboardController', () => {
  const dateOfBirth = date.parseDateForm('20/01/1980');
  describe('hasFolderCompleted', () => {
    let patient;
    beforeEach(() => {
      patient = {
        firstNames: 'firstNames',
        lastName: 'lastName',
        dateOfBirth,
        INE: 'INE',
        institutionName: 'institutionName',
        isStudentStatusVerified: true,
        hasPrescription: true,
        psychologistId: 'psychologistId',
        doctorName: 'doctorName',
        doctorAddress: '30000 Nîmes',
        createdAt: date.parseDateForm('20/01/2000'),
      };
    });

    const hasFolderCompleted = dashboardController.__get__('hasFolderCompleted');
    it('should return true if patient has all needed info', () => {
      const { folderCompleted, missingInfo } = hasFolderCompleted(patient);

      missingInfo.should.equal('');
      folderCompleted.should.equal(true);
    });

    it('should return true if INE is missing', () => {
      patient.INE = null;
      const { folderCompleted, missingInfo } = hasFolderCompleted(patient);
      missingInfo.should.equal('');
      folderCompleted.should.equal(true);
    });

    it('should return false if doctor name is missing', () => {
      patient.doctorName = null;
      const { folderCompleted, missingInfo } = hasFolderCompleted(patient);
      missingInfo.should.equal('nom du docteur');
      folderCompleted.should.equal(false);
    });

    it('should return false if isStudentStatusVerified is false', () => {
      patient.isStudentStatusVerified = false;
      const { folderCompleted, missingInfo } = hasFolderCompleted(patient);
      missingInfo.should.equal('statut étudiant');
      folderCompleted.should.equal(false);
    });

    it('should return false if hasPrescription is false', () => {
      patient.hasPrescription = false;
      const { folderCompleted, missingInfo } = hasFolderCompleted(patient);
      missingInfo.should.equal('orientation médicale');
      folderCompleted.should.equal(false);
    });

    it('should return false if doctorName is a only white spaces', () => {
      patient.doctorName = '    ';// trim should work
      const { folderCompleted, missingInfo } = hasFolderCompleted(patient);
      missingInfo.should.equal('nom du docteur');
      folderCompleted.should.equal(false);
    });
    it('should return false if doctorName is an empty string', () => {
      patient.doctorName = '';
      const { folderCompleted, missingInfo } = hasFolderCompleted(patient);
      missingInfo.should.equal('nom du docteur');
      folderCompleted.should.equal(false);
    });

    it('should return false if institutionName is a only white spaces', () => {
      patient.institutionName = '    ';
      const { folderCompleted, missingInfo } = hasFolderCompleted(patient);
      missingInfo.should.equal('établissement scolaire');
      folderCompleted.should.equal(false);
    });

    it('should return false if doctorAddress is an empty string', () => {
      patient.doctorAddress = '';
      const { folderCompleted, missingInfo } = hasFolderCompleted(patient);
      missingInfo.should.equal('adresse du docteur');
      folderCompleted.should.equal(false);
    });
    it('should return false if doctor adress is a only white spaces', () => {
      patient.doctorAddress = '    ';
      const { folderCompleted, missingInfo } = hasFolderCompleted(patient);
      missingInfo.should.equal('adresse du docteur');
      folderCompleted.should.equal(false);
    });

    it('should return true if missing date of birth with createdAt before deployement feature date', () => {
      patient.dateOfBirth = null;
      const { folderCompleted, missingInfo } = hasFolderCompleted(patient);
      missingInfo.should.equal('');
      folderCompleted.should.equal(true);
    });

    it('should return false if missing date of birth with createdAt after deployement feature date', () => {
      patient.dateOfBirth = null;
      patient.createdAt = date.parseDateForm('20/05/2021');
      const { folderCompleted, missingInfo } = hasFolderCompleted(patient);
      missingInfo.should.equal('date de naissance');
      folderCompleted.should.equal(false);
    });
  });

  describe('display dashboard', () => {
    beforeEach(async (done) => {
      done();
    });

    afterEach(async () => {
      await clean.cleanAllPatients();
      await clean.cleanAllAppointments();
      return Promise.resolve();
    });

    it('should display only my patients in dashboard', async () => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      };
      const anotherPsyId = '60014566-d8bf-4f01-94bf-27b31ca9275d';
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
      );
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
      );

      return chai.request(app)
        .get('/psychologue/mes-seances')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy.dossierNumber)}`)
        .redirects(0) // block redirects, we don't want to test them
        .then(async (res) => {
          // My patients are present
          chai.assert.include(res.text, myPatient.firstNames);
          chai.assert.include(res.text, myPatient.lastName);

          // Other psy's patients are not listed
          chai.assert.notInclude(res.text, patientForAnotherPsy.firstNames);
          chai.assert.notInclude(res.text, patientForAnotherPsy.lastName);
          return Promise.resolve();
        });
    });

    it('should display only my appointments in dashboard', async () => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      };
      const anotherPsyId = '60014566-d8bf-4f01-94bf-27b31ca9275d';
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
      );
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
      );
      const myAppointment = await dbAppointments.insertAppointment(
        new Date('2021-03-01'),
        myPatient.id,
        psy.dossierNumber,
      );
      const appointmentForAnotherPsy = await dbAppointments.insertAppointment(
        new Date('2021-12-12'),
        patientForAnotherPsy.id,
        anotherPsyId,
      );

      return chai.request(app)
        .get('/psychologue/mes-seances')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy.dossierNumber)}`)
        .redirects(0) // block redirects, we don't want to test them
        .then(async (res) => {
          // My appointments are present
          chai.assert.include(res.text, date.formatFrenchDate(myAppointment.appointmentDate));

          // Other psy's patients are not listed
          chai.assert.notInclude(res.text, date.formatFrenchDate(appointmentForAnotherPsy.appointmentDate));

          return Promise.resolve();
        });
    });
  });
});
