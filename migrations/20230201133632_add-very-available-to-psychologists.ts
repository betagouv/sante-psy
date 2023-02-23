import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('psychologists', (table) => {
    table.boolean('isVeryAvailable').defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('psychologists', (table) => {
    table.dropColumn('isVeryAvailable');
  });
}
