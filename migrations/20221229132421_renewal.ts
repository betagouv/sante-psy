import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('patients', (table) => {
    table.boolean('renewed');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('patients', (table) => {
    table.dropColumn('renewed');
  });
}
