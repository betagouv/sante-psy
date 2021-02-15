require('dotenv').config();

const config = require('../utils/config');
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
    await knex("ds_api_cursor").select()
        .orderBy("date", "desc")

    //get last cursor saved
    const lastCursor = await knex("ds_cursor")
    .select('updated_at')
    .where("cursor", "cursor");

    console.debug(`got the latest cursor saved in PG ${lastCursor}`);

    return lastCursor;
  } catch (err) {
    console.error(`Impossible de récupèrer le dernier cursor de l'api DS`, err)
    throw new Error(`Impossible de récupèrer le dernier cursor de l'api DS`)
  }
}

async function saveLatestCursorSaved() {
  try {
    const now = Date.now()

    const updateQuery = await knex("ds_api_cursor")
        .where("cursor", "cursor")
        .update({ "updated_at": now});

    console.debug(`latest cursor saved in PG ${updateQuery}`);
  } catch (err) {
    console.error(`Impossible de sauvegarder le dernier cursor de l'api DS`, err)
    throw new Error(`Impossible de sauvegarder le dernier cursor de l'api DS`)
  }
}

/**
 * http://knexjs.org/#Utility-BatchInsert
 * @param {*} psy 
 */
async function savePsychologistInPG(psyList) {
  const chunkSize = 1000
  const batchInsert = await knex("psychologists")
  .batchInsert(psyList, chunkSize);

  console.log(`Batch insert of ${psyList.length} psychologists into PG done`);
}

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
    console.error("Could import DS API data to PG", err)
  }
}
