import dotenv from 'dotenv';

import ejs from 'ejs';
import dbsApiCursor from '../db/dsApiCursor';
import dbPsychologists from '../db/psychologists';
import importDossier from '../services/demarchesSimplifiees/importDossier';
import autoVerifyPsychologists from '../services/demarchesSimplifiees/autoVerify';
import autoAcceptPsychologists from '../services/demarchesSimplifiees/autoAccept';
import config from '../utils/config';
import emailUtils from '../utils/email';

dotenv.config();

/**
 * Some data can be modified after been loaded inside PG
 * We need to re import them all from time to time using boolean @param updateEverything
 */
async function importDataFromDSToPG(updateEverything = false) {
  try {
    console.log('Starting importDataFromDSToPG...');
    const latestCursorInPG = await dbsApiCursor.getLatestCursorSaved(updateEverything);

    const dsAPIData = await importDossier.getPsychologistList(latestCursorInPG);

    if (dsAPIData.psychologists.length > 0) {
      await dbPsychologists.savePsychologistInPG(dsAPIData.psychologists);
      await dbsApiCursor.saveLatestCursor(dsAPIData.lastCursor);

      const numberOfPsychologists = await dbPsychologists.countByArchivedAndState();
      console.log('psychologists inside PG :', numberOfPsychologists);
    } else {
      console.warn('No psychologists to save');
    }

    console.log('importDataFromDSToPG done');

    return true; // must return something for cron lib
  } catch (err) {
    console.error('ERROR: Could not import DS API data to PG', err);
    return false;
  }
}

const sendAlertEmail = async function sendAlertEmail(badPsychologists) {
  try {
    const html = await ejs.renderFile('./views/emails/multipleAcceptedAlert.ejs', {
      badPsychologists,
      hostnameWithProtocol: config.hostnameWithProtocol,
    });
    await emailUtils.sendMail(config.teamEmail, 'Dossiers multiples détéctés !', html);
    console.debug('Email sent for multiple accounts alert');
  } catch (err) {
    console.error("Erreur d'envoi de mail, le mail d'alerte n'est pas envoyé.", err);
  }
};

// One person should not have multiple dossiers in "acepte" status, notify the team.
const checkForMultipleAcceptedDossiers = async (): Promise<boolean> => {
  const count = await dbPsychologists.countAcceptedByPersonalEmail();
  const badPsychologists = count.filter((statsPoint) => statsPoint.count > 1);
  if (badPsychologists.length > 0) {
    console.log('Detected psychologists with multiple accepted dossiers!', badPsychologists);
    await sendAlertEmail(badPsychologists);
  }

  return true;
};

export default {
  importEveryDataFromDSToPG: async (): Promise<boolean> => importDataFromDSToPG(true),
  importLatestDataFromDSToPG: async (): Promise<boolean> => importDataFromDSToPG(false),
  checkForMultipleAcceptedDossiers,
  autoAcceptPsychologists: async (): Promise<void> => autoAcceptPsychologists(),
  autoVerifyPsychologists: async (): Promise<void> => autoVerifyPsychologists(),
};
