import { Knex } from 'knex';
import { faker } from '@faker-js/faker';
import { studentsTable } from '../../db/tables';
import uuid from '../../utils/uuid';

// eslint-disable-next-line import/prefer-default-export
export const seed = async (knex: Knex): Promise<void> => {
  const students = [...Array(10).keys()].map((i) => {
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - i);
    return {
      id: uuid.generateRandom(),
      email: faker.internet.email(),
      ine: faker.phone.number('###########'),
      firstNames: faker.name.firstName(),
      lastName: faker.name.lastName(),
      dateOfBirth: faker.date.past(),
      createdAt,
    };
  });

  await knex(studentsTable).insert(students);
  console.log(`inserted ${students.length} students to studentsTable`);
};
