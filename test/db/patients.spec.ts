import { assert, expect } from 'chai';
import dbPatients from '../../db/patients';
import date from '../../utils/date';
import db from '../../db/db';
import clean from '../helper/clean';
import { patientsTable } from '../../db/tables';

import dotEnv from 'dotenv';

dotEnv.config();

describe('DB Patients', () => {
  const firstNames = 'Harry James';
  const lastName = 'Potter';
  const studentNumber = '12345678901';
  const institutionName = 'Pouldard';
  const isStudentStatusVerified = false;
  const hasPrescription = false;
  const doctorName = 'doctorName';
  const doctorAddress = 'doctorAddress';
  const dateOfBirth = date.parseForm('20/01/1980');
  const tooOld = date.parseForm('20/01/1900');
  const tooYoung = date.parseForm('20/01/2017');

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
    await clean.cleanAllPatients();
  });

  describe('insert', () => {
    it('should insert one patient in PG', async () => {
      const psy = await clean.insertOnePsy();
      await dbPatients.insert(
        firstNames,
        lastName,
        studentNumber,
        institutionName,
        isStudentStatusVerified,
        hasPrescription,
        psy.dossierNumber,
        doctorName,
        doctorAddress,
        dateOfBirth,
      );

      const exist = await testDataPatientsExist(lastName);
      exist.should.be.equal(true);
    });

    it('should not insert if age > 100', async () => {
      const psy = await clean.insertOnePsy();
      try {
        await dbPatients.insert(
          firstNames,
          lastName,
          studentNumber,
          institutionName,
          isStudentStatusVerified,
          hasPrescription,
          psy.dossierNumber,
          doctorName,
          doctorAddress,
          tooOld,
        );
        assert.fail('insert patient should have failed');
      } catch (error) {
        expect(error).to.be.an('Error');
      }
    });

    it('should not insert if age < 10', async () => {
      const psy = await clean.insertOnePsy();
      try {
        await dbPatients.insert(
          firstNames,
          lastName,
          studentNumber,
          institutionName,
          isStudentStatusVerified,
          hasPrescription,
          psy.dossierNumber,
          doctorName,
          doctorAddress,
          tooYoung,
        );
        assert.fail('insert patient should have failed');
      } catch (error) {
        expect(error).to.be.an('Error');
      }
    });

    it('should accept insert INE with more than 11 characters in PG', async () => {
      const psy = await clean.insertOnePsy();
      try {
        await dbPatients.insert(
          firstNames,
          lastName,
          '1'.repeat(12),
          institutionName,
          isStudentStatusVerified,
          hasPrescription,
          psy.dossierNumber,
          doctorName,
          doctorAddress,
          dateOfBirth,
        );
        const exist = await testDataPatientsExist(lastName);
        exist.should.be.equal(true);
      } catch (error) {
        expect(error).to.be.an('Error');
      }
    });

    it('should refuse insert for INE with more than 50 characters in PG', async () => {
      const psy = await clean.insertOnePsy();
      try {
        await dbPatients.insert(
          firstNames,
          lastName,
          '1'.repeat(51),
          institutionName,
          isStudentStatusVerified,
          hasPrescription,
          psy.dossierNumber,
          doctorName,
          doctorAddress,
          dateOfBirth,
        );
        assert.fail('insert patient should have failed');
      } catch (error) {
        expect(error).to.be.an('Error');
      }
    });

    it('should refuse insert without mandatory params in PG', async () => {
      try {
        await dbPatients.insert(firstNames, studentNumber);
      } catch (error) {
        expect(error).to.be.an('Error');
      }
    });

    it('should set deleted to false by default in PG', async () => {
      const psy = await clean.insertOnePsy();
      const insertedPatient = await dbPatients.insert(
        firstNames,
        lastName,
        studentNumber,
        institutionName,
        isStudentStatusVerified,
        hasPrescription,
        psy.dossierNumber,
        doctorName,
        doctorAddress,
        dateOfBirth,
      );

      expect(insertedPatient.deleted).equal(false);
    });
  });

  describe('update', () => {
    it('should Update one patient in PG', async () => {
      const psy = await clean.insertOnePsy();
      await dbPatients.insert(
        firstNames,
        lastName,
        studentNumber,
        institutionName,
        isStudentStatusVerified,
        hasPrescription,
        psy.dossierNumber,
        doctorName,
        doctorAddress,
        dateOfBirth,
      );

      const newLastName = 'NewName';
      const patients = await dbPatients.getAll(psy.dossierNumber);
      const oldPatient = patients[0];

      await dbPatients.update(
        oldPatient.id,
        oldPatient.firstNames,
        newLastName,
        oldPatient.INE,
        oldPatient.institutionName,
        oldPatient.isStudentStatusVerified,
        oldPatient.hasPrescription,
        psy.dossierNumber,
        doctorName,
        doctorAddress,
        dateOfBirth,
      );
      const newPatient = await dbPatients.getById(oldPatient.id, psy.dossierNumber);
      expect(newPatient.lastName).equal(newLastName);
    });
  });

  describe('delete', () => {
    it('should change deleted boolean to true and update updatedAt field', async () => {
      const psy = await clean.insertOnePsy();
      const patient = await dbPatients.insert(
        firstNames,
        lastName,
        studentNumber,
        institutionName,
        isStudentStatusVerified,
        hasPrescription,
        psy.dossierNumber,
        doctorName,
        doctorAddress,
        dateOfBirth,
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
    it('should return patients', async () => {
      const psy = await clean.insertOnePsy();
      await dbPatients.insert(
        firstNames,
        lastName,
        studentNumber,
        institutionName,
        isStudentStatusVerified,
        hasPrescription,
        psy.dossierNumber,
        doctorName,
        doctorAddress,
        dateOfBirth,
      );

      const patients = await dbPatients.getAll(psy.dossierNumber);
      expect(patients).to.have.length(1);
    });

    it('should not return deleted patients', async () => {
      const psy = await clean.insertOnePsy();
      const patient = await dbPatients.insert(
        firstNames,
        lastName,
        studentNumber,
        institutionName,
        isStudentStatusVerified,
        hasPrescription,
        psy.dossierNumber,
        doctorName,
        doctorAddress,
        dateOfBirth,
      );
      await dbPatients.delete(patient.id, psy.dossierNumber);

      const patients = await dbPatients.getAll(psy.dossierNumber);
      expect(patients).to.have.length(0);
    });
  });
});
