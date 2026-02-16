import { Knex } from 'knex';
import { studentsTable } from '../../db/tables';
import create from '../helper/create';

// eslint-disable-next-line import/prefer-default-export
export const seed = async (knex: Knex): Promise<void> => {
  const students = [...Array(10).keys()]
    .map((_) => create.getOneStudent());
  students.push(create.getOneStudent({ email: 'student@beta.gouv.fr' }));

  await knex(studentsTable).insert(students);
  console.log(`inserted ${students.length} students to studentsTable`);
};
