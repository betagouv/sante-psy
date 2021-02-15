require('dotenv').config();

const { CronJob } = require('cron');
const config = require('../utils/config');
const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig);
const demarchesSimplifiees = require('../utils/demarchesSimplifiees');

module.exports.getLatestCursorSaved = async function getLatestCursorSaved() {
  try {
    await knex("appointments").select()
        .orderBy("date", "desc")

    //get last cursor saved
    const lastCursor = await knex("ds_cursor").max('updated_at').
        limit(1);

    return lastCursor;
  } catch (err) {
    console.error(`Impossible de récupérer le dernier cursor de l'api DS`, err)
    throw new Error(`Impossible de récupérer le dernier cursor de l'api DS`)
  }

}

module.exports.importDataFromDStoPG = new CronJob(
  '0 */4 * * * *',
  module.exports.createEmailAddresses,
  null,
  true,
  'Europe/Paris',
);