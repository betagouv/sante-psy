require('dotenv').config();
const knexConfig = require('../knexfile');
const knex = require('knex')(knexConfig.default);
const { assert } = require('chai');
const { default: dbAppointments } = require('../db/appointments');
const { default: dbPatients } = require('../db/patients');
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

  describe('delete', () => {
    it('should change deleted boolean to true and update updatedAt field', async () => {
      const psy = await clean.insertOnePsy();
      const patientToInsert = clean.getOnePatient(psy.dossierNumber);
      const patient = await dbPatients.insert(
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
      await dbAppointments.insert(new Date('2021-03-01'), patient.id, psy.dossierNumber);

      const appointmentsBeforeDelete = await knex.from(appointmentsTable)
      .where('psychologistId', psy.dossierNumber)
      .where('patientId', patient.id);

      assert.isNull(appointmentsBeforeDelete[0].updatedAt);
      assert.isFalse(appointmentsBeforeDelete[0].deleted);
      await dbAppointments.delete(appointmentsBeforeDelete[0].id, psy.dossierNumber);

      const appointmentsAfterDelete = await knex.from(appointmentsTable)
      .where('psychologistId', psy.dossierNumber)
      .where('patientId', patient.id);
      assert.isTrue(appointmentsAfterDelete[0].deleted);
      assert.isNotNull(appointmentsAfterDelete[0].updatedAt);
    });
  });

  describe('getAll', () => {
    it('should only return not deleted appointments for psy id', async () => {
      const psy = await clean.insertOnePsy();
      const patientToInsert = clean.getOnePatient(psy.dossierNumber);
      const patient = await dbPatients.insert(
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
      const toDelete = await dbAppointments.insert(new Date('2021-03-01'), patient.id, psy.dossierNumber);
      await dbAppointments.insert(new Date('2021-03-02'), patient.id, psy.dossierNumber);
      await dbAppointments.insert(new Date('2021-03-03'), patient.id, psy.dossierNumber);

      await dbAppointments.delete(toDelete.id, psy.dossierNumber);

      const output = await dbAppointments.getAll(psy.dossierNumber);

      assert.strictEqual(output.length, 2);
      assert.isFalse(output[0].deleted);
      assert.isFalse(output[1].deleted);
    });

    it('should only return psy id appointments', async () => {
      const psy = await clean.insertOnePsy();
      const anotherPsy = await clean.insertOnePsy('another@beta.gouv.fr');

      const patientToInsert = clean.getOnePatient(psy.dossierNumber);
      const patient = await dbPatients.insert(
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

      await dbAppointments.insert(new Date('2021-03-02'), patient.id, psy.dossierNumber);
      await dbAppointments.insert(new Date('2021-03-03'), patient.id, psy.dossierNumber);
      await dbAppointments.insert(new Date('2021-03-04'), patient.id, psy.dossierNumber);
      await dbAppointments.insert(new Date('2021-03-03'), patient.id, anotherPsy.dossierNumber);

      const output = await dbAppointments.getAll(psy.dossierNumber);

      assert.equal(output.length, 3);
      assert.equal(output[0].psychologistId, psy.dossierNumber);
      assert.equal(output[1].psychologistId, psy.dossierNumber);
      assert.equal(output[2].psychologistId, psy.dossierNumber);
    });
  });
});
