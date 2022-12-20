import { Knex } from 'knex';
import { faker } from '@faker-js/faker';
import { studentsTable } from '../../db/tables';

// eslint-disable-next-line import/prefer-default-export
export const seed = async (knex: Knex): Promise<void> => {
  const students = [...Array(50).keys()].map((i) => {
    let source: string;
    let letter: boolean;
    if (i % 4 === 0) {
      source = `source-${i}`;
    }
    if (i % 3 === 0) {
      letter = faker.datatype.boolean();
    }
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - i);
    return {
      email: faker.internet.email(), source, letter, createdAt,
    };
  });

  await knex(studentsTable).insert(students);
  console.log(`inserted ${students.length} students to studentsTable`);
};
