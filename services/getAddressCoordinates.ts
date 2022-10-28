import axios from 'axios';
import { Coordinates, CoordinatesAPI } from '../types/Coordinates';
import config from '../utils/config';

const ADDRESS_DELIMITER = ';';

const getAddressCoordinates = async (address: string): Promise<Coordinates> => {
  if (config.testEnvironment) {
    console.log('Request to api-adresse.data.gouv.fr bypassed because you are using a test environment');
    return Promise.resolve(null);
  }

  const firstAddress = address.split(ADDRESS_DELIMITER)[0];
  const url = encodeURI(`https://api-adresse.data.gouv.fr/search/?q=${firstAddress}&limit=1`);
  const response = await axios.get<CoordinatesAPI>(url)
    .catch((error) => {
      console.log('error', error);
    });

  if (response && response.data.features && response.data.features.length > 0) {
    const feature = response.data.features[0];
    const [longitude, latitude] = feature.geometry.coordinates;
    const { score, label } = feature.properties;
    console.debug(`"${firstAddress}" ; "${label}" ; "${score}"`);

    if (score > config.minScoreAddress) {
      return Promise.resolve({
        longitude,
        latitude,
      });
    }
    // Insufficient score
    return Promise.resolve(null);
  }
  // Not found
  console.debug(`"${firstAddress}" ; "" ; "0"`);
  return Promise.resolve(null);
};

export default getAddressCoordinates;
