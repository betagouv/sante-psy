import axios from 'axios/index';
import db from '../db/db';
import { psychologistsTable } from '../db/tables';
import { Psychologist } from '../types/Psychologist';

const sleep = (ms: number) : Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const insertCoordinatesToPsychologists = async (): Promise<void> => {
  console.log('Adding location coordinates to all psychologists...');

  try {
    let locationFound = 0;
    const allPsy = await db(psychologistsTable);

    const promises = allPsy.map(async (psy : Psychologist) => {
      // To be compliant with [Usage policy](https://operations.osmfoundation.org/policies/nominatim/)
      await sleep(2000); // FIXME: this doesn't work to avoid multiple queries on same second!

      // TODO: move coordinates retrieval on a dedicated service
      const url = encodeURI(`https://nominatim.openstreetmap.org/search?q=${psy.address}&format=json&limit=1`);
      console.debug('url', url);

      const response = await axios.get(url)
        .catch((error) => {
          console.log('error', error);
          return Promise.reject(error);
        });

      // FIXME: response.data always empty even if the browser displays results (am I banned?)
      if (response.data.length > 0) {
        locationFound++;
        console.debug('Update', psy.dossierNumber, 'with', response.data[0].lon, response.data[0].lat);
        return db(psychologistsTable)
          .where({ dossierNumber: psy.dossierNumber })
          .update({
            longitude: response.data[0].lon,
            latitude: response.data[0].lat,
          });
      }

      console.debug('Not found');
      return Promise.resolve(0);
    });

    await Promise.all(promises);

    console.log('DONE:', locationFound, 'psy locations found over', allPsy.length);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

insertCoordinatesToPsychologists();
