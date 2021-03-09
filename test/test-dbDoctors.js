const assert = require('chai').assert;
const expect = require('chai').expect;
require('dotenv').config();
const dbDoctors = require('../db/doctors');
const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig);
const clean = require('./helper/clean');

describe('DB Doctors', () => {
  const firstNames = "Sigmund"
  const lastName = "Freud"
  const address = "7 Rue Rose 33300 Bordeaux"
  const phone = "0600000000"

  async function testDataDoctorsExist(lastName) {

    const exist = await knex(dbDoctors.doctorsTable)
      .where('lastName', lastName)
      .first();
    if(exist) {
      return true;
    }
    return false;
  }

  //Clean up all data
  afterEach(async function before() {
    await clean.cleanDataDoctors(lastName);
  })

  describe('insertDoctor', () => {
    it('should INsert one patient in PG', async () => {
      await dbDoctors.insertDoctor(firstNames, lastName, address, phone);

      const exist = await testDataDoctorsExist(lastName);
      exist.should.be.equal(true);
    });
  });

  describe('updateDoctor', () => {
    it('should Update one doctor in PG', async () => {
      await dbDoctors.insertDoctor(firstNames, lastName, address, phone);

      const newLastName = "NewName"
      const doctors = await dbDoctors.getDoctors()
      const oldDoctor = doctors[0]

      await dbDoctors.updateDoctor(
        oldDoctor.id,
        oldDoctor.firstNames,
        newLastName,
        oldDoctor.address, phone,
      )
      const newDoctor = await dbDoctors.getDoctorById(oldDoctor.id)
      expect(newDoctor.lastName).equal(newLastName)
    });
  });
});