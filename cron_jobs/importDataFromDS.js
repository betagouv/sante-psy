require('dotenv').config();

const config = require('../utils/config');
const date = require('../utils/date');
const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig);
const db = require("../utils/db")

const demarchesSimplifiees = require('../utils/demarchesSimplifiees');

/**
 * l'API DS nous retourne 100 éléments à chaque appel, et nous indique la page où l'on se trouve
 * en stockant la dernière page lue (cursor), on limite le nombre d'appel à l'API en ne lisant que
 * les pages necessaires
 */
async function getLatestCursorSaved() {
  try {
    //get last cursor saved
    const lastCursor = await knex(db.ds_api_cursor)
    .where("id", 1)
    .first();

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

async function getNumberOfPsychologists() {
  return await knex(db.psychologists)
  .count('email')
  .first();
}

async function saveLatestCursorSaved(cursor) {
  try {
    const now = date.getDateNowPG();

    const alreadySavedCursor = await getLatestCursorSaved();

    if( alreadySavedCursor ) {
      console.log(`Updating the cursor ${cursor} in PG`);

      return await knex(db.ds_api_cursor)
      .where("id", 1)
      .update({
        "cursor": cursor,
        "updated_at": now
      });
    } else { // no cursor already saved, we are going to create one entry
      console.log(`Saving a new cursor ${cursor} to PG`);

      return await knex(db.ds_api_cursor).insert({
        "id" : 1,
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
 * Perform a UPSERT with https://knexjs.org/#Builder-merge
 * It's primarily designed to be used when you have thousands of rows to insert/update   into a table.
 * Modifies an insert query, to turn it into an 'upsert' operation. Uses ON DUPLICATE KEY UPDATE in MySQL,
 * and adds an ON CONFLICT (columns) DO UPDATE clause to the insert statement in PostgreSQL and SQLite.
 * @param {*} psy 
 */
async function savePsychologistInPG(psyList) {
  console.log(`UPSERT of ${psyList.length} psychologists into PG....`);
  const updatedAt = date.getDateNowPG(); // use to perform UPSERT in PG

  const upsertArray = psyList.map( psy => {
    //@TODO use DS API's id instead of email
    const upsertingKey = 'email';

    return knex(db.psychologists)
    .insert(psy)
    .onConflict(upsertingKey)
    .merge({ // update every field and add updatedAt
      name : psy.name,
      address: psy.address,
      region: psy.region,
      departement: psy.departement,
      phone: psy.phone,
      website: psy.website,
      email: psy.email,
      teleconsultation: psy.teleconsultation,
      description: psy.description,
      training: psy.training,
      adeli: psy.adeli,
      diploma: psy.diploma,
      languages: psy.languages,
      updatedAt: updatedAt
    });
  });

  const query = await Promise.all(upsertArray);

  console.log(`UPSERT into PG : done`);

  return query;
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

    console.debug("Latest cursor", latestCursorInPG);
    const dsAPIData = await demarchesSimplifiees.getPsychologistList(latestCursorInPG);

    if(dsAPIData.psychologists.length > 0) {
      await savePsychologistInPG(dsAPIData.psychologists);
      await saveLatestCursorSaved(dsAPIData.lastCursor);

      const numberOfPsychologists = getNumberOfPsychologists();
      console.log(`importDataFromDSToPG done: ${JSON.stringify(numberOfPsychologists)} psychologists inside PG`);
    } else {
      console.log("No psychologists to save");
    }
  } catch (err) {
    console.error("ERROR: Could not import DS API data to PG", err)
  }
}
