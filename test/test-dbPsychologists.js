const assert = require('chai').assert;
require('dotenv').config();
const rewire = require('rewire');
const dbPsychologists = require('../db/psychologists')
const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig);
const clean = require('./helper/clean');

describe('DB Psychologists', () => {
  async function testDataPsychologistsExist() {
    const exist = await knex(dbPsychologists.psychologistsTable)
      .where('dossierNumber', clean.dossierNumber)
      .first();

    return exist;
  }

  //Clean up all data
  beforeEach(async function before() {
    await clean.cleanDataCursor();
    await clean.cleanDataPsychologist(clean.dossierNumber);
  })

  describe('savePsychologistInPG', () => {
    it('should INsert one psychologist in PG', async () => {
      await dbPsychologists.savePsychologistInPG(clean.psyList);

      const psy = await testDataPsychologistsExist();
      const exist = (psy !== undefined)
      exist.should.be.equal(true);
    });

    it('should UPsert one psychologist in PG', async () => {
      //doing a classic insert
      await dbPsychologists.savePsychologistInPG(clean.psyList);
      const psyInsert = await testDataPsychologistsExist();
      assert.isNull(psyInsert.updatedAt);

      // we do it twice in a row to UPsert it (field updatedAt will change)
      await dbPsychologists.savePsychologistInPG(clean.psyList);
      const psyUpsert = await testDataPsychologistsExist();
      assert.isNotNull(psyUpsert.updatedAt);
    });
  });

  describe("getNumberOfPsychologists", () => {
    it("should return the number of elements in the psychologists table", async () => {
      const shouldBeZero = await dbPsychologists.getNumberOfPsychologists();
      console.log("shouldBeZero", shouldBeZero);
      shouldBeZero.should.be.equal('0');

      await dbPsychologists.savePsychologistInPG(clean.psyList);
      const shouldBeOne = await dbPsychologists.getNumberOfPsychologists();
      console.log("shouldBeOne", shouldBeOne);
      shouldBeOne.should.be.equal('1');
    });
  });
});