const assert = require('chai').assert;
require('dotenv').config();
const dbPatients = require('../db/patients')
const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig);
const clean = require('./helper/clean');

describe('DB Patients', () => {
  const firstNames = "James E."
  const lastName = "Bond"
  const studentNumber = "12345678901"

  async function testDataPatientsExist() {
    console.log("lastName", lastName);

    const exist = await knex(dbPatients.patientsTable)
      .where('lastName', lastName)
      .first();

    return exist;
  }

  //Clean up all data
  beforeEach(async function before() {
    await clean.cleanDataPatient(lastName);
  })

  describe('insertPatientInPG', () => {
    it('should INsert one patient in PG', async () => {
      await dbPatients.insertPatient(firstNames, lastName, studentNumber);

      const patient = await testDataPatientsExist();
      const exist = (patient !== undefined)
      exist.should.be.equal(true);
    });

    it('should refuse INsert INE with more than 11 characters in PG', async () => {
      await dbPatients.insertPatient(firstNames, lastName, "1111111111111111");

      const patient = await testDataPatientsExist();
      const exist = (patient !== undefined)
      exist.should.be.equal(false);
    });

    it('should refuse INsert with only 2 params in PG', async () => {
      await dbPatients.insertPatient(firstNames, studentNumber);

      const patient = await testDataPatientsExist();
      const exist = (patient !== undefined)
      exist.should.be.equal(false);
    });
  });
});