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
    it('should return psy patients with not deleted appointments', async () => {
      const psy = await clean.insertOnePsy();
      const anotherPsy = await clean.insertOnePsy('another@mail.fr');
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
      const patient2 = await dbPatients.insert(
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

      const anotherPatient = await dbPatients.insert(
        firstNames,
        lastName,
        studentNumber,
        institutionName,
        isStudentStatusVerified,
        hasPrescription,
        anotherPsy.dossierNumber,
        doctorName,
        doctorAddress,
        dateOfBirth,
      );

      await Promise.all([
        clean.insertOneAppointment(patient.id, psy.dossierNumber),
        clean.insertOneAppointment(patient.id, psy.dossierNumber),
        clean.insertOneAppointment(patient.id, psy.dossierNumber, 10, 10, true),

        clean.insertOneAppointment(anotherPatient.id, anotherPsy.dossierNumber),
        clean.insertOneAppointment(anotherPatient.id, anotherPsy.dossierNumber),
        clean.insertOneAppointment(anotherPatient.id, anotherPsy.dossierNumber),

        clean.insertOneAppointment(patient2.id, psy.dossierNumber),
        clean.insertOneAppointment(patient2.id, psy.dossierNumber),
        clean.insertOneAppointment(patient2.id, psy.dossierNumber),
      ]);

      const patients = (await dbPatients.getAll(psy.dossierNumber))
      .sort((a, b) => parseInt(a.appointmentsCount) - parseInt(b.appointmentsCount));
      expect(patients).to.have.length(2);
      patients[0].appointmentsCount.should.eq('2');
      patients[1].appointmentsCount.should.eq('3');
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
