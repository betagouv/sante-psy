const assert = require('chai').assert;
require('dotenv').config();
const rewire = require('rewire');
const should = require('chai').should();
const date = require('../utils/date');
const db = require("../utils/db");
const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig);
const importDataFromDS = rewire('../cron_jobs/importDataFromDS.js');

/**
 * @TODO before each reinitialize PG data
 */
describe('Import Data from DS to PG', () => {
/*   //Clean up all data
  beforeEach(async function(done) {
    const ifExist = await knex(db.ds_api_cursor)
    .where('id', 1)
    .first();

    if( ifExist ) {
      await knex(db.ds_api_cursor)
      .where('id', 1)
      .del();

      done()
    } else {
      done()
    }
  }) */

  describe('getLatestCursorSaved', () => {
    it('should return undefined if there is not', async () => {
      const getLatestCursorSaved = importDataFromDS.__get__('getLatestCursorSaved');
      const output = await getLatestCursorSaved();

      assert(output, undefined);
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
    it('should call batchInsert on PG', async () => {
      const psyList = [
        {
          name:'First Last',
          adeliNumber: "829302942",
          address: 'SSR CL AL SOLA 66110 MONTBOLO',
          diploma: "Psychologie clinique de la santé",
          phone: '0468396600',
          email: 'psychologue.test@apas82.mssante.fr',
          website: 'apas82.mssante.fr',
          teleconsultation: true,
          description: "description",
          training: [
            "Connaissance et pratique des outils diagnostic psychologique",
            "Connaissance des troubles psychopathologiques du jeune adulte : dépressions",
            "risques suicidaires",
            "addictions",
            "comportements à risque",
            "troubles alimentaires",
            "décompensation schizophrénique",
            "psychoses émergeantes ainsi qu’une pratique de leur repérage",
            "Connaissance et pratique des dispositifs d’accompagnement psychologique et d’orientation (CMP...)",
          ],
          departement: "14 - Calvados",
          region: "Normandie",
          languages: "Français ,Anglais, et Espagnol"
        }];

      const savePsychologistInPG = importDataFromDS.__get__('savePsychologistInPG');
      const output = await savePsychologistInPG(psyList);

      console.log("output", output);

      assert.equal(true , false);
    });
  });
});