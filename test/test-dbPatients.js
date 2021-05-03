const { assert } = require('chai');
const { expect } = require('chai');
require('dotenv').config();
const dbPatients = require('../db/patients');
const date = require('../utils/date');
const knexConfig = require('../knexfile');
const knex = require('knex')(knexConfig);
const clean = require('./helper/clean');

describe('DB Patients', () => {
  const firstNames = 'Harry James';
  const lastName = 'Potter';
  const studentNumber = '12345678901';
  const institutionName = 'Pouldard';
  const isStudentStatusVerified = false;
  const hasPrescription = false;
  const doctorName = 'doctorName';
  const doctorAddress = 'doctorAddress';
  const dateOfBirth = date.parseDateForm('20/01/1980');

  async function testDataPatientsExist(lastName) {
    const exist = await knex(dbPatients.patientsTable)
      .where('lastName', lastName)
      .first();
    if (exist) {
      return true;
    }
    return false;
  }

  // Clean up all data
  afterEach(async () => {
    await clean.cleanAllPatients(lastName);
  });

  describe('insertPatientInPG', () => {
    it('should INsert one patient in PG', async () => {
      const psychologistId = '357a2085-6d32-44db-8fe6-979c7339fd47';
      await dbPatients.insertPatient(
        firstNames,
        lastName,
        studentNumber,
        institutionName,
        isStudentStatusVerified,
        hasPrescription,
        psychologistId,
        doctorName,
        doctorAddress,
        dateOfBirth,
      );

      const exist = await testDataPatientsExist(lastName);
      exist.should.be.equal(true);
    });

    it('should accept INsert INE with more than 11 characters in PG', async () => {
      const psychologistId = '357a2085-6d32-44db-8fe6-979c7339fd47';
      try {
        await dbPatients.insertPatient(
          firstNames,
          lastName,
          '1'.repeat(12),
          institutionName,
          isStudentStatusVerified,
          hasPrescription,
          psychologistId,
          doctorName,
          doctorAddress,
        );
        const exist = await testDataPatientsExist(lastName);
        exist.should.be.equal(true);
      } catch (error) {
        expect(error).to.be.an('Error');
      }
    });

    it('should refuse INsert for INE with more than 50 characters in PG', async () => {
      const psychologistId = '357a2085-6d32-44db-8fe6-979c7339fd47';
      try {
        await dbPatients.insertPatient(
          firstNames,
          lastName,
          '1'.repeat(51),
          institutionName,
          isStudentStatusVerified,
          hasPrescription,
          psychologistId,
          doctorName,
          doctorAddress,
          dateOfBirth,
        );
        assert.fail('insert patient should have failed');
      } catch (error) {
        expect(error).to.be.an('Error');
      }
    });

    it('should refuse INsert without mandatory params in PG', async () => {
      try {
        await dbPatients.insertPatient(firstNames, studentNumber);
      } catch (error) {
        expect(error).to.be.an('Error');
      }
    });
  });

  describe('updatePatientInPG', () => {
    it('should Update one patient in PG', async () => {
      const psychologistId = '357a2085-6d32-44db-8fe6-979c7339fd47';
      await dbPatients.insertPatient(
        firstNames,
        lastName,
        studentNumber,
        institutionName,
        isStudentStatusVerified,
        hasPrescription,
        psychologistId,
        doctorName,
        doctorAddress,
        dateOfBirth,
      );

      const newLastName = 'NewName';
      const patients = await dbPatients.getPatients(psychologistId);
      const oldPatient = patients[0];

      await dbPatients.updatePatient(
        oldPatient.id,
        oldPatient.firstNames,
        newLastName,
        oldPatient.studentNumber,
        oldPatient.institutionName,
        oldPatient.isStudentStatusVerified,
        oldPatient.hasPrescription,
        psychologistId,
        doctorName,
        doctorAddress,
        dateOfBirth,
      );
      const newPatient = await dbPatients.getPatientById(oldPatient.id, psychologistId);
      expect(newPatient.lastName).equal(newLastName);
    });
  });
});
