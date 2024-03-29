import create from '../helper/create';

import universities from '../../utils/universities';
import { universitiesTable } from '../../db/tables';
import { Knex } from 'knex';

// eslint-disable-next-line import/prefer-default-export
export const seed = async (knex: Knex): Promise<void> => {
  const universitiesList = universities.map((uni) => create.getOneUniversity(uni));
  await knex(universitiesTable).insert(universitiesList);
  console.log(`inserted ${universitiesList.length} fake univerisities to universitiesTable`);
};
