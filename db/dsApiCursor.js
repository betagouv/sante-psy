const knexConfig = require("../knexfile")
const knex = require("knex")(knexConfig)

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