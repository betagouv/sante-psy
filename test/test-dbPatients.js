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
  beforeEach(async function before() {
    await clean.cleanDataPatient(lastName);
  })

  describe('insertPatientInPG', () => {
    it('should INsert one patient in PG', async () => {

      await dbPatients.insertPatient(firstNames, lastName, studentNumber);

      const exist = await testDataPatientsExist(lastName);
      exist.should.be.equal(true);
    });

    it('should refuse INsert INE with more than 11 characters in PG', async () => {
      try {
        await dbPatients.insertPatient(firstNames, lastName, "111111111111");
        assert.fail("insert patient should have failed");
      } catch( error ) {
        expect(error).to.be.an('Error');
      }
    });

    it('should refuse INsert without mandatory params in PG', async () => {
      await dbPatients.insertPatient(firstNames, studentNumber);

      const exist = await testDataPatientsExist(lastName);
      exist.should.be.equal(false);
    });
  });
});