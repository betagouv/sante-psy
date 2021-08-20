/* eslint-disable no-await-in-loop */

import db from '../db/db';
import { psychologistsTable } from '../db/tables';
import getAddrCoordinates from '../services/getAddrCoordinates';

const delay = (ms = 1000) : Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const insertCoordinatesToPsychologists = async (): Promise<void> => {
  console.log('Adding location coordinates to all psychologists...');

  try {
    const allPsy = await db(psychologistsTable);

    for (let index = 0; index < allPsy.length; index++) {
      const psy = allPsy[index];

      if (psy.address) {
        // To be compliant with limitation (50 requests per second)
        // See https://geo.api.gouv.fr/faq)
        await delay(25); // 1 request every 25ms => 40 requests per second

        const coord = await getAddrCoordinates(psy.address);

        if (coord && coord.longitude && coord.latitude) {
          await db(psychologistsTable)
            .where({ dossierNumber: psy.dossierNumber })
            .update({
              longitude: coord.longitude,
              latitude: coord.latitude,
            });
        }
      }
    }

    console.log('Done');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

insertCoordinatesToPsychologists();
