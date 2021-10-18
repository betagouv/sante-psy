import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('psychologists', (table) => {
    table.text('useFirstNames');
    table.text('useLastName');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('psychologists', (table) => {
    table.dropColumn('useFirstNames');
    table.dropColumn('useLastName');
  });
}
