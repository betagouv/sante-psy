import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('psychologists', (table) => {
    table.boolean('hasSeenTutorial');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('psychologists', (table) => {
    table.dropColumn('hasSeenTutorial');
  });
}
