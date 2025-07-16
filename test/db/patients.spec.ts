import { assert, expect } from 'chai';
import dbPatients from '../../db/patients';
import db from '../../db/db';
import clean from '../helper/clean';
import create from '../helper/create';
import { patientsTable } from '../../db/tables';

import dotEnv from 'dotenv';

dotEnv.config();

describe('DB Patients', () => {
  const firstNames = 'Harry James';
  const lastName = 'Potter';
  const dateOfBirth = new Date('1980/01/20');
  const gender = 'female';
  const studentNumber = '12345678901';
  const isINESvalid = false;
  const anotherStudentNumber = '10987654321';
  const institutionName = 'Pouldard';
  const isStudentStatusVerified = false;
  const doctorName = 'doctorName';

  async function testDataPatientsExist(lastName) {
    const exist = await db(patientsTable)
      .where('lastName', lastName)
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
      await dbPatients.insert(
        firstNames,
        lastName,
        dateOfBirth,
        gender,
        studentNumber,
        isINESvalid,
        institutionName,
        isStudentStatusVerified,
        psy.dossierNumber,
        doctorName,
      );

      const exist = await testDataPatientsExist(lastName);
      exist.should.be.equal(true);
    });

    it('should refuse insert for INE with more than 11 characters in PG', async () => {
      const psy = await create.insertOnePsy();
      try {
        await dbPatients.insert(
          firstNames,
          lastName,
          dateOfBirth,
          gender,
          '1'.repeat(12),
          isINESvalid,
          institutionName,
          isStudentStatusVerified,
          psy.dossierNumber,
          doctorName,
        );
        assert.fail('insert patient should have failed');
      } catch (error) {
        expect(error).to.be.an('Error');
      }
    });

    it('should refuse insert without mandatory params in PG', async () => {
      try {
        await dbPatients.insert(firstNames, null, dateOfBirth, gender, '123456789213', isINESvalid);
      } catch (error) {
        expect(error).to.be.an('Error');
      }
    });

    it('should set deleted to false by default in PG', async () => {
      const psy = await create.insertOnePsy();
      const insertedPatient = await dbPatients.insert(
        firstNames,
        lastName,
        dateOfBirth,
        gender,
        studentNumber,
        isINESvalid,
        institutionName,
        isStudentStatusVerified,
        psy.dossierNumber,
        doctorName,
      );

      expect(insertedPatient.deleted).equal(false);
    });
  });

  describe('update', () => {
    it('should Update one patient in PG', async () => {
      const psy = await create.insertOnePsy();
      await dbPatients.insert(
        firstNames,
        lastName,
        dateOfBirth,
        gender,
        studentNumber,
        isINESvalid,
        institutionName,
        isStudentStatusVerified,
        psy.dossierNumber,
        doctorName,
      );

      const newLastName = 'NewName';
      const patients = await dbPatients.getAll(psy.dossierNumber);
      const oldPatient = patients[0];

      await dbPatients.update(
        oldPatient.id,
        oldPatient.firstNames,
        newLastName,
        dateOfBirth,
        gender,
        oldPatient.INE,
        isINESvalid,
        oldPatient.institutionName,
        oldPatient.isStudentStatusVerified,
        psy.dossierNumber,
        doctorName,
      );
      const newPatient = await dbPatients.getById(oldPatient.id, psy.dossierNumber);
      expect(newPatient.lastName).equal(newLastName);
    });
  });

  describe('delete', () => {
    it('should change deleted boolean to true and update updatedAt field', async () => {
      const psy = await create.insertOnePsy();
      const patient = await dbPatients.insert(
        firstNames,
        lastName,
        dateOfBirth,
        gender,
        studentNumber,
        isINESvalid,
        institutionName,
        isStudentStatusVerified,
        psy.dossierNumber,
        doctorName,
      );

      const patientBeforeDelete = await dbPatients.getById(patient.id, psy.dossierNumber);

      assert.isNull(patientBeforeDelete.updatedAt);
      assert.isFalse(patientBeforeDelete.deleted);
      await dbPatients.delete(patientBeforeDelete.id, psy.dossierNumber);

      const patientAfterDelete = await dbPatients.getById(patient.id, psy.dossierNumber);
      assert.isTrue(patientAfterDelete.deleted);
      assert.isNotNull(patientAfterDelete.updatedAt);
    });
  });

  describe('getAll', () => {
    it('should return psy patients', async () => {
      const psy = await create.insertOnePsy();
      await dbPatients.insert(
        firstNames,
        lastName,
        dateOfBirth,
        gender,
        studentNumber,
        isINESvalid,
        institutionName,
        isStudentStatusVerified,
        psy.dossierNumber,
        doctorName,
      );
      await dbPatients.insert(
        firstNames,
        lastName,
        dateOfBirth,
        gender,
        anotherStudentNumber,
        isINESvalid,
        institutionName,
        isStudentStatusVerified,
        psy.dossierNumber,
        doctorName,
      );

      const patients = (await dbPatients.getAll(psy.dossierNumber))
      .sort((a, b) => parseInt(a.appointmentsCount) - parseInt(b.appointmentsCount));
      expect(patients).to.have.length(2);
    });

    it('should not return deleted patients', async () => {
      const psy = await create.insertOnePsy();
      const patient = await dbPatients.insert(
        firstNames,
        lastName,
        dateOfBirth,
        gender,
        studentNumber,
        isINESvalid,
        institutionName,
        isStudentStatusVerified,
        psy.dossierNumber,
        doctorName,
      );
      await dbPatients.delete(patient.id, psy.dossierNumber);

      const patients = await dbPatients.getAll(psy.dossierNumber);
      expect(patients).to.have.length(0);
    });
  });
});
