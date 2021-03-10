const assert = require('chai').assert;
const expect = require('chai').expect;
require('dotenv').config();
const dbPatients = require('../db/patients')
const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig);
const clean = require('./helper/clean');

describe('DB Patients', () => {
  const firstNames = "James E."
  const lastName = "Bond"
  const studentNumber = "12345678901"
  const doctorId = '340a2085-6d32-44db-8fe6-979c7339fd47'
  async function testDataPatientsExist(lastName) {

    const exist = await knex(dbPatients.patientsTable)
      .where('lastName', lastName)
      .first();
    if(exist) {
      return true
    }
    return false;
  }

  //Clean up all data
  afterEach(async function before() {
    await clean.cleanDataPatient(lastName);
  })

  describe('insertPatientInPG', () => {
    it('should INsert one patient in PG', async () => {
      const psychologistId = '357a2085-6d32-44db-8fe6-979c7339fd47'
      await dbPatients.insertPatient(firstNames, lastName, studentNumber, psychologistId, doctorId);

      const exist = await testDataPatientsExist(lastName);
      exist.should.be.equal(true);
    });

    it('should refuse INsert INE with more than 11 characters in PG', async () => {
      const psychologistId = '357a2085-6d32-44db-8fe6-979c7339fd47'
      try {
        await dbPatients.insertPatient(firstNames, lastName, "111111111111", psychologistId, doctorId);
        assert.fail("insert patient should have failed");
      } catch( error ) {
        expect(error).to.be.an('Error');
      }
    });

    it('should refuse INsert without mandatory params in PG', async () => {
      try {
        await dbPatients.insertPatient(firstNames, studentNumber);
      } catch( error ) {
        expect(error).to.be.an('Error');
      }
    });
  });

  describe('updatePatientInPG', () => {
    it('should Update one patient in PG', async () => {
      const psychologistId = '357a2085-6d32-44db-8fe6-979c7339fd47'
      await dbPatients.insertPatient(firstNames, lastName, studentNumber, psychologistId, doctorId);

      const newLastName = "NewName"
      const patients = await dbPatients.getPatients(psychologistId)
      const oldPatient = patients[0]

      await dbPatients.updatePatient(
        oldPatient.id,
        oldPatient.firstNames,
        newLastName,
        oldPatient.studentNumber,
        psychologistId,
        doctorId,
      )
      const updatedPatient = await dbPatients.getPatientById(oldPatient.id, psychologistId)

      expect(updatedPatient.lastName).equal(newLastName)
      expect(updatedPatient.firstNames).equal(firstNames)
      expect(updatedPatient.INE).equal(studentNumber)
      expect(updatedPatient.psychologistId).equal(psychologistId)
      expect(updatedPatient.doctorId).equal(doctorId)
    });
  });
});