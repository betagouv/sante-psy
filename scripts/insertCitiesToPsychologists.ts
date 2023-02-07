/* eslint-disable no-await-in-loop */

import db from '../db/db';
import { psychologistsTable } from '../db/tables';
import getAddressCoordinates from '../services/getAddressCoordinates';

const delay = (ms = 1000): Promise<void> => new Promise((resolve) => { setTimeout(resolve, ms); });

const insertCitiesToPsychologists = async (): Promise<void> => {
  console.log('Adding city and postcode to psychologists...');

  try {
    const psychologists = await db(psychologistsTable);

    const nbPsy = psychologists.length;
    for (let index = 0; index < nbPsy; index++) {
      const psy = psychologists[index];

      let coord; let
        otherCoord;
      if (psy.address) {
        // To be compliant with limitation (50 requests per second)
        // See https://geo.api.gouv.fr/faq)
        await delay(25); // 1 request every 25ms => 40 requests per second

        coord = await getAddressCoordinates(psy.address);
      }

      if (psy.otherAddress) {
        // To be compliant with limitation (50 requests per second)
        // See https://geo.api.gouv.fr/faq)
        await delay(25); // 1 request every 25ms => 40 requests per second

        otherCoord = await getAddressCoordinates(psy.otherAddress);
      }

      if (coord || otherCoord) {
        await db(psychologistsTable)
            .where({ dossierNumber: psy.dossierNumber })
            .update({
              ...(coord ? {
                city: coord.city,
                postcode: coord.postcode,
              } : {}),
              ...(otherCoord ? {
                otherCity: otherCoord.city,
                otherPostcode: otherCoord.postcode,
              } : {}),

            });
      }
    }

    console.log('Done');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

insertCitiesToPsychologists();
