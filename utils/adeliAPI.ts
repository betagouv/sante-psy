import axios from 'axios/index';

import { AdeliInfo } from '../types/AdeliInfo';

const client = axios.create({
  baseURL: 'https://api-sante.herokuapp.com/annuaire',
});

const preprocessIds = (ids: string[]) : string[] => ids.map((id) => id.replace(/ /g, ''))
  .filter((id) => id.match(/^\d{9}$/))
  .map((id) => `0${id}`);

// Note that we add a 0 because we want a adeli number !
const getAdeliInfo = (ids: string[]) : Promise<{[key: string]: AdeliInfo}> => {
  const validIds = preprocessIds(ids);
  const url = `annuaire.json?Identification+nationale+PP__in=${validIds.join('%2C')}`;
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

export {
  getAdeliInfo,
  preprocessIds,
};
