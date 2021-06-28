import clean from '../helper/clean';

import uuid from '../../utils/uuid';
import universities from '../../utils/universities';
import {
  universitiesTable,
} from '../../db/tables';
import { Knex } from 'knex';

// eslint-disable-next-line import/prefer-default-export
export const seed = async (knex: Knex): Promise<void> => {
  const universitiesList = universities.map((uni) => ({
    name: uni,
    id: uuid.generateUuidFromString(`university-${uni}`),
    emailUniversity: `${clean.getRandomInt()}@beta.gouv.fr ; ${clean.getRandomInt()}@beta.gouv.fr`,
    emailSSU: `${clean.getRandomInt()}@beta.gouv.fr ; ${clean.getRandomInt()}@beta.gouv.fr`,
  }));

  await knex(universitiesTable).insert(universitiesList);
  console.log(`inserted ${universitiesList.length} fake univerisities to universitiesTable`);
};
