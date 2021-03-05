require('dotenv').config();

const dbsApiCursor = require("../db/dsApiCursor")
const dbPsychologists = require("../db/psychologists")
const demarchesSimplifiees = require('../utils/demarchesSimplifiees');

/**
 * Some data can be modified after been loaded inside PG
 * We need to re import them all from time to time using boolean @param updateEverything
 */
module.exports.importDataFromDSToPG = async function importDataFromDSToPG (updateEverything = false) {
  try {
    console.log("Starting importDataFromDSToPG...");
    const latestCursorInPG = await dbsApiCursor.getLatestCursorSaved(updateEverything);

    const dsAPIData = await demarchesSimplifiees.getPsychologistList(latestCursorInPG);

    if(dsAPIData.psychologists.length > 0) {
      await dbPsychologists.savePsychologistInPG(dsAPIData.psychologists);
      await dbsApiCursor.saveLatestCursor(dsAPIData.lastCursor);

      const numberOfPsychologists = await dbPsychologists.getNumberOfPsychologists();
      console.log(`importDataFromDSToPG done - psychologists inside PG :`, numberOfPsychologists);
    } else {
      console.warn("No psychologists to save");
    }
  } catch (err) {
    console.error("ERROR: Could not import DS API data to PG", err)
  }
}

// One person should not have multiple dossiers in "acepte" status, notify the team.
module.exports.countAcceptedPsychologistsByPersonalEmail = async () => {
  const count = await dbPsychologists.countPsychologistsByPersonalEmail()
  count.forEach(statsPoint => {
    if (statsPoint.count > 1) {
      console.log(statsPoint)
      // todo email us
    }
  })
}
