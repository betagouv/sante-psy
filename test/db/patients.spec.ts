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
  const studentNumber = '12345678901';
  const anotherStudentNumber = '10987654321';
  const institutionName = 'Pouldard';
  const isStudentStatusVerified = false;
  const doctorName = 'doctorName';
  const doctorAddress = 'doctorAddress';
  const doctorEmail = '';
  const dateOfBirth = new Date('1980/01/20');

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
        studentNumber,
        institutionName,
        isStudentStatusVerified,
        psy.dossierNumber,
        doctorName,
        doctorAddress,
        doctorEmail,
        dateOfBirth,
      );

      const exist = await testDataPatientsExist(lastName);
      exist.should.be.equal(true);
    });

    it('should accept insert INE with more than 11 characters in PG', async () => {
      const psy = await create.insertOnePsy();
      try {
        await dbPatients.insert(
          firstNames,
          lastName,
          '1'.repeat(12),
          institutionName,
          isStudentStatusVerified,
          psy.dossierNumber,
          doctorName,
          doctorAddress,
          doctorEmail,
          dateOfBirth,
        );
        const exist = await testDataPatientsExist(lastName);
        exist.should.be.equal(true);
      } catch (error) {
        expect(error).to.be.an('Error');
      }
    });

    it('should refuse insert for INE with more than 50 characters in PG', async () => {
      const psy = await create.insertOnePsy();
      try {
        await dbPatients.insert(
          firstNames,
          lastName,
          '1'.repeat(51),
          institutionName,
          isStudentStatusVerified,
          psy.dossierNumber,
          doctorName,
          doctorAddress,
          doctorEmail,
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
      const psy = await create.insertOnePsy();
      const insertedPatient = await dbPatients.insert(
        firstNames,
        lastName,
        studentNumber,
        institutionName,
        isStudentStatusVerified,
        psy.dossierNumber,
        doctorName,
        doctorAddress,
        doctorEmail,
        dateOfBirth,
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
        studentNumber,
        institutionName,
        isStudentStatusVerified,
        psy.dossierNumber,
        doctorName,
        doctorAddress,
        doctorEmail,
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
        psy.dossierNumber,
        doctorName,
        doctorAddress,
        doctorEmail,
        dateOfBirth,
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
        studentNumber,
        institutionName,
        isStudentStatusVerified,
        psy.dossierNumber,
        doctorName,
        doctorAddress,
        doctorEmail,
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
    it('should return psy patients', async () => {
      const psy = await create.insertOnePsy();
      await dbPatients.insert(
        firstNames,
        lastName,
        studentNumber,
        institutionName,
        isStudentStatusVerified,
        psy.dossierNumber,
        doctorName,
        doctorAddress,
        doctorEmail,
        dateOfBirth,
      );
      await dbPatients.insert(
        firstNames,
        lastName,
        anotherStudentNumber,
        institutionName,
        isStudentStatusVerified,
        psy.dossierNumber,
        doctorName,
        doctorAddress,
        doctorEmail,
        dateOfBirth,
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
        studentNumber,
        institutionName,
        isStudentStatusVerified,
        psy.dossierNumber,
        doctorName,
        doctorAddress,
        doctorEmail,
        dateOfBirth,
      );
      await dbPatients.delete(patient.id, psy.dossierNumber);

      const patients = await dbPatients.getAll(psy.dossierNumber);
      expect(patients).to.have.length(0);
    });
  });
});
