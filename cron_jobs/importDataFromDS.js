require('dotenv').config();

const dbsApiCursor = require("../db/dsApiCursor")
const dbPsychologists = require("../db/psychologists")
const dbUsers = require("../db/users")
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

  await module.exports.updateUsersFromPsychologists()
}

module.exports.updateUsersFromPsychologists = async () => {
  console.log('Upsert users')

  let psychologists
  try {
    psychologists = await dbPsychologists.getPsychologists()
    console.log('Got', psychologists.length, 'psychologists')
  } catch (err) {
    console.error('Could not get psychologists. Aborting users upsert.', err)
    return
  }

  // eslint-disable-next-line guard-for-in
  for (const psychologist of psychologists) {
    console.log('---', psychologist.personalEmail)
    if (psychologist.state !== 'accepte') {
      console.log('not accepted', psychologist.state)
      return
    }
    try {
      const user = await dbUsers.insertUser(psychologist.personalEmail, psychologist.dossierNumber)
      console.log('inserted user', user.id)
    } catch (err) {
      console.log('Could not insert user for psychologist', psychologist.dossierNumber, psychologist.personalEmail)
      // todo no logging personal email
      // todo throw ? email ?
    }
  }

  // todo upsert
  console.log('Done inserting users')
  const userCount = await dbUsers.getNumberOfUsers() // todo errors
  console.log('Inserted', userCount, 'users')
}
