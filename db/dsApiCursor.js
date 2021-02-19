const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig);
const date = require("../utils/date");

module.exports.dsApiCursorTable = "ds_api_cursor";

module.exports.getCursorFromDB = async function getCursorFromDB() {
  try {
    const lastCursor =  await knex(module.exports.dsApiCursorTable)
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
module.exports.getLatestCursorSaved = async function getLatestCursorSaved(updateEverything = false) {
  if( !updateEverything ) {
    return await this.getCursorFromDB();
  } else {
    console.log(`Not using cursor saved inside PG due to parameter ${updateEverything}`);

    return undefined;
  }
}

module.exports.saveLatestCursor = async function saveLatestCursor(cursor) {
  try {
    const now = date.getDateNowPG();

    const alreadySavedCursor = await this.getCursorFromDB();
    // eslint-disable-next-line func-names
    return await knex.transaction( function(trx) { // add transaction in case 2 cron jobs modify this cursor
      if( alreadySavedCursor ) {
        console.log(`Updating the cursor ${cursor} in PG`);

        return trx.into(module.exports.dsApiCursorTable)
        .where("id", 1)
        .update({
          "cursor": cursor,
          "updatedAt": now
        });
      } else { // no cursor already saved, we are going to create one entry
        console.log(`Saving a new cursor ${cursor} to PG`);

        return trx.into(module.exports.dsApiCursorTable).insert({
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