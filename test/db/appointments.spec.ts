import { v4 as uuidv4 } from 'uuid';
import { assert } from 'chai';
import db from '../../db/db';
import dbAppointments from '../../db/appointments';
import dbPatients from '../../db/patients';
import clean from '../helper/clean';
import create from '../helper/create';
import { appointmentsTable } from '../../db/tables';

import dotEnv from 'dotenv';
import { Patient } from '../../types/Patient';
import { Psychologist } from '../../types/Psychologist';

dotEnv.config();

async function insertPatientToDb(patientToInsert: Patient, psy: Psychologist) {
  return dbPatients.insert(
    patientToInsert.firstNames,
    patientToInsert.lastName,
    patientToInsert.INE,
    patientToInsert.institutionName,
    patientToInsert.isStudentStatusVerified,
    psy.dossierNumber,
    patientToInsert.doctorName,
    patientToInsert.doctorAddress,
    patientToInsert.doctorEmail,
    patientToInsert.dateOfBirth,
  );
}

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
      const patient = await insertPatientToDb(patientToInsert, psy);
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
      const patient = await insertPatientToDb(patientToInsert, psy);
      const toDelete = await dbAppointments.insert(new Date('2023-11-01'), patient.id, psy.dossierNumber);
      await dbAppointments.insert(new Date('2023-11-02'), patient.id, psy.dossierNumber);
      await dbAppointments.insert(new Date('2023-11-03'), patient.id, psy.dossierNumber);

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
        psy.dossierNumber,
        patientToInsert.doctorName,
        patientToInsert.doctorAddress,
        patientToInsert.doctorEmail,
        patientToInsert.dateOfBirth,
      );

      await dbAppointments.insert(new Date('2023-11-02'), patient.id, psy.dossierNumber);
      await dbAppointments.insert(new Date('2023-11-03'), patient.id, psy.dossierNumber);
      await dbAppointments.insert(new Date('2023-11-04'), patient.id, psy.dossierNumber);
      await dbAppointments.insert(new Date('2023-11-03'), patient.id, anotherPsy.dossierNumber);

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
      const patientWithAppointments = await insertPatientToDb(patient1, psy);
      const otherPatient = await insertPatientToDb(patient2, psy);
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

  describe('getByPatientId', () => {
    it('should get all non deleted appointments of a patient', async () => {
      const psy = await create.insertOnePsy();
      const patient1 = create.getOnePatient(0, { psychologistId: psy.dossierNumber });
      const patient2 = create.getOnePatient(1, { psychologistId: psy.dossierNumber });
      const patientWithAppointments = await insertPatientToDb(patient1, psy);
      const otherPatient = await insertPatientToDb(patient2, psy);
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

      const appointments = await dbAppointments.getByPatientId(patientWithAppointments.id);
      assert.equal(appointments.length, 3);
    });

    it('should get all non deleted appointments of a patient with same INE related appointments', async () => {
      const psy = await create.insertOnePsy();
      const anotherPsy = await create.insertOnePsy({ personalEmail: 'another@beta.gouv.fr' });
      const patient = create.getOnePatient(0, { psychologistId: psy.dossierNumber });
      const patientWithAppointments = await insertPatientToDb(patient, psy);
      const sharedINEPatient = create.getOnePatient(1, {
        lastName: patientWithAppointments.lastName,
        firstNames: patientWithAppointments.firstNames,
        INE: patientWithAppointments.INE,
        psychologistId: anotherPsy.dossierNumber,
      });
      const patientWithSameINE = await insertPatientToDb(sharedINEPatient, anotherPsy);
      const toDelete = await dbAppointments.insert(
        new Date('2021-03-01'),
        patientWithAppointments.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(new Date('2021-03-01'), patientWithAppointments.id, psy.dossierNumber);
      await dbAppointments.insert(new Date('2021-03-01'), patientWithAppointments.id, psy.dossierNumber);
      await dbAppointments.insert(new Date('2021-03-01'), patientWithSameINE.id, anotherPsy.dossierNumber);
      await dbAppointments.insert(new Date('2021-03-01'), patientWithSameINE.id, anotherPsy.dossierNumber);

      await dbAppointments.delete(toDelete.id, psy.dossierNumber);

      const appointments = await dbAppointments.getByPatientId(patientWithAppointments.id, true);
      assert.equal(appointments.length, 4);
    });
  });

  describe('getRelatedINEAppointments', () => {
    it(
      'should get all non deleted psychologist appointments with INE related appointments for each patients',
      async () => {
        const psy = await create.insertOnePsy();
        const anotherPsy = await create.insertOnePsy({ personalEmail: 'another@beta.gouv.fr' });
        const patient = create.getOnePatient(0, { psychologistId: psy.dossierNumber });
        const patientWithAppointments = await insertPatientToDb(patient, psy);
        const sharedINEPatient = create.getOnePatient(1, {
          lastName: patientWithAppointments.lastName,
          firstNames: patientWithAppointments.firstNames,
          INE: patientWithAppointments.INE,
          psychologistId: anotherPsy.dossierNumber,
        });
        const patientWithSameINE = await insertPatientToDb(sharedINEPatient, anotherPsy);
        const toDelete = await dbAppointments.insert(
          new Date('2021-03-01'),
          patientWithAppointments.id,
          psy.dossierNumber,
        );
        await dbAppointments.insert(new Date('2021-03-01'), patientWithAppointments.id, psy.dossierNumber);
        await dbAppointments.insert(new Date('2021-03-01'), patientWithAppointments.id, psy.dossierNumber);
        await dbAppointments.insert(new Date('2021-03-01'), patientWithSameINE.id, anotherPsy.dossierNumber);
        await dbAppointments.insert(new Date('2021-03-01'), patientWithSameINE.id, anotherPsy.dossierNumber);

        await dbAppointments.delete(toDelete.id, psy.dossierNumber);

        const appointments = await dbAppointments.getAll(psy.dossierNumber);
        assert.equal(appointments.length, 2);
        const appointementsWithRelated = await dbAppointments.getRelatedINEAppointments(appointments);
        assert.equal(appointementsWithRelated.length, 4);
      },
    );
  });
});
