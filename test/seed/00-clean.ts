import { Knex } from 'knex';
import {
  appointmentsTable,
  loginTokenTable,
  patientsTable,
  psychologistsTable,
  universitiesTable,
  suspensionReasonsTable,
  lastConnectionsTable,
} from '../../db/tables';

// eslint-disable-next-line import/prefer-default-export
export const seed = async (knex: Knex): Promise<void> => {
  console.log('Clean database information');

  await knex(lastConnectionsTable).del();
  await knex(suspensionReasonsTable).del();
  await knex(loginTokenTable).del();
  await knex(appointmentsTable).del();
  await knex(patientsTable).del();
  await knex(psychologistsTable).del();
  await knex(universitiesTable).del();
};
