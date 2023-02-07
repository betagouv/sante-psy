import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('psychologists', (table) => {
    table.string('city');
    table.string('otherCity');
    table.string('postcode');
    table.string('otherPostcode');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('psychologists', (table) => {
    table.dropColumn('city');
    table.dropColumn('otherCity');
    table.dropColumn('postcode');
    table.dropColumn('otherPostcode');
  });
}
