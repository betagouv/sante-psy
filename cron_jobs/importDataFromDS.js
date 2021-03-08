require('dotenv').config();

const dbsApiCursor = require("../db/dsApiCursor")
const dbPsychologists = require("../db/psychologists")
const demarchesSimplifiees = require('../utils/demarchesSimplifiees');
const config = require('../utils/config')
const ejs = require('ejs');
const emailUtils = require('../utils/email');

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

  await checkForMultipleAcceptedDossiers()
}

// One person should not have multiple dossiers in "acepte" status, notify the team.
const checkForMultipleAcceptedDossiers = async () => {
  const count = await dbPsychologists.countAcceptedPsychologistsByPersonalEmail()
  const badPsychologists = count.filter(statsPoint => {
    if (statsPoint.count > 1) {
      console.log(statsPoint)
      return true
    }
  })
  if (badPsychologists.length > 0) {
    console.log('Detected psychologists with multiple accepted dossiers!', badPsychologists)
    await sendAlertEmail(badPsychologists)
  }
}
module.exports.checkForMultipleAcceptedDossiers = checkForMultipleAcceptedDossiers

const sendAlertEmail = async function sendAlertEmail(badPsychologists) {
  try {
    const html = await ejs.renderFile('./views/emails/multipleAcceptedAlert.ejs', {
      badPsychologists,
      hostnameWithProtocol: config.hostnameWithProtocol,
    });
    await emailUtils.sendMail(config.teamEmail, `Dossiers multiples détéctés !`, html);
    console.log('Email sent.')
  } catch (err) {
    console.error("Erreur d'envoi de mail, le mail d'alerte n'est pas envoyé.", err);
  }
}
