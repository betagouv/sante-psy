import axios from 'axios/index';

import { AdeliAPI, AdeliInfo } from '../types/AdeliInfo';

const client = axios.create({
  baseURL: 'https://api-annuaire-sante.herokuapp.com/annuaire',
});

const cleanId = (id: string): string => id.replace(/ /g, '');

const preprocessIds = (ids: string[]) : string[] => ids.map(cleanId)
  .filter((id) => id.match(/^\d{9}$/))
  // Note that we add a 0 because we want a adeli number !
  .map((id) => `0${id}`);

const getAdeliInfo = (ids: string[]) : Promise<{[key: string]: AdeliInfo}> => {
  const validIds = preprocessIds(ids);
  const url = `annuaire.json?Identification+nationale+PP__in=${validIds.join('%2C')}`;
  console.debug(url);
  return client.get<AdeliAPI>(url).then((response) => {
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
  cleanId,
  getAdeliInfo,
  preprocessIds,
};
