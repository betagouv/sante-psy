require('dotenv').config();

const config = require('../utils/config');
const date = require('../utils/date');
const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig);
const demarchesSimplifiees = require('../utils/demarchesSimplifiees');

/**
 * l'API DS nous retourne 100 éléments à chaque appel, et nous indique la page où l'on se trouve
 * en stockant la dernière page lue (cursor), on limite le nombre d'appel à l'API en ne lisant que
 * les pages necessaires
 */
async function getLatestCursorSaved() {
  try {
    //get last cursor saved
    const lastCursor = await knex("ds_api_cursor").first();

    console.debug(`got the latest cursor saved in PG ${JSON.stringify(lastCursor)}`);
    if( lastCursor ) {
      return lastCursor.cursor;
    } else {
      return undefined;
    }
  } catch (err) {
    console.error(`Impossible de récupèrer le dernier cursor de l'api DS, le cron ne va pas utilser de cursor`, err)

    return undefined; //not a blocking error
  }
}

async function saveLatestCursorSaved(cursor) {
  try {
    const now = date.getDateNowPG();

    const alreadySavedCursor = await getLatestCursorSaved();
    if( alreadySavedCursor ) {
      console.debug(`Updating the cursor ${cursor} in PG`);
      return await knex("ds_api_cursor")
      .where("id", 1)
      .update({
        "cursor": cursor,
        "updated_at": now
      });
    } else { // no cursor already saved, we are going to create one entry
      console.debug(`Saving a new cursor ${cursor} to PG`);

      return await knex("ds_api_cursor").insert({
        "cursor": cursor,
        "updated_at": now
      });
    }
  } catch (err) {
    console.error(`Impossible de sauvegarder le dernier cursor ${cursor} de l'api DS`, err)
    throw new Error(`Impossible de sauvegarder le dernier cursor de l'api DS`)
  }
}

/**
 * http://knexjs.org/#Utility-BatchInsert
 * It's primarily designed to be used when you have thousands of rows to insert into a table.
 * @param {*} psy 
 */
async function savePsychologistInPG(psyList) {
  const chunkSize = 1000
  console.log(`Batch insert of ${psyList.length} psychologists into PG....`);
  const batchInsert = await knex.batchInsert("psychologists", psyList, chunkSize);
  console.log(`Batch insert into PG : done`);

  return batchInsert;
}

/**
 * @TODO Some data can be modified after been loaded inside PG
 * We need to re import them all from time to time
 * 
 */
module.exports.importDataFromDSToPG = async () => {
  try {
    console.log("Starting importDataFromDSToPG...");
    const latestCursorInPG = await getLatestCursorSaved();
    console.log("Latest cursor", latestCursorInPG);
    //@TODO case where the last page is already saved ?
    const { psychologists, latestCursorInDS } = await demarchesSimplifiees.getPsychologistList(latestCursorInPG);

    if(psychologists.length > 0) {
      await savePsychologistInPG(psychologists);
      await saveLatestCursorSaved(latestCursorInDS);
    } else {
      console.log("No psychologists to save");
    }
  } catch (err) {
    console.error("ERROR: Could not import DS API data to PG", err)
  }
}
