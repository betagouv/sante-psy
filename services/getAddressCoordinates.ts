import axios from 'axios';
import { Coordinates, CoordinatesAPI } from '../types/Coordinates';
import config from '../utils/config';

const ADDRESS_DELIMITER = ';';

const getAddressCoordinates = async (address: string): Promise<Coordinates> => {
  const firstAddress = address.split(ADDRESS_DELIMITER)[0];

  if (!firstAddress || firstAddress.length < 3) {
    console.warn('Address too short:', firstAddress);
    return null;
  }

  const url = encodeURI(`https://api-adresse.data.gouv.fr/search/?q=${firstAddress}&limit=1`);

  try {
    const response = await axios.get<CoordinatesAPI>(url, { timeout: 10000 });

    if (response?.data?.features?.length > 0) {
      const feature = response.data.features[0];
      const [longitude, latitude] = feature.geometry.coordinates;
      const {
        score, postcode, city,
      } = feature.properties;

      if (score > config.minScoreAddress) {
        return {
          longitude,
          latitude,
          postcode,
          city,
        };
      }
    }

    return null;
  } catch (error) {
    console.error('[GetAddressCoordinates Error]');
    console.error('URL:', url);

    if (axios.isAxiosError(error)) {
      console.error('Is AxiosError:', true);
      console.error('Message:', error.message);

      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Status Text:', error.response.statusText);
        console.error('Headers:', error.response.headers);
        console.error('Response data:', error.response.data);
      } else if (error.request) {
        console.error('No response received from server.');
      } else {
        console.error('Error setting up the request:', error.message);
      }
    } else {
      console.error('Unknown error:', error);
    }

    return null;
  }
};

export default getAddressCoordinates;
