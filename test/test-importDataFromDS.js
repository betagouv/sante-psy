const assert = require('chai').assert;
const chai = require('chai');
chai.should();
require('dotenv').config();
const rewire = require('rewire');
const db = require("../utils/db");
const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig);
const importDataFromDS = rewire('../cron_jobs/importDataFromDS.js');
const demarchesSimplifiees = rewire('../utils/demarchesSimplifiees.js');

/**
 * @TODO before each reinitialize PG data
 */
describe('Import Data from DS to PG', () => {
  const getUuidDossierNumber = demarchesSimplifiees.__get__('getUuidDossierNumber');
  const dossierNumber = getUuidDossierNumber(1);

  async function cleanDataCursor() {
    const ifExist = await knex(db.ds_api_cursor)
    .where('id', 1)
    .first();

    if( ifExist ) {
      await knex(db.ds_api_cursor)
      .where('id', 1)
      .del();
    } else {
      undefined;
    }
  }

  async function cleanDataPsychologist() {
    const ifExist = await knex(db.psychologists)
    .where('dossierNumber', dossierNumber)
    .first();

    if( ifExist ) {
      console.log("cleanDataPsychologist");
      const clean = await knex(db.psychologists)
      .where('dossierNumber', dossierNumber)
      .del();
      console.log("cleaned");

      return clean;
    }
  }

  async function testDataPsychologistsExist() {
    const exist = await knex(db.psychologists)
    .where('dossierNumber', dossierNumber)
    .first();

    console.log("Test data psychologists exist ? ", exist !== undefined);

    return (exist !== undefined);
  }

  //Clean up all data
  beforeEach( async function() {
    await cleanDataCursor();
    await cleanDataPsychologist();
    await testDataPsychologistsExist();
  })

  describe('getLatestCursorSaved', () => {
    it('should return undefined if there is not', async () => {
      cleanDataCursor();

      const getLatestCursorSaved = importDataFromDS.__get__('getLatestCursorSaved');
      const output = await getLatestCursorSaved();

      assert(output === undefined);
    });

    it('should return undefined if we do not want to use the cursor', async () => {
      const getLatestCursorSaved = importDataFromDS.__get__('getLatestCursorSaved');
      const output = await getLatestCursorSaved(false);

      assert(output === undefined);
    });

    it('should return the latest cursor saved', async () => {
      const saveLatestCursorSaved = importDataFromDS.__get__('saveLatestCursorSaved');
      const latestCursor = await saveLatestCursorSaved("test");

      const getLatestCursorSaved = importDataFromDS.__get__('getLatestCursorSaved');
      const output = await getLatestCursorSaved();

      assert(output, "test");
    });
  });

  describe('savePsychologistInPG', () => {
    it('should insert one psychologist in PG', async () => {
      const psyList = [
        {
          dossierNumber: dossierNumber,
          firstNames:'First second',
          lastName:'Last',
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

      const savePsychologistInPG = importDataFromDS.__get__('savePsychologistInPG');
      await savePsychologistInPG(psyList);

      const exist = await testDataPsychologistsExist();
      exist.should.be.equal(true);
    });
  });
});