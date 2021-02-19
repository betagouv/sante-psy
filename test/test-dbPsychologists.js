const assert = require('chai').assert;
require('dotenv').config();
const rewire = require('rewire');
const dbPsychologists = require('../db/psychologists')
const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig);
const demarchesSimplifiees = rewire('../utils/demarchesSimplifiees.js');
const clean = require('./helper/clean');

describe('DB Psychologists', () => {
  const getUuidDossierNumber = demarchesSimplifiees.__get__('getUuidDossierNumber');
  const dossierNumber = getUuidDossierNumber(1);

  const psyList = [
    {
      dossierNumber: dossierNumber,
      firstNames: 'First second',
      lastName: 'Last',
      adeli: "829302942",
      address: 'SSR CL AL SOLA 66110 MONTBOLO',
      diploma: "Psychologie clinique de la santé",
      phone: '0468396600',
      email: 'psychologue.test@apas82.mssante.fr',
      website: 'apas82.mssante.fr',
      teleconsultation: true,
      description: "description",
      // eslint-disable-next-line max-len
      training: "[\"Connaissance et pratique des outils diagnostic psychologique\",\"Connaissance des troubles psychopathologiques du jeune adulte : dépressions\",\"risques suicidaires\",\"addictions\",\"comportements à risque\",\"troubles alimentaires\",\"décompensation schizophrénique\",\"psychoses émergeantes ainsi qu’une pratique de leur repérage\",\"Connaissance et pratique des dispositifs d’accompagnement psychologique et d’orientation (CMP...)\"]",
      departement: "14 - Calvados",
      region: "Normandie",
      languages: "Français ,Anglais, et Espagnol"
    }];

  async function testDataPsychologistsExist() {
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
      console.log("shouldBeZero", shouldBeZero);
      shouldBeZero.should.be.equal('0');

      await dbPsychologists.savePsychologistInPG(psyList);
      const shouldBeOne = await dbPsychologists.getNumberOfPsychologists();
      console.log("shouldBeOne", shouldBeOne);
      shouldBeOne.should.be.equal('1');
    });
  });
});