import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('psychologists', (table) => {
    table.text('title');
    table.text('diplomaYear');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('psychologists', (table) => {
    table.dropColumn('title');
    table.dropColumn('diplomaYear');
  });
}
