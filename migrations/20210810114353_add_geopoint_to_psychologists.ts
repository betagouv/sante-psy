import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(
    'CREATE EXTENSION IF NOT EXISTS "cube"; \
     CREATE EXTENSION IF NOT EXISTS "earthdistance";',
  )
  .then(() => knex.schema.table('psychologists', (table) => {
    table.specificType('longitude', 'double precision');
    table.specificType('latitude', 'double precision');
  }));
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('psychologists', (table) => {
    table.dropColumn('longitude');
    table.dropColumn('latitude');
  })
  .then(() => knex.raw(
    'DROP EXTENSION IF EXISTS "earthdistance"; \
     DROP EXTENSION IF EXISTS "cube";',
  ));
}
