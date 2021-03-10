const assert = require('chai').assert;
const expect = require('chai').expect;
require('dotenv').config();
const dbDoctors = require('../db/doctors');
const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig);
const clean = require('./helper/clean');

describe('DB Doctors', () => {
  const psychologistId = "30e6352f-bdd0-48ce-83de-8de71cad295b";
  const firstNames = "Sigmund"
  const lastName = "Freud"
  const address = "7 Rue Rose"
  const city = "bordeaux"
  const postalCode = "33300"
  const phone = "0600000000"

  beforeEach(async function before() {
    await clean.cleanDataDoctors();
  })

  describe('insertDoctor', () => {
    it('should INsert one patient', async () => {
      const d = await dbDoctors.insertDoctor(psychologistId, firstNames, lastName, address, city, postalCode, phone);

      const exist = await dbDoctors.getDoctorById(d.id)
      exist.firstNames.should.be.equal(firstNames);
      exist.lastName.should.be.equal(lastName);
      exist.address.should.be.equal(address);
      exist.city.should.be.equal("Bordeaux");
      exist.postalCode.should.be.equal(postalCode);
      exist.phone.should.be.equal(phone);
    });
  });

  describe('updateDoctor', () => {
    it('should Update one doctor', async () => {
      const d =  await dbDoctors.insertDoctor(psychologistId, firstNames, lastName, address, city, postalCode, phone);
      const newLastName = "NewName";

      const beforeDoctor = await dbDoctors.getDoctorByIdAndPsyId(d.id, d.psychologistId)
      console.log("beforeDoctor",beforeDoctor)
      expect(beforeDoctor.lastName).equal(lastName)

      await dbDoctors.updateDoctor(
        d.id,
        d.psychologistId,
        d.firstNames,
        newLastName,
        d.address,
        d.city,
        d.postalCode,
        d.phone,
      )

      const updatedDoctor = await dbDoctors.getDoctorByIdAndPsyId(d.id, d.psychologistId)
      console.log("updatedDoctor ",updatedDoctor)
      expect(updatedDoctor.lastName).equal(newLastName)
    });
  });
});