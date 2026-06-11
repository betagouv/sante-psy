import chai, { expect } from 'chai';
import sinon from 'sinon';
import app from '../../index';
import clean from '../helper/clean';
import create from '../helper/create';
import dbAppointments from '../../db/appointments';
import dbPatients from '../../db/patients';
import dbPsychologists from '../../db/psychologists';
import cookie from '../../utils/cookie';
import { Psychologist } from '../../types/Psychologist';
import appointmentBadges from '../../utils/badges';
import dateUtils from '../../utils/date';
import { Patient } from '../../types/Patient';
import {
  ERROR_MESSAGE_APPOINTMENT_AFTER_TODAY,
  ERROR_MESSAGE_APPOINTMENT_BEFORE_INSCRIPTION,
  ERROR_MESSAGE_APPOINTMENT_BEFORE_LAST_MONTH,
  ERROR_MESSAGE_APPOINTMENT_TOO_MANY_APPOINTMENTS,
} from '../../controllers/appointmentsController';

const postAppointment = ({
  psyId = null,
  patientId,
  date,
  renewal = false,
}) => {
  let req = chai.request(app).post('/api/appointments');

  if (psyId) {
    req = req.set(
      'Cookie',
      `token=${cookie.getJwtTokenForUser(psyId, 'randomXSRFToken', 'psy')}`,
    );
  }
  req = req.set('xsrf-token', 'randomXSRFToken');

  return req.send({ patientId, date, renewal });
};

const confirmResError = async (res, psyId = null, errorMessage = '') => {
  res.status.should.equal(400);
  res.body.message.should.equal(errorMessage);

  if (psyId) {
    const appointmentArray = await dbAppointments.getAll(psyId);
    expect(appointmentArray).to.have.length(0);
  }
};

async function insertPatientInfoInDb(patient1: Patient, psy: Psychologist) {
  return dbPatients.insert(
    patient1.firstNames,
    patient1.lastName,
    patient1.dateOfBirth,
    patient1.gender,
    patient1.INE,
    patient1.isINESvalid,
    patient1.email,
    patient1.institutionName,
    patient1.isStudentStatusVerified,
    psy.dossierNumber,
    patient1.doctorName,
  );
}

describe('appointmentsController', () => {
  const dateOfBirth = new Date('1980/01/20');
  const gender = 'female';
  const today = new Date();
  const validDate = new Date(today.getFullYear(), today.getMonth(), 1);

  async function patientInfoToInsert(psy) {
    return dbPatients.insert(
      'Ada',
      'Lovelace',
      dateOfBirth,
      gender,
      '12345678901',
      false,
      'patient@beta.fr',
      '42',
      false,
      psy.dossierNumber,
      'Dr Docteur',
    );
  }

  describe('create appointment', () => {
    let psy: Psychologist;
    before(async () => {
      psy = await create.insertOnePsy({ createdAt: new Date('2021-05-22') });
    });
    beforeEach(async () => {
      await clean.patients();
      await clean.appointments();
      return Promise.resolve();
    });

    afterEach(async () => {
      await clean.patients();
      await clean.appointments();
      return Promise.resolve();
    });

    it('should create appointments', async () => {
      const patient = await patientInfoToInsert(psy);

      const res = await postAppointment({
        psyId: psy.dossierNumber,
        patientId: patient.id,
        date: validDate,
      });

      const formattedDate = dateUtils.formatFrenchDate(validDate);
      res.status.should.equal(200);
      res.body.message.should.equal(
        `La séance du ${formattedDate} a bien été créée et l'étudiant en a été notifié par email.`,
      );

      const appointmentArray = await dbAppointments.getAll(psy.dossierNumber);
      expect(appointmentArray).to.have.length(1);
      expect(appointmentArray[0].psychologistId).to.equal(psy.dossierNumber);
    });

    it('should not create appointment if patient id is not linked to psy id', async () => {
      const psy = await create.insertOnePsy();
      const anotherPsy = await create.insertOnePsy({
        personalEmail: 'another@email.fr',
      });
      const patient = await patientInfoToInsert(anotherPsy);

      const res = await postAppointment({
        psyId: psy.dossierNumber,
        patientId: patient.id,
        date: validDate,
      });

      res.status.should.equal(500);
      res.body.message.should.equal(
        "Erreur. La séance n'est pas créée. Pourriez-vous réessayer ?",
      );

      // was not created because patient id is not linked to psy id
      const appointmentArray = await dbAppointments.getAll(psy.dossierNumber);
      expect(appointmentArray).to.have.length(0);
    });

    it('should not create appointment if user not logged in', async () => {
      const psy = await create.insertOnePsy();
      const patient = await patientInfoToInsert(psy);

      const res = await postAppointment({
        patientId: patient.id,
        date: validDate,
      });

      res.status.should.equal(401);

      // Appointment not created
      const appointmentArray = await dbAppointments.getAll(psy.dossierNumber);
      expect(appointmentArray).to.have.length(0);
    });

    it('should not create appointment if date is before first day of last month', async () => {
      const patient = await patientInfoToInsert(psy);

      const firstDayOfLastMonth = dateUtils.getFirstDayOfLastMonth();
      const invalidPastDate = new Date(
        firstDayOfLastMonth.setDate(firstDayOfLastMonth.getDate() - 1),
      );
      const res = await postAppointment({
        psyId: psy.dossierNumber,
        patientId: patient.id,
        date: invalidPastDate,
      });

      await confirmResError(
        res,
        psy.dossierNumber,
        ERROR_MESSAGE_APPOINTMENT_BEFORE_LAST_MONTH,
      );
    });

    it('should not create appointment in the future', async () => {
      const psy = await create.insertOnePsy();
      const patient = await patientInfoToInsert(psy);

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const res = await postAppointment({
        psyId: psy.dossierNumber,
        patientId: patient.id,
        date: tomorrow,
      });

      await confirmResError(
        res,
        psy.dossierNumber,
        ERROR_MESSAGE_APPOINTMENT_AFTER_TODAY,
      );
    });

    it('should not create appointment if date before psychologist creation date', async () => {
      const todayBeginningDate = new Date();
      const psy = await create.insertOnePsy({ createdAt: todayBeginningDate });
      const patient = await patientInfoToInsert(psy);

      const invalidDate = new Date(
        todayBeginningDate.setMonth(todayBeginningDate.getMonth() - 1),
      );

      const res = await postAppointment({
        psyId: psy.dossierNumber,
        patientId: patient.id,
        date: invalidDate,
      });

      await confirmResError(
        res,
        psy.dossierNumber,
        ERROR_MESSAGE_APPOINTMENT_BEFORE_INSCRIPTION,
      );
    });

    it('should not create appointment if student has 12 already (2 psys)', async () => {
      const aDayInSchoolYear = new Date(2026, 5, 10);
      const anotherDayInSchoolYear = '2026-05-10';
      const today = new Date();
      const twoYearsAgo = new Date(today.setFullYear(today.getFullYear() - 2));

      const psy1 = await create.insertOnePsy({ createdAt: twoYearsAgo });
      const psy2 = await create.insertOnePsy({ createdAt: twoYearsAgo });

      // 2 patients, same person
      const patient = create.getOnePatient(1, {
        psychologistId: psy1.dossierNumber,
      });
      const dbPatient1 = await insertPatientInfoInDb(patient, psy1);
      const dbPatient2 = await insertPatientInfoInDb(patient, psy2);

      // insert 6 appointments with both psys
      await Promise.all(
        Array.from({ length: 6 }, () =>
          create.insertOneAppointment({
            patientId: dbPatient1.id,
            psychologistId: psy1.dossierNumber,
            appointmentDate: anotherDayInSchoolYear,
          }),
        ),
      );

      await Promise.all(
        Array.from({ length: 6 }, () =>
          create.insertOneAppointment({
            patientId: dbPatient2.id,
            psychologistId: psy2.dossierNumber,
            appointmentDate: anotherDayInSchoolYear,
          }),
        ),
      );

      // student should have 12 appointments in total
      const appointmentsPatient = await dbAppointments.getByPatientId(
        dbPatient1.id,
        true,
      );
      appointmentsPatient.length.should.equal(12);

      // adding a new appointment should fail
      const res = await postAppointment({
        psyId: psy1.dossierNumber,
        patientId: dbPatient1.id,
        date: aDayInSchoolYear,
      });
      await confirmResError(
        res,
        null,
        ERROR_MESSAGE_APPOINTMENT_TOO_MANY_APPOINTMENTS,
      );
    });

    it('ok if student has 12 already (2 psys) but 1 from previous school year', async () => {
      const aDayInSchoolYear = new Date(2026, 5, 10);
      const anotherDayInSchoolYear = '2026-05-10';
      const aDayFromPreviousSchoolYear = '2025-08-27';
      const today = new Date();
      const twoYearsAgo = new Date(today.setFullYear(today.getFullYear() - 2));

      const psy1 = await create.insertOnePsy({ createdAt: twoYearsAgo });
      const psy2 = await create.insertOnePsy({ createdAt: twoYearsAgo });

      // 2 patients, same person
      const patient = create.getOnePatient(1, {
        psychologistId: psy1.dossierNumber,
      });
      const dbPatient1 = await insertPatientInfoInDb(patient, psy1);
      const dbPatient2 = await insertPatientInfoInDb(patient, psy2);

      // insert 6 appointments with both psys
      await Promise.all(
        Array.from({ length: 6 }, () =>
          create.insertOneAppointment({
            patientId: dbPatient1.id,
            psychologistId: psy1.dossierNumber,
            appointmentDate: anotherDayInSchoolYear,
          }),
        ),
      );

      await Promise.all(
        Array.from({ length: 5 }, () =>
          create.insertOneAppointment({
            patientId: dbPatient2.id,
            psychologistId: psy2.dossierNumber,
            appointmentDate: anotherDayInSchoolYear,
          }),
        ),
      );
      await create.insertOneAppointment({
        patientId: dbPatient2.id,
        psychologistId: psy2.dossierNumber,
        appointmentDate: aDayFromPreviousSchoolYear,
      });

      // student should have 12 appointments in total
      const appointmentsPatient = await dbAppointments.getByPatientId(
        dbPatient1.id,
        true,
      );
      appointmentsPatient.length.should.equal(12);

      // adding a new appointment should fail
      const res = await postAppointment({
        psyId: psy1.dossierNumber,
        patientId: dbPatient1.id,
        date: aDayInSchoolYear,
      });
      res.status.should.equal(200);
    });
  });

  describe('create appointment - input validation', () => {
    let insertAppointmentStub;

    beforeEach(async () => {
      await clean.patients();
      insertAppointmentStub = sinon
        .stub(dbAppointments, 'insert')
        .returns(Promise.resolve());

      return Promise.resolve();
    });

    afterEach(async () => {
      await clean.patients();
      insertAppointmentStub.restore();
      return Promise.resolve();
    });

    it('should refuse invalid patientId', (done) => {
      chai
        .request(app)
        .post('/api/appointments')
        .set(
          'Cookie',
          `token=${cookie.getJwtTokenForUser('prenom.nom@beta.gouv.fr', 'randomXSRFToken', 'psy')}`,
        )
        .set('xsrf-token', 'randomXSRFToken')
        .send({
          patientId: 'not-a-uuid',
          date: validDate,
          renewal: false,
        })
        .end((err, res) => {
          res.status.should.equal(400);
          res.body.message.should.equal(
            'Vous devez spécifier un patient pour la séance.',
          );

          sinon.assert.notCalled(insertAppointmentStub);
          done();
        });
    });

    it('should refuse empty patientId', (done) => {
      chai
        .request(app)
        .post('/api/appointments')
        .set(
          'Cookie',
          `token=${cookie.getJwtTokenForUser('prenom.nom@beta.gouv.fr', 'randomXSRFToken', 'psy')}`,
        )
        .set('xsrf-token', 'randomXSRFToken')
        .send({
          // no patientId
          date: validDate,
          renewal: false,
        })
        .end((err, res) => {
          res.status.should.equal(400);
          res.body.message.should.equal(
            'Vous devez spécifier un patient pour la séance.',
          );

          sinon.assert.notCalled(insertAppointmentStub);
          done();
        });
    });

    it('should refuse invalid date', (done) => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      };
      chai
        .request(app)
        .post('/api/appointments')
        .set(
          'Cookie',
          `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken', 'psy')}`,
        )
        .set('xsrf-token', 'randomXSRFToken')
        .send({
          patientId: '052d3a16-7042-4f93-9fc0-2049e5fdae79',
          date: '09/02/2021',
          renewal: false,
        })
        .end((err, res) => {
          res.status.should.equal(400);
          res.body.message.should.equal(
            'Vous devez spécifier une date pour la séance.',
          );

          sinon.assert.notCalled(insertAppointmentStub);
          done();
        });
    });

    it('should refuse empty date', (done) => {
      chai
        .request(app)
        .post('/api/appointments')
        .set(
          'Cookie',
          `token=${cookie.getJwtTokenForUser('prenom.nom@beta.gouv.fr', 'randomXSRFToken', 'psy')}`,
        )
        .set('xsrf-token', 'randomXSRFToken')
        .send({
          patientId: '052d3a16-7042-4f93-9fc0-2049e5fdae79',
          // no date
          renewal: false,
        })
        .end((err, res) => {
          res.status.should.equal(400);
          res.body.message.should.equal(
            'Vous devez spécifier une date pour la séance.',
          );
          sinon.assert.notCalled(insertAppointmentStub);
          done();
        });
    });
  });

  describe('delete appointment', () => {
    beforeEach(async () => {
      await clean.patients();
      await clean.appointments();
      return Promise.resolve();
    });

    afterEach(async () => {
      await clean.patients();
      await clean.appointments();
      return Promise.resolve();
    });

    const makeAppointment = async (psychologistId) => {
      const psy = create.getOnePsy();
      psy.dossierNumber = psychologistId;
      await dbPsychologists.upsertMany([psy]);
      // Insert an appointment and a patient
      const patient = await dbPatients.insert(
        'Ada',
        'Lovelace',
        dateOfBirth,
        gender,
        '12345678901',
        false,
        'patient@beta.fr',
        '42',
        false,
        psychologistId,
        'Dr Docteur',
      );
      const appointment = await dbAppointments.insert(
        new Date(),
        patient.id,
        psychologistId,
      );
      // Check appointment is inserted
      const appointmentArray = await dbAppointments.getAll(psychologistId);
      expect(appointmentArray).to.have.length(1);
      return appointment;
    };

    it('should delete appointment', async () => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      };

      const appointment = await makeAppointment(psy.dossierNumber);

      return chai
        .request(app)
        .delete(`/api/appointments/${appointment.id}`)
        .set(
          'Cookie',
          `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken', 'psy')}`,
        )
        .set('xsrf-token', 'randomXSRFToken')
        .then(async (res) => {
          res.status.should.equal(200);
          res.body.message.should.equal('La séance a bien été supprimée.');

          const appointmentArray = await dbAppointments.getAll(
            psy.dossierNumber,
          );
          expect(appointmentArray).to.have.length(0);

          return Promise.resolve();
        });
    });

    it('should not delete appointment if it is not mine', async () => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      };
      const anotherPsyId = 'ccb6f32b-8c55-4322-8ecc-556e6900b4ea';
      const appointment = await makeAppointment(anotherPsyId);

      return chai
        .request(app)
        .delete(`/api/appointments/${appointment.id}`)
        .set(
          'Cookie',
          `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken', 'psy')}`,
        )
        .set('xsrf-token', 'randomXSRFToken')
        .then(async (res) => {
          res.status.should.equal(404);
          res.body.message.should.equal(
            'Impossible de supprimer cette séance.',
          );

          // Appointment is not deleted
          const appointmentArray = await dbAppointments.getAll(anotherPsyId);
          expect(appointmentArray).to.have.length(1);

          return Promise.resolve();
        });
    });

    it('should refuse invalid appointmentId', async () => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      };
      const appointment = await makeAppointment(psy.dossierNumber);

      return chai
        .request(app)
        .delete(`/api/appointments/${appointment.id}4`)
        .set(
          'Cookie',
          `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken', 'psy')}`,
        )
        .set('xsrf-token', 'randomXSRFToken')
        .then(async (res) => {
          res.status.should.equal(400);
          res.body.message.should.equal(
            'Vous devez spécifier une séance à supprimer.',
          );

          // Appointment is not deleted
          const appointmentArray = await dbAppointments.getAll(
            psy.dossierNumber,
          );
          expect(appointmentArray).to.have.length(1);

          return Promise.resolve();
        });
    });

    it('should not delete appointment if user not logged in', async () => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      };
      const appointment = await makeAppointment(psy.dossierNumber);

      return chai
        .request(app)
        .delete(`/api/appointments/${appointment.id}4`)
        .then(async (res) => {
          res.status.should.equal(401);

          // Appointment is not deleted
          const appointmentArray = await dbAppointments.getAll(
            psy.dossierNumber,
          );
          expect(appointmentArray).to.have.length(1);

          return Promise.resolve();
        });
    });

    it('should refuse empty appointmentId', async () => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      };
      await makeAppointment(psy.dossierNumber);

      return chai
        .request(app)
        .delete('/api/appointments')
        .set(
          'Cookie',
          `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken', 'psy')}`,
        )
        .set('xsrf-token', 'randomXSRFToken')
        .then(async (res) => {
          res.status.should.equal(404);

          const appointmentArray = await dbAppointments.getAll(
            psy.dossierNumber,
          );
          expect(appointmentArray).to.have.length(1);

          return Promise.resolve();
        });
    });
  });

  describe('get appointments with badges', () => {
    let psy: Psychologist;
    before(async () => {
      psy = await create.insertOnePsy({ createdAt: new Date('2021-05-22') });
    });
    beforeEach(async () => {
      await clean.patients();
      await clean.appointments();
      return Promise.resolve();
    });

    afterEach(async () => {
      await clean.patients();
      await clean.appointments();
      return Promise.resolve();
    });

    it('should have appointment with a specific badge for the 1st appointment', async () => {
      const patient1 = create.getOnePatient(0, {
        psychologistId: psy.dossierNumber,
      });
      const dbPatient1 = await insertPatientInfoInDb(patient1, psy);

      await dbAppointments.insert(
        new Date('2023-11-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );

      return chai
        .request(app)
        .get('/api/appointments')
        .set(
          'Cookie',
          `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken', 'psy')}`,
        )
        .set('xsrf-token', 'randomXSRFToken')
        .then(async (res) => {
          expect(res.body).to.have.length(1);
          expect(res.body[0].badges).to.includes(appointmentBadges.first);
          return Promise.resolve();
        });
    });

    it("shouldn't have appointments with 1st badge before january 2024 when billing purposes", async () => {
      const patient1 = create.getOnePatient(0, {
        psychologistId: psy.dossierNumber,
      });
      const dbPatient1 = await insertPatientInfoInDb(patient1, psy);

      await dbAppointments.insert(
        new Date('2023-11-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2024-01-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );

      return chai
        .request(app)
        .get('/api/appointments')
        .query({ isBillingPurposes: true })
        .set(
          'Cookie',
          `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken', 'psy')}`,
        )
        .set('xsrf-token', 'randomXSRFToken')
        .then(async (res) => {
          expect(res.body).to.have.length(2);
          expect(res.body[0].badges).to.not.includes(appointmentBadges.first);
          expect(res.body[1].badges).to.not.includes(appointmentBadges.first);
          return Promise.resolve();
        });
    });

    it('should have appointments with 1st badge after january 2024 when billing purposes', async () => {
      const patient1 = create.getOnePatient(0, {
        psychologistId: psy.dossierNumber,
      });
      const dbPatient1 = await insertPatientInfoInDb(patient1, psy);

      await dbAppointments.insert(
        new Date('2024-01-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );

      return chai
        .request(app)
        .get('/api/appointments')
        .query({ isBillingPurposes: true })
        .set(
          'Cookie',
          `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken', 'psy')}`,
        )
        .set('xsrf-token', 'randomXSRFToken')
        .then(async (res) => {
          expect(res.body).to.have.length(1);
          expect(res.body[0].badges).to.includes(appointmentBadges.first);
          return Promise.resolve();
        });
    });

    it('should have appointment with a specific badge on the before max appointment date', async () => {
      const patient1 = create.getOnePatient(0, {
        psychologistId: psy.dossierNumber,
      });
      const dbPatient1 = await insertPatientInfoInDb(patient1, psy);

      await dbAppointments.insert(
        new Date('2023-09-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2023-10-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2023-11-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2023-12-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2024-01-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2024-02-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      const appointmentBadgeBeforeMax = await dbAppointments.insert(
        new Date('2024-03-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      const appointmentBadgeMax = await dbAppointments.insert(
        new Date('2024-04-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );

      return chai
        .request(app)
        .get('/api/appointments')
        .set(
          'Cookie',
          `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken', 'psy')}`,
        )
        .set('xsrf-token', 'randomXSRFToken')
        .then(async (res) => {
          expect(res.body).to.have.length(8);
          expect(new Date(res.body[0].appointmentDate)).to.eql(
            appointmentBadgeMax.appointmentDate,
          );
          expect(new Date(res.body[1].appointmentDate)).to.eql(
            appointmentBadgeBeforeMax.appointmentDate,
          );
          expect(res.body[0].badges).to.includes(appointmentBadges.max);
          expect(res.body[1].badges).to.includes(appointmentBadges.before_max);
          return Promise.resolve();
        });
    });

    it('should have appointment with a specific badge on the 8th appointment date', async () => {
      const patient1 = create.getOnePatient(0, {
        psychologistId: psy.dossierNumber,
      });
      const dbPatient1 = await insertPatientInfoInDb(patient1, psy);

      await dbAppointments.insert(
        new Date('2023-09-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2023-10-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2023-11-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2023-12-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2024-01-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2024-02-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2024-03-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      const appointmentBadgeMax = await dbAppointments.insert(
        new Date('2024-04-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );

      return chai
        .request(app)
        .get('/api/appointments')
        .set(
          'Cookie',
          `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken', 'psy')}`,
        )
        .set('xsrf-token', 'randomXSRFToken')
        .then(async (res) => {
          expect(res.body).to.have.length(8);
          expect(new Date(res.body[0].appointmentDate)).to.eql(
            appointmentBadgeMax.appointmentDate,
          );
          expect(res.body[0].badges).to.includes(appointmentBadges.max);
          return Promise.resolve();
        });
    });

    it('should have appointment with a specific badge when excedeed eight appointments', async () => {
      const patient1 = create.getOnePatient(0, {
        psychologistId: psy.dossierNumber,
      });
      const dbPatient1 = await insertPatientInfoInDb(patient1, psy);

      await dbAppointments.insert(
        new Date('2023-09-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2023-10-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2023-11-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2023-12-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2024-01-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2024-02-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2024-03-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2024-04-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      const appointment9 = await dbAppointments.insert(
        new Date('2024-05-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      const appointment10 = await dbAppointments.insert(
        new Date('2024-06-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );

      return chai
        .request(app)
        .get('/api/appointments')
        .set(
          'Cookie',
          `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken', 'psy')}`,
        )
        .set('xsrf-token', 'randomXSRFToken')
        .then(async (res) => {
          expect(res.body).to.have.length(10);
          expect(new Date(res.body[1].appointmentDate)).to.eql(
            appointment9.appointmentDate,
          );
          expect(new Date(res.body[0].appointmentDate)).to.eql(
            appointment10.appointmentDate,
          );
          expect(res.body[1].badges).to.includes(appointmentBadges.exceeded);
          expect(res.body[0].badges).to.includes(appointmentBadges.exceeded);
          return Promise.resolve();
        });
    });

    it('should count patient appointments with another psy when attribute badges', async () => {
      const anotherPsy = await create.insertOnePsy({
        personalEmail: 'another@email.fr',
      });
      const patient1 = create.getOnePatient(0, {
        psychologistId: psy.dossierNumber,
      });
      const dbPatient1 = await insertPatientInfoInDb(patient1, psy);

      const sharedINEPatient = create.getOnePatient(1, {
        lastName: patient1.lastName,
        firstNames: patient1.firstNames,
        INE: patient1.INE,
        psychologistId: anotherPsy.dossierNumber,
      });
      const patientWithSameINE = await insertPatientInfoInDb(
        sharedINEPatient,
        anotherPsy,
      );

      await dbAppointments.insert(
        new Date('2023-09-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2023-10-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2023-11-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2023-12-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2024-01-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2024-02-03'),
        patientWithSameINE.id,
        anotherPsy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2024-03-03'),
        patientWithSameINE.id,
        anotherPsy.dossierNumber,
      );
      const appointment8 = await dbAppointments.insert(
        new Date('2024-04-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      const appointment9 = await dbAppointments.insert(
        new Date('2024-05-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );

      return chai
        .request(app)
        .get('/api/appointments')
        .set(
          'Cookie',
          `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken', 'psy')}`,
        )
        .set('xsrf-token', 'randomXSRFToken')
        .then(async (res) => {
          expect(res.body).to.have.length(7);
          expect(new Date(res.body[1].appointmentDate)).to.eql(
            appointment8.appointmentDate,
          );
          expect(new Date(res.body[0].appointmentDate)).to.eql(
            appointment9.appointmentDate,
          );
          expect(res.body[1].badges).to.includes(appointmentBadges.max);
          expect(res.body[0].badges).to.includes(appointmentBadges.exceeded);
          return Promise.resolve();
        });
    });

    it('should have appointment with a specific badge when appointment with another psy', async () => {
      const anotherPsy = await create.insertOnePsy({
        personalEmail: 'another@email.fr',
      });
      const patient1 = create.getOnePatient(0, {
        psychologistId: psy.dossierNumber,
      });
      const dbPatient1 = await insertPatientInfoInDb(patient1, psy);

      const sharedINEPatient = create.getOnePatient(1, {
        lastName: patient1.lastName,
        firstNames: patient1.firstNames,
        INE: patient1.INE,
        psychologistId: anotherPsy.dossierNumber,
      });
      const patientWithSameINE = await insertPatientInfoInDb(
        sharedINEPatient,
        anotherPsy,
      );

      await dbAppointments.insert(
        new Date('2023-09-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2023-10-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2023-11-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2023-12-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2024-01-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      const appointment6 = await dbAppointments.insert(
        new Date('2024-02-03'),
        patientWithSameINE.id,
        anotherPsy.dossierNumber,
      );
      const appointment7 = await dbAppointments.insert(
        new Date('2024-03-03'),
        patientWithSameINE.id,
        anotherPsy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2024-04-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2024-05-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );

      return chai
        .request(app)
        .get(`/api/appointments/${dbPatient1.id}`)
        .set(
          'Cookie',
          `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken', 'psy')}`,
        )
        .set('xsrf-token', 'randomXSRFToken')
        .then(async (res) => {
          const patientAppointments = res.body['2023-2024'];
          expect(patientAppointments).to.have.length(9);
          expect(new Date(patientAppointments[3].appointmentDate)).to.eql(
            appointment6.appointmentDate,
          );
          expect(new Date(patientAppointments[2].appointmentDate)).to.eql(
            appointment7.appointmentDate,
          );
          expect(patientAppointments[3].badges).to.includes(
            appointmentBadges.other_psychologist,
          );
          expect(patientAppointments[2].badges).to.includes(
            appointmentBadges.other_psychologist,
          );
          return Promise.resolve();
        });
    });

    it('should have patient appointments sorted by scholar years', async () => {
      const anotherPsy = await create.insertOnePsy({
        personalEmail: 'another@email.fr',
      });
      const patient1 = create.getOnePatient(0, {
        psychologistId: psy.dossierNumber,
      });
      const dbPatient1 = await insertPatientInfoInDb(patient1, psy);

      const sharedINEPatient = create.getOnePatient(1, {
        lastName: patient1.lastName,
        firstNames: patient1.firstNames,
        INE: patient1.INE,
        psychologistId: anotherPsy.dossierNumber,
      });
      const patientWithSameINE = await insertPatientInfoInDb(
        sharedINEPatient,
        anotherPsy,
      );

      await dbAppointments.insert(
        new Date('2023-09-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2023-10-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2023-11-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2023-12-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2024-01-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2024-02-03'),
        patientWithSameINE.id,
        anotherPsy.dossierNumber,
      );

      await dbAppointments.insert(
        new Date('2024-09-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2024-10-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2025-04-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2025-08-03'),
        patientWithSameINE.id,
        anotherPsy.dossierNumber,
      );

      return chai
        .request(app)
        .get(`/api/appointments/${dbPatient1.id}`)
        .set(
          'Cookie',
          `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken', 'psy')}`,
        )
        .set('xsrf-token', 'randomXSRFToken')
        .then(async (res) => {
          const patientAppointments1 = res.body['2023-2024'];
          const patientAppointments2 = res.body['2024-2025'];
          expect(patientAppointments1).to.have.length(6);
          expect(patientAppointments2).to.have.length(4);
          return Promise.resolve();
        });
    });

    /* New rule tests */
    it("shouldn't have appointments with 1st badge after 1st July 2024", async () => {
      const patient1 = create.getOnePatient(0, {
        psychologistId: psy.dossierNumber,
      });
      const dbPatient1 = await insertPatientInfoInDb(patient1, psy);

      await dbAppointments.insert(
        new Date('2024-07-02'),
        dbPatient1.id,
        psy.dossierNumber,
      );

      return chai
        .request(app)
        .get('/api/appointments')
        .query({ isBillingPurposes: true })
        .set(
          'Cookie',
          `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken', 'psy')}`,
        )
        .set('xsrf-token', 'randomXSRFToken')
        .then(async (res) => {
          expect(res.body).to.have.length(1);
          expect(res.body[0].badges).to.not.includes(appointmentBadges.first);
          return Promise.resolve();
        });
    });

    it('should add appointments with new reimbursement rule after 1st July 2024', async () => {
      const patient1 = create.getOnePatient(0, {
        psychologistId: psy.dossierNumber,
      });
      const dbPatient1 = await insertPatientInfoInDb(patient1, psy);

      await dbAppointments.insert(
        new Date('2023-09-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2023-10-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2023-11-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2023-12-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2024-01-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2024-02-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2024-03-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2024-04-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      const oldExceeded1 = await dbAppointments.insert(
        new Date('2024-05-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      const oldExceeded2 = await dbAppointments.insert(
        new Date('2024-06-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      const newRuleAppointment = await dbAppointments.insert(
        new Date('2024-07-02'),
        dbPatient1.id,
        psy.dossierNumber,
      );

      return chai
        .request(app)
        .get('/api/appointments')
        .set(
          'Cookie',
          `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken', 'psy')}`,
        )
        .set('xsrf-token', 'randomXSRFToken')
        .then(async (res) => {
          expect(res.body).to.have.length(11);
          expect(new Date(res.body[2].appointmentDate)).to.eql(
            oldExceeded1.appointmentDate,
          );
          expect(new Date(res.body[1].appointmentDate)).to.eql(
            oldExceeded2.appointmentDate,
          );
          expect(new Date(res.body[0].appointmentDate)).to.eql(
            newRuleAppointment.appointmentDate,
          );
          expect(res.body[2].badges).to.includes(appointmentBadges.exceeded);
          expect(res.body[2].badges).to.includes(appointmentBadges.inactive);
          expect(res.body[1].badges).to.includes(appointmentBadges.exceeded);
          expect(res.body[1].badges).to.includes(appointmentBadges.inactive);
          expect(res.body[1].badges).to.includes(
            appointmentBadges.switch_rule_notice,
          );
          expect(res.body[0].badges).to.includes(appointmentBadges.new_rules);
          return Promise.resolve();
        });
    });

    it('should add 12 appointments instead of 8 with new reimbursement rule after 1st July 2024', async () => {
      const patient1 = create.getOnePatient(0, {
        psychologistId: psy.dossierNumber,
      });
      const dbPatient1 = await insertPatientInfoInDb(patient1, psy);

      await dbAppointments.insert(
        new Date('2023-09-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2023-10-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2023-11-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2023-12-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2024-01-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2024-02-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2024-03-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2024-04-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      const oldExceeded1 = await dbAppointments.insert(
        new Date('2024-05-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      const oldExceeded2 = await dbAppointments.insert(
        new Date('2024-06-03'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2024-07-01'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2024-07-16'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date('2024-07-19'),
        dbPatient1.id,
        psy.dossierNumber,
      );
      const maxAppointment = await dbAppointments.insert(
        new Date('2024-07-20'),
        dbPatient1.id,
        psy.dossierNumber,
      );

      return chai
        .request(app)
        .get('/api/appointments')
        .set(
          'Cookie',
          `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken', 'psy')}`,
        )
        .set('xsrf-token', 'randomXSRFToken')
        .then(async (res) => {
          expect(res.body).to.have.length(14);
          expect(new Date(res.body[0].appointmentDate)).to.eql(
            maxAppointment.appointmentDate,
          );
          expect(new Date(res.body[4].appointmentDate)).to.eql(
            oldExceeded2.appointmentDate,
          );
          expect(new Date(res.body[5].appointmentDate)).to.eql(
            oldExceeded1.appointmentDate,
          );
          expect(res.body[6].badges).to.includes(appointmentBadges.max);
          expect(res.body[6].badges).to.includes(appointmentBadges.inactive);
          expect(res.body[5].badges).to.includes(appointmentBadges.exceeded);
          expect(res.body[5].badges).to.includes(appointmentBadges.inactive);
          expect(res.body[4].badges).to.includes(appointmentBadges.exceeded);
          expect(res.body[4].badges).to.includes(appointmentBadges.inactive);
          expect(res.body[4].badges).to.includes(
            appointmentBadges.switch_rule_notice,
          );
          expect(res.body[0].badges).to.includes(appointmentBadges.new_rules);
          expect(res.body[0].badges).to.includes(appointmentBadges.max);
          return Promise.resolve();
        });
    });
  });
});
