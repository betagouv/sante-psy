import { assert, expect } from 'chai';
import dbPatients from '../../db/patients';
import db from '../../db/db';
import clean from '../helper/clean';
import create from '../helper/create';
import { patientsTable } from '../../db/tables';

import dotEnv from 'dotenv';

dotEnv.config();

describe('DB Patients', () => {
  async function testDataPatientsExist(studentId) {
    const exist = await db(patientsTable)
      .where('student_id', studentId)
      .first();
    if (exist) {
      return true;
    }
    return false;
  }

  // Clean up all data
  afterEach(async () => {
    await clean.patients();
  });

  describe('insert', () => {
    it('should insert one patient in PG', async () => {
      const psy = await create.insertOnePsy();
      const student = await create.insertOneStudent();
      await dbPatients.insert(psy.dossierNumber, student.id);

      const exist = await testDataPatientsExist(student.id);
      exist.should.be.equal(true);
    });

    it('should set deleted to false by default in PG', async () => {
      const psy = await create.insertOnePsy();
      const student = await create.insertOneStudent();
      const insertedPatient = await dbPatients.insert(
        psy.dossierNumber,
        student.id,
      );
      expect(insertedPatient.deleted).equal(false);
    });
  });

  describe('delete', () => {
    it('should change deleted boolean to true and update updatedAt field', async () => {
      const psy = await create.insertOnePsy();
      const student = await create.insertOneStudent();
      const patient = await dbPatients.insert(psy.dossierNumber, student.id);

      const patientBeforeDelete = await dbPatients.getById(
        patient.id,
        psy.dossierNumber,
      );

      assert.isNull(patientBeforeDelete.updatedAt);
      assert.isFalse(patientBeforeDelete.deleted);
      await dbPatients.delete(patientBeforeDelete.id, psy.dossierNumber);

      const patientAfterDelete = await dbPatients.getById(
        patient.id,
        psy.dossierNumber,
      );
      assert.isTrue(patientAfterDelete.deleted);
      assert.isNotNull(patientAfterDelete.updatedAt);
    });
  });

  describe('getAll', () => {
    it('should return psy patients', async () => {
      const psy = await create.insertOnePsy();
      const student1 = await create.insertOneStudent();
      const student2 = await create.insertOneStudent();
      await dbPatients.insert(psy.dossierNumber, student1.id);
      await dbPatients.insert(psy.dossierNumber, student2.id);

      const patients = (await dbPatients.getAll(psy.dossierNumber)).sort(
        (a, b) => parseInt(a.appointmentsCount) - parseInt(b.appointmentsCount),
      );
      expect(patients).to.have.length(2);
    });

    it('should not return deleted patients', async () => {
      const psy = await create.insertOnePsy();
      const student = await create.insertOneStudent();
      const patient = await dbPatients.insert(psy.dossierNumber, student.id);
      await dbPatients.delete(patient.id, psy.dossierNumber);

      const patients = await dbPatients.getAll(psy.dossierNumber);
      expect(patients).to.have.length(0);
    });
  });
});
