require('dotenv').config();
const knexConfig = require('../knexfile');
const knex = require('knex')(knexConfig);
const { assert } = require('chai');
const dbAppointments = require('../db/appointments');
const dbPatients = require('../db/patients');
const dbPsychologists = require('../db/psychologists');
const { default: clean } = require('./helper/clean');
const { appointmentsTable } = require('../db/tables');

describe('DB Appointments', () => {
  beforeEach(async () => {
    await clean.cleanAllPatients();
    await clean.cleanAllPsychologists();
    await clean.cleanAllAppointments();
  });

  afterEach(async () => {
    await clean.cleanAllPatients();
    await clean.cleanAllPsychologists();
    await clean.cleanAllAppointments();
  });

  describe('deleteAppointment', () => {
    it('should change deleted boolean to true and update updatedAt field', async () => {
      const psy = await clean.insertOnePsy();
      const patientToInsert = clean.getOnePatient(psy.dossierNumber);
      const patient = await dbPatients.insertPatient(
        patientToInsert.firstNames,
        patientToInsert.lastName,
        patientToInsert.INE,
        patientToInsert.institutionName,
        patientToInsert.isStudentStatusVerified,
        patientToInsert.hasPrescription,
        psy.dossierNumber,
        patientToInsert.doctorName,
        patientToInsert.doctorAddress,
      );
      await dbAppointments.insertAppointment(new Date('2021-03-01'), patient.id, psy.dossierNumber);

      const appointmentsBeforeDelete = await knex.from(appointmentsTable)
      .where('psychologistId', psy.dossierNumber)
      .where('patientId', patient.id);

      assert.isNull(appointmentsBeforeDelete[0].updatedAt);
      assert.isFalse(appointmentsBeforeDelete[0].deleted);
      await dbAppointments.deleteAppointment(appointmentsBeforeDelete[0].id, psy.dossierNumber);

      const appointmentsAfterDelete = await knex.from(appointmentsTable)
      .where('psychologistId', psy.dossierNumber)
      .where('patientId', patient.id);
      assert.isTrue(appointmentsAfterDelete[0].deleted);
      assert.isNotNull(appointmentsAfterDelete[0].updatedAt);
    });
  });

  describe('getCountAppointmentsByYearMonth', () => {
    it('should return a count of appointments by year and month', async () => {
      const psy = await clean.insertOnePsy();
      const patientToInsert = clean.getOnePatient(psy.dossierNumber);
      const patient = await dbPatients.insertPatient(
        patientToInsert.firstNames,
        patientToInsert.lastName,
        patientToInsert.INE,
        patientToInsert.institutionName,
        patientToInsert.isStudentStatusVerified,
        patientToInsert.hasPrescription,
        psy.dossierNumber,
        patientToInsert.doctorName,
        patientToInsert.doctorAddress,
      );

      const patient2 = await dbPatients.insertPatient(
        patientToInsert.firstNames,
        patientToInsert.lastName,
        patientToInsert.INE,
        patientToInsert.institutionName,
        patientToInsert.isStudentStatusVerified,
        patientToInsert.hasPrescription,
        psy.dossierNumber,
        patientToInsert.doctorName,
        patientToInsert.doctorAddress,
      );
      await dbAppointments.insertAppointment(new Date('2021-03-01'), patient.id, psy.dossierNumber);
      await dbAppointments.insertAppointment(new Date('2021-03-02'), patient2.id, psy.dossierNumber);
      await dbAppointments.insertAppointment(new Date('2021-03-03'), patient.id, psy.dossierNumber);
      await dbAppointments.insertAppointment(new Date('2021-03-03'), patient2.id, psy.dossierNumber);
      await dbAppointments.insertAppointment(new Date('2021-04-03'), patient.id, psy.dossierNumber);
      await dbAppointments.insertAppointment(new Date('2021-06-03'), patient.id, psy.dossierNumber);
      await dbAppointments.insertAppointment(new Date('2021-07-03'), patient.id, psy.dossierNumber);

      // For april (should be output - as deleted)
      const toDelete = await dbAppointments.insertAppointment(new Date('2021-04-01'), patient.id, psy.dossierNumber);
      await dbAppointments.deleteAppointment(toDelete.id, psy.dossierNumber);

      const output = await dbAppointments.getCountAppointmentsByYearMonth(psy.dossierNumber);

      assert.strictEqual(output.length, 4); // 4 months
      assert.strictEqual(output[0].countAppointments, 4);
      assert.strictEqual(output[0].year, 2021);
      assert.strictEqual(output[0].month, 3);
      assert.strictEqual(output[1].countAppointments, 1);
      assert.strictEqual(output[1].year, 2021);
      assert.strictEqual(output[1].month, 4);
      assert.strictEqual(output[2].countAppointments, 1);
      assert.strictEqual(output[2].year, 2021);
      assert.strictEqual(output[2].month, 6);
      assert.strictEqual(output[3].countAppointments, 1);
      assert.strictEqual(output[3].year, 2021);
      assert.strictEqual(output[3].month, 7);
    });
  });

  describe('getMonthlyAppointmentsSummary', () => {
    it('should return a count of appointments by year and month', async () => {
      const month = 4;
      const year = 2021;

      const psy = await clean.insertOnePsy('loginemail@beta.gouv.fr');
      const psy2 = await clean.insertOnePsy('emaillogin@beta.gouv.fr');

      const patientToInsert = clean.getOnePatient(psy.dossierNumber);
      const patient = await dbPatients.insertPatient(
        patientToInsert.firstNames,
        patientToInsert.lastName,
        patientToInsert.INE,
        patientToInsert.institutionName,
        patientToInsert.isStudentStatusVerified,
        patientToInsert.hasPrescription,
        psy.dossierNumber,
        patientToInsert.doctorName,
        patientToInsert.doctorAddress,
      );

      const patient2 = await dbPatients.insertPatient(
        patientToInsert.firstNames,
        patientToInsert.lastName,
        patientToInsert.INE,
        patientToInsert.institutionName,
        patientToInsert.isStudentStatusVerified,
        patientToInsert.hasPrescription,
        psy2.dossierNumber,
        patientToInsert.doctorName,
        patientToInsert.doctorAddress,
      );
      // For april (should be output)
      await dbAppointments.insertAppointment(new Date('2021-04-03'), patient.id, psy.dossierNumber);
      await dbAppointments.insertAppointment(new Date('2021-04-03'), patient2.id, psy2.dossierNumber);
      await dbAppointments.insertAppointment(new Date('2021-04-03'), patient2.id, psy2.dossierNumber);
      // For march (should not be output)
      await dbAppointments.insertAppointment(new Date('2021-03-01'), patient.id, psy.dossierNumber);
      await dbAppointments.insertAppointment(new Date('2021-03-02'), patient2.id, psy2.dossierNumber);

      // For april (should be output - as deleted)
      const toDelete = await dbAppointments.insertAppointment(new Date('2021-04-01'), patient.id, psy.dossierNumber);
      await dbAppointments.deleteAppointment(toDelete.id, psy.dossierNumber);

      const output = await dbAppointments.getMonthlyAppointmentsSummary(year, month);

      assert.equal(output.length, 2); // 2 psys for april
      // Psy 1
      assert.equal(output[0].psychologistId, psy.dossierNumber);
      assert.equal(output[0].countAppointments, 1); // 1 appointment in april
      assert.equal(output[0].universityId, psy.assignedUniversityId);
      assert.equal(output[0].personalEmail, psy.personalEmail);
      assert.equal(output[0].lastName, psy.lastName);
      assert.equal(output[0].firstNames, psy.firstNames);
      // Psy 2
      assert.equal(output[1].psychologistId, psy2.dossierNumber);
      assert.equal(output[1].countAppointments, 2); // 2 appointments in april
      assert.equal(output[1].universityId, psy2.assignedUniversityId);
      assert.equal(output[0].personalEmail, psy.personalEmail);
      assert.equal(output[0].lastName, psy.lastName);
      assert.equal(output[0].firstNames, psy.firstNames);
    });
  });

  describe('getCountPatientsByYearMonth', () => {
    it('should return a count of patients by year and month', async () => {
      const psy = await clean.insertOnePsy();
      const patientToInsert = clean.getOnePatient(psy.dossierNumber);
      const patient = await dbPatients.insertPatient(
        patientToInsert.firstNames,
        patientToInsert.lastName,
        patientToInsert.INE,
        patientToInsert.institutionName,
        patientToInsert.isStudentStatusVerified,
        patientToInsert.hasPrescription,
        psy.dossierNumber,
        patientToInsert.doctorName,
        patientToInsert.doctorAddress,
      );
      const patient2 = await dbPatients.insertPatient(
        patientToInsert.firstNames,
        patientToInsert.lastName,
        patientToInsert.INE,
        patientToInsert.institutionName,
        patientToInsert.isStudentStatusVerified,
        patientToInsert.hasPrescription,
        psy.dossierNumber,
        patientToInsert.doctorName,
        patientToInsert.doctorAddress,
      );
      // 4 appointments in march with 2 patients
      await dbAppointments.insertAppointment(new Date('2021-03-01'), patient.id, psy.dossierNumber);
      await dbAppointments.insertAppointment(new Date('2021-03-02'), patient.id, psy.dossierNumber);
      await dbAppointments.insertAppointment(new Date('2021-03-03'), patient.id, psy.dossierNumber);
      await dbAppointments.insertAppointment(new Date('2021-03-03'), patient2.id, psy.dossierNumber);
      // one in april
      await dbAppointments.insertAppointment(new Date('2021-04-03'), patient.id, psy.dossierNumber);
      // one in june
      await dbAppointments.insertAppointment(new Date('2021-06-03'), patient.id, psy.dossierNumber);
      // one in july
      await dbAppointments.insertAppointment(new Date('2021-07-03'), patient.id, psy.dossierNumber);

      // For april (should be output - as deleted)
      const toDelete = await dbAppointments.insertAppointment(new Date('2021-04-01'), patient2.id, psy.dossierNumber);
      await dbAppointments.deleteAppointment(toDelete.id, psy.dossierNumber);

      const output = await dbAppointments.getCountPatientsByYearMonth(psy.dossierNumber);

      assert.equal(output.length, 4); // 4 months
      assert.equal(output[0].countPatients, 2);
      assert.equal(output[0].year, 2021);
      assert.equal(output[0].month, 3);

      assert.equal(output[1].countPatients, 1);
      assert.equal(output[1].year, 2021);
      assert.equal(output[1].month, 4);
      assert.equal(output[2].countPatients, 1);
      assert.equal(output[2].year, 2021);
      assert.equal(output[2].month, 6);
      assert.equal(output[3].countPatients, 1);
      assert.equal(output[3].year, 2021);
      assert.equal(output[3].month, 7);
    });
  });

  describe('getAppointments', () => {
    it('should only return not deleted appointments for psy id', async () => {
      const psy = await clean.insertOnePsy();
      const patientToInsert = clean.getOnePatient(psy.dossierNumber);
      const patient = await dbPatients.insertPatient(
        patientToInsert.firstNames,
        patientToInsert.lastName,
        patientToInsert.INE,
        patientToInsert.institutionName,
        patientToInsert.isStudentStatusVerified,
        patientToInsert.hasPrescription,
        psy.dossierNumber,
        patientToInsert.doctorName,
        patientToInsert.doctorAddress,
      );
      const toDelete = await dbAppointments.insertAppointment(new Date('2021-03-01'), patient.id, psy.dossierNumber);
      await dbAppointments.insertAppointment(new Date('2021-03-02'), patient.id, psy.dossierNumber);
      await dbAppointments.insertAppointment(new Date('2021-03-03'), patient.id, psy.dossierNumber);

      await dbAppointments.deleteAppointment(toDelete.id, psy.dossierNumber);

      const output = await dbAppointments.getAppointments(psy.dossierNumber);

      assert.strictEqual(output.length, 2);
      assert.isFalse(output[0].deleted);
      assert.isFalse(output[1].deleted);
    });

    it('should only return psy id appointments', async () => {
      const psy = await clean.insertOnePsy();
      const anotherPsy = await clean.insertOnePsy('another@beta.gouv.fr');

      const patientToInsert = clean.getOnePatient(psy.dossierNumber);
      const patient = await dbPatients.insertPatient(
        patientToInsert.firstNames,
        patientToInsert.lastName,
        patientToInsert.INE,
        patientToInsert.institutionName,
        patientToInsert.isStudentStatusVerified,
        patientToInsert.hasPrescription,
        psy.dossierNumber,
        patientToInsert.doctorName,
        patientToInsert.doctorAddress,
      );

      await dbAppointments.insertAppointment(new Date('2021-03-02'), patient.id, psy.dossierNumber);
      await dbAppointments.insertAppointment(new Date('2021-03-03'), patient.id, psy.dossierNumber);
      await dbAppointments.insertAppointment(new Date('2021-03-04'), patient.id, psy.dossierNumber);
      await dbAppointments.insertAppointment(new Date('2021-03-03'), patient.id, anotherPsy.dossierNumber);

      const output = await dbAppointments.getAppointments(psy.dossierNumber);

      assert.equal(output.length, 3);
      assert.equal(output[0].psychologistId, psy.dossierNumber);
      assert.equal(output[1].psychologistId, psy.dossierNumber);
      assert.equal(output[2].psychologistId, psy.dossierNumber);
    });
  });
});
