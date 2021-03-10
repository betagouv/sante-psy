const assert = require('chai').assert;
require('dotenv').config();
const dbPsychologists = require('../db/psychologists')
const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig);
const clean = require('./helper/clean');

describe('DB Psychologists', () => {
  const dossierNumber = clean.testDossierNumber();
  let psyList;

  async function testDataPsychologistsExist() {
    console.log("dossierNumber", dossierNumber);

    const exist = await knex(dbPsychologists.psychologistsTable)
      .where('dossierNumber', dossierNumber)
      .first();

    return exist;
  }

  //Clean up all data
  beforeEach(async function before() {
    psyList = clean.psyList();
    await clean.cleanAllPsychologists();
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
      assert(shouldBeZero.length === 0);

      await dbPsychologists.savePsychologistInPG(psyList);
      const shouldBeOne = await dbPsychologists.getNumberOfPsychologists();
      shouldBeOne[0].count.should.be.equal('1');
      shouldBeOne[0].archived.should.be.equal(psyList[0].archived);
      shouldBeOne[0].state.should.be.equal(psyList[0].state);
    });
  });

  describe("getPsychologists", () => {
    it("should only return not archived and accepte psychologists with capitalized lastName", async () => {
      let archivedPsy = Object.assign({}, psyList[0]);
      archivedPsy.archived = true;
      archivedPsy.lastName = "ArchivedPsy";
      archivedPsy.dossierNumber = "34e6352f-bdd0-48ce-83de-8de71cad295b";
      let constructionPsy = Object.assign({}, psyList[0]);
      constructionPsy.state = "en_construction";
      constructionPsy.lastName = "ConstructionPsy";
      constructionPsy.dossierNumber = "a2e447cd-2d57-4f83-8884-ab05a2633644";

      await dbPsychologists.savePsychologistInPG([psyList[0], archivedPsy, constructionPsy]);

      const shouldBeOne = await dbPsychologists.getPsychologists();
      shouldBeOne.length.should.be.equal(1);
      shouldBeOne[0].lastName.should.be.equal(psyList[0].lastName.toUpperCase());
      assert(shouldBeOne[0].loginEmail === undefined);
    });
  });

  describe("getPsychologistByEmail", () => {
    it("should return a psy if we enter a known login email", async () => {
      await dbPsychologists.savePsychologistInPG(psyList);
      const psy = await dbPsychologists.getPsychologistByEmail(psyList[0].personalEmail);
      psy.email.should.be.equal(psyList[0].email);
      psy.personalEmail.should.be.equal(psyList[0].personalEmail);
    });

    it("should return undefined if we enter a unknown email", async () => {
      const unknownPsy = await dbPsychologists.getPsychologistByEmail("unknown@unknown.org")

      assert(undefined === unknownPsy);
    });

    it("should return undefined if we dont use 'personalEmail' but 'email' as the login", async () => {
      await dbPsychologists.savePsychologistInPG(psyList);
      const unknownPsy = await dbPsychologists.getPsychologistByEmail(psyList[0].email);
      assert(undefined === unknownPsy);
    });

    it("should return undefined if known email but not accepte state", async () => {
      psyList[0].state = 'en_construction';
      await dbPsychologists.savePsychologistInPG(psyList);
      const unknownPsy = await dbPsychologists.getPsychologistByEmail(psyList[0].personalEmail);
      assert(undefined === unknownPsy);
    });
  });
});