import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('psychologists', (table) => {
    table.date('acceptationDate');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('psychologists', (table) => {
    table.dropColumn('acceptationDate');
  });
}
