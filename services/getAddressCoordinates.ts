import axios from 'axios/index';
import { Coordinates } from '../types/Coordinates';
import config from '../utils/config';

const getAddressCoordinates = async (address: string): Promise<Coordinates|void> => {
  if (config.testEnvironment) {
    console.log('Request to api-adresse.data.gouv.fr bypassed because you are using a test environment');
    return Promise.resolve();
  }

  const MIN_SCORE = 0.55;

  const url = encodeURI(`https://api-adresse.data.gouv.fr/search/?q=${address}&limit=1`);
  const response = await axios.get(url)
    .catch((error) => {
      console.log('error', error);
    });

  if (response && response.data.features && response.data.features.length > 0) {
    const feature = response.data.features[0];
    const longitude = feature.geometry.coordinates[0];
    const latitude = feature.geometry.coordinates[1];
    const { score } = feature.properties;
    const { label } = feature.properties;
    console.debug(`"${address}" ; "${label}" ; "${score}"`);

    if (score > MIN_SCORE) {
      return Promise.resolve({
        longitude,
        latitude,
      });
    }
    // Insufficient score
    return Promise.resolve();
  }
  // Not found
  console.debug(`"${address}" ; "" ; "0"`);
  return Promise.resolve();
};

export default getAddressCoordinates;
