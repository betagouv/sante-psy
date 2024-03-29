/* eslint-disable no-await-in-loop */

import db from '../db/db';
import { psychologistsTable } from '../db/tables';
import getAddressCoordinates from '../services/getAddressCoordinates';

const delay = (ms = 1000): Promise<void> => new Promise((resolve) => { setTimeout(resolve, ms); });

const insertCoordinatesToPsychologists = async (): Promise<void> => {
  console.log('Adding coordinates to psychologists without location...');

  try {
    const allPsyWithoutCoordinates = await db(psychologistsTable)
      .whereNull('longitude')
      .orWhereNull('latitude');

    const nbPsy = allPsyWithoutCoordinates.length;
    for (let index = 0; index < nbPsy; index++) {
      const psy = allPsyWithoutCoordinates[index];

      if (psy.address) {
        // To be compliant with limitation (50 requests per second)
        // See https://geo.api.gouv.fr/faq)
        await delay(25); // 1 request every 25ms => 40 requests per second

        const coord = await getAddressCoordinates(psy.address);

        if (coord) {
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
