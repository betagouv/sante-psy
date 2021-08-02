import { assert } from 'chai';
import db from '../db/db';
import dbAppointments from '../db/appointments';
import dbPatients from '../db/patients';
import clean from './helper/clean';
import { appointmentsTable } from '../db/tables';

import dotEnv from 'dotenv';

dotEnv.config();

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
      const patientToInsert = clean.getOnePatient(0, psy.dossierNumber);
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
        patientToInsert.dateOfBirth,
      );
      await dbAppointments.insert(new Date('2021-03-01'), patient.id, psy.dossierNumber);

      const appointmentsBeforeDelete = await db.from(appointmentsTable)
      .where('psychologistId', psy.dossierNumber)
      .where('patientId', patient.id);

      assert.isNull(appointmentsBeforeDelete[0].updatedAt);
      assert.isFalse(appointmentsBeforeDelete[0].deleted);
      await dbAppointments.delete(appointmentsBeforeDelete[0].id, psy.dossierNumber);

      const appointmentsAfterDelete = await db.from(appointmentsTable)
      .where('psychologistId', psy.dossierNumber)
      .where('patientId', patient.id);
      assert.isTrue(appointmentsAfterDelete[0].deleted);
      assert.isNotNull(appointmentsAfterDelete[0].updatedAt);
    });
  });

  describe('getAll', () => {
    it('should only return not deleted appointments for psy id', async () => {
      const psy = await clean.insertOnePsy();
      const patientToInsert = clean.getOnePatient(0, psy.dossierNumber);
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
        patientToInsert.dateOfBirth,
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

      const patientToInsert = clean.getOnePatient(0, psy.dossierNumber);
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
        patientToInsert.dateOfBirth,
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

  describe('getLastWeekByUniversity', () => {
    it('should return weekly appointments grouped by universities', async () => {
      const psy1 = await clean.insertOnePsy('firstPsy');
      const patient1 = await clean.insertOnePatient(0, psy1.dossierNumber);

      const psy2 = await clean.insertOnePsy('secondPsy');
      const patient2 = await clean.insertOnePatient(0, psy2.dossierNumber);

      // In scope
      let now = new Date();
      now.setHours(17, 59, 0, 0);
      await dbAppointments.insert(now, patient1.id, psy1.dossierNumber);
      await dbAppointments.insert(now, patient2.id, psy2.dossierNumber);

      now.setDate(now.getDate() - 2);
      await dbAppointments.insert(now, patient1.id, psy1.dossierNumber);
      await dbAppointments.insert(now, patient1.id, psy1.dossierNumber);
      await dbAppointments.insert(now, patient2.id, psy2.dossierNumber);

      now.setDate(now.getDate() - 5);
      now.setHours(18, 1, 0, 0);
      await dbAppointments.insert(now, patient1.id, psy1.dossierNumber);
      await dbAppointments.insert(now, patient2.id, psy2.dossierNumber);

      const toDelete = await dbAppointments.insert(now, patient2.id, psy2.dossierNumber);

      // Out of scope
      now = new Date();
      now.setHours(18, 1, 0, 0);
      await dbAppointments.insert(now, patient1.id, psy1.dossierNumber);
      await dbAppointments.insert(now, patient2.id, psy2.dossierNumber);

      now.setDate(now.getDate() - 7);
      now.setHours(17, 59, 0, 0);
      await dbAppointments.insert(now, patient1.id, psy1.dossierNumber);
      await dbAppointments.insert(now, patient2.id, psy2.dossierNumber);

      await dbAppointments.delete(toDelete.id, psy2.dossierNumber);

      const appointments = await dbAppointments.getLastWeekByUniversity();

      appointments.length.should.be.equal(2);
      // Because of random order we cannot know the order between 4 and 3 :/
      appointments.find((x) => x.count === '4').count.should.equal('4');
      appointments.find((x) => x.count === '3').count.should.equal('3');
    });
  });
});
