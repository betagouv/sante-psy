import { Knex } from 'knex';
import {
  appointmentsTable,
  psyLoginTokenTable,
  studentsLoginTokenTable,
  patientsTable,
  psychologistsTable,
  universitiesTable,
  suspensionReasonsTable,
  lastConnectionsTable,
  studentsNewsletterTable,
} from '../../db/tables';

// eslint-disable-next-line import/prefer-default-export
export const seed = async (knex: Knex): Promise<void> => {
  console.log('Clean database information');

  await knex(lastConnectionsTable).del();
  await knex(suspensionReasonsTable).del();
  await knex(psyLoginTokenTable).del();
  await knex(studentsLoginTokenTable).del();
  await knex(appointmentsTable).del();
  await knex(patientsTable).del();
  await knex(psychologistsTable).del();
  await knex(universitiesTable).del();
  await knex(studentsNewsletterTable).del();
};
