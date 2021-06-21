import axios from 'axios/index';

import { AdeliInfo } from '../types/AdeliInfo';

const client = axios.create({
  baseURL: 'https://api-sante.herokuapp.com/annuaire',
});

// Note that we add a 0 because we want a adeli number !
const getAdeliInfo = (ids: string[]) : Promise<{[key: string]: AdeliInfo}> => {
  const url = `annuaire.json?Identification+nationale+PP__in=${ids.map((id) => `0${id}`).join('%2C')}`;
  console.debug(url);
  return client.get(url).then((response) => {
    const { columns } = response.data;
    const adeliInfoByIds = {};
    response.data.rows.forEach((row) => {
      const result = {};
      row.forEach((info, index) => {
        if (info) {
          result[columns[index]] = info;
        }
      });
      adeliInfoByIds[result['Identifiant PP']] = result;
    });
    return adeliInfoByIds;
  });
};

export default {
  getAdeliInfo,
};
