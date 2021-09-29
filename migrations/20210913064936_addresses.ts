import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(
    'DROP EXTENSION IF EXISTS "earthdistance"; \
    DROP EXTENSION IF EXISTS "cube";',
  );
  return knex.schema.table('psychologists', (table) => {
    table.string('otherAddress');
    table.specificType('otherLongitude', 'double precision');
    table.specificType('otherLatitude', 'double precision');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(
    'CREATE EXTENSION IF NOT EXISTS "cube"; \
     CREATE EXTENSION IF NOT EXISTS "earthdistance";',
  );
  return knex.schema.table('psychologists', (table) => {
    table.dropColumn('otherAddress');
    table.dropColumn('otherLongitude');
    table.dropColumn('otherLatitude');
  });
}
