require('dotenv').config();

const date = require('../utils/date');
const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig);
const db = require("../utils/db")

const demarchesSimplifiees = require('../utils/demarchesSimplifiees');

async function getCursorFromDB() {
  try {
    const lastCursor =  await knex(db.dsApiCursor)
    .where("id", 1)
    .first();

    console.debug(`getLatestCursorSaved: Got the latest cursor saved in PG ${JSON.stringify(lastCursor)}`);
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

/**
 * l'API DS nous retourne 100 éléments à chaque appel, et nous indique la page où l'on se trouve
 * en stockant la dernière page lue (cursor), on limite le nombre d'appel à l'API en ne lisant que
 * les pages necessaires
 * @param updateEverything : boolean, if true do not use latest cursor 
 */
async function getLatestCursorSaved(updateEverything = false) {
  if( !updateEverything ) {
    return await getCursorFromDB();
  } else {
    console.log(`Not using cursor saved inside PG due to parameter ${updateEverything}`);

    return undefined;
  }
}

/**
 * @TODO fix me 
 * 
 */
async function getNumberOfPsychologists() {
  return await knex(db.psychologists)
  .count('dossierNumber');
}


async function saveLatestCursorSaved(cursor) {
  try {
    const now = date.getDateNowPG();

    const alreadySavedCursor = await getCursorFromDB();
    return await knex.transaction( function(trx) { // add transaction in case 2 cron jobs modify this cursor
      if( alreadySavedCursor ) {
        console.log(`Updating the cursor ${cursor} in PG`);

        return trx.into(db.dsApiCursor)
        .where("id", 1)
        .update({
          "cursor": cursor,
          "updatedAt": now
        });
      } else { // no cursor already saved, we are going to create one entry
        console.log(`Saving a new cursor ${cursor} to PG`);

        return trx.into(db.dsApiCursor).insert({
          "id" : 1,
          "cursor": cursor,
          "updatedAt": now
        });
      }
    });
  } catch (err) {
    console.error(`Impossible de sauvegarder le dernier cursor ${cursor} de l'api DS`, err)
    throw new Error(`Impossible de sauvegarder le dernier cursor de l'api DS`)
  }
}

/**
 * Perform a UPSERT with https://knexjs.org/#Builder-merge
 * @param {*} psy 
 */
async function savePsychologistInPG(psyList) {
  console.log(`UPSERT of ${psyList.length} psychologists into PG....`);
  const updatedAt = date.getDateNowPG(); // use to perform UPSERT in PG

  const upsertArray = psyList.map( psy => {
    const upsertingKey = 'dossierNumber';

    return knex(db.psychologists)
    .insert(psy)
    .onConflict(upsertingKey)
    .merge({ // update every field and add updatedAt
      firstNames : psy.firstNames,
      lastName : psy.lastName,
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
 * Some data can be modified after been loaded inside PG
 * We need to re import them all from time to time using boolean @param updateEverything
 */
module.exports.importDataFromDSToPG = async function importDataFromDSToPG (updateEverything = false) {
  try {
    console.log("Starting importDataFromDSToPG...");
    const latestCursorInPG = await getLatestCursorSaved(updateEverything);

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
