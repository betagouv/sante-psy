import { v4 as uuidv4 } from 'uuid';
import { assert } from 'chai';
import db from '../../db/db';
import dbAppointments from '../../db/appointments';
import dbPatients from '../../db/patients';
import clean from '../helper/clean';
import create from '../helper/create';
import { appointmentsTable } from '../../db/tables';

import dotEnv from 'dotenv';

dotEnv.config();

describe('DB Appointments', () => {
  beforeEach(async () => {
    await clean.patients();
    await clean.psychologists();
    await clean.appointments();
  });

  afterEach(async () => {
    await clean.patients();
    await clean.psychologists();
    await clean.appointments();
  });

  describe('delete', () => {
    it('should change deleted boolean to true and update updatedAt field', async () => {
      const psy = await create.insertOnePsy();
      const patientToInsert = create.getOnePatient(0, { psychologistId: psy.dossierNumber });
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
      const psy = await create.insertOnePsy();
      const patientToInsert = create.getOnePatient(0, { psychologistId: psy.dossierNumber });
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
      const psy = await create.insertOnePsy();
      const anotherPsy = await create.insertOnePsy({ personalEmail: 'another@beta.gouv.fr' });

      const patientToInsert = create.getOnePatient(0, { psychologistId: psy.dossierNumber });
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

  describe('countByPatient', () => {
    it('should count all non deleted appointments of a patient', async () => {
      const psy = await create.insertOnePsy();
      const patient1 = create.getOnePatient(0, { psychologistId: psy.dossierNumber });
      const patient2 = create.getOnePatient(1, { psychologistId: psy.dossierNumber });
      const patientWithAppointments = await dbPatients.insert(
        patient1.firstNames,
        patient1.lastName,
        patient1.INE,
        patient1.institutionName,
        patient1.isStudentStatusVerified,
        patient1.hasPrescription,
        psy.dossierNumber,
        patient1.doctorName,
        patient1.doctorAddress,
        patient1.dateOfBirth,
      );
      const otherPatient = await dbPatients.insert(
        patient2.firstNames,
        patient2.lastName,
        patient2.INE,
        patient2.institutionName,
        patient2.isStudentStatusVerified,
        patient2.hasPrescription,
        psy.dossierNumber,
        patient2.doctorName,
        patient2.doctorAddress,
        patient2.dateOfBirth,
      );
      const toDelete = await dbAppointments.insert(
        new Date('2021-03-01'),
        patientWithAppointments.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(new Date('2021-03-01'), patientWithAppointments.id, psy.dossierNumber);
      await dbAppointments.insert(new Date('2021-03-01'), patientWithAppointments.id, psy.dossierNumber);
      await dbAppointments.insert(new Date('2021-03-01'), patientWithAppointments.id, psy.dossierNumber);
      await dbAppointments.insert(new Date('2021-03-01'), otherPatient.id, psy.dossierNumber);

      await dbAppointments.delete(toDelete.id, psy.dossierNumber);

      const count = await dbAppointments.countByPatient(patientWithAppointments.id);
      assert.equal(count[0].count, 3);
    });

    it('should return 0 for non existing patient', async () => {
      const count = await dbAppointments.countByPatient(uuidv4());
      assert.equal(count[0].count, 0);
    });
  });
});
