const assert = require('chai').assert;
const expect = require('chai').expect;
require('dotenv').config();
const dbPatients = require('../db/patients')
const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig);
const clean = require('./helper/clean');

describe('DB Patients', () => {
  const firstNames = "Harry James"
  const lastName = "Potter"
  const studentNumber = "12345678901"
  const institutionName = "Pouldard"
  const hasJustification = false
  const hasPrescription = false

  async function testDataPatientsExist(lastName) {

    const exist = await knex(dbPatients.patientsTable)
      .where('lastName', lastName)
      .first();
    console.log(exist)
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
      await dbPatients.insertPatient(
        firstNames,
        lastName,
        studentNumber,
        institutionName,
        hasJustification,
        hasPrescription,
        psychologistId
      );

      const exist = await testDataPatientsExist(lastName);
      exist.should.be.equal(true);
    });

    it('should refuse INsert INE with more than 11 characters in PG', async () => {
      const psychologistId = '357a2085-6d32-44db-8fe6-979c7339fd47'
      try {
        await dbPatients.insertPatient(
          firstNames,
          lastName,
          "11111111111111111",
          institutionName,
          hasJustification,
          hasPrescription,
          psychologistId
        );
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
      await dbPatients.insertPatient(
        firstNames,
        lastName,
        studentNumber,
        institutionName,
        hasJustification,
        hasPrescription,
        psychologistId
      );

      const newLastName = "NewName"
      const patients = await dbPatients.getPatients(psychologistId)
      const oldPatient = patients[0]

      await dbPatients.updatePatient(
        oldPatient.id,
        oldPatient.firstNames,
        newLastName,
        oldPatient.studentNumber,
        oldPatient.institutionName,
        oldPatient.hasJustification,
        oldPatient.hasPrescription,
        psychologistId,
      )
      const newPatient = await dbPatients.getPatientById(oldPatient.id, psychologistId)
      expect(newPatient.lastName).equal(newLastName)
    });
  });
});