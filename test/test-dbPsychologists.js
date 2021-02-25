const assert = require('chai').assert;
require('dotenv').config();
const dbPsychologists = require('../db/psychologists')
const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig);
const clean = require('./helper/clean');

describe('DB Psychologists', () => {
  const dossierNumber = clean.testDossierNumber();
  const psyList = clean.psyList();

  async function testDataPsychologistsExist() {
    console.log("dossierNumber", dossierNumber);

    const exist = await knex(dbPsychologists.psychologistsTable)
      .where('dossierNumber', dossierNumber)
      .first();

    return exist;
  }

  //Clean up all data
  beforeEach(async function before() {
    await clean.cleanDataCursor();
    await clean.cleanDataPsychologist(dossierNumber);
  })

  describe('savePsychologistInPG', () => {
    it('should INsert one psychologist in PG', async () => {
      await dbPsychologists.savePsychologistInPG(psyList);

      const psy = await testDataPsychologistsExist();
      const exist = (psy !== undefined)
      exist.should.be.equal(true);
    });

    it('should UPsert one psychologist in PG', async () => {
      //doing a classic insert
      await dbPsychologists.savePsychologistInPG(psyList);
      const psyInsert = await testDataPsychologistsExist();
      assert.isNull(psyInsert.updatedAt);

      // we do it twice in a row to UPsert it (field updatedAt will change)
      await dbPsychologists.savePsychologistInPG(psyList);
      const psyUpsert = await testDataPsychologistsExist();
      assert.isNotNull(psyUpsert.updatedAt);
    });
  });

  describe("getNumberOfPsychologists", () => {
    it("should return the number of elements in the psychologists table", async () => {
      const shouldBeZero = await dbPsychologists.getNumberOfPsychologists();
      shouldBeZero[0].count.should.be.equal('0');

      await dbPsychologists.savePsychologistInPG(psyList);
      const shouldBeOne = await dbPsychologists.getNumberOfPsychologists();
      shouldBeOne[0].count.should.be.equal('1');
      shouldBeOne[0].archived.should.be.equal(psyList[0].archived);
      shouldBeOne[0].state.should.be.equal(psyList[0].state);
    });
  });

  describe("getPsychologists", () => {
    it("should return not archived and accepte psychologists", async () => {
      let archivedPsy = psyList[0];
      archivedPsy.archived = true;
      let constructionPsy = psyList[0];
      constructionPsy.state = "en_construction";

      await dbPsychologists.savePsychologistInPG(psyList);
      await dbPsychologists.savePsychologistInPG(constructionPsy);
      await dbPsychologists.savePsychologistInPG(archivedPsy);

      const shouldBeOne = await dbPsychologists.getPsychologists();
      shouldBeOne.should.be.equal('1');
      shouldBeOne[0].state = 'accepte';
      shouldBeOne[0].archived = false;
    });
  });
});