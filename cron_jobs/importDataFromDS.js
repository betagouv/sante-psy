require('dotenv').config();

const dbDsApiCursor = require("../db/dsApiCursor")
const dbPsychologists = require("../db/psychologists")
const demarchesSimplifiees = require('../utils/demarchesSimplifiees');

/**
 * Some data can be modified after been loaded inside PG
 * We need to re import them all from time to time using boolean @param updateEverything
 */
module.exports.importDataFromDSToPG = async function importDataFromDSToPG (updateEverything = false) {
  try {
    console.log("Starting importDataFromDSToPG...");
    const latestCursorInPG = await dbDsApiCursor.getLatestCursorSaved(updateEverything);

    const dsAPIData = await demarchesSimplifiees.getPsychologistList(latestCursorInPG);

    if(dsAPIData.psychologists.length > 0) {
      await dbPsychologists.savePsychologistInPG(dsAPIData.psychologists);
      await dbDsApiCursor.saveLatestCursor(dsAPIData.lastCursor);

      const numberOfPsychologists = dbPsychologists.getNumberOfPsychologists();
      console.log(`importDataFromDSToPG done: ${JSON.stringify(numberOfPsychologists)} psychologists inside PG`);
    } else {
      console.warn("No psychologists to save");
    }
  } catch (err) {
    console.error("ERROR: Could not import DS API data to PG", err)
  }
}
